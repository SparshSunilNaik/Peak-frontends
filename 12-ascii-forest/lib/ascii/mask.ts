import type { MaskConfig } from "./types";

// Cache the loaded mask image
let _maskImg: HTMLImageElement | null = null;
let _maskSrc: string | null = null;

function loadMaskImage(dataUrl: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = dataUrl;
  });
}

/**
 * Apply the reveal mask: where the mask is opaque, show the original photo.
 * `mask.invert` flips the reveal area.
 * `mask.showOverlay` tints the masked region red at 35% alpha.
 */
export async function applyMask(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  mask: MaskConfig,
  plainPhoto: HTMLImageElement | null
): Promise<void> {
  if (!mask.enabled || !mask.dataUrl || !plainPhoto) return;

  // Load (and cache) the mask image
  if (_maskSrc !== mask.dataUrl) {
    try {
      _maskImg = await loadMaskImage(mask.dataUrl);
      _maskSrc = mask.dataUrl;
    } catch {
      return;
    }
  }
  if (!_maskImg) return;

  // Draw plain photo on an offscreen canvas
  const off = new OffscreenCanvas(w, h);
  const oc = off.getContext("2d")!;

  const scale = Math.max(w / plainPhoto.naturalWidth, h / plainPhoto.naturalHeight);
  const dw = plainPhoto.naturalWidth * scale;
  const dh = plainPhoto.naturalHeight * scale;
  oc.drawImage(plainPhoto, (w - dw) / 2, (h - dh) / 2, dw, dh);

  // Apply mask alpha
  oc.globalCompositeOperation = mask.invert ? "destination-out" : "destination-in";
  oc.drawImage(_maskImg, 0, 0, w, h);

  // Draw reveal onto the effect
  ctx.drawImage(off as unknown as CanvasImageSource, 0, 0);

  // Optional overlay tint
  if (mask.showOverlay) {
    const tintOff = new OffscreenCanvas(w, h);
    const tc = tintOff.getContext("2d")!;
    tc.fillStyle = "rgba(255,0,0,0.35)";
    tc.fillRect(0, 0, w, h);
    tc.globalCompositeOperation = mask.invert ? "destination-out" : "destination-in";
    tc.drawImage(_maskImg, 0, 0, w, h);
    ctx.drawImage(tintOff as unknown as CanvasImageSource, 0, 0);
  }
}

/** Invalidate cached mask (call when mask.dataUrl changes). */
export function invalidateMaskCache(): void {
  _maskImg = null;
  _maskSrc = null;
}
