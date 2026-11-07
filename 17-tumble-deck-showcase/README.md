# 17. Tumble Deck Showcase

An interactive, scroll-driven showcase featuring a stack of website screenshots standing on edge in 3D space. As you scroll, drag, or press arrow keys, the front card tips forward on its bottom edge hinged on the floor line, lands flat on the ground, the deck slides forward to the line, and the next card tumbles. The sequence loops infinitely in both directions.

Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, shadcn, and core GSAP.

---

## Getting Started

### Prerequisites
- Node.js >= 20
- npm >= 10

### Installation
```bash
npm install
```

### Development Server
Run the local dev server on dedicated port **3017**:
```bash
npm run dev
```
Open [http://localhost:3017](http://localhost:3017) in your browser to view the showcase.

### Production Build & Linting
```bash
npm run typecheck   # Type-check TypeScript with noEmit
npm run lint        # Check ESLint rules
npm run build       # Build optimized production bundle
npm run start       # Start production server on port 3017
```
