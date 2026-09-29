TASK
Set up the repo https://github.com/SparshSunilNaik/Peak-frontends.git as a personal
library of frontends. Each frontend lives in its own numbered folder, is fully
self-contained, runs on localhost only (no deployment, no GitHub Pages), and stores the
exact prompt that produced it. Then build frontend #1 (below).

STEP 1 - GIT SETUP
Clone the repo. Before any commit run:
  git config user.name "SparshSunilNaik"
  git config user.email "ssn7406n@gmail.com"
Verify with `git config --local --list`. Use branch main. Never commit node_modules,
.next, .env files or build output.

STEP 2 - REPO CONVENTION (root)
Create at the repo root:
- README.md containing: what the repo is, an index table (Folder | Name | Stack | Run
  command | Port), and a "How to add a new frontend" section stating this convention:
    * folder name is NN-kebab-name (01-, 02-, ...)
    * each folder is an independent project with its own package.json (no monorepo,
      no shared root dependencies)
    * each folder has README.md (install + run + port + what it demonstrates) and
      PROMPT.md (the full original prompt, verbatim)
    * update the root index table when adding one
    * localhost demo only
- .gitignore (node_modules, .next, dist, .env*, .DS_Store, *.log)

STEP 3 - FRONTEND #1: 01-prism-hero
Stack: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn project structure,
created inside 01-prism-hero/. Use `npx create-next-app@latest` with TypeScript,
Tailwind, ESLint, App Router, src dir OFF, import alias "@/*". Then initialize shadcn
(`npx shadcn@latest init`) so components.json and the "@/components/ui" convention
exist. Explain in the folder README why components/ui matters (shadcn's generator and
the "@/components/ui/..." imports expect it).

Component work:
- Save the component from the spec below as components/ui/prism-hero.tsx, VERBATIM.
  Do not rewrite or "improve" it.
- Save the demo as components/prism-hero-demo.tsx (VERBATIM, it already imports from
  "@/components/ui/prism-hero"). Render it from app/page.tsx.
- Install dependencies: three, @types/three, motion, @react-three/fiber,
  @react-three/drei. Pick versions compatible with the installed React version
  (React 19 needs @react-three/fiber 9.x and drei 10.x). If npm reports peer
  conflicts, resolve them with correct versions; do not blindly use --force.
- Fonts: the component reads CSS variables --font-display and --font-mono. In
  app/layout.tsx load "Bodoni Moda" (variable --font-display) and "JetBrains Mono"
  (variable --font-mono) with next/font/google and attach both variables to <html>.
- globals.css: body margin 0, background #08080B, color #EDE8DF, no default page
  padding. The hero is 260vh tall and scroll-driven, so do not wrap it in any
  container that breaks position: sticky (no overflow hidden on ancestors).
- No image assets or icon libraries are needed for this component.

Verification (do all, report results):
1. `npm run build` passes with no TypeScript or lint errors.
2. `npm run dev`, open http://localhost:3000 in a browser. Confirm: the crystal
   renders and refracts the "Refraction" headline, the two buttons show, scrolling
   rotates/scales the crystal, and the browser console has no hydration or WebGL
   errors. Screenshot at 1440px and 375px wide.
3. If WebGL is unavailable in your environment, say so explicitly and still confirm
   the build and that the page returns HTTP 200.

Folder docs:
- 01-prism-hero/README.md: install, run (`npm install && npm run dev`), URL, what it
  demonstrates, list of props of PrismHero.
- 01-prism-hero/PROMPT.md: this ENTIRE prompt, including the pasted component spec
  below, saved verbatim.
- Add row 01 to the root README index table.

STEP 4 - COMMIT AND PUSH
Commits (separate, clear messages):
  "chore: repo scaffold and conventions"
  "feat(01-prism-hero): crystal refraction hero"
  "docs(01-prism-hero): README and original prompt"
Push to main. If authentication is needed, stop and ask me rather than guessing.
Final report: raw output of `git log --format="%h %an <%ae> %s"` and `git push`, the
folder tree (2 levels), and the verification results.

COMPONENT SPEC:
<<< PASTE YOUR FULL SPEC BLOCK HERE >>>
