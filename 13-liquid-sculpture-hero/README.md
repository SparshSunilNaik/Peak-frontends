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
