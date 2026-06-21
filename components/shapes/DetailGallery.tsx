'use client'
// components/shapes/DetailGallery.tsx — image gallery for the detail view.
// Zeigt echte Fotos, wenn `photos` übergeben werden; sonst Platzhalter (by category).
import { useState } from 'react'
import { Photo, TagLabel } from '@/components/shapes/primitives'

type GalleryPhoto = { url: string; alt?: string }

export function DetailGallery({
  cat,
  tag,
  name,
  count = 4,
  photos,
}: {
  cat: string
  tag: string
  name: string
  count?: number
  photos?: GalleryPhoto[]
}) {
  const [active, setActive] = useState(0)
  const hasReal = !!photos && photos.length > 0
  const slots = hasReal ? photos!.map((_, i) => i) : Array.from({ length: count }, (_, i) => i)
  const cur = Math.min(active, slots.length - 1)

  const fill = { position: 'absolute' as const, inset: 0, width: '100%', height: '100%', objectFit: 'cover' as const }

  return (
    <div className="gallery">
      <div className="gallery-main">
        {hasReal ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photos![cur].url} alt={photos![cur].alt || name} style={fill} />
        ) : (
          <Photo cat={cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={name.length + cur * 3 + 5} />
        )}
        <div className="gallery-pill">
          <TagLabel tag={tag} />
        </div>
      </div>
      <div className="gallery-thumbs">
        {slots.map((i) => (
          <button
            key={i}
            className={`gallery-thumb${i === cur ? ' on' : ''}`}
            onClick={() => setActive(i)}
            aria-label={`Bild ${i + 1} von ${slots.length}`}
            aria-pressed={i === cur}
          >
            {hasReal ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photos![i].url} alt="" style={fill} />
            ) : (
              <Photo cat={cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={name.length + i * 3 + 5} />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}
