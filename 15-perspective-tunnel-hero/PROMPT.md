TASK: Add frontend #15 to the Peak-frontends repo. Do the whole thing in one go and do NOT ask questions. If something is ambiguous, pick the sensible default and note it in the folder README.

SETUP
- Use the existing clone of https://github.com/SparshSunilNaik/Peak-frontends.git (clone it if missing), then `git pull --rebase` on main. Read root README.md and follow its conventions: NN-kebab-name folder, independent package.json (no monorepo), own README.md + PROMPT.md, localhost only, root index table updated. Match how 01 to 14 were set up. If the root README index has a merge conflict, keep every existing row and add yours.
- Set identity locally: git config user.name "SparshSunilNaik" and git config user.email "ssn7406n@gmail.com". Verify with git config --local --list. Never commit node_modules, .next or .env files.

COMMIT STRATEGY (IMPORTANT)
Work incrementally and commit as you go, in small atomic commits, one logical change each. Make AT LEAST 20 commits for this folder, following the plan below in order. Rules:
- Every commit must contain a real, meaningful change to the repo. No empty commits (never use --allow-empty), no whitespace-only or revert-and-redo churn, no touching the same line back and forth.
- Commit messages must describe what that commit actually changes, in conventional-commit style, scoped like "feat(15-perspective-tunnel-hero): ...". Do not use words like "dummy", "filler", "test commit" or "wip".
- Do not backdate commits or set GIT_AUTHOR_DATE / GIT_COMMITTER_DATE. Use real timestamps.
- The two verbatim files (perspective-tunnel-hero.tsx and the demo) must each be committed whole in a single commit, never split.
- Commit as soon as each step is done, not at the end. Push to main once at the end (all commits in one push).
- If a step turns out to be a no-op, do not invent a change: fold in the next real step instead and add an extra real commit elsewhere (for example splitting the README further) so the total stays at 20 or more.

COMMIT PLAN (in this order)
1. chore(15-perspective-tunnel-hero): scaffold Next.js app with TypeScript and Tailwind (create-next-app output; make sure a .gitignore inside the folder excludes node_modules and .next)
2. chore(15-perspective-tunnel-hero): initialize shadcn (components.json, lib/utils.ts, theme tokens). Afterwards run `npm ls tailwindcss` and note the version.
3. chore(15-perspective-tunnel-hero): add framer-motion dependency (commit package.json and the lockfile)
4. chore(15-perspective-tunnel-hero): run dev server on port 3015 (change the "dev" script to "next dev -p 3015")
5. chore(15-perspective-tunnel-hero): add .editorconfig (utf-8, lf, final newline, 2-space indent by default, plus a section for components/ui/perspective-tunnel-hero.tsx and components/perspective-tunnel-hero-demo.tsx that sets indent_size = 4, because those vendored files use 4-space indentation)
6. style(15-perspective-tunnel-hero): reset body margin in globals.css while keeping shadcn theme tokens (no overflow or height rules on html/body)
7. feat(15-perspective-tunnel-hero): add perspective tunnel hero component (components/ui/perspective-tunnel-hero.tsx, VERBATIM)
8. feat(15-perspective-tunnel-hero): add tunnel hero demo (components/perspective-tunnel-hero-demo.tsx, VERBATIM)
9. feat(15-perspective-tunnel-hero): render the hero full screen on the home page (app/page.tsx, see PAGE below)
10. chore(15-perspective-tunnel-hero): set page title and description metadata in app/layout.tsx
11. chore(15-perspective-tunnel-hero): replace default favicon with a simple SVG icon (app/icon.svg)
12. chore(15-perspective-tunnel-hero): add typecheck script to package.json (tsc --noEmit)
13. chore(15-perspective-tunnel-hero): declare supported Node version in package.json "engines" and add an .nvmrc
14. chore(15-perspective-tunnel-hero): add .prettierignore so formatters leave the two vendored files alone (list components/ui/perspective-tunnel-hero.tsx and components/perspective-tunnel-hero-demo.tsx)
15. chore(15-perspective-tunnel-hero): adjust eslint config for the vendored component file (only the rules it actually trips; if nothing trips, add a short comment block to eslint.config.mjs documenting that components/ui files are vendored and left verbatim)
16. docs(15-perspective-tunnel-hero): add README overview, install and run steps
17. docs(15-perspective-tunnel-hero): explain the camera, depth and card maths, and the controls and limitations, in README
18. docs(15-perspective-tunnel-hero): document images, accessibility, troubleshooting and the Deviations section in README
19. docs(15-perspective-tunnel-hero): store the original prompt and spec in PROMPT.md
20. docs: add 15-perspective-tunnel-hero to the root README index (folder, name, stack, run command, port 3015)
If dead image URLs force the one permitted edit to the component (see IMAGES), that is one ADDITIONAL real commit placed right before step 7's commit is made, so the component is still committed whole in a single commit (that is, fix the URLs in the file first, then commit it once). If verification (below) finds anything that needs fixing, make those fixes as additional commits after step 20.

