// components/HeroSection.tsx
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { CATEGORIES } from '@/lib/locations'

// Lo-Fi SVG landscape with 11 category zones placed across the scene
const CATEGORY_ZONES = [
  // [name, x%, y%, label position]
  { name: 'Ausflug',    x: 8,  y: 42, label: 'below' },
  { name: 'Baden',      x: 22, y: 72, label: 'above' },
  { name: 'Sport',      x: 38, y: 30, label: 'below' },
  { name: 'Shop',       x: 52, y: 60, label: 'above' },
  { name: 'Spielplatz', x: 63, y: 48, label: 'below' },
  { name: 'Attraktion', x: 74, y: 35, label: 'below' },
  { name: 'Gastro',     x: 18, y: 55, label: 'above' },
  { name: 'Tierpark',   x: 45, y: 75, label: 'above' },
  { name: 'Kreatives',  x: 85, y: 55, label: 'above' },
  { name: 'Unterkunft', x: 30, y: 44, label: 'below' },
  { name: 'Kultur',     x: 91, y: 38, label: 'below' },
]

function getCategoryColor(name: string) {
  return CATEGORIES.find(c => c.name === name)?.color ?? '#1a1a1a'
}

export default function HeroSection() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <section className="relative w-full overflow-hidden border-b-2 border-ink" style={{ height: 'calc(100vh - 56px)' }}>

      {/* Lo-Fi landscape SVG */}
      <svg
        viewBox="0 0 1000 500"
        preserveAspectRatio="xMidYMid slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden="true"
      >
        {/* Sky */}
        <rect width="1000" height="500" fill="#e8e0d5" />

        {/* Distant mountains */}
        <path d="M0,280 L80,180 L160,230 L260,140 L360,210 L440,160 L540,220 L620,155 L720,200 L820,145 L920,185 L1000,170 L1000,500 L0,500Z" fill="#c8bfb4" />

        {/* Mid mountains */}
        <path d="M0,320 L100,240 L200,290 L320,220 L420,270 L520,230 L640,265 L740,235 L860,260 L1000,240 L1000,500 L0,500Z" fill="#b8ae9f" />

        {/* Forest silhouette */}
        <path d="M0,360 Q50,340 100,360 Q150,340 200,355 Q250,335 300,360 Q350,340 400,358 Q450,338 500,360 Q560,340 610,360 Q660,338 720,358 Q780,340 840,360 Q900,340 960,358 L1000,360 L1000,500 L0,500Z" fill="#8a9e7a" />

        {/* Meadow */}
        <path d="M0,400 Q200,380 400,395 Q600,380 800,395 Q900,388 1000,395 L1000,500 L0,500Z" fill="#a8c890" />

        {/* Water / lake */}
        <ellipse cx="480" cy="430" rx="140" ry="28" fill="#7ab8d4" opacity="0.7" />
        <ellipse cx="480" cy="428" rx="138" ry="22" fill="#8ec8e4" opacity="0.5" />

        {/* Rough sketch lines for texture */}
        <path d="M0,398 Q100,392 200,399 Q300,393 400,397" stroke="#7a9a6a" strokeWidth="1.2" fill="none" opacity="0.5" />
        <path d="M600,396 Q700,390 800,397 Q900,391 1000,396" stroke="#7a9a6a" strokeWidth="1.2" fill="none" opacity="0.5" />

        {/* Small sketch trees */}
        {[60, 140, 220, 320, 580, 680, 780, 880].map((x, i) => (
          <g key={i}>
            <line x1={x} y1="370" x2={x} y2="355" stroke="#4a6a3a" strokeWidth="1.5" strokeLinecap="round" />
            <polygon points={`${x},342 ${x-7},360 ${x+7},360`} fill="#5a7a4a" />
          </g>
        ))}
      </svg>

      {/* Category hotspot pins */}
      {CATEGORY_ZONES.map((zone) => {
        const color = getCategoryColor(zone.name)
        const isHovered = hovered === zone.name
        return (
          <Link
            key={zone.name}
            href={`/entdecken?category=${zone.name}`}
            className="absolute group"
            style={{ left: `${zone.x}%`, top: `${zone.y}%`, transform: 'translate(-50%, -50%)' }}
            onMouseEnter={() => setHovered(zone.name)}
            onMouseLeave={() => setHovered(null)}
          >
            {/* Pin dot */}
            <div
              className="relative w-4 h-4 rounded-full border-2 border-ink transition-all duration-150"
              style={{
                backgroundColor: color,
                boxShadow: isHovered ? `0 0 0 4px ${color}40, 2px 2px 0 #1a1a1a` : '2px 2px 0 #1a1a1a',
                transform: isHovered ? 'scale(1.5)' : 'scale(1)',
              }}
            />

            {/* Label */}
            <div
              className="absolute left-1/2 -translate-x-1/2 whitespace-nowrap pointer-events-none transition-all duration-150"
              style={{
                [zone.label === 'above' ? 'bottom' : 'top']: '120%',
                opacity: isHovered ? 1 : 0,
                transform: `translateX(-50%) translateY(${isHovered ? '0px' : '4px'})`,
              }}
            >
              <span
                className="inline-block px-2 py-1 text-[10px] font-bold tracking-widest uppercase border border-ink"
                style={{
                  backgroundColor: color,
                  color: '#F5EFE8',
                  fontFamily: 'var(--font-source-code)',
                  boxShadow: '2px 2px 0 #1a1a1a',
                }}
              >
                {zone.name}
              </span>
            </div>
          </Link>
        )
      })}

      {/* Centered headline */}
      <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-4 pointer-events-none">
        <p className="label text-ink/60">Allgäu mit Kids</p>
        <h1
          className="text-4xl md:text-6xl font-bold text-center text-ink leading-tight"
          style={{ fontFamily: 'var(--font-courier)', textShadow: '2px 2px 0 #F5EFE8' }}
        >
          Erkunde das Allgäu<br />
          <span style={{ color: '#B49139' }}>mit deiner Familie</span>
        </h1>
        <p className="text-sm text-ink/70 font-[family-name:var(--font-lora)] italic">
          Klick auf eine Kategorie um Ausflugsziele zu entdecken
        </p>
      </div>

    </section>
  )
}
