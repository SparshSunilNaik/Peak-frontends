# 07-morph-gallery

## What It Demonstrates

A **photo gallery whose slides dissolve into each other** through a WebGL noise shader instead of cutting or cross-fading. The incoming frame's bright areas burn through first, giving the transition an organic, tearing effect rather than a flat cross-fade.

## Install and Run

```bash
cd 07-morph-gallery
npm install
npm run dev
```

Open **http://localhost:3007** in your browser.

### Why `components/ui`?

We follow the standard shadcn convention. Components placed in `components/ui` fit naturally into projects initialized with `npx shadcn init`, making them easy to drop into existing codebases.

## `MorphGalleryProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `items` | `{ src: string, thumb?: string, alt?: string }[]` | (Required) | The images to display. `src` must have CORS headers to morph. |
| `height` | `string` | `"100svh"` | **Must be a definite length.** The canvas fills this box. |
| `duration` | `number` | `1500` | Milliseconds of dissolve. |
| `noiseScale` | `number` | `3.5` | fbm frequency. Higher tears into finer shreds. |
| `edge` | `number` | `0.15` | Width of the dissolve front, in threshold units. 0 is a hard edge. |
| `drift` | `number` | `0.5` | How far the frames slide against each other while dissolving. |
| `loop` | `boolean` | `true` | Wrap past the ends. |
| `autoplay` | `number` | `0` | Milliseconds between automatic advances. 0 is off. |
| `arrows` | `boolean` | `true` | Show prev/next arrows. |
| `thumbnails` | `boolean` | `true` | Show the thumbnail strip at the bottom. |
| `index` | `number` | `undefined` | Controlled index. Omit for uncontrolled. |
| `defaultIndex` | `number` | `0` | Initial active index. |
| `onIndexChange` | `(index: number) => void` | `undefined` | Callback when the active index changes. |
| `className` | `string` | `""` | Additional CSS classes for the container. |

## How It Works

### Shader Dissolve

The transition is a single full-screen fragment shader pass over two textures. An fbm noise field gives every pixel a threshold, and the progress value sweeps past those thresholds, so the outgoing frame tears away in drifting tatters rather than fading uniformly. The threshold is biased by the luminance of the *incoming* frame, which makes its bright areas burn through first — a detail that stops it from reading as a generic dissolve filter.

It also employs parallax drift: both frames slide by different amounts and in opposite directions, so the tatters have parallax against each other instead of sitting in one plane. A quintic in-out ease ensures the dissolve starts and ends still, hurrying through the middle.

### CORS Requirement & Fallback

Textures require CORS. An image served without the `Access-Control-Allow-Origin` header cannot be uploaded to WebGL at all. If the component detects this, it falls back to a plain DOM cross-fade. The gallery still works completely, but it switches to standard CSS opacity fades. This avoids a black rectangle when shaders are blocked.

## Behaviors

- **Keyboard & Swipe**: You can navigate using the left/right arrow keys or by swiping across the image (pointer drag).
- **Autoplay**: If `autoplay` is greater than 0, the gallery advances automatically. It pauses automatically when hovering over the gallery, when the gallery is focused, or when the browser tab is hidden in the background.
- **Reduced Motion**: If the user has `prefers-reduced-motion: reduce` enabled in their OS or browser, the gallery still functions but drops the animation: the next slide appears instantly.

## Troubleshooting

### The gallery shrinks to 0px width

The gallery `height` must be a definite length. Additionally, because the canvas sizes itself from its own box, the wrapper element must dictate the size. If the gallery is placed inside a flex container that tries to shrink its children, the gallery will collapse to 0 width. Adding `w-full` (or similar definitive widths) to the gallery wrapper is often necessary.

## Deviations from the original spec

1. **Newline Fix**: The pasted source code contained a syntax error due to a literal line break inside a string literal where an escaped newline was intended. I fixed this by replacing `join("` followed by a literal newline with `.join("\n")`.
2. **CORS Images Swap**: The CDN images originally specified in the demo lacked the `Access-Control-Allow-Origin` header, breaking the WebGL shader. I replaced them in the demo component with Unsplash URLs which correctly provide the header.
3. **Linter suppression**: Added a rule in `eslint.config.mjs` to suppress `react-hooks/refs`, `prefer-const` and `@next/next/no-img-element` rules for the vendored `components/ui/**/*.tsx` files.
