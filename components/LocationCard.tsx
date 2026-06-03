// components/LocationCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { type Location, CATEGORY_COLOR, COST_LABEL, DURATION_LABEL } from '@/lib/locations'

export default function LocationCard({ loc }: { loc: Location }) {
  const color = CATEGORY_COLOR[loc.category] ?? '#1a1a1a'

  return (
    <Link href={`/ort/${loc.id}`} className="lofi-card block overflow-hidden group">

      {/* Image */}
      <div className="relative h-44 border-b-2 border-ink overflow-hidden">
        <Image
          src={loc.images[0]}
          alt={loc.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          style={{ filter: 'saturate(0.85) sepia(0.08)' }}
        />
        {/* Category badge */}
        <div
          className="absolute top-3 left-3 px-2 py-1 text-[9px] font-bold tracking-widest uppercase border border-ink"
          style={{
            backgroundColor: color,
            color: '#F5EFE8',
            fontFamily: 'var(--font-source-code)',
            boxShadow: '2px 2px 0 #1a1a1a',
          }}
        >
          {loc.category}
        </div>
        {/* Cost badge */}
        <div
          className="absolute top-3 right-3 px-2 py-1 text-[9px] font-bold tracking-widest uppercase border border-ink bg-paper"
          style={{ fontFamily: 'var(--font-source-code)', boxShadow: '2px 2px 0 #1a1a1a' }}
        >
          {COST_LABEL[loc.cost]}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <p className="label text-ink/50 text-[9px]">{loc.region}</p>
        <h3 className="font-bold text-base leading-tight" style={{ fontFamily: 'var(--font-courier)' }}>
          {loc.name}
        </h3>
        <p className="text-xs text-ink/60 italic line-clamp-2" style={{ fontFamily: 'var(--font-lora)' }}>
          {loc.subline}
        </p>

        {/* Meta row */}
        <div className="flex items-center gap-2 pt-1 flex-wrap">
          <span className="text-[9px] font-bold tracking-wider uppercase border border-ink/30 px-2 py-0.5"
            style={{ fontFamily: 'var(--font-source-code)' }}>
            {DURATION_LABEL[loc.duration]}
          </span>
          {loc.ageGroups.slice(0, 2).map(a => (
            <span key={a} className="text-[9px] font-bold tracking-wider uppercase border border-ink/30 px-2 py-0.5"
              style={{ fontFamily: 'var(--font-source-code)' }}>
              {a} J.
            </span>
          ))}
        </div>
      </div>

    </Link>
  )
}
