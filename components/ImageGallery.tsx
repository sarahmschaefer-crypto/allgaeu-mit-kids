// components/ImageGallery.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'

export default function ImageGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0)

  return (
    <div className="space-y-3">

      {/* Main image */}
      <div className="relative w-full aspect-[16/9] border-2 border-ink overflow-hidden" style={{ boxShadow: '4px 4px 0 #1a1a1a' }}>
        <Image
          src={images[active]}
          alt={`${name} – Bild ${active + 1}`}
          fill
          priority={active === 0}
          className="object-cover transition-opacity duration-300"
          style={{ filter: 'saturate(0.88) sepia(0.07)' }}
        />
        {/* Counter badge */}
        <div
          className="absolute bottom-3 right-3 px-2 py-1 border border-ink text-[10px] font-bold tracking-widest"
          style={{ backgroundColor: '#F5EFE8', fontFamily: 'var(--font-source-code)', boxShadow: '2px 2px 0 #1a1a1a' }}
        >
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative flex-1 aspect-[4/3] border-2 overflow-hidden transition-all duration-150 ${
                i === active ? 'border-ink' : 'border-ink/30 opacity-60 hover:opacity-100'
              }`}
              style={i === active ? { boxShadow: '3px 3px 0 #B49139' } : {}}
            >
              <Image
                src={src}
                alt={`${name} – Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                style={{ filter: 'saturate(0.85) sepia(0.08)' }}
              />
            </button>
          ))}
        </div>
      )}

    </div>
  )
}
