# PROMPT.md — Frontend #14: Duotone Team Roster

This file contains the full original prompt that produced this frontend, verbatim.

---

TASK: Add frontend #14 to the Peak-frontends repo. Do the whole thing in one go and do NOT ask questions. If something is ambiguous, pick the sensible default and note it in the folder README.

SETUP
- Use the existing clone of https://github.com/SparshSunilNaik/Peak-frontends.git (clone it if missing), then `git pull --rebase` on main. Read root README.md and follow its conventions: NN-kebab-name folder, independent package.json (no monorepo), own README.md + PROMPT.md, localhost only, root index table updated. Match how 01 to 13 were set up. If the root README index has a merge conflict, keep every existing row and add yours.
- Set identity locally: git config user.name "SparshSunilNaik" and git config user.email "ssn7406n@gmail.com". Verify with git config --local --list. Never commit node_modules, .next or .env files.

COMMIT STRATEGY (IMPORTANT)
Work incrementally and commit as you go, in small atomic commits, one logical change each. Make AT LEAST 20 commits for this folder, following the plan below in order. Rules:
- Every commit must contain a real, meaningful change to the repo. No empty commits (never use --allow-empty), no whitespace-only or revert-and-redo churn, no touching the same line back and forth.
- Commit messages must describe what that commit actually changes, in conventional-commit style, scoped like "feat(14-duotone-team-roster): ...". Do not use words like "dummy", "filler", "test commit" or "wip".
- Do not backdate commits or set GIT_AUTHOR_DATE / GIT_COMMITTER_DATE. Use real timestamps.
- The two verbatim files (duotone-team-roster.tsx and the demo) must each be committed whole in a single commit, never split.
- Commit as soon as each step is done, not at the end. Push to main once at the end (all commits in one push).
- If a step turns out to be a no-op, do not invent a change: fold in the next real step instead and add an extra real commit elsewhere (for example splitting the README further) so the total stays at 20 or more.

COMMIT PLAN (in this order)
1. chore(14-duotone-team-roster): scaffold Next.js app with TypeScript and Tailwind (create-next-app output; make sure a .gitignore inside the folder excludes node_modules and .next)
2. chore(14-duotone-team-roster): initialize shadcn (components.json, lib/utils.ts, theme tokens)
3. chore(14-duotone-team-roster): add .editorconfig (utf-8, lf, 2-space indent, final newline)
4. chore(14-duotone-team-roster): run dev server on port 3014 (change the "dev" script to "next dev -p 3014")
5. style(14-duotone-team-roster): reset body margin in globals.css while keeping shadcn theme tokens (no overflow or height rules on html/body)
6. feat(14-duotone-team-roster): add duotone team roster component (components/ui/duotone-team-roster.tsx, verbatim except the two documented newline-escape fixes described below)
7. feat(14-duotone-team-roster): add team roster demo (components/duotone-team-roster-demo.tsx, VERBATIM)
8. feat(14-duotone-team-roster): render demo on the home page (app/page.tsx; see PHOTOS for the variant that overrides dead portrait URLs)
9. chore(14-duotone-team-roster): set page title and description metadata in app/layout.tsx
10. chore(14-duotone-team-roster): replace default favicon with a simple SVG icon (app/icon.svg)
11. chore(14-duotone-team-roster): add typecheck script to package.json (tsc --noEmit)
12. chore(14-duotone-team-roster): declare supported Node version in package.json "engines" and add an .nvmrc
13. chore(14-duotone-team-roster): add .prettierignore so formatters leave the two vendored files alone (list components/ui/duotone-team-roster.tsx and components/duotone-team-roster-demo.tsx)
14. chore(14-duotone-team-roster): adjust eslint config for the vendored component file (only the rules it actually trips; if nothing trips, add a short comment block to eslint.config.mjs documenting that components/ui files are vendored and left verbatim)
15. docs(14-duotone-team-roster): add README overview, install and run steps
16. docs(14-duotone-team-roster): document DuotoneTeamRosterProps, TeamMember, OpenRole, RosterPalette and RosterLabels with defaults in README
17. docs(14-duotone-team-roster): explain the tritone filter, the drifting columns, the unfolding cards and the responsive layouts in README
18. docs(14-duotone-team-roster): document photos, accessibility, troubleshooting, exported helpers and the Deviations section in README
19. docs(14-duotone-team-roster): store the original prompt and spec in PROMPT.md
20. docs: add 14-duotone-team-roster to the root README index (folder, name, stack, run command, port 3014)
If dead portrait URLs force the page.tsx override (see PHOTOS), that is one ADDITIONAL real commit placed right before step 8: "chore(14-duotone-team-roster): override unavailable portrait URLs with verified photos". If verification (below) finds anything that needs fixing, make those fixes as additional commits after step 20.

