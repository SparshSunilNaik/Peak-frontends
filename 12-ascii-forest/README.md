# 12-ascii-forest

A pure Canvas2D recreation of the **"Forest" ASCII-art effect** from [21st.dev](https://21st.dev).

This project renders a photo into monochrome and stylized ASCII characters, patterns, blocks, and geometric primitives using HTML5 Canvas2D and TypeScript. The signature "Forest" preset applies:
- High contrast luminance mapping with a piecewise tone curve and Sobel edge detection
- Tilt-shift optical blur softening upper canopy and foreground while keeping the middle subject in crisp focus
- Post-processing effects stack: chromatic channel displacement, 45° halftone dot screen, and atmospheric film dust
- Gentle shimmer micro-animation modulating cell luminance and glyph ramp index over time

---

## Why `components/ui` Matters

In modern Next.js and Tailwind CSS applications following the shadcn/ui architecture, `components/ui` acts as the foundational layer of primitive, headless, or reusable visual building blocks (such as `button.tsx` or `ascii-art.tsx`). Keeping `<AsciiArt />` in `components/ui/ascii-art.tsx` provides:
1. **Clean separation of concerns**: The canvas engine and rendering pipeline are completely decoupled from page state and user interface controls.
2. **Standard alias compatibility**: Applications import the component cleanly as `@/components/ui/ascii-art` without circular dependencies.
3. **Drop-in reusability**: Any other page, view, or project can consume the ASCII canvas component with different photos and parameter overrides.

---

## Getting Started

### Installation

```bash
cd 12-ascii-forest
npm install
```

### Running Locally

```bash
npm run dev
```

Open [http://localhost:3012](http://localhost:3012) in your browser.

### Quality Scripts

```bash
npm run lint       # ESLint check
npm run typecheck  # TypeScript strict type validation without emit
npm run check      # Pure math/logic unit assertions via tsx (scripts/check-pure.ts)
npm run build      # Production Next.js bundle build
```

---

## AsciiParams Reference Table

All configuration options are defined in `lib/ascii/types.ts` under the `AsciiParams` interface:

| Group | Parameter | Type | Range / Options | Forest Preset Default | Description |
|---|---|---|---|---|---|
| **Render** | `renderMode` | `RenderMode` | 25 modes (see below) | `"characters"` | Drawing strategy for each cell |
| | `cellSize` | `number` | `4` .. `64` px | `10` | Grid cell width and height in pixels |
| | `coverage` | `number` | `0` .. `100` % | `100` | Percentage of cells drawn (deterministic hash) |
| | `invert` | `boolean` | `true` / `false` | `false` | Inverts luminance: dark becomes bright |
| | `styleBlend` | `GlobalCompositeOperation` | `"source-over"`, `"screen"`, etc. | `"source-over"` | Canvas composite mode when drawing cells |
| | `charSet` | `CharSet` | `"standard"`, `"blocks"`, `"binary"`, `"custom"` | `"standard"` | Character ramp glyph selection |
| | `customChars` | `string` | any string | `""` | User-defined ramp when `charSet: "custom"` |
| | `density` | `number` | `-100` .. `100` | `0` | Gamma bias modifying perceived cell density |
| | `edgeEmphasis`| `number` | `0` .. `100` | `0` | Sobel gradient edge boost added to luminance |
| **Background** | `bgMode` | `BgMode` | `"blur"`, `"solid"`, `"original"`, `"none"` | `"blur"` | Backdrop layer drawn behind the cells |
| | `bgBlur` | `number` | `0` .. `40` px | `2` | CSS filter blur radius for backdrop |
| | `bgOpacity` | `number` | `0` .. `100` % | `90` | Opacity of backdrop layer |
| | `bgColor` | `string` | Hex or CSS color | `"#000000"` | Solid color when `bgMode: "solid"` |
| **Tone & Colour** | `brightness` | `number` | `-100` .. `100` | `0` | Adds `brightness * 2.55` to RGB channels |
| | `contrast` | `number` | `-255` .. `255` | `128` | Classic contrast factor `(259*(c+255))/(255*(259-c))` |
| | `saturation` | `number` | `-100` .. `100` | `0` | Channel deviation around Rec.709 luma |
| | `grayscale` | `number` | `0` .. `100` % | `100` | Mixes channels toward luminance |
| | `toneCurve` | `TonePoint[]` | array of `{x: 0..1, y: 0..1}` | `[{x:0,y:0},{x:1,y:1}]` | Piecewise-linear tone mapping LUT |
| | `tint` | `string` | Hex or CSS color | `"#3ca6ff"` | Color overlay tint |
| | `tintOpacity` | `number` | `0` .. `100` % | `0` | Opacity of tint wash layer |
| | `overlayBlend`| `GlobalCompositeOperation` | `"multiply"`, `"overlay"`, etc. | `"multiply"` | Composite mode used for tint wash |
| **Blur** | `blurType` | `BlurType` | `"none"`, `"gaussian"`, `"tilt"`, `"directional"`, `"lens"`, `"progressive"` | `"tilt"` | Selective optical blur mask mode |
| | `blurAmount` | `number` | `0` .. `100` px | `30` | Maximum blur radius applied to frame |
| | `blurAngle` | `number` | `0` .. `360` deg | `0` | Angle in degrees for tilt and directional |
| | `directionalBothSides` | `boolean` | `true` / `false` | `false` | Bilateral directional motion blur |
| | `tiltFocus` | `number` | `0` .. `100` % | `35` | Height of the central sharp focus band |
| | `tiltPosition`| `number` | `0` .. `100` % | `50` | Center position of focus band (50 = mid) |
| | `tiltFeather` | `number` | `0` .. `100` % | `15` | Feathered transition width on either side |
| | `lensFocus` | `number` | `0` .. `100` % | `40` | Sharp inner radius of radial lens blur |
| | `blurCenterX`| `number` | `0` .. `100` % | `50` | Lens blur center X position |
| | `blurCenterY`| `number` | `0` .. `100` % | `50` | Lens blur center Y position |
| | `progressivePosition` | `number` | `0` .. `100` % | `55` | Vertical start position of gradient blur |
| | `progressiveReverse` | `boolean` | `true` / `false` | `false` | Reverses gradient direction |
| **Post Effects** | `pfx.pixelate` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: false, intensity: 15 }` | Low-resolution block downscale |
| | `pfx.chromatic` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: true, intensity: 20 }` | Red/blue lateral optical channel shift |
| | `pfx.bloom` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: false, intensity: 25 }` | Soft luminous glow with screen blend |
| | `pfx.halftone`| `PfxEntry` | enabled, intensity `0..100` | `{ enabled: true, intensity: 20 }` | 45° offset CMYK-style dot screen |
| | `pfx.scanLines` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: false, intensity: 40 }` | CRT horizontal scan lines (every 3px) |
| | `pfx.filmGrain` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: false, intensity: 32 }` | Overlay noise texture tile |
| | `pfx.filmDust` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: true, intensity: 20 }` | Sparse film specks and hairline scratches |
| | `pfx.glitch` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: false, intensity: 20 }` | Horizontal slice displacement bursts |
| | `pfx.vignette`| `PfxEntry` | enabled, intensity `0..100` | `{ enabled: false, intensity: 58 }` | Dark edge radial attenuation |
| **Animation** | `animated` | `boolean` | `true` / `false` | `true` | Enables real-time animation loop |
| | `animStyle` | `AnimStyle` | `"wave"`, `"pulse"`, `"shimmer"`, `"ripple"`, `"flicker"` | `"shimmer"` | Temporal modulation formula |
| | `animSpeed` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: true, intensity: 100 }` | Speed multiplier for animation time |
| | `animIntensity` | `PfxEntry` | enabled, intensity `0..100` | `{ enabled: true, intensity: 60 }` | Amplitude of time-varying modulation |
| **Lights** | `lights.enabled` | `boolean` | `true` / `false` | `false` | Toggles point light glow overlay |
| | `lights.points` | `LightPoint[]` | array of points | `[]` | Point sources with x, y, radius, intensity |
| **Mask** | `mask.enabled` | `boolean` | `true` / `false` | `false` | Toggles photo reveal alpha mask |
| | `mask.dataUrl` | `string \| null` | Data URL or null | `null` | Mask bitmap revealing original photo |

