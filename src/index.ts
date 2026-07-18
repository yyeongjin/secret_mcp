#!/usr/bin/env node
console.error('Secret MCP Server starting...');

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { SearchEngine } from './search-engine.js';
import { EnhancedContentExtractor } from './enhanced-content-extractor.js';
import { GdwebDesignSearch } from './gdweb-design-search.js';
import {
  GdwebDesignIndexGenerator,
  GdwebDesignIndexSampleRequest,
} from './gdweb-design-index-generator.js';
import { DesignExclusionStore } from './design-exclusion-store.js';
import { resolveDesignIndexOutputDirectory } from './design-index-paths.js';
import { WebSearchToolInput, WebSearchToolOutput, SearchResult } from './types.js';
import { isPdfUrl } from './utils.js';

class SecretMCPServer {
  private server: McpServer;
  private searchEngine: SearchEngine;
  private contentExtractor: EnhancedContentExtractor;
  private gdwebDesignSearch: GdwebDesignSearch;
  private gdwebDesignIndexGenerator: GdwebDesignIndexGenerator;

  constructor() {
    this.server = new McpServer({
      name: 'secret-mcp',
      version: '0.6.0',
    });

    this.searchEngine = new SearchEngine();
    this.contentExtractor = new EnhancedContentExtractor();
    this.gdwebDesignSearch = new GdwebDesignSearch();
    this.gdwebDesignIndexGenerator = new GdwebDesignIndexGenerator(
      this.gdwebDesignSearch,
      request => this.sampleGdwebDesignIndex(request)
    );

    this.setupTools();
    this.setupGracefulShutdown();
  }

