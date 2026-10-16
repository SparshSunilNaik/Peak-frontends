import type { AsciiParams } from "./types";

/**
 * Compute the classic contrast factor.
 * c is in the range -255..255 (128 = strong boost as in the Forest preset).
 * Exported for unit testing.
 */
export function contrastFactor(c: number): number {
  return (259 * (c + 255)) / (255 * (259 - c));
}

/**
 * Apply brightness, contrast, saturation and grayscale in a single pixel pass,
 * then optionally overlay the tint colour.
 *
 * Skips cheaply when values are neutral to avoid unnecessary pixel reads.
 */
export function applyColorAdjustments(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  params: AsciiParams
): void {
  const { brightness, contrast, saturation, grayscale, tint, tintOpacity, overlayBlend } = params;

  const needPixelPass =
    brightness !== 0 ||
    contrast !== 0 ||
    saturation !== 0 ||
    grayscale !== 0;

  if (needPixelPass) {
    const imgData = ctx.getImageData(0, 0, w, h);
    const d = imgData.data;
    const bAdd = brightness * 2.55;
    const cFac = contrast !== 0 ? contrastFactor(contrast) : 1;
    const sFac = saturation !== 0 ? 1 + saturation / 100 : 1;
    const gFrac = grayscale / 100; // 0..1

    for (let i = 0; i < d.length; i += 4) {
      let r = d[i], g = d[i + 1], b = d[i + 2];

      // Brightness
      if (brightness !== 0) {
        r += bAdd; g += bAdd; b += bAdd;
      }

      // Contrast (formula: factor * (channel - 128) + 128)
      if (contrast !== 0) {
        r = cFac * (r - 128) + 128;
        g = cFac * (g - 128) + 128;
        b = cFac * (b - 128) + 128;
      }

      // Saturation (scale around Rec.709 luma)
      if (saturation !== 0) {
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = luma + sFac * (r - luma);
        g = luma + sFac * (g - luma);
        b = luma + sFac * (b - luma);
      }

      // Grayscale (mix toward luma)
      if (grayscale !== 0) {
        const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        r = r + gFrac * (luma - r);
        g = g + gFrac * (luma - g);
        b = b + gFrac * (luma - b);
      }

      d[i]     = Math.min(255, Math.max(0, r));
      d[i + 1] = Math.min(255, Math.max(0, g));
      d[i + 2] = Math.min(255, Math.max(0, b));
    }

    ctx.putImageData(imgData, 0, 0);
  }

  // Tint overlay
  if (tintOpacity > 0) {
    ctx.save();
    ctx.globalCompositeOperation = overlayBlend;
    ctx.globalAlpha = tintOpacity / 100;
    ctx.fillStyle = tint;
    ctx.fillRect(0, 0, w, h);
    ctx.restore();
  }
}
