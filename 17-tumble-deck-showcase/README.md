# 17. Tumble Deck Showcase

An interactive, scroll-driven showcase featuring a stack of website screenshots standing on edge in 3D space. As you scroll, drag, or press arrow keys, the front card tips forward on its bottom edge hinged on the floor line, lands flat on the ground, the deck slides forward to the line, and the next card tumbles. The sequence loops infinitely in both directions.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn, and core GSAP.

---

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 10

### Installation
```bash
npm install
```

### Development Server
Run the local dev server on dedicated port **3017**:
```bash
npm run dev
```
Open [http://localhost:3017](http://localhost:3017) in your browser to view the showcase.

### Production Build & Linting
```bash
npm run typecheck   # Type-check TypeScript with noEmit
npm run lint        # Check ESLint rules
npm run build       # Build optimized production bundle
npm run start       # Start production server on port 3017
```

---

## Props and Types

### `TumbleDeckShowcaseProps`

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `cards` | `TumbleCard[]` | *required* | Array of cards with image sources and optional alt text. |
| `height` | `number \| string` | `"100svh"` | Total container height. Accepts any valid CSS length string or pixel number. |
| `aspect` | `number` | `2.06` | Card width divided by height (aspect ratio). Images are top-cropped into this frame. |
| `scrollPerCard` | `number` | `240` | Wheel or trackpad travel (in pixels) required to flip/tip one card. |
| `depth` | `number` | `5` | Number of upright cards rendered standing behind the active front card. |
| `background` | `string` | `"var(--color-background)"` | Container and floor gradient background color. |
| `className` | `string` | `undefined` | Additional CSS classes applied to root container. |
| `style` | `React.CSSProperties` | `undefined` | Additional inline styles applied to root container. |
| `ariaLabel` | `string` | `"Website showcase"` | Accessible region label for assistive technologies. |

### `TumbleCard`

```ts
export type TumbleCard = {
  src: string;
  alt?: string;
};
```

### Exported Pure Helpers & Types

```ts
export type Pose = {
  angle: number;   // Hinge angle in degrees (CSS rotateX)
  z: number;       // Deck position in card gaps from hinge line
  lift: number;    // Vertical lift in pixels off the floor
  opacity: number; // Card opacity [0, 1]
  shade: number;   // Front-face dark shading overlay [0, 1]
};

// Pure mathematical helper functions
export function clamp01(x: number): number;
export function wrap(k: number, n: number): number;
export function fallAngle(t: number): number;
export function deckAdvance(pos: number): number;
export function cardPose(k: number, pos: number, depth: number): Pose;
```

---

## How It Works

### Pure CSS 3D Scene
The entire tumbling animation is achieved with hardware-accelerated CSS 3D transformations (`preserve-3d`, `rotateX`, `translate3d`). All cards share a single common perspective set to 6 times the card height (`perspective: 6 * h px`), with `perspective-origin` aligned horizontally at 50% and vertically above the deck (`top - 1.66 * h px`). Every card is hinged on the exact same bottom floor line via `transform-origin: 50% 100%`.

### Infinite Linear Deck Coordinate
A single continuous float, `pos`, represents the deck's progress. As `pos` advances:
1. When `pos = 0`, card 0 stands upright at the front of the deck.
2. As `pos` increases from 0 to 1, card 0 tips forward and falls flat onto the floor, while standing cards behind slide forward by one gap.
3. Once card 0 hits the floor, card 1 is at the front and begins falling as `pos` advances from 1 to 2.

### Slot Pool Recycling
To maintain peak 60/120fps performance and zero DOM thrashing, the component maintains a small fixed pool of DOM slot elements:
$$\text{poolSize} = \text{depth} + 5$$
For a default depth of 5, only 10 DOM elements are ever mounted:
- Slot $j \in [0, \text{poolSize} - 1]$ is assigned virtual card index $k$ such that $k \equiv j \pmod{\text{poolSize}}$.
- Virtual card $k$ displays image item $k \pmod n$ using Euclidean modulo `wrap(k, n)`.
- A slot is only repointed to a new virtual card index when it is completely invisible (either buried below the floor stack at $k \le \lfloor pos \rfloor - 2$ or situated beyond the back of the visible deck at $k > \lfloor pos \rfloor + \text{depth} + 1$).

### Mathematical Pose Formulation
Each virtual card $k$'s pose is calculated dynamically via `cardPose(k, pos, depth)`:
- **Falling Card ($k = \lfloor pos \rfloor$)**: 
  - Progress $t = pos - k \in [0, 1]$.
  - `fallAngle(t)`: Eases downward with gravitational acceleration ($105.88 t^2$ up to $t \le 0.85$), strikes the floor, kicks upward with a damped bounce, and settles completely flat at $90^\circ$.
  - `shade`: Front face dims progressively (up to 0.45) as it rotates away from overhead lighting.
- **Standing Deck Cards ($k > \lfloor pos \rfloor$)**:
  - Distance behind front line: $u = k - \lfloor pos \rfloor$.
  - Slide advance: Deck smoothly shifts forward as the front card tumbles via `deckAdvance(pos) = 1 - (1 - (pos - \lfloor pos \rfloor))^2$.
  - Depth position: $z = -(u - \text{advance})$, with subtle perspective fade at the rear (`opacity` tapers off for $u > \text{depth}$).
- **Floor Pile Cards ($k < \lfloor pos \rfloor$)**:
  - Flat on floor at $90^\circ$ rotateX.
  - Layering lift: `lift = -1.2px * (k - floorBase)` ensures the newest card cleanly overlaps older ones without Z-fighting.
  - Only the latest two floor cards are rendered; older cards are clipped to `opacity = 0`.

---

## Interaction & Accessibility

### Control Schemes
- **Wheel / Trackpad**: Non-passive scroll listener captures wheel delta and pushes `targetPos`. Deck position smoothly chases `targetPos` using a GSAP ticker loop (`pos += (targetPos - pos) * 0.14`). When wheel input ceases for 140ms, the deck snaps cleanly to `Math.round(targetPos)`.
- **Drag & Scrub**: Pointer listeners track mouse or touch drag. Dragging scrubs the deck at a rate of 1 card per 1.1 card heights. Pointer release applies flick momentum clamped to at most 3 cards.
- **Click**: Clicking anywhere on the deck advances to the next card (`targetPos + 1`).
- **Keyboard**: 
  - `ArrowRight`, `ArrowDown`, `Space`, or `Enter`: Advance forward by 1 card.
  - `ArrowLeft` or `ArrowUp`: Step backward by 1 card.

### Accessibility (a11y)
- Root container is marked as `role="region"` with `aria-roledescription="carousel"` and `aria-label`.
- Fully keyboard-focusable with a distinct `focus-visible` outline using `var(--color-primary)`.
- Includes a visually hidden live region (`aria-live="polite"`) announcing the total page count and available interaction methods.
- Honors `prefers-reduced-motion`: When enabled, scrubbing and spring easing are bypassed, stepping directly between cards without transitional tweening.
- Card images specify `draggable={false}` and `decoding="async"`.

---

## Assets & Offline Functionality

- **Inlined WebP Images**: The demo includes nine high-fidelity website showcase templates embedded as base64 WebP data URIs inside `components/tumble-deck-showcase-demo.tsx`. The demo requires zero network connectivity and runs completely offline.
- **Custom / Remote Images**: You can pass any standard image URLs into `cards`. Because the component uses standard HTML `<img>` elements rather than `next/image`, no Next.js remote pattern configuration (`images.remotePatterns` in `next.config.ts`) or CORS setup is required.

---

## Troubleshooting

1. **Cards look unstyled or floor shading is absent**:
   The component relies on CSS theme variables `--color-background`, `--color-foreground`, and `--color-primary`. Ensure your application defines these variables or provides fallback values via the `background` prop.
2. **Page does not scroll while cursor is over the deck**:
   This is by design. The component attaches non-passive `wheel` listeners that invoke `event.preventDefault()` to enable smooth, precise scrub control of the 3D card tumble.
3. **Card sizing changes in non-standard viewport ratios**:
   Card width and height are dynamically computed to ensure the standing deck above and tumbling card below stay comfortably inside container bounds (`top = h + (H - 2 * h) * 0.44`). Extreme aspect ratios scale the card proportionally to avoid clipping.
4. **Large diffs in demo file**:
   `components/tumble-deck-showcase-demo.tsx` contains raw base64 data strings. It is listed in `.prettierignore` to prevent automated code formatters from splitting these strings.

---

## Deviations from Original Spec

- **Theme Colour Alias Block**: None needed. Verification of the production build confirmed that Tailwind CSS v4 and shadcn successfully emitted `--color-background:`, `--color-foreground:`, and `--color-primary:` declarations in `.next/static/chunks/*.css`.
- **ESLint Rule Adjustment**: Added an override in `eslint.config.mjs` disabling `@next/next/no-img-element` for `components/ui/tumble-deck-showcase.tsx` and `components/tumble-deck-showcase-demo.tsx`. The component uses standard `<img>` elements to directly manipulate 3D transform matrices and avoid additional DOM wrappers introduced by Next.js `<Image />`.
- **TypeScript**: None. Types compiled with zero errors under `tsc --noEmit`.