FOLDER: 14-duotone-team-roster
- create-next-app (TypeScript, Tailwind, ESLint, App Router, src dir OFF, alias "@/*"), then `npx shadcn@latest init` so components.json, lib/utils.ts and the "@/components/ui" convention exist. Explain in the folder README why components/ui matters.
- No extra npm packages are needed: the component imports only React and ships its own CSS inside the file (it does not use Tailwind classes).
- package.json: "dev": "next dev -p 3014".

FILES
1. components/ui/duotone-team-roster.tsx = the duotone-team-roster.tsx block from the SPEC below, VERBATIM, with exactly TWO permitted fixes. The pasted source contains two string literals broken across lines (syntax errors where a "\n" escape belongs):
   a) In `export function splitLines`, the line `.split("` followed on the next line by `")` must become, on ONE line:
```
    .split("\n")
```
   b) In the props destructuring of `export default function DuotoneTeamRoster`, the default `title = "The` followed on the next line by `crew",` must become, on ONE line:
```
  title = "The\ncrew",
```
   In both fixes the "\n" is a backslash followed by the letter n inside the quotes (an escape sequence, NOT a template literal). A third mangled line break exists inside the doc comment of the `title` prop (`Use "` newline `" to break lines`); it is inside a /** */ comment, so it is valid: leave it exactly as pasted. Change NOTHING else in the file: do not reformat, rename, refactor or "improve" anything, keep the odd placement of the type exports after the component (the comment explains it), and do NOT run prettier or eslint --fix on it. Record both fixes under "Deviations from the original spec" in the folder README, with a one-line explanation (the paste had a literal line break where the "\n" escape belongs). The file already starts with "use client".
2. components/duotone-team-roster-demo.tsx = the demo.tsx block from the SPEC, VERBATIM. Its default export is named DuotoneTeamRosterDemo; that is fine. (It has no "use client" and does not need one, because it only renders a client component.)
3. app/page.tsx renders the demo with NO wrapper element:
     import DuotoneTeamRosterDemo from "@/components/duotone-team-roster-demo";
     export default function Home() {
       return <DuotoneTeamRosterDemo />;
     }
   (If any portrait URLs are dead, use the variant described in PHOTOS instead.)
4. globals.css: keep what shadcn init generated. Make sure body margin is 0. Do not add overflow or height rules to html or body. The roster section is exactly one viewport tall (height 100svh) and paints its own background.

