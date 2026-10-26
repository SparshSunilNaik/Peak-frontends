# 15 · Perspective Tunnel Hero

An interactive, full-screen 3D perspective tunnel hero component built with Next.js, React 19, Tailwind CSS v4, shadcn conventions, and Framer Motion.

## Overview

This project showcases a spatial 3D corridor where nine art cards float in depth around a central architectural title ("INTO THE ETHER."):
- **Spatial 3D Tunnel Flight**: Scrolling the mouse wheel or trackpad smoothly drives camera progress forward through the corridor. Cards approach from far in the distance, expand as they pass the camera plane, and fade away into the foreground.
- **Spring-Smoothed Parallax**: Moving the cursor pans the camera slightly across both X and Y axes, creating realistic spatial parallax depth.
- **Dynamic Typography**: The central headline scales from 0.7 to 1.35 and fades with scrub progress, while the subtle "Scroll to Explore" indicator dismisses once flight begins.
- **Golden-Angle Card Layout**: Cards are spaced around an algorithmic spiral pattern with individual radius factors and alternating Z-axis tilts.

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) with React 19
- **Animation**: [Framer Motion 14](https://motion.dev) (`framer-motion@14.6.0`)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (`tailwindcss@4.3.3`)
- **Design System / Primitives**: [shadcn](https://ui.shadcn.com) (`components.json`, CSS variables, `lib/utils.ts`)
- **Language**: TypeScript 5

### Why `components/ui` Matters

The `components/ui` directory is the canonical location defined by the shadcn registry specification and configured in `components.json` via the alias `@/components/ui`. Maintaining this exact directory structure:
1. **Preserves Standard Import Paths**: Reusable UI components and community templates reliably resolve via `@/components/ui/<component-name>`.
2. **CLI Compatibility**: The `shadcn` CLI tooling expects this path when generating, adding, or updating primitives.
3. **Architectural Separation**: Separates lower-level, vendored UI components from page routes and composite views.

## Installation & Running

### Prerequisites

- Node.js `>= 20.0.0` (declared in `package.json` engines and `.nvmrc`)
- npm 10+

### Quick Start

```bash
# Navigate to the frontend directory
cd 15-perspective-tunnel-hero

# Install dependencies
npm install

# Start development server on port 3015
npm run dev
```

Visit [http://localhost:3015](http://localhost:3015) in your web browser.

### Scripts

- `npm run dev`: Runs Next.js development server on port 3015 (`next dev -p 3015`).
- `npm run build`: Compiles production Turbopack bundle with static optimization.
- `npm run start`: Starts production server.
- `npm run lint`: Checks codebase with ESLint (using Flat Config `eslint.config.mjs`).
- `npm run typecheck`: Runs TypeScript compiler verification (`tsc --noEmit`).

## How It Works

### 1. Spatial Card Distribution & Golden-Angle Spiral

The component positions nine image cards around the camera tunnel using an algorithmic spiral:
- **Golden Angle**: Each card index $i$ is offset by $i \times 137.5^\circ$ ($i \times 137.5 \times \frac{\pi}{180}$ radians). This distributes cards evenly around the circular perimeter without alignment clusters.
- **Dynamic Radial Offsets**: Radius factors vary cyclically:
  - $R_x = 0.28 + (i \bmod 3) \times 0.08$
  - $R_y = 0.26 + (i \bmod 2) \times 0.09$
  Base card coordinates in pixels are computed as:
  $$\text{baseX} = \cos(\theta) \times (\text{stage.width} \times R_x)$$
  $$\text{baseY} = \sin(\theta) \times (\text{stage.height} \times R_y)$$
- **Z-Axis Tilt**: Alternating subtle rotational roll gives cards an organic floating posture:
  $$\text{rotationZ} = (i \bmod 2 = 0 \;?\; 1 : -1) \times (3 + (i \bmod 5) \times 2)^\circ$$

### 2. Camera Depth, Staggering & Motion Values

- **Wheel Scrubbing Progress**: Mouse wheel / trackpad delta is captured via an active `wheel` event listener on the hero container (`deltaY * 0.0008`) and accumulated into a motion value clamped between `0` and `1`.
- **Spring Smoothing**: The raw progress is smoothed through `useSpring` with `{ stiffness: 80, damping: 30, restDelta: 0.0001 }`.
- **Staggered Progression**: Each card activates within a staggered window:
  - Stagger span: $0.55$
  - Start: $\frac{i}{\text{total}} \times (1 - 0.55)$
  - End: $\text{start} + 0.55$
  Each card calculates `localProgress = useTransform(progress, [start, end], [0, 1])`.
- **Z-Depth Travel**:
  - Desktop: maps `localProgress` from $-1700\text{px}$ (far in the corridor) to $+500\text{px}$ (past the camera).
  - Mobile: maps `localProgress` from $-1200\text{px}$ to $+350\text{px}$.
- **Fade Envelope**: Opacity follows `[0, 0.18, 0.82, 0.98] -> [0, 1, 1, 0]`, making cards smoothly materialize as they emerge from the background fog, remain fully crisp as they traverse mid-depth, and gently dissipate as they fly past the viewpoint.
- **3D Context**: The outer container applies `perspective: 1200px` (or `900px` on mobile) and `transform-style: preserve-3d`. The cards translate in 3D space using `translate3d(...) rotateZ(...)`.

### 3. Mouse Parallax Pan & Responsive Stage

- **Pointer Parallax**: Normalized mouse coordinates $([-1, 1])$ are filtered through a spring (`stiffness: 60, damping: 25, mass: 0.5`) to pan cards across the stage by up to $\pm 45\text{px}$ on desktop and $\pm 20\text{px}$ on mobile.
- **Reduced Motion Support**: If `useReducedMotion()` returns true, camera parallax is disabled.
- **Title Scaling & Prompt Dismissal**: The central headline scales from $0.7\times$ to $1.35\times$ with opacity ramping `[0.25, 1, 1, 0]`. The "Scroll to Explore" footer prompt fades to zero within the initial $12\%$ of tunnel travel.

## Controls & Limitations

- **Wheel / Trackpad Only**: The tunnel camera is controlled strictly through `WheelEvent` listening. There are no built-in touch gestures (e.g. touch drag) or keyboard controls (e.g. arrow keys/PageDown). Consequently, mobile touch-only visitors and keyboard-only users cannot scrub through the corridor.
- **Wheel Capture Behavior**: The hero attaches a non-passive `wheel` event listener with `e.preventDefault()`, which prevents the host web page from scrolling while the cursor is hovering over the hero viewport.
- **Hardcoded Image Assets**: The component embeds a static `IMAGES` array of 9 images and exposes no props for dynamic configuration or slot injection.
- **Dark Mode Requirement**: Styling utilizes Tailwind's `dark:` modifier (`@custom-variant dark (&:is(.dark *));`). Because Next.js initializes without a root `.dark` class by default, the light color scheme is active unless an ancestor element explicitly declares `class="dark"`.

