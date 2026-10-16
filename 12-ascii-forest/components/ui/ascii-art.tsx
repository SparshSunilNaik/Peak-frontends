"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { FOREST_PRESET, mergeParams } from "@/lib/ascii/types";
import type { AsciiParams } from "@/lib/ascii/types";
import { sampleImage, invalidateSampleCache } from "@/lib/ascii/sample";
import { renderCells } from "@/lib/ascii/render-cells";
import { applyColorAdjustments } from "@/lib/ascii/color";
import { applyBlur } from "@/lib/ascii/blur";
import { applyPostEffects } from "@/lib/ascii/post-effects";
import { applyLights } from "@/lib/ascii/lights";
import { applyMask } from "@/lib/ascii/mask";
import { getAnimModulation } from "@/lib/ascii/animation";

// ─── Props ─────────────────────────────────────────────────────────────────

export interface AsciiArtProps {
  src: string;
  params?: Partial<AsciiParams>;
  className?: string;
  onReady?: () => void;
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function AsciiArt({ src, params: paramsProp, className, onReady }: AsciiArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const startTimeRef = useRef<number>(0);
  const rafRef = useRef<number>(0);
  const paramsRef = useRef<AsciiParams>(paramsProp ? mergeParams(paramsProp) : FOREST_PRESET);
  const prevSrcRef = useRef<string>("");
  const mountedRef = useRef(false);
  const lastFrameRef = useRef<number>(0);

  // Sync params ref cleanly on changes
  useEffect(() => {
    paramsRef.current = paramsProp ? mergeParams(paramsProp) : FOREST_PRESET;
    invalidateSampleCache();
  }, [paramsProp]);

  // ── Draw a single frame ─────────────────────────────────────────────────

  const drawFrame = useCallback(async (timestamp: number) => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;

    const p = paramsRef.current;
    const fps = p.pfx.chromatic.enabled || p.pfx.halftone.enabled ||
                p.pfx.filmGrain.enabled || p.pfx.bloom.enabled ? 30 : 60;
    const minDt = 1000 / fps;
    if (timestamp - lastFrameRef.current < minDt) return;
    lastFrameRef.current = timestamp;

    const elapsed = (timestamp - startTimeRef.current) / 1000;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    // ── 1. Background ──────────────────────────────────────────────────────
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#050505";
    ctx.fillRect(0, 0, w, h);

    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const dw = img.naturalWidth * scale;
    const dh = img.naturalHeight * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;

    switch (p.bgMode) {
      case "blur":
        ctx.save();
        try { ctx.filter = `blur(${p.bgBlur}px)`; } catch { /* fallback: no filter */ }
        ctx.globalAlpha = p.bgOpacity / 100;
        ctx.drawImage(img, dx, dy, dw, dh);
        try { ctx.filter = "none"; } catch { /* ignore */ }
        ctx.restore();
        break;
      case "solid":
        ctx.save();
        ctx.globalAlpha = p.bgOpacity / 100;
        ctx.fillStyle = p.bgColor;
        ctx.fillRect(0, 0, w, h);
        ctx.restore();
        break;
      case "original":
        ctx.save();
        ctx.globalAlpha = p.bgOpacity / 100;
        ctx.drawImage(img, dx, dy, dw, dh);
        ctx.restore();
        break;
      case "none":
        break;
    }

    // ── 2. Sample grid (cached) ────────────────────────────────────────────
    const grid = sampleImage(img, w, h, p.cellSize, p.toneCurve);

    // ── 3. Render cells ────────────────────────────────────────────────────
    renderCells(ctx, grid, p, elapsed, (cell, idx) =>
      getAnimModulation(cell, idx, grid.cols, grid.rows, p, elapsed)
    );

    // ── 4. Colour adjustments ──────────────────────────────────────────────
    applyColorAdjustments(ctx, w, h, p);

    // ── 5. Blur (needs a snapshot of the current canvas) ──────────────────
    if (p.blurType !== "none" && p.blurAmount > 0) {
      // Snapshot current canvas into a regular canvas for blur source
      const snap = document.createElement("canvas");
      snap.width = w;
      snap.height = h;
      snap.getContext("2d")?.drawImage(canvas, 0, 0);
      applyBlur(ctx, snap, w, h, p);
    }

    // ── 6. Post effects ────────────────────────────────────────────────────
    applyPostEffects(ctx, w, h, p.pfx, elapsed);

    // ── 7. Lights ─────────────────────────────────────────────────────────
    applyLights(ctx, w, h, p.lights);

    // ── 8. Mask (async — uses cached image) ───────────────────────────────
    if (p.mask.enabled && p.mask.dataUrl) {
      await applyMask(ctx, w, h, p.mask, img);
    }
  }, []);

  // ── Load image + start loop ─────────────────────────────────────────────

  useEffect(() => {
    mountedRef.current = true;
    startTimeRef.current = performance.now();

    // Reduced motion: render once only
    const prefersReduced = typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const loop = (timestamp: number) => {
      if (!mountedRef.current) return;
      void drawFrame(timestamp);
      rafRef.current = requestAnimationFrame(loop);
    };

    const loadAndStart = () => {
      if (prefersReduced) {
        void drawFrame(performance.now());
        return;
      }
      // IntersectionObserver: pause off screen
      const canvas = canvasRef.current;
      if (!canvas) return;

      let visible = true;
      const io = new IntersectionObserver((entries) => {
        visible = entries[0]?.isIntersecting ?? true;
        if (visible && mountedRef.current) {
          rafRef.current = requestAnimationFrame(loop);
        } else {
          cancelAnimationFrame(rafRef.current);
        }
      });
      io.observe(canvas);

      // Page visibility
      const onVisibilityChange = () => {
        if (document.hidden) {
          cancelAnimationFrame(rafRef.current);
        } else if (visible && mountedRef.current) {
          rafRef.current = requestAnimationFrame(loop);
        }
      };
      document.addEventListener("visibilitychange", onVisibilityChange);

      rafRef.current = requestAnimationFrame(loop);

      return () => {
        io.disconnect();
        document.removeEventListener("visibilitychange", onVisibilityChange);
      };
    };

    let cleanup: (() => void) | undefined;

    if (src !== prevSrcRef.current) {
      prevSrcRef.current = src;
      invalidateSampleCache();
      cancelAnimationFrame(rafRef.current);

      const img = new Image();
      // For blob URLs we don't need crossOrigin; for http URLs we do
      if (!src.startsWith("blob:")) img.crossOrigin = "anonymous";
      img.onload = () => {
        imgRef.current = img;
        onReady?.();
        cleanup = loadAndStart() ?? undefined;
      };
      img.onerror = () => {
        console.error(`[AsciiArt] Failed to load image: ${src}`);
      };
      img.src = src;
    } else {
      cleanup = loadAndStart() ?? undefined;
    }

    return () => {
      mountedRef.current = false;
      cancelAnimationFrame(rafRef.current);
      cleanup?.();
    };
  }, [src, drawFrame, onReady]);

  // ── ResizeObserver: keep canvas at device pixel ratio ─────────────────

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (!entry) return;
      const { width, height } = entry.contentRect;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const cw = Math.round(width * dpr);
      const ch = Math.round(height * dpr);
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw;
        canvas.height = ch;
        invalidateSampleCache();
      }
    });

    ro.observe(canvas);
    return () => ro.disconnect();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    />
  );
}
