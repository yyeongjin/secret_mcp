import { mkdir, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CreateMessageRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { DesignExclusionStore } from '../dist/design-exclusion-store.js';

const configuredOutputDirectory = process.env.SMOKE_OUTPUT_DIR;
const outputDirectory = configuredOutputDirectory
  ? path.resolve(configuredOutputDirectory)
  : await mkdtemp(path.join(tmpdir(), 'secret-mcp-isolated-'));
const keepOutput = process.env.KEEP_SMOKE_OUTPUT === 'true';
if (configuredOutputDirectory) {
  await mkdir(outputDirectory, { recursive: true });
}
const samples = [];
const client = new Client(
  { name: 'gdweb-isolated-smoke', version: '1.0.0' },
  { capabilities: { sampling: {} } }
);

client.setRequestHandler(CreateMessageRequestSchema, async request => {
  const text = request.params.messages
    .filter(message => message.content.type === 'text')
    .map(message => message.content.text)
    .join('\n');
  const referenceId = text.match(/Reference ID: (gdweb-\d+)/)?.[1];
  const imageCount = request.params.messages.filter(
    message => message.content.type === 'image'
  ).length;

  if (!referenceId) throw new Error('Sampling request has no reference ID');
  if (imageCount === 0) throw new Error(`${referenceId} has no image evidence`);
  if (request.params.includeContext !== 'none') {
    throw new Error(`${referenceId} inherited another context`);
  }
  if (request.params.maxTokens !== 131072) {
    throw new Error(
      `${referenceId} received maxTokens=${request.params.maxTokens}; expected the 131072 multi-page default`
    );
  }
  const requiredContractMarkers = [
    'Schema: secret-mcp/design-index/v2',
    'Site Map and Page/Route Inventory',
    'Navigation and Header Specification',
    'Page-by-Page Specifications',
    'Prepared full canvas:',
    'Measured representative colors:',
  ];
  const missingMarker = requiredContractMarkers.find(marker =>
    !text.includes(marker)
  );
  if (missingMarker) {
    throw new Error(`${referenceId} is missing contract marker: ${missingMarker}`);
  }

  samples.push({ referenceId, imageCount, text });
  return {
    role: 'assistant',
    content: {
      type: 'text',
      text: [
        `# ${referenceId} Design Specification`,
        '',
        '## Reconstruction Goal',
        '',
        `This document describes only **${referenceId}**.`,
        '',
        '## Site Map and Page/Route Inventory',
        '',
        '| Page ID | Route | Purpose | Evidence |',
        '| --- | --- | --- | --- |',
        '| P-01 | `/` | Primary project page | desktop 1-N, mobile 1 |',
        '',
        '## Navigation and Header Specification',
        '',
        '| Property | Desktop | Mobile |',
        '| --- | --- | --- |',
        '| Header height | 72px | 56px |',
        '| Horizontal padding | 32px | 16px |',
        '| Logo bounds | 140 x 28px | 112 x 24px |',
        '',
        '## Page P-01: Primary Project Page',
        '',
        '| Section ID | Bounds | Layout |',
        '| --- | --- | --- |',
        '| P01-S01 | x:0 y:0 w:1200 h:72 | Full-width navigation |',
        '| P01-S02 | x:0 y:72 w:1200 h:640 | Two-column hero |',
        '| P01-S03 | x:0 y:712 w:1200 h:900 | Responsive card grid |',
        '',
        '## Component Abstraction',
        '',
        '- `AppShell` owns the page landmarks.',
        '- `SiteHeader` owns navigation and mobile disclosure state.',
        '- `HeroSection` owns the primary message and visual asset.',
        '',
        '## Design Tokens and Exact Color Specification',
        '',
        '| Token | HEX | RGB | HSL | Evidence |',
        '| --- | --- | --- | --- | --- |',
        '| `--surface` | `#FFFFFF` | `rgb(255, 255, 255)` | `hsl(0, 0%, 100%)` | MEASURED desktop crop |',
        '| `--text` | `#111111` | `rgb(17, 17, 17)` | `hsl(0, 0%, 7%)` | INFERRED from screenshot |',
        '',
        '## Responsive Specification',
        '',
        'Desktop uses a constrained 1200px content container. Mobile collapses all columns to one and preserves a minimum 44px touch target.',
        '',
        '## Acceptance Criteria',
        '',
        '- No horizontal overflow at 390px, 768px, or 1440px.',
        '- Every interactive element has a visible focus state.',
        '- Screenshot comparison is performed independently for this reference.',
        '',
      ].join('\n'),
    },
    model: 'isolated-smoke-model',
    stopReason: 'endTurn',
  };
});

const transport = new StdioClientTransport({
  command: 'node',
  args: ['./dist/index.js'],
  stderr: 'inherit',
});

try {
  await client.connect(transport);
  let undersizedBudgetRejected = false;
  try {
    const undersized = await client.callTool({
      name: 'generate-gdweb-design-indexes',
      arguments: {
        query: 'token-budget-validation',
        limit: 1,
        maxTokens: 32000,
      },
    });
    const undersizedText = undersized.content
      .filter(item => item.type === 'text')
      .map(item => item.text)
      .join('\n');
    undersizedBudgetRejected = Boolean(
      undersized.isError && undersizedText.includes('131072')
    );
  } catch (error) {
    undersizedBudgetRejected = String(error).includes('131072');
  }
  if (!undersizedBudgetRejected) {
    throw new Error('The server accepted an undersized 32000-token DESIGN_INDEX budget');
  }

  const preview = await client.callTool({
    name: 'search-gdweb-designs',
    arguments: {
      query: process.env.QUERY || '금융',
      limit: 1,
      year: process.env.YEAR ? Number(process.env.YEAR) : undefined,
      awardOnly: true,
      includePreviousYear: true,
    },
  });
  const previewText = preview.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n');
  const excludedReferenceId =
    previewText.match(/Reference ID: (gdweb-\d+)/)?.[1];
  const excludedUrl = previewText.match(/GDWEB URL: (.+)/)?.[1]?.trim();
  const excludedTitle =
    previewText.match(/\*\*1\. (.+)\*\*/)?.[1]?.trim();
  if (preview.isError || !excludedReferenceId || !excludedUrl || !excludedTitle) {
    throw new Error(`Unable to select an exclusion fixture:\n${previewText}`);
  }
  const exclusionStore = new DesignExclusionStore(outputDirectory);
  await exclusionStore.add({
    referenceId: excludedReferenceId,
    title: excludedTitle,
    gdwebUrl: excludedUrl,
    reason: 'Isolation smoke exclusion',
  });

  const result = await client.callTool({
    name: 'generate-gdweb-design-indexes',
    arguments: {
      query: process.env.QUERY || '금융',
      limit: Number(process.env.LIMIT || 2),
      year: process.env.YEAR ? Number(process.env.YEAR) : undefined,
      awardOnly: true,
      includePreviousYear: true,
      outputDirectory,
    },
  });
  const resultText = result.content
    .filter(item => item.type === 'text')
    .map(item => item.text)
    .join('\n');
  const expectedCount = Number(resultText.match(/Generated: (\d+)/)?.[1]);
  const manifestPath = resultText.match(/Run manifest: (.+)/)?.[1]?.trim();

  if (result.isError) {
    throw new Error(`Isolated generation tool failed:\n${resultText}`);
  }
  if (!expectedCount || samples.length !== expectedCount) {
    throw new Error(
      `Expected ${expectedCount || 'a positive number of'} isolated requests, got ${samples.length}`
    );
  }
  if (new Set(samples.map(sample => sample.referenceId)).size !== expectedCount) {
    throw new Error('Sampling requests did not contain distinct references');
  }
  if (samples.some(sample => sample.referenceId === excludedReferenceId)) {
    throw new Error(`${excludedReferenceId} was sampled after being excluded`);
  }

  for (const sample of samples) {
    const otherReferenceIds = samples
      .map(candidate => candidate.referenceId)
      .filter(referenceId => referenceId !== sample.referenceId);
    if (otherReferenceIds.some(referenceId => sample.text.includes(referenceId))) {
      throw new Error(`${sample.referenceId} leaked another reference`);
    }
  }

  if (!manifestPath) {
    throw new Error('Tool result did not return a run manifest path');
  }
  const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  if (manifest.language !== 'English') {
    throw new Error(`Expected the default document language to be English, got ${manifest.language}`);
  }
  const files = (await readdir(path.join(manifest.runDirectory, 'documents'))).sort();
  if (files.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} files, got ${files.length}`);
  }

  for (const file of files) {
    const referenceId = file.match(/gdweb-\d+/)?.[0];
    const document = await readFile(
      path.join(manifest.runDirectory, 'documents', file),
      'utf8'
    );
    if (!referenceId || !document.includes(referenceId)) {
      throw new Error(`${file} contains the wrong isolated document`);
    }
  }
  if (
    manifest.items.some(item =>
      item.status !== 'generated' ||
      !item.documentPath ||
      !item.contractPath ||
      item.evidence.length === 0 ||
      item.evidence.some(evidence =>
        evidence.cropTop === undefined ||
        evidence.sourceCropTop === undefined ||
        !Array.isArray(evidence.representativeColors) ||
        evidence.representativeColors.length === 0
      )
    )
  ) {
    throw new Error('Run manifest is missing per-reference artifacts');
  }
  if (
    !manifest.exclusions?.activeAtStart?.some(
      item => item.referenceId === excludedReferenceId
    )
  ) {
    throw new Error('Run manifest did not record the active exclusion');
  }

  const resultSummary = {
    runId: manifest.runId,
    recordedAt: new Date().toISOString(),
    query: process.env.QUERY || '금융',
    minimumTokenBudget: 131072,
    excludedReferenceId,
    assertions: {
      oneReferencePerRequest: true,
      crossReferenceLeaks: 0,
      distinctReferences: true,
      includeContext: 'none',
      exclusionHonored: true,
      contractMarkersPresent: true,
      outputDocumentCount: files.length,
    },
    samplingRequests: samples.map(({ referenceId, imageCount }) => ({
      referenceId,
      imageCount,
    })),
    files,
  };
  const serializedResult = `${JSON.stringify(resultSummary, null, 2)}\n`;
  const resultPath = process.env.SMOKE_RESULT_PATH;
  if (resultPath) {
    const absoluteResultPath = path.resolve(resultPath);
    await mkdir(path.dirname(absoluteResultPath), { recursive: true });
    await writeFile(absoluteResultPath, serializedResult, 'utf8');
  }
  console.log(serializedResult.trim());
} finally {
  await client.close();
  if (!keepOutput) {
    await rm(outputDirectory, { recursive: true, force: true });
  }
}
