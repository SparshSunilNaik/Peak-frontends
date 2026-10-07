# Peak Frontends

This repository serves as a personal library of frontends. Each frontend lives in its own numbered folder, is fully self-contained, runs on localhost only, and stores the exact prompt that produced it.

## Index

| Folder | Name | Stack | Run command | Port |
| :--- | :--- | :--- | :--- | :--- |
| 01-prism-hero | Prism Hero | Next.js, Tailwind, shadcn | `npm install && npm run dev` | 3000 |
| 02-gateway-flow | Gateway Flow | Next.js, Tailwind, shadcn | `npm install && npm run dev` | 3002 |
| 03-liquid-glass-carousel | Liquid Glass Carousel | Next.js, Tailwind, shadcn, three, gsap | `npm install && npm run dev` | 3003 |
| 04-agentic-factory-3d | Agentic Factory 3D | Next.js, Tailwind, shadcn, three | `npm install && npm run dev` | 3004 |
| 05-image-stream-hero | Image Stream Hero | Next.js, Tailwind, shadcn | `npm install && npm run dev` | 3005 |
| 06-scroll-timeline | Scroll Timeline | Next.js, Tailwind, shadcn, gsap | `npm install && npm run dev` | 3006 |
| 07-morph-gallery | Morph Gallery | Next.js, Tailwind, shadcn | `npm install && npm run dev` | 3007 |

## How to add a new frontend

This repository follows a strict convention:
* Folder name must be `NN-kebab-name` (e.g., `01-`, `02-`, ...).
* Each folder is an independent project with its own `package.json` (no monorepo setup, no shared root dependencies).
* Each folder must contain:
  * `README.md`: Explaining installation, run command, port, and what it demonstrates.
  * `PROMPT.md`: Containing the full original prompt, verbatim.
* After adding a new frontend, update the index table in this root `README.md`.
* These projects are for localhost demo purposes only. No deployment or GitHub Pages setup is included.
