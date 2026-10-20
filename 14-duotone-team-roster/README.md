# 14-duotone-team-roster

A fully interactive **"meet the people"** section built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn. Runs on **http://localhost:3014**.

## Overview

The Duotone Team Roster displays a heavy display headline in the bottom-left of a burning colour field. Beside it, the team hangs in tall columns of portraits that drift slowly in opposite directions. Every photo is pushed through a one-pass tritone SVG filter (shadow â†’ midtone â†’ highlight) built from the active palette, so a roster shot on ten different cameras and phones reads as one coherent set.

**The signature interaction:** point at, tab to, or tap a portrait and it lifts out of the wall, colour bleeds back into it, the rest of the wall sinks into the field, and its small craft chip unfolds into a card with the name, role, one line of bio, and a link. The columns hold still while you read.

This demo shows ten people at a fictional post-production studio called **Foxglove Post** in Leeds.

### Key visual features

- **Tritone SVG filter** â€” luminance â†’ S-curve â†’ per-channel tables mapping shadow, midtone, and highlight colours over every portrait.
- **Drifting columns** â€” odd and even columns drift in opposite directions with CSS keyframe animations, staggered phases so they never look synchronised.
- **Unfolding chip card** â€” `clip-path` animation reveals the name / bio / link panel from the chip's corner.
- **Responsive layouts** â€” below 700 px the columns become one horizontal drifting strip above the headline; 700â€“1000 px gives two columns; wider uses the `columns` prop (2â€“4).
- **Accessibility** â€” each portrait is a `<button>` with `aria-label`, `aria-expanded`, and `aria-controls`. Tab â†’ Enter opens a card; a second Enter moves focus to the link; Escape folds it and returns focus. Duplicate loop items are `aria-hidden`.
- **Motion controls** â€” drift pauses on hover, focus, an open card, when scrolled off screen, when the tab is hidden, and from a Pause button. `prefers-reduced-motion` removes all drift and hides the button.
- **Open roles** â€” empty "You?" frames can be seeded among the portraits via `openRoles`, each linking to a job posting.

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
- **Tailwind CSS v4** (utility classes on wrapper elements only â€” the roster component ships its own embedded CSS)
- **shadcn** (provides `components.json`, `lib/utils.ts`, and the `@/components/ui` convention)

## Props

### `DuotoneTeamRosterProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `members` | `TeamMember[]` | `DEFAULT_MEMBERS` | The ten people to display. |
| `openRoles` | `OpenRole[]` | `[]` | Empty frames placed among portraits, each linking to a job. |
| `eyebrow` | `string` | `"Meet"` | Small display word above the headline. |
| `title` | `string` | `"The\ncrew"` | Headline; use `\n` to break lines â€” each line is fitted to the column width. |
| `intro` | `string` | *(studio blurb)* | Paragraph below the headline. |
| `cta` | `RosterLink \| null` | `{ label: "Start a project", href: "#contact" }` | Primary CTA link. |
| `secondaryCta` | `RosterLink \| null` | `null` | Secondary text link in the actions row. |
| `preset` | `"ember" \| "cobalt" \| "moss" \| "mono"` | `"ember"` | Built-in colour preset. |
| `palette` | `RosterPaletteInput` | â€” | Overrides any colour of the preset. |
| `columns` | `number` | `3` | Portrait columns on wide screens (2 to 4). Tablets get 2; phones get a strip. |
| `driftSeconds` | `number` | `9` | Seconds a column takes to drift past one portrait height. Lower = faster. |
| `drift` | `boolean` | `true` | `false` (or `driftSeconds <= 0`) gives a static wall that scrolls with the page. |
| `height` | `string` | `"100svh"` | Section height on tablet and desktop. Must be a definite length, never a percentage. |
| `fontFamily` | `string` | Arial Black / Archivo Black / Helvetica Neue stack | Display face for the headline, eyebrow, and monograms. |
| `stretch` | `number` | `1.16` | Horizontal `scaleX` of the display face (1 = as drawn). |
| `uppercase` | `boolean` | `true` | Transforms the headline to uppercase. |
| `grain` | `boolean` | `true` | Adds a subtle film-grain overlay via SVG noise. |
| `labels` | `RosterLabelsInput` | See below | Overrides built-in strings for translation. |
| `className` | `string` | `""` | Extra class on the root `<section>`. |
| `onMemberSelect` | `(member: TeamMember) => void` | â€” | Called when a portrait is clicked or opened with the keyboard. |
| `clickFollowsLink` | `boolean` | `true` | Whether a mouse click on a portrait follows its `href` (never a `mailto:`, which stays on the "Say hello" link). |