FOLDER: 15-perspective-tunnel-hero
- create-next-app (TypeScript, Tailwind, ESLint, App Router, src dir OFF, alias "@/*"), then `npx shadcn@latest init` so components.json, lib/utils.ts and the "@/components/ui" convention exist. Keep the default shadcn CSS variables in globals.css. Explain in the folder README why components/ui matters.
- npm install framer-motion (latest). The component imports from "framer-motion" (not "motion/react"), so install exactly the `framer-motion` package. After install run `npm ls framer-motion react` and confirm the version is compatible with the installed React; if npm reports a peer conflict, resolve it with a compatible framer-motion version, never --force.
- package.json: "dev": "next dev -p 3015".

FILES
1. components/ui/perspective-tunnel-hero.tsx = the perspective-tunnel-hero.tsx block from the SPEC below, VERBATIM. It is indented with 4 spaces: keep every space exactly as written. Do not rewrite, reformat, rename, "fix" or refactor anything, and do NOT run prettier or eslint --fix on it. It already starts with "use client". (Only exception: the image URL edit described in IMAGES, if and only if some URLs are dead.)
2. components/perspective-tunnel-hero-demo.tsx = the demo.tsx block from the SPEC, VERBATIM (it imports the component under the local name CurtainSplitHero; that is fine, leave it). Its default export is named DemoOne. This file is kept in the project but NOT used by the page (see PAGE).
3. globals.css: keep what shadcn init generated. Make sure body margin is 0. Do not add overflow or height rules to html or body.

PAGE
The component is `relative h-[100svh] w-screen` and reads window.innerWidth and window.innerHeight to place its cards, and it captures the mouse wheel on its own element. The verbatim demo wraps it in a `max-w-3xl` padded box, which would make the 100vw-wide component overflow that box, add a horizontal scrollbar and sit off-centre. Therefore app/page.tsx must render the component directly, full screen, with NO wrapper element:
     import PerspectiveTunnelHero from "@/components/ui/perspective-tunnel-hero";
     export default function Home() {
       return <PerspectiveTunnelHero />;
     }
Record this under "Deviations from the original spec" in the README (the demo file is shipped but unused, because it would constrain a full-viewport hero). Do not edit the demo.

IMAGES
The component hardcodes a const IMAGES array of nine cdn.21st.dev JPEG URLs (titles Chroma I, Prism III, Ether IV, Quantum V, Nebula VI, Cyber VII, Flux VIII, Aether IX, Chroma X). They are plain <img> tags (no crossOrigin), so no CORS check is needed. For each of the nine URLs run `curl -sI "<url>"` and expect HTTP 200 and a content-type starting with image/.
- If ALL NINE return 200, leave the file untouched.
- If ANY fail: this is the ONE permitted edit to the vendored component (there is no prop to override these images). Replace ONLY the `src` string of each failing entry with an Unsplash image URL you have verified returns HTTP 200 and an image content-type, in the form https://images.unsplash.com/photo-<verified-id>?auto=format&fit=crop&w=800&h=1000&q=80. Choose abstract, colourful art photos (gradients, light leaks, paint, neon, prisms) that suit the titles and a 4:5 crop. Keep every `title` and every other character of the file unchanged. Do this BEFORE committing the component, so it is still committed whole in one commit. Record every replaced entry (title, old URL, new URL, reason) under Deviations and Troubleshooting in the README. Never invent or guess an ID you did not verify. If a replacement cannot be verified for some entry, leave that entry as it is (the card will simply show an empty frame) and say so in the report.

