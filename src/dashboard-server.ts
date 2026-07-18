#!/usr/bin/env node

import express, { NextFunction, Request, Response } from 'express';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { marked } from 'marked';
import sanitizeHtml from 'sanitize-html';
import {
  DesignIndexRunItem,
  DesignIndexRunManifest,
} from './design-index-run-store.js';
import {
  AddDesignExclusionInput,
  DesignExclusionStore,
} from './design-exclusion-store.js';
import { resolveDesignIndexOutputDirectory } from './design-index-paths.js';

const port = Number(process.env.SECRET_MCP_WEB_PORT ?? 4317);
const host = process.env.SECRET_MCP_WEB_HOST ?? '127.0.0.1';
const outputDirectory = resolveDesignIndexOutputDirectory();
const runsDirectory = path.join(outputDirectory, '.secret-mcp-runs');
const exclusionStore = new DesignExclusionStore(outputDirectory);
const webDirectory = fileURLToPath(new URL('../web', import.meta.url));
const require = createRequire(import.meta.url);
const lucideScript = require.resolve('lucide/dist/umd/lucide.min.js');
const safeIdentifier = /^[a-zA-Z0-9._-]+$/;
const app = express();

app.disable('x-powered-by');
app.use('/api', express.json({ limit: '16kb' }));
app.use('/assets', express.static(webDirectory, { etag: true, maxAge: 0 }));
app.get('/vendor/lucide.min.js', (_request, response) => {
  response.sendFile(lucideScript);
});

app.get('/api/health', (_request, response) => {
  response.json({
    ok: true,
    outputDirectory,
    runsDirectory,
    exclusionsPath: exclusionStore.filePath,
    now: new Date().toISOString(),
  });
});

app.get('/api/exclusions', async (_request, response, next) => {
  try {
    response.setHeader('Cache-Control', 'no-store');
    response.json({
      filePath: exclusionStore.filePath,
      items: await exclusionStore.list(),
    });
  } catch (error) {
    next(error);
  }
});

app.post('/api/exclusions', async (request, response, next) => {
  try {
    const input = parseExclusionInput(request.body);
    const item = await exclusionStore.add(input);
    response.status(201).json({
      item,
      items: await exclusionStore.list(),
    });
  } catch (error) {
    next(error);
  }
});

app.delete('/api/exclusions/:referenceId', async (request, response, next) => {
  try {
    const removed = await exclusionStore.remove(request.params.referenceId);
    response.json({
      removed,
      items: await exclusionStore.list(),
    });
  } catch (error) {
    next(error);
  }
});

app.get('/api/runs', async (_request, response, next) => {
  try {
    const runs = await listRuns();
    response.setHeader('Cache-Control', 'no-store');
    response.json({ runs });
  } catch (error) {
    next(error);
  }
});

app.get('/api/runs/:runId', async (request, response, next) => {
  try {
    const manifest = await readManifest(request.params.runId);
    response.setHeader('Cache-Control', 'no-store');
    response.json(manifest);
  } catch (error) {
    next(error);
  }
});

