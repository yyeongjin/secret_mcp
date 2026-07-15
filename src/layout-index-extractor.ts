import { chromium } from 'playwright';
import { generateTimestamp, validateUrl } from './utils.js';

export interface LayoutSection {
  index: number;
  parentIndex: number | null;
  tag: string;
  role: string;
  id: string;
  classes: string[];
  heading: string;
  textSample: string;
  bounds: { x: number; y: number; width: number; height: number };
  layout: {
    display: string;
    position: string;
    flexDirection: string;
    justifyContent: string;
    alignItems: string;
    gridTemplateColumns: string;
    gap: string;
  };
  visual: {
    backgroundColor: string;
    color: string;
    fontFamily: string;
    fontSize: string;
    borderRadius: string;
  };
  content: {
    headings: string[];
    paragraphs: number;
    links: number;
    images: number;
    videos: number;
    callsToAction: string[];
  };
}

export interface DesignLayoutIndex {
  sourceUrl: string;
  finalUrl: string;
  title: string;
  generatedAt: string;
  browser: string;
  viewport: { width: number; height: number };
  page: {
    language: string;
    scrollWidth: number;
    scrollHeight: number;
    bodyBackgroundColor: string;
  };
  designTokens: {
    colors: string[];
    fontFamilies: string[];
    fontSizes: string[];
  };
  sections: LayoutSection[];
}

type LayoutSnapshot = Omit<DesignLayoutIndex, 'sourceUrl' | 'generatedAt' | 'browser'>;

const layoutEvaluator = `
(limit) => {
  const normalize = (value, maxLength = 280) =>
    (value || '').replace(/\\s+/g, ' ').trim().slice(0, maxLength);

  const isVisible = (element) => {
    if (!(element instanceof HTMLElement)) return false;
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    return style.display !== 'none'
      && style.visibility !== 'hidden'
      && Number(style.opacity || '1') > 0
      && rect.width > 40
      && rect.height > 20;
  };

  const semanticSelector = [
    'header', 'nav', 'main', 'section', 'article', 'aside', 'footer',
    '[role="banner"]', '[role="navigation"]', '[role="main"]',
    '[role="region"]', '[role="contentinfo"]'
  ].join(',');

  let candidates = Array.from(document.querySelectorAll(semanticSelector)).filter(isVisible);
  if (candidates.length < 3 && document.body) {
    candidates = candidates.concat(Array.from(document.body.children).filter(isVisible));
  }

  const uniqueCandidates = Array.from(new Set(candidates))
    .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)
    .slice(0, limit);
  const candidateIndexes = new Map(
    uniqueCandidates.map((element, index) => [element, index + 1])
  );

  const topValues = (values, count, ignored = new Set()) => {
    const frequencies = new Map();
    for (const value of values) {
      const normalized = normalize(value, 120);
      if (!normalized || ignored.has(normalized)) continue;
      frequencies.set(normalized, (frequencies.get(normalized) || 0) + 1);
    }
    return Array.from(frequencies.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(([value]) => value);
  };

  const sampledStyles = Array.from(document.querySelectorAll('body *'))
    .filter(isVisible)
    .slice(0, 1200)
    .map((element) => window.getComputedStyle(element));
  const colors = topValues(
    sampledStyles.flatMap((style) => [style.color, style.backgroundColor]),
    12,
    new Set(['rgba(0, 0, 0, 0)', 'transparent'])
  );
  const fontFamilies = topValues(sampledStyles.map((style) => style.fontFamily), 8);
  const fontSizes = topValues(sampledStyles.map((style) => style.fontSize), 10);

  const sections = uniqueCandidates.map((element, arrayIndex) => {
    const style = window.getComputedStyle(element);
    const rect = element.getBoundingClientRect();
    const headings = Array.from(element.querySelectorAll('h1, h2, h3, h4'))
      .filter(isVisible)
      .slice(0, 6)
      .map((heading) => normalize(heading.textContent, 120))
      .filter(Boolean);
    const callsToAction = Array.from(element.querySelectorAll(
      'button, [role="button"], a.cta, a[class*="button"], a[class*="btn"]'
    ))
      .filter(isVisible)
      .slice(0, 8)
      .map((cta) => normalize(cta.textContent || cta.getAttribute('aria-label'), 80))
      .filter(Boolean);

    let parentIndex = null;
    let parent = element.parentElement;
    while (parent && parentIndex === null) {
      parentIndex = candidateIndexes.get(parent) || null;
      parent = parent.parentElement;
    }

    return {
      index: arrayIndex + 1,
      parentIndex,
      tag: element.tagName.toLowerCase(),
      role: element.getAttribute('role') || '',
      id: element.id || '',
      classes: Array.from(element.classList).slice(0, 8),
      heading: headings[0] || normalize(element.getAttribute('aria-label'), 120),
      textSample: normalize(element.textContent),
      bounds: {
        x: Math.round(rect.x),
        y: Math.round(rect.y + window.scrollY),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      },
      layout: {
        display: style.display,
        position: style.position,
        flexDirection: style.flexDirection,
        justifyContent: style.justifyContent,
        alignItems: style.alignItems,
        gridTemplateColumns: style.gridTemplateColumns,
        gap: style.gap
      },
      visual: {
        backgroundColor: style.backgroundColor,
        color: style.color,
        fontFamily: style.fontFamily,
        fontSize: style.fontSize,
        borderRadius: style.borderRadius
      },
      content: {
        headings,
        paragraphs: element.querySelectorAll('p').length,
        links: element.querySelectorAll('a[href]').length,
        images: element.querySelectorAll('img, picture').length,
        videos: element.querySelectorAll('video').length,
        callsToAction
      }
    };
  });

  const bodyStyle = document.body ? window.getComputedStyle(document.body) : null;
  return {
    finalUrl: window.location.href,
    title: document.title,
    viewport: { width: window.innerWidth, height: window.innerHeight },
    page: {
      language: document.documentElement.lang || '',
      scrollWidth: document.documentElement.scrollWidth,
      scrollHeight: document.documentElement.scrollHeight,
      bodyBackgroundColor: bodyStyle ? bodyStyle.backgroundColor : ''
    },
    designTokens: { colors, fontFamilies, fontSizes },
    sections
  };
}`;

