import axios from 'axios';
import * as cheerio from 'cheerio';
import { generateTimestamp } from './utils.js';

const GDWEB_BASE_URL = 'https://www.gdweb.co.kr';
const GDWEB_SEARCH_URL = `${GDWEB_BASE_URL}/sub/search.asp`;
const GDWEB_REQUEST_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept-Language': 'ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7',
};

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

interface GdwebSearchCandidate {
  gdwebUrl: string;
  registeredYear: number;
}

export class GdwebDesignSearch {
  async search(options: GdwebDesignSearchOptions): Promise<GdwebDesignResult[]> {
    const query = options.query.trim();
    if (!query) {
      throw new Error('GDWEB search query must not be empty');
    }

    const targetYear = options.year ?? new Date().getFullYear();
    const awardOnly = options.awardOnly ?? true;
    const includePreviousYear = options.includePreviousYear ?? true;
    const allowedYears = includePreviousYear ? [targetYear, targetYear - 1] : [targetYear];
    const candidates = await this.searchGdweb(query);
    const freshCandidates = candidates
      .filter(candidate => allowedYears.includes(candidate.registeredYear))
      .slice(0, Math.min(options.limit * 4, 40));

    const parsedResults = await Promise.all(
      freshCandidates.map(candidate => this.parseDetailPage(candidate.gdwebUrl))
    );

    return parsedResults
      .filter((result): result is GdwebDesignResult => result !== null)
      .filter(result => allowedYears.includes(result.registeredYear))
      .filter(result => !awardOnly || result.award.length > 0)
      .slice(0, options.limit);
  }

  private async searchGdweb(query: string): Promise<GdwebSearchCandidate[]> {
    const body = new URLSearchParams({ Txt_word: query });
    const response = await axios.post(GDWEB_SEARCH_URL, body.toString(), {
      headers: {
        ...GDWEB_REQUEST_HEADERS,
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Origin: GDWEB_BASE_URL,
        Referer: `${GDWEB_BASE_URL}/main/`,
      },
      timeout: 10000,
      validateStatus: (status: number) => status < 400,
    });

    const $ = cheerio.load(response.data);
    const candidates: GdwebSearchCandidate[] = [];
    const seen = new Set<string>();

    $('a[href*="/sub/view.asp"]').each((_, element) => {
      const href = $(element).attr('href');
      if (!href) return;

      const item = $(element).closest('li');
      const registeredYear = this.parseCompactYear(item.find('.date').first().text());
      if (!registeredYear) return;

      const gdwebUrl = this.normalizeGdwebUrl(href);
      if (!gdwebUrl || seen.has(gdwebUrl)) return;

      seen.add(gdwebUrl);
      candidates.push({ gdwebUrl, registeredYear });
    });

    return candidates;
  }

  private normalizeGdwebUrl(url: string): string | null {
    try {
      const parsed = new URL(url, GDWEB_BASE_URL);
      if (!parsed.hostname.endsWith('gdweb.co.kr')) return null;
      if (!parsed.pathname.endsWith('/sub/view.asp')) return null;

      const strNo = parsed.searchParams.get('str_no');
      if (!strNo) return null;

      const txtFgbn = parsed.searchParams.get('Txt_fgbn') ?? '5';
      return `${GDWEB_BASE_URL}/sub/view.asp?Txt_fgbn=${encodeURIComponent(txtFgbn)}&str_no=${encodeURIComponent(strNo)}`;
    } catch {
      return null;
    }
  }

  private async parseDetailPage(url: string): Promise<GdwebDesignResult | null> {
    try {
      const response = await axios.get(url, {
        headers: GDWEB_REQUEST_HEADERS,
        timeout: 6000,
        validateStatus: (status: number) => status < 400,
      });

      const $ = cheerio.load(response.data);
      const title = $('.content-info h2').first().text().trim();
      const registeredDate = this.getTableValue($, '등록일');
      const registeredYear = this.parseKoreanYear(registeredDate);
      if (!title || !registeredYear) return null;

      const imagePath = $('.view-area .img-box .img-inner > img').last().attr('src') ?? '';

      return {
        title,
        gdwebUrl: url,
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

  private parseCompactYear(dateText: string): number | null {
    const match = dateText.trim().match(/^(\d{2}|\d{4})\./);
    if (!match) return null;

    const value = Number(match[1]);
    return match[1].length === 2 ? 2000 + value : value;
  }

  private parseKoreanYear(dateText: string): number | null {
    const match = dateText.match(/(\d{4})년/);
    return match ? Number(match[1]) : null;
  }
}
