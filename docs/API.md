**English** | [한국어](API.ko.md)

# Secret MCP API Documentation

## Overview

Secret MCP exposes five MCP tools. Two tools are dedicated to GDWEB design-reference workflows, and three tools provide general web search and content extraction.

| Tool | Intended Use |
| --- | --- |
| `generate-gdweb-design-indexes` | Search GDWEB and create one isolated, implementation-ready `DESIGN_INDEX` document per result |
| `search-gdweb-designs` | Return a lightweight GDWEB reference list without creating documents |
| `full-web-search` | Search the general web and extract full content from result pages |
| `get-web-search-summaries` | Return general-search titles, URLs, and snippets only |
| `get-single-web-page-content` | Extract content from one known webpage URL |

Use `generate-gdweb-design-indexes` whenever the request includes layout analysis, frontend specifications, implementation planning, or `DESIGN_INDEX` generation. Do not replace it with `search-gdweb-designs` followed by one combined LLM summary.

## Transport and Client Requirements

The server uses MCP over stdio. An MCP client starts `dist/index.js` as a child process and exchanges JSON-RPC messages through stdin and stdout.

`generate-gdweb-design-indexes` requires the connected client to advertise MCP sampling support. Every work is sent through a separate `sampling/createMessage` request with `includeContext: "none"`. If sampling is unavailable, the tool fails explicitly and does not run a combined-context fallback.

The other four tools do not require MCP sampling.

## Tool: `generate-gdweb-design-indexes`

### Purpose

Search GDWEB internally, apply the persistent exclusion list, prepare image evidence, and create one independent `DESIGN_INDEX_gdweb-<strNo>.md` file per selected result. Each work receives its own LLM request containing only that work's metadata, specification contract, and prepared evidence images.

### Input

```json
{
  "query": "aviation project website",
  "limit": 3,
  "year": 2026,
  "awardOnly": true,
  "includePreviousYear": true,
  "language": "English",
  "outputDirectory": "/absolute/path/to/design-index",
  "maxTokens": 32000
}
```

| Field | Type | Required | Default | Constraints and Meaning |
| --- | --- | --- | --- | --- |
| `query` | string | Yes | none | Natural-language design query submitted directly to GDWEB |
| `limit` | number or numeric string | No | `3` | Number of isolated result requests and output documents; integer from 1 to 10 |
| `year` | number or numeric string | No | current runtime year | Target registration or award year; integer from 2000 to 2100 |
| `awardOnly` | boolean or boolean string | No | `true` | Require a non-empty GDWEB award field |
| `includePreviousYear` | boolean or boolean string | No | `true` | Allow the year immediately before `year` in addition to `year` |
| `language` | `English` or `Korean` | No | `English` | Language used for every generated document in the run |
| `outputDirectory` | string | No | resolved output directory | Overrides `DESIGN_INDEX_OUTPUT_DIR` for this call |
| `maxTokens` | number or numeric string | No | `32000` | Token limit requested for each independent sampling call; integer from 2,000 to 50,000 |

The output directory is resolved in this order:

1. `outputDirectory` supplied to the tool
2. `DESIGN_INDEX_OUTPUT_DIR` environment variable
3. `design-index` under the server's current working directory

### Isolation Contract

For `N` selected results, the server performs up to `N` sequential sampling requests.

- Each request contains exactly one GDWEB reference.
- Each request uses `includeContext: "none"`.
- A previous work's ID, images, contract, or generated document is not included in the next request.
- All prepared tiles for one work remain together in that work's request.
- Tiles from different works never share a request.
- The next request starts only after the current Markdown response is saved.
- The outer host receives paths and statuses, not all document bodies combined into one response.

### Generated Files

```text
<output-directory>/.secret-mcp-runs/<run-id>/
├── run.json
├── contracts/
│   └── gdweb-<strNo>.md
├── evidence/
│   ├── gdweb-<strNo>_desktop_01-of-N.jpg
│   └── gdweb-<strNo>_mobile_01-of-N.jpg
└── documents/
    └── DESIGN_INDEX_gdweb-<strNo>.md
```

`run.json` contains run metadata, per-work status, timestamps, model names, contract paths, document paths, and evidence measurements. It does not combine the generated document bodies.

### Text Response

