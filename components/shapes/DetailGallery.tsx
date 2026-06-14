'use client'
// components/shapes/DetailGallery.tsx — image gallery for the detail view.
// Placeholder images (by category) with a thumbnail strip until real photos land.
import { useState } from 'react'
import { Photo, TagLabel } from '@/components/shapes/primitives'

export function DetailGallery({ cat, tag, name, count = 4 }: { cat: string; tag: string; name: string; count?: number }) {
  const [active, setActive] = useState(0)
  const shots = Array.from({ length: count }, (_, i) => i)
  return (
    <div className="gallery">
      <div className="gallery-main">
        <Photo cat={cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={name.length + active * 3 + 5} />
        <div className="gallery-pill">
          <TagLabel tag={tag} />
        </div>
      </div>
      <div className="gallery-thumbs">
        {shots.map((i) => (
          <button
            key={i}
            className={`gallery-thumb${i === active ? ' on' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Bild ${i + 1} von ${count}`}
            aria-pressed={i === active}
          >
            <Photo cat={cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={name.length + i * 3 + 5} />
          </button>
        ))}
      </div>
    </div>
  )
}
