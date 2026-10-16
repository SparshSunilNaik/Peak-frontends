// ─── Unions ────────────────────────────────────────────────────────────────

export type RenderMode =
  | "characters"
  | "dither"
  | "mosaic"
  | "pixel"
  | "dots"
  | "cross"
  | "diamond"
  | "voxel"
  | "lego"
  | "mixed"
  | "lines"
  | "diagonal"
  | "braille"
  | "disco"
  | "hexdump"
  | "matrix"
  | "rings"
  | "hearts"
  | "stars"
  | "hexagons"
  | "triangles"
  | "bubbles"
  | "hatch"
  | "contour"
  | "halfblocks";

export type BgMode = "blur" | "solid" | "original" | "none";
export type CharSet = "standard" | "blocks" | "binary" | "custom";
export type BlurType = "none" | "gaussian" | "tilt" | "directional" | "lens" | "progressive";
export type AnimStyle = "wave" | "pulse" | "shimmer" | "ripple" | "flicker";

export type BlendMode =
  | "source-over"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

// ─── Sub-types ─────────────────────────────────────────────────────────────

export interface TonePoint {
  x: number; // 0..1
  y: number; // 0..1
}

export interface PfxEntry {
  enabled: boolean;
  intensity: number; // 0..100
}

export interface PfxMap {
  vignette: PfxEntry;
  scanLines: PfxEntry;
  chromatic: PfxEntry;
  bloom: PfxEntry;
  filmGrain: PfxEntry;
  glitch: PfxEntry;
  pixelate: PfxEntry;
  halftone: PfxEntry;
  filmDust: PfxEntry;
}

export interface LightPoint {
  x: number;       // 0..1 normalised
  y: number;       // 0..1 normalised
  radius: number;  // fraction of the shorter canvas side
  intensity: number; // 0..100
  color?: string;  // default "#ffffff"
}

export interface LightsConfig {
  enabled: boolean;
  points: LightPoint[];
}

export interface MaskConfig {
  enabled: boolean;
  tool: string;
  brushSize: number;
  showOverlay: boolean;
  invert: boolean;
  dataUrl: string | null;
  shapes: unknown[];
}

// ─── Main params ───────────────────────────────────────────────────────────

export interface AsciiParams {
  // Render
  renderMode: RenderMode;
  cellSize: number;
  coverage: number;        // 0..100
  invert: boolean;
  styleBlend: BlendMode;
  charSet: CharSet;
  customChars: string;
  density: number;         // -100..100
  edgeEmphasis: number;    // 0..100

  // Background
  bgMode: BgMode;
  bgBlur: number;
  bgOpacity: number;       // 0..100
  bgColor: string;

  // Tone & colour
  brightness: number;      // -100..100
  contrast: number;        // -255..255 (128 in preset = strong boost)
  saturation: number;      // -100..100
  grayscale: number;       // 0..100
  tint: string;
  tintOpacity: number;     // 0..100
  overlayBlend: BlendMode;
  toneCurve: TonePoint[];

  // Blur
  blurType: BlurType;
  blurAmount: number;
  blurAngle: number;
  directionalBothSides: boolean;
  tiltFocus: number;
  tiltPosition: number;
  tiltFeather: number;
  lensFocus: number;
  blurCenterX: number;
  blurCenterY: number;
  progressivePosition: number;
  progressiveReverse: boolean;

  // Post effects
  pfx: PfxMap;

  // Animation
  animated: boolean;
  animStyle: AnimStyle;
  animSpeed: PfxEntry;
  animIntensity: PfxEntry;

  // Lights & mask
  lights: LightsConfig;
  mask: MaskConfig;
}

// ─── Default (neutral) params ──────────────────────────────────────────────

