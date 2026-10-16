import type { AsciiParams, AnimStyle } from "./types";
import type { SampledCell } from "./sample";
import { cellHash } from "./modes/blocks";

export interface AnimResult {
  /** Delta to add to effective luminance (clamped by caller to 0..1). */
  lumDelta: number;
  /** Ramp-index jitter for characters mode (signed integer). */
  charJitter: number;
}

const TWO_PI = Math.PI * 2;

/**
 * Compute a cell-level animation modulation.
 *
 * @param cell   The sampled cell
 * @param idx    Cell index (for deterministic hash)
 * @param cols   Number of grid columns (for wave x/y)
 * @param rows   Number of grid rows  (for ripple centre)
 * @param params Full AsciiParams
 * @param elapsed Elapsed seconds since start
 */
export function getAnimModulation(
  cell: SampledCell,
  idx: number,
  cols: number,
  rows: number,
  params: AsciiParams,
  elapsed: number
): AnimResult {
  if (!params.animated) {
    return { lumDelta: 0, charJitter: 0 };
  }

  const speedFac = params.animSpeed.enabled ? params.animSpeed.intensity / 100 : 0;
  const t = elapsed * speedFac;
  const amp = params.animIntensity.enabled ? params.animIntensity.intensity / 100 : 0;

  const style: AnimStyle = params.animStyle;
  const h = (cellHash(idx) / 0xffffffff);

  let lumDelta = 0;

  switch (style) {
    case "shimmer":
      lumDelta = amp * 0.18 * Math.sin(t * 2.2 + h * TWO_PI);
      break;

    case "wave": {
      const x = cell.col / Math.max(1, cols);
      const y = cell.row / Math.max(1, rows);
      lumDelta = amp * 0.25 * Math.sin(t * 2 + x * 0.12 + y * 0.07);
      break;
    }

    case "pulse":
      lumDelta = amp * 0.2 * Math.sin(t * 1.6);
      break;

    case "ripple": {
      const cx = 0.5, cy = 0.5;
      const dx = cell.col / Math.max(1, cols) - cx;
      const dy = cell.row / Math.max(1, rows) - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      lumDelta = amp * 0.3 * Math.sin(t * 3 - dist * 0.15);
      break;
    }

    case "flicker": {
      // Flip about 8 times per second with probability amp * 0.08
      const flipSeed = Math.floor(t * 8);
      const p = (cellHash(idx * 31 + flipSeed) / 0xffffffff);
      lumDelta = p < amp * 0.08 ? (h > 0.5 ? 0.3 : -0.3) : 0;
      break;
    }
  }

  // Charjitter: ±1 step for shimmer
  const charJitter = style === "shimmer" && Math.abs(lumDelta) > 0.12 ? (h > 0.5 ? 1 : -1) : 0;

  return { lumDelta, charJitter };
}
