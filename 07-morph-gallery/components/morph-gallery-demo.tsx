"use client"

import MorphGallery from "@/components/ui/morph-gallery"

const ITEMS = [
  {
    src: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1600&h=1000&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=160&h=100&q=85&auto=format&fit=crop",
    alt: "Sun rays through a forest",
  },
  {
    src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600&h=1000&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=160&h=100&q=85&auto=format&fit=crop",
    alt: "Snow-capped mountain peak at night",
  },
  {
    src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600&h=1000&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=160&h=100&q=85&auto=format&fit=crop",
    alt: "Mountain reflected in a still lake",
  },
  {
    src: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&h=1000&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=160&h=100&q=85&auto=format&fit=crop",
    alt: "Aerial view of green hills",
  },
  {
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=1600&h=1000&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=160&h=100&q=85&auto=format&fit=crop",
    alt: "Sunrise over a meadow",
  },
  {
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600&h=1000&q=85&auto=format&fit=crop",
    thumb: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=160&h=100&q=85&auto=format&fit=crop",
    alt: "Tropical beach with clear water",
  },
]

export default function Demo() {
  // w-full is load-bearing: 21st centres every demo inside a
  // `flex justify-center items-center` wrapper, and a flex item left at
  // width:auto shrinks to fit its contents — which, with a child asking for
  // 100%, resolves to 0px wide.
  return (
    <div className="relative w-full">
      <MorphGallery items={ITEMS} autoplay={4500} />
    </div>
  )
}