export const DEFAULT_PARAMS: AsciiParams = {
  renderMode: "characters",
  bgMode: "blur",
  bgBlur: 2,
  bgOpacity: 90,
  bgColor: "#000000",
  cellSize: 10,
  coverage: 100,
  invert: false,
  styleBlend: "source-over",
  charSet: "standard",
  customChars: "",
  brightness: 0,
  contrast: 0,
  edgeEmphasis: 0,
  density: 0,
  toneCurve: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  tint: "#ffffff",
  tintOpacity: 0,
  overlayBlend: "multiply",
  saturation: 0,
  grayscale: 0,
  blurType: "none",
  blurAmount: 0,
  blurAngle: 0,
  directionalBothSides: false,
  tiltFocus: 35,
  tiltPosition: 50,
  tiltFeather: 15,
  lensFocus: 40,
  blurCenterX: 50,
  blurCenterY: 50,
  progressivePosition: 55,
  progressiveReverse: false,
  pfx: {
    vignette: { enabled: false, intensity: 58 },
    scanLines: { enabled: false, intensity: 40 },
    chromatic: { enabled: false, intensity: 20 },
    bloom: { enabled: false, intensity: 25 },
    filmGrain: { enabled: false, intensity: 32 },
    glitch: { enabled: false, intensity: 20 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: false, intensity: 20 },
    filmDust: { enabled: false, intensity: 20 },
  },
  animated: false,
  animStyle: "shimmer",
  animSpeed: { enabled: true, intensity: 100 },
  animIntensity: { enabled: true, intensity: 60 },
  lights: { enabled: false, points: [] },
  mask: {
    enabled: false,
    tool: "freehand",
    brushSize: 30,
    showOverlay: false,
    invert: false,
    dataUrl: null,
    shapes: [],
  },
};

// ─── Forest preset ─────────────────────────────────────────────────────────

export const FOREST_PRESET: AsciiParams = {
  renderMode: "characters",
  bgMode: "blur",
  bgBlur: 2,
  bgOpacity: 90,
  bgColor: "#000000",
  cellSize: 10,
  coverage: 100,
  invert: false,
  styleBlend: "source-over",
  charSet: "standard",
  customChars: "",
  brightness: 0,
  contrast: 128,
  edgeEmphasis: 0,
  density: 0,
  toneCurve: [
    { x: 0, y: 0 },
    { x: 1, y: 1 },
  ],
  tint: "#3ca6ff",
  tintOpacity: 0,
  overlayBlend: "multiply",
  saturation: 0,
  grayscale: 100,
  blurType: "tilt",
  blurAmount: 30,
  blurAngle: 0,
  directionalBothSides: false,
  tiltFocus: 35,
  tiltPosition: 50,
  tiltFeather: 15,
  lensFocus: 40,
  blurCenterX: 50,
  blurCenterY: 50,
  progressivePosition: 55,
  progressiveReverse: false,
  pfx: {
    vignette: { enabled: false, intensity: 58 },
    scanLines: { enabled: false, intensity: 40 },
    chromatic: { enabled: true, intensity: 20 },
    bloom: { enabled: false, intensity: 25 },
    filmGrain: { enabled: false, intensity: 32 },
    glitch: { enabled: false, intensity: 20 },
    pixelate: { enabled: false, intensity: 15 },
    halftone: { enabled: true, intensity: 20 },
    filmDust: { enabled: true, intensity: 20 },
  },
  animated: true,
  animStyle: "shimmer",
  animSpeed: { enabled: true, intensity: 100 },
  animIntensity: { enabled: true, intensity: 60 },
  lights: { enabled: false, points: [] },
  mask: {
    enabled: false,
    tool: "freehand",
    brushSize: 30,
    showOverlay: false,
    invert: false,
    dataUrl: null,
    shapes: [],
  },
};

// ─── Deep merge helper ─────────────────────────────────────────────────────

export function mergeParams(partial: Partial<AsciiParams>): AsciiParams {
  const base = { ...FOREST_PRESET };
  const merged: AsciiParams = { ...base, ...partial };

  // Deep merge pfx
  if (partial.pfx) {
    merged.pfx = { ...base.pfx, ...partial.pfx };
    for (const k of Object.keys(partial.pfx) as (keyof PfxMap)[]) {
      merged.pfx[k] = { ...base.pfx[k], ...partial.pfx[k] };
    }
  }

  // Deep merge lights
  if (partial.lights) {
    merged.lights = { ...base.lights, ...partial.lights };
  }

  // Deep merge mask
  if (partial.mask) {
    merged.mask = { ...base.mask, ...partial.mask };
  }

  return merged;
}
