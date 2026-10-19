# 13-liquid-sculpture-hero

An interactive WebGL2 hero section featuring a sculpture reconstructed from ~100k GPU-simulated particles sampled directly from image pixels. The cursor turns the material liquid; as interaction eases, it seamlessly settles back into a crisp high-resolution image. If WebGL2 or floating-point render targets are unavailable, a static fallback image is displayed gracefully.

---

## Why `components/ui` Matters

In projects following the shadcn/ui architecture and modern Next.js conventions, `components/ui` represents the designated home for primitive, headless, or reusable design system elements (such as `button.tsx` or `liquid-sculpture-hero.tsx`):
1. **Clean separation of concerns**: Visual primitives and rendering engines are decoupled from high-level page layouts, demo compositions, or route logic.
2. **Standard import path**: Standardizing on `@/components/ui/*` allows teams and component registries to drop in components without path conflicts.
3. **Composability and Reusability**: The `<SculptureHero />` component can be imported into any route or layout across the application with customizable props.

---

## Features

- **GPGPU Fluid Simulation**: ~100k particles driven by a custom WebGL2 fragment shader evaluating cursor repulsion, rotational swirl, curl-noise turbulence, and elastic return springs.
- **Dynamic Liquid Wake**: A low-resolution flow map texture captures cursor motion and velocity, leaving a fluid disturbance trail that dissipates over time.
- **Complementary Cross-Fade**: Energy calculations balance the sharp sculpture image pass with the particle pass, ensuring a seamless cross-fade where material liquefies and solidifies without opacity pops.
- **Velocity Streaks & Specular Glint**: Accelerating particles stretch along their velocity vector into comet-like capsules with liquid metal specular glints.
- **Built-in Navigation**: Responsive header containing brand identity (`Forma®`), anchor links (`Work`, `Studio`, `Approach`, `Journal`), a light/dark mode switch, and an action button (`Contact`).
- **Typography & Hero Content**: Large-format headline with an italic serif accent phrase, supporting descriptive body copy, primary pill button (`Start a project`), and underline secondary link (`Selected work`).
- **Giant Faint Backdrop Word**: Subtle background watermark text (`forma`) responsive to viewport scaling.
- **Adaptive Performance**: Sleeps when quiescent, throttles on low-power devices (4 or fewer cores, coarse touch pointers, <= 4GB RAM), and respects `prefers-reduced-motion`.

---

## Getting Started

### Prerequisites
- Node.js `>= 20.0.0` (see `.nvmrc`)
- npm

### Installation
```bash
cd 13-liquid-sculpture-hero
npm install
```

### Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3013](http://localhost:3013) with your browser.

### Quality Scripts
```bash
npm run lint       # Run ESLint validation
npm run typecheck  # Run TypeScript type-checking without emitting files
npm run build      # Build the production Next.js application
```

---

## Props Reference

The component exports `<SculptureHero />` as its default export, configurable via `SculptureHeroProps`.

### Navigation Link Type
```ts
export interface SculptureHeroLink {
  label: string;
  href: string;
}
```

### `SculptureHeroProps` Reference Table

