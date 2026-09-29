# Gateway Flow

A particle flow login gateway frontend.

## Installation

```bash
npm install
```

## Running the app

```bash
npm run dev
```

Then open [http://localhost:3002](http://localhost:3002) in your browser.

## What it demonstrates

This project demonstrates an animated dotted flow line that converges on a centered login card, revealing text, rippling particles on click, and a gradient hover border. The entire UI is sandboxed within an iframe (`srcDoc`) that fetches resources like Tailwind CSS, Iconify, GSAP, and Inter font directly from CDNs.

**Note:** Since it fetches dependencies from CDNs at runtime, the machine running the demo needs internet access. The `components/ui` structure is preserved because shadcn's generator and `@/components/ui/...` imports expect this folder convention.

## Deviations from the original spec
- Replaced the CDN avatars with Unsplash portrait photo URLs.

## Props of GatewayFlow

| Prop | Default | Description |
| :--- | :--- | :--- |
| `mode` | `"dark"` | Theme mode |
| `speed` | `1` | Particle speed |
| `size` | `100` | Size factor |
| `gap` | `20` | Gap between elements |
| `length` | `50` | Length of flow lines |
| `density` | `0.5` | Density of particles |
| `strokeWidth` | `1` | Stroke width of particles |
| `opacity` | `0.5` | Opacity of particles |
| `hue` | `210` | Hue color of particles |
| `saturation`| `100` | Saturation color of particles |
| `brightness`| `50` | Brightness of particles |
