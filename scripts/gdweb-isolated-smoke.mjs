import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { CreateMessageRequestSchema } from '@modelcontextprotocol/sdk/types.js';

const outputDirectory = await mkdtemp(path.join(tmpdir(), 'secret-mcp-isolated-'));
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
      text: `# ${referenceId}\n\nIsolated smoke document for ${referenceId}.\n`,
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

  const files = (await readdir(outputDirectory)).sort();
  if (files.length !== expectedCount) {
    throw new Error(`Expected ${expectedCount} files, got ${files.length}`);
  }

  for (const file of files) {
    const referenceId = file.match(/gdweb-\d+/)?.[0];
    const document = await readFile(path.join(outputDirectory, file), 'utf8');
    if (!referenceId || !document.includes(referenceId)) {
      throw new Error(`${file} contains the wrong isolated document`);
    }
  }

  console.log(JSON.stringify({
    samplingRequests: samples.map(({ referenceId, imageCount }) => ({
      referenceId,
      imageCount,
    })),
    files,
  }, null, 2));
} finally {
  await client.close();
  await rm(outputDirectory, { recursive: true, force: true });
}
