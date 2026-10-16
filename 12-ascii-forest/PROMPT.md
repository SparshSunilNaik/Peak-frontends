<USER_REQUEST>
TASK: Add frontend #12 to the Peak-frontends repo: a Canvas2D recreation of the "Forest" ASCII-art effect from 21st.dev, built from the recipe below. Do the whole thing in one go and do NOT ask questions. If something is ambiguous, pick the sensible default and note it in the folder README under "Assumptions". Do not rely on fetching 21st.dev (it may be unreachable or JS-rendered); build from this recipe alone.

SETUP
- Use the existing clone of https://github.com/SparshSunilNaik/Peak-frontends.git (clone it if missing), then `git pull --rebase` on main. Read root README.md and follow its conventions: NN-kebab-name folder, independent package.json (no monorepo), own README.md + PROMPT.md, localhost only, root index table updated. Match how 01 to 11 were set up. If the root README index has a merge conflict, keep every existing row and add yours.
- Set identity locally: git config user.name "SparshSunilNaik" and git config user.email "ssn7406n@gmail.com". Verify with git config --local --list. Never commit node_modules, .next or .env files.

COMMIT STRATEGY (IMPORTANT)
Work incrementally and commit as you go, in small atomic commits, one logical change each. Make AT LEAST 20 commits for this folder, following the plan below in order. Rules:
- Every commit must contain a real, meaningful change to the repo. No empty commits (never use --allow-empty), no whitespace-only or revert-and-redo churn, no touching the same line back and forth.
- Commit messages must describe what that commit actually changes, in conventional-commit style, scoped like "feat(12-ascii-forest): ...". Do not use words like "dummy", "filler", "test commit" or "wip".
- Do not backdate commits or set GIT_AUTHOR_DATE / GIT_COMMITTER_DATE. Use real timestamps.
- Commit as soon as each step is done, not at the end. Push to main once at the end (all commits in one push).
- If a step turns out to be a no-op, do not invent a change: fold in the next real step instead and add an extra real commit elsewhere (for example splitting the README further) so the total stays at 20 or more.
- No TODO/FIXME placeholders and no stubbed functions may be committed. Every exported function must be fully implemented by the commit that adds it.

