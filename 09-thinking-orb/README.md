# 09 — AI Thinking Orb

> A morphing orb UI that signals AI reasoning through motion and shape.

## Demo

```
npm install
npm run dev
# → http://localhost:3009
```

Type a prompt in the input field and press **Enter** or click **Send**.

- The pill collapses to a **pulsing glowing sphere** while the AI thinks.
- When the response is ready it **expands into a card** with a green flash.
- Type `error` to trigger the error state (red shake flash).

## Features

| Feature | Detail |
|---|---|
| Morphing shape | Pill → ball → card via spring-animated CSS custom properties |
| Aurora blobs | Four slow-drifting ellipses with `filter: blur` |
| Conic-gradient ring | Rotates via `@property --angle` + `animation` |
| Thinking dots | Three bouncing dots with staggered `animation-delay` |
| Green success flash | Brief scale + radial-gradient overlay before card expands |
| Shimmer text | `background-clip: text` shimmer on fresh response text |
| Input row | Fades out while orb is thinking / in card state |
| Error state | Red `box-shadow` ring + CSS shake keyframe |