VERBATIM CHECK (run and report the output)
- `wc -l` on both saved files (the component is roughly 270 lines, the demo roughly 15 lines).
- grep confirms in the component: "export default function PerspectiveTunnelHero", "const IMAGES = [", "const TUNNEL_CARDS", "const SPRING_CONFIG", "function useCameraParallax(", "function TunnelCard(", 'from "framer-motion"'. In the demo: "export default function DemoOne" and "CurtainSplitHero". If any check fails, the paste was truncated: re-save from the spec.

BUILD / LINT
Run npm run build. If ESLint errors come from the vendored file (for example react-hooks rules, @next/next/no-img-element, unused vars), do NOT edit it: disable only the offending rules for that one file in eslint.config.mjs with a comment (this is commit 15). If TypeScript errors come from it (for example the tuple typing of the useTransform callback in newer framer-motion versions), do NOT edit it: as a last resort set `typescript: { ignoreBuildErrors: true }` in next.config. Record every workaround with the exact error text under "Deviations from the original spec". Fix errors in files you wrote normally. Do not disable React Strict Mode.

VERIFICATION
I have no browser here, so skip screenshots. Run npm run build, start npm run dev, and confirm HTTP 200 on http://localhost:3015. State plainly in the final report that visuals and interaction were NOT verified. Do not claim that the tunnel flight, the wheel scrubbing, the mouse parallax or the card hover look or work correctly.

DOCS (content for commits 16 to 18)
- 15-perspective-tunnel-hero/README.md, written in the sections described by commits 16 to 18:
  * Overview: what it demonstrates (a full-screen hero where nine image cards float in a 3D tunnel; scrolling the mouse wheel or trackpad flies the camera forward through the corridor: cards approach from far away, grow, and fade out as they pass; the big "INTO THE ETHER." title scales and fades with progress; moving the mouse pans the camera slightly); install, run, URL/port 3015.
  * How it works: cards are placed on a golden-angle spiral (137.5 degrees per card) with per-card radius factors and alternating slight Z rotations; progress is a 0 to 1 motion value driven only by the wheel (delta * 0.0008, clamped) and smoothed with a spring (stiffness 80, damping 30); each card has its own staggered window of that progress (stagger span 0.55), mapped to a Z depth from far (-1700, or -1200 on mobile) to near (+500, or +350 on mobile), with opacity fading in at the start and out at the end; card width and offsets scale with the viewport; the parent uses CSS perspective (1200px, 900px on mobile) with preserve-3d; mouse position feeds a spring-smoothed parallax pan (45px, 20px on mobile); the title scales 0.7 to 1.35 and fades; the "Scroll to Explore" prompt fades out after the first bit of travel; wheel events are captured on the hero element with preventDefault, so the page does not scroll while the pointer is over it; prefers-reduced-motion disables the mouse parallax.
  * Controls and limitations: the wheel or trackpad is the only way to move through the tunnel (there is no touch or keyboard control in the original component, so phones and keyboard-only users cannot scrub it; document this plainly as a limitation); the component has no props; its images are a hardcoded array; light and dark styles use Tailwind's dark: variant, which under shadcn's Tailwind v4 setup applies only when an ancestor has the `dark` class, so the default look is the light theme.
  * Images, accessibility, troubleshooting, deviations: where the nine images come from (cdn.21st.dev) and whether any were replaced (and why); accessibility notes (each card image has alt text from its title; the section has no landmark or heading structure beyond the h1; wheel capture prevents page scroll, which may surprise users, and there is no keyboard alternative); troubleshooting (cards missing means image URLs failed, check the network tab; horizontal scrollbar means the component was wrapped in a narrower container, render it directly as page.tsx does; cards look flat or not 3D means a parent removed perspective or preserve-3d, which the component sets on its own root); Deviations from the original spec: app/page.tsx renders the component directly instead of the demo (always listed), any image replacements, plus every lint or TypeScript workaround with exact error text. Never write "None".
