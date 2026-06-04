// components/RandomAusflug.tsx
'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { locations, CATEGORY_COLOR, COST_LABEL, DURATION_LABEL } from '@/lib/locations'

export default function RandomAusflug() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * locations.length))
  const loc = locations[idx]
  const color = CATEGORY_COLOR[loc.category] ?? '#1a1a1a'

  function roll() {
    let next = Math.floor(Math.random() * locations.length)
    while (next === idx && locations.length > 1) {
      next = Math.floor(Math.random() * locations.length)
    }
    setIdx(next)
  }

  return (
    <section className="border-t-2 border-ink bg-ink/5">
      <div className="max-w-6xl mx-auto px-6 py-24">

        <div className="text-center mb-12 space-y-3">
          <p className="label">Du weißt nicht was du willst?</p>
          <h2 className="text-4xl font-bold" style={{ fontFamily: 'var(--font-courier)' }}>
            Lass dich überraschen
          </h2>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="lofi-card overflow-hidden">

            {/* Image */}
            <div className="relative h-56 border-b-2 border-ink overflow-hidden">
              <Image
                src={loc.images[0]}
                alt={loc.name}
                fill
                className="object-cover"
                style={{ filter: 'saturate(0.85) sepia(0.08)' }}
              />
              {/* Category badge */}
              <div
                className="absolute top-4 left-4 px-3 py-1 border border-ink text-xs font-bold tracking-widest uppercase"
                style={{
                  backgroundColor: color,
                  color: '#F5EFE8',
                  fontFamily: 'var(--font-source-code)',
                  boxShadow: '2px 2px 0 #1a1a1a',
                }}
              >
                {loc.category}
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <p className="label mb-1">{loc.region}</p>
                <h3 className="text-2xl font-bold" style={{ fontFamily: 'var(--font-courier)' }}>
                  {loc.name}
                </h3>
              </div>

              <p className="text-sm leading-relaxed line-clamp-2" style={{ fontFamily: 'var(--font-lora)' }}>
                {loc.description}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2">
                {[COST_LABEL[loc.cost], DURATION_LABEL[loc.duration]].map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold tracking-widest uppercase px-2 py-1 border border-ink/40"
                    style={{ fontFamily: 'var(--font-source-code)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Link href={`/ort/${loc.id}`} className="lofi-btn flex-1 justify-center text-[10px]">
                  Details ansehen →
                </Link>
                <button
                  onClick={roll}
                  className="lofi-btn lofi-btn-outline px-4"
                  title="Nochmal würfeln"
                >
                  ⚄
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </section>
  )
}
