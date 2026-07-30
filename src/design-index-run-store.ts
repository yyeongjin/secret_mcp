import { mkdir, rename, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { DesignExclusion } from './design-exclusion-store.js';
import { GdwebDesignResult } from './gdweb-design-search.js';
import {
  GdwebSampledColor,
  GdwebSamplingImage,
} from './gdweb-sampling-images.js';

export type DesignIndexRunStatus =
  | 'searching'
  | 'processing'
  | 'completed'
  | 'completed_with_errors'
  | 'failed';

export type DesignIndexItemStatus =
  | 'queued'
  | 'loading_evidence'
  | 'preparing_images'
  | 'sampling'
  | 'writing'
  | 'generated'
  | 'failed';

export interface DesignIndexRunEvent {
  at: string;
  code: string;
  referenceId?: string;
  detail?: string;
}

export interface DesignIndexEvidenceRecord {
  sourceKind: 'desktop' | 'mobile';
  part: number;
  totalParts: number;
  width: number;
  height: number;
  byteLength: number;
  sourceUrl: string;
  relativePath: string;
  sourceWidth: number;
  sourceHeight: number;
  preparedCanvasWidth: number;
  preparedCanvasHeight: number;
  scaleX: number;
  scaleY: number;
  cropLeft: number;
  cropTop: number;
  sourceCropLeft: number;
  sourceCropTop: number;
  sourceCropWidth: number;
  sourceCropHeight: number;
  representativeColors: GdwebSampledColor[];
}

export interface DesignIndexRunItem {
  referenceId: string;
  title: string;
  gdwebUrl: string;
  registeredDate: string;
  award: string;
  concept: string;
  primaryColor: string;
  productionCompany: string;
  status: DesignIndexItemStatus;
  model?: string;
  contractPath?: string;
  documentPath?: string;
  evidence: DesignIndexEvidenceRecord[];
  error?: string;
  startedAt?: string;
  completedAt?: string;
}

export interface DesignIndexRunManifest {
  schema: 'secret-mcp/design-index-run/v1';
  runId: string;
  query: string;
  language: string;
  requestedLimit: number;
  targetYear: number;
  allowedYears: number[];
  awardOnly: boolean;
  outputDirectory: string;
  runDirectory: string;
  status: DesignIndexRunStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  total: number;
  generated: number;
  failed: number;
  isolation: {
    strategy: 'one-result-per-sampling-request';
    includeContext: 'none';
  };
  exclusions: {
    activeAtStart: DesignExclusion[];
  };
  items: DesignIndexRunItem[];
  events: DesignIndexRunEvent[];
}

interface CreateRunOptions {
  query: string;
  language: string;
  requestedLimit: number;
  targetYear: number;
  includePreviousYear: boolean;
  awardOnly: boolean;
  outputDirectory: string;
  exclusions: DesignExclusion[];
}

export class DesignIndexRunStore {
  readonly manifestPath: string;
  private readonly contractsDirectory: string;
  private readonly documentsDirectory: string;
  private readonly evidenceDirectory: string;

  private constructor(
    readonly runDirectory: string,
    private readonly manifest: DesignIndexRunManifest
  ) {
    this.manifestPath = path.join(runDirectory, 'run.json');
    this.contractsDirectory = path.join(runDirectory, 'contracts');
    this.documentsDirectory = path.join(runDirectory, 'documents');
    this.evidenceDirectory = path.join(runDirectory, 'evidence');
  }

  static async create(options: CreateRunOptions): Promise<DesignIndexRunStore> {
    const createdAt = new Date().toISOString();
    const runId = `${createdAt.replace(/[:.]/g, '-')}-${randomUUID().slice(0, 8)}`;
    const runDirectory = path.join(
      options.outputDirectory,
      '.secret-mcp-runs',
      runId
    );
    const targetYear = options.targetYear;
    const manifest: DesignIndexRunManifest = {
      schema: 'secret-mcp/design-index-run/v1',
      runId,
      query: options.query,
      language: options.language,
      requestedLimit: options.requestedLimit,
      targetYear,
      allowedYears: options.includePreviousYear
        ? [targetYear, targetYear - 1]
        : [targetYear],
      awardOnly: options.awardOnly,
      outputDirectory: options.outputDirectory,
      runDirectory,
      status: 'searching',
      createdAt,
      updatedAt: createdAt,
      total: 0,
      generated: 0,
      failed: 0,
      isolation: {
        strategy: 'one-result-per-sampling-request',
        includeContext: 'none',
      },
      exclusions: {
        activeAtStart: options.exclusions,
      },
      items: [],
      events: [{ at: createdAt, code: 'run.created' }],
    };
    if (options.exclusions.length > 0) {
      manifest.events.push({
        at: createdAt,
        code: 'search.exclusions.applied',
        detail: options.exclusions.map(item => item.referenceId).join(', '),
      });
    }
    const store = new DesignIndexRunStore(runDirectory, manifest);

    await Promise.all([
      mkdir(store.contractsDirectory, { recursive: true }),
      mkdir(store.documentsDirectory, { recursive: true }),
      mkdir(store.evidenceDirectory, { recursive: true }),
    ]);
    await store.flush();
    return store;
  }

  get runId(): string {
    return this.manifest.runId;
  }

  async setSearchResults(designs: GdwebDesignResult[]): Promise<void> {
    this.manifest.status = 'processing';
    this.manifest.total = designs.length;
    this.manifest.items = designs.map(design => ({
      referenceId: `gdweb-${design.strNo}`,
      title: design.title,
      gdwebUrl: design.gdwebUrl,
      registeredDate: design.registeredDate,
      award: design.award,
      concept: design.concept,
      primaryColor: design.primaryColor,
      productionCompany: design.productionCompany,
      status: 'queued',
      evidence: [],
    }));
    this.addEvent('search.completed', undefined, String(designs.length));
    await this.flush();
  }

  async updateItem(
    referenceId: string,
    patch: Partial<DesignIndexRunItem>,
    eventCode: string,
    detail?: string
  ): Promise<void> {
    const item = this.getItem(referenceId);
    Object.assign(item, patch);
    this.recount();
    this.addEvent(eventCode, referenceId, detail);
    await this.flush();
  }

  async saveContract(referenceId: string, contract: string): Promise<string> {
    const relativePath = path.join('contracts', `${referenceId}.md`);
    await writeFile(path.join(this.runDirectory, relativePath), `${contract}\n`, 'utf8');
    return relativePath;
  }

  async saveEvidence(
    referenceId: string,
    images: GdwebSamplingImage[]
  ): Promise<DesignIndexEvidenceRecord[]> {
    const records: DesignIndexEvidenceRecord[] = [];

    for (const image of images) {
      const part = String(image.part).padStart(2, '0');
      const total = String(image.totalParts).padStart(2, '0');
      const filename = `${referenceId}_${image.sourceKind}_${part}-of-${total}.jpg`;
      const relativePath = path.join('evidence', filename);
      await writeFile(
        path.join(this.runDirectory, relativePath),
        Buffer.from(image.data, 'base64')
      );
      records.push({
        sourceKind: image.sourceKind,
        part: image.part,
        totalParts: image.totalParts,
        width: image.width,
        height: image.height,
        byteLength: image.byteLength,
        sourceUrl: image.sourceUrl,
        relativePath,
        sourceWidth: image.sourceWidth,
        sourceHeight: image.sourceHeight,
        preparedCanvasWidth: image.preparedCanvasWidth,
        preparedCanvasHeight: image.preparedCanvasHeight,
        scaleX: image.scaleX,
        scaleY: image.scaleY,
        cropLeft: image.cropLeft,
        cropTop: image.cropTop,
        sourceCropLeft: image.sourceCropLeft,
        sourceCropTop: image.sourceCropTop,
        sourceCropWidth: image.sourceCropWidth,
        sourceCropHeight: image.sourceCropHeight,
        representativeColors: image.representativeColors,
      });
    }

    return records;
  }

  async saveDocument(referenceId: string, markdown: string): Promise<string> {
    const relativePath = path.join(
      'documents',
      `DESIGN_INDEX_${referenceId}.md`
    );
    await writeFile(path.join(this.runDirectory, relativePath), `${markdown}\n`, 'utf8');
    return relativePath;
  }

  async complete(): Promise<void> {
    const completedAt = new Date().toISOString();
    this.recount();
    this.manifest.status =
      this.manifest.failed > 0 ? 'completed_with_errors' : 'completed';
    this.manifest.completedAt = completedAt;
    this.addEvent('run.completed');
    await this.flush();
  }

  async fail(error: string): Promise<void> {
    this.manifest.status = 'failed';
    this.manifest.completedAt = new Date().toISOString();
    this.addEvent('run.failed', undefined, error);
    await this.flush();
  }

  private getItem(referenceId: string): DesignIndexRunItem {
    const item = this.manifest.items.find(candidate =>
      candidate.referenceId === referenceId
    );
    if (!item) {
      throw new Error(`Unknown design-index reference: ${referenceId}`);
    }
    return item;
  }

  private recount(): void {
    this.manifest.generated = this.manifest.items.filter(
      item => item.status === 'generated'
    ).length;
    this.manifest.failed = this.manifest.items.filter(
      item => item.status === 'failed'
    ).length;
  }

  private addEvent(code: string, referenceId?: string, detail?: string): void {
    this.manifest.events.push({
      at: new Date().toISOString(),
      code,
      referenceId,
      detail,
    });
  }

  private async flush(): Promise<void> {
    this.manifest.updatedAt = new Date().toISOString();
    const temporaryPath = `${this.manifestPath}.tmp`;
    await writeFile(
      temporaryPath,
      `${JSON.stringify(this.manifest, null, 2)}\n`,
      'utf8'
    );
    await rename(temporaryPath, this.manifestPath);
  }
}
