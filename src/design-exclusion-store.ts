import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

const EXCLUSION_SCHEMA = 'secret-mcp/design-exclusions/v1';
const REFERENCE_ID_PATTERN = /^gdweb-(\d+)$/;

export interface DesignExclusion {
  referenceId: string;
  strNo: string;
  title: string;
  gdwebUrl: string;
  reason: string;
  createdAt: string;
  sourceRunId?: string;
}

export interface AddDesignExclusionInput {
  referenceId: string;
  title: string;
  gdwebUrl: string;
  reason?: string;
  sourceRunId?: string;
}

interface DesignExclusionManifest {
  schema: typeof EXCLUSION_SCHEMA;
  updatedAt: string;
  items: DesignExclusion[];
}

export class DesignExclusionStore {
  readonly filePath: string;

  constructor(private readonly outputDirectory: string) {
    this.filePath = path.join(
      outputDirectory,
      '.secret-mcp',
      'exclusions.json'
    );
  }

  async list(): Promise<DesignExclusion[]> {
    const manifest = await this.read();
    return [...manifest.items].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt)
    );
  }

  async getExcludedStrNos(): Promise<Set<string>> {
    return new Set((await this.list()).map(item => item.strNo));
  }

  async add(input: AddDesignExclusionInput): Promise<DesignExclusion> {
    const strNo = this.getStrNo(input.referenceId);
    const manifest = await this.read();
    const existing = manifest.items.find(
      item => item.referenceId === input.referenceId
    );
    const item: DesignExclusion = {
      referenceId: input.referenceId,
      strNo,
      title: input.title.trim() || input.referenceId,
      gdwebUrl: input.gdwebUrl.trim(),
      reason: input.reason?.trim() || '웹 뷰어에서 수동 제외',
      createdAt: existing?.createdAt ?? new Date().toISOString(),
      sourceRunId: input.sourceRunId?.trim() || existing?.sourceRunId,
    };

    manifest.items = [
      item,
      ...manifest.items.filter(
        candidate => candidate.referenceId !== item.referenceId
      ),
    ];
    await this.write(manifest);
    return item;
  }

  async remove(referenceId: string): Promise<boolean> {
    this.getStrNo(referenceId);
    const manifest = await this.read();
    const nextItems = manifest.items.filter(
      item => item.referenceId !== referenceId
    );
    if (nextItems.length === manifest.items.length) return false;

    manifest.items = nextItems;
    await this.write(manifest);
    return true;
  }

  private async read(): Promise<DesignExclusionManifest> {
    try {
      const source = await readFile(this.filePath, 'utf8');
      const parsed = JSON.parse(source) as Partial<DesignExclusionManifest>;
      if (parsed.schema !== EXCLUSION_SCHEMA || !Array.isArray(parsed.items)) {
        throw new Error('Invalid design exclusion manifest');
      }

      return {
        schema: EXCLUSION_SCHEMA,
        updatedAt: parsed.updatedAt ?? new Date(0).toISOString(),
        items: parsed.items
          .map(item => this.normalizeItem(item))
          .filter((item): item is DesignExclusion => item !== null),
      };
    } catch (error) {
      if (this.isMissingFile(error)) {
        return {
          schema: EXCLUSION_SCHEMA,
          updatedAt: new Date(0).toISOString(),
          items: [],
        };
      }
      throw error;
    }
  }

  private async write(manifest: DesignExclusionManifest): Promise<void> {
    const directory = path.dirname(this.filePath);
    const temporaryPath =
      `${this.filePath}.${process.pid}.${randomUUID().slice(0, 8)}.tmp`;
    manifest.updatedAt = new Date().toISOString();
    await mkdir(directory, { recursive: true });
    await writeFile(
      temporaryPath,
      `${JSON.stringify(manifest, null, 2)}\n`,
      'utf8'
    );
    await rename(temporaryPath, this.filePath);
  }

  private getStrNo(referenceId: string): string {
    const match = referenceId.match(REFERENCE_ID_PATTERN);
    if (!match) {
      throw new Error('Reference ID must match gdweb-<number>');
    }
    return match[1];
  }

  private normalizeItem(value: unknown): DesignExclusion | null {
    if (!value || typeof value !== 'object') return null;
    const item = value as Record<string, unknown>;
    if (
      typeof item.referenceId !== 'string' ||
      typeof item.title !== 'string' ||
      typeof item.gdwebUrl !== 'string' ||
      typeof item.reason !== 'string' ||
      typeof item.createdAt !== 'string'
    ) {
      return null;
    }
    const match = item.referenceId.match(REFERENCE_ID_PATTERN);
    if (!match) return null;

    return {
      referenceId: item.referenceId,
      strNo: match[1],
      title: item.title,
      gdwebUrl: item.gdwebUrl,
      reason: item.reason,
      createdAt: item.createdAt,
      sourceRunId:
        typeof item.sourceRunId === 'string' ? item.sourceRunId : undefined,
    };
  }

  private isMissingFile(error: unknown): boolean {
    return (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      (error as { code?: string }).code === 'ENOENT'
    );
  }
}