  private setupTools(): void {
    // Register the main web search tool (primary choice for comprehensive searches)
    this.server.tool(
      'full-web-search',
      'Search the web and fetch complete page content from top results. This is the most comprehensive web search tool. It searches the web and then follows the resulting links to extract their full page content, providing the most detailed and complete information available. Use get-web-search-summaries for a lightweight alternative.',
      {
        query: z.string().describe('Search query to execute (recommended for comprehensive research)'),
        limit: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 1 || num > 10) {
            throw new Error('Invalid limit: must be a number between 1 and 10');
          }
          return num;
        }).default(5).describe('Number of results to return with full content (1-10)'),
        includeContent: z.union([z.boolean(), z.string()]).transform((val) => {
          if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
          }
          return Boolean(val);
        }).default(true).describe('Whether to fetch full page content (default: true)'),
        maxContentLength: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 0) {
            throw new Error('Invalid maxContentLength: must be a non-negative number');
          }
          return num;
        }).optional().describe('Maximum characters per result content (0 = no limit). Usually not needed - content length is automatically optimized.'),
      },
      async (args: unknown) => {
        console.error(`[MCP] Tool call received: full-web-search`);
        console.error(`[MCP] Raw arguments:`, JSON.stringify(args, null, 2));

        try {
          // Convert and validate arguments
          const validatedArgs = this.validateAndConvertArgs(args);
          
          // Auto-detect model types based on parameter formats
          // Llama models often send string parameters and struggle with large responses
          const isLikelyLlama = typeof args === 'object' && args !== null && (
            ('limit' in args && typeof (args as Record<string, unknown>).limit === 'string') ||
            ('includeContent' in args && typeof (args as Record<string, unknown>).includeContent === 'string')
          );
          
          // Detect models that handle large responses well (Qwen, Gemma, recent Deepseek)
          const isLikelyRobustModel = typeof args === 'object' && args !== null && (
            ('limit' in args && typeof (args as Record<string, unknown>).limit === 'number') &&
            ('includeContent' in args && typeof (args as Record<string, unknown>).includeContent === 'boolean')
          );
          
          // Only apply auto-limit if maxContentLength is not explicitly set (including 0)
          const hasExplicitMaxLength = typeof args === 'object' && args !== null && 'maxContentLength' in args;
          
          if (!hasExplicitMaxLength && isLikelyLlama) {
            console.error(`[MCP] Detected potential Llama model (string parameters), applying content length limit`);
            validatedArgs.maxContentLength = 2000; // Reasonable limit for Llama
          }
          
          // For robust models (Qwen, Gemma, recent Deepseek), remove maxContentLength if it's set to a low value
          if (isLikelyRobustModel && validatedArgs.maxContentLength && validatedArgs.maxContentLength < 5000) {
            console.error(`[MCP] Detected robust model (numeric parameters), removing unnecessary content length limit`);
            validatedArgs.maxContentLength = undefined;
          }
          
          console.error(`[MCP] Validated args:`, JSON.stringify(validatedArgs, null, 2));
          
          console.error(`[MCP] Starting web search...`);
          const result = await this.handleWebSearch(validatedArgs);
          
          console.error(`[MCP] Search completed, found ${result.results.length} results`);
          
          // Format the results as a comprehensive text response
          let responseText = `Search completed for "${result.query}" with ${result.total_results} results:\n\n`;
          
          // Add status line if available
          if (result.status) {
            responseText += `**Status:** ${result.status}\n\n`;
          }
          
          const maxLength = validatedArgs.maxContentLength;
          
          result.results.forEach((searchResult, idx) => {
            responseText += `**${idx + 1}. ${searchResult.title}**\n`;
            responseText += `URL: ${searchResult.url}\n`;
            responseText += `Description: ${searchResult.description}\n`;
            
            if (searchResult.fullContent && searchResult.fullContent.trim()) {
              let content = searchResult.fullContent;
              if (maxLength && maxLength > 0 && content.length > maxLength) {
                content = content.substring(0, maxLength) + `\n\n[Content truncated at ${maxLength} characters]`;
              }
              responseText += `\n**Full Content:**\n${content}\n`;
            } else if (searchResult.contentPreview && searchResult.contentPreview.trim()) {
              let content = searchResult.contentPreview;
              if (maxLength && maxLength > 0 && content.length > maxLength) {
                content = content.substring(0, maxLength) + `\n\n[Content truncated at ${maxLength} characters]`;
              }
              responseText += `\n**Content Preview:**\n${content}\n`;
            } else if (searchResult.fetchStatus === 'error') {
              responseText += `\n**Content Extraction Failed:** ${searchResult.error}\n`;
            }
            
            responseText += `\n---\n\n`;
          });
          
          return {
            content: [
              {
                type: 'text' as const,
                text: responseText,
              },
            ],
          };
        } catch (error) {
          console.error(`[MCP] Error in tool handler:`, error);
          throw error;
        }
      }
    );

    // Register a GDWEB-specific design search with strict freshness filtering.
    this.server.tool(
      'search-gdweb-designs',
      'Use this tool only when the user wants a lightweight list of GDWEB references. It applies the dashboard-managed exclusion list before returning results, returns metadata for multiple results, and does not generate implementation documents. For layout analysis, frontend specifications, DESIGN_INDEX files, or implementation planning, use generate-gdweb-design-indexes instead so every result is processed by a separate isolated LLM request.',
      {
        query: z.string().min(1).describe('Natural-language design reference query to search directly on GDWEB'),
        limit: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 1 || num > 10) {
            throw new Error('Invalid limit: must be a number between 1 and 10');
          }
          return num;
        }).default(5).describe('Number of GDWEB design results to return (1-10)'),
        year: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 2000 || num > 2100) {
            throw new Error('Invalid year: must be a year between 2000 and 2100');
          }
          return num;
        }).optional().describe('Target award/registration year. Defaults to the current runtime year.'),
        awardOnly: z.union([z.boolean(), z.string()]).transform((val) => {
          if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
          }
          return Boolean(val);
        }).default(true).describe('Whether to require a non-empty GDWEB award field. Defaults to true.'),
        includePreviousYear: z.union([z.boolean(), z.string()]).transform((val) => {
          if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
          }
          return Boolean(val);
        }).default(true).describe('Whether to include the previous year in addition to the target year. Defaults to true.'),
      },
      async (args: unknown) => {
        console.error(`[MCP] Tool call received: search-gdweb-designs`);
        console.error(`[MCP] Raw arguments:`, JSON.stringify(args, null, 2));

        try {
          const schema = z.object({
            query: z.string().min(1),
            limit: z.union([z.number(), z.string()]).transform((val) => {
              const num = typeof val === 'string' ? parseInt(val, 10) : val;
              if (isNaN(num) || num < 1 || num > 10) {
                throw new Error('Invalid limit: must be a number between 1 and 10');
              }
              return num;
            }).default(5),
            year: z.union([z.number(), z.string()]).transform((val) => {
              const num = typeof val === 'string' ? parseInt(val, 10) : val;
              if (isNaN(num) || num < 2000 || num > 2100) {
                throw new Error('Invalid year: must be a year between 2000 and 2100');
              }
              return num;
            }).optional(),
            awardOnly: z.union([z.boolean(), z.string()]).transform((val) => {
              if (typeof val === 'string') {
                return val.toLowerCase() === 'true';
              }
              return Boolean(val);
            }).default(true),
            includePreviousYear: z.union([z.boolean(), z.string()]).transform((val) => {
              if (typeof val === 'string') {
                return val.toLowerCase() === 'true';
              }
              return Boolean(val);
            }).default(true),
          });
          const parsed = schema.parse(args);
          const targetYear = parsed.year ?? new Date().getFullYear();
          const allowedYears = parsed.includePreviousYear ? [targetYear, targetYear - 1] : [targetYear];
          const exclusionStore = new DesignExclusionStore(
            resolveDesignIndexOutputDirectory()
          );
          const exclusions = await exclusionStore.list();

          const results = await this.gdwebDesignSearch.search({
            query: parsed.query,
            limit: parsed.limit,
            year: targetYear,
            awardOnly: parsed.awardOnly,
            includePreviousYear: parsed.includePreviousYear,
            excludeStrNos: exclusions.map(item => item.strNo),
          });

          let responseText = `GDWEB design search for "${parsed.query}" with ${results.length} result(s).\n`;
          responseText += `Filters: years=${allowedYears.join(', ')} (strict), awardOnly=${parsed.awardOnly}\n\n`;
          responseText += `Dashboard exclusions applied before result selection: ${exclusions.length}\n\n`;

          if (results.length === 0) {
            responseText += `No GDWEB results survived the strict ${allowedYears.join(', ')} filter.`;
          }

          results.forEach((result, idx) => {
            responseText += `**${idx + 1}. ${result.title}**\n`;
            responseText += `Reference ID: gdweb-${result.strNo}\n`;
            responseText += `GDWEB URL: ${result.gdwebUrl}\n`;
            responseText += `Registered Date: ${result.registeredDate}\n`;
            responseText += `Award: ${result.award || 'N/A'}\n`;
            responseText += `Concept: ${result.concept || 'N/A'}\n`;
            responseText += `Primary Color: ${result.primaryColor || 'N/A'}\n`;
            responseText += `Production Company: ${result.productionCompany || 'N/A'}\n`;
            responseText += `Desktop Evidence: ${result.desktopImageUrl}\n`;
            responseText += `Mobile Evidence: ${result.mobileImageUrl}\n`;
            responseText += `\n---\n\n`;
          });

          return {
            content: [
              {
                type: 'text' as const,
                text: responseText,
              },
            ],
          };
        } catch (error) {
          console.error(`[MCP] Error in search-gdweb-designs tool handler:`, error);
          throw error;
        }
      }
    );

    // Generate one file per result through one isolated MCP sampling request per result.
    this.server.tool(
      'generate-gdweb-design-indexes',
      'Automatically use this tool when the user asks to find GDWEB references and create layout analysis, frontend specifications, implementation plans, or DESIGN_INDEX files. This tool applies the dashboard-managed exclusion list, performs the GDWEB search internally, and sends one completely separate MCP sampling/createMessage request per non-excluded result. Each isolated request contains only one result and has no previous-result context. It writes one page-by-page, measurement-first DESIGN_INDEX_gdweb-<strNo>.md file before starting the next request, then returns only file paths and statuses to the calling LLM. Never replace this tool with search-gdweb-designs plus a combined summary. The connected MCP client must support sampling.',
      {
        query: z.string().min(1).describe('Natural-language design query to search directly on GDWEB'),
        limit: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 1 || num > 10) {
            throw new Error('Invalid limit: must be a number between 1 and 10');
          }
          return num;
        }).default(3).describe('Number of isolated result requests and output documents (1-10)'),
        year: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 2000 || num > 2100) {
            throw new Error('Invalid year: must be a year between 2000 and 2100');
          }
          return num;
        }).optional().describe('Target award/registration year. Defaults to the current runtime year.'),
        awardOnly: z.union([z.boolean(), z.string()]).transform((val) => {
          if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
          }
          return Boolean(val);
        }).default(true).describe('Whether to require a non-empty GDWEB award field'),
        includePreviousYear: z.union([z.boolean(), z.string()]).transform((val) => {
          if (typeof val === 'string') {
            return val.toLowerCase() === 'true';
          }
          return Boolean(val);
        }).default(true).describe('Whether to include the previous year'),
        language: z.string().min(1).default('Korean').describe('Language for every generated document'),
        outputDirectory: z.string().min(1).optional().describe('Directory for generated DESIGN_INDEX files. Defaults to DESIGN_INDEX_OUTPUT_DIR or ./design-index.'),
        maxTokens: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 2000 || num > 50000) {
            throw new Error('Invalid maxTokens: must be a number between 2000 and 50000');
          }
          return num;
        }).default(32000).describe('Maximum tokens requested for each isolated page-by-page specification (2,000-50,000)'),
      },
      async (args: unknown) => {
        console.error(`[MCP] Tool call received: generate-gdweb-design-indexes`);
        console.error(`[MCP] Raw arguments:`, JSON.stringify(args, null, 2));

        try {
          const schema = z.object({
            query: z.string().min(1),
            limit: z.union([z.number(), z.string()]).transform((val) => {
              const num = typeof val === 'string' ? parseInt(val, 10) : val;
              if (isNaN(num) || num < 1 || num > 10) {
                throw new Error('Invalid limit: must be a number between 1 and 10');
              }
              return num;
            }).default(3),
            year: z.union([z.number(), z.string()]).transform((val) => {
              const num = typeof val === 'string' ? parseInt(val, 10) : val;
              if (isNaN(num) || num < 2000 || num > 2100) {
                throw new Error('Invalid year: must be a year between 2000 and 2100');
              }
              return num;
            }).optional(),
            awardOnly: z.union([z.boolean(), z.string()]).transform((val) => {
              if (typeof val === 'string') {
                return val.toLowerCase() === 'true';
              }
              return Boolean(val);
            }).default(true),
            includePreviousYear: z.union([z.boolean(), z.string()]).transform((val) => {
              if (typeof val === 'string') {
                return val.toLowerCase() === 'true';
              }
              return Boolean(val);
            }).default(true),
            language: z.string().min(1).default('Korean'),
            outputDirectory: z.string().min(1).optional(),
            maxTokens: z.union([z.number(), z.string()]).transform((val) => {
              const num = typeof val === 'string' ? parseInt(val, 10) : val;
              if (isNaN(num) || num < 2000 || num > 50000) {
                throw new Error('Invalid maxTokens: must be a number between 2000 and 50000');
              }
              return num;
            }).default(32000),
          });
          const parsed = schema.parse(args);
          const clientCapabilities = this.server.server.getClientCapabilities();
          if (!clientCapabilities?.sampling) {
            throw new Error(
              'The connected MCP client does not support sampling/createMessage. Separate per-result LLM requests cannot be guaranteed, so no combined fallback was run.'
            );
          }

          const result = await this.gdwebDesignIndexGenerator.generate(parsed);
          const lines = [
            `GDWEB isolated design-index generation completed for "${result.query}".`,
            `Output directory: ${result.outputDirectory}`,
            `Run ID: ${result.runId}`,
            `Run manifest: ${result.manifestPath}`,
            `Viewer: ${process.env.SECRET_MCP_WEB_ORIGIN ?? 'http://127.0.0.1:4317'}/?run=${encodeURIComponent(result.runId)}`,
            `Search results: ${result.total}`,
            `Generated: ${result.generated}`,
            `Failed: ${result.failed}`,
            `Active exclusions applied: ${result.excluded}`,
            '',
          ];

          result.items.forEach((item, index) => {
            lines.push(`${index + 1}. ${item.referenceId} - ${item.title}`);
            lines.push(`   Status: ${item.status}`);
            if (item.filePath) lines.push(`   File: ${item.filePath}`);
            if (item.model) lines.push(`   Model: ${item.model}`);
            if (item.error) lines.push(`   Error: ${item.error}`);
          });

          return {
            isError: result.failed > 0,
            content: [
              {
                type: 'text' as const,
                text: lines.join('\n'),
              },
            ],
          };
        } catch (error) {
          console.error(`[MCP] Error in generate-gdweb-design-indexes tool handler:`, error);
          throw error;
        }
      }
    );

    // Register the lightweight web search summaries tool (secondary choice for quick results)
    this.server.tool(
      'get-web-search-summaries',
      'Search the web and return only the search result snippets/descriptions without following links to extract full page content. This is a lightweight alternative to full-web-search for when you only need brief search results. For comprehensive information, use full-web-search instead.',
      {
        query: z.string().describe('Search query to execute (lightweight alternative)'),
        limit: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 1 || num > 10) {
            throw new Error('Invalid limit: must be a number between 1 and 10');
          }
          return num;
        }).default(5).describe('Number of search results to return (1-10)'),
      },
      async (args: unknown) => {
        console.error(`[MCP] Tool call received: get-web-search-summaries`);
        console.error(`[MCP] Raw arguments:`, JSON.stringify(args, null, 2));

        try {
          // Validate arguments
          if (typeof args !== 'object' || args === null) {
            throw new Error('Invalid arguments: args must be an object');
          }
          const obj = args as Record<string, unknown>;
          
          if (!obj.query || typeof obj.query !== 'string') {
            throw new Error('Invalid arguments: query is required and must be a string');
          }

          let limit = 5; // default
          if (obj.limit !== undefined) {
            const limitValue = typeof obj.limit === 'string' ? parseInt(obj.limit, 10) : obj.limit;
            if (typeof limitValue !== 'number' || isNaN(limitValue) || limitValue < 1 || limitValue > 10) {
              throw new Error('Invalid limit: must be a number between 1 and 10');
            }
            limit = limitValue;
          }

          console.error(`[MCP] Starting web search summaries...`);
          
          try {
            // Use existing search engine to get results with snippets
            const searchResponse = await this.searchEngine.search({
              query: obj.query,
              numResults: limit,
            });

            // const searchTime = Date.now() - startTime; // Unused for now

            // Convert to summary format (no content extraction)
            const summaryResults = searchResponse.results.map(item => ({
              title: item.title,
              url: item.url,
              description: item.description,
              timestamp: item.timestamp,
            }));

            console.error(`[MCP] Search summaries completed, found ${summaryResults.length} results`);
            
            // Format the results as text
            let responseText = `Search summaries for "${obj.query}" with ${summaryResults.length} results:\n\n`;
            
            summaryResults.forEach((summary, i) => {
              responseText += `**${i + 1}. ${summary.title}**\n`;
              responseText += `URL: ${summary.url}\n`;
              responseText += `Description: ${summary.description}\n`;
              responseText += `\n---\n\n`;
            });

            return {
              content: [
                {
                  type: 'text' as const,
                  text: responseText,
                },
              ],
            };
          } finally {
            // Ensure browsers are cleaned up after search-only operations
            // This prevents EventEmitter memory leaks when browsers accumulate listeners
            try {
              await this.searchEngine.closeAll();
            } catch (cleanupError) {
              console.error(`[MCP] Error during browser cleanup:`, cleanupError);
            }
          }
        } catch (error) {
          console.error(`[MCP] Error in get-web-search-summaries tool handler:`, error);
          throw error;
        }
      }
    );

    // Register the single page content extraction tool
    this.server.tool(
      'get-single-web-page-content',
      'Extract and return the full content from a single web page URL. This tool follows a provided URL and extracts the main page content. Useful for getting detailed content from a specific webpage without performing a search.',
      {
        url: z.string().url().describe('The URL of the web page to extract content from'),
        maxContentLength: z.union([z.number(), z.string()]).transform((val) => {
          const num = typeof val === 'string' ? parseInt(val, 10) : val;
          if (isNaN(num) || num < 0) {
            throw new Error('Invalid maxContentLength: must be a non-negative number');
          }
          return num;
        }).optional().describe('Maximum characters for the extracted content (0 = no limit, undefined = use default limit). Usually not needed - content length is automatically optimized.'),
      },
      async (args: unknown) => {
        console.error(`[MCP] Tool call received: get-single-web-page-content`);
        console.error(`[MCP] Raw arguments:`, JSON.stringify(args, null, 2));

        try {
          // Validate arguments
          if (typeof args !== 'object' || args === null) {
            throw new Error('Invalid arguments: args must be an object');
          }
          const obj = args as Record<string, unknown>;
          
          if (!obj.url || typeof obj.url !== 'string') {
            throw new Error('Invalid arguments: url is required and must be a string');
          }

          let maxContentLength: number | undefined;
          if (obj.maxContentLength !== undefined) {
            const maxLengthValue = typeof obj.maxContentLength === 'string' ? parseInt(obj.maxContentLength, 10) : obj.maxContentLength;
            if (typeof maxLengthValue !== 'number' || isNaN(maxLengthValue) || maxLengthValue < 0) {
              throw new Error('Invalid maxContentLength: must be a non-negative number');
            }
            // If maxContentLength is 0, treat it as "no limit" (undefined)
            maxContentLength = maxLengthValue === 0 ? undefined : maxLengthValue;
          }

          console.error(`[MCP] Starting single page content extraction for: ${obj.url}`);
          
          // Use existing content extractor to get page content
          const content = await this.contentExtractor.extractContent({
            url: obj.url,
            maxContentLength,
          });

          // Get page title from URL (simple extraction)
          const urlObj = new URL(obj.url);
          const title = urlObj.hostname + urlObj.pathname;

          // Create content preview and word count
          // const contentPreview = content.length > 200 ? content.substring(0, 200) + '...' : content; // Unused for now
          const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

          console.error(`[MCP] Single page content extraction completed, extracted ${content.length} characters`);

          // Format the result as text
          let responseText = `**Page Content from: ${obj.url}**\n\n`;
          responseText += `**Title:** ${title}\n`;
          responseText += `**Word Count:** ${wordCount}\n`;
          responseText += `**Content Length:** ${content.length} characters\n\n`;
          
          if (maxContentLength && maxContentLength > 0 && content.length > maxContentLength) {
            responseText += `**Content (truncated at ${maxContentLength} characters):**\n${content.substring(0, maxContentLength)}\n\n[Content truncated at ${maxContentLength} characters]`;
          } else {
            responseText += `**Content:**\n${content}`;
          }

          return {
            content: [
              {
                type: 'text' as const,
                text: responseText,
              },
            ],
          };
        } catch (error) {
          console.error(`[MCP] Error in get-single-web-page-content tool handler:`, error);
          throw error;
        }
      }
    );
  }

  private async sampleGdwebDesignIndex(
    request: GdwebDesignIndexSampleRequest
  ): Promise<{ markdown: string; model: string }> {
    const { reference, contract, samplingImages, language, maxTokens } = request;
    const messages: Array<{
      role: 'user';
      content:
        | { type: 'text'; text: string }
        | { type: 'image'; data: string; mimeType: string };
    }> = [
      {
        role: 'user',
        content: {
          type: 'text',
          text: [
            contract,
            '',
            '## Isolated Request Boundary',
            '',
            `This request contains exactly one GDWEB reference: gdweb-${reference.design.strNo}.`,
            'Do not compare it with, merge it with, or summarize it alongside any other reference.',
            `Write the complete document in ${language}.`,
            'Return only the complete Markdown document. Do not wrap it in commentary.',
          ].join('\n'),
        },
      },
    ];

    samplingImages.forEach((image) => {
      const palette = image.representativeColors
        .map(color =>
          `${color.hex}/${color.rgb}/${color.hsl}/${Number((color.coverage * 100).toFixed(2))}%`
        )
        .join(', ');
      messages.push({
        role: 'user',
        content: {
          type: 'text',
          text: [
            `Evidence image for gdweb-${reference.design.strNo}: ${image.sourceKind} part ${image.part}/${image.totalParts}.`,
            `Source canvas: ${image.sourceWidth}x${image.sourceHeight}px.`,
            `Prepared full canvas: ${image.preparedCanvasWidth}x${image.preparedCanvasHeight}px at scale x=${image.scaleX.toFixed(4)}, y=${image.scaleY.toFixed(4)}.`,
            `Attached prepared crop: x=${image.cropLeft}, y=${image.cropTop}, width=${image.width}, height=${image.height}.`,
            `Mapped source crop: x=${image.sourceCropLeft}, y=${image.sourceCropTop}, width=${image.sourceCropWidth}, height=${image.sourceCropHeight}.`,
            `Measured representative colors: ${palette || 'unavailable'}.`,
            `Encoded bytes: ${image.byteLength}. Source: ${image.sourceUrl}`,
          ].join(' '),
        },
      });
      messages.push({
        role: 'user',
        content: {
          type: 'image',
          data: image.data,
          mimeType: image.mimeType,
        },
      });
    });

    console.error(
      `[MCP] Starting isolated sampling request for gdweb-${reference.design.strNo}`
    );
    const response = await this.server.server.createMessage({
      systemPrompt: [
        'You are a senior frontend measurement and specification author.',
        'Analyze only the single GDWEB reference provided in this sampling request.',
        'Produce a page-by-page, measurement-first reconstruction DESIGN_INDEX, not a multi-reference summary.',
        'Navigation geometry, section bounds, exact color formats, responsive values, evidence coordinates, confidence, and visual QA tolerances are mandatory.',
      ].join(' '),
      messages,
      includeContext: 'none',
      maxTokens,
      temperature: 0.2,
      modelPreferences: {
        intelligencePriority: 1,
        speedPriority: 0.2,
        costPriority: 0.2,
      },
      metadata: {
        task: 'gdweb-design-index',
        referenceId: `gdweb-${reference.design.strNo}`,
      },
    });

    if (response.content.type !== 'text') {
      throw new Error(
        `The isolated LLM request for gdweb-${reference.design.strNo} did not return text`
      );
    }
    if (response.stopReason === 'maxTokens') {
      throw new Error(
        `The isolated LLM request for gdweb-${reference.design.strNo} reached maxTokens before completing`
      );
    }

    console.error(
      `[MCP] Completed isolated sampling request for gdweb-${reference.design.strNo} with ${response.model}`
    );
    return {
      markdown: response.content.text,
      model: response.model,
    };
  }

  private validateAndConvertArgs(args: unknown): WebSearchToolInput {
    if (typeof args !== 'object' || args === null) {
      throw new Error('Invalid arguments: args must be an object');
    }
    const obj = args as Record<string, unknown>;
    // Ensure query is a string
    if (!obj.query || typeof obj.query !== 'string') {
      throw new Error('Invalid arguments: query is required and must be a string');
    }

    // Convert limit to number if it's a string
    let limit = 5; // default
    if (obj.limit !== undefined) {
      const limitValue = typeof obj.limit === 'string' ? parseInt(obj.limit, 10) : obj.limit;
      if (typeof limitValue !== 'number' || isNaN(limitValue) || limitValue < 1 || limitValue > 10) {
        throw new Error('Invalid limit: must be a number between 1 and 10');
      }
      limit = limitValue;
    }

    // Convert includeContent to boolean if it's a string
    let includeContent = true; // default
    if (obj.includeContent !== undefined) {
      if (typeof obj.includeContent === 'string') {
        includeContent = obj.includeContent.toLowerCase() === 'true';
      } else {
        includeContent = Boolean(obj.includeContent);
      }
    }

    return {
      query: obj.query,
      limit,
      includeContent,
    };
  }

  private async handleWebSearch(input: WebSearchToolInput): Promise<WebSearchToolOutput> {
    const startTime = Date.now();
    const { query, limit = 5, includeContent = true } = input;
    
    console.error(`[web-search-mcp] DEBUG: handleWebSearch called with limit=${limit}, includeContent=${includeContent}`);

    try {
      // Request extra search results to account for potential PDF files that will be skipped
      // Request up to 2x the limit or at least 5 extra results, capped at 10 (Google's max)
      const searchLimit = includeContent ? Math.min(limit * 2 + 2, 10) : limit;
      
      console.error(`[web-search-mcp] DEBUG: Requesting ${searchLimit} search results to get ${limit} non-PDF content results`);
      
      // Perform the search
      const searchResponse = await this.searchEngine.search({
        query,
        numResults: searchLimit,
      });
      const searchResults = searchResponse.results;
      
      // Log search summary
      const pdfCount = searchResults.filter(result => isPdfUrl(result.url)).length;
      const followedCount = searchResults.length - pdfCount;
      console.error(`[web-search-mcp] DEBUG: Search engine: ${searchResponse.engine}; ${limit} requested/${searchResults.length} obtained; PDF: ${pdfCount}; ${followedCount} followed.`);

      // Extract content from each result if requested, with target count
      const enhancedResults = includeContent 
        ? await this.contentExtractor.extractContentForResults(searchResults, limit)
        : searchResults.slice(0, limit); // If not extracting content, just take the first 'limit' results
      
      // Log extraction summary with failure reasons and generate combined status
      let combinedStatus = `Search engine: ${searchResponse.engine}; ${limit} result requested/${searchResults.length} obtained; PDF: ${pdfCount}; ${followedCount} followed`;
      
      if (includeContent) {
        const successCount = enhancedResults.filter(r => r.fetchStatus === 'success').length;
        const failedResults = enhancedResults.filter(r => r.fetchStatus === 'error');
        const failedCount = failedResults.length;
        
        const failureReasons = this.categorizeFailureReasons(failedResults);
        const failureReasonText = failureReasons.length > 0 ? ` (${failureReasons.join(', ')})` : '';
        
        console.error(`[web-search-mcp] DEBUG: Links requested: ${limit}; Successfully extracted: ${successCount}; Failed: ${failedCount}${failureReasonText}; Results: ${enhancedResults.length}.`);
        
        // Add extraction info to combined status
        combinedStatus += `; Successfully extracted: ${successCount}; Failed: ${failedCount}; Results: ${enhancedResults.length}`;
      }

      const searchTime = Date.now() - startTime;

      return {
        results: enhancedResults,
        total_results: enhancedResults.length,
        search_time_ms: searchTime,
        query,
        status: combinedStatus,
      };
    } catch (error) {
      console.error('Web search error:', error);
      throw new Error(`Web search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private categorizeFailureReasons(failedResults: SearchResult[]): string[] {
    const reasonCounts = new Map<string, number>();
    
    failedResults.forEach(result => {
      if (result.error) {
        const category = this.categorizeError(result.error);
        reasonCounts.set(category, (reasonCounts.get(category) || 0) + 1);
      }
    });
    
    return Array.from(reasonCounts.entries()).map(([reason, count]) => 
      count > 1 ? `${reason} (${count})` : reason
    );
  }

  private categorizeError(errorMessage: string): string {
    const lowerError = errorMessage.toLowerCase();
    
    if (lowerError.includes('timeout') || lowerError.includes('timed out')) {
      return 'Timeout';
    }
    if (lowerError.includes('403') || lowerError.includes('forbidden')) {
      return 'Access denied';
    }
    if (lowerError.includes('404') || lowerError.includes('not found')) {
      return 'Not found';
    }
    if (lowerError.includes('bot') || lowerError.includes('captcha') || lowerError.includes('unusual traffic')) {
      return 'Bot detection';
    }
    if (lowerError.includes('too large') || lowerError.includes('content length') || lowerError.includes('maxcontentlength')) {
      return 'Content too long';
    }
    if (lowerError.includes('ssl') || lowerError.includes('certificate') || lowerError.includes('tls')) {
      return 'SSL error';
    }
    if (lowerError.includes('network') || lowerError.includes('connection') || lowerError.includes('econnrefused')) {
      return 'Network error';
    }
    if (lowerError.includes('dns') || lowerError.includes('hostname')) {
      return 'DNS error';
    }
    
    return 'Other error';
  }

  private setupGracefulShutdown(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      // Don't exit on unhandled rejections, just log them
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error);
      // Don't exit on uncaught exceptions in MCP context
    });

    // Graceful shutdown - close browsers when process exits
    process.on('SIGINT', async () => {
      console.error('Shutting down gracefully...');
      try {
        await Promise.all([
          this.contentExtractor.closeAll(),
          this.searchEngine.closeAll()
        ]);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
      }
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.error('Shutting down gracefully...');
      try {
        await Promise.all([
          this.contentExtractor.closeAll(),
          this.searchEngine.closeAll()
        ]);
      } catch (error) {
        console.error('Error during graceful shutdown:', error);
      }
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    console.error('Setting up MCP server...');
    const transport = new StdioServerTransport();
    
    console.error('Connecting to transport...');
    await this.server.connect(transport);
    console.error('Secret MCP Server started');
    console.error('Server timestamp:', new Date().toISOString());
    console.error('Waiting for MCP messages...');
  }
}

// Start the server
const server = new SecretMCPServer();
server.run().catch((error: unknown) => {
  if (error instanceof Error) {
    console.error('Server error:', error.message);
  } else {
    console.error('Server error:', error);
  }
  process.exit(1);
});