```text
GDWEB isolated design-index generation completed for "aviation project website".
Output directory: /absolute/path/to/design-index
Run ID: <run-id>
Run manifest: <absolute-manifest-path>
Viewer: http://127.0.0.1:4317/?run=<run-id>
Search results: 3
Generated: 3
Failed: 0
Active exclusions applied: 0

1. gdweb-27294 - <title>
   Status: generated
   File: <absolute-document-path>
   Model: <sampling-model>
```

The tool sets `isError: true` when at least one selected work fails. Successfully generated works remain recorded in the same run.

### Errors

- Invalid numeric or boolean input
- Connected client does not support `sampling/createMessage`
- GDWEB search or metadata loading failure
- Evidence download or image-preparation failure
- Sampling timeout or sampling error
- Empty document returned by the isolated LLM request
- Output-directory or file-write failure

The per-work sampling timeout defaults to 180,000ms and can be changed with `MCP_SAMPLING_TIMEOUT_MS`.

## Tool: `search-gdweb-designs`

### Purpose

Return a lightweight list of GDWEB references after applying strict year, award, and dashboard-managed exclusion filters. This tool does not prepare evidence, call an LLM, or create `DESIGN_INDEX` documents.

### Input

```json
{
  "query": "food brand website",
  "limit": 5,
  "year": 2026,
  "awardOnly": true,
  "includePreviousYear": true
}
```

| Field | Type | Required | Default | Constraints and Meaning |
| --- | --- | --- | --- | --- |
| `query` | string | Yes | none | Natural-language query submitted directly to GDWEB |
| `limit` | number or numeric string | No | `5` | Number of results; integer from 1 to 10 |
| `year` | number or numeric string | No | current runtime year | Target registration year; integer from 2000 to 2100 |
| `awardOnly` | boolean or boolean string | No | `true` | Require a non-empty GDWEB award field |
| `includePreviousYear` | boolean or boolean string | No | `true` | Include the immediately preceding year |

### Result Fields

Every result includes the following values when GDWEB provides them.

| Field | Meaning |
| --- | --- |
| `Reference ID` | Stable local identifier in the form `gdweb-<strNo>` |
| `GDWEB URL` | GDWEB work detail page |
| `Registered Date` | Registration date parsed from GDWEB metadata |
| `Award` | Award name |
| `Concept` | Design concept |
| `Primary Color` | GDWEB primary-color metadata |
| `Production Company` | Production company metadata |
| `Desktop Evidence` | GDWEB registered desktop image URL |
| `Mobile Evidence` | GDWEB registered mobile image URL when available |

### Text Response

```text
GDWEB design search for "food brand website" with 2 result(s).
Filters: years=2026, 2025 (strict), awardOnly=true

Dashboard exclusions applied before result selection: 1

**1. <title>**
Reference ID: gdweb-<strNo>
GDWEB URL: <url>
Registered Date: <date>
Award: <award>
Concept: <concept>
Primary Color: <color>
Production Company: <company>
Desktop Evidence: <url>
Mobile Evidence: <url>
```

Use this tool only when the caller needs a list. Use `generate-gdweb-design-indexes` when the references must become implementation specifications.

## Tool: `full-web-search`

### Purpose

Search the general web, follow result links, and extract complete page content. This is the primary general-research tool.

### Input

```json
{
  "query": "TypeScript MCP server",
  "limit": 5,
  "includeContent": true,
  "maxContentLength": 0
}
```

| Field | Type | Required | Default | Constraints and Meaning |
| --- | --- | --- | --- | --- |
| `query` | string | Yes | none | General web-search query |
| `limit` | number or numeric string | No | `5` | Number of results with extracted content; integer from 1 to 10 |
| `includeContent` | boolean or boolean string | No | `true` | Whether to fetch result-page content |
| `maxContentLength` | number or numeric string | No | automatic | Maximum characters per result; `0` means no explicit limit |

The server may apply a 2,000-character content limit when it detects string-form parameters associated with smaller-context clients and no explicit `maxContentLength` was supplied. Numeric and boolean parameters are treated as a signal that the client can generally handle larger responses.

### Text Response

```text
Search completed for "TypeScript MCP server" with 2 results:

**1. <title>**
URL: <url>
Description: <description>

**Full Content:**
<extracted content>

---
```

If full extraction fails, the result contains either a content preview or an explicit extraction-failure message.

## Tool: `get-web-search-summaries`

### Purpose

Search the general web and return result titles, URLs, and descriptions without following links to extract complete page content.

### Input

```json
{
  "query": "responsive design references",
  "limit": 5
}
```

