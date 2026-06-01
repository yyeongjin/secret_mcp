import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchEngine } from './search-engine.js';
import { SearchResult } from './types.js';
import { generateTimestamp } from './utils.js';

export interface GdwebDesignSearchOptions {
  query: string;
  limit: number;
  year?: number;
  awardOnly?: boolean;
  includePreviousYear?: boolean;
}

export interface GdwebDesignResult {
  title: string;
  gdwebUrl: string;
  siteUrl: string;
  description: string;
  registeredDate: string;
  registeredYear: number;
  award: string;
  concept: string;
  primaryColor: string;
  productionCompany: string;
  imageUrl: string;
  timestamp: string;
}

export class GdwebDesignSearch {
  private readonly searchEngine: SearchEngine;

  constructor(searchEngine: SearchEngine) {
    this.searchEngine = searchEngine;
  }

  async search(options: GdwebDesignSearchOptions): Promise<GdwebDesignResult[]> {
    const targetYear = options.year ?? new Date().getFullYear();
    const awardOnly = options.awardOnly ?? true;
    const includePreviousYear = options.includePreviousYear ?? true;
    const allowedYears = includePreviousYear ? [targetYear, targetYear - 1] : [targetYear];
    const query = [
      'site:gdweb.co.kr/sub/view.asp',
      allowedYears.join(' OR '),
      options.query,
    ].filter(Boolean).join(' ');

    const searchResponse = await this.searchEngine.search({
      query,
      numResults: Math.min(options.limit * 3, 10),
    });

    const detailUrls = this.extractGdwebDetailUrls(searchResponse.results);
    const parsedResults = await Promise.all(
      detailUrls.slice(0, Math.min(options.limit * 3, 10)).map(url => this.parseDetailPage(url))
    );

    return parsedResults
      .filter((result): result is GdwebDesignResult => result !== null)
      .filter(result => allowedYears.includes(result.registeredYear))
      .filter(result => !awardOnly || result.award.length > 0)
      .sort((a, b) => b.registeredYear - a.registeredYear)
      .slice(0, options.limit);
  }

  async getDesignFromGdwebUrl(url: string): Promise<GdwebDesignResult | null> {
    const normalized = this.normalizeGdwebUrl(url);
    if (!normalized) return null;
    return this.parseDetailPage(normalized);
  }

  async getDesignFromStrNo(strNo: string, txtFgbn = '5'): Promise<GdwebDesignResult | null> {
    const url = `https://www.gdweb.co.kr/sub/view.asp?Txt_fgbn=${encodeURIComponent(txtFgbn)}&str_no=${encodeURIComponent(strNo)}`;
    return this.parseDetailPage(url);
  }

  private extractGdwebDetailUrls(results: SearchResult[]): string[] {
    const urls = new Set<string>();

    for (const result of results) {
      const normalized = this.normalizeGdwebUrl(result.url);
      if (normalized) {
        urls.add(normalized);
      }
    }

    return [...urls];
  }

  private normalizeGdwebUrl(url: string): string | null {
    try {
      const parsed = new URL(url);
      if (!parsed.hostname.endsWith('gdweb.co.kr')) return null;
      if (!parsed.pathname.endsWith('/sub/view.asp')) return null;

      const strNo = parsed.searchParams.get('str_no');
      if (!strNo) return null;

      const txtFgbn = parsed.searchParams.get('Txt_fgbn') ?? '5';
      return `https://www.gdweb.co.kr/sub/view.asp?Txt_fgbn=${encodeURIComponent(txtFgbn)}&str_no=${encodeURIComponent(strNo)}`;
    } catch {
      return null;
    }
  }

  private async parseDetailPage(url: string): Promise<GdwebDesignResult | null> {
    try {
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
        },
        timeout: 6000,
        validateStatus: (status: number) => status < 400,
      });

      const $ = cheerio.load(response.data);
      const title = $('.content-info h2').first().text().trim();
      const siteUrl = $('.title-box .url a').first().attr('href')?.trim() ?? '';
      const registeredDate = this.getTableValue($, '등록일');
      const registeredYear = this.parseKoreanYear(registeredDate);
      if (!title || !registeredYear) return null;

      const imagePath = $('.view-area .img-box .img-inner > img').last().attr('src') ?? '';

      return {
        title,
        gdwebUrl: url,
        siteUrl,
        description: `${title} - GDWEB selected design`,
        registeredDate,
        registeredYear,
        award: this.getTableValue($, '수상명'),
        concept: this.getTableValue($, '디자인 컨셉'),
        primaryColor: this.getTableValue($, '주색상'),
        productionCompany: this.getTableValue($, '제작사'),
        imageUrl: imagePath ? new URL(imagePath, url).toString() : '',
        timestamp: generateTimestamp(),
      };
    } catch (error) {
      console.error(`[GdwebDesignSearch] Failed to parse ${url}:`, error);
      return null;
    }
  }

  private getTableValue($: cheerio.CheerioAPI, label: string): string {
    const th = $('th').filter((_, element) => $(element).text().trim() === label).first();
    return th.next('td').text().replace(/\s+/g, ' ').trim();
  }

  private parseKoreanYear(dateText: string): number | null {
    const match = dateText.match(/(\d{4})년/);
    return match ? Number(match[1]) : null;
  }
}
