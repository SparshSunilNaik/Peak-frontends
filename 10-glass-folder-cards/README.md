# 10 â€” Glass Folder Cards

An interactive, physics-driven folder interface drawn as a multi-layered 3D object rather than a flat picture.

## Overview

Glass Folder Cards demonstrates an interactive folder crafted with three distinct physical layers:
1. **Back Panel**: Holds unique generative artwork rendered via procedural canvas shaders.
2. **Files Layer**: The documents and sheets contained between panels; documents lift and fan out on interaction.
3. **Frosted-Glass Front Panel**: A translucent backdrop-filtered plate that physically blurs the files and artwork resting behind it.

### Interactions Overview
- **Rest State**: Flat and closed; document tops peek slightly above the front rim.
- **Hover / Focus**: The front frosted panel leans forward on its bottom hinge toward the user, and the files lift slightly out of the pocket.
- **Open (Click, Enter, Space)**: The front panel tilts further forward, and the files rise up and fan dynamically across the arc, each acting as an interactive card.
- **Add Action (`+`)**: Drops a newly created document card into the folder, causing the pocket to bounce under momentum and the counter to update with roll animation.
- **More Action (`Â·Â·Â·`)**: Displays a frosted modal dropdown menu navigable with full keyboard accessibility.

### The Three Demo Folders
The included demo presents three distinct folder designs displayed on a dotted-grid workspace desk:
1. **My Files (Milk Glass)**: Light tone with `aurora` generative streak art and an interactive `+` key for adding cards.
2. **Archives (Frosted Minimal)**: Plain frosted back (`art="none"`) with top-left label placement and an interactive `Â·Â·Â·` action menu for actions like Rename, Share, and Move to Trash.
3. **Smoked Glass Archive**: Dark tone (`tone="dark"`) with `ember` generative marble art, top-right label placement, and key hidden (`action="none"`).

### Why the `@/components/ui` Folder Matters
In modern React and shadcn/ui architectures, `@/components/ui` represents the vendored design system primitive foundation. It isolates foundational, self-contained UI components (such as buttons, dialogs, and reusable interactive primitives) from high-level composite application containers. Keeping glass folder cards under `@/components/ui/glass-folder-cards.tsx` adheres to established module resolution standards across frontend ecosystems.

---

## Installation & Running

Navigate to the project directory and install dependencies:

```bash
cd 10-glass-folder-cards
npm install
```

Start the local development server on port **3010**:

```bash
npm run dev
```

