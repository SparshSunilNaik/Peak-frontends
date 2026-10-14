# Prompt — Frontend #11: Draggable Widget Grid

> This file stores the original spec prompt verbatim so the intent is preserved alongside the implementation.

---

## Original Prompt

**FOLDER:** `11-draggable-widget-grid`
**Stack:** Next.js (App Router) · Tailwind CSS v4 · TypeScript · `motion` package (`motion/react`)
**Port:** `3011`

### Component spec — `DraggableWidgetGrid`

Build a `DraggableWidgetGrid` React component (`components/ui/draggable-widget-grid.tsx`) that:

- Accepts a `columns` prop (default `4`) and a list of `WidgetItem` objects, each declaring `colSpan` and `rowSpan`.
- Uses a **greedy packing algorithm with exact backtracking** to lay out widgets in a fixed-column grid.
- Allows **drag-and-drop reordering** of widgets (mouse + touch). On drop, swap the dragged and hovered widgets in logical order and re-pack.
- If re-packing after a swap produces an impossible tiling (fewer placed items), **revert** to the previous order.
- Animates all position transitions with **spring physics** via `motion/react` (`useSpring`, `useTransform`).
- Supports **keyboard reordering** via arrow keys.
- Each widget card renders a **drag handle** in the header and a `@container`-query-responsive content area.

The component and its demo must be committed **verbatim** (tab-indented) and excluded from Prettier formatting.

### Demo spec — `DraggableWidgetGridDemo`

Build `components/draggable-widget-grid-demo.tsx` as an **AI Agent Observability Dashboard** with 8 widgets:

| Widget | `colSpan` | `rowSpan` | Description |
|---|---|---|---|
| Agent Status | 2 | 1 | Health badge + uptime ticker |
| Task Throughput | 1 | 1 | Tasks/min + sparkline |
| Token Usage | 1 | 1 | Token budget gauge |
| Error Rate | 1 | 1 | Error % with severity colour |
| Latency P99 | 1 | 1 | Histogram bars |
| Active Agents | 2 | 1 | Agent list with status dots |
| Memory Usage | 1 | 1 | Heap used / total bar |
| Recent Events | 4 | 1 | Scrolling event log |

All data must be **simulated** with a `setInterval` tick (no backend required).

### Setup requirements

- Scaffold with `create-next-app` (App Router, TypeScript, Tailwind).
- Initialize shadcn for `lib/utils.ts` (`cn`) and CSS theme tokens only.
- Install `motion` (≥14).
- Dev port: `3011` (`"next dev -p 3011"` in `package.json`).
- Add `.editorconfig` (2-space default; tab indent for vendored files).
- Add `.nvmrc` pinned to `lts/iron`.
- Add `.prettierignore` excluding the two vendored files.
- Add `typecheck` script (`tsc --noEmit`).
- Add `engines: { node: ">=20" }` to `package.json`.
- Commit in ≥20 atomic commits following the specified plan.
- Push to `origin main`.
