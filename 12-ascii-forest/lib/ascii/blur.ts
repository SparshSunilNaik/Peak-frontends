import type { AsciiParams, BlurType } from "./types";

// ─── Downscale-upscale fallback blur (Safari / no ctx.filter) ─────────────

function softwareBlur(
  src: HTMLCanvasElement | OffscreenCanvas,
  radius: number
): OffscreenCanvas {
  const steps = Math.max(1, Math.round(radius / 4));
  const w = src.width, h = src.height;
  let current: OffscreenCanvas = new OffscreenCanvas(w, h);
  {
    const cc = current.getContext("2d")!;
    cc.drawImage(src as CanvasImageSource, 0, 0);
  }
  for (let s = 0; s < steps; s++) {
    const half = new OffscreenCanvas(Math.max(1, Math.ceil(w / 2)), Math.max(1, Math.ceil(h / 2)));
    const hc = half.getContext("2d")!;
    hc.drawImage(current as unknown as CanvasImageSource, 0, 0, half.width, half.height);
    const up = new OffscreenCanvas(w, h);
    const uc = up.getContext("2d")!;
    uc.drawImage(half as unknown as CanvasImageSource, 0, 0, w, h);
    current = up;
  }
  return current;
}

function makeBlurredOffscreen(
  src: HTMLCanvasElement,
  radius: number
): OffscreenCanvas {
  const w = src.width, h = src.height;
  const off = new OffscreenCanvas(w, h);
  const oc = off.getContext("2d")!;
  try {
    oc.filter = `blur(${radius}px)`;
    oc.drawImage(src, 0, 0);
    oc.filter = "none";
  } catch {
    // ctx.filter unsupported — use downscale fallback
    const fb = softwareBlur(src, radius);
    oc.drawImage(fb as unknown as CanvasImageSource, 0, 0);
  }
  return off;
}

// ─── Build an alpha mask (greyscale, single channel) on an OffscreenCanvas ──

function buildMask(
  w: number,
  h: number,
  fillFn: (mc: OffscreenCanvasRenderingContext2D) => void
): OffscreenCanvas {
  const mask = new OffscreenCanvas(w, h);
  const mc = mask.getContext("2d")!;
  fillFn(mc);
  return mask;
}

// ─── Apply the blur effect to the canvas in-place ─────────────────────────

export function applyBlur(
  ctx: CanvasRenderingContext2D,
  srcCanvas: HTMLCanvasElement,
  w: number,
  h: number,
  params: AsciiParams
): void {
  const {
    blurType, blurAmount, blurAngle,
    tiltFocus, tiltPosition, tiltFeather,
    lensFocus, blurCenterX, blurCenterY,
    progressivePosition, progressiveReverse,
    directionalBothSides,
  } = params;

  if (blurType === "none" || blurAmount <= 0) return;

  const mask = buildBlurMask(blurType, w, h, {
    blurAngle, tiltFocus, tiltPosition, tiltFeather,
    lensFocus, blurCenterX, blurCenterY,
    progressivePosition, progressiveReverse,
    directionalBothSides,
  });
  if (!mask) return;

  // Blurred copy
  const blurred = makeBlurredOffscreen(srcCanvas, blurAmount);

  // Apply mask: multiply blurred by alpha mask using destination-in
  const masked = new OffscreenCanvas(w, h);
  const mc = masked.getContext("2d")!;
  mc.drawImage(blurred as unknown as CanvasImageSource, 0, 0);
  mc.globalCompositeOperation = "destination-in";
  mc.drawImage(mask as unknown as CanvasImageSource, 0, 0);

  // Draw masked blur on top of the current frame
  ctx.drawImage(masked as unknown as CanvasImageSource, 0, 0);
}

// ─── Mask builders ────────────────────────────────────────────────────────

interface MaskOptions {
  blurAngle: number;
  tiltFocus: number;
  tiltPosition: number;
  tiltFeather: number;
  lensFocus: number;
  blurCenterX: number;
  blurCenterY: number;
  progressivePosition: number;
  progressiveReverse: boolean;
  directionalBothSides: boolean;
}

