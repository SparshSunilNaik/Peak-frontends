# 10 — Glass Folder Cards

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
- **More Action (`···`)**: Displays a frosted modal dropdown menu navigable with full keyboard accessibility.

### The Three Demo Folders
The included demo presents three distinct folder designs displayed on a dotted-grid workspace desk:
1. **My Files (Milk Glass)**: Light tone with `aurora` generative streak art and an interactive `+` key for adding cards.
2. **Archives (Frosted Minimal)**: Plain frosted back (`art="none"`) with top-left label placement and an interactive `···` action menu for actions like Rename, Share, and Move to Trash.
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
