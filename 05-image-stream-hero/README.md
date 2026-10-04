# Image Stream Hero

A pure CSS 3D "corridor" hero where two rails of image cards rush toward the viewer, driven by generated CSS keyframes and container query units.

## Installation

```bash
npm install
```

## Running the app

```bash
npm run dev
```

Then open [http://localhost:3005](http://localhost:3005) in your browser. Note: An internet connection is required as demo images load from a CDN.

## What it demonstrates

This project demonstrates an image stream hero component. It features a CSS-only 3D corridor where two rails of images advance toward the screen, creating a dynamic sense of depth using CSS keyframes and container queries. The `components/ui` folder convention is retained to follow shadcn CLI practices.

### Features
- **Props (`ImageStreamHeroProps`):**
  - `images`: Images cycled onto the rails.
  - `cards`: Cards on each rail at once. Default `9`.
  - `speed`: Seconds for one card to travel the whole corridor. Default `18`.
  - `axis`: Vertical placement of the corridor's axis, as a percentage of height. Default `55`.
  - `path`: Override any part of the corridor geometry (CorridorPath).
  - `children`: Content rendered above the corridor.
  - `className`: Additional CSS classes.
- **Corridor Geometry (`CorridorPath`):**
  - `perspective`: Default `30`.
  - `cardWidth`: Default `18`.
  - `cardHeight`: Default `25`.
  - `cardRadius`: Default `0.4`.
  - `birthHeight`: Default `2.6`.
  - `exitHeight`: Default `46`.
  - `railBirth`: Default `-11`.
  - `railExit`: Default `44`.
  - `fan`: Default `3.3`.
  - `turnBirth`: Default `6`.
  - `turnExit`: Default `28`.
  - `stops`: Default `24`.
- **Accessibility:** Respects `prefers-reduced-motion` by pausing the animation as a still frame instead of collapsing it.

## Deviations from the original spec
None
