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
