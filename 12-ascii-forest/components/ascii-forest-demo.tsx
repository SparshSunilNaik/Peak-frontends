"use client";

import React, { useState, useCallback, useId } from "react";
import AsciiArt from "@/components/ui/ascii-art";
import { FOREST_PRESET } from "@/lib/ascii/types";
import type { AsciiParams, RenderMode, CharSet } from "@/lib/ascii/types";

const ALL_RENDER_MODES: { value: RenderMode; label: string }[] = [
  { value: "characters", label: "Characters" },
  { value: "dither", label: "Dither (Bayer 4×4)" },
  { value: "mosaic", label: "Mosaic" },
  { value: "pixel", label: "Pixel" },
  { value: "dots", label: "Dots" },
  { value: "cross", label: "Cross" },
  { value: "diamond", label: "Diamond" },
  { value: "voxel", label: "Voxel (Isometric)" },
  { value: "lego", label: "Lego (Stud Brick)" },
  { value: "mixed", label: "Mixed" },
  { value: "lines", label: "Lines" },
  { value: "diagonal", label: "Diagonal (45°)" },
  { value: "braille", label: "Braille (2×4)" },
  { value: "disco", label: "Disco" },
  { value: "hexdump", label: "Hexdump (0-9A-F)" },
  { value: "matrix", label: "Matrix (Code Rain)" },
  { value: "rings", label: "Rings" },
  { value: "hearts", label: "Hearts" },
  { value: "stars", label: "Stars" },
  { value: "hexagons", label: "Hexagons (Honeycomb)" },
  { value: "triangles", label: "Triangles (Low-Poly)" },
  { value: "bubbles", label: "Bubbles" },
  { value: "hatch", label: "Hatch (Cross-Hatch)" },
  { value: "contour", label: "Contour (Marching Squares)" },
  { value: "halfblocks", label: "Halfblocks (Dual Vertical)" },
];

const ALL_CHARSETS: { value: CharSet; label: string }[] = [
  { value: "standard", label: "Standard ( .:-=+*#%@)" },
  { value: "blocks", label: "Blocks ( ░▒▓█)" },
  { value: "binary", label: "Binary ( 01)" },
  { value: "custom", label: "Custom" },
];

export default function AsciiForestDemo() {
  const [src, setSrc] = useState<string>("/forest.jpg");
  const [params, setParams] = useState<AsciiParams>(FOREST_PRESET);

  const modeSelectId = useId();
  const charsetSelectId = useId();
  const cellSizeInputId = useId();
  const animateCheckboxId = useId();
  const photoUploadId = useId();

  const handleModeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextMode = e.target.value as RenderMode;
    setParams((prev) => ({ ...prev, renderMode: nextMode }));
  }, []);

  const handleCharsetChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const nextCharset = e.target.value as CharSet;
    setParams((prev) => ({ ...prev, charSet: nextCharset }));
  }, []);

  const handleCellSizeChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const nextSize = parseInt(e.target.value, 10);
    setParams((prev) => ({ ...prev, cellSize: nextSize }));
  }, []);

  const handleAnimateChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setParams((prev) => ({ ...prev, animated: checked }));
  }, []);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setSrc(objectUrl);
    }
  }, []);

  const handleResetPreset = useCallback(() => {
    setParams(FOREST_PRESET);
    setSrc("/forest.jpg");
  }, []);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#050505]">
      {/* Canvas view filling the viewport */}
      <AsciiArt src={src} params={params} className="w-full h-full" />

      {/* Unobtrusive floating bottom control bar */}
      <nav
        aria-label="ASCII Art Controls"
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-3 px-4 py-2.5 rounded-xl bg-black/80 backdrop-blur-md border border-white/10 text-xs text-white/90 shadow-2xl transition-opacity hover:bg-black/90 max-w-[95vw]"
      >
        {/* Render mode select */}
        <div className="flex items-center gap-1.5">
          <label htmlFor={modeSelectId} className="font-medium text-white/70 whitespace-nowrap">
            Mode
          </label>
          <select
            id={modeSelectId}
            value={params.renderMode}
            onChange={handleModeChange}
            className="bg-white/10 hover:bg-white/15 focus:bg-zinc-900 border border-white/20 rounded px-2 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-400 transition-colors cursor-pointer"
          >
            {ALL_RENDER_MODES.map((m) => (
              <option key={m.value} value={m.value} className="bg-zinc-900 text-white">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Charset select (only shown for characters mode) */}
        {params.renderMode === "characters" && (
          <div className="flex items-center gap-1.5">
            <label htmlFor={charsetSelectId} className="font-medium text-white/70 whitespace-nowrap">
              Charset
            </label>
            <select
              id={charsetSelectId}
              value={params.charSet}
              onChange={handleCharsetChange}
              className="bg-white/10 hover:bg-white/15 focus:bg-zinc-900 border border-white/20 rounded px-2 py-1 text-white text-xs outline-none focus:ring-1 focus:ring-emerald-400 transition-colors cursor-pointer"
            >
              {ALL_CHARSETS.map((c) => (
                <option key={c.value} value={c.value} className="bg-zinc-900 text-white">
                  {c.label}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Cell size range input */}
        <div className="flex items-center gap-1.5">
          <label htmlFor={cellSizeInputId} className="font-medium text-white/70 whitespace-nowrap">
            Cell <span className="tabular-nums text-white">{params.cellSize}px</span>
          </label>
          <input
            id={cellSizeInputId}
            type="range"
            min={6}
            max={24}
            step={1}
            value={params.cellSize}
            onChange={handleCellSizeChange}
            className="w-20 sm:w-24 accent-emerald-400 cursor-pointer"
          />
        </div>

        {/* Animate checkbox */}
        <div className="flex items-center gap-1.5">
          <label htmlFor={animateCheckboxId} className="flex items-center gap-1.5 cursor-pointer select-none">
            <input
              id={animateCheckboxId}
              type="checkbox"
              checked={params.animated}
              onChange={handleAnimateChange}
              className="accent-emerald-400 w-3.5 h-3.5 rounded cursor-pointer"
            />
            <span className="font-medium text-white/80">Animate</span>
          </label>
        </div>

        {/* Upload custom photo button */}
        <div className="flex items-center">
          <label
            htmlFor={photoUploadId}
            tabIndex={0}
            role="button"
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                document.getElementById(photoUploadId)?.click();
              }
            }}
            className="cursor-pointer px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 active:bg-white/30 border border-white/15 text-white/90 font-medium transition-colors"
          >
            Upload photo
          </label>
          <input
            id={photoUploadId}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="sr-only"
            aria-label="Upload custom photo"
          />
        </div>

        {/* Reset preset button */}
        <button
          type="button"
          onClick={handleResetPreset}
          className="px-2 py-1 rounded text-white/60 hover:text-white hover:bg-white/10 transition-colors text-xs"
          title="Reset to Forest preset"
        >
          Reset
        </button>
      </nav>
    </div>
  );
}
