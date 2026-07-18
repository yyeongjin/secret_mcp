import { mkdir, mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CreateMessageRequestSchema } from '@modelcontextprotocol/sdk/types.js';

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
        '## Page Information Architecture',
        '',
        '| Order | Section | Layout |',
        '| --- | --- | --- |',
        '| 1 | Header | Full-width navigation |',
        '| 2 | Hero | Two-column editorial composition |',
        '| 3 | Content | Responsive card grid |',
        '',
        '## Component Abstraction',
        '',
        '- `AppShell` owns the page landmarks.',
        '- `SiteHeader` owns navigation and mobile disclosure state.',
        '- `HeroSection` owns the primary message and visual asset.',
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
  const result = await client.callTool({
    name: 'generate-gdweb-design-indexes',
    arguments: {
      query: process.env.QUERY || '금융',
      limit: Number(process.env.LIMIT || 2),
      year: process.env.YEAR ? Number(process.env.YEAR) : undefined,
      awardOnly: true,
      includePreviousYear: true,
      outputDirectory,
      maxTokens: 4000,
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
      item.evidence.length === 0
    )
  ) {
    throw new Error('Run manifest is missing per-reference artifacts');
  }

  console.log(JSON.stringify({
    runId: manifest.runId,
    runDirectory: manifest.runDirectory,
    samplingRequests: samples.map(({ referenceId, imageCount }) => ({
      referenceId,
      imageCount,
    })),
    files,
  }, null, 2));
} finally {
  await client.close();
  if (!keepOutput) {
    await rm(outputDirectory, { recursive: true, force: true });
  }
}
