# 09 — AI Thinking Orb

> A morphing orb UI that signals AI reasoning through motion and shape.

## Demo

```
npm install
npm run dev
# → http://localhost:3009
```

Type a prompt in the input field and press **Enter** or click **Send**.

- The pill collapses to a **pulsing glowing sphere** while the AI thinks.
- When the response is ready it **expands into a card** with a green flash.
- Type `error` to trigger the error state (red shake flash).

## Features

| Feature | Detail |
|---|---|
| Morphing shape | Pill → ball → card via spring-animated CSS custom properties |
| Aurora blobs | Four slow-drifting ellipses with `filter: blur` |
| Conic-gradient ring | Rotates via `@property --angle` + `animation` |
| Thinking dots | Three bouncing dots with staggered `animation-delay` |
| Green success flash | Brief scale + radial-gradient overlay before card expands |
| Shimmer text | `background-clip: text` shimmer on fresh response text |
| Input row | Fades out while orb is thinking / in card state |
| Error state | Red `box-shadow` ring + CSS shake keyframe |

## File Structure

```
09-thinking-orb/
├── app/
│   ├── globals.css          # Tailwind + shadcn tokens + dark base
│   ├── layout.tsx           # Root layout with metadata
│   └── page.tsx             # Entry: renders ThinkingOrbDemo
├── components/
│   ├── ai-thinking-orb-and-input.tsx  # Core orb + input component (verbatim)
│   ├── thinking-orb-demo.tsx          # Demo wrapper with fake backend (verbatim)
│   └── ui/
│       └── button.tsx       # shadcn Button primitive
├── lib/
│   └── utils.ts             # shadcn cn() utility
├── index.css                # All orb-specific keyframes and class styles
├── public/
│   └── favicon.svg          # Orb-shaped SVG icon
├── .editorconfig
├── .nvmrc                   # Node 20
├── components.json          # shadcn config
├── eslint.config.mjs        # ESLint — vendored files suppressed
├── next.config.ts
├── package.json             # dev port 3009, typecheck script, engines >=20
├── tsconfig.json
├── PROMPT.md
└── README.md
```

## Component API — `AIThinkingOrb`

```tsx
import AIThinkingOrb, { OrbState } from "@/components/ai-thinking-orb-and-input";

<AIThinkingOrb
  state="idle"           // OrbState: "idle" | "listening" | "thinking" | "done" | "error"
  responseText=""        // string shown in the card when state === "done"
  onPromptSubmit={fn}    // (text: string) => void — called when user submits
  className=""           // extra class on the root fixed div
/>
```

### OrbState transitions

```
idle → listening (user types)
     → thinking  (request sent)
     → done      (response ready)  ← expands to card
     → error     (request failed)  ← red flash, auto-resets
```

## Design Notes & Defaults

- **Port**: 3009 (set in `package.json` dev script).
- **CSS approach**: All orb-specific styles live in `index.css` at the project root (not inside `app/globals.css`) to keep the shadcn theme tokens clean. The component imports it directly with `import "../index.css"`.
- **Spring physics**: ~20 CSS custom properties are updated each `requestAnimationFrame` tick using a simple spring integrator (stiffness 200, damping 28). This gives the morphing a natural, elastic feel without a heavy animation library.
- **Verbatim components**: `ai-thinking-orb-and-input.tsx` and `thinking-orb-demo.tsx` are kept exactly as provided. ESLint rules that would flag them are suppressed in `eslint.config.mjs` rather than editing the files.
- **`"use client"`**: Both component files declare `"use client"` because they use React hooks and browser APIs (`requestAnimationFrame`, `addEventListener`). Metadata lives in `app/layout.tsx` (a Server Component) to avoid the Next.js warning.
- **Fake backend**: `ThinkingOrbDemo` ships with `fakeBackend()` (a 2-3 s `setTimeout`). Swap it for a real `fetch()` to connect a live LLM.

## Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4 + custom `index.css` |
| UI primitives | shadcn/ui |
| Animations | CSS custom properties + `requestAnimationFrame` spring |
| Font | Geist Sans / Geist Mono (via `next/font`) |
| Node | >=20 (`.nvmrc` pins 20) |
