TASK: Add frontend #6 to the Peak-frontends repo. Do the whole thing in one go and do NOT ask questions. If something is ambiguous, pick the sensible default and note it in the folder README.

SETUP
- Use the existing clone of https://github.com/SparshSunilNaik/Peak-frontends.git (clone it if missing), then `git pull --rebase` on main. Read root README.md and follow its conventions: NN-kebab-name folder, independent package.json (no monorepo), own README.md + PROMPT.md, localhost only, root index table updated. Match how 01 to 05 were set up. If the root README index has a merge conflict, keep every existing row and add yours.
- Set identity locally: git config user.name "SparshSunilNaik" and git config user.email "ssn7406n@gmail.com". Verify with git config --local --list. Never commit node_modules, .next or .env files.

COMMIT STRATEGY (IMPORTANT)
Work incrementally and commit as you go, in small atomic commits, one logical change each. Make AT LEAST 20 commits for this folder, following the plan below in order. Rules:
- Every commit must contain a real, meaningful change to the repo. No empty commits (never use --allow-empty), no whitespace-only or revert-and-redo churn, no touching the same line back and forth.
- Commit messages must describe what that commit actually changes, in conventional-commit style, scoped like "feat(06-scroll-timeline): ...". Do not use words like "dummy", "filler", "test commit" or "wip".
- Do not backdate commits or set GIT_AUTHOR_DATE / GIT_COMMITTER_DATE. Use real timestamps.
- The two verbatim files (timeline.tsx and the demo) must each be committed whole in a single commit, never split.
- Commit as soon as each step is done, not at the end. Push to main once at the end (all commits in one push).
- If a step turns out to be a no-op (for example nothing needed changing), do not invent a change: fold in the next real step instead and add an extra real commit elsewhere (for example splitting the README further) so the total stays at 20 or more.

COMMIT PLAN (in this order)
1. chore(06-scroll-timeline): scaffold Next.js app with TypeScript and Tailwind (create-next-app output; make sure a .gitignore inside the folder excludes node_modules and .next)
2. chore(06-scroll-timeline): initialize shadcn (components.json, lib/utils.ts, theme tokens)
3. chore(06-scroll-timeline): add gsap dependency (confirm version >= 3.13 with `npm ls gsap`; commit package.json and the lockfile)
4. chore(06-scroll-timeline): run dev server on port 3006 (change the "dev" script to "next dev -p 3006")
5. style(06-scroll-timeline): reset body margin in globals.css while keeping shadcn theme tokens (no overflow or height rules on html/body)
6. feat(06-scroll-timeline): add scroll-pinned timeline component (components/ui/timeline.tsx, VERBATIM)
7. feat(06-scroll-timeline): add timeline demo (components/timeline-demo.tsx, VERBATIM)
8. feat(06-scroll-timeline): render demo on the home page (app/page.tsx, no wrapper element)
9. chore(06-scroll-timeline): set page title and description metadata in app/layout.tsx
10. chore(06-scroll-timeline): replace default favicon with a simple SVG icon (app/icon.svg)
11. chore(06-scroll-timeline): add typecheck script to package.json (tsc --noEmit)
12. chore(06-scroll-timeline): declare supported Node version in package.json "engines" and add an .nvmrc
13. chore(06-scroll-timeline): adjust eslint config for the verbatim component files (only if build/lint needs it; otherwise add a short comment block to eslint.config.mjs documenting that components/ui files are vendored and left verbatim)
14. docs(06-scroll-timeline): add README overview and what the demo shows
15. docs(06-scroll-timeline): document install and run steps in README
16. docs(06-scroll-timeline): document TimelineProps with defaults in README
17. docs(06-scroll-timeline): document reduced-motion behavior and gsap >= 3.13 requirement in README
18. docs(06-scroll-timeline): add troubleshooting section to README (sticky pinning needs no overflow on ancestors, gsap version, internet needed for the header image) and the Deviations section
19. docs(06-scroll-timeline): store original prompt and spec in PROMPT.md
20. docs: add 06-scroll-timeline to the root README index (folder, name, stack, run command, port 3006)
If verification (below) finds anything that needs fixing, make those fixes as additional commits after step 20.

