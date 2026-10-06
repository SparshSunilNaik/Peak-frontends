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

## How to Use It

1. Open the page at <http://localhost:3006>.
2. Scroll down past the intro screen — the section pins immediately.
3. Continue scrolling; the orange track grows, stems draw in, and text reveals slide up.
4. The timeline unpins once all milestones have passed and the footer screen takes over.
