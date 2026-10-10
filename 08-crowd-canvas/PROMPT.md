TASK: Add frontend #8 to the Peak-frontends repo. Do the whole thing in one go and do NOT ask questions. If something is ambiguous, pick the sensible default and note it in the folder README.

SETUP
- Use the existing clone of https://github.com/SparshSunilNaik/Peak-frontends.git (clone it if missing), then `git pull --rebase` on main. Read root README.md and follow its conventions: NN-kebab-name folder, independent package.json (no monorepo), own README.md + PROMPT.md, localhost only, root index table updated. Match how 01 to 07 were set up. If the root README index has a merge conflict, keep every existing row and add yours.
- Set identity locally: git config user.name "SparshSunilNaik" and git config user.email "ssn7406n@gmail.com". Verify with git config --local --list. Never commit node_modules, .next or .env files.

COMMIT STRATEGY (IMPORTANT)
Work incrementally and commit as you go, in small atomic commits, one logical change each. Make AT LEAST 20 commits for this folder, following the plan below in order. Rules:
- Every commit must contain a real, meaningful change to the repo. No empty commits (never use --allow-empty), no whitespace-only or revert-and-redo churn, no touching the same line back and forth.
- Commit messages must describe what that commit actually changes, in conventional-commit style, scoped like "feat(08-crowd-canvas): ...". Do not use words like "dummy", "filler", "test commit" or "wip".
- Do not backdate commits or set GIT_AUTHOR_DATE / GIT_COMMITTER_DATE. Use real timestamps.
- The two verbatim files (skiper39.tsx and the demo) must each be committed whole in a single commit, never split.
- Commit as soon as each step is done, not at the end. Push to main once at the end (all commits in one push).
- If a step turns out to be a no-op, do not invent a change: fold in the next real step instead and add an extra real commit elsewhere (for example splitting the README further) so the total stays at 20 or more.

COMMIT PLAN (in this order)
1. chore(08-crowd-canvas): scaffold Next.js app with TypeScript and Tailwind (create-next-app output; make sure a .gitignore inside the folder excludes node_modules and .next)
2. chore(08-crowd-canvas): initialize shadcn (components.json, lib/utils.ts, theme tokens)
3. chore(08-crowd-canvas): add gsap dependency (commit package.json and the lockfile)
4. chore(08-crowd-canvas): run dev server on port 3008 (change the "dev" script to "next dev -p 3008")
5. style(08-crowd-canvas): reset body margin in globals.css while keeping shadcn theme tokens (no overflow or height rules on html/body)
6. feat(08-crowd-canvas): add animated crowd canvas component (components/ui/skiper39.tsx, VERBATIM)
7. feat(08-crowd-canvas): add crowd canvas demo (components/skiper39-demo.tsx, VERBATIM)
8. feat(08-crowd-canvas): render demo on the home page (app/page.tsx, no wrapper element)
9. chore(08-crowd-canvas): set page title and description metadata in app/layout.tsx
10. chore(08-crowd-canvas): replace default favicon with a simple SVG icon (app/icon.svg)
11. chore(08-crowd-canvas): add typecheck script to package.json (tsc --noEmit)
12. chore(08-crowd-canvas): declare supported Node version in package.json "engines" and add an .nvmrc
13. chore(08-crowd-canvas): disable React Strict Mode in next.config (reactStrictMode: false) with a comment explaining why (see STRICT MODE below)
14. chore(08-crowd-canvas): adjust eslint config for the vendored component file (only the rules it actually trips, for example @typescript-eslint/no-explicit-any; if nothing trips, add a short comment block to eslint.config.mjs documenting that components/ui files are vendored and left verbatim)
15. docs(08-crowd-canvas): add README overview and what the demo shows
16. docs(08-crowd-canvas): document install and run steps in README
17. docs(08-crowd-canvas): document CrowdCanvas props (src, rows, cols) and the sprite sheet layout in README
18. docs(08-crowd-canvas): explain how the animation works and add the Skiper UI credit and license note in README
19. docs(08-crowd-canvas): add troubleshooting and Deviations sections to README, and store the original prompt and spec in PROMPT.md
20. docs: add 08-crowd-canvas to the root README index (folder, name, stack, run command, port 3008)
If verification (below) finds anything that needs fixing, make those fixes as additional commits after step 20.

