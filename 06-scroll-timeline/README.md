# 06-scroll-timeline

## What It Demonstrates

A **scroll-pinned horizontal timeline** built with GSAP ScrollTrigger and SplitText.

- **Sticky pinning** – the `<section>` is `h-[200vw]` tall; the inner viewport-sized stage becomes `position: sticky` so it stays fixed while the document scrolls past it.
- **Horizontal slide** – as the user scrolls, GSAP scrubs the whole track sideways with `xPercent`, revealing milestones one by one.
- **Stem + dot draw-in** – each vertical stem (`scaleY` from 0 → 1) and endpoint dot (`scale` from 0 → 1) animate in as their milestone enters the viewport.
- **SplitText line-mask reveals** – year/month headings and body copy are split into lines; each line slides up from behind a clip mask (`mask: "lines"` option, available in GSAP ≥ 3.13).

The demo ships two screens:

1. **Lead-in screen** – full-viewport intro with a bouncing arrow telling the user to scroll.
2. **Timeline section** – the pinned horizontal track with 7 milestones (4 above the centre line, 3 below) spanning 2020–2026.
3. **Footer screen** – a single closing line after the timeline unpins.

## Install and Run

```bash
# From the repo root:
cd 06-scroll-timeline
npm install
npm run dev
```

Then open **<http://localhost:3006>** in your browser.

> **Port**: always 3006 (`"dev": "next dev -p 3006"` in `package.json`).

### Why `components/ui`?

`shadcn` scaffolds all primitive components into `components/ui/`. The project
follows this convention so that the timeline component can be dropped in as a
vendored file without any path changes – and so that future shadcn component
installs (`npx shadcn add <name>`) land in the right place automatically.

## How to Use It

1. Open the page at <http://localhost:3006>.
2. Scroll down past the intro screen — the section pins immediately.
3. Continue scrolling; the orange track grows, stems draw in, and text reveals slide up.
4. The timeline unpins once all milestones have passed and the footer screen takes over.

## `TimelineProps`

All props are optional. Pass them to `<Timeline />` to customise the component.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `"Product Storyline"` | Heading displayed in the top-left of the timeline |
| `periodLabel` | `string` | `"2020-2026"` | Period label shown in the bottom-left |
| `textColor` | `string` | `var(--color-foreground, #000000)` | CSS colour for headings and milestone labels |
| `mutedTextColor` | `string` | `var(--color-muted-foreground, #3f3f46)` | CSS colour for body copy and period label |
| `activeColor` | `string` | `"#ff5f00"` | Colour of the centre line, stems, and dots |
| `backgroundColor` | `string` | `var(--color-background, #ffffff)` | Background of the sticky stage |
| `imageUrl` | `string` | CDN url | URL of the header image (left column) |
| `imageAlt` | `string` | `"Modern office workspace"` | Alt text for the header image |
| `duration` | `number` | `undefined` | Overrides `scrollDuration`; controls reveal animation length in seconds |
| `scrollDuration` | `number` | `1.2` | Fallback reveal duration (seconds) used when `duration` is omitted |

## Reduced-Motion Behaviour

When the user has `prefers-reduced-motion: reduce` set in their OS/browser:

- All stems and dots are set to their final state **immediately** with `gsap.set` (no tween).
- The centre line is shown at full width instantly.
- Text is shown at full opacity without the line-mask slide-up animation.
- The horizontal slide still plays (it is driven by scroll position, not time), but no
  time-based easing is applied.

The preference is read at runtime via `useSyncExternalStore` so it reacts live if the
user changes their OS setting while the page is open.

## GSAP ≥ 3.13 Requirement

The component imports `SplitText` from `gsap/SplitText` and uses its `mask: "lines"`
option. **Both SplitText and the `mask` option became freely available in gsap 3.13.0**
(released 2024). Older versions shipped SplitText only in the paid "Shockingly Green"
membership package.

This project installs `gsap@latest` (currently 3.15.x). Do **not** downgrade. Do
**not** install the separate `@gsap/shockingly` package.

Verify after `npm install`:

```bash
npm ls gsap          # must show 3.13.0 or higher
ls node_modules/gsap/SplitText.js   # must exist
```

