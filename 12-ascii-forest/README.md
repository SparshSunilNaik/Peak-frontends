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

---

## Render Pipeline Architecture

The rendering pipeline in `components/ui/ascii-art.tsx` executes the following sequence on every frame:

```
[Source Photo]
      │
      ▼
1. [Backdrop Pass] ────────────► Draw cover photo with optional blur / solid fill
      │
      ▼
2. [Sampling Grid] ────────────► Averaged RGB + Rec.709 Luma + Tone Curve LUT + Sobel edges (Cached)
      │
      ▼
3. [Cell Loop & Anim] ─────────► Density gamma + Edge boost + Invert + Coverage hash + Temporal modulation
      │
      ▼
4. [Shape / Glyph Draw] ───────► Dispatch to active renderMode (characters, blocks, patterns, shapes)
      │
      ▼
5. [Color Adjustments] ────────► Single-pass pixel loop: Brightness, Contrast, Saturation, Grayscale + Tint overlay
      │
      ▼
6. [Blur Pass] ────────────────► Tilt-shift / Gaussian / Directional / Lens / Progressive mask composite
      │
      ▼
7. [Post Effects Stack] ───────► Pixelate ➔ Chromatic ➔ Bloom ➔ Halftone ➔ Scanlines ➔ Grain ➔ Dust ➔ Glitch ➔ Vignette
      │
      ▼
8. [Lights & Mask] ────────────► Point lights glow overlay + Optional photo reveal alpha mask
      │
      ▼
[Final Canvas Output]
```

### 1. Backdrop Pass
Draws the original image into the canvas with `object-fit: cover`. Depending on `bgMode`:
- `"blur"`: Uses `ctx.filter = blur(bgBlur)` with a canvas downscale fallback if unsupported, at `bgOpacity`.
- `"solid"`: Fills `bgColor` at `bgOpacity`.
- `"original"`: Draws the unblurred photo at `bgOpacity`.
- `"none"`: Clears canvas with near-black `#050505`.

### 2. Offscreen Sampling & Edge Detection
When image dimensions, source, cellSize, or tone curve change, the canvas samples the photo onto an offscreen canvas:
- Computes average color $(r, g, b)$ per $cellSize \times cellSize$ block.
- Calculates standard Rec.709 luminance: $Y = 0.2126 r + 0.7152 g + 0.0722 b$.
- Maps luminance through the 256-entry piecewise-linear tone curve LUT.
- Runs a 3×3 Sobel filter across cell luminance values to produce normalized edge magnitudes ($0..1$).
- Caches the entire grid data structure so per-frame loops avoid CPU-heavy pixel reads.

### 3. Cell Loop & Animation
For each cell index:
1. Base tone-curved luminance $L$ is fetched.
2. Density gamma bias is applied: $L = L^{1 - \text{density}/200}$.
3. Sobel edge magnitude is injected: $L = \text{clamp}(L + \text{edge} \times \text{edgeEmphasis}/100, 0, 1)$.
4. If `invert` is true, $L = 1 - L$.
5. Deterministic hash `cellHash(index) % 100 < coverage` determines whether the cell is drawn.
6. Animation style modulates luminance and character jitter over time.
7. Active render mode draws into the cell using cell color and effective luminance.

### 4. Color Adjustments Pass
When non-neutral color values are specified, a single contiguous `getImageData` pixel pass is performed:
- **Brightness**: adds `brightness * 2.55` to each channel.
- **Contrast**: computes $F = \frac{259(c + 255)}{255(259 - c)}$ and evaluates $F \times (V - 128) + 128$.
- **Saturation**: shifts RGB deviation from luminance by factor $1 + s/100$.
- **Grayscale**: linearly interpolates channels toward Rec.709 luma by `grayscale / 100`.
- **Tint**: if `tintOpacity > 0`, fills a full rect with `tint` under `overlayBlend`.

### 5. Selective Optical Blur Pass
Extracts the current frame into an offscreen canvas, applies maximum blur radius `blurAmount`, builds a grayscale alpha mask based on `blurType` (such as the central clear focus band of `"tilt"`), masks the blurred image with `destination-in`, and paints it back over the sharp frame.

### 6. Post Effects Stack
Post effects run in a deterministic order:
- `pixelate`: Block-averages pixels via low-res downscaling with `imageSmoothingEnabled = false`.
- `chromatic`: Displaces red channel left and blue channel right by up to 6px.
- `bloom`: Composites a blurred duplicate of high-luminance elements via `"screen"`.
- `halftone`: Evaluates a 45° offset periodic dot screen based on cell luminance.
- `scanLines`: Renders 1px dark horizontal lines every 3px.
- `filmGrain`: Blends a pre-generated 256×256 procedural noise tile at random offsets via `"overlay"`.
- `filmDust`: Seeds random hairline scratches and specks 12 times per second.
- `glitch`: Shifts 2 to 6 horizontal frame slices during occasional random burst frames.
- `vignette`: Blends an inverted radial falloff gradient darkening outer edges.

---

## Animation Styles & Formulas

Temporal animation coordinates time $t$ and modulation amplitude $amp$:
$$t = \text{elapsedSeconds} \times \left(\text{animSpeed.enabled} \ ? \ \frac{\text{animSpeed.intensity}}{100} : 0\right)$$
$$amp = \text{animIntensity.enabled} \ ? \ \frac{\text{animIntensity.intensity}}{100} : 0$$

