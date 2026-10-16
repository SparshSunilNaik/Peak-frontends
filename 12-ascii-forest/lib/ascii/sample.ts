import type { TonePoint } from "./types";

// ─── Public helpers (exported for check-pure.ts) ───────────────────────────

/** Build a 256-entry lookup table from piecewise-linear tone curve points. */
export function buildToneLUT(points: TonePoint[]): Uint8Array {
  const lut = new Uint8Array(256);
  // Sort by x
  const pts = [...points].sort((a, b) => a.x - b.x);

  for (let i = 0; i < 256; i++) {
    const x = i / 255;
    // Find surrounding segment
    let lo = pts[0];
    let hi = pts[pts.length - 1];
    for (let j = 0; j < pts.length - 1; j++) {
      if (x >= pts[j].x && x <= pts[j + 1].x) {
        lo = pts[j];
        hi = pts[j + 1];
        break;
      }
    }
    let y: number;
    if (hi.x === lo.x) {
      y = (lo.y + hi.y) / 2;
    } else {
      const t = (x - lo.x) / (hi.x - lo.x);
      y = lo.y + t * (hi.y - lo.y);
    }
    lut[i] = Math.round(Math.min(1, Math.max(0, y)) * 255);
  }
  return lut;
}

// ─── Sampled grid ─────────────────────────────────────────────────────────

export interface SampledCell {
  r: number;  // 0..255 average
  g: number;
  b: number;
  lum: number;  // 0..1 tone-curved luminance (Rec.709)
  edge: number; // 0..1 Sobel edge magnitude
  col: number;  // grid column index
  row: number;  // grid row index
  x: number;    // pixel x of cell top-left
  y: number;    // pixel y of cell top-left
  w: number;    // cell width in pixels
  h: number;    // cell height in pixels
}

export interface SampledGrid {
  cells: SampledCell[];
  cols: number;
  rows: number;
  cellW: number;
  cellH: number;
}

// ─── Cache key ─────────────────────────────────────────────────────────────

interface CacheKey {
  imgSrc: string;
  canvasW: number;
  canvasH: number;
  cellSize: number;
  toneStr: string;
}

let _cache: { key: CacheKey; grid: SampledGrid } | null = null;

function cacheKeyEq(a: CacheKey, b: CacheKey): boolean {
  return (
    a.imgSrc === b.imgSrc &&
    a.canvasW === b.canvasW &&
    a.canvasH === b.canvasH &&
    a.cellSize === b.cellSize &&
    a.toneStr === b.toneStr
  );
}

// ─── Main sampling function ────────────────────────────────────────────────

export function sampleImage(
  img: HTMLImageElement,
  canvasW: number,
  canvasH: number,
  cellSize: number,
  toneCurvePoints: TonePoint[]
): SampledGrid {
  const toneStr = JSON.stringify(toneCurvePoints);
  const key: CacheKey = {
    imgSrc: img.src,
    canvasW,
    canvasH,
    cellSize,
    toneStr,
  };

  if (_cache && cacheKeyEq(_cache.key, key)) {
    return _cache.grid;
  }

  // Draw image into offscreen canvas with object-fit cover
  const offscreen = new OffscreenCanvas(canvasW, canvasH);
  const oc = offscreen.getContext("2d")!;

  const scale = Math.max(canvasW / img.naturalWidth, canvasH / img.naturalHeight);
  const drawW = img.naturalWidth * scale;
  const drawH = img.naturalHeight * scale;
  const drawX = (canvasW - drawW) / 2;
  const drawY = (canvasH - drawH) / 2;
  oc.drawImage(img, drawX, drawY, drawW, drawH);

  const pixelData = oc.getImageData(0, 0, canvasW, canvasH);
  const data = pixelData.data;

  const lut = buildToneLUT(toneCurvePoints);
  const cols = Math.max(1, Math.floor(canvasW / cellSize));
  const rows = Math.max(1, Math.floor(canvasH / cellSize));
  const cellW = canvasW / cols;
  const cellH = canvasH / rows;

  // Build raw luminance grid for Sobel
  const rawLum = new Float32Array(cols * rows);

  // Per-cell average
  const avgR = new Float32Array(cols * rows);
  const avgG = new Float32Array(cols * rows);
  const avgB = new Float32Array(cols * rows);

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const x0 = Math.round(col * cellW);
      const y0 = Math.round(row * cellH);
      const x1 = Math.min(canvasW, Math.round((col + 1) * cellW));
      const y1 = Math.min(canvasH, Math.round((row + 1) * cellH));
      let sumR = 0, sumG = 0, sumB = 0, cnt = 0;
      for (let py = y0; py < y1; py++) {
        for (let px = x0; px < x1; px++) {
          const idx = (py * canvasW + px) * 4;
          sumR += data[idx];
          sumG += data[idx + 1];
          sumB += data[idx + 2];
          cnt++;
        }
      }
      if (cnt === 0) cnt = 1;
      const ci = row * cols + col;
      avgR[ci] = sumR / cnt;
      avgG[ci] = sumG / cnt;
      avgB[ci] = sumB / cnt;
      // Rec.709 luminance
      const lRaw = (0.2126 * avgR[ci] + 0.7152 * avgG[ci] + 0.0722 * avgB[ci]) / 255;
      // Apply tone curve via LUT
      const lutIdx = Math.round(lRaw * 255);
      rawLum[ci] = lut[Math.min(255, Math.max(0, lutIdx))] / 255;
    }
  }

  // Sobel edge detection on the luminance grid
  const edgeMag = new Float32Array(cols * rows);
  for (let row = 1; row < rows - 1; row++) {
    for (let col = 1; col < cols - 1; col++) {
      const tl = rawLum[(row - 1) * cols + col - 1];
      const t  = rawLum[(row - 1) * cols + col];
      const tr = rawLum[(row - 1) * cols + col + 1];
      const l  = rawLum[row * cols + col - 1];
      const r  = rawLum[row * cols + col + 1];
      const bl = rawLum[(row + 1) * cols + col - 1];
      const b  = rawLum[(row + 1) * cols + col];
      const br = rawLum[(row + 1) * cols + col + 1];
      const gx = -tl - 2 * l - bl + tr + 2 * r + br;
      const gy = -tl - 2 * t - tr + bl + 2 * b + br;
      edgeMag[row * cols + col] = Math.min(1, Math.sqrt(gx * gx + gy * gy) / 4);
    }
  }

  const cells: SampledCell[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      const ci = row * cols + col;
      cells.push({
        r: avgR[ci],
        g: avgG[ci],
        b: avgB[ci],
        lum: rawLum[ci],
        edge: edgeMag[ci],
        col,
        row,
        x: Math.round(col * cellW),
        y: Math.round(row * cellH),
        w: Math.round((col + 1) * cellW) - Math.round(col * cellW),
        h: Math.round((row + 1) * cellH) - Math.round(row * cellH),
      });
    }
  }

  const grid: SampledGrid = { cells, cols, rows, cellW, cellH };
  _cache = { key, grid };
  return grid;
}

/** Invalidate the sampling cache (call when params that affect sampling change). */
export function invalidateSampleCache(): void {
  _cache = null;
}
