import type { PfxMap } from "./types";

// ─── Pre-generated noise tile for film grain ──────────────────────────────

let _noiseTile: OffscreenCanvas | null = null;

function getNoiseTile(): OffscreenCanvas {
  if (_noiseTile) return _noiseTile;
  const SIZE = 256;
  const tile = new OffscreenCanvas(SIZE, SIZE);
  const tc = tile.getContext("2d")!;
  const id = tc.createImageData(SIZE, SIZE);
  const d = id.data;
  for (let i = 0; i < d.length; i += 4) {
    const v = Math.round(Math.random() * 255);
    d[i] = d[i + 1] = d[i + 2] = v;
    d[i + 3] = 255;
  }
  tc.putImageData(id, 0, 0);
  _noiseTile = tile;
  return tile;
}

// ─── Post effects ─────────────────────────────────────────────────────────

function pixelate(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number): void {
  const blockSize = Math.max(2, Math.round(1 + (intensity / 100) * 12));
  const off = new OffscreenCanvas(w, h);
  const oc = off.getContext("2d")!;
  oc.imageSmoothingEnabled = false;
  const sw = Math.max(1, Math.ceil(w / blockSize));
  const sh = Math.max(1, Math.ceil(h / blockSize));
  const tmp = new OffscreenCanvas(sw, sh);
  const tc = tmp.getContext("2d")!;
  tc.drawImage(ctx.canvas, 0, 0, sw, sh);
  oc.drawImage(tmp as unknown as CanvasImageSource, 0, 0, w, h);
  ctx.drawImage(off as unknown as CanvasImageSource, 0, 0);
}

function chromatic(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number
): void {
  const shift = Math.round((intensity / 100) * 6);
  if (shift === 0) return;
  const id = ctx.getImageData(0, 0, w, h);
  const src = new Uint8ClampedArray(id.data);
  const d = id.data;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const base = (y * w + x) * 4;
      // Shift red left
      const rx = Math.min(w - 1, Math.max(0, x - shift));
      const redSrc = (y * w + rx) * 4;
      d[base] = src[redSrc];
      // Shift blue right
      const bx = Math.min(w - 1, Math.max(0, x + shift));
      const blueSrc = (y * w + bx) * 4;
      d[base + 2] = src[blueSrc + 2];
    }
  }
  ctx.putImageData(id, 0, 0);
}

function bloom(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number): void {
  const off = new OffscreenCanvas(w, h);
  const oc = off.getContext("2d")!;
  try {
    oc.filter = "blur(6px)";
  } catch { /* no filter support */ }
  oc.drawImage(ctx.canvas, 0, 0);
  try { oc.filter = "none"; } catch { /* ignore */ }
  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.globalAlpha = (intensity / 100) * 0.8;
  ctx.drawImage(off as unknown as CanvasImageSource, 0, 0);
  ctx.restore();
}

function halftone(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number
): void {
  const spacing = 6;
  const maxR = spacing * 0.5;
  // Sample luminance from current frame
  const id = ctx.getImageData(0, 0, w, h);
  const d = id.data;
  const getLum = (px: number, py: number): number => {
    const xi = Math.max(0, Math.min(w - 1, Math.round(px)));
    const yi = Math.max(0, Math.min(h - 1, Math.round(py)));
    const base = (yi * w + xi) * 4;
    return (0.2126 * d[base] + 0.7152 * d[base + 1] + 0.0722 * d[base + 2]) / 255;
  };

  const off = new OffscreenCanvas(w, h);
  const oc = off.getContext("2d")!;
  oc.fillStyle = "#000";
  oc.fillRect(0, 0, w, h);
  const angle = (45 * Math.PI) / 180;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  // Rotated grid
  const diag = Math.ceil(Math.sqrt(w * w + h * h));
  for (let gy = -diag; gy < diag; gy += spacing) {
    for (let gx = -diag; gx < diag; gx += spacing) {
      const px = gx * cos - gy * sin + w / 2;
      const py = gx * sin + gy * cos + h / 2;
      if (px < 0 || px >= w || py < 0 || py >= h) continue;
      const lum = getLum(px, py);
      const r = maxR * lum;
      if (r < 0.5) continue;
      oc.fillStyle = "#fff";
      oc.beginPath();
      oc.arc(px, py, r, 0, Math.PI * 2);
      oc.fill();
    }
  }

  ctx.save();
  ctx.globalCompositeOperation = "multiply";
  ctx.globalAlpha = (intensity / 100) * 0.6;
  ctx.drawImage(off as unknown as CanvasImageSource, 0, 0);
  ctx.restore();
}

function scanLines(ctx: CanvasRenderingContext2D, w: number, h: number, intensity: number): void {
  ctx.save();
  ctx.fillStyle = `rgba(0,0,0,${(intensity / 100) * 0.5})`;
  for (let y = 0; y < h; y += 3) {
    ctx.fillRect(0, y, w, 1);
  }
  ctx.restore();
}

