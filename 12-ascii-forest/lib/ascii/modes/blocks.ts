import type { SampledCell } from "../sample";

// ─── Shared Bayer 4×4 matrix ───────────────────────────────────────────────

export const BAYER4: readonly number[] = [
   0,  8,  2, 10,
  12,  4, 14,  6,
   3, 11,  1,  9,
  15,  7, 13,  5,
];

/** Normalised Bayer threshold (0..1) for sub-pixel (bx,by) in 0..3 range. */
export function bayerThreshold(bx: number, by: number): number {
  return BAYER4[(by & 3) * 4 + (bx & 3)] / 16;
}

// ─── Deterministic hash ────────────────────────────────────────────────────

/** Fast integer hash — deterministic, no allocations. */
export function cellHash(index: number): number {
  let h = index ^ 0xdeadbeef;
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
  return (h ^ (h >>> 16)) >>> 0;
}

// ─── Helper: cell fill colour string ──────────────────────────────────────

function cellColor(cell: SampledCell): string {
  return `rgb(${Math.round(cell.r)},${Math.round(cell.g)},${Math.round(cell.b)})`;
}

// ─── Dither ───────────────────────────────────────────────────────────────

export function drawDither(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  const { x, y, w, h } = cell;
  const color = cellColor(cell);
  // 4×4 ordered dither over the cell
  const sx = Math.max(1, Math.floor(w / 4));
  const sy = Math.max(1, Math.floor(h / 4));
  ctx.fillStyle = color;
  for (let by = 0; by < 4; by++) {
    for (let bx = 0; bx < 4; bx++) {
      if (L > bayerThreshold(bx, by)) {
        ctx.fillRect(x + bx * sx, y + by * sy, sx, sy);
      }
    }
  }
}

// ─── Mosaic ───────────────────────────────────────────────────────────────

export function drawMosaic(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  const { x, y, w, h } = cell;
  if (L < 0.04) return;
  ctx.fillStyle = cellColor(cell);
  ctx.fillRect(x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h - 2));
}

// ─── Pixel ────────────────────────────────────────────────────────────────

export function drawPixel(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  ctx.fillStyle = cellColor(cell);
  ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
}

// ─── Dots ─────────────────────────────────────────────────────────────────

export function drawDots(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  const r = Math.sqrt(L) * Math.min(cell.w, cell.h) / 2;
  if (r < 0.5) return;
  ctx.fillStyle = cellColor(cell);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();
}

// ─── Cross ────────────────────────────────────────────────────────────────

export function drawCross(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const { x, y, w, h } = cell;
  const t = Math.max(1, L * Math.min(w, h) * 0.5);
  ctx.fillStyle = cellColor(cell);
  // Horizontal bar
  ctx.fillRect(x, y + h / 2 - t / 2, w, t);
  // Vertical bar
  ctx.fillRect(x + w / 2 - t / 2, y, t, h);
}

// ─── Diamond ─────────────────────────────────────────────────────────────

export function drawDiamond(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  const rx = (L * cell.w) / 2;
  const ry = (L * cell.h) / 2;
  ctx.fillStyle = cellColor(cell);
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry);
  ctx.lineTo(cx + rx, cy);
  ctx.lineTo(cx, cy + ry);
  ctx.lineTo(cx - rx, cy);
  ctx.closePath();
  ctx.fill();
}

// ─── Voxel ────────────────────────────────────────────────────────────────

export function drawVoxel(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const { x, y, w, h } = cell;
  const r = cell.r, g = cell.g, b = cell.b;
  // Top face
  ctx.fillStyle = `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  const hw = w * 0.5;
  const qh = h * 0.25;
  // Top face (parallelogram)
  ctx.beginPath();
  ctx.moveTo(x + hw, y);
  ctx.lineTo(x + w, y + qh);
  ctx.lineTo(x + hw, y + h * 0.5);
  ctx.lineTo(x, y + qh);
  ctx.closePath();
  ctx.fill();
  // Left face (darker)
  ctx.fillStyle = `rgb(${Math.round(r * 0.65)},${Math.round(g * 0.65)},${Math.round(b * 0.65)})`;
  ctx.beginPath();
  ctx.moveTo(x, y + qh);
  ctx.lineTo(x + hw, y + h * 0.5);
  ctx.lineTo(x + hw, y + h);
  ctx.lineTo(x, y + h * 0.75);
  ctx.closePath();
  ctx.fill();
  // Right face (medium dark)
  ctx.fillStyle = `rgb(${Math.round(r * 0.8)},${Math.round(g * 0.8)},${Math.round(b * 0.8)})`;
  ctx.beginPath();
  ctx.moveTo(x + hw, y + h * 0.5);
  ctx.lineTo(x + w, y + qh);
  ctx.lineTo(x + w, y + h * 0.75);
  ctx.lineTo(x + hw, y + h);
  ctx.closePath();
  ctx.fill();
}

// ─── Lego ─────────────────────────────────────────────────────────────────

export function drawLego(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const { x, y, w, h } = cell;
  const color = cellColor(cell);
  // Brick body
  ctx.fillStyle = color;
  ctx.fillRect(x + 1, y + 1, w - 2, h - 2);
  // Stud circle
  const r = Math.min(w, h) * 0.22;
  ctx.fillStyle = `rgba(255,255,255,0.25)`;
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, r, 0, Math.PI * 2);
  ctx.fill();
  // Stud border
  ctx.strokeStyle = `rgba(0,0,0,0.3)`;
  ctx.lineWidth = 0.5;
  ctx.stroke();
}

// ─── Mixed ────────────────────────────────────────────────────────────────

export function drawMixed(
  ctx: CanvasRenderingContext2D,
  cell: SampledCell,
  L: number,
  cellIndex: number
): void {
  const t = cellHash(cellIndex) % 3;
  if (t === 0) drawDots(ctx, cell, L);
  else if (t === 1) drawCross(ctx, cell, L);
  else drawMosaic(ctx, cell, L);
}
