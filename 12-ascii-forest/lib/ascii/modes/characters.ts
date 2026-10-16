import type { SampledCell } from "../sample";
import type { CharSet } from "../types";
import { resolveRamp } from "../charsets";

export interface CharModeOptions {
  charSet: CharSet;
  customChars: string;
  animJitter?: number; // extra ramp jitter from animation
}

export function drawCharacters(
  ctx: CanvasRenderingContext2D,
  cell: SampledCell,
  L: number,
  options: CharModeOptions
): void {
  const ramp = resolveRamp(options.charSet, options.customChars);
  const n = ramp.length;
  if (n === 0) return;

  // Apply optional animation jitter to ramp index
  let idx = Math.floor(L * n);
  if (options.animJitter) {
    idx = Math.round(idx + options.animJitter);
  }
  idx = Math.min(n - 1, Math.max(0, idx));
  const ch = ramp[idx] ?? " ";
  if (ch === " ") return;

  const fontSize = Math.max(4, cell.w * 1.05);
  ctx.font = `${fontSize}px monospace`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = `rgb(${Math.round(cell.r)},${Math.round(cell.g)},${Math.round(cell.b)})`;
  ctx.fillText(ch, cell.x + cell.w / 2, cell.y + cell.h / 2);
}