### `TeamMember`

| Field | Type | Notes |
|---|---|---|
| `name` | `string` | Full name, used for the accessible button label and monogram. |
| `role` | `string` | Job title. |
| `craft` | `string?` | Short chip label ("Colour", "Sound"). Defaults to `role`. |
| `bio` | `string?` | One line shown in the unfolded card. |
| `photo` | `string?` | Portrait URL. Falls back to a monogram plate when missing or broken. |
| `focus` | `string?` | CSS `object-position` for the portrait, e.g. `"50% 30%"`. |
| `href` | `string?` | Link in the unfolded card (usually a `mailto:`). |
| `linkLabel` | `string?` | Link text. Defaults to `labels.memberLink` ("Say hello"). |
| `exposure` | `number?` | Brightens (`> 1`) or darkens (`< 1`) the portrait before the tritone filter. |

### `OpenRole`

| Field | Type | Notes |
|---|---|---|
| `title` | `string` | Role title shown in the unfolded card. |
| `href` | `string` | Link to the job posting. |
| `craft` | `string?` | Chip label. Defaults to `labels.hiring` ("Hiring"). |
| `note` | `string?` | One line under the title in the unfolded card. |
| `mark` | `string?` | Large word inside the empty frame. Defaults to `"You?"`. |
| `linkLabel` | `string?` | Link text. Defaults to `labels.roleLink` ("See the role"). |

### `RosterPalette`

| Token | Role |
|---|---|
| `ground` | Darkest colour: field edges and chip backgrounds. |
| `deep` | Field between ground and glow. |
| `hot` | Hot centre of the field and tritone midtone. |
| `glow` | Brightest light in the field. |
| `ink` | Headline, chip text, and CTA fill. |
| `shadow` | Tritone shadow colour applied to every portrait. |
| `highlight` | Tritone highlight colour applied to every portrait. |
| `mid` | Tritone midtone. Defaults to a paler mix of `hot` and `highlight`. |

#### Built-in presets

| Preset | Ground | Hot | Glow | Ink |
|---|---|---|---|---|
| `ember` | `#170403` | `#ee7a1c` | `#ffb54a` | `#fff0c8` |
| `cobalt` | `#03061f` | `#2e57f5` | `#86a6ff` | `#eef1ff` |
| `moss` | `#061008` | `#5d8a35` | `#c3d66e` | `#f3f6dd` |
| `mono` | `#090909` | `#8c8c8c` | `#e0e0e0` | `#fafafa` |

### `RosterLabels` (all built-in strings)

