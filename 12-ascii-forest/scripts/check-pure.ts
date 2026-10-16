import assert from "node:assert/strict";
import { buildToneLUT } from "../lib/ascii/sample";
import { contrastFactor } from "../lib/ascii/color";
import { charIndexForL, CHAR_RAMPS } from "../lib/ascii/charsets";
import { cellHash, BAYER4, bayerThreshold } from "../lib/ascii/modes/blocks";
import { marchingSquaresSegments } from "../lib/ascii/modes/patterns";

console.log("Running check-pure.ts assertions...");

// 1. LUT of the identity curve is identity
const identityCurve = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
const lut = buildToneLUT(identityCurve);
assert.equal(lut.length, 256, "LUT length should be 256");
for (let i = 0; i < 256; i++) {
  assert.equal(
    lut[i],
    i,
    `LUT of identity curve at index ${i} should be ${i}, got ${lut[i]}`
  );
}
console.log("✓ Identity curve LUT is identity across all 256 values");

// 2. Contrast factor at 0 is 1
const factorAtZero = contrastFactor(0);
assert(
  Math.abs(factorAtZero - 1) < 1e-6,
  `Contrast factor at 0 must be 1, got ${factorAtZero}`
);
console.log("✓ Contrast factor at 0 is 1");

// 3. Charset index for L=0 is 0 and for L=1 is the last index
const ramp = CHAR_RAMPS.standard;
const idxZero = charIndexForL(ramp, 0);
assert.equal(idxZero, 0, `Charset index for L=0 should be 0, got ${idxZero}`);

const idxOne = charIndexForL(ramp, 1);
assert.equal(
  idxOne,
  ramp.length - 1,
  `Charset index for L=1 should be ${ramp.length - 1}, got ${idxOne}`
);

const idxMid = charIndexForL(ramp, 0.5);
assert(
  idxMid >= 0 && idxMid < ramp.length,
  `Charset index for L=0.5 should be within bounds, got ${idxMid}`
);
console.log("✓ Charset index for L=0 is 0 and L=1 is the last glyph");

// 4. Hash is deterministic
const h1 = cellHash(42);
const h2 = cellHash(42);
assert.equal(h1, h2, "Hash must be deterministic for identical inputs");
const h3 = cellHash(43);
assert.notEqual(h1, h3, "Hash should vary for different inputs");
console.log("✓ cellHash is deterministic and varies with cell index");

// 5. Bayer matrix and bayerThreshold
assert.equal(BAYER4.length, 16, "Bayer 4x4 matrix must have 16 entries");
assert.equal(bayerThreshold(0, 0), 0 / 16, "bayerThreshold(0,0) is 0");
assert.equal(bayerThreshold(0, 3), 15 / 16, "bayerThreshold(0,3) is 15/16");
console.log("✓ Bayer 4x4 threshold matches expected normalised values");

// 6. Marching squares on a constant grid returns no segments
const flatAllAbove = marchingSquaresSegments(0.8, 0.8, 0.8, 0.8, 0.5);
assert.equal(
  flatAllAbove.length,
  0,
  "Marching squares with all corners above threshold should return 0 segments"
);

const flatAllBelow = marchingSquaresSegments(0.2, 0.2, 0.2, 0.2, 0.5);
assert.equal(
  flatAllBelow.length,
  0,
  "Marching squares with all corners below threshold should return 0 segments"
);

const edgeCrossing = marchingSquaresSegments(0.1, 0.9, 0.1, 0.1, 0.5);
assert(
  edgeCrossing.length > 0,
  "Marching squares with corner crossing threshold should return line segments"
);
console.log("✓ Marching squares on constant grid produces no segments");

console.log("\nAll pure helper assertions passed successfully!");