app.get(
  '/api/runs/:runId/items/:referenceId/document',
  async (request, response, next) => {
    try {
      const manifest = await readManifest(request.params.runId);
      const item = getItem(manifest, request.params.referenceId);
      if (!item.documentPath) {
        response.status(404).json({ error: 'Document is not generated yet' });
        return;
      }
      response.json(await readMarkdownPayload(manifest.runDirectory, item.documentPath));
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  '/api/runs/:runId/items/:referenceId/contract',
  async (request, response, next) => {
    try {
      const manifest = await readManifest(request.params.runId);
      const item = getItem(manifest, request.params.referenceId);
      if (!item.contractPath) {
        response.status(404).json({ error: 'Specification contract is not ready' });
        return;
      }
      response.json(await readMarkdownPayload(manifest.runDirectory, item.contractPath));
    } catch (error) {
      next(error);
    }
  }
);

app.get(
  '/api/runs/:runId/evidence/:filename',
  async (request, response, next) => {
    try {
      const manifest = await readManifest(request.params.runId);
      assertIdentifier(request.params.filename);
      const evidencePath = safeResolve(
        path.join(manifest.runDirectory, 'evidence'),
        request.params.filename
      );
      response.setHeader('Cache-Control', 'private, max-age=3600');
      response.sendFile(evidencePath, { dotfiles: 'allow' });
    } catch (error) {
      next(error);
    }
  }
);

app.get('/', (_request, response) => {
  response.setHeader('Cache-Control', 'no-store');
  response.sendFile(path.join(webDirectory, 'index.html'));
});

app.use((request, response, next) => {
  if (request.path.startsWith('/api/')) {
    response.status(404).json({ error: 'Not found' });
    return;
  }
  next();
});

app.use((error: unknown, _request: Request, response: Response, next: NextFunction) => {
  void next;
  const message = error instanceof Error ? error.message : 'Unknown server error';
  const status =
    error instanceof HttpError
      ? error.status
      : message === 'Not found'
        ? 404
        : 500;
  console.error('[Dashboard]', error);
  response.status(status).json({ error: message });
});

app.listen(port, host, () => {
  console.error(`Secret MCP Design Index Viewer: http://${host}:${port}`);
  console.error(`Watching: ${runsDirectory}`);
});

async function listRuns(): Promise<DesignIndexRunManifest[]> {
  let entries;
  try {
    entries = await readdir(runsDirectory, { withFileTypes: true });
  } catch (error) {
    if (isMissingFile(error)) return [];
    throw error;
  }

  const manifests = await Promise.all(
    entries
      .filter(entry => entry.isDirectory() && safeIdentifier.test(entry.name))
      .map(async entry => {
        try {
          return await readManifest(entry.name);
        } catch {
          return null;
        }
      })
  );

  return manifests
    .filter((manifest): manifest is DesignIndexRunManifest => manifest !== null)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

async function readManifest(runId: string): Promise<DesignIndexRunManifest> {
  assertIdentifier(runId);
  const manifestPath = safeResolve(
    runsDirectory,
    path.join(runId, 'run.json')
  );

  try {
    const source = await readFile(manifestPath, 'utf8');
    const manifest = JSON.parse(source) as DesignIndexRunManifest;
    if (
      manifest.schema !== 'secret-mcp/design-index-run/v1' ||
      manifest.runId !== runId ||
      !Array.isArray(manifest.items) ||
      !Array.isArray(manifest.events)
    ) {
      throw new Error('Invalid design-index run manifest');
    }
    return {
      ...manifest,
      runDirectory: path.dirname(manifestPath),
    };
  } catch (error) {
    if (isMissingFile(error)) throw new Error('Not found');
    throw error;
  }
}

function getItem(
  manifest: DesignIndexRunManifest,
  referenceId: string
): DesignIndexRunItem {
  assertIdentifier(referenceId);
  const item = manifest.items.find(candidate =>
    candidate.referenceId === referenceId
  );
  if (!item) throw new Error('Not found');
  return item;
}

async function readMarkdownPayload(
  runDirectory: string,
  relativePath: string
): Promise<{ markdown: string; html: string }> {
  const markdownPath = safeResolve(runDirectory, relativePath);
  const markdown = await readFile(markdownPath, 'utf8');
  const rendered = await marked.parse(markdown, {
    gfm: true,
    breaks: false,
  });
  const html = sanitizeHtml(rendered, {
    allowedTags: [
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      'p', 'br', 'hr', 'blockquote',
      'ul', 'ol', 'li',
      'strong', 'em', 'del',
      'code', 'pre',
      'table', 'thead', 'tbody', 'tr', 'th', 'td',
      'a',
    ],
    allowedAttributes: {
      a: ['href', 'title', 'target', 'rel'],
      code: ['class'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: sanitizeHtml.simpleTransform('a', {
        target: '_blank',
        rel: 'noreferrer noopener',
      }),
    },
  });

  return { markdown, html };
}

function safeResolve(baseDirectory: string, relativePath: string): string {
  const resolved = path.resolve(baseDirectory, relativePath);
  const relative = path.relative(baseDirectory, resolved);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('Not found');
  }
  return resolved;
}

function assertIdentifier(value: string): void {
  if (!safeIdentifier.test(value)) throw new Error('Not found');
}

function parseExclusionInput(value: unknown): AddDesignExclusionInput {
  if (!value || typeof value !== 'object') {
    throw new HttpError(400, 'Invalid exclusion request');
  }
  const input = value as Record<string, unknown>;
  const referenceId = readRequiredString(input.referenceId, 'referenceId', 64);
  const title = readRequiredString(input.title, 'title', 300);
  const gdwebUrl = readRequiredString(input.gdwebUrl, 'gdwebUrl', 1000);
  const reason = readOptionalString(input.reason, 'reason', 300);
  const sourceRunId = readOptionalString(input.sourceRunId, 'sourceRunId', 160);

  if (!/^gdweb-\d+$/.test(referenceId)) {
    throw new HttpError(400, 'Invalid exclusion referenceId');
  }
  try {
    const url = new URL(gdwebUrl);
    if (
      !url.hostname.endsWith('gdweb.co.kr') ||
      !url.pathname.endsWith('/sub/view.asp')
    ) {
      throw new Error('not a GDWEB design URL');
    }
  } catch {
    throw new HttpError(400, 'Invalid exclusion gdwebUrl');
  }

  return {
    referenceId,
    title,
    gdwebUrl,
    reason,
    sourceRunId,
  };
}

function readRequiredString(
  value: unknown,
  field: string,
  maxLength: number
): string {
  if (
    typeof value !== 'string' ||
    value.trim().length === 0 ||
    value.trim().length > maxLength
  ) {
    throw new HttpError(400, `Invalid exclusion ${field}`);
  }
  return value.trim();
}

function readOptionalString(
  value: unknown,
  field: string,
  maxLength: number
): string | undefined {
  if (value === undefined || value === null || value === '') return undefined;
  if (typeof value !== 'string' || value.trim().length > maxLength) {
    throw new HttpError(400, `Invalid exclusion ${field}`);
  }
  return value.trim();
}

function isMissingFile(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    (error as { code?: string }).code === 'ENOENT'
  );
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string
  ) {
    super(message);
  }
}