| Key | Default |
|---|---|
| `pause` | `"Pause"` |
| `play` | `"Play"` |
| `team` | `"Team"` (accessible name of the portrait wall) |
| `openRole` | `"Open role"` (prefix read before an open role's title by screen readers) |
| `hiring` | `"Hiring"` (default chip on open-role frames) |
| `roleLink` | `"See the role"` |
| `memberLink` | `"Say hello"` |


## How it works

### Tritone SVG filter

The tritone is an `<feColorMatrix>` that converts the image to luminance, followed by an `<feComponentTransfer>` S-curve for contrast, then a second `<feComponentTransfer>` with per-channel `feFuncR/G/B` tables that map the luminance range to shadow, midtone, and highlight hex colours from the active palette. This filter ID is unique per instance (using `React.useId()`) so multiple rosters can coexist on a page. An unfiltered copy of each portrait fades in when the card is active, giving the "colour bleeds back" effect.

### Drifting columns

Portraits are dealt round-robin into columns (`dealColumns`) and padded with hidden repeats so each column's total height is at least `minPerColumn` cards — enough that a full scroll through the loop never reveals a gap. Odd columns drift upward (`dtr-up` keyframe) and even columns drift downward (`dtr-down` keyframe) at staggered phase offsets (`phases = [0, 0.38, 0.71, 0.18]`), so they never look synchronised.

Drift automatically pauses when:
- the mouse hovers over the wall or a card has keyboard focus (CSS `focus-within`)
- a card is open (`data-active` attribute on the root)
- the section is scrolled out of view (`IntersectionObserver` ? `data-offscreen`)
- the browser tab is hidden (`visibilitychange` ? `data-offscreen`)
- the user clicks the Pause button (`data-paused`)

### Responsive layouts

| Viewport width | Layout |
|---|---|
| < 700 px | Phone strip — one horizontal drifting row above the headline |
| 700–1000 px | Two drifting columns |
| > 1000 px | `columns` prop (2–4) |

`layoutFor()` calculates the layout from the container width via a `ResizeObserver`.

### Unfolding card

Each card's panel starts hidden with `clip-path: inset(top right bottom left round 3px)` where `top` is `calc(100% - 26px)` (the chip height). On open the clip-path animates to `inset(0 0 0 0)`, revealing the full name/role/bio/link panel from the chip's corner.

### Title fitting

`fitTitleSize()` reads the actual rendered width of the widest headline line at the current font size, then calculates the font size that would make it exactly fill the available copy column width (with a 1.18× overhang factor that lets the headline run into the first portrait column, poster-style).

### Static / non-drift mode

With `drift={false}` or `driftSeconds <= 0`, the wall becomes a static grid. The copy column becomes `position: sticky` so the headline stays pinned while the photo wall scrolls beside it.

### Reduced motion

`@media (prefers-reduced-motion: reduce)` removes all `animation` and drops `transition-duration` to 1 ms. Columns are kept staggered and still (using `--dtr-rest` to set a fixed translate), and the Pause button is hidden since there is nothing to pause.

### Browser requirements

The component uses `container-type: inline-size`, `color-mix(in srgb, …)`, `CSS translate`, `100svh`, and the SVG filter stack. It needs a current evergreen browser (Chrome 105+, Firefox 110+, Safari 16+).

## Photos

Default portraits are hotlinked Unsplash images of the form:

```
https://images.unsplash.com/photo-<id>?auto=format&fit=crop&w=720&h=960&q=80
```

They are plain `<img>` tags (no `crossOrigin`), so no CORS check is needed. The ten default IDs are:

| Member | Unsplash photo ID |
|---|---|
| Priya Nair | `1494790108377-be9c29b29330` |
| Daniel Osei | `1507003211169-0a1dd7228f2d` |
| Ellie Marsh | `1438761681033-6461ffad8d80` |
| Marcus Bell | `1500648767791-00dcc994a43e` |
| Hannah Cole | `1544005313-94ddf0286df2` |
| Graham Whitlock | `1472099645785-5658abf4ff4e` |
| Mira Kowalczyk | `1517841905240-472988babdf9` |
| Jules Okafor | `1506794778202-cad84cf45f1d` |
| Sam Lindqvist | `1502823403499-6ccfcf4fb453` |
| Noa Brandt | `1524504388940-b1c1722653e1` |

**Photo verification:** Outbound HTTP requests to Unsplash from this build environment timed out after multiple attempts (both HEAD and GET with a 15-second timeout), so per-URL HTTP 200 confirmation could not be obtained at build time. The IDs are the same well-known Unsplash portrait photos used in similar 21st.dev components. If any portrait fails to load in the browser, the component automatically displays a monogram plate (member initials) — this is the designed fallback behaviour and is fully accessible.

To override a portrait without editing the vendored component, pass custom members via props in `app/page.tsx`:

```tsx
import DuotoneTeamRoster, { DEFAULT_MEMBERS } from "@/components/ui/duotone-team-roster";
const PHOTO_FIXES: Record<string, string> = {
  "Member Name": "https://images.unsplash.com/photo-<verified-id>?auto=format&fit=crop&w=720&h=960&q=80",
};
const members = DEFAULT_MEMBERS.map((m) =>
  PHOTO_FIXES[m.name] ? { ...m, photo: PHOTO_FIXES[m.name] } : m,
);
export default function Home() {
  return <DuotoneTeamRoster members={members} />;
}
```

## Accessibility

- Each portrait is a `<button>` with `aria-label="<Name>, <Role>"`, `aria-expanded`, and `aria-controls` pointing to its panel.
- **Keyboard flow:** Tab to a portrait ? Enter opens the card ? second Enter moves focus to the link inside ? Escape folds the card and returns focus to the button.
- **Touch:** a tap toggles the card open/closed. Tapping outside an open card closes it.
- **Mouse:** hover opens the card; clicking follows the member's `href` (unless it is a `mailto:`, which stays on the "Say hello" link inside the panel).
- The headline `<h2>` is the section's accessible name via `aria-labelledby`.
- Duplicate loop items (padding repeats) are `aria-hidden="true"` and `tabIndex={-1}`.
- The portrait wall has `role="group"` with `aria-label={labels.team}`.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Portraits show monogram initials | Photo URL returned non-200 or failed to load | Pass overridden `members` with verified Unsplash IDs via `app/page.tsx` (see Photos section) |
| Layout looks too short / portrait wall clips | `height` is set to a percentage | Use a definite CSS length (`100svh`, `800px`, etc.) |
| Headline text too wide or too narrow | `stretch` is off for the chosen font | Tune `stretch` prop (default 1.16) |
| Very dark or very bright portrait | Photo exposure is off | Set `exposure` on that `TeamMember` (e.g. `1.3` to brighten) |
| Drift doesn't pause on hover | `pointer: coarse` device (touch screen) | Hover pause is intentionally disabled on touch; use the Pause button |
| Build error: `tw-animate-css` not found | shadcn dependency missing | Run `npm install` |

## Exported helpers

The following are exported from `components/ui/duotone-team-roster.tsx` for external use:

| Export | Type | Purpose |
|---|---|---|
| `PRESETS` | `Record<RosterPreset, RosterPalette>` | All four built-in palettes. |
| `DEFAULT_LABELS` | `RosterLabels` | All built-in strings. |
| `DEFAULT_MEMBERS` | `TeamMember[]` | The ten default studio members. |
| `resolvePalette` | `(preset, overrides) => RosterPalette` | Merges a preset with partial overrides. |
| `hexToUnit` | `(hex) => number[]` | Converts a hex colour to `[r, g, b]` in 0–1 range. |
| `mixHex` | `(a, b, t) => string` | Linearly interpolates between two hex colours. |
| `tritoneTables` | `(shadow, mid, highlight) => string[]` | Generates per-channel SVG filter table values. |
| `initials` | `(name) => string` | Extracts the first and last initials from a full name. |
| `dealColumns` | `(count, roleCount, columns, minPerColumn) => any[][]` | Deals members into columns with padding. |
| `fitTitleSize` | `(available, widestAt100, stretch, min, max) => number` | Calculates the font size to fill a given width. |
| `layoutFor` | `(width, columns) => number` | Returns column count (0 = strip) for a container width. |
| `splitLines` | `(title) => string[]` | Splits a `\n`-separated title into an array of trimmed lines. |

## Assumptions

- The `components/ui/` folder path is required because shadcn resolves `@/components/ui` from `components.json`. The roster component is placed there so that shadcn's convention holds even though no shadcn primitives are used inside the component itself.
- Port 3014 was chosen as the next available port after `13-liquid-sculpture-hero` (3013).
- `drift={true}` and `driftSeconds={9}` (the defaults) are kept for the demo; the design is most legible at this speed.

## Deviations from the original spec

### 1. Two permitted newline-escape fixes (in `splitLines` and `DuotoneTeamRoster` default title)

The pasted source had two literal line breaks inside string literals, which are syntax errors. Both were fixed on a single line each with the `\n` escape sequence:

- **`splitLines`:** `.split("\n")` — was spread across two lines with a raw newline inside the quotes.
- **`DuotoneTeamRoster` default title:** `title = "The\ncrew",` — was spread across two lines.

No other change was made to either vendored file.

### 2. Portrait URL verification was not possible at build time

All HTTP requests to Unsplash (both HEAD and GET) timed out in this build environment after multiple 15-second timeout attempts. The Unsplash photo IDs are identical to those in the original spec. If any portrait fails to load, the component displays a monogram plate (initials), which is the designed fallback.

### 3. ESLint overrides in `eslint.config.mjs`

The vendored file trips the following rules. All are disabled only for the two vendored files (not globally):
- `@typescript-eslint/no-explicit-any` — intentional use for palette/preset tables.
- `react-hooks/exhaustive-deps` — `setState` inside `useLayoutEffect` / `useEffect` is intentional.
- `@next/next/no-img-element` — `<img>` is used directly for the SVG filter; `next/image` is not applicable.
- `@typescript-eslint/no-unused-vars` — vendored file has intermediate destructures.
- `react-hooks/rules-of-hooks` — `setState` inside a `ResizeObserver` callback inside `useLayoutEffect`.
