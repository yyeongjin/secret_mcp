import sharp from 'sharp';
import { GdwebDesignImage } from './gdweb-design-search.js';

const DESKTOP_TARGET_WIDTH = 1200;
const DESKTOP_TILE_HEIGHT = 1600;
const DESKTOP_TILE_OVERLAP = 80;
const JPEG_QUALITY = 78;
const PALETTE_SAMPLE_SIZE = 180;
const PALETTE_SIZE = 8;

export interface GdwebSampledColor {
  hex: string;
  rgb: string;
  hsl: string;
  coverage: number;
}

export interface GdwebSamplingImage {
  sourceKind: 'desktop' | 'mobile';
  part: number;
  totalParts: number;
  sourceUrl: string;
  sourceWidth: number;
  sourceHeight: number;
  preparedCanvasWidth: number;
  preparedCanvasHeight: number;
  scaleX: number;
  scaleY: number;
  cropLeft: number;
  cropTop: number;
  width: number;
  height: number;
  sourceCropLeft: number;
  sourceCropTop: number;
  sourceCropWidth: number;
  sourceCropHeight: number;
  representativeColors: GdwebSampledColor[];
  mimeType: 'image/jpeg';
  data: string;
  byteLength: number;
}

export async function prepareGdwebSamplingImages(
  sourceImages: GdwebDesignImage[]
): Promise<GdwebSamplingImage[]> {
  const prepared: GdwebSamplingImage[] = [];

  for (const source of sourceImages) {
    if (source.kind === 'mobile') {
      prepared.push(await prepareMobileImage(source));
      continue;
    }

    prepared.push(...await prepareDesktopTiles(source));
  }

  return prepared;
}

async function prepareMobileImage(
  source: GdwebDesignImage
): Promise<GdwebSamplingImage> {
  const output = await sharp(Buffer.from(source.data, 'base64'))
    .rotate()
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  const scaleX = output.info.width / source.width;
  const scaleY = output.info.height / source.height;

  return {
    sourceKind: source.kind,
    part: 1,
    totalParts: 1,
    sourceUrl: source.url,
    sourceWidth: source.width,
    sourceHeight: source.height,
    preparedCanvasWidth: output.info.width,
    preparedCanvasHeight: output.info.height,
    scaleX,
    scaleY,
    cropLeft: 0,
    cropTop: 0,
    width: output.info.width,
    height: output.info.height,
    sourceCropLeft: 0,
    sourceCropTop: 0,
    sourceCropWidth: source.width,
    sourceCropHeight: source.height,
    representativeColors: await extractRepresentativeColors(output.data),
    mimeType: 'image/jpeg',
    data: output.data.toString('base64'),
    byteLength: output.data.byteLength,
  };
}

async function prepareDesktopTiles(
  source: GdwebDesignImage
): Promise<GdwebSamplingImage[]> {
  const resized = await sharp(Buffer.from(source.data, 'base64'))
    .rotate()
    .resize({
      width: Math.min(source.width, DESKTOP_TARGET_WIDTH),
      withoutEnlargement: true,
    })
    .flatten({ background: '#ffffff' })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  const width = resized.info.width;
  const height = resized.info.height;
  const scaleX = width / source.width;
  const scaleY = height / source.height;
  const ranges = getVerticalTileRanges(height);
  const tiles: GdwebSamplingImage[] = [];

  for (const [index, range] of ranges.entries()) {
    const tile = await sharp(resized.data)
      .extract({
        left: 0,
        top: range.top,
        width,
        height: range.height,
      })
      .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
      .toBuffer();
    const sourceCropTop = Math.round(range.top / scaleY);
    const sourceCropHeight = Math.min(
      source.height - sourceCropTop,
      Math.round(range.height / scaleY)
    );

    tiles.push({
      sourceKind: source.kind,
      part: index + 1,
      totalParts: ranges.length,
      sourceUrl: source.url,
      sourceWidth: source.width,
      sourceHeight: source.height,
      preparedCanvasWidth: width,
      preparedCanvasHeight: height,
      scaleX,
      scaleY,
      cropLeft: 0,
      cropTop: range.top,
      width,
      height: range.height,
      sourceCropLeft: 0,
      sourceCropTop,
      sourceCropWidth: source.width,
      sourceCropHeight,
      representativeColors: await extractRepresentativeColors(tile),
      mimeType: 'image/jpeg',
      data: tile.toString('base64'),
      byteLength: tile.byteLength,
    });
  }

  return tiles;
}

function getVerticalTileRanges(
  imageHeight: number
): Array<{ top: number; height: number }> {
  if (imageHeight <= DESKTOP_TILE_HEIGHT) {
    return [{ top: 0, height: imageHeight }];
  }

  const ranges: Array<{ top: number; height: number }> = [];
  let top = 0;

  while (top < imageHeight) {
    const height = Math.min(DESKTOP_TILE_HEIGHT, imageHeight - top);
    ranges.push({ top, height });
    if (top + height >= imageHeight) break;
    top += height - DESKTOP_TILE_OVERLAP;
  }

  return ranges;
}

async function extractRepresentativeColors(
  image: Buffer
): Promise<GdwebSampledColor[]> {
  const sampled = await sharp(image)
    .resize({
      width: PALETTE_SAMPLE_SIZE,
      height: PALETTE_SAMPLE_SIZE,
      fit: 'inside',
      withoutEnlargement: true,
    })
    .flatten({ background: '#ffffff' })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const counts = new Map<number, number>();
  const channels = sampled.info.channels;
  const pixelCount = sampled.data.length / channels;

  for (let offset = 0; offset < sampled.data.length; offset += channels) {
    const red = quantizeChannel(sampled.data[offset]);
    const green = quantizeChannel(sampled.data[offset + 1]);
    const blue = quantizeChannel(sampled.data[offset + 2]);
    const key = (red << 16) | (green << 8) | blue;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }

  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, PALETTE_SIZE)
    .map(([key, count]) => {
      const red = (key >> 16) & 0xff;
      const green = (key >> 8) & 0xff;
      const blue = key & 0xff;
      return {
        hex: `#${key.toString(16).padStart(6, '0').toUpperCase()}`,
        rgb: `rgb(${red}, ${green}, ${blue})`,
        hsl: rgbToHsl(red, green, blue),
        coverage: Number((count / pixelCount).toFixed(4)),
      };
    });
}

function quantizeChannel(value: number): number {
  return Math.min(255, Math.round(value / 17) * 17);
}

function rgbToHsl(red: number, green: number, blue: number): string {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  let hue = 0;

  if (delta > 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    if (max === g) hue = 60 * ((b - r) / delta + 2);
    if (max === b) hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;

  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));
  return `hsl(${Math.round(hue)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%)`;
}