---

## Render Modes (25 Modes)

Every render mode is implemented as a specialized drawing function in Canvas2D:

1. **`characters`**: Draws monospace glyphs mapped from cell luminance across sparse-to-dense character ramps.
2. **`dither`**: 4×4 ordered Bayer dithering matrix forming pixelated tonal crosshatching.
3. **`mosaic`**: Crisp filled square tiles with a 1px boundary gap.
4. **`pixel`**: Seamless filled rectangular tiles reproducing raw downscaled image cells.
5. **`dots`**: Circles whose radii scale proportionally with the square root of cell luminance.
6. **`cross`**: Plus-shaped crosshairs whose stroke thickness scales with luminance.
7. **`diamond`**: 45-degree rotated squares centered on each cell, sized by luminance.
8. **`voxel`**: Isometric 3D pseudo-cubes with top, left, and right shaded facets.
9. **`lego`**: Rounded bricks with raised cylindrical stud highlights.
10. **`mixed`**: Deterministic per-cell hash randomly assigning dots, crosses, or mosaic squares.
11. **`lines`**: Centered horizontal bars whose vertical thickness expands with luminance.
12. **`diagonal`**: 45-degree diagonal strokes whose stroke width follows luminance.
13. **`braille`**: 2×4 sub-cell dot patterns activated by Bayer threshold comparisons.
14. **`disco`**: Dynamic cycling HSL color hues modulated by elapsed time, cell index, and luminance.
15. **`hexdump`**: Raw hexadecimal glyphs (`0` through `F`) chosen by cell luminance.
16. **`matrix`**: Digital green code rain glyphs cascading down columns with glowing heads and fading tails.
17. **`rings`**: Concentric circular outlines expanding outward with luminance.
18. **`hearts`**: Bézier-curved heart glyphs sized by cell brightness.
19. **`stars`**: Five-pointed geometric star polygons scaled to luminance.
20. **`hexagons`**: Honeycomb tessellation with alternating row offsets.
21. **`triangles`**: Low-poly alternating upward and downward equilateral triangles.
22. **`bubbles`**: Translucent filled spheres with offset curved specular highlights.
23. **`hatch`**: Fine pencil cross-hatching with primary and secondary crossing diagonal strokes.
24. **`contour`**: Topographic iso-line segments computed across 7 levels via marching squares.
25. **`halfblocks`**: Dual vertical sub-cell sampling drawing upper and lower half-blocks.
