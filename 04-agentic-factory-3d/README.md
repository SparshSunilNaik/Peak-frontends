# Agentic Factory 3D

A procedural three.js machine with five stations: Cabinet, Engine, Admin, Storefront, Checkout, with no models or images.

## Installation

```bash
npm install
```

## Running the app

```bash
npm run dev
```

Then open [http://localhost:3004](http://localhost:3004) in your browser. Note: WebGL must be enabled in your browser.

## What it demonstrates

This project demonstrates a procedural 3D machine built using three.js and React. It features five distinct stations and is entirely procedural with no external 3D models or images. The `components/ui` structure is used since shadcn's generator and `@/components/ui/...` imports expect this specific folder convention.

### Controls & Features
- **Interactions:** Drag to rotate, scroll or pinch to zoom. Hover or click a station to focus.
- **Modes (4):** Assembled, Cutaway, Stations, One order
- **Cameras (5):** Overview, Side, Top, Station, Flight
- **Playback:** Play/Pause buttons to control the animation.

## API / Props

**AgenticFactory3DProps:**
| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `height` | `number \| string` | `'100vh'` | Height of the scene box |
| `className` | `string` | | Additional CSS classes |
| `embed` | `boolean` | `false` | Clean hero mode: no panels. On frames > 900px, moves the machine to the right 58% |
| `onStation`| `(id: StationId) => void`| | Called when a station is clicked |
| `onReady` | `() => void` | | Called when the first real frame is drawn |

**Window API (`window.__machine`):**
- `setMode(name: string): boolean`
- `setCamera(name: string): boolean`
- `focusStation(id: string): boolean`
- `play(): boolean`
- `pause(): boolean`

## Deviations from the original spec
None
