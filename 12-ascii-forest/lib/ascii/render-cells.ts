import type { AsciiParams, RenderMode } from "./types";
import type { SampledGrid, SampledCell } from "./sample";
import { drawCharacters } from "./modes/characters";
import {
  drawDither, drawMosaic, drawPixel, drawDots, drawCross,
  drawDiamond, drawVoxel, drawLego, drawMixed, cellHash,
} from "./modes/blocks";
import {
  drawLines, drawDiagonal, drawBraille, drawDisco, drawHexdump,
  drawMatrix, drawHatch, drawContour, drawHalfblocks,
} from "./modes/patterns";
import {
  drawRings, drawHearts, drawStars, drawHexagons, drawTriangles, drawBubbles,
} from "./modes/shapes";
import type { AnimResult } from "./animation";

// ─── Cell index hash (for coverage gate) ──────────────────────────────────
// Re-export from blocks so render-cells owns the stable hash

export function coverageHash(cellIndex: number): number {
  return cellHash(cellIndex) % 100;
}

// ─── Main cell drawing loop ────────────────────────────────────────────────

export function renderCells(
  ctx: CanvasRenderingContext2D,
  grid: SampledGrid,
  params: AsciiParams,
  time: number,
  getAnim: (cell: SampledCell, idx: number) => AnimResult
): void {
  const {
    renderMode,
    coverage,
    density,
    edgeEmphasis,
    invert,
    styleBlend,
  } = params;

  ctx.save();
  ctx.globalCompositeOperation = styleBlend;

  const { cells, cols, rows } = grid;

  for (let idx = 0; idx < cells.length; idx++) {
    // Coverage gate (deterministic, stable pattern)
    if (coverage < 100 && coverageHash(idx) >= coverage) continue;

    const cell = cells[idx];

    // Base luminance from sample
    let L = cell.lum;

    // Density bias: gamma shift
    if (density !== 0) {
      const gamma = 1 - density / 200;
      L = Math.pow(Math.max(0, L), gamma);
    }

    // Edge emphasis
    if (edgeEmphasis > 0) {
      L = Math.min(1, L + cell.edge * (edgeEmphasis / 100));
    }

    // Invert
    if (invert) L = 1 - L;

    // Animation modulation
    const anim = getAnim(cell, idx);
    L = Math.min(1, Math.max(0, L + anim.lumDelta));

    drawCell(ctx, cell, L, renderMode, params, time, idx, grid, cells, cols, rows, anim);
  }

  ctx.restore();
}

function drawCell(
  ctx: CanvasRenderingContext2D,
  cell: SampledCell,
  L: number,
  mode: RenderMode,
  params: AsciiParams,
  time: number,
  idx: number,
  grid: SampledGrid,
  cells: SampledCell[],
  cols: number,
  rows: number,
  anim: AnimResult
): void {
  switch (mode) {
    case "characters":
      drawCharacters(ctx, cell, L, {
        charSet: params.charSet,
        customChars: params.customChars,
        animJitter: anim.charJitter,
      });
      break;
    case "dither":
      drawDither(ctx, cell, L);
      break;
    case "mosaic":
      drawMosaic(ctx, cell, L);
      break;
    case "pixel":
      drawPixel(ctx, cell, L);
      break;
    case "dots":
      drawDots(ctx, cell, L);
      break;
    case "cross":
      drawCross(ctx, cell, L);
      break;
    case "diamond":
      drawDiamond(ctx, cell, L);
      break;
    case "voxel":
      drawVoxel(ctx, cell, L);
      break;
    case "lego":
      drawLego(ctx, cell, L);
      break;
    case "mixed":
      drawMixed(ctx, cell, L, idx);
      break;
    case "lines":
      drawLines(ctx, cell, L);
      break;
    case "diagonal":
      drawDiagonal(ctx, cell, L);
      break;
    case "braille":
      drawBraille(ctx, cell, L);
      break;
    case "disco":
      drawDisco(ctx, cell, L, time);
      break;
    case "hexdump":
      drawHexdump(ctx, cell, L);
      break;
    case "matrix":
      drawMatrix(ctx, cell, L, time);
      break;
    case "hatch":
      drawHatch(ctx, cell, L);
      break;
    case "contour":
      drawContour(ctx, cell, L, { lum: cell.lum, cols, rows, cells });
      break;
    case "halfblocks": {
      const aboveIdx = (cell.row - 1) * cols + cell.col;
      const topCell = cell.row > 0 ? (cells[aboveIdx] ?? cell) : cell;
      drawHalfblocks(ctx, cell, topCell, L);
      break;
    }
    case "rings":
      drawRings(ctx, cell, L);
      break;
    case "hearts":
      drawHearts(ctx, cell, L);
      break;
    case "stars":
      drawStars(ctx, cell, L);
      break;
    case "hexagons":
      drawHexagons(ctx, cell, L);
      break;
    case "triangles":
      drawTriangles(ctx, cell, L);
      break;
    case "bubbles":
      drawBubbles(ctx, cell, L);
      break;
    default:
      // Unknown mode — fall back to characters
      drawCharacters(ctx, cell, L, {
        charSet: params.charSet,
        customChars: params.customChars,
      });
      break;
  }
  void grid; void cells; void cols; void rows;
}