FOLDER: 08-crowd-canvas
- create-next-app (TypeScript, Tailwind, ESLint, App Router, src dir OFF, alias "@/*"), then `npx shadcn@latest init` so components.json, lib/utils.ts and the "@/components/ui" convention exist. Explain in the folder README why components/ui matters.
- npm install gsap (latest). No other packages are needed.
- package.json: "dev": "next dev -p 3008".

FILES (exact, do not improvise)
1. components/ui/skiper39.tsx = the skiper39.tsx block from the SPEC below, VERBATIM. Do not rewrite, reformat, rename, "fix" or refactor anything. Do NOT run prettier or eslint --fix on it. Leave the "Croud Canvas" spelling and the license/credit comment at the bottom exactly as written.
2. components/skiper39-demo.tsx = the demo.tsx block from the SPEC, VERBATIM.
3. app/page.tsx renders the demo directly with NO wrapper element (import from "@/components/skiper39-demo"). The demo is already `relative h-screen w-full`.
4. globals.css: keep what shadcn init generated. Make sure body margin is 0 and do not add overflow or height rules to html or body.

STRICT MODE
The component starts an image load inside its effect, but its cleanup does not cancel that load, so under React Strict Mode in dev (which mounts effects twice) the first mount's image still fires onload after cleanup and starts a second, never-cleaned-up crowd. To avoid a doubled crowd in dev, set `reactStrictMode: false` in next.config (commit 13) with a comment, and record it under "Deviations from the original spec". Do NOT edit the component for this.

IMAGE
The sprite sheet loads from cdn.21st.dev (a PNG laid out as 15 columns by 7 rows of people). Run `curl -sI <url>` on the src URL used in the demo and expect HTTP 200 and an image content-type. Canvas drawing of a cross-origin image does not need CORS headers, so no CORS check is required. If the request fails, do NOT invent a replacement sprite sheet: leave the demo unchanged, record the failure under Deviations and in the final report, and continue.

VERBATIM CHECK (run and report the output)
- `wc -l` on both saved files (component is roughly 330 lines, demo roughly 10).
- grep confirms in the component: "const CrowdCanvas", "const Skiper39", "export { CrowdCanvas, Skiper39 }", "export default Skiper39", "Croud Canvas", "We respect the original creators". In the demo: "export default function Skiper39Demo". If any check fails, the paste was truncated: re-save from the spec.

BUILD / LINT
Run npm run build. If ESLint errors come from the vendored file (very likely @typescript-eslint/no-explicit-any and possibly react-hooks/exhaustive-deps), do NOT edit it: disable only the offending rules for that file in eslint.config.mjs with a comment (this is commit 14). If TypeScript errors come from it, do NOT edit it: as a last resort set `typescript: { ignoreBuildErrors: true }` in next.config. Record every workaround with the exact error text under "Deviations from the original spec". Fix errors in files you wrote normally.

VERIFICATION
I have no browser here, so skip screenshots. Run npm run build, start npm run dev, and confirm HTTP 200 on http://localhost:3008. State plainly in the final report that visuals were NOT verified. Do not claim the crowd animation works visually.

DOCS (content for commits 15 to 19)
- 08-crowd-canvas/README.md, written in the sections described by commits 15 to 19: what it demonstrates (a 2D canvas crowd of illustrated people walking left and right across the screen, driven by GSAP timelines and the GSAP ticker, depth-sorted so lower figures draw in front); install, run, URL/port 3008; the CrowdCanvas props table (src: sprite sheet URL, rows default 15, cols default 7) and an explanation of the sprite sheet layout (the image is sliced into rows x cols equal cells, each cell is one person); how it works (each person gets a GSAP timeline that moves x across the stage with a yoyo bob on y, random timeScale per walker, crowd sorted by anchorY every time one respawns, resize rebuilds the crowd); the exports (CrowdCanvas, Skiper39, default Skiper39); the credit and license note (Skiper UI, author @gurvinder-singh02, inspired by the codepen by zadvorsky, illustrations by openpeeps.com; free version requires attribution to Skiper UI); the internet requirement (sprite sheet loads from a CDN); troubleshooting (blank screen usually means the sprite sheet URL failed, doubled crowd means Strict Mode is on); and the Deviations section (never write "None": the Strict Mode setting is always there).
- 08-crowd-canvas/PROMPT.md = this ENTIRE message including the spec below, verbatim.
- Root README index row for 08 (folder, name, stack, run command, port 3008).

