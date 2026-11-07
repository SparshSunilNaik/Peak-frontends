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

