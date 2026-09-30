# Liquid Glass Carousel

An infinite horizontal carousel of portrait photos rendered in WebGL, with a liquid-glass lens sitting over the centered panel.

## Installation

```bash
npm install
```

## Running the app

```bash
npm run dev
```

Then open [http://localhost:3003](http://localhost:3003) in your browser.

This project runs on **port 3003** (`next dev -p 3003`), so it can be open alongside `01-prism-hero` (3000) and `02-gateway-flow` (3002).

## What it demonstrates

A single reusable component, `LiquidGlassCarousel`, drawn with Three.js and animated with GSAP. It shows:

* An infinite row of portrait panels. The item list is rendered four times into a pool and wrapped around the scroll offset, so the row never runs out at either end.
* A liquid-glass lens in the center. The scene is rendered to an offscreen `WebGLRenderTarget`, then a fullscreen quad runs a custom fragment shader over it: chromatic dispersion with 16 taps along a radial offset, a blue shimmer ring, a bright rim line, edge refraction that bends the pixels near the lens boundary, and a radial glow.
* Scroll-driven motion. Momentum, friction, and snap-to-nearest-panel are integrated per frame, and the panels shrink slightly while the row is moving fast.
* Focus mode. Clicking the centered panel scales it up while the others drop away below the viewport with a stagger ordered by distance from the focus.
* An optional intro. With `entry` enabled, panels rise from below the screen and then grow to full size in a staggered sequence while the lens blooms in. The demo passes `entry={false}` so the carousel is visible immediately.
* Graceful WebGL failure. A React error boundary and an internal fallback render a short message instead of crashing if the context cannot be created.
* Accessibility basics: `role="region"` with `aria-roledescription="carousel"`, a visually hidden label, and a polite live region announcing the current title and position.

### Why `components/ui` matters

The component lives in `components/ui/liquid-glass-carousel.tsx` and imports `cn` from `@/lib/utils`, and its sibling utility lives in `components/ui/liquid-glass-carousel-utils/webgl-error-boundary.tsx`. Those two paths are not arbitrary:

* `components.json` (written by `npx shadcn@latest init`) declares `"ui": "@/components/ui"` as the alias for components added by the shadcn CLI. Anything the CLI generates later lands in that folder, so matching it keeps the project consistent and means `npx shadcn@latest add <component>` works with no extra configuration.
* `@/components/ui` is the import path this component and its imports are written against, and `@/lib/utils` is where the CLI puts the `cn` helper (clsx + tailwind-merge). Both aliases are declared in `tsconfig.json` and resolve at build time.
* Keeping the WebGL engine in `components/ui` next to its private helper in a `-utils` subfolder means the whole feature can be copied out as one unit, which is the convention the rest of the shadcn ecosystem follows.

## Controls

| Input | Action |
| :--- | :--- |
| Mouse wheel | Scroll the row horizontally, with momentum and snap |
| Click and drag | Scroll by dragging; touch drag works the same way |
| Click the centered photo | Focus it: it scales up, the rest drop away, and a "Close" button appears |
| Click an off-center photo | Scroll it into the center, then focus it once it settles |
| `ArrowRight` / `ArrowLeft` | Step one panel forward or back |
| `Escape` | Close focus mode and return to the row |
| "Close" button | Same as `Escape` |

The root element is focusable (`tabIndex={0}`), so click into the carousel once, then use the arrow keys and `Escape`.

## Props of LiquidGlassCarousel

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `items` | `LiquidGlassCarouselItem[]` | `liquidGlassCarouselDefaultItems` | Panels to render. Each item is `{ src, title, aspect? }`; `aspect` (width / height) is measured from the image when omitted. |
| `panelHeight` | `number` | `450` | Target panel height in CSS pixels. Scaled down when the container is shorter. |
| `gap` | `number` | `12` | Horizontal gap between panels, in CSS pixels. |
| `background` | `string` | `"#ffffff"` | Background color. Accepts a hex value; anything else falls back to white. |
| `entry` | `boolean` | `true` | Play the rise-and-grow intro. Ignored when the user prefers reduced motion. |
| `className` | `string` | `undefined` | Extra classes merged onto the root element. |
| `style` | `CSSProperties` | `undefined` | Inline styles merged onto the root element. |
| `onActiveChange` | `(index: number) => void` | `undefined` | Called with the index of the centered item whenever it changes. |
| `onFocusChange` | `(focused: boolean) => void` | `undefined` | Called with `true` when focus mode opens and `false` when it closes. |

The container must have an explicit height. The component fills its parent (`h-full`), so it needs something like `h-svh` or `h-screen` on the wrapper, which is what `components/liquid-glass-carousel-demo.tsx` does.

## Requirements

* **A browser with WebGL.** Without it the component renders the fallback message: "This carousel needs WebGL, which is unavailable in this browser."
* **An internet connection.** The eight default photos are loaded from `images.unsplash.com` at runtime. They are not bundled, so offline the panels appear as empty placeholders. All eight IDs were checked with `curl -sI` and returned HTTP 200.

## Verification status

`npm run build` passes and the dev server returns HTTP 200 on port 3003. The build environment has no browser, so the visual result has **not** been confirmed: the lens refraction, scrolling, and focus mode were not seen. Check them locally.

## Deviations from the original spec

* **No image swaps.** All eight Unsplash IDs in the component returned HTTP 200, so no `photo("...")` call was modified.
* **ESLint rule disabled for the verbatim component.** The component assigns the latest `onActiveChange` / `onFocusChange` callbacks to refs during render (lines 1419-1420). The React Compiler rule `react-hooks/refs` reports that as "Cannot update ref during render". The file is kept verbatim as instructed, so `eslint.config.mjs` turns off `react-hooks/refs` for `components/ui/liquid-glass-carousel.tsx` only, with a comment explaining why. No other rule or file is affected.
* **`app/globals.css` simplified.** `npx shadcn@latest init` writes a full theme file. Per the setup instructions it was replaced with the tailwind import plus `body { margin: 0; background: #fff; }`, so no global styling competes with the carousel. The carousel's own colors come from the `background` prop, not from CSS variables.
* **Ambiguity resolved by default: the demo is imported as a default export.** The spec's `demo.tsx` has a default export named `Page`. It was saved unchanged to `components/liquid-glass-carousel-demo.tsx`, and `app/page.tsx` imports that default. `app/layout.tsx` is the create-next-app + shadcn default and was left alone.