FOLDER: 06-scroll-timeline
- create-next-app (TypeScript, Tailwind, ESLint, App Router, src dir OFF, alias "@/*"), then `npx shadcn@latest init` so components.json, lib/utils.ts and the "@/components/ui" convention exist. The demo uses shadcn theme tokens (bg-background, text-foreground, text-muted-foreground), so keep the default CSS variables that shadcn init writes into globals.css. Explain in the folder README why components/ui matters.
- npm install gsap (latest). IMPORTANT: the component imports `gsap/SplitText` and `gsap/ScrollTrigger` and uses SplitText's `mask: "lines"` option. These ship inside the main `gsap` package only from version 3.13 onward (all GSAP plugins became free then). After installing, run `npm ls gsap` and confirm the version is >= 3.13, and confirm `node_modules/gsap/SplitText.js` exists. If the version is lower, install gsap@latest. Do NOT install the private @gsap/shockingly package.
- package.json: "dev": "next dev -p 3006".

FILES (exact, do not improvise)
1. components/ui/timeline.tsx = the timeline.tsx block from the SPEC below, VERBATIM. Do not rewrite, reformat, rename, "fix" or refactor anything. Do NOT run prettier or eslint --fix on it. Leave the typo class "tranlate-y-[-50%]" exactly as written.
2. components/timeline-demo.tsx = the demo.tsx block from the SPEC, VERBATIM.
3. app/page.tsx renders the demo directly with NO wrapper element (import from "@/components/timeline-demo"). The component relies on position: sticky and ScrollTrigger scrolling, so no ancestor may have overflow hidden/auto or a fixed height.
4. globals.css: keep what shadcn init generated. Make sure body margin is 0. Do NOT add overflow or height rules to html or body (that breaks sticky pinning).

