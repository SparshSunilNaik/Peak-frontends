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

## Props

### `DuotoneTeamRosterProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `members` | `TeamMember[]` | `DEFAULT_MEMBERS` | The ten people to display. |
| `openRoles` | `OpenRole[]` | `[]` | Empty frames placed among portraits, each linking to a job. |
| `eyebrow` | `string` | `"Meet"` | Small display word above the headline. |
| `title` | `string` | `"The\ncrew"` | Headline; use `\n` to break lines — each line is fitted to the column width. |
| `intro` | `string` | *(studio blurb)* | Paragraph below the headline. |
| `cta` | `RosterLink \| null` | `{ label: "Start a project", href: "#contact" }` | Primary CTA link. |
| `secondaryCta` | `RosterLink \| null` | `null` | Secondary text link in the actions row. |
| `preset` | `"ember" \| "cobalt" \| "moss" \| "mono"` | `"ember"` | Built-in colour preset. |
| `palette` | `RosterPaletteInput` | — | Overrides any colour of the preset. |
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
| `onMemberSelect` | `(member: TeamMember) => void` | — | Called when a portrait is clicked or opened with the keyboard. |
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

