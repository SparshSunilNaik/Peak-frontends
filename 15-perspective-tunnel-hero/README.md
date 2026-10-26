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

## Images

The hero component hardcodes an array of nine image cards mirrored from `cdn.21st.dev`:

| Index | Title | URL | Status | Content-Type | Replaced? |
|:-----:|:------|:----|:------:|:------------:|:---------:|
| 0 | Chroma I | `https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 1 | Prism III | `https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 2 | Ether IV | `https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 3 | Quantum V | `https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c440db3f71d4e8c03262a3287577.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 4 | Nebula VI | `https://cdn.21st.dev/assets/mirror/ef/ef25eff6ce655fba459b3b7e7711524dc92499aa18f6c7dbea9a0fcc56a8f908.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 5 | Cyber VII | `https://cdn.21st.dev/assets/mirror/f2/f28b370a5dcbf76240f1504579c4b05fc0ff0bb990a42aff8dc2f73a5dc46072.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 6 | Flux VIII | `https://cdn.21st.dev/assets/mirror/f2/f26a1eac85704dda924820392dedfb72d51d8261d35354f83b35d683617295f3.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 7 | Aether IX | `https://cdn.21st.dev/assets/mirror/77/7755d23eaaa0aa5b403343f44afa7a29b2d06d3065fe54c602b14ba01d00f2aa.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |
| 8 | Chroma X | `https://cdn.21st.dev/assets/mirror/65/657317761fe9058a1d43711b13c543a71eb5199b7a5d9abf4c28479674e39cf7.jpg` | HTTP 200 OK | `image/jpeg` | No (kept verbatim) |

All 9 image URLs responded with HTTP 200 OK and valid image content types. Per specification instructions, no fallback Unsplash replacements were required and the original component `IMAGES` array is committed 100% verbatim.

## Accessibility Notes

- **Image Alternative Text**: Every image element specifies an `alt` attribute populated directly with the artwork title (`card.item.title`).
- **Heading Hierarchy**: The component includes an `<h1>` element ("INTO THE ETHER.") for primary heading semantics, though it lacks higher-level ARIA landmark roles (such as `<main>` or `<section aria-label="...">`).
- **Wheel Trapping Consideration**: The container captures mouse wheel events via `e.preventDefault()`. While this prevents unexpected page jitter during tunnel interaction, it intercepts standard page scrolling while the pointer rests inside the viewport.
- **Keyboard Access**: There is no keyboard alternative (arrow keys, spacebar, or tab navigation) to traverse the tunnel corridor in the original component.
- **Reduced Motion**: The component integrates Framer Motion's `useReducedMotion()`. When a user enables reduced motion preferences in their operating system, mouse camera parallax is automatically disabled.

## Troubleshooting

- **Cards are missing or blank**:
  Verify network connectivity to `https://cdn.21st.dev`. If an ad blocker or strict firewall blocks access to the domain, check browser Developer Tools (Network tab) for blocked resource requests.
- **Horizontal scrollbars or offset centering**:
  Ensure the component is rendered directly in `app/page.tsx` without an outer container constraint. Wrapping the hero in a container such as `max-w-3xl` forces the `w-screen` hero to overflow and creates horizontal scrollbars.
- **Cards appear flat without 3D depth**:
  Confirm that `transformStyle: "preserve-3d"` is maintained on the root container and inner plane, and that the root container retains `perspective: 1200px` (or `900px`). Removing or overriding these CSS styles flattens the Z-index space into a 2D plane.

## Deviations from the Original Spec

1. **Direct Component Rendering on Home Page**:
   The original spec includes `components/perspective-tunnel-hero-demo.tsx` (`DemoOne`), which wraps the hero inside `<div className="w-full max-w-3xl">`. Because `PerspectiveTunnelHero` is defined as `h-[100svh] w-screen` and computes pixel positions relative to `window.innerWidth`, placing it in a `max-w-3xl` container causes overflow, horizontal scrollbars, and an off-center view. As required, `app/page.tsx` renders `<PerspectiveTunnelHero />` directly full screen with no wrapping container. The demo component is preserved verbatim in `components/perspective-tunnel-hero-demo.tsx` for reference.
2. **Image URLs**:
   All 9 original image URLs from `cdn.21st.dev` verified successfully with HTTP 200 OK and `Content-Type: image/jpeg`. No URLs were altered or substituted.
3. **ESLint `@next/next/no-img-element` Override**:
   The vendored component utilizes native `<img>` elements rather than `next/image` to prevent layout interference in 3D CSS transforms. ESLint flagged:
   ```
   D:\PEAK FRONTENDS\15-perspective-tunnel-hero\components\ui\perspective-tunnel-hero.tsx
     128:17  warning  Using `<img>` could result in slower LCP and higher bandwidth. Consider using `<Image />` from `next/image` or a custom image loader to automatically optimize images. This may incur additional usage or cost from your provider.  @next/next/no-img-element
   ```
   Because modifying vendored files is strictly prohibited, `@next/next/no-img-element` was scoped to `"off"` in `eslint.config.mjs` for the vendored files.

## Assumptions

- **Node.js Engine**: Declared `>=20` in `package.json` engines and set `.nvmrc` to `20` to guarantee compatibility with Next.js 16 and modern ES features.
- **Root Theme**: Retained shadcn's default styling where dark styles activate when an ancestor has the `dark` class, presenting the light theme by default as designed.
- **Application Favicon**: Provided a custom SVG icon at `app/icon.svg` representing the concentric 3D tunnel corridor.


