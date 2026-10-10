# Prompt

> The original prompt that generated this frontend.

---

Build a full-screen Next.js (App Router, TypeScript, Tailwind CSS v4, shadcn) page that
showcases an **AI Thinking Orb** — a morphing UI component that signals AI reasoning
through motion and shape.

## Core behaviour

The orb lives in **five states**:

| State | Visual |
|---|---|
| `idle` | Glassmorphism pill, aurora blobs, rotating conic-gradient ring |
| `listening` | Pill lights up, ring speeds up |
| `thinking` | Morphs to a pulsing glowing sphere, three bouncing dots |
| `done` | Green flash → expands to a card with shimmer response text |
| `error` | Red ring flash + shake animation → auto-resets |

## Technical requirements

- All shape/opacity transitions use **spring-animated CSS custom properties** updated on every `requestAnimationFrame` tick. No GSAP, no Framer Motion.
- The rotating border ring uses `@property --angle` + a `conic-gradient`.
- CSS-only aurora: four `<i>` blobs with `filter: blur` and `animation: mo-drift`.
- Place all orb-specific CSS in `index.css` (project root); the component imports it directly.
- Mark the page as `"use client"`. Keep metadata in `app/layout.tsx`.
- Suppress any ESLint errors in vendored component files via `eslint.config.mjs` — do **not** edit the verbatim files.

## Input UX

- A pill-shaped text input + Send button, centred at 10% from the bottom.
- Pressing Enter or clicking Send triggers the state machine.
- Typing `error` simulates a failure; any other text triggers a fake 2-3 s backend.

## Ports & scripts

- Dev server on port **3009**.
- `typecheck` script: `tsc --noEmit`.
- `.nvmrc` pinned to Node 20.