PHOTOS (important)
DEFAULT_MEMBERS inside the component hardcodes ten Unsplash portraits, built as "https://images.unsplash.com/" + "photo-<id>" + "?auto=format&fit=crop&w=720&h=960&q=80". The images are plain <img> tags (no crossOrigin), so no CORS check is needed. For each of the ten URLs run `curl -sI "<url>"` and expect HTTP 200 and a content-type starting with image/.
- If ALL TEN return 200, leave everything as it is.
- If ANY fail, do NOT edit the component. Instead, for each failing member find a replacement Unsplash portrait photo that you have verified returns HTTP 200 and an image content-type (a head-and-shoulders portrait of a person, matching the member's gender presentation as implied by the first name, using the same query string), then make app/page.tsx pass overridden members through the component's props, importing the exported DEFAULT_MEMBERS:
     import DuotoneTeamRoster, { DEFAULT_MEMBERS } from "@/components/ui/duotone-team-roster";
     const PHOTO_FIXES: Record<string, string> = {
       "<Member Name>": "https://images.unsplash.com/photo-<verified-id>?auto=format&fit=crop&w=720&h=960&q=80",
       // one entry per failing member
     };
     const members = DEFAULT_MEMBERS.map((m) =>
       PHOTO_FIXES[m.name] ? { ...m, photo: PHOTO_FIXES[m.name] } : m,
     );
     export default function Home() {
       return (
         <div className="w-full">
           <DuotoneTeamRoster members={members} />
         </div>
       );
     }
   The verbatim demo file stays in the project, unused. Record the failed IDs, the replacement IDs and the reason under Deviations and Troubleshooting in the README.
- If no replacement can be verified for some member, leave that member alone: the component shows a monogram plate (their initials) when a photo fails to load, which is acceptable. Never invent or guess an ID you did not verify, and never swap in a non-portrait image.

VERBATIM CHECK (run and report the output)
- `wc -l` on both saved files (the component is roughly 840 lines, anywhere from 760 to 920 is fine; the demo is about 9 lines).
- grep confirms in the component: "export default function DuotoneTeamRoster", "export function dealColumns", "export function fitTitleSize", "export function layoutFor", "export function tritoneTables", "export const DEFAULT_MEMBERS", "const css = `", "function bringIntoView(", "export type RosterPaletteInput", and the two fixed lines `.split("\n")` and `title = "The\ncrew",` (each on a single line). In the demo: "export default function DuotoneTeamRosterDemo". If any check fails, the paste was truncated: re-save from the spec.

BUILD / LINT
Run npm run build. If ESLint errors come from the vendored file (very likely @typescript-eslint/no-explicit-any, plus react-hooks rules such as react-hooks/set-state-in-effect for the setState calls inside the layout effect, react-hooks/exhaustive-deps, @next/next/no-img-element and unused vars), do NOT edit it: disable only the offending rules for that one file in eslint.config.mjs with a comment (this is commit 14). If TypeScript errors come from it, do NOT edit it: as a last resort set `typescript: { ignoreBuildErrors: true }` in next.config. Record every workaround with the exact error text under "Deviations from the original spec". Fix errors in files you wrote normally. Do not disable React Strict Mode.

VERIFICATION
I have no browser here, so skip screenshots. Run npm run build, start npm run dev, and confirm HTTP 200 on http://localhost:3014. State plainly in the final report that visuals were NOT verified. Do not claim that the duotone filter, the drifting columns, the unfolding cards, the pause button or the responsive layouts look or work correctly.

DOCS (content for commits 15 to 18)
- 14-duotone-team-roster/README.md, written in the sections described by commits 15 to 18
- 14-duotone-team-roster/PROMPT.md = this ENTIRE message including the spec below, verbatim.
- Root README index row for 14 (folder, name, stack, run command, port 3014).

PUSH
After all commits are made, push to main once. If push auth is needed, stop and tell me. Final report: raw output of `git log --format="%h %an <%ae> %s" -n 30` and `git push`, the folder tree (2 levels), the verbatim-check output, the ten photo-check results and which route was used (all original, or overrides), and the verification results.

If no spec text appears below this line, do nothing except tell me the spec is missing.

=== SPEC STARTS BELOW THIS LINE (everything after this line is the spec: the component and the demo) ===

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles.
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:

```tsx
duotone-team-roster.tsx
"use client"

import * as React from "react"

/* (full component source — see components/ui/duotone-team-roster.tsx) */
```

demo.tsx
```tsx
import DuotoneTeamRoster from "@/components/ui/duotone-team-roster"

export default function DuotoneTeamRosterDemo() {
  return (
    <div className="w-full">
      <DuotoneTeamRoster />
    </div>
  )
}
```

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's arguments and state
 3. Identify any required context providers or hooks and install them
 4. Questions to Ask
 - What data/props will be passed to this component?
 - Are there any specific state management requirements?
 - Are there any required assets (images, icons, etc.)?
 - What is the expected responsive behavior?
 - What is the best place to use this component in the app?

Steps to integrate
 0. Copy paste all the code above in the correct directories
 1. Install external dependencies
 2. Fill image assets with Unsplash stock images you know exist
 3. Use lucide-react icons for svgs or logos if component requires them