IMAGE
The demo loads one image from cdn.21st.dev. curl -sI the URL (expect HTTP 200). If it fails, replace ONLY the `imageUrl` value in components/timeline-demo.tsx with an Unsplash URL you have confirmed returns HTTP 200 (https://images.unsplash.com/photo-<id>?w=1200&h=900&q=85&auto=format&fit=crop), and record the swap under "Deviations from the original spec" in the folder README. Do not edit the component's default prop value. (If you must swap the URL, do it BEFORE committing step 7, so the demo is still committed whole in one commit.)

VERBATIM CHECK (run and report the output)
- `wc -l` on both saved files (component is roughly 450 lines, demo roughly 50).
- grep confirms in the component: "function useGSAP(", "const allJourneyItems", "export default function Timeline", "tranlate-y-[-50%]", and in the demo: "export default function TimelineDemo". If any check fails, the paste was truncated: re-save from the spec.

BUILD / LINT
Run npm run build. If ESLint errors come from the verbatim files (react-hooks rules, @next/next/no-img-element, unused vars), do NOT edit those files: disable only the offending rules for those files in eslint.config.mjs with a comment (this is commit 13). If TypeScript errors come from the verbatim files, do NOT edit them: as a last resort set `typescript: { ignoreBuildErrors: true }` in next.config. Record every workaround with the exact error text under "Deviations from the original spec". Fix errors in files you wrote normally.

VERIFICATION
I have no browser here, so skip screenshots. Run npm run build, start npm run dev, and confirm HTTP 200 on http://localhost:3006. State plainly in the final report that visuals and scroll behavior were NOT verified. Do not claim the pinned horizontal scroll or text reveals work visually.

DOCS (content for commits 14 to 19)
- 06-scroll-timeline/README.md, written in the sections described by commits 14 to 18: what it demonstrates (a scroll-pinned horizontal timeline: GSAP ScrollTrigger scrubs the track sideways, stems and dots draw in, and SplitText line-masks reveal each milestone); how to use it (scroll down past the intro screen); install, run, URL/port 3006; the TimelineProps table (title, periodLabel, textColor, mutedTextColor, activeColor, backgroundColor, imageUrl, imageAlt, duration, scrollDuration) with defaults; the prefers-reduced-motion behavior (everything is shown immediately); the gsap >= 3.13 requirement; the internet requirement (header image loads from a CDN); troubleshooting; and the Deviations section (write "None" if there are none).
- 06-scroll-timeline/PROMPT.md = this ENTIRE message including the spec below, verbatim.
- Root README index row for 06 (folder, name, stack, run command, port 3006).

PUSH
After all commits are made, push to main once. If push auth is needed, stop and tell me. Final report: raw output of `git log --format="%h %an <%ae> %s" -n 30` and `git push`, `npm ls gsap` output, the folder tree (2 levels), the verbatim-check output, and the verification results.

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
```tsx
timeline.tsx
// Built using Hyperiux Vault: https://vault.hyperiux.com
"use client";

import {
  type CSSProperties,
  useLayoutEffect,
  useRef,
  useSyncExternalStore,
} from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
}

/* Inline stand-in for @gsap/react's useGSAP. Mirrors its default
   `revertOnUpdate: false`: one gsap.context lives for the component's
   lifetime, the callback is re-added when dependencies change, and the
   context is reverted only on unmount. A callback may return its own
   cleanup, which runs before the next re-add and on unmount. */
function useGSAP(
  callback: () => void | (() => void),
  options?: {
    dependencies?: unknown[];
    scope?: { current: Element | null } | Element | null;
  }
) {
  const deps = options?.dependencies ?? [];
  const scope = options?.scope;
  const ctxRef = useRef<gsap.Context | null>(null);
  const cleanupRef = useRef<(() => void) | undefined>(undefined);

  useLayoutEffect(() => {
    const el =
      scope && typeof scope === "object" && "current" in scope
        ? scope.current
        : (scope as Element | null);
    ctxRef.current = gsap.context(() => {}, el ?? undefined);
    return () => {
      cleanupRef.current?.();
      cleanupRef.current = undefined;
      ctxRef.current?.revert();
      ctxRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useLayoutEffect(() => {
    if (!ctxRef.current) return;
    cleanupRef.current?.();
    const ret = ctxRef.current.add(callback);
    cleanupRef.current = typeof ret === "function" ? ret : undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

const monthOrder = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
} as const;

type Month = keyof typeof monthOrder;

type JourneyItem = {
  id: string;
  year: string;
  month: Month;
  content: string;
};

type SplitTextInstance = InstanceType<typeof SplitText>;

export type TimelineProps = {
  title?: string;
  periodLabel?: string;
  textColor?: string;
  mutedTextColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  imageUrl?: string;
  imageAlt?: string;
  /** Reveal animation duration, in seconds. */
  duration?: number;
  /** Fallback reveal duration when `duration` is omitted, in seconds. */
  scrollDuration?: number;
};

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToReducedMotion(callback: () => void) {
  if (typeof window === "undefined") return () => {};

  const mediaQueryList = window.matchMedia(REDUCED_MOTION_QUERY);
  mediaQueryList.addEventListener("change", callback);

  return () => mediaQueryList.removeEventListener("change", callback);
}

function getReducedMotionSnapshot() {
  if (typeof window === "undefined") return false;

  return window.matchMedia?.(REDUCED_MOTION_QUERY)?.matches ?? false;
}

function getServerReducedMotionSnapshot() {
  return false;
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    getReducedMotionSnapshot,
    getServerReducedMotionSnapshot,
  );
}

const topJourneyData: JourneyItem[] = [
  {
    id: "2020-march",
    year: "2020",
    month: "March",
    content: "Signal research turns scattered notes into a clear product thesis",
  },
  {
    id: "2021-july",
    year: "2021",
    month: "July",
    content: "Founding release ships with the first live customer journeys",
  },
  {
    id: "2023-april",
    year: "2023",
    month: "April",
    content: "Automation layer connects insight, publishing, and sales motion",
  },
  {
    id: "2026-may",
    year: "2026",
    month: "May",
    content: "New markets open with localized launches and faster onboarding",
  },
];

const bottomJourneyData: JourneyItem[] = [
  {
    id: "2020-november",
    year: "2020",
    month: "November",
    content: "Prototype sprint validates the experience with real operators",
  },
  {
    id: "2022-october",
    year: "2022",
    month: "October",
    content: "Community feedback reshapes the roadmap into sharper releases",
  },
  {
    id: "2025-september",
    year: "2025",
    month: "September",
    content: "Companion mobile workflows make the timeline travel-ready",
  },
];

const allJourneyItems: JourneyItem[] = [
  ...topJourneyData,
  ...bottomJourneyData,
].sort((a, b) => {
  const yearDiff = Number(a.year) - Number(b.year);
  if (yearDiff !== 0) return yearDiff;
  return monthOrder[a.month] - monthOrder[b.month];
});

export default function Timeline({
  title = "Product Storyline",
  periodLabel = "2020-2026",
  textColor = "var(--color-foreground, #000000)",
  mutedTextColor = "var(--color-muted-foreground, #3f3f46)",
  activeColor = "#ff5f00",
  backgroundColor = "var(--color-background, #ffffff)",
  imageUrl = "https://cdn.21st.dev/assets/mirror/b0/b0c41784074f76ac5fb6b447da87780c901135841317a096241371f24bc13ddd.jpg",
  imageAlt = "Modern office workspace",
  duration,
  scrollDuration = 1.2,
}: TimelineProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const wholeSliderRef = useRef<HTMLDivElement>(null);
  const reducedMotion = usePrefersReducedMotion();
  const animationDuration = duration ?? scrollDuration;
  const normalizedDuration = Math.max(0.2, animationDuration);
  const sectionStyle: CSSProperties = {
    color: textColor,
    backgroundColor,
  };
  const activeStyle: CSSProperties = {
    backgroundColor: activeColor,
  };
  const mutedTextStyle: CSSProperties = {
    color: mutedTextColor,
  };

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const isMobile = window.innerWidth < 600;
    const slidePercent = isMobile ? -57 : -65;
    const lineWidth = isMobile ? "65%" : "98%";
    const lineStart = isMobile ? "top 30%" : "top 25%";
    const slideEnd = isMobile ? "82% 50%" : "92% bottom";
    const lineEnd = isMobile ? "80% 50%" : "92% bottom";

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: slideEnd,
        scrub: true,
      },
      defaults: {
        ease: "none",
      },
    });

    tl.fromTo(
      wholeSliderRef.current,
      { xPercent: 0 },
      { xPercent: slidePercent },
    );

    if (reducedMotion) {
      gsap.set(".journey-line", { width: lineWidth });
      return;
    }

    gsap.to(".journey-line", {
      width: lineWidth,
      ease: "none",
      scrollTrigger: {
        trigger: section,
        start: lineStart,
        end: lineEnd,
        scrub: true,
      },
    });
  }, { dependencies: [reducedMotion], scope: sectionRef });

  useGSAP(() => {
    const section = sectionRef.current;

    if (!section) return;

    const items = allJourneyItems;

    if (reducedMotion) {
      items.forEach((item) => {
        gsap.set(`.jl-${item.id}`, { scaleY: 1 });
        gsap.set(`.jd-${item.id}`, { scale: 1 });
        gsap.set(`.title-${item.id}`, { opacity: 1, clearProps: "transform" });
        gsap.set(`.description-${item.id}`, {
          opacity: 1,
          clearProps: "transform",
        });
      });
      return;
    }

    items.forEach((item) => {
      gsap.set(`.jl-${item.id}`, {
        scaleY: 0,
        transformOrigin: "bottom bottom",
      });
      gsap.set(`.jd-${item.id}`, { scale: 0 });
      gsap.set(`.title-${item.id}`, { opacity: 1 });
      gsap.set(`.description-${item.id}`, { opacity: 1 });
    });

    const titleSplits: Partial<Record<string, SplitTextInstance>> = {};
    const descriptionSplits: Partial<Record<string, SplitTextInstance>> = {};

    items.forEach((item) => {
      titleSplits[item.id] = new SplitText(`.title-${item.id}`, {
        type: "chars, words, lines",
        mask: "lines",
      });

      descriptionSplits[item.id] = new SplitText(`.description-${item.id}`, {
        type: "chars, words, lines",
        mask: "lines",
      });
    });

    const createItemTimeline = (
      item: JourneyItem,
      startPos: number,
      endPos: number,
    ) => {
      const lineSelector = `.jl-${item.id}`;
      const dotSelector = `.jd-${item.id}`;
      const titleLines = titleSplits[item.id]?.lines || [];
      const descriptionLines = descriptionSplits[item.id]?.lines || [];

      const isTop = topJourneyData.some((topItem) => topItem.id === item.id);

      if (!isTop) {
        gsap.set(lineSelector, { transformOrigin: "top top" });
      }

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: `${startPos}% 30%`,
          end: `${endPos}% 50%`,
          scrub: true,
        },
      });

      timeline
        .to(lineSelector, {
          scaleY: 1,
          duration: normalizedDuration * 0.4,
        })
        .to(
          dotSelector,
          {
            scale: 1,
            duration: normalizedDuration * 0.4,
          },
          "<",
        )
        .fromTo(
          titleLines,
          { y: 100 },
          {
            y: 0,
            delay: -0.8 * normalizedDuration,
            duration: normalizedDuration,
            stagger: 0.02,
            ease: "power2.out",
          },
        )
        .fromTo(
          descriptionLines,
          { y: 100 },
          {
            y: 0,
            duration: normalizedDuration,
            stagger: 0.02,
            ease: "power2.out",
          },
          "<",
        );

      return timeline;
    };

    const positions: ReadonlyArray<readonly [number, number]> =
      window.innerWidth < 600
        ? [
            [22, 32],
            [28, 38],
            [36, 46],
            [45, 55],
            [52, 62],
            [60, 70],
            [69, 79],
          ]
        : [
            [6, 26],
            [16, 36],
            [26, 46],
            [35, 55],
            [45, 65],
            [55, 75],
            [65, 85],
          ];

    items.forEach((item, index) => {
      const [startPos, endPos] = positions[index];
      createItemTimeline(item, startPos, endPos);
    });

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      Object.values(titleSplits).forEach((split) => split?.revert?.());
      Object.values(descriptionSplits).forEach((split) => split?.revert?.());
      window.removeEventListener("resize", handleResize);
    };
  }, { dependencies: [normalizedDuration, reducedMotion], scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="h-[200vw] max-[600px]:h-[400vh] w-full relative"
      style={sectionStyle}
    >
      <div className="h-screen w-screen sticky top-[0%] pt-[10%] overflow-hidden max-[600px]:top-[5%]">
        <div
          ref={wholeSliderRef}
          className="mr-[2vw] flex h-[30vw] w-[240vw] items-center gap-[5vw] px-[5vw] max-[600px]:h-[80vh] max-[600px]:w-[800vw] max-[600px]:px-[7vw]"
        >
          <div className="h-full w-[30vw] overflow-hidden rounded-[1vw] max-[600px]:h-[65vw] max-[600px]:w-[85vw] max-[600px]:rounded-[5vw]">
            <img
              src={imageUrl}
              alt={imageAlt}
              draggable={false}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="relative h-full w-full">
            <div className="w-full absolute left-0 top-[49%] tranlate-y-[-50%] flex items-center h-fit">
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={activeStyle}
              ></div>
              <div
                className="h-px w-[0%] rounded-full journey-line"
                style={activeStyle}
              ></div>
              <div
                className="h-[.8vw] max-[600px]:h-[2vw] max-[600px]:w-[2vw] w-[.8vw] rounded-full"
                style={activeStyle}
              ></div>
            </div>

            <div className="flex h-1/2 w-full items-center justify-start gap-[.5vw]">
              <div className="h-full w-[20%] pt-[2vw] max-[600px]:h-fit max-[600px]:pt-[5vw]">
                <h2 className="w-[65%]  text-[3vw] leading-[0.95] max-[600px]:text-[8.5vw]">
                  {title}
                </h2>
              </div>

              <div className="w-full flex h-full gap-x-[15vw] max-[600px]:gap-x-[40vw]">
                {topJourneyData.map((item) => (
                  <div
                    key={`top-${item.id}`}
                    className="relative h-full w-[30vw] px-[3vw] max-[600px]:flex max-[600px]:w-[70vw] max-[600px]:flex-col max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-0 top-0 h-full">
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] relative aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`h-[94%] w-px origin-bottom rounded-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="mt-[-1vw] space-y-[1vw] max-[600px]:mt-[-2vw]">
                      <h4
                        className={`title-${item.id}  text-[2.5vw] leading-none max-[600px]:text-[6.4vw]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[600px]:w-[90%] max-[600px]:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-1/2 flex items-center justify-start w-full">
              <div className="w-[34%] pt-[2vw] max-[600px]:pt-[5vw] max-[600px]:w-[30%] h-full">
                <p
                  className=" text-[1.65vw] leading-none max-[600px]:text-[4.2vw]"
                  style={mutedTextStyle}
                >
                  {periodLabel}
                </p>
              </div>

              <div className="w-full flex h-full gap-x-[20vw] ml-[7vw] max-[600px]:gap-x-[40vw] max-[600px]:ml-[7vw]">
                {bottomJourneyData.map((item) => (
                  <div
                    key={`bottom-${item.id}`}
                    className="relative h-full w-[25vw] px-[3vw] max-[600px]:w-[70vw] max-[600px]:px-[7vw]"
                  >
                    <div className="w-full absolute left-0 bottom-[-1%] h-full">
                      <div
                        className={`h-[94%] origin-top w-px rounded-full max-[600px]:h-full jl-${item.id}`}
                        style={activeStyle}
                      ></div>
                      <div
                        className={`size-[1vw] max-[600px]:size-[2.5vw] translate-x-[-50%] relative w-auto aspect-square rounded-full jd-${item.id}`}
                        style={activeStyle}
                      ></div>
                    </div>

                    <div className="flex h-full w-full flex-col justify-end space-y-[1vw]">
                      <h4
                        className={`title-${item.id}  text-[2.5vw] leading-none max-[600px]:text-[6.4vw]`}
                      >
                        {item.year} {item.month}
                      </h4>
                      <p
                        className={`description-${item.id} w-[90%] text-[1.5vw] leading-[1.15] max-[600px]:w-[90%] max-[600px]:text-[4.8vw]`}
                        style={mutedTextStyle}
                      >
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


demo.tsx
"use client";

import Timeline from "@/components/ui/timeline";

const settings = {
  textColor: "var(--color-foreground, #ffffff)",
  mutedTextColor: "var(--color-muted-foreground, #a1a1aa)",
  activeColor: "#ff5f00",
  backgroundColor: "var(--color-background, #0a0a0a)",
  duration: 1.4,
};

export default function TimelineDemo(props: Partial<typeof settings>) {
  const s = { ...settings, ...props };
  return (
    <main className="bg-background text-foreground">
      {/* Lead-in so the pinned timeline has somewhere to scroll in from. */}
      <section className="flex h-screen flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Product roadmap
        </p>
        <h1 className="max-w-[18ch] text-4xl font-semibold leading-tight tracking-tight sm:text-6xl">
          Six years, one horizontal scroll.
        </h1>
        <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
          Keep scrolling — the section pins, the track slides sideways, and each
          milestone draws its stem and reveals its copy as it reaches centre.
        </p>
        <span className="mt-2 animate-bounce text-muted-foreground">&darr;</span>
      </section>

      {/* Realistic usage: custom copy, a branded accent, tuned reveal speed. */}
      <Timeline
        title="Product Storyline"
        periodLabel="2020 — 2026"
        backgroundColor={s.backgroundColor}
        textColor={s.textColor}
        mutedTextColor={s.mutedTextColor}
        activeColor={s.activeColor}
        imageUrl="https://cdn.21st.dev/assets/mirror/b0/b0c41784074f76ac5fb6b447da87780c901135841317a096241371f24bc13ddd.jpg"
        imageAlt="Team at work in a bright studio"
        duration={s.duration}
      />

      <section className="flex h-screen items-center justify-center px-6 text-center text-sm text-muted-foreground">
        From the first research note to a multi-market launch.
      </section>
    </main>
  );
}

```

Install NPM dependencies:
```bash
gsap
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
