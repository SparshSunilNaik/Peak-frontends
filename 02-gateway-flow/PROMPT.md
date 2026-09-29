TASK
Add frontend #2 to the existing repo Peak-frontends, following the conventions already
in the root README (NN-kebab-name folder, independent project with its own package.json,
README.md + PROMPT.md inside, localhost only, update the root index table).

GIT
Confirm identity before committing: user.name "SparshSunilNaik",
user.email "ssn7406n@gmail.com" (check `git config --local --list`; set locally if
missing). Pull latest main first. Never commit node_modules, .next or .env files.

FOLDER: 02-gateway-flow
Stack: Next.js (App Router) + TypeScript + Tailwind CSS + shadcn structure, created
inside 02-gateway-flow/ exactly the way 01-prism-hero was (create-next-app: TypeScript,
Tailwind, ESLint, App Router, src dir OFF, alias "@/*"; then `npx shadcn@latest init`
so components.json and "@/components/ui" exist). Explain in the folder README why
components/ui matters.

Component work:
- Save `gateway-flow.tsx` from the spec below as components/ui/gateway-flow.tsx,
  VERBATIM. Do not rewrite, reformat or "fix" it.
- Save `demo.tsx` as components/gateway-flow-demo.tsx, VERBATIM.
- app/page.tsx: render the component full screen for the demo:
    <main className="h-screen w-screen overflow-hidden bg-black">
      <GatewayFlow className="h-full w-full" />
    </main>
  (import from "@/components/ui/gateway-flow"). Keep the verbatim demo file in the
  project but unused by page.tsx.
- globals.css: body margin 0, background #000. Do not add other global styling.
- No npm packages beyond the Next/React/Tailwind/shadcn defaults are needed. The whole
  UI lives inside a sandboxed iframe (srcDoc) and loads Tailwind, iconify, GSAP and
  the Inter font from CDNs, so the machine needs internet access. Say this in the
  folder README.
- Ports: this project runs on port 3002 (set "dev": "next dev -p 3002" in package.json)
  so it can run alongside 01-prism-hero. Update the root README index with the port.
- Images: the component embeds three avatar images from cdn.21st.dev inside the iframe
  HTML string. Leave them as they are. If they fail to load when you test, then (and
  only then) replace those three URLs inside the string with Unsplash portrait photo
  URLs you know exist, and record that single change in the folder README under
  "Deviations from the original spec".

Verification (do all, report results):
1. `npm run build` passes with no TypeScript or lint errors.
2. `npm run dev`, open http://localhost:3002. Confirm: animated dotted flow lines
   converge on the centered "Nexus Gateway" login card, the heading words reveal,
   clicking the page makes a ripple that pushes the particles, card hover gives the
   gradient border, and the console shows no errors other than blocked-by-sandbox
   warnings. Screenshot at 1440px and 375px.
3. Check the card is fully visible (not clipped) at 375x667 and 1366x768; it scrolls
   inside the frame if the viewport is short. Report what you see.

Folder docs:
- 02-gateway-flow/README.md: install, run, URL/port, what it demonstrates, the
  GatewayFlow props (mode, speed, size, gap, length, density, strokeWidth, opacity, hue,
  saturation, brightness) with defaults, CDN/internet note, deviations (if any).
- 02-gateway-flow/PROMPT.md: this ENTIRE prompt including the pasted spec, verbatim.
- Add row 02 to the root README index table.

COMMIT AND PUSH to main, separate commits:
  "feat(02-gateway-flow): particle flow login gateway"
  "docs(02-gateway-flow): README and original prompt"
If authentication is needed, stop and ask me. Final report: raw output of
`git log --format="%h %an <%ae> %s"` and `git push`, folder tree (2 levels), and the
verification results.

COMPONENT SPEC (save verbatim into PROMPT.md and use as the source for the files):
<<< PASTE THE FULL SPEC BLOCK HERE, starting from "You are given a task to integrate an
existing React component..." through the end of the steps to integrate >>>
