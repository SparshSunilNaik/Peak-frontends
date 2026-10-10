# Crowd Canvas

A 2D canvas crowd of illustrated people walking left and right across the screen, driven by GSAP timelines and the GSAP ticker, depth-sorted so lower figures draw in front.

## Installation & Running

```bash
cd 08-crowd-canvas
npm install
npm run dev
```

The demo will be available at [http://localhost:3008](http://localhost:3008).

## Props

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `src` | `string` | **Required** | URL to the sprite sheet image. |
| `rows` | `number` | `15` | The number of rows in the sprite sheet. |
| `cols` | `number` | `7` | The number of columns in the sprite sheet. |

### Sprite Sheet Layout

The image is sliced into `rows` x `cols` equal cells, where each cell is one person. The sprite sheet must be laid out in a grid matching these dimensions.

## How it works

Each person gets a GSAP timeline that moves `x` across the stage with a yoyo bob on `y`. Each walker is given a random `timeScale`. The crowd is depth-sorted by `anchorY` every time one respawns so that lower figures draw in front. On window resize, the crowd is rebuilt to match the new canvas size. Note that the sprite sheet is loaded from a CDN and requires internet access.

## Credits & License

- Original component by **Skiper UI** (Author: [@gurvinder-singh02](https://x.com/Gur__vi))
- Inspired by the [codepen by zadvorsky](https://codepen.io/zadvorsky/pen/xxwbBQV)
- Illustrations by [openpeeps.com](https://www.openpeeps.com/)

**License & Usage:**
- Free to use and modify in both personal and commercial projects.
- Attribution to Skiper UI is required when using the free version.
- No attribution required with Skiper UI Pro.