function filmGrain(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number,
  time: number
): void {
  const tile = getNoiseTile();
  const offsetX = Math.floor(time * 37) % 256;
  const offsetY = Math.floor(time * 53) % 256;
  ctx.save();
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = (intensity / 100) * 0.25;
  // Tile the noise
  const pattern = ctx.createPattern(tile as unknown as CanvasImageSource, "repeat");
  if (pattern) {
    const m = new DOMMatrix().translate(-offsetX, -offsetY);
    pattern.setTransform(m);
    ctx.fillStyle = pattern;
    ctx.fillRect(0, 0, w, h);
  }
  ctx.restore();
}

// Track glitch state across frames
let _glitchActive = false;
let _glitchEndTime = 0;

function glitch(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number,
  time: number
): void {
  const maxShift = (intensity / 100) * 40;
  // Occasionally activate a glitch burst
  if (!_glitchActive && Math.random() < 0.02) {
    _glitchActive = true;
    _glitchEndTime = time + 0.05 + Math.random() * 0.15;
  }
  if (time > _glitchEndTime) _glitchActive = false;
  if (!_glitchActive) return;

  // Capture current frame
  const snap = ctx.getImageData(0, 0, w, h);

  // Apply 3-6 horizontal slice shifts
  const slices = 3 + Math.floor(Math.random() * 4);
  for (let s = 0; s < slices; s++) {
    const sy = Math.floor(Math.random() * h);
    const sh = 2 + Math.floor(Math.random() * 12);
    const shift = Math.round((Math.random() - 0.5) * 2 * maxShift);
    ctx.putImageData(snap, shift, 0, 0, sy, w, sh);
  }
}

function vignette(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number
): void {
  const cx = w / 2, cy = h / 2;
  const r = Math.max(w, h) * 0.75;
  const grd = ctx.createRadialGradient(cx, cy, r * 0.2, cx, cy, r);
  grd.addColorStop(0, "rgba(0,0,0,0)");
  grd.addColorStop(1, `rgba(0,0,0,${intensity / 100})`);
  ctx.save();
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

function filmDust(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  intensity: number,
  time: number
): void {
  const seed = Math.floor(time * 12); // reseed ~12 times/sec
  const count = Math.round((intensity / 100) * 80);

  // Deterministic pseudo-random from seed + i
  function prng(s: number): number {
    let h = s ^ 0x3f7b9e1d;
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    return ((h ^ (h >>> 16)) >>> 0) / 0xffffffff;
  }

  ctx.save();
  // Specks
  for (let i = 0; i < count; i++) {
    const px = prng(seed * 1000 + i * 7) * w;
    const py = prng(seed * 1000 + i * 7 + 1) * h;
    const r = 0.5 + prng(seed * 1000 + i * 7 + 2) * 1.5;
    const light = prng(seed * 1000 + i * 7 + 3) > 0.5;
    ctx.fillStyle = light
      ? `rgba(255,255,220,${0.3 + prng(seed * 1000 + i * 7 + 4) * 0.3})`
      : `rgba(0,0,0,${0.3 + prng(seed * 1000 + i * 7 + 5) * 0.3})`;
    ctx.beginPath();
    ctx.arc(px, py, r, 0, Math.PI * 2);
    ctx.fill();
  }
  // Scratches
  const scratchCount = Math.max(1, Math.round(count / 20));
  for (let i = 0; i < scratchCount; i++) {
    const sx = prng(seed * 500 + i * 11) * w;
    const sy = prng(seed * 500 + i * 11 + 1) * h;
    const len = 10 + prng(seed * 500 + i * 11 + 2) * 60;
    ctx.strokeStyle = `rgba(255,255,220,${0.15 + prng(seed * 500 + i * 11 + 3) * 0.15})`;
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, sy);
    ctx.lineTo(sx + (prng(seed * 500 + i * 11 + 4) - 0.5) * 4, sy + len);
    ctx.stroke();
  }
  ctx.restore();
}

// ─── Main entry point ──────────────────────────────────────────────────────

/** Apply enabled post-effects in fixed order. */
export function applyPostEffects(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pfx: PfxMap,
  time: number
): void {
  if (pfx.pixelate.enabled)  pixelate(ctx, w, h, pfx.pixelate.intensity);
  if (pfx.chromatic.enabled) chromatic(ctx, w, h, pfx.chromatic.intensity);
  if (pfx.bloom.enabled)     bloom(ctx, w, h, pfx.bloom.intensity);
  if (pfx.halftone.enabled)  halftone(ctx, w, h, pfx.halftone.intensity);
  if (pfx.scanLines.enabled) scanLines(ctx, w, h, pfx.scanLines.intensity);
  if (pfx.filmGrain.enabled) filmGrain(ctx, w, h, pfx.filmGrain.intensity, time);
  if (pfx.filmDust.enabled)  filmDust(ctx, w, h, pfx.filmDust.intensity, time);
  if (pfx.glitch.enabled)    glitch(ctx, w, h, pfx.glitch.intensity, time);
  if (pfx.vignette.enabled)  vignette(ctx, w, h, pfx.vignette.intensity);
}
