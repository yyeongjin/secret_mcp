import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import {
  GdwebDesignReference,
  GdwebDesignSearch,
  GdwebDesignSearchOptions,
} from './gdweb-design-search.js';
import { buildDesignSpecContract } from './design-spec-contract.js';

export interface GdwebDesignIndexGenerationOptions extends GdwebDesignSearchOptions {
  language: string;
  outputDirectory?: string;
  maxTokens: number;
}

export interface GdwebDesignIndexSampleRequest {
  reference: GdwebDesignReference;
  contract: string;
  language: string;
  maxTokens: number;
}

export interface GdwebDesignIndexSampleResult {
  markdown: string;
  model: string;
}

export interface GdwebDesignIndexItemResult {
  referenceId: string;
  title: string;
  gdwebUrl: string;
  status: 'generated' | 'failed';
  filePath?: string;
  model?: string;
  error?: string;
}

export interface GdwebDesignIndexGenerationResult {
  query: string;
  outputDirectory: string;
  total: number;
  generated: number;
  failed: number;
  items: GdwebDesignIndexItemResult[];
}

export type GdwebDesignIndexSampler = (
  request: GdwebDesignIndexSampleRequest
) => Promise<GdwebDesignIndexSampleResult>;

export class GdwebDesignIndexGenerator {
  constructor(
    private readonly gdwebDesignSearch: GdwebDesignSearch,
    private readonly sampler: GdwebDesignIndexSampler
  ) {}

  async generate(
    options: GdwebDesignIndexGenerationOptions
  ): Promise<GdwebDesignIndexGenerationResult> {
    const designs = await this.gdwebDesignSearch.search(options);
    const outputDirectory = path.resolve(
      options.outputDirectory ??
        process.env.DESIGN_INDEX_OUTPUT_DIR ??
        path.join(process.cwd(), 'design-index')
    );
    const items: GdwebDesignIndexItemResult[] = [];

    if (designs.length > 0) {
      await mkdir(outputDirectory, { recursive: true });
    }

    // Keep this loop sequential. Each iteration must be an isolated LLM sampling request.
    for (const design of designs) {
      const referenceId = `gdweb-${design.strNo}`;

      try {
        const reference = await this.gdwebDesignSearch.getDesignReference(design.gdwebUrl);
        const sample = await this.sampler({
          reference,
          contract: buildDesignSpecContract(reference),
          language: options.language,
          maxTokens: options.maxTokens,
        });
        const markdown = this.normalizeMarkdown(sample.markdown);
        if (!markdown) {
          throw new Error('The isolated LLM request returned an empty document');
        }

        const filePath = path.join(outputDirectory, `DESIGN_INDEX_${referenceId}.md`);
        await writeFile(filePath, `${markdown}\n`, 'utf8');
        items.push({
          referenceId,
          title: design.title,
          gdwebUrl: design.gdwebUrl,
          status: 'generated',
          filePath,
          model: sample.model,
        });
      } catch (error) {
        items.push({
          referenceId,
          title: design.title,
          gdwebUrl: design.gdwebUrl,
          status: 'failed',
          error: error instanceof Error ? error.message : 'Unknown generation error',
        });
      }
    }

    return {
      query: options.query,
      outputDirectory,
      total: designs.length,
      generated: items.filter(item => item.status === 'generated').length,
      failed: items.filter(item => item.status === 'failed').length,
      items,
    };
  }

  private normalizeMarkdown(markdown: string): string {
    const trimmed = markdown.trim();
    const fenced = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/i);
    return (fenced?.[1] ?? trimmed).trim();
  }
}