PUSH
After all commits are made, push to main once. If push auth is needed, stop and tell me. Final report: raw output of `git log --format="%h %an <%ae> %s" -n 30` and `git push`, the folder tree (2 levels), the verbatim-check output, the image check result, and the verification results.

SPEC (save verbatim into PROMPT.md and use as the source for the files):

You are given a task to integrate an existing React component in the codebase

The codebase should support:
- shadcn project structure  
- Tailwind CSS
- Typescript

If it doesn't, provide instructions on how to setup project via shadcn CLI, install Tailwind or Typescript.

Determine the default path for components and styles. 
If default path for components is not /components/ui, provide instructions on why it's important to create this folder
Copy-paste this component to /components/ui folder:
\`\`\`tsx
skiper39.tsx
"use client";

import { gsap } from "gsap";
import React, { useEffect, useRef } from "react";

interface CrowdCanvasProps {
  src: string;
  rows?: number;
  cols?: number;
}

const CrowdCanvas = ({ src, rows = 15, cols = 7 }: CrowdCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const config = {
      src,
      rows,
      cols,
    };

    // UTILS
    const randomRange = (min: number, max: number) =>
      min + Math.random() * (max - min);
    const randomIndex = (array: any[]) => randomRange(0, array.length) | 0;
    const removeFromArray = (array: any[], i: number) => array.splice(i, 1)[0];
    const removeItemFromArray = (array: any[], item: any) =>
      removeFromArray(array, array.indexOf(item));
    const removeRandomFromArray = (array: any[]) =>
      removeFromArray(array, randomIndex(array));
    const getRandomFromArray = (array: any[]) => array[randomIndex(array) | 0];

    // TWEEN FACTORIES
    const resetPeep = ({ stage, peep }: { stage: any; peep: any }) => {
      const direction = Math.random() > 0.5 ? 1 : -1;
      const offsetY = 100 - 250 * gsap.parseEase("power2.in")(Math.random());
      const startY = stage.height - peep.height + offsetY;
      let startX: number;
      let endX: number;

      if (direction === 1) {
        startX = -peep.width;
        endX = stage.width;
        peep.scaleX = 1;
      } else {
        startX = stage.width + peep.width;
        endX = 0;
        peep.scaleX = -1;
      }

      peep.x = startX;
      peep.y = startY;
      peep.anchorY = startY;

      return {
        startX,
        startY,
        endX,
      };
    };

    const normalWalk = ({ peep, props }: { peep: any; props: any }) => {
      const { startX, startY, endX } = props;
      const xDuration = 10;
      const yDuration = 0.25;

      const tl = gsap.timeline();
      tl.timeScale(randomRange(0.5, 1.5));
      tl.to(
        peep,
        {
          duration: xDuration,
          x: endX,
          ease: "none",
        },
        0,
      );
      tl.to(
        peep,
        {
          duration: yDuration,
          repeat: xDuration / yDuration,
          yoyo: true,
          y: startY - 10,
        },
        0,
      );

      return tl;
    };

    const walks = [normalWalk];

    // TYPES
    type Peep = {
      image: HTMLImageElement;
      rect: number[];
      width: number;
      height: number;
      drawArgs: any[];
      x: number;
      y: number;
      anchorY: number;
      scaleX: number;
      walk: any;
      setRect: (rect: number[]) => void;
      render: (ctx: CanvasRenderingContext2D) => void;
    };

    // FACTORY FUNCTIONS
    const createPeep = ({
      image,
      rect,
    }: {
      image: HTMLImageElement;
      rect: number[];
    }): Peep => {
      const peep: Peep = {
        image,
        rect: [],
        width: 0,
        height: 0,
        drawArgs: [],
        x: 0,
        y: 0,
        anchorY: 0,
        scaleX: 1,
        walk: null,
        setRect: (rect: number[]) => {
          peep.rect = rect;
          peep.width = rect[2];
          peep.height = rect[3];
          peep.drawArgs = [peep.image, ...rect, 0, 0, peep.width, peep.height];
        },
        render: (ctx: CanvasRenderingContext2D) => {
          ctx.save();
          ctx.translate(peep.x, peep.y);
          ctx.scale(peep.scaleX, 1);
          ctx.drawImage(
            peep.image,
            peep.rect[0],
            peep.rect[1],
            peep.rect[2],
            peep.rect[3],
            0,
            0,
            peep.width,
            peep.height,
          );
          ctx.restore();
        },
      };

      peep.setRect(rect);
      return peep;
    };

    // MAIN
    const img = document.createElement("img");
    const stage = {
      width: 0,
      height: 0,
    };

    const allPeeps: Peep[] = [];
    const availablePeeps: Peep[] = [];
    const crowd: Peep[] = [];

    const createPeeps = () => {
      const { rows, cols } = config;
      const { naturalWidth: width, naturalHeight: height } = img;
      const total = rows * cols;
      const rectWidth = width / rows;
      const rectHeight = height / cols;

      for (let i = 0; i < total; i++) {
        allPeeps.push(
          createPeep({
            image: img,
            rect: [
              (i % rows) * rectWidth,
              ((i / rows) | 0) * rectHeight,
              rectWidth,
              rectHeight,
            ],
          }),
        );
      }
    };

    const initCrowd = () => {
      while (availablePeeps.length) {
        addPeepToCrowd().walk.progress(Math.random());
      }
    };

    const addPeepToCrowd = () => {
      const peep = removeRandomFromArray(availablePeeps);
      const walk = getRandomFromArray(walks)({
        peep,
        props: resetPeep({
          peep,
          stage,
        }),
      }).eventCallback("onComplete", () => {
        removePeepFromCrowd(peep);
        addPeepToCrowd();
      });

      peep.walk = walk;

      crowd.push(peep);
      crowd.sort((a, b) => a.anchorY - b.anchorY);

      return peep;
    };

    const removePeepFromCrowd = (peep: Peep) => {
      removeItemFromArray(crowd, peep);
      availablePeeps.push(peep);
    };

    const render = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.scale(devicePixelRatio, devicePixelRatio);

      crowd.forEach((peep) => {
        peep.render(ctx);
      });

      ctx.restore();
    };

    const resize = () => {
      if (!canvas) return;
      stage.width = canvas.clientWidth;
      stage.height = canvas.clientHeight;
      canvas.width = stage.width * devicePixelRatio;
      canvas.height = stage.height * devicePixelRatio;

      crowd.forEach((peep) => {
        peep.walk.kill();
      });

      crowd.length = 0;
      availablePeeps.length = 0;
      availablePeeps.push(...allPeeps);

      initCrowd();
    };

    const init = () => {
      createPeeps();
      resize();
      gsap.ticker.add(render);
    };

    img.onload = init;
    img.src = config.src;

    const handleResize = () => resize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      gsap.ticker.remove(render);
      crowd.forEach((peep) => {
        if (peep.walk) peep.walk.kill();
      });
    };
  }, []);
  return (
    <canvas ref={canvasRef} className="absolute bottom-0 h-[90vh] w-full" />
  );
};

const Skiper39 = () => {
  return (
    <div className="relative h-full w-full bg-white text-black">
      <div className="top-22 absolute left-1/2 grid -translate-x-1/2 content-start justify-items-center gap-6 text-center text-black">
        <span className="relative max-w-[12ch] text-xs uppercase leading-tight opacity-40 after:absolute after:left-1/2 after:top-full after:h-16 after:w-px after:bg-gradient-to-b after:from-white after:to-black after:content-['']">
          Croud Canvas
        </span>
      </div>
      <div className="absolute bottom-0 h-full w-screen">
        <CrowdCanvas
          src="https://cdn.21st.dev/assets/localized/abdb8990a7bef8c2f5af3e45f0a3c969c4b0603fba8be92e81347de4ea4e1ed7.png"
          rows={15}
          cols={7}
        />
      </div>
    </div>
  );
};

export { CrowdCanvas, Skiper39 };
export default Skiper39;

/**
 * Skiper 39 Canvas_Landing_004 — React + Canvas
 * Inspired by and adapted from https://codepen.io/zadvorsky/pen/xxwbBQV
 * illustration by https://www.openpeeps.com/
 * We respect the original creators. This is an inspired rebuild with our own taste and does not claim any ownership.
 * These animations aren’t associated with the codepen.io . They’re independent recreations meant to study interaction design
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
\`\`\`

\`\`\`tsx
demo.tsx
import Skiper39 from "@/components/ui/skiper39";

export default function Skiper39Demo() {
  return (
    <div className="relative h-screen w-full">
      <Skiper39 />
    </div>
  );
}

\`\`\`

Install NPM dependencies:
\`\`\`bash
gsap
\`\`\`

Implementation Guidelines
 1. Analyze the component structure and identify all required dependencies
 2. Review the component's argumens and state
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