- **`shimmer`** (Forest preset default):
  $$\Delta L = amp \times 0.18 \times \sin(t \times 2.2 + \text{cellHash}(\text{cell}) \times 2\pi)$$
  For character mode, glyph ramp index randomly jitters by $\pm 1$ step.
- **`wave`**:
  $$\Delta L = amp \times 0.25 \times \sin(t \times 2.0 + x \times 0.12 + y \times 0.07)$$
- **`pulse`**:
  $$\Delta L = amp \times 0.20 \times \sin(t \times 1.6)$$
- **`ripple`**:
  $$\Delta L = amp \times 0.30 \times \sin(t \times 3.0 - \text{distFromCenter} \times 0.15)$$
- **`flicker`**:
  Discrete stochastic binary shifts updated 8 times per second with probability $amp \times 0.08$.

---

## Performance Optimizations

1. **Grid Caching**: Photo sampling, luminance calculations, tone LUT mapping, and Sobel edge detection run strictly once per image source and resize. The per-frame animation loop never calls `getImageData` on the raw source image.
2. **Adaptive Frame Rate Throttling**: When computationally heavy post-processing passes (chromatic aberration, halftone, film grain, or bloom) are enabled, the animation loop caps at **30 FPS**. When simpler modes run, it renders at native **60 FPS**.
3. **Visibility & Intersection Observer**: Animation frames automatically pause when:
   - The browser tab is in the background (`document.hidden`).
   - The canvas element is scrolled out of viewport (`IntersectionObserver`).
4. **Accessibility (`prefers-reduced-motion`)**: When the user requests reduced motion in system preferences, temporal animation is halted and a crisp single frame is rendered.
5. **Zero-Allocation Hot Loops**: Cell coordinate calculation, hash lookups, and geometric primitives reuse pre-allocated numbers and static lookup arrays rather than allocating objects inside inner frame loops.

---

## Assumptions & Design Decisions

1. **Contrast Formulation**: Contrast is evaluated using the classic $-255..255$ integer contrast formula:
   $$\text{factor} = \frac{259 \times (c + 255)}{255 \times (259 - c)}$$
   $$\text{channel}' = \text{factor} \times (\text{channel} - 128) + 128$$
   In the Forest preset where `contrast: 128`, this produces a strong factor of $\approx 3.01$, creating the harsh, high-contrast monochrome aesthetic requested by the recipe.
2. **Density and Edge Interpretation**:
   - `density` ($-100..100$) acts as a gamma bias: $L' = L^{1 - \text{density}/200}$, shifting mid-tones darker or lighter.
   - `edgeEmphasis` ($0..100$) scales and adds the normalized 3×3 Sobel gradient magnitude directly into cell luminance before glyph mapping.
3. **Background Color Extension (`bgColor`)**: Added `bgColor: string` to `AsciiParams` defaulting to `"#000000"` to cleanly support the `bgMode: "solid"` backdrop option.
4. **Mask Editor UI Scope**: In accordance with the prompt specification, interactive freehand drawing brush tools were designated out-of-scope; the reveal mask system fully supports programmatic bitmaps via `mask.dataUrl`, with optional `mask.invert` and `mask.showOverlay` preview tinting.
5. **Photo Source**: Successfully retrieved a verified high-resolution forest photo from Unsplash (`photo-1448375240586-882707db888b`, 475 KB JPEG) and bundled it locally into `public/forest.jpg`. The implementation did **not** need to fall back to procedural generation.
6. **`ctx.filter` Fallback**: On browsers or environments lacking native Canvas2D `ctx.filter` support (such as older WebKit/Safari engines), the background and blur passes fall back to multi-step downscale and upscale box sampling.

---

## Troubleshooting

- **Blank Canvas**: Indicates that the image source failed to load or was blocked by browser CORS security policies. Using the bundled local asset `/forest.jpg` or an uploaded file through `URL.createObjectURL` guarantees same-origin access for `getImageData`.
- **Harsh, Ultra-High Contrast Output**: This is intentional. The Forest preset specifies `contrast: 128` under the $-255..255$ integer scale, producing a stark black-and-white tonal thresholding typical of 21st.dev's Forest look.
- **High CPU or GPU Utilization**: Decrease the canvas viewport resolution or increase `cellSize` (e.g., from `10` to `16` or `20`). Disabling heavy post-effects such as `chromatic` or `halftone` reduces frame computation overhead.
- **Blurring Inactive on Safari**: Older versions of Safari lack `ctx.filter`. The built-in downscale fallback maintains visual softening even when native CSS filter acceleration is absent.

---

## Credits & License

- **Visual Concept & Recipe**: Reimplemented from the public recipe of the **"Forest"** ASCII-art effect from [21st.dev](https://21st.dev). All Canvas2D shader, sampling, animation, and React code was built from scratch without copying proprietary source code.
- **Forest Source Photo**: Photo by [Jeremy Bishop](https://unsplash.com/@jeremy0) on [Unsplash](https://unsplash.com/photos/green-trees-in-forest-during-daytime-1448375240586-882707db888b), distributed under the [Unsplash License](https://unsplash.com/license).
