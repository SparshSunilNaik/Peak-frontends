# 07-morph-gallery

## What It Demonstrates

A **photo gallery whose slides dissolve into each other** through a WebGL noise shader instead of cutting or cross-fading. The incoming frame's bright areas burn through first, giving the transition an organic, tearing effect rather than a flat cross-fade.

## Install and Run

```bash
cd 07-morph-gallery
npm install
npm run dev
```

Open **http://localhost:3007** in your browser.

### Why `components/ui`?

We follow the standard shadcn convention. Components placed in `components/ui` fit naturally into projects initialized with `npx shadcn init`, making them easy to drop into existing codebases.