- 15-perspective-tunnel-hero/PROMPT.md = this ENTIRE message including the spec below, verbatim.
- Root README index row for 15 (folder, name, stack, run command, port 3015).

PUSH
After all commits are made, push to main once. If push auth is needed, stop and tell me. Final report: raw output of `git log --format="%h %an <%ae> %s" -n 30` and `git push`, the folder tree (2 levels), `npm ls framer-motion react tailwindcss`, the verbatim-check output, the nine image-check results and whether any were replaced, and the verification results.

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
perspective-tunnel-hero.tsx
"use client";

import {
    motion,
    useTransform,
    useReducedMotion,
    useMotionValue,
    useSpring,
    MotionValue,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

const IMAGES = [
    { src: "https://cdn.21st.dev/assets/mirror/c3/c3fbd2afa140223999a441b32ed986f61d473930002708df805a81532a326aac.jpg", title: "Chroma I" },
    { src: "https://cdn.21st.dev/assets/mirror/9d/9d8b2f675a5814476ada3736ce439bcda23c5c389e0ebf9b25d8a0c09f3bbcfe.jpg", title: "Prism III" },
    { src: "https://cdn.21st.dev/assets/mirror/8b/8bb738bf2f00d7f7ed3c3ec034adb9938ad38f4be4ac191d632a6a11ad525574.jpg", title: "Ether IV" },
    { src: "https://cdn.21st.dev/assets/mirror/ac/ac5ac700b188d7ef16ee9dab868098b59f15c440db3f71d4e8c03262a3287577.jpg", title: "Quantum V" },
    { src: "https://cdn.21st.dev/assets/mirror/ef/ef25eff6ce655fba459b3b7e7711524dc92499aa18f6c7dbea9a0fcc56a8f908.jpg", title: "Nebula VI" },
    { src: "https://cdn.21st.dev/assets/mirror/f2/f28b370a5dcbf76240f1504579c4b05fc0ff0bb990a42aff8dc2f73a5dc46072.jpg", title: "Cyber VII" },
    { src: "https://cdn.21st.dev/assets/mirror/f2/f26a1eac85704dda924820392dedfb72d51d8261d35354f83b35d683617295f3.jpg", title: "Flux VIII" },
    { src: "https://cdn.21st.dev/assets/mirror/77/7755d23eaaa0aa5b403343f44afa7a29b2d06d3065fe54c602b14ba01d00f2aa.jpg", title: "Aether IX" },
    { src: "https://cdn.21st.dev/assets/mirror/65/657317761fe9058a1d43711b13c543a71eb5199b7a5d9abf4c28479674e39cf7.jpg", title: "Chroma X" },
];


interface TunnelCardData {
    item: { src: string; title: string };
    angleCos: number;
    angleSin: number;
    radiusFactorX: number;
    radiusFactorY: number;
    rotationZ: number;
    index: number;
}

const TUNNEL_CARDS: TunnelCardData[] = IMAGES.map((item, i) => {
    const goldenAngle = i * 137.5 * (Math.PI / 180);
    const radiusFactorX = 0.28 + (i % 3) * 0.08;
    const radiusFactorY = 0.26 + (i % 2) * 0.09;

    return {
        item,
        angleCos: Math.cos(goldenAngle),
        angleSin: Math.sin(goldenAngle),
        radiusFactorX,
        radiusFactorY,
        rotationZ: (i % 2 === 0 ? 1 : -1) * (3 + (i % 5) * 2),
        index: i,
    };
});

const SPRING_CONFIG = { stiffness: 60, damping: 25, mass: 0.5 };

interface StageDimensions {
    width: number;
    height: number;
    isMobile: boolean;
}

function useCameraParallax(enabled: boolean) {
    const rawX = useMotionValue(0);
    const rawY = useMotionValue(0);
    const x = useSpring(rawX, SPRING_CONFIG);
    const y = useSpring(rawY, SPRING_CONFIG);

    useEffect(() => {
        if (!enabled) return;
        const onMove = (e: PointerEvent) => {
            rawX.set((e.clientX / window.innerWidth - 0.5) * 2);
            rawY.set((e.clientY / window.innerHeight - 0.5) * 2);
        };
        window.addEventListener("pointermove", onMove, { passive: true });
        return () => window.removeEventListener("pointermove", onMove);
    }, [enabled, rawX, rawY]);

    return { x, y };
}

interface TunnelCardProps {
    card: TunnelCardData;
    progress: MotionValue<number>;
    pointer: { x: MotionValue<number>; y: MotionValue<number> };
    total: number;
    stage: StageDimensions;
}

function TunnelCard({ card, progress, pointer, total, stage }: TunnelCardProps) {
    const staggerSpan = 0.55;
    const start = (card.index / total) * (1 - staggerSpan);
    const end = start + staggerSpan;

    const localProgress = useTransform(progress, [start, end], [0, 1]);

    const farZ = stage.isMobile ? -1200 : -1700;
    const nearZ = stage.isMobile ? 350 : 500;
    const z = useTransform(localProgress, [0, 1], [farZ, nearZ]);

    const opacity = useTransform(localProgress, [0, 0.18, 0.82, 0.98], [0, 1, 1, 0]);

    const cardWidth = stage.isMobile
        ? Math.max(130, Math.min(180, stage.width * 0.38))
        : Math.max(180, Math.min(270, stage.width * 0.18));

    const baseX = card.angleCos * (stage.width * card.radiusFactorX);
    const baseY = card.angleSin * (stage.height * card.radiusFactorY);
    const panStrength = stage.isMobile ? 20 : 45;

    const transform = useTransform(
        [z, pointer.x, pointer.y],
        ([currZ, px, py]: number[]) => {
            const offsetX = baseX - px * panStrength;
            const offsetY = baseY - py * panStrength;
            return `translate3d(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px), ${currZ}px) rotateZ(${card.rotationZ}deg)`;
        }
    );

    return (
        <motion.div
            style={{
                width: cardWidth,
                transform,
                opacity,
                zIndex: card.index + 1,
            }}
            className="pointer-events-auto absolute left-1/2 top-1/2 aspect-[4/5] will-change-transform select-none cursor-pointer"
        >
            <div className="group relative h-full w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-2xl shadow-neutral-950/20 dark:shadow-black/90 ring-1 ring-black/10 dark:ring-white/15 transition-all duration-500 hover:ring-indigo-500/70 dark:hover:ring-indigo-400/70 hover:shadow-indigo-500/25">
                <img
                    src={card.item.src}
                    alt={card.item.title}
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex items-end p-4 sm:p-5">
                    <span className="text-xs sm:text-sm font-mono tracking-widest uppercase text-white/95 drop-shadow-md">
                        {card.item.title}
                    </span>
                </div>
            </div>
        </motion.div>
    );
}

export default function PerspectiveTunnelHero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();

    const [stage, setStage] = useState<StageDimensions>({
        width: 1440,
        height: 900,
        isMobile: false,
    });

    useEffect(() => {
        const updateDimensions = () => {
            setStage({
                width: window.innerWidth,
                height: window.innerHeight,
                isMobile: window.innerWidth < 768,
            });
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, []);

    // Raw motion value controlled directly by mouse wheel / touch trackpad
    const rawProgress = useMotionValue(0);
    const smoothProgress = useSpring(rawProgress, {
        stiffness: 80,
        damping: 30,
        restDelta: 0.0001,
    });

    // Handle wheel scrolling locally inside the 100vh viewport container without page scroll
    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;

        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
            const current = rawProgress.get();
            const delta = e.deltaY * 0.0008; // Adjust speed of tunnel travel here
            const next = Math.min(1, Math.max(0, current + delta));
            rawProgress.set(next);
        };

        el.addEventListener("wheel", handleWheel, { passive: false });
        return () => el.removeEventListener("wheel", handleWheel);
    }, [rawProgress]);

    const pointer = useCameraParallax(!reduce);

    const titleScale = useTransform(smoothProgress, [0, 0.5, 1], [0.7, 1, 1.35]);
    const titleOpacity = useTransform(smoothProgress, [0, 0.12, 0.85, 1], [0.25, 1, 1, 0]);
    const promptOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);

    return (
        <div
            ref={containerRef}
            className="relative h-[100svh] w-screen overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white select-none flex items-center justify-center"
            style={{
                perspective: stage.isMobile ? "900px" : "1200px",
                transformStyle: "preserve-3d",
            }}
        >
            {/* Immersive Background Grid & Glow */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] dark:bg-[radial-gradient(#1e1b4b_1px,transparent_1px)] [background-size:28px_28px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)] opacity-70 dark:opacity-65" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.15)_0%,transparent_70%)] dark:bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.2)_0%,transparent_75%)]" />

            {/* Depth Ring Guides */}
            <div className="pointer-events-none absolute h-[48vmin] w-[48vmin] rounded-full border border-indigo-500/15 dark:border-indigo-400/10" />
            <div className="pointer-events-none absolute h-[76vmin] w-[76vmin] rounded-full border border-dashed border-neutral-300/60 dark:border-white/10" />

            {/* Central Anchor Typography */}
            <motion.div
                style={{ scale: titleScale, opacity: titleOpacity }}
                className="pointer-events-none z-0 flex flex-col items-center text-center px-6 max-w-xl"
            >
                <p className="text-xs font-mono uppercase tracking-[0.4em] text-indigo-600 dark:text-indigo-400 mb-4">
                    Warp Drive Sequence
                </p>
                <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold tracking-tighter leading-[0.9] bg-gradient-to-b from-neutral-950 via-neutral-800 to-neutral-400 dark:from-white dark:via-white dark:to-white/40 bg-clip-text text-transparent">
                    INTO THE
                    <br />
                    ETHER.
                </h1>
                <p className="mt-4 max-w-[36ch] text-sm sm:text-base font-light text-neutral-600 dark:text-neutral-400">
                    Scroll your trackpad or mouse wheel to fly through the spatial 3D corridor.
                </p>
            </motion.div>

            {/* Scroll Prompt */}
            <motion.div
                style={{ opacity: promptOpacity }}
                className="pointer-events-none absolute bottom-8 z-20 flex flex-col items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-neutral-500 dark:text-neutral-400"
            >
                <span>Scroll to Explore</span>
                <div className="h-6 w-px bg-gradient-to-b from-indigo-500 to-transparent" />
            </motion.div>

            {/* 3D Z-Space Plane */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ transformStyle: "preserve-3d" }}
            >
                {TUNNEL_CARDS.map((card, i) => (
                    <TunnelCard
                        key={i}
                        card={card}
                        progress={smoothProgress}
                        pointer={pointer}
                        total={TUNNEL_CARDS.length}
                        stage={stage}
                    />
                ))}
            </div>
        </div>
    );
}

demo.tsx
// This is a file with a demo for your component
// That's what users will see in the preview
// Create new files in this directory to add more demos

import CurtainSplitHero from "@/components/ui/perspective-tunnel-hero";

export default function DemoOne() {
    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-stone-100 dark:bg-stone-950 p-4 sm:p-6 md:p-8 transition-colors duration-300">
            <div className="w-full max-w-3xl">
                <CurtainSplitHero />
            </div>
        </main>
    );
}
```

Install NPM dependencies:
```bash
framer-motion
```

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