Open [http://localhost:3010](http://localhost:3010) in your browser.

To validate type safety and build output:

```bash
npm run typecheck
npm run build
```

---

## Component API & Props Reference

### `GlassFolderProps`

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | `"My Files"` | The primary title rendered on the folder's front plate. |
| `meta` | `string` | Dynamic (item count) | Secondary subtitle line. Defaults to rolling item count (e.g., "3 items"). |
| `tone` | `"light" \| "dark"` | `"light"` | Visual palette: `"light"` renders milk glass with bright sheen; `"dark"` renders smoked obsidian glass. |
| `art` | `FolderArt` (`ArtPreset \| ArtRecipe \| "none"`) | `"aurora"` | Back panel generative artwork preset, custom recipe, or `"none"` for neutral frosted glass. |
| `seed` | `number` | `3` | PRNG seed creating variations of the selected art recipe. |
| `image` | `string` | `undefined` | Optional custom external image URL for the back panel instead of generative art. |
| `files` | `FolderFile[]` | `SAMPLE_FILES` | Initial list of file items. Read once on initial render; after mount the folder owns and manages the list. |
| `action` | `"add" \| "more" \| "none"` | `"add"` | Action button behavior: `"add"` drops a new file, `"more"` displays a context menu, `"none"` hides the button. |
| `onAdd` | `(files: FolderFile[]) => FolderFile \| void` | `undefined` | Callback invoked when `+` button is pressed. Return a `FolderFile` to specify contents or void for default "Untitled". |
| `onFilesChange` | `(files: FolderFile[]) => void` | `undefined` | Callback invoked whenever the internal files list changes. |
| `menu` | `FolderMenuItem[]` | `[]` | Extra items rendered in the `···` popup menu (prefixed automatically by Open / Close). |
| `labelPlacement` | `"bottom-left" \| "top-left" \| "top-right"` | `"bottom-left"` | Position of the folder label on the front glass plate. |
| `open` | `boolean` | `undefined` | Controlled open state. Supplying this prop puts the folder into controlled mode. |
| `defaultOpen` | `boolean` | `false` | Initial uncontrolled open state. |
| `onOpenChange` | `(open: boolean) => void` | `undefined` | Callback fired when open state toggles. |
| `onFileSelect` | `(file: FolderFile, index: number) => void` | `undefined` | Callback fired when a file card in the fanned deck is clicked or activated. |
| `width` | `number` | `340` | Base stage width in pixels. All inner elements scale proportionally (stage height is `0.96 × width`). |
| `appear` | `boolean` | `true` | Whether the folder animates its entrance when scrolled into view. |
| `appearDelay` | `number` | `0` | Stagger delay (in ms) before entrance animation triggers. |
| `className` | `string` | `undefined` | Additional CSS class names on the container element. |
| `style` | `React.CSSProperties` | `undefined` | Inline styling overrides. |

> **Note on State Management**: The `files` prop is read once on initial mount; thereafter, the folder owns the file list internally. Supplying `open` transforms the component into a controlled component governed by `onOpenChange`.

---

### Supporting Types

#### `FolderFile`
Defines each document card slotted inside the folder pocket:
```typescript
export type FolderFile = {
  name: string
  /** A short second line: a size, a date, a kind. */
  meta?: string
  /** Makes the file a picture: a generated artwork preset or recipe… */
  art?: ArtPreset | ArtRecipe
  /** …or an image of your own. Without either, the file is a sheet of paper. */
  image?: string
  /** Rendered as a link when the folder is open. */
  href?: string
}
```

#### `FolderMenuItem`
Defines menu entries in the `action="more"` context dropdown:
```typescript
export type FolderMenuItem = {
  label: string
  onSelect?: () => void
  /** Drawn in red, for the one you would want to think twice about. */
  danger?: boolean
}
```

#### `ArtRecipe`
Defines domain-warped liquid field rendering parameters:
```typescript
export type ArtRecipe = {
  /** 'marble' folds the colours through each other; 'streak' pulls them into a long exposure. */
  style: "marble" | "streak"
  /** Two or more colours, in the order they appear through the field. */
  colors: string[]
  /** Size of the forms. Lower is larger and calmer. */
  scale?: number
  /** How hard the field folds into itself. */
  warp?: number
  /** Direction of the flow, in radians. */
  angle?: number
  /** Specular highlight on the liquid surface, 0–1. */
  gloss?: number
  /** Dark veins along the folds, 0–1. */
  veins?: number
}
```

---

## Interactions, Accessibility & Motion

### Interaction Model
- **Hover & Focus Lean**: Hovering or focusing elements within the folder triggers a 3D perspective rotation (`--gf-hinge: -11deg`), lifting internal documents slightly (`--gf-lift: -34px`).
- **Open Activation**: Clicking the front glass plate or activating via keyboard (`Enter`, `Space`) prompts the front hinge to tilt forward to `-24deg` and fans out the cards across an expressive spread.
- **Escape Key Handling**: Pressing `Escape` hierarchically dismisses open components:
  1. If the popup menu is open, it closes the menu and returns focus to the action key.
  2. If the folder is open, it closes the folder and restores focus to the main folder trigger.
- **Outside Press**: Pointer clicks outside the folder automatically collapse the open state or context menu.
- **Top 4 Visible Files**: To preserve realistic physical pocket limits, a maximum of the newest 4 files (`MAX_VISIBLE = 4`) fan out in the active deck stack. Older files remain neatly contained inside.
- **Anchor Link Rendering**: If a file contains an `href` attribute, it renders as a semantic `<a>` link when open; otherwise, it renders as an accessible `<button>`.
- **Touch Device Optimization**: Dynamic pointer parallax calculations (`--gf-px`, `--gf-py`) are skipped on touch pointer devices (`pointerType === "touch"`) to prevent unwanted jitter while scrolling.

### Menu Keyboard Navigation
When the action menu is invoked (`action="more"`):
- **Focus on Open**: Automatically moves focus to the first item (`[role=menuitem]`).
- **ArrowDown / ArrowUp**: Cycles focus smoothly down and up through menu options with wrap-around.
- **Home / End**: Directly jumps focus to the first or last menu item.
- **Tab**: Closes the open menu and restores normal document tab order navigation.

### Accessibility (a11y)
- **`aria-expanded`**: Explicitly set on the front glass hit button and context menu trigger button.
- **Semantic Roles**: Menu containers declare `role="menu"`, while buttons declare `role="menuitem"`. File container declares `role="list"` with children `role="listitem"`.
- **Inert Closed Files**: When the folder is closed, the files container possesses the HTML `inert` attribute (`filesRef.current?.toggleAttribute("inert", !open)`), removing hidden cards completely from screen reader and keyboard tab sequences.
- **`aria-live` Omission**: Explicitly avoided on rapid card mutations to prevent noisy speech synthesizer interruptions during multiple card insertions.

### Prefers-Reduced-Motion Behavior
When the user's operating system requests reduced motion (`@media (prefers-reduced-motion: reduce)`):
- All transition durations and delays are immediately forced to `0s !important`.
- Dynamic keyframe bounce animations (`gf-bump`, `gf-drop`, `gf-turn`, `gf-roll`) are suppressed (`animation: none !important`).
- 3D perspective mouse tilt transformations are disabled (`.gf-tilt { transform: none; }`).