COMMIT PLAN (in this order)
1. chore(12-ascii-forest): scaffold Next.js app with TypeScript and Tailwind (create-next-app output; make sure a .gitignore inside the folder excludes node_modules and .next)
2. chore(12-ascii-forest): initialize shadcn (components.json, lib/utils.ts, theme tokens)
3. chore(12-ascii-forest): run dev server on port 3012 (change the "dev" script to "next dev -p 3012")
4. style(12-ascii-forest): dark base in globals.css (body margin 0, background #050505, no overflow or height rules on html/body, keep shadcn theme tokens)
5. feat(12-ascii-forest): add AsciiParams type, defaults and the Forest preset (lib/ascii/types.ts)
6. feat(12-ascii-forest): add the forest source photo to public/ (see PHOTO below) and a credit line in a small public/CREDITS.txt
7. feat(12-ascii-forest): add cell sampling, tone curve and edge detection (lib/ascii/sample.ts)
8. feat(12-ascii-forest): add character sets and the "characters" render mode (lib/ascii/charsets.ts, lib/ascii/modes/characters.ts)
9. feat(12-ascii-forest): add block render modes: dither, mosaic, pixel, dots, cross, diamond, voxel, lego, mixed (lib/ascii/modes/blocks.ts)
10. feat(12-ascii-forest): add line and pattern render modes: lines, diagonal, braille, disco, hexdump, matrix, hatch, contour, halfblocks (lib/ascii/modes/patterns.ts)
11. feat(12-ascii-forest): add shape render modes: rings, hearts, stars, hexagons, triangles, bubbles (lib/ascii/modes/shapes.ts)
12. feat(12-ascii-forest): add render mode registry and the cell loop with coverage, density, invert and styleBlend (lib/ascii/render-cells.ts)
13. feat(12-ascii-forest): add colour adjustments and tint overlay (lib/ascii/color.ts)
14. feat(12-ascii-forest): add blur types: gaussian, tilt, directional, lens, progressive (lib/ascii/blur.ts)
15. feat(12-ascii-forest): add post effects: scanLines, vignette, bloom, chromatic, filmGrain, glitch, halftone, pixelate, filmDust (lib/ascii/post-effects.ts)
16. feat(12-ascii-forest): add point lights and photo reveal mask (lib/ascii/lights.ts, lib/ascii/mask.ts)
17. feat(12-ascii-forest): add animation styles: wave, pulse, shimmer, ripple, flicker (lib/ascii/animation.ts)
18. feat(12-ascii-forest): add the AsciiArt canvas component that composes the pipeline (components/ui/ascii-art.tsx)
19. feat(12-ascii-forest): add the Forest demo with a control bar and render it on the home page (components/ascii-forest-demo.tsx, app/page.tsx)
20. chore(12-ascii-forest): set page title, description and an SVG favicon (app/layout.tsx, app/icon.svg)
21. chore(12-ascii-forest): add typecheck script, declare the Node version in "engines" and add an .nvmrc
22. docs(12-ascii-forest): add README overview, install, run and the parameter reference
23. docs(12-ascii-forest): document the render pipeline, animation styles and performance notes in README
24. docs(12-ascii-forest): add Assumptions, troubleshooting and credits sections to README
25. docs(12-ascii-forest): store the original prompt and recipe in PROMPT.md, and add 12-ascii-forest to the root README index (folder, name, stack, run command, port 3012)
If verification (below) finds anything that needs fixing, make those fixes as additional commits after step 25. Keep the order, but you may merge two adjacent steps if one turns out too small to be a real commit, as long as the total stays at 20 or more.

FOLDER: 12-ascii-forest
- create-next-app (TypeScript, Tailwind, ESLint, App Router, src dir OFF, alias "@/*"), then `npx shadcn@latest init` so components.json, lib/utils.ts and the "@/components/ui" convention exist. Explain in the folder README why components/ui matters.
- No extra npm packages. Everything is plain Canvas2D and TypeScript. Do not add any image-processing or canvas libraries.
- package.json: "dev": "next dev -p 3012".
- All new code must be strict TypeScript, must pass `npm run build` and `npm run lint` without disabling rules, and must not use `any`.

PHOTO
The recipe has no recorded source photo. Use a forest photo with a clear subject (a trail with a person, a deer, a lone tree, etc.). Pick an Unsplash photo you can verify: download it with curl to public/forest.jpg using https://images.unsplash.com/photo-<id>?w=1800&q=85&auto=format&fit=crop, check HTTP 200, a content-type of image/jpeg and a file size above 50 KB. Try up to 5 different IDs. Serve it from /forest.jpg (same origin, so getImageData is not blocked by CORS). Never hotlink an image at runtime. If every download fails, do not invent a fake photo: generate a procedural forest-like test image once with a small node/canvas-free script (layered vertical tree trunks and a gradient sky written as a PNG through an inline encoder is acceptable, or a plain gradient scene), save it as public/forest.jpg or .png, and record that in the folder README under Assumptions and in the final report. The demo must also let the user upload their own photo (file input, read through URL.createObjectURL or FileReader, so no network is involved).

RECIPE (this is the specification; implement it fully)

Recreate the "Forest" ASCII-art effect using Canvas2D.

Render pipeline:
1. Draw the source photo into a canvas at the target size; `bgMode`/`bgBlur`/`bgOpacity` control what shows behind the effect (blurred copy, solid color, the original photo, or nothing).
2. Divide the canvas into a grid of `cellSize`px cells and sample the average color/luminance of each cell.
3. For each cell, draw a shape per `renderMode`: "characters" draws a glyph from `charSet` sized/colored by luminance; "dither"/"mosaic"/"pixel"/"dots"/"cross"/"diamond"/"voxel"/"lego"/"mixed"/"lines"/"diagonal"/"braille"/"disco"/"hexdump" (hex-digit glyphs)/"matrix" (green code rain, self-animated)/"rings"/"hearts"/"stars"/"hexagons" (honeycomb)/"triangles" (low-poly)/"bubbles"/"hatch" (pencil cross-hatch)/"contour" (topographic iso-lines)/"halfblocks" (double vertical detail) each draw their own primitive shape instead. Respect `coverage` (% of cells drawn), `density`, `invert`, and `edgeEmphasis`.
4. Apply color adjustments in order: `brightness`, `contrast`, `saturation`, `grayscale`, then the `tint` color at `tintOpacity` via `overlayBlend`, then `blurType`/`blurAmount`.
5. Layer post-effects from `pfx` for every key where `enabled` is true, at its `intensity` (0-100): scanLines, vignette, bloom, chromatic, filmGrain, glitch, halftone, pixelate, filmDust.
6. If `lights.enabled`, add glow at each point in `lights.points` (normalized x/y, radius, intensity).
7. If `mask.enabled`, use `mask.dataUrl` as a reveal mask back to the plain photo (inverted if `mask.invert`).
8. This look is animated: see `animSpeed`, `animStyle` (wave/pulse/shimmer/ripple/flicker), and `animIntensity` for how it moves over time.

The Forest preset parameters (these are the defaults of the Forest preset; put them in lib/ascii/types.ts as FOREST_PRESET, typed as AsciiParams):
```json
{
  "renderMode": "characters",
  "bgMode": "blur",
  "bgBlur": 2,
  "bgOpacity": 90,
  "cellSize": 10,
  "coverage": 100,
  "invert": false,
  "styleBlend": "source-over",
  "charSet": "standard",
  "customChars": "",
  "brightness": 0,
  "contrast": 128,
  "edgeEmphasis": 0,
  "density": 0,
  "toneCurve": [
    { "x": 0, "y": 0 },
    { "x": 1, "y": 1 }
  ],
  "tint": "#3ca6ff",
  "tintOpacity": 0,
  "overlayBlend": "multiply",
  "saturation": 0,
  "grayscale": 100,
  "blurType": "tilt",
  "blurAmount": 30,
  "blurAngle": 0,
  "directionalBothSides": false,
  "tiltFocus": 35,
  "tiltPosition": 50,
  "tiltFeather": 15,
  "lensFocus": 40,
  "blurCenterX": 50,
  "blurCenterY": 50,
  "progressivePosition": 55,
  "progressiveReverse": false,
  "pfx": {
    "vignette": { "enabled": false, "intensity": 58 },
    "scanLines": { "enabled": false, "intensity": 40 },
    "chromatic": { "enabled": true, "intensity": 20 },
    "bloom": { "enabled": false, "intensity": 25 },
    "filmGrain": { "enabled": false, "intensity": 32 },
    "glitch": { "enabled": false, "intensity": 20 },
    "pixelate": { "enabled": false, "intensity": 15 },
    "halftone": { "enabled": true, "intensity": 20 },
    "filmDust": { "enabled": true, "intensity": 20 }
  },
  "animated": true,
  "animStyle": "shimmer",
  "animSpeed": { "enabled": true, "intensity": 100 },
  "animIntensity": { "enabled": true, "intensity": 60 },
  "lights": { "enabled": false, "points": [] },
  "mask": {
    "enabled": false,
    "tool": "freehand",
    "brushSize": 30,
    "showOverlay": false,
    "invert": false,
    "dataUrl": null,
    "shapes": []
  }
}
```

IMPLEMENTATION SPEC (how to interpret the recipe; follow this where the recipe is silent)

Types (lib/ascii/types.ts): export AsciiParams (all keys above, fully typed, with unions for renderMode, bgMode "blur" | "solid" | "original" | "none", charSet "standard" | "blocks" | "binary" | "custom", blurType "none" | "gaussian" | "tilt" | "directional" | "lens" | "progressive", animStyle, styleBlend and overlayBlend as GlobalCompositeOperation subsets), export DEFAULT_PARAMS (neutral values) and FOREST_PRESET, plus a `bgColor` string defaulting to "#000000" used by bgMode "solid". Export `mergeParams(partial)` that deep-merges pfx, lights and mask.

Sampling (lib/ascii/sample.ts): draw the photo with object-fit: cover into an offscreen canvas at the target size, read it once with getImageData, then average each cellSize x cellSize block into arrays of r, g, b and luminance (0 to 1, Rec.709 weights). Apply toneCurve as a 256-entry lookup table built from piecewise-linear interpolation of the points. Compute a Sobel edge magnitude over the cell luminance grid (0 to 1). Cache the result; recompute only when the image, the canvas size, cellSize or toneCurve change, never per animation frame.

Cell loop (lib/ascii/render-cells.ts): for each cell compute effective luminance L = tone-curved luminance, then `density` (-100..100) as a gamma bias (L = L ** (1 - density/200)), then edgeEmphasis (0..100): L = clamp(L + edge * edgeEmphasis/100). Then `invert` flips L to 1 - L. `coverage` (0..100) skips a cell when hash(cellIndex) % 100 >= coverage (deterministic hash, so the pattern is stable). Set ctx.globalCompositeOperation = styleBlend while drawing shapes. Each render mode is a function (ctx, cell, time, options) that draws inside the cell box using the cell's sampled colour and L. A registry maps renderMode to its function; unknown modes fall back to "characters".

Modes:
- characters: glyph from the character ramp indexed by L (dark to light mapped to sparse to dense), monospace font sized to about cellSize * 1.05, centred, coloured with the cell colour (so later grayscale desaturates it). charSet standard = " .:-=+*#%@", blocks = " ░▒▓█", binary = " 01", custom = customChars (fall back to standard if empty).
- dither: ordered 4x4 Bayer threshold, fills the cell as a small checker of pixels. mosaic: solid square with a 1px gap. pixel: solid full cell. dots: circle with radius proportional to sqrt(L). cross: plus sign whose thickness follows L. diamond: rotated square sized by L. voxel: small isometric cube (three shaded faces). lego: rounded brick with a stud circle. mixed: pick dots, cross or mosaic per cell by hash.
- lines: horizontal bar whose height follows L. diagonal: 45 degree stroke whose width follows L. braille: 2x4 grid of dot positions switched on by comparing L to a Bayer threshold per sub-dot (draw as small circles; do not depend on braille Unicode glyphs). disco: cell filled with a hue that cycles with time and cell index, brightness by L. hexdump: hexadecimal digit glyph (0-9A-F) chosen by L. matrix: green (#00ff66) code-rain glyphs falling down each column with a bright head and fading tail, speed per column from hash, glyph density modulated by L, self-animated from `time`. hatch: pencil cross-hatching (one diagonal stroke family for mid tones, a second crossing family for darks, none for brights). contour: topographic iso-lines (draw line segments where the luminance grid crosses 6 to 8 evenly spaced levels, using marching squares on the cell grid). halfblocks: split the cell into top and bottom halves, each filled with its own sampled colour (sample two vertical sub-cells).
- rings: concentric ring(s) with radius following L. hearts, stars (5 point), hexagons (honeycomb offset rows), triangles (low-poly: alternate up and down triangles with the colour of their covered area), bubbles (circle with a highlight arc and translucent fill, radius by L).
All mode functions are pure drawing code with no allocations in the hot loop beyond what is needed (reuse Path2D or precomputed tables where easy). Total work per frame must stay fast at 1280x720 with cellSize 10.

Background (inside the component's pipeline): bgMode "blur" draws the photo with ctx.filter = `blur(${bgBlur}px)` at globalAlpha bgOpacity/100 (under the cells); "solid" fills bgColor at bgOpacity/100; "original" draws the plain photo at bgOpacity/100; "none" leaves the canvas cleared to near-black (#050505). If ctx.filter is unsupported (Safari), fall back to a downscale-upscale blur and note it in Assumptions.

Colour adjustments (lib/ascii/color.ts), applied to the composited frame with getImageData/putImageData in this order: brightness (-100..100, adds value * 2.55 to each channel), contrast (the classic -255..255 integer formula: factor = (259 * (c + 255)) / (255 * (259 - c)); channel = factor * (channel - 128) + 128; so 128 is a strong boost; record this as an assumption), saturation (-100..100: factor 1 + s/100 around Rec.709 luma), grayscale (0..100: mix channels toward luma by that percentage). Then the tint: if tintOpacity > 0, fill a full-frame rect with `tint` at globalAlpha tintOpacity/100 using globalCompositeOperation overlayBlend, then restore. All of this must be skipped cheaply when the values are neutral (for example tintOpacity 0, brightness 0, saturation 0), except grayscale 100 and contrast 128 in the preset which are always applied. Use a single pass over the pixels for brightness, contrast, saturation and grayscale together.

Blur (lib/ascii/blur.ts): blurAmount is the maximum blur radius in px. Implement every blurType the same way: render a blurred copy of the frame to an offscreen canvas (ctx.filter blur, with a fallback), build a grayscale alpha mask on another offscreen canvas that says where the blur is strong, multiply the blurred copy by the mask (destination-in), and draw it over the sharp frame. Masks: gaussian = uniform; tilt = horizontal band centred at tiltPosition (% of height, 50 = middle), a sharp zone of height tiltFocus (% of height) and linear feather of tiltFeather (% of height) on each side, rotated by blurAngle degrees; directional = linear gradient across the angle blurAngle (blur grows away from the centre line, both sides only if directionalBothSides), and the blur itself should be a motion blur along that angle (approximate by drawing the frame several times with small offsets along the angle at low alpha); lens = radial gradient centred at (blurCenterX, blurCenterY) in %, sharp inside lensFocus (% of the shorter side), blurred outside; progressive = linear vertical gradient starting at progressivePosition (% of height), reversed if progressiveReverse. For the preset (tilt, 30, 35, 50, 15) the middle band stays sharp and the top and bottom soften.

Post effects (lib/ascii/post-effects.ts), each a function (ctx, w, h, intensity 0..100, time) applied in this fixed order for every enabled key: pixelate, chromatic, bloom, halftone, scanLines, filmGrain, filmDust, glitch, vignette. Definitions: scanLines = dark horizontal lines every 3px, alpha intensity/100 * 0.5. vignette = radial gradient from transparent to black, alpha up to intensity/100. bloom = blurred copy of the frame (blur about 6px) composited with "screen" at alpha intensity/100 * 0.8. chromatic = shift the red channel left and the blue channel right by intensity/100 * 6 px (pixel operation on the frame). filmGrain = a pre-generated 256x256 noise tile drawn tiled at a random offset each frame, alpha intensity/100 * 0.25 using "overlay". glitch = on random short bursts, copy 2 to 6 horizontal slices of the frame shifted sideways by up to intensity/100 * 40 px, plus an occasional colour offset. halftone = a rotated dot screen (45 degrees, spacing about 6 px, dot size by local luminance) multiplied over the frame at alpha intensity/100 * 0.6. pixelate = downscale the frame by a block size of 1 + intensity/100 * 12 and draw it back with imageSmoothingEnabled = false. filmDust = sparse specks and a few hairline scratches, count proportional to intensity, re-seeded about 12 times per second from the time value, drawn in near-white and near-black at low alpha. The preset enables chromatic 20, halftone 20 and filmDust 20 only.

Lights and mask (lib/ascii/lights.ts, lib/ascii/mask.ts): lights = for each point {x, y (0 to 1), radius (fraction of the shorter side), intensity (0 to 100), optional colour default #ffffff} draw a radial gradient with globalCompositeOperation "lighter" (use "screen" if "lighter" clips too hard). Mask = if mask.enabled and mask.dataUrl, load it as an image once (cache), and reveal the plain photo through it: draw the plain photo on an offscreen canvas, apply the mask alpha with destination-in (or destination-out when mask.invert is true), then draw that on top of the effect. The freehand mask editor UI is out of scope: only the dataUrl path is required, plus the `mask.showOverlay` flag may tint the masked area red at 35% alpha.

Animation (lib/ascii/animation.ts): export a function that returns a time-varying modulation for a cell. Let t = elapsed seconds * (animSpeed.enabled ? animSpeed.intensity / 100 : 0) and amp = animIntensity.enabled ? animIntensity.intensity / 100 : 0; if `animated` is false, t is 0 (a still frame) and matrix mode renders one frame. Styles: shimmer = L modulated by amp * 0.18 * sin(t * 2.2 + hash(cell) * 2pi) and, for characters mode, the ramp index jitters by up to one step; wave = L shifted by amp * 0.25 * sin(t * 2 + x * 0.12 + y * 0.07); pulse = all cells shift by amp * 0.2 * sin(t * 1.6) together; ripple = shift by amp * 0.3 * sin(t * 3 - distanceFromCentre * 0.15); flicker = random per-cell flips that change about 8 times per second with probability amp * 0.08. Modulated L is clamped to 0..1.

Component (components/ui/ascii-art.tsx, "use client"): props = { src: string; params?: Partial<AsciiParams>; className?; onReady?: () => void } where the default params are FOREST_PRESET. Behaviour: an HTMLCanvasElement fills its container (ResizeObserver, devicePixelRatio capped at 2); load the image once per src (crossOrigin = "anonymous" for remote URLs, blob URLs work too) and show nothing but the near-black background until it is ready; run the pipeline in requestAnimationFrame (target 30 fps cap for the post-effect heavy path, 60 for plain); cache the sampled grid; redraw on parameter changes; pause while the tab is hidden or the canvas is off screen (IntersectionObserver); under prefers-reduced-motion render a single still frame; dispose observers and cancel animation frames on unmount; handle React Strict Mode double mounting without leaking loops. The pipeline order is exactly the recipe steps 1 to 7 above, with the animation (step 8) feeding the cell loop and the post effects.

Demo (components/ascii-forest-demo.tsx, "use client", rendered full viewport from app/page.tsx, no wrapper that removes height): a full-viewport AsciiArt using /forest.jpg and FOREST_PRESET, plus a small unobtrusive control bar fixed at the bottom with: a render mode <select> (all modes in the recipe), a charSet <select> (shown only for characters mode), a cell size range input (6 to 24), an "Animate" checkbox, and an "Upload photo" button that swaps the src to the chosen file. All controls are labelled and keyboard accessible. Keep styling minimal (Tailwind, dark translucent bar).

VERIFICATION
I have no browser here, so skip screenshots. Run `npm run lint`, `npm run build`, start `npm run dev` and confirm HTTP 200 on http://localhost:3012 and that /forest.jpg returns 200 with an image content-type. Because the output is drawn pixels, also add a tiny Node sanity script scripts/check-pure.mjs (not shipped to the browser) that imports nothing from the DOM and unit-checks the pure helpers by re-implementing the formulas inline is NOT acceptable: instead export the pure helpers (tone curve LUT builder, contrast factor, charset index mapping, hash, Bayer matrix, marching squares segment generator) from their modules without touching the DOM, and write scripts/check-pure.ts run with `npx tsx scripts/check-pure.ts` (npm install -D tsx) that asserts a few facts: LUT of the identity curve is identity, contrast factor at 0 is 1, charset index for L=0 is 0 and for L=1 is the last, hash is deterministic, marching squares on a constant grid returns no segments. Add it as `npm run check` in package.json. State plainly in the final report that visuals (the look of the ASCII effect, animation, blur, post effects) were NOT verified, because there is no browser. Do not claim they look right.

DOCS
- 12-ascii-forest/README.md in the sections of commits 22 to 24: what it demonstrates (a Canvas2D recreation of the "Forest" ASCII-art effect: a grayscale ASCII rendering of a photo, with a tilt-shift blur, chromatic offset, halftone and film dust, gently shimmering); install, run, URL/port 3012; the full AsciiParams reference table (every key with type, range and default, grouped: render, background, tone and colour, blur, post effects, animation, lights, mask); the list of render modes with one line each; the pipeline steps as implemented; animation styles with their formulas; performance notes (grid sampled once and cached, post effects throttled, pauses off screen, reduced motion); Assumptions (contrast interpretation, how density/edgeEmphasis/animation are interpreted, bgColor added, mask editor UI out of scope, photo source and whether it fell back to procedural, ctx.filter fallback); troubleshooting (blank canvas means the image failed to load, a very harsh high-contrast look is expected because contrast 128 uses the -255..255 formula, heavy CPU use means lower the resolution or cellSize, Safari lacks ctx.filter); credits (the effect is a reimplementation from the public recipe of the "Forest" preset on 21st.dev, no code copied; the photo credit).
- 12-ascii-forest/PROMPT.md = this ENTIRE message, verbatim.
- Root README index row for 12 (folder, name, stack, run command, port 3012).

PUSH
After all commits are made, push to main once. If push auth is needed, stop and tell me. Final report: raw output of `git log --format="%h %an <%ae> %s" -n 40` and `git push`, the folder tree (3 levels), the outputs of `npm run lint`, `npm run build` and `npm run check`, the photo source (Unsplash ID or "procedural"), and the verification results.
</USER_REQUEST>
<ADDITIONAL_METADATA>
The current local time is: 2026-10-16T23:08:36+05:30.

The user's current state is as follows:
Active Document: d:\PEAK FRONTENDS\11-draggable-widget-grid\.editorconfig (LANGUAGE_UNSPECIFIED)
Cursor is on line: 1
Other open documents:
- d:\PEAK FRONTENDS\11-draggable-widget-grid\.editorconfig (LANGUAGE_UNSPECIFIED)
</ADDITIONAL_METADATA>