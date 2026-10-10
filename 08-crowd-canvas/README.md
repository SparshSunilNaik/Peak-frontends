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