| Field | Type | Required | Default | Constraints and Meaning |
| --- | --- | --- | --- | --- |
| `query` | string | Yes | none | General web-search query |
| `limit` | number or numeric string | No | `5` | Number of summaries; integer from 1 to 10 |

### Text Response

```text
Search summaries for "responsive design references" with 2 results:

**1. <title>**
URL: <url>
Description: <description>

---
```

Use this tool when snippets are sufficient. Use `full-web-search` when the actual page body is required.

## Tool: `get-single-web-page-content`

### Purpose

Fetch and extract the main content from one known HTTP or HTTPS URL without running a search first.

### Input

```json
{
  "url": "https://example.com/article",
  "maxContentLength": 2000
}
```

| Field | Type | Required | Default | Constraints and Meaning |
| --- | --- | --- | --- | --- |
| `url` | URL string | Yes | none | HTTP or HTTPS webpage URL |
| `maxContentLength` | number or numeric string | No | automatic | Maximum extracted characters; `0` means no explicit limit |

PDF URLs are rejected because this tool is designed for webpage extraction.

### Text Response

```text
**Page Content from: https://example.com/article**

**Title:** <title>
**Word Count:** <count>
**Content Length:** <characters> characters

**Content:**
<extracted page content>
```

## GDWEB Search Policy

The GDWEB tools use GDWEB's own search endpoint rather than Bing, Brave, DuckDuckGo, or browser automation.

```text
query
  -> POST https://www.gdweb.co.kr/sub/search.asp
  -> Txt_word=<query>
  -> parse result HTML
  -> collect work IDs and category values
  -> load GDWEB detail metadata
  -> enforce year and award filters
  -> apply persistent work exclusions
```

When `year` is omitted and the server runs in 2026, the default allowed years are 2026 and 2025. Set `includePreviousYear: false` to allow only 2026.

## Search Exclusions

The web viewer and both GDWEB tools share the following persistent file when they use the same output directory.

```text
DESIGN_INDEX_OUTPUT_DIR/.secret-mcp/exclusions.json
```

Exclusions affect future searches only. Existing runs, evidence, contracts, and generated documents are not deleted. The search reads additional candidates when necessary so that excluded works do not reduce the requested result count when enough eligible GDWEB works exist.

## Runtime Environment Variables

| Variable | Default | Purpose |
| --- | --- | --- |
| `DESIGN_INDEX_OUTPUT_DIR` | `./design-index` | Shared generated-artifact and exclusion directory |
| `SECRET_MCP_WEB_ORIGIN` | `http://127.0.0.1:4317` | Viewer URL returned by the generation tool |
| `MCP_SAMPLING_TIMEOUT_MS` | `180000` | Timeout for each isolated sampling request |
| `MAX_CONTENT_LENGTH` | `500000` | Default maximum content extracted from a general webpage |
| `DEFAULT_TIMEOUT` | `6000` | General HTTP and browser timeout |
| `MAX_BROWSERS` | `3` | Maximum browser-pool size for general extraction |
| `BROWSER_TYPES` | `chromium,firefox` | Browser types used by general extraction |
| `BROWSER_HEADLESS` | `true` | Whether general-extraction browsers run headlessly |
| `FORCE_MULTI_ENGINE_SEARCH` | `false` | Whether general search compares every configured engine |
| `DEBUG_BROWSER_LIFECYCLE` | `false` | Whether browser lifecycle events are logged |

## Error Handling

MCP tool failures are returned as tool errors or thrown protocol errors with a human-readable message. Callers should preserve partial per-work results from `generate-gdweb-design-indexes`, inspect the run manifest for item-level status, and avoid retrying all completed works as one combined request.

Common failure classes include:

- Invalid schema values
- Search endpoint or network timeout
- Search rate limiting
- Page access denied or malformed HTML
- Content extraction failure
- Evidence image download or decoding failure
- Missing MCP sampling capability
- Sampling timeout or empty sampling result
- File-system permission or write failure

## Recommended Tool Selection

| User Intent | Tool |
| --- | --- |
| "Find references and write a layout specification for each" | `generate-gdweb-design-indexes` |
| "Show me a few GDWEB links" | `search-gdweb-designs` |
| "Research this topic and read the result pages" | `full-web-search` |
| "Give me a quick list of search results" | `get-web-search-summaries` |
| "Read this exact webpage" | `get-single-web-page-content` |