export async function generateLayoutIndex(
  url: string,
  maxSections = 24
): Promise<DesignLayoutIndex> {
  if (!validateUrl(url)) {
    throw new Error('Layout index URL must use http or https');
  }

  const sectionLimit = Math.min(Math.max(maxSections, 1), 50);
  const browser = await chromium.launch({
    headless: process.env.BROWSER_HEADLESS !== 'false',
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1100 },
    locale: 'ko-KR',
    colorScheme: 'light',
    reducedMotion: 'reduce',
  });

  try {
    const page = await context.newPage();
    await page.goto(url, {
      waitUntil: 'domcontentloaded',
      timeout: 15000,
    });
    await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => undefined);
    const snapshot = await page.evaluate(
      `(${layoutEvaluator})(${sectionLimit})`
    ) as LayoutSnapshot;

    return {
      sourceUrl: url,
      generatedAt: generateTimestamp(),
      browser: 'chromium',
      ...snapshot,
    };
  } finally {
    await context.close();
    await browser.close();
  }
}

const cleanInline = (value: string): string =>
  value.replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();

export function formatLayoutIndexMarkdown(
  index: DesignLayoutIndex,
  includeRawJson = false
): string {
  const lines: string[] = [
    '# Web Design Layout Index',
    '',
    `- Source URL: ${index.sourceUrl}`,
    `- Final URL: ${index.finalUrl}`,
    `- Page title: ${index.title || 'N/A'}`,
    `- Generated at: ${index.generatedAt}`,
    `- Browser: ${index.browser}`,
    `- Viewport: ${index.viewport.width} x ${index.viewport.height}`,
    `- Page size: ${index.page.scrollWidth} x ${index.page.scrollHeight}`,
    '',
    '## Observed Design Tokens',
    '',
    `- Colors: ${index.designTokens.colors.join(', ') || 'N/A'}`,
    `- Font families: ${index.designTokens.fontFamilies.join(', ') || 'N/A'}`,
    `- Font sizes: ${index.designTokens.fontSizes.join(', ') || 'N/A'}`,
    '',
    '## Layout Outline',
    '',
    '| # | Parent | Element | Heading | Bounds | Layout | Content |',
    '| --- | --- | --- | --- | --- | --- | --- |',
  ];

  for (const section of index.sections) {
    const identity = [
      section.tag,
      section.role ? `[role=${section.role}]` : '',
      section.id ? `#${section.id}` : '',
      ...section.classes.slice(0, 3).map(className => `.${className}`),
    ].filter(Boolean).join('');
    const layout = [
      section.layout.display,
      section.layout.display.includes('flex') ? section.layout.flexDirection : '',
      section.layout.display.includes('grid') ? section.layout.gridTemplateColumns : '',
      section.layout.gap !== 'normal' ? `gap ${section.layout.gap}` : '',
    ].filter(Boolean).join(', ');
    const content = [
      `${section.content.headings.length} headings`,
      `${section.content.paragraphs} paragraphs`,
      `${section.content.images} images`,
      `${section.content.links} links`,
    ].join(', ');

    lines.push(
      `| ${section.index} | ${section.parentIndex ?? '-'} | ${cleanInline(identity)} | ${cleanInline(section.heading || 'N/A')} | ${section.bounds.width} x ${section.bounds.height} @ y=${section.bounds.y} | ${cleanInline(layout)} | ${content} |`
    );
  }

  lines.push('', '## Section Details', '');
  for (const section of index.sections) {
    lines.push(
      `### ${section.index}. ${section.heading || section.tag}`,
      '',
      `- Parent section: ${section.parentIndex ?? 'root'}`,
      `- Position: ${section.layout.position}`,
      `- Alignment: justify=${section.layout.justifyContent}, align=${section.layout.alignItems}`,
      `- Visual: background=${section.visual.backgroundColor}, color=${section.visual.color}, radius=${section.visual.borderRadius}`,
      `- Typography: ${section.visual.fontFamily}, ${section.visual.fontSize}`,
      `- Calls to action: ${section.content.callsToAction.join(', ') || 'N/A'}`,
      `- Text sample: ${section.textSample || 'N/A'}`,
      ''
    );
  }

  lines.push(
    '## Planning Use',
    '',
    '- Treat this document as measured layout evidence, not a finished design plan.',
    '- Preserve hierarchy and interaction intent while adapting copy, branding, and assets.',
    '- Validate the implementation plan against the target audience and web research.'
  );

  if (includeRawJson) {
    lines.push('', '## Raw Layout Data', '', '```json', JSON.stringify(index, null, 2), '```');
  }

  return lines.join('\n');
}