function buildBlurMask(
  type: BlurType,
  w: number,
  h: number,
  opts: MaskOptions
): OffscreenCanvas | null {
  switch (type) {
    case "gaussian":
      return buildMask(w, h, (mc) => {
        mc.fillStyle = "#fff";
        mc.fillRect(0, 0, w, h);
      });

    case "tilt": {
      const {
        tiltPosition, tiltFocus, tiltFeather, blurAngle,
      } = opts;
      return buildMask(w, h, (mc) => {
        // Centre line y
        const cy = (tiltPosition / 100) * h;
        const focusHalf = (tiltFocus / 100) * h / 2;
        const featherSize = (tiltFeather / 100) * h;

        // Save/rotate around centre
        mc.save();
        mc.translate(w / 2, h / 2);
        mc.rotate((blurAngle * Math.PI) / 180);
        mc.translate(-w / 2, -h / 2);

        // Sharp zone: transparent (no blur)
        const sharpTop = cy - focusHalf;
        const sharpBot = cy + focusHalf;

        // Top feather
        const gtTop = mc.createLinearGradient(0, sharpTop - featherSize, 0, sharpTop);
        gtTop.addColorStop(0, "white");
        gtTop.addColorStop(1, "transparent");
        mc.fillStyle = gtTop;
        mc.fillRect(0, 0, w, sharpTop);

        // Bottom feather
        const gtBot = mc.createLinearGradient(0, sharpBot, 0, sharpBot + featherSize);
        gtBot.addColorStop(0, "transparent");
        gtBot.addColorStop(1, "white");
        mc.fillStyle = gtBot;
        mc.fillRect(0, sharpBot, w, h);

        mc.restore();
      });
    }

    case "directional": {
      const { blurAngle, directionalBothSides } = opts;
      return buildMask(w, h, (mc) => {
        const rad = (blurAngle * Math.PI) / 180;
        const cx = w / 2, cy = h / 2;
        const dx = Math.cos(rad), dy = Math.sin(rad);
        const d = Math.sqrt(w * w + h * h);
        if (directionalBothSides) {
          // Symmetric: sharp centre, blur both edges
          const gx = mc.createLinearGradient(
            cx - dx * d, cy - dy * d,
            cx + dx * d, cy + dy * d
          );
          gx.addColorStop(0, "white");
          gx.addColorStop(0.4, "transparent");
          gx.addColorStop(0.6, "transparent");
          gx.addColorStop(1, "white");
          mc.fillStyle = gx;
        } else {
          const gx = mc.createLinearGradient(
            cx, cy, cx + dx * d, cy + dy * d
          );
          gx.addColorStop(0, "transparent");
          gx.addColorStop(1, "white");
          mc.fillStyle = gx;
        }
        mc.fillRect(0, 0, w, h);
      });
    }

    case "lens": {
      const { blurCenterX, blurCenterY, lensFocus } = opts;
      const shorter = Math.min(w, h);
      const cx2 = (blurCenterX / 100) * w;
      const cy2 = (blurCenterY / 100) * h;
      const innerR = (lensFocus / 100) * shorter / 2;
      const outerR = shorter * 0.75;
      return buildMask(w, h, (mc) => {
        const grd = mc.createRadialGradient(cx2, cy2, innerR, cx2, cy2, outerR);
        grd.addColorStop(0, "transparent");
        grd.addColorStop(1, "white");
        mc.fillStyle = grd;
        mc.fillRect(0, 0, w, h);
      });
    }

    case "progressive": {
      const { progressivePosition, progressiveReverse } = opts;
      return buildMask(w, h, (mc) => {
        const startY = (progressivePosition / 100) * h;
        const grd = progressiveReverse
          ? mc.createLinearGradient(0, 0, 0, startY)
          : mc.createLinearGradient(0, startY, 0, h);
        grd.addColorStop(0, "transparent");
        grd.addColorStop(1, "white");
        mc.fillStyle = grd;
        mc.fillRect(0, 0, w, h);
      });
    }

    default:
      return null;
  }
}
