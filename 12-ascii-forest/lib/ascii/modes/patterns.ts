import type { SampledCell } from "../sample";
import { bayerThreshold, cellHash } from "./blocks";

// ─── Helper ───────────────────────────────────────────────────────────────

function cellColor(cell: SampledCell): string {
  return `rgb(${Math.round(cell.r)},${Math.round(cell.g)},${Math.round(cell.b)})`;
}

// ─── Lines ────────────────────────────────────────────────────────────────

export function drawLines(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const { x, y, w, h } = cell;
  const barH = Math.max(1, L * h);
  ctx.fillStyle = cellColor(cell);
  ctx.fillRect(x, y + (h - barH) / 2, w, barH);
}

// ─── Diagonal ─────────────────────────────────────────────────────────────

export function drawDiagonal(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const { x, y, w, h } = cell;
  const lw = Math.max(0.5, L * Math.min(w, h) * 0.7);
  ctx.strokeStyle = cellColor(cell);
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}

// ─── Braille ──────────────────────────────────────────────────────────────

// 2×4 grid of dots; compare sub-dot luminance to a Bayer threshold
export function drawBraille(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  const { x, y, w, h } = cell;
  const dr = Math.min(w, h) / 10;
  ctx.fillStyle = cellColor(cell);
  for (let by = 0; by < 4; by++) {
    for (let bx = 0; bx < 2; bx++) {
      if (L > bayerThreshold(bx * 2, by)) {
        const cx = x + (bx + 0.5) * (w / 2);
        const cy = y + (by + 0.5) * (h / 4);
        ctx.beginPath();
        ctx.arc(cx, cy, dr, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
}

// ─── Disco ────────────────────────────────────────────────────────────────

export function drawDisco(
  ctx: CanvasRenderingContext2D,
  cell: SampledCell,
  L: number,
  time: number
): void {
  if (L < 0.04) return;
  const hue = ((time * 60 + cellHash(cell.row * 1000 + cell.col) % 360)) % 360;
  ctx.fillStyle = `hsl(${hue},90%,${Math.round(30 + L * 40)}%)`;
  ctx.fillRect(cell.x, cell.y, cell.w, cell.h);
}

// ─── Hexdump ──────────────────────────────────────────────────────────────

const HEX_DIGITS = "0123456789ABCDEF";

export function drawHexdump(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  const idx = Math.min(15, Math.floor(L * 16));
  const ch = HEX_DIGITS[idx];
  const fontSize = Math.max(4, cell.w * 1.05);
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = cellColor(cell);
  ctx.fillText(ch, cell.x + cell.w / 2, cell.y + cell.h / 2);
}

// ─── Matrix ───────────────────────────────────────────────────────────────

const MATRIX_GLYPHS = "ｦｧｨｩｪｫｬｭｮｯｰｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜﾝ0123456789";

export function drawMatrix(
  ctx: CanvasRenderingContext2D,
  cell: SampledCell,
  L: number,
  time: number
): void {
  if (L < 0.04) return;
  const col = cell.col;
  const colSpeed = 0.5 + (cellHash(col * 7) % 100) / 100;
  // Head position (in rows) for this column, wraps every few seconds
  const headRow = Math.floor(time * colSpeed * 20) % Math.max(1, cell.row + 1);
  const distFromHead = cell.row - headRow;

  let alpha: number;
  if (distFromHead === 0) {
    alpha = 1; // bright head
  } else if (distFromHead > 0 && distFromHead < 6) {
    alpha = Math.max(0, 1 - distFromHead / 6);
  } else {
    // Sparse tail determined by glyph density and L
    const h = cellHash(col * 31 + cell.row * 97);
    if ((h % 100) / 100 > L) return;
    alpha = 0.15 + L * 0.2;
  }

  const gIdx = cellHash(col * 13 + cell.row * 53 + Math.floor(time * 5)) % MATRIX_GLYPHS.length;
  const ch = MATRIX_GLYPHS[gIdx];
  const fontSize = Math.max(4, cell.w);
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = distFromHead === 0
    ? `rgba(180,255,200,${alpha})`
    : `rgba(0,255,102,${alpha})`;
  ctx.fillText(ch, cell.x + cell.w / 2, cell.y + cell.h / 2);
}

// ─── Hatch ────────────────────────────────────────────────────────────────

export function drawHatch(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.08) return;
  const { x, y, w, h } = cell;
  ctx.strokeStyle = cellColor(cell);
  ctx.lineWidth = 0.8;
  ctx.save();
  ctx.rect(x, y, w, h);
  ctx.clip();
  // First family (light tones)
  if (L > 0.2) {
    for (let d = -h; d < w + h; d += 4) {
      ctx.beginPath();
      ctx.moveTo(x + d, y);
      ctx.lineTo(x + d + h, y + h);
      ctx.stroke();
    }
  }
  // Second family (darker tones — crossing strokes)
  if (L > 0.6) {
    for (let d = -h; d < w + h; d += 4) {
      ctx.beginPath();
      ctx.moveTo(x + d + h, y);
      ctx.lineTo(x + d, y + h);
      ctx.stroke();
    }
  }
  ctx.restore();
}

// ─── Contour (marching squares iso-lines) ─────────────────────────────────

// These segment tables are pure data — no DOM, safe for unit tests
const MS_EDGES: readonly [number, number, number, number][] = [
  [0, 0.5, 0.5, 0],   // top-left
  [0.5, 0, 1, 0.5],   // top-right
  [1, 0.5, 0.5, 1],   // bottom-right
  [0.5, 1, 0, 0.5],   // bottom-left
];

/**
 * Marching-squares: given four corner values (tl, tr, bl, br) and an iso-level,
 * return up to 2 line segment endpoints (normalised 0..1 within the cell).
 * Exported for unit testing.
 */
export function marchingSquaresSegments(
  tl: number, tr: number,
  bl: number, br: number,
  level: number
): Array<[number, number, number, number]> {
  const above = (v: number) => v >= level;
  const idx =
    (above(tl) ? 8 : 0) |
    (above(tr) ? 4 : 0) |
    (above(br) ? 2 : 0) |
    (above(bl) ? 1 : 0);

  if (idx === 0 || idx === 15) return [];

  // Interpolate edge crossings
  function interp(a: number, b: number): number {
    if (a === b) return 0.5;
    return (level - a) / (b - a);
  }

  // edge midpoints: top, right, bottom, left (as normalised t 0..1)
  const top    = interp(tl, tr);
  const right  = interp(tr, br);
  const bottom = interp(bl, br);
  const left   = interp(tl, bl);

  const edges: Record<number, [number, number]> = {
    0: [top, 0],
    1: [1, right],
    2: [bottom, 1],
    3: [0, left],
  };

  const segs: Array<[number, number, number, number]> = [];

  // Simple lookup for which edge pairs connect
  const pairs: Record<number, number[][]> = {
    1:  [[3, 2]], 2:  [[2, 1]], 3:  [[3, 1]], 4:  [[1, 0]], 5:  [[3, 0], [1, 2]],
    6:  [[2, 0]], 7:  [[3, 0]], 8:  [[0, 3]], 9:  [[0, 2]], 10: [[0, 1], [2, 3]],
    11: [[0, 1]], 12: [[1, 3]], 13: [[1, 2]], 14: [[2, 3]],
  };

  const pr = pairs[idx] ?? [];
  for (const [a, b] of pr) {
    const ea = edges[a];
    const eb = edges[b];
    if (!ea || !eb) continue;
    const [ax, ay] = a === 0 ? [ea[0], 0] : a === 1 ? [1, ea[1]] : a === 2 ? [ea[0], 1] : [0, ea[1]];
    const [bx, by] = b === 0 ? [eb[0], 0] : b === 1 ? [1, eb[1]] : b === 2 ? [eb[0], 1] : [0, eb[1]];
    segs.push([ax, ay, bx, by]);
  }
  return segs;
}

export function drawContour(
  ctx: CanvasRenderingContext2D,
  cell: SampledCell,
  L: number,
  grid: { lum: number; cols: number; rows: number; cells: SampledCell[] }
): void {
  const LEVELS = 7;
  const { x, y, w, h, col, row } = cell;
  const getL = (c: number, r: number) => {
    const idx = r * grid.cols + c;
    return grid.cells[idx]?.lum ?? L;
  };
  ctx.strokeStyle = cellColor(cell);
  ctx.lineWidth = 0.6;
  for (let li = 1; li < LEVELS; li++) {
    const level = li / LEVELS;
    const tl = getL(col - 1, row - 1);
    const tr = getL(col, row - 1);
    const bl = getL(col - 1, row);
    const br = L;
    const segs = marchingSquaresSegments(tl, tr, bl, br, level);
    for (const [ax, ay, bx, by] of segs) {
      ctx.beginPath();
      ctx.moveTo(x + ax * w, y + ay * h);
      ctx.lineTo(x + bx * w, y + by * h);
      ctx.stroke();
    }
  }
  void MS_EDGES; // referenced to avoid lint dead-code warning
}

// ─── Half-blocks ──────────────────────────────────────────────────────────

export function drawHalfblocks(
  ctx: CanvasRenderingContext2D,
  cell: SampledCell,
  topCell: SampledCell,
  L: number
): void {
  const { x, y, w, h } = cell;
  const half = Math.ceil(h / 2);
  // Top half uses the cell above's colour
  ctx.fillStyle = `rgb(${Math.round(topCell.r)},${Math.round(topCell.g)},${Math.round(topCell.b)})`;
  ctx.fillRect(x, y, w, half);
  // Bottom half uses this cell's colour
  ctx.fillStyle = `rgb(${Math.round(cell.r)},${Math.round(cell.g)},${Math.round(cell.b)})`;
  ctx.fillRect(x, y + half, w, h - half);
  void L; // used by coverage gate in caller
}
