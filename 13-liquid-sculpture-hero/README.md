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
