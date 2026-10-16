import type { SampledCell } from "../sample";
import { cellHash } from "./blocks";

function cellColor(cell: SampledCell): string {
  return `rgb(${Math.round(cell.r)},${Math.round(cell.g)},${Math.round(cell.b)})`;
}

// ─── Rings ────────────────────────────────────────────────────────────────

export function drawRings(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  const maxR = Math.min(cell.w, cell.h) / 2;
  const rings = Math.max(1, Math.round(L * 3));
  ctx.strokeStyle = cellColor(cell);
  ctx.lineWidth = 0.8;
  for (let i = 1; i <= rings; i++) {
    const r = (i / rings) * maxR * L;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ─── Hearts ───────────────────────────────────────────────────────────────

export function drawHearts(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  const s = L * Math.min(cell.w, cell.h) * 0.45;
  ctx.fillStyle = cellColor(cell);
  ctx.save();
  ctx.translate(cx, cy);
  ctx.beginPath();
  // Heart via cubic bezier
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s, -s * 0.2, -s * 1.2, s * 0.5, 0, s);
  ctx.bezierCurveTo(s * 1.2, s * 0.5, s, -s * 0.2, 0, s * 0.3);
  ctx.fill();
  ctx.restore();
}

// ─── Stars ────────────────────────────────────────────────────────────────

export function drawStars(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  const outerR = L * Math.min(cell.w, cell.h) * 0.48;
  const innerR = outerR * 0.38;
  const points = 5;
  ctx.fillStyle = cellColor(cell);
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const angle = (i * Math.PI) / points - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// ─── Hexagons ─────────────────────────────────────────────────────────────

export function drawHexagons(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const { x, y, w, h, col } = cell;
  // Honeycomb offset: odd columns shifted down by half h
  const offsetY = col % 2 === 1 ? h / 2 : 0;
  const cx = x + w / 2;
  const cy = y + h / 2 + offsetY;
  const r = L * Math.min(w, h) * 0.48;
  ctx.fillStyle = cellColor(cell);
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 6;
    const px = cx + Math.cos(angle) * r;
    const py = cy + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

// ─── Triangles ────────────────────────────────────────────────────────────

export function drawTriangles(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const { x, y, w, h, col, row } = cell;
  const pointUp = (col + row) % 2 === 0;
  ctx.fillStyle = cellColor(cell);
  ctx.beginPath();
  if (pointUp) {
    ctx.moveTo(x + w / 2, y);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
  } else {
    ctx.moveTo(x, y);
    ctx.lineTo(x + w, y);
    ctx.lineTo(x + w / 2, y + h);
  }
  ctx.closePath();
  ctx.fill();
}

// ─── Bubbles ─────────────────────────────────────────────────────────────

export function drawBubbles(ctx: CanvasRenderingContext2D, cell: SampledCell, L: number): void {
  if (L < 0.04) return;
  const cx = cell.x + cell.w / 2;
  const cy = cell.y + cell.h / 2;
  const r = L * Math.min(cell.w, cell.h) * 0.46;
  if (r < 1) return;

  // Translucent fill
  ctx.fillStyle = `rgba(${Math.round(cell.r)},${Math.round(cell.g)},${Math.round(cell.b)},0.45)`;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // Highlight arc
  ctx.strokeStyle = `rgba(255,255,255,0.55)`;
  ctx.lineWidth = 1;
  const startAngle = -Math.PI * 0.8;
  const endAngle = -Math.PI * 0.2;
  ctx.beginPath();
  ctx.arc(cx - r * 0.15, cy - r * 0.15, r * 0.55, startAngle, endAngle);
  ctx.stroke();

  void cellHash; // ensure import not tree-shaken
}
