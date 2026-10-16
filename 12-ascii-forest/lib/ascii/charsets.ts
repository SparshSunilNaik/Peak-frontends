import type { CharSet } from "./types";

// ─── Character ramps (dark → light = sparse → dense) ──────────────────────

export const CHAR_RAMPS: Record<CharSet, string> = {
  standard: " .:-=+*#%@",
  blocks: " ░▒▓█",
  binary: " 01",
  custom: "", // populated at runtime from customChars
};

/** Return the character index (0 = darkest, last = brightest) for a given luminance 0..1. */
export function charIndexForL(charSetStr: string, L: number): number {
  const n = charSetStr.length;
  if (n === 0) return 0;
  return Math.min(n - 1, Math.max(0, Math.floor(L * n)));
}

/** Return the character for a given luminance, using the resolved ramp string. */
export function charForL(ramp: string, L: number): string {
  const idx = charIndexForL(ramp, L);
  return ramp[idx] ?? " ";
}

/** Resolve the actual ramp string from params. */
export function resolveRamp(charSet: CharSet, customChars: string): string {
  if (charSet === "custom") {
    return customChars.length > 0 ? customChars : CHAR_RAMPS.standard;
  }
  return CHAR_RAMPS[charSet];
}
