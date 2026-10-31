# 16 · Picture Rail Gallery

An interactive, physics-driven picture rail gallery wall component built with Next.js 16, React 19, Tailwind CSS v4, and shadcn conventions.

## Overview

This project showcases a gallery wall in the picture-rail style, where framed art prints hang from brass hooks and braided wires attached to an architectural picture rail:
- **Physical Hanging Frames**: Framed prints behave as simulated pendulums that swing on wires, respond to pointer inertia, collide realistically without overlapping, and push neighbouring frames along the rail.
- **Lighting & Focus**: Hovering or focusing a print activates a warm brass picture fixture, raises the frame off the wall with realistic drop shadows, shifts glass glares based on tilt angle, and subtly dims neighbouring works.
- **Lift-and-Flip Detail View**: Clicking a lit print lifts it seamlessly off the wall into a full-screen 3D dialog. Visitors can spin the frame 360° by dragging or using front/back controls to inspect the back of the piece, complete with hanging rings, braided wire, kraft paper backing tape, and an authentic gallery edition label.
- **Responsive Layout**: On wider viewports, unit dimensions dynamically scale to fit all frames comfortably along a single continuous picture rail. On mobile and narrow viewports, the rail automatically shifts into a touch-swipeable carousel with pagination indicators.
- **Fictional Print Shop Demo**: The included demo features eight editions: *Ochre Curve* (Ines Varga), *Spiral Study* (Tomas Reyhill), *Dune Field* (Ada Lindqvist), *Rain Study No. 4* (Elio Brandt), *Still Lake* (Saga Morel), *Concrete Choir* (Pavel Oduya), *North Light* (Ada Lindqvist), and *Tide Line* (Noor Halvorsen).

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org) with React 19
- **Physics & Animation**: Custom requestAnimationFrame physics engine (damped harmonic springs, sub-stepping, momentum transfer, and Web Animations API)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com) (`tailwindcss@4.3.3`)
- **Design System / Primitives**: [shadcn](https://ui.shadcn.com) (`components.json`, CSS variables, `lib/utils.ts`)
- **Language**: TypeScript 5

### Why `components/ui` Matters

The `components/ui` directory is the canonical convention defined by shadcn and configured in `components.json` via the alias `@/components/ui`. Adhering to this structure:
1. **Ensures Standard Import Resolution**: Reusable primitives, composite widgets, and registry blocks resolve predictably across the codebase.
2. **Maintains Tooling Interoperability**: The shadcn CLI depends on this exact path when scaffolding, verifying, or synchronizing UI components.
3. **Preserves Clear Separation of Concerns**: Separates vendored, standalone UI building blocks from page routes and top-level demo views.

## Installation & Running

### Prerequisites

- Node.js `>= 20.0.0` (declared in `package.json` engines and `.nvmrc`)
- npm 10+

### Quick Start

```bash
# Navigate to the frontend directory
cd 16-picture-rail-gallery

# Install dependencies
npm install

# Start development server on port 3016
npm run dev
```

Open [http://localhost:3016](http://localhost:3016) in your browser.

### Scripts

- `npm run dev`: Runs Next.js development server on port 3016 (`next dev -p 3016`).
- `npm run build`: Compiles production Turbopack build with static optimization.
- `npm run start`: Starts production server.
- `npm run lint`: Checks codebase with ESLint.
- `npm run typecheck`: Runs TypeScript verification (`tsc --noEmit`).

## API Reference

### `PictureRailGalleryProps`

`PictureRailGallery` accepts standard HTML `<section>` attributes in addition to the following props:

| Prop | Type | Default | Description |
|:-----|:-----|:--------|:------------|
| `items` | `PictureRailItem[]` | *(required)* | Array of framed artworks hanging on the rail. |
| `eyebrow` | `string` | `undefined` | Small uppercase text above the main heading. |
| `heading` | `string` | `undefined` | Primary section heading. |
| `caption` | `string` | `undefined` | Contextual text shown beneath the wall when no print is currently lit. |
| `action` | `React.ReactNode` | `undefined` | Call-to-action button or link displayed beneath the caption. |
| `autoplay` | `boolean` | `false` | Automatically cycles focus through prints on a beat until user interacts. (Note: the demo component defaults `autoplay` to `true`). |
| `interval` | `number` | `2600` | Duration (ms) each artwork stays illuminated during autoplay cycle. |
| `active` | `number \| null` | `undefined` | Controlled index of the currently lit artwork. Pass `undefined` for uncontrolled mode. |
| `onActiveChange` | `(index: number \| null) => void` | `undefined` | Callback invoked when the lit print changes via hover, keyboard, or autoplay. |
| `onOpenChange` | `(index: number \| null) => void` | `undefined` | Callback invoked when the lift-and-flip 3D detail modal opens or closes. |
| `labels` | `PictureRailGalleryLabels` | `DEFAULT_LABELS` | Localized string dictionary for UI controls. |

### `PictureRailItem`

Describes each piece of art hanging on the picture rail:

```typescript
export interface PictureRailItem {
  id: string;                     // Unique identifier
  title: string;                  // Accessible name, live caption title, and detail heading
  artist?: string;                // Artist credit line
  year?: string;                  // Year of creation/printing
  image: string;                  // Artwork image URL displayed behind glass
  aspect?: number;                // Width ÷ height ratio (defaults to 0.8: a 4:5 portrait)
  frame?: "black" | "oak" | "white"; // Frame moulding profile (defaults to "black")
  mat?: boolean;                  // Adds a bevel-cut archival mat board around the image
  drop?: number;                  // Wire length adjustment in frame units (-0.1 to 0.3; 0 aligns centers)
  tag?: string;                   // Floating wall label tag (e.g. price "$280")
  details?: string[];             // Back edition lines (e.g. edition size, dimensions, paper type)
}
```

### `PictureRailGalleryLabels`

Labels for accessibility and interactive controls:

```typescript
export interface PictureRailGalleryLabels {
  front: string; // Default: "Front"
  back: string;  // Default: "Back"
  close: string; // Default: "Close"
  open: string;  // Default: "Lift to view" (shown in the active wall caption)
}
```

## How It Works

### 1. Dynamic Layout & Responsive Modes

The wall calculates frame geometry from each item's aspect ratio, moulding profile (`black`, `oak`, or `white`), and optional bevelled mat border:
- **Unit Scaling**: A unit size ($U$) is calculated based on container width ($W$) to fit all artworks along a single horizontal rail ($90\text{px} \le U \le 150\text{px}$).
- **Automatic Carousel Fallback**: When container width cannot fit the items above the minimum unit ($U < 90\text{px}$), the component automatically transitions to `carousel` mode ($U \le 128\text{px}$). A swipe gesture allows browsing through individual frames, accompanied by a row of navigation indicator dots.

### 2. Physical Pendulum Simulation & Collision Dynamics

Each frame hangs from a brass picture-rail hook by two angled wires, forming a physical compound pendulum:
- **Spring-Damper Loop**: Driven by a `requestAnimationFrame` loop that sub-steps physics (at intervals $\le 11.5\text{ms}$) up to $100\text{ms}$ per frame. Wire length directly governs swing frequency (longer wires oscillate with a lower period).
- **Hook Acceleration & Wire Coupling**: Accelerating a frame's hook along the rail induces proportional angular wire torque (`DRAG_COUPLING = 0.16` for active drag, `0.08` for passive momentum).
- **Momentum Transfer & Contact Resolution**: Frames cannot pass through each other. When frames collide, an iterative 3-pass impulse resolution algorithm pushes them apart and averages horizontal velocity, preventing overlaps and producing secondary chain reactions among adjacent frames.
- **Natural Wall Imperfection**: Artworks do not hang unnaturally straight: each frame rests with a subtle static tilt between $-1.5^\circ$ and $+1.5^\circ$ (`restTilt`), straightening smoothly as it lifts towards the viewer.
- **Inertial Sliding & Sleep**: Releasing a dragged frame mid-stroke lets it slide along the rail until friction arrests it. When velocity and displacement drop below threshold tolerances, the simulation shuts off its RAF loop until the next impulse.

### 3. Lighting, Glare & 2x Supersampling

- **Illumination**: When a print becomes active, an integrated brass picture light fixture fades in (`opacity: lit`), casting an atmospheric warm radial wash onto the artwork and the wall behind it.
- **Dynamic Glare & Shadow**: A directional glass reflection layer shifts horizontally across the picture plane as the frame swings or turns toward the mouse pointer. Ambient drop shadows soften and extend away from the wall.
- **Retina Crispness (2x Supersampling)**: Rotated 3D CSS transforms can cause Chromium browsers to rasterize layers at low resolutions. To maintain tack-sharp photo quality, frames are laid out at $2\times$ zoom (`SUPERSAMPLE = 2`) and scaled down ($0.5\times$) directly inside the 3D perspective matrix (`transform: perspective(...) scale(...)`).

### 4. Lift-and-Flip 3D Detail View

Clicking a frame activates a full-screen interactive modal rendered into `document.body` via `createPortal`:
- **FLIP-Style Lift Animation**: Using the Web Animations API, the frame smoothly lifts from its exact screen position on the rail to the center of the viewport with an arched trajectory.
- **Interactive 3D Rotation**: The frame can be freely spun around its Y-axis by dragging on the 3D stage or toggling the `Front` and `Back` controls.
- **Authentic Verso Backing**: Rotating to the reverse side reveals a realistic wooden frame back, recessed tension wire, screw eyes, corner reinforcement pads, paper framing tape, and a gallery edition label with edition number, medium, and artist signature.
- **Scroll Lock**: The document body overflow is locked to `hidden` while the detail view is open and restored upon dismissal.


