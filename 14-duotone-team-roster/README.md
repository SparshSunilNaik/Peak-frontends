# 14-duotone-team-roster

A fully interactive **"meet the people"** section built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn. Runs on **http://localhost:3014**.

## Overview

The Duotone Team Roster displays a heavy display headline in the bottom-left of a burning colour field. Beside it, the team hangs in tall columns of portraits that drift slowly in opposite directions. Every photo is pushed through a one-pass tritone SVG filter (shadow → midtone → highlight) built from the active palette, so a roster shot on ten different cameras and phones reads as one coherent set.

**The signature interaction:** point at, tab to, or tap a portrait and it lifts out of the wall, colour bleeds back into it, the rest of the wall sinks into the field, and its small craft chip unfolds into a card with the name, role, one line of bio, and a link. The columns hold still while you read.

This demo shows ten people at a fictional post-production studio called **Foxglove Post** in Leeds.

### Key visual features

- **Tritone SVG filter** — luminance → S-curve → per-channel tables mapping shadow, midtone, and highlight colours over every portrait.
- **Drifting columns** — odd and even columns drift in opposite directions with CSS keyframe animations, staggered phases so they never look synchronised.
- **Unfolding chip card** — `clip-path` animation reveals the name / bio / link panel from the chip's corner.
- **Responsive layouts** — below 700 px the columns become one horizontal drifting strip above the headline; 700–1000 px gives two columns; wider uses the `columns` prop (2–4).
- **Accessibility** — each portrait is a `<button>` with `aria-label`, `aria-expanded`, and `aria-controls`. Tab → Enter opens a card; a second Enter moves focus to the link; Escape folds it and returns focus. Duplicate loop items are `aria-hidden`.
- **Motion controls** — drift pauses on hover, focus, an open card, when scrolled off screen, when the tab is hidden, and from a Pause button. `prefers-reduced-motion` removes all drift and hides the button.
- **Open roles** — empty "You?" frames can be seeded among the portraits via `openRoles`, each linking to a job posting.

## Install and run

```bash
cd 14-duotone-team-roster
npm install
npm run dev          # http://localhost:3014
```

### Other scripts

| Script | Command | Purpose |
|---|---|---|
| Build | `npm run build` | Production bundle |
| Lint | `npm run lint` | ESLint |
| Typecheck | `npm run typecheck` | `tsc --noEmit` |

## Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4** (utility classes on wrapper elements only — the roster component ships its own embedded CSS)
- **shadcn** (provides `components.json`, `lib/utils.ts`, and the `@/components/ui` convention)