| Category | Prop | Type | Default Value | Description |
|---|---|---|---|---|
| **Images** | `src` | `string` | `"https://cdn.21st.dev/assets/mirror/ae/ae8c3de9003460e59182e950ccd345f68f27f9d0e4808b64c92c962a4eca7120.webp"` | Light theme sculpture image (must be CORS-enabled if remote). |
| | `darkSrc` | `string` | `"https://cdn.21st.dev/assets/mirror/a1/a1fa387b6e417b26a25f317559c87cce4d241c1052c52a2b3bc2966b2aaf9b65.webp"` | Optional image for dark theme. |
| | `mobileSrc` | `string` | `"https://cdn.21st.dev/assets/mirror/b0/b0c8d8e5d64b8cec906a3b390e3dc7c9a5af08334bf0632873c601782cb4bc46.webp"` | Optional portrait image for phones in light theme. |
| | `mobileDarkSrc` | `string` | `"https://cdn.21st.dev/assets/mirror/9a/9a82cb59be1bfde59855b79d7a565e487155a89f4d52eac74dcc10e267b2b6d1.webp"` | Optional portrait image for phones in dark theme. |
| | `imageAlt` | `string` | `"Abstract sculpture of interwoven metallic filaments and particles"` | Accessible description for screen readers. |
| | `imageBackground` | `string` | `"#EAE9E7"` (in DEFAULTS) | Background color of non-transparent images to key out pixels. |
| **Content** | `brand` | `string` | `"Forma®"` | Brand name rendered in the top nav. |
| | `navLinks` | `SculptureHeroLink[]` | `[Work, Studio, Approach, Journal]` | Array of navigation links. |
| | `navCta` | `SculptureHeroLink` | `{ label: "Contact", href: "#" }` | Call to action pill button in the nav. |
| | `showNav` | `boolean` | `true` | Whether to display the navigation bar. |
| | `eyebrow` | `string` | `"Independent studio — Est. 2019"` | Small uppercase metadata line with horizontal dash. |
| | `headline` | `string` | `"Form that\nanswers back."` | Main heading. Split on `\n` into separate visual lines. |
| | `headlineAccent` | `string` | `"answers back."` | Substring of the headline set in the italic accent font. |
| | `body` | `string` | `"We shape products, identities and spaces..."` | Descriptive paragraph text under the headline. |
| | `primaryCta` | `SculptureHeroLink` | `{ label: "Start a project", href: "#" }` | Primary button with animated arrow icon. |
| | `secondaryCta` | `SculptureHeroLink` | `{ label: "Selected work", href: "#" }` | Secondary underline text link with arrow icon. |
| | `hint` | `string` | `"Move across the form"` | Pulse dot indicator text shown for pointer devices. |
| | `hintTouch` | `string` | `"Touch the form"` | Pulse dot indicator text shown for touch devices. |
| | `backdropText` | `string` | `"forma"` | Giant faint watermark word placed behind the sculpture. |
| | `showCredit` | `boolean` | `true` | Attribution link to author in bottom corner. |
| **Look & Feel** | `background` | `string` | `"#EBE9E5"` | Light theme hero background color. |
| | `darkBackground` | `string` | `"#111110"` | Dark theme hero background color. |
| | `theme` | `"light" \| "dark"` | `"light"` | Initial theme on component load. |
| | `themeToggle` | `boolean` | `true` | Whether to render the light/dark theme button in the nav. |
| | `textColor` | `string` | auto (`#151514` or `#F1EFEA`) | Primary text color. |
| | `accentColor` | `string` | auto (matches text color) | Accent color for the italicized headline text. |
| | `headingFont` | `string` | `"'Geist', 'Helvetica Neue', Arial, sans-serif"` | Font family for headings and brand. |
| | `accentFont` | `string` | `"'Instrument Serif', 'Times New Roman', serif"` | Font family for headline accent text. |
| | `bodyFont` | `string` | `"'Geist', 'Helvetica Neue', Arial, sans-serif"` | Font family for body and labels. |
| | `loadFonts` | `boolean` | `true` | Injects Google Fonts link tag for Geist & Instrument Serif. |
| | `height` | `string` | `"100svh"` | Hero height (fills the viewport with no scrolling). |
| | `sculptureScale` | `number` | `1` (`0.3` to `3`) | Scaling multiplier for desktop/tablet sculpture. |
| | `mobileSculptureScale` | `number` | `1` (`0.3` to `3`) | Scaling multiplier for phone sculpture. |
| | `sculptureX` | `number` | `0` (% of width) | Horizontal offset percentage. |
| | `sculptureY` | `number` | `0` (% of height) | Vertical offset percentage. |
| **Physics** | `interactive` | `boolean` | `true` | Enables cursor repulsion and touch interaction. |
| | `strength` | `number` | `1` (`0` to `2`) | Force multiplier for cursor push and swirl. |
| | `radius` | `number` | `220` (`40` to `600`) | Disturbance radius in CSS px at 1440px viewport width. |
| | `particleDensity` | `number` | `1` (`0.15` to `2`) | Density multiplier for generated particle grid. |
| | `dotSize` | `number` | `1` (`0.2` to `3`) | Particle radius scale relative to grid cell size. |
| | `particleSpread` | `number` | `1` (`0` to `2`) | Travel distance of disturbed particles. |
| | `turbulence` | `number` | `1` (`0` to `2`) | Curl-noise swirl intensity. |
| | `liquid` | `number` | `1` (`0` to `2`) | Global sculpture flow while hovered. |
| | `streaks` | `boolean` | `true` | Stretches high-speed particles into motion capsules. |
| | `restStyle` | `"image" \| "particles"` | `"image"` | Visual style when at rest (crisp image or particle field). |
| | `returnSpeed` | `number` | `1` (`0` to `2`) | Speed of spring elasticity returning particles home. |
| | `ambient` | `boolean` | `false` | Enables autonomous background fluid drift. |
| | `ambientIntensity` | `number` | `1` (`0` to `2`) | Intensity of background drift motion. |
| | `speed` | `number` | `1` (`0.25` to `3`) | Time progression speed multiplier. |
| | `intro` | `boolean` | `false` | Plays assembly animation on initial component mount. |

