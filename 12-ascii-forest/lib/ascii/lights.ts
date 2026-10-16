import type { LightsConfig } from "./types";

/** Add point glow lights over the current frame. */
export function applyLights(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  lights: LightsConfig
): void {
  if (!lights.enabled || lights.points.length === 0) return;

  const shorter = Math.min(w, h);

  ctx.save();
  ctx.globalCompositeOperation = "screen";

  for (const pt of lights.points) {
    const cx = pt.x * w;
    const cy = pt.y * h;
    const r = pt.radius * shorter;
    const alpha = pt.intensity / 100;
    const color = pt.color ?? "#ffffff";

    const grd = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grd.addColorStop(0, hexToRgba(color, alpha));
    grd.addColorStop(1, "rgba(0,0,0,0)");

    ctx.fillStyle = grd;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.restore();
}

function hexToRgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const r = parseInt(h.substring(0, 2), 16);
  const g = parseInt(h.substring(2, 4), 16);
  const b = parseInt(h.substring(4, 6), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}
