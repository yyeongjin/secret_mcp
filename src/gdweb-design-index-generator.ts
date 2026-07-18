import path from 'node:path';
import {
  GdwebDesignReference,
  GdwebDesignResult,
  GdwebDesignSearch,
  GdwebDesignSearchOptions,
} from './gdweb-design-search.js';
import { buildDesignSpecContract } from './design-spec-contract.js';
import {
  GdwebSamplingImage,
  prepareGdwebSamplingImages,
} from './gdweb-sampling-images.js';
import { DesignExclusionStore } from './design-exclusion-store.js';
import { resolveDesignIndexOutputDirectory } from './design-index-paths.js';
import { DesignIndexRunStore } from './design-index-run-store.js';

export interface GdwebDesignIndexGenerationOptions extends GdwebDesignSearchOptions {
  language: string;
  outputDirectory?: string;
  maxTokens: number;
}

export interface GdwebDesignIndexSampleRequest {
  reference: GdwebDesignReference;
  contract: string;
  samplingImages: GdwebSamplingImage[];
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
  runId: string;
  runDirectory: string;
  manifestPath: string;
  total: number;
  generated: number;
  failed: number;
  excluded: number;
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
    const outputDirectory = resolveDesignIndexOutputDirectory(
      options.outputDirectory
    );
    const items: GdwebDesignIndexItemResult[] = [];
    const targetYear = options.year ?? new Date().getFullYear();
    const exclusionStore = new DesignExclusionStore(outputDirectory);
    const exclusions = await exclusionStore.list();
    const runStore = await DesignIndexRunStore.create({
      query: options.query,
      language: options.language,
      requestedLimit: options.limit,
      targetYear,
      includePreviousYear: options.includePreviousYear ?? true,
      awardOnly: options.awardOnly ?? true,
      outputDirectory,
      exclusions,
    });
    let designs: GdwebDesignResult[];

    try {
      designs = await this.gdwebDesignSearch.search({
        ...options,
        excludeStrNos: exclusions.map(item => item.strNo),
      });
      await runStore.setSearchResults(designs);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown search error';
      await runStore.fail(message);
      throw error;
    }

    // Keep this loop sequential. Each iteration must be an isolated LLM sampling request.
    for (const design of designs) {
      const referenceId = `gdweb-${design.strNo}`;
      const startedAt = new Date().toISOString();

      try {
        await runStore.updateItem(
          referenceId,
          { status: 'loading_evidence', startedAt },
          'item.evidence.loading'
        );
        const reference = await this.gdwebDesignSearch.getDesignReference(design.gdwebUrl);
        await runStore.updateItem(
          referenceId,
          { status: 'preparing_images' },
          'item.evidence.preparing'
        );
        const samplingImages = await prepareGdwebSamplingImages(reference.images);
        const contract = buildDesignSpecContract(reference, samplingImages);
        const contractPath = await runStore.saveContract(referenceId, contract);
        const evidence = await runStore.saveEvidence(referenceId, samplingImages);
        await runStore.updateItem(
          referenceId,
          { status: 'sampling', contractPath, evidence },
          'item.sampling.started',
          String(samplingImages.length)
        );
        const sample = await this.sampler({
          reference,
          contract,
          samplingImages,
          language: options.language,
          maxTokens: options.maxTokens,
        });
        const markdown = this.normalizeMarkdown(sample.markdown);
        if (!markdown) {
          throw new Error('The isolated LLM request returned an empty document');
        }

        await runStore.updateItem(
          referenceId,
          { status: 'writing', model: sample.model },
          'item.document.writing'
        );
        const documentPath = await runStore.saveDocument(referenceId, markdown);
        const filePath = path.join(runStore.runDirectory, documentPath);
        const completedAt = new Date().toISOString();
        await runStore.updateItem(
          referenceId,
          {
            status: 'generated',
            model: sample.model,
            documentPath,
            completedAt,
          },
          'item.generated'
        );
        items.push({
          referenceId,
          title: design.title,
          gdwebUrl: design.gdwebUrl,
          status: 'generated',
          filePath,
          model: sample.model,
        });
      } catch (error) {
        const message =
          error instanceof Error ? error.message : 'Unknown generation error';
        await runStore.updateItem(
          referenceId,
          {
            status: 'failed',
            error: message,
            completedAt: new Date().toISOString(),
          },
          'item.failed',
          message
        );
        items.push({
          referenceId,
          title: design.title,
          gdwebUrl: design.gdwebUrl,
          status: 'failed',
          error: message,
        });
      }
    }

    await runStore.complete();
    return {
      query: options.query,
      outputDirectory,
      runId: runStore.runId,
      runDirectory: runStore.runDirectory,
      manifestPath: runStore.manifestPath,
      total: designs.length,
      generated: items.filter(item => item.status === 'generated').length,
      failed: items.filter(item => item.status === 'failed').length,
      excluded: exclusions.length,
      items,
    };
  }

  private normalizeMarkdown(markdown: string): string {
    const trimmed = markdown.trim();
    const fenced = trimmed.match(/^```(?:markdown|md)?\s*\n([\s\S]*?)\n```$/i);
    return (fenced?.[1] ?? trimmed).trim();
  }
}
