import sharp from 'sharp';
import { GdwebDesignImage } from './gdweb-design-search.js';

const DESKTOP_TARGET_WIDTH = 1200;
const DESKTOP_TILE_HEIGHT = 1600;
const DESKTOP_TILE_OVERLAP = 80;
const JPEG_QUALITY = 78;

export interface GdwebSamplingImage {
  sourceKind: 'desktop' | 'mobile';
  part: number;
  totalParts: number;
  sourceUrl: string;
  width: number;
  height: number;
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

  return {
    sourceKind: source.kind,
    part: 1,
    totalParts: 1,
    sourceUrl: source.url,
    width: output.info.width,
    height: output.info.height,
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

    tiles.push({
      sourceKind: source.kind,
      part: index + 1,
      totalParts: ranges.length,
      sourceUrl: source.url,
      width,
      height: range.height,
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