---

## How It Works

### 1. Particle Sampling & Grid Construction
- When an image loads, it is rendered into an offscreen 2D canvas at a grid resolution of $640$ (low power) or $1000$ (standard), scaled by $\sqrt{\text{particleDensity}}$.
- **Cut-out vs. Flat-background Detection**: The engine inspects pixel alpha values. If transparent pixels are abundant, alpha-thresholding identifies material. Otherwise, it samples the 4 image corners to determine the flat background color $\mathbf{c}_{\text{bg}}$ and keys material by color distance $|\mathbf{c} - \mathbf{c}_{\text{bg}}| > 0.03$.
- Each material pixel generates a particle with a normalized home coordinate $(x, y)$, depth jitter, and sampled RGB color, packed into floating-point textures (`uHome`, `uCol`).

### 2. GPGPU Simulation Loop
- Particle dynamic state is stored in ping-pong half-float framebuffers (`RGBA16F`) containing:
  - $(x, y)$: offset in CSS pixels from home
  - $(z, w)$: velocity vector $(v_x, v_y)$
- On each frame, `SIM_FS` executes a fragment shader over the state texture evaluating:
  - **Direct Cursor Repulsion**: An exponential radial push $\mathbf{n} \cdot e^{-r^2 / R^2} \cdot \text{strength}$.
  - **Rotational Swirl**: Orthogonal force $(-n_y, n_x)$ rotating material around the pointer.
  - **Fluid Wake Coupling**: Advection velocity sampled from the flow map texture.
  - **Curl Noise Turbulence**: Procedural 2D curl noise adding organic vortex filaments.
  - **Elastic Return Spring**: An elastic restoring force $-\mathbf{x} \cdot k$ snapping particles back home.

### 3. Cursor Flow Map
- A dedicated low-resolution ping-pong texture ($256 \times 104$, `FLOW_FS`) tracks the cursor's velocity and wake energy.
- The wake diffuses across neighbor texels and decays with a damping factor of $0.968^{\Delta t}$, producing persistent fluid currents behind cursor strokes.

### 4. Seamless Image & Particle Cross-Fade
- **Shared Energy Function**: Both the image shader (`IMAGE_FS`) and particle shader (`PART_VS`) compute the identical energy metric:
  $$\text{energyAt}(\mathbf{p}) = \text{smoothstep}\left(0.06, 0.5, 1.15 \cdot e^{-d^2/R^2} \cdot \text{presence} + 1.7 \cdot \text{wakeEnergy}\right)$$
- The crisp image pass lenses slightly under cursor displacement and fades out where energy is high:
  $$\text{imageAlpha} = 1.0 - \max(E, \text{restStyle})$$
- The instanced quad particle pass fades in with the exact complement:
  $$\text{particleAlpha} = \max(E, \text{lift}, \text{restStyle})$$
- This complementary transition guarantees zero visual seam or pop during the phase change between solid sculpture and liquid particles.

### 5. Velocity Streaks & Glint Shading
- Fast-moving particles stretch into capsules oriented along their velocity vector up to a maximum length of 18px.
- Glint highlights catch the virtual light when velocity exceeds threshold speeds, evoking liquid mercury.

### 6. Performance, Power & Accessibility
- **Quiescent Sleep**: When interaction ceases and particles settle (within 270 simulated frames), the animation loop halts completely unless `ambient` motion is enabled.
- **Intersection & Visibility Observers**: The render loop pauses when the hero is scrolled out of viewport or when the browser tab is hidden.
- **Low-Power Device Adaptation**: Devices with coarse pointers, $\le 4$ CPU cores, or $\le 4\text{ GB}$ RAM automatically downscale the particle grid ($640$ base) and clamp device pixel ratio to $1.5$.
- **Reduced Motion Support**: If `prefers-reduced-motion` is detected, cursor force and turbulence are halved, ambient drift is disabled, and intro animations are bypassed.
- **Touch Support**: Mobile and tablet interactions utilize touch press-and-drag with a 260ms release decay for natural tactile feedback.
- **Graceful WebGL2 Fallback**: If WebGL2, floating-point render targets, or CORS image pixel access fail, the underlying `<img>` fallback remains visible, ensuring the page remains visually intact. If a WebGL context loss occurs, the component automatically falls back to the static image.

---

## Images & CORS

