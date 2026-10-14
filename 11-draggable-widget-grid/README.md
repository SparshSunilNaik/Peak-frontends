# 11 — Draggable Widget Grid

> **Peak Frontends #11** — An interactive, keyboard-accessible dashboard grid built with Next.js (App Router), Tailwind CSS v4, TypeScript, and the `motion` animation library.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Getting Started](#getting-started)
4. [Project Structure](#project-structure)
5. [Component Architecture](#component-architecture)
6. [Demo — AI Agent Observability Dashboard](#demo--ai-agent-observability-dashboard)
7. [Accessibility & Keyboard Controls](#accessibility--keyboard-controls)
8. [Deviations & Ambiguity Notes](#deviations--ambiguity-notes)
9. [Troubleshooting](#troubleshooting)

---

## Overview

`DraggableWidgetGrid` is a **constraint-aware, drag-and-drop grid layout** engine. Each widget declares its preferred column and row span; the engine packs them into a fixed-column canvas, resolves collisions via exact backtracking, and animates every position change with spring physics.

Key capabilities:

- **Smart packing** — widgets are placed greedily left-to-right, top-to-bottom; if a wide widget doesn't fit on the current row it is moved to the next.
- **Exact backtracking tiling** — when a drag-drop reorder would create an impossible layout the engine backtracks to the last valid arrangement.
- **Drag reordering** — grab any widget header and drop it onto another to swap positions; works on touch and mouse.
- **Keyboard reordering** — focus a widget and use Arrow keys to move it through the logical order.
- **Spring animations** — every position transition is driven by a `motion` spring so the grid feels physical and alive.
- **Container-query responsive** — each widget body switches layouts at `@[240px]` and `@[480px]` breakpoints using native Tailwind v4 container queries.

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | Next.js 15 (App Router) | `app/` directory, RSC-compatible shell |
| Language | TypeScript 5 | Strict mode |
| Styling | Tailwind CSS v4 (4.3.3) | Container queries via `@container` / `@[...]` |
| Animation | `motion` 14 (`motion/react`) | Spring physics for drag & layout transitions |
| UI helpers | shadcn/ui bootstrap | `lib/utils.ts` (`cn`), CSS theme tokens only |
| Linting | ESLint (Next.js preset) | Vendored files have relaxed rules |
| Formatting | Prettier (project default) | Vendored files excluded via `.prettierignore` |
| Runtime | Node ≥ 20 | `.nvmrc` pins `lts/iron` (Node 20) |
| Dev port | **3011** | Set in `package.json` → `"next dev -p 3011"` |

---

## Getting Started

```bash
# from the repo root
cd 11-draggable-widget-grid
npm install
npm run dev
```

Open [http://localhost:3011](http://localhost:3011) in your browser. The AI Agent Observability Dashboard demo should appear immediately with live-ticking simulated data.

### Other scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `next dev -p 3011` | Start development server |
| `build` | `next build` | Production build |
| `start` | `next start` | Serve production build |
| `lint` | `next lint` | Run ESLint |
| `typecheck` | `tsc --noEmit` | TypeScript check without emit |

---

## Project Structure

```
11-draggable-widget-grid/
├── app/
│   ├── globals.css          # Tailwind v4 + shadcn theme tokens + body reset
│   ├── icon.svg             # Custom SVG favicon (grid icon)
│   ├── layout.tsx           # Root layout with page title & description metadata
│   └── page.tsx             # Home page — renders <DraggableWidgetGridDemo /> directly
├── components/
│   ├── ui/
│   │   └── draggable-widget-grid.tsx   # Core grid engine (VERBATIM, tab-indented)
│   └── draggable-widget-grid-demo.tsx  # Dashboard demo (VERBATIM, tab-indented)
├── lib/
│   └── utils.ts             # `cn` helper (clsx + tailwind-merge)
├── .editorconfig            # 2-space default; tab indent for the two vendored files
├── .nvmrc                   # lts/iron (Node 20)
├── .prettierignore          # Excludes vendored files from Prettier formatting
├── components.json          # shadcn/ui config
├── eslint.config.mjs        # ESLint — relaxed rules for vendored files
├── next.config.ts           # Next.js config (default)
├── package.json             # Dependencies + scripts
├── PROMPT.md                # Original spec prompt stored verbatim
├── README.md                # This file
└── tsconfig.json            # TypeScript config
```

> **Config files explained**
>
> - **`.editorconfig`** — tells editors to use 2-space indentation everywhere *except* the two vendored component files, which retain their original tab indentation so diffs against the upstream spec stay clean.
> - **`.nvmrc`** — pins `lts/iron` (Node 20). Run `nvm use` in this directory to automatically switch.
> - **`.prettierignore`** — prevents Prettier from reformatting the tab-indented vendored files on `format` runs or pre-commit hooks.
> - **`components.json`** — minimal shadcn config used only to generate `lib/utils.ts` and inject CSS theme tokens; no additional shadcn components were installed.


---

## Component Architecture

### `DraggableWidgetGrid` (`components/ui/draggable-widget-grid.tsx`)

The core layout engine. It accepts a list of `WidgetItem` objects and renders them into a fixed-column grid with drag and keyboard reordering.

#### `WidgetItem` interface

```ts
interface WidgetItem {
  id: string;
  title: string;
  colSpan?: number;   // default 1 (1–4 supported)
  rowSpan?: number;   // default 1
  content: React.ReactNode;
  className?: string;
}
```

#### `DraggableWidgetGrid` props

```ts
interface DraggableWidgetGridProps {
  items: WidgetItem[];
  columns?: number;   // default 4
  gap?: number;       // gap in pixels, default 16
  className?: string;
}
```

#### Internal layout algorithm

1. **Greedy pack** — iterate items in logical order, assign each to the first available cell that fits its `colSpan × rowSpan`, wrapping to the next row when necessary.
2. **Collision detection** — maintain a 2D occupancy bitmap; reject placements that overlap already-occupied cells.
3. **Drag swap** — on `dragEnd`, swap the dragged item with the hovered item in the logical order array, then re-pack from scratch.
4. **Backtrack** — if the re-packed layout has fewer placed items than before (impossible tiling), revert to the previous order.
5. **Spring animate** — each widget's `(x, y)` position is driven by `motion`'s `useSpring` for smooth transitions.

---

## Demo — AI Agent Observability Dashboard

`components/draggable-widget-grid-demo.tsx` renders a realistic **AI agent monitoring dashboard** with 8 widgets:

| Widget | Span | Description |
|---|---|---|
| **Agent Status** | 2 × 1 | Live health badge with uptime ticker |
| **Task Throughput** | 1 × 1 | Tasks/min counter with sparkline bar |
| **Token Usage** | 1 × 1 | Input/output token budget gauge |
| **Error Rate** | 1 × 1 | Error % with colour-coded severity |
| **Latency P99** | 1 × 1 | p99 response-time histogram bars |
| **Active Agents** | 2 × 1 | Running agent list with status dots |
| **Memory Usage** | 1 × 1 | Heap used / total animated bar |
| **Recent Events** | 4 × 1 | Scrolling event log with timestamps |

All widget data is **simulated** — a `setInterval` tick updates values every 2 s to mimic a real-time feed without requiring a backend.

---

## Accessibility & Keyboard Controls

The grid is fully keyboard-operable. Focus any widget card with <kbd>Tab</kbd>, then:

| Key | Action |
|---|---|
| <kbd>←</kbd> | Move widget one position left in logical order |
| <kbd>→</kbd> | Move widget one position right in logical order |
| <kbd>↑</kbd> | Move widget one row up (jumps by `columns` positions) |
| <kbd>↓</kbd> | Move widget one row down (jumps by `columns` positions) |
| <kbd>Space</kbd> / <kbd>Enter</kbd> | (no-op — reserved for future in-widget actions) |

Each widget card receives `role="article"` and an `aria-label` derived from its `title` prop. The drag handle element has `aria-hidden="true"` so screen readers skip it.

---

## Deviations & Ambiguity Notes

| # | Ambiguity | Decision taken |
|---|---|---|
| 1 | The spec listed the component and demo as verbatim files using tab indentation | Committed whole in single commits; `.editorconfig` marks them as `indent_style = tab`; `.prettierignore` excludes them |
| 2 | shadcn bootstrapping adds `@import "tailwindcss"` already — body reset was needed separately | Appended a brief `body { margin: 0 }` rule at the bottom of `globals.css` rather than modifying the import block |
| 3 | `motion` peer-dependency warning about React 19 | Ignored at install time — `motion` 14 is fully compatible with Next.js 15 + React 19 at runtime |
| 4 | No explicit favicon spec provided | Added a simple SVG grid icon (`app/icon.svg`) consistent with the widget-grid theme |

---

## Troubleshooting

**Port already in use**

```bash
# Find the process holding port 3011
npx kill-port 3011
npm run dev
```

**`motion` import errors**

Ensure you import from `"motion/react"` (not `"framer-motion"` or `"motion"`):

```ts
import { motion, useSpring } from "motion/react";
```

**Tailwind container queries not working**

This project requires Tailwind CSS v4. If you accidentally downgraded, reinstall:

```bash
npm install tailwindcss@latest @tailwindcss/postcss@latest
```

Container query variants (`@[240px]:`, `@[480px]:`) are built into Tailwind v4 — no plugin is needed.

**TypeScript errors after editing vendored files**

Run `npm run typecheck` to see a clean type report. The vendored files are intentionally verbose to mirror the original spec; do not add `any` suppressions unless the eslint override already covers them.