The component's default props load four sculpture images from `cdn.21st.dev`:
1. `src` (Desktop Light): `https://cdn.21st.dev/assets/mirror/ae/ae8c3de9003460e59182e950ccd345f68f27f9d0e4808b64c92c962a4eca7120.webp`
2. `darkSrc` (Desktop Dark): `https://cdn.21st.dev/assets/mirror/a1/a1fa387b6e417b26a25f317559c87cce4d241c1052c52a2b3bc2966b2aaf9b65.webp`
3. `mobileSrc` (Mobile Light): `https://cdn.21st.dev/assets/mirror/b0/b0c8d8e5d64b8cec906a3b390e3dc7c9a5af08334bf0632873c601782cb4bc46.webp`
4. `mobileDarkSrc` (Mobile Dark): `https://cdn.21st.dev/assets/mirror/9a/9a82cb59be1bfde59855b79d7a565e487155a89f4d52eac74dcc10e267b2b6d1.webp`

### CORS Verification Results
All four remote assets were verified via preflight curl requests with origin headers (`curl -sI -H "Origin: http://localhost:3013" <url>`):
- **HTTP Status**: `200 OK` across all four endpoints
- **Content-Type**: `image/webp`
- **Access-Control-Allow-Origin**: `*` present on all four responses

Because all four CDN images returned proper permissive CORS headers, the project uses the default CDN images directly at runtime without requiring local asset duplication.

### Background Keying Rule
- If the image contains transparency (cut-out PNG/WebP), material is segmented directly using alpha thresholds ($A > 0.12$).
- If the image has an opaque background, the engine samples its 4 outer corners to detect the flat backdrop color and keys out background pixels whose Euclidean RGB distance is $< 0.03$. For custom images, pass `imageBackground="#HEX"` to guarantee clean boundary segmentation.

---

## Troubleshooting

- **Static image shown without particle effect**:
  - The browser or GPU environment does not support WebGL2 or floating-point render targets (`EXT_color_buffer_float` / `EXT_color_buffer_half_float`). The component automatically leaves the static `<img>` visible as a graceful fallback.
  - Remote image was blocked by CORS policy, preventing `ctx.getImageData()` from sampling pixels.
- **Sculpture looks tinted or exhibits a dark perimeter halo**:
  - The source image has a flat opaque background whose color differs slightly from the corners. Pass `imageBackground="#HEX"` matching the image backdrop color.
- **Page is blank at the top during load**:
  - Web fonts (`Geist`, `Instrument Serif`) or the remote image are loading across the network. Check browser network activity.
- **High GPU utilization or fan speed**:
  - Lower `particleDensity` (e.g. from `1` to `0.6`), increase `dotSize` slightly, or reduce window size.

---

## Deviations from the Original Spec

1. **Newline-Escape Syntax Fixes in `liquid-sculpture-hero.tsx`**:
   - In `DEFAULTS`: The broken literal newline `headline: "Form that\nanswers back.",` was formatted onto a single line with an escaped `\n` sequence.
   - In `function renderHeadline`: The broken split `const lines = text.split("\n")` was formatted onto a single line with an escaped `\n` sequence.
   - *Reason*: The original specification paste had raw unescaped line breaks inside double quotes, which caused fatal JavaScript syntax errors.
2. **ESLint Rule Adjustments in `eslint.config.mjs`**:
   - `react-hooks/refs`: Turned off for vendored files because the component intentionally writes to `layout.current` and `optsRef.current` during render to avoid stale prop closures in pointer listeners.
   - `react-hooks/set-state-in-effect`: Turned off for vendored files because `React.useEffect(() => setMode(theme), [theme])` explicitly synchronizes external theme prop changes with internal state.
   - `@next/next/no-img-element`: Turned off for vendored files because the component uses a raw `<img crossOrigin="anonymous" />` element inside `<div className="sh-stage">` as an unpresented WebGL pixel fallback.
3. **App Router Layout Prop Typing in `app/layout.tsx`**:
   - Replaced Next.js scaffold template type `LayoutProps<"/">` with standard React `Readonly<{ children: React.ReactNode }>`.

---

## Credits & License

- **Component & Animation Engine**: Created by [Guglielmo Giannattasio](https://guglielmogiannattasio.it), released on [21st.dev](https://21st.dev).
- **Default Fonts**: `Geist` (SIL Open Font License) and `Instrument Serif` (SIL Open Font License), loaded via Google Fonts with offline system font fallbacks.
- **Sculpture Artwork**: 3D sculpture renders served from `cdn.21st.dev` mirror assets.
