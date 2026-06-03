// app/ort/[id]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ImageGallery from '@/components/ImageGallery'
import DetailMap from '@/components/DetailMap'
import {
  locations, CATEGORY_COLOR, COST_LABEL, DURATION_LABEL,
  PATH_CONDITION_LABEL, type PathCondition
} from '@/lib/locations'

type Props = { params: Promise<{ id: string }> }

export async function generateStaticParams() {
  return locations.map(l => ({ id: String(l.id) }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const loc = locations.find(l => l.id === Number(id))
  if (!loc) return {}
  return {
    title: loc.name,
    description: loc.subline,
  }
}

export default async function DetailPage({ params }: Props) {
  const { id } = await params
  const loc = locations.find(l => l.id === Number(id))
  if (!loc) notFound()

  const color = CATEGORY_COLOR[loc.category] ?? '#1a1a1a'
  const related = locations.filter(l => l.category === loc.category && l.id !== loc.id).slice(0, 3)

  const INFO_ROWS = [
    {
      icon: '📍',
      label: 'Ort',
      value: loc.address,
      link: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`,
    },
    { icon: '🅿️', label: 'Parkplatz',    value: loc.parking },
    { icon: '💶', label: 'Preis',         value: loc.priceDetail },
    { icon: '🕐', label: 'Öffnungszeiten', value: loc.openingHours },
    { icon: '⏱️', label: 'Dauer',         value: DURATION_LABEL[loc.duration] },
    { icon: '🎒', label: 'Altersgruppen', value: loc.ageGroups.join(', ') + ' Jahre' },
  ]

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-10">

        {/* Back link */}
        <Link
          href="/entdecken"
          className="label text-ink/60 hover:text-ink transition-colors inline-flex items-center gap-2 mb-8"
        >
          ← Zurück zur Übersicht
        </Link>

        <div className="grid lg:grid-cols-[1fr_360px] gap-12">

          {/* ── Left column ────────────────────────────── */}
          <div className="space-y-10">

            {/* Category badge + title */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 flex-wrap">
                <span
                  className="px-3 py-1 text-[10px] font-bold tracking-widest uppercase border border-ink"
                  style={{
                    backgroundColor: color,
                    color: '#F5EFE8',
                    fontFamily: 'var(--font-source-code)',
                    boxShadow: '2px 2px 0 #1a1a1a',
                  }}
                >
                  {loc.category}
                </span>
                <span className="label text-ink/60">{loc.region}</span>
              </div>

              <h1
                className="text-4xl md:text-5xl font-bold leading-tight"
                style={{ fontFamily: 'var(--font-courier)' }}
              >
                {loc.name}
              </h1>
              <p
                className="text-lg text-ink/70 italic"
                style={{ fontFamily: 'var(--font-lora)' }}
              >
                {loc.subline}
              </p>
            </div>

            {/* Gallery */}
            <ImageGallery images={loc.images} name={loc.name} />

            {/* Description */}
            <div className="space-y-4">
              <p className="label">Beschreibung</p>
              <p
                className="text-base leading-relaxed"
                style={{ fontFamily: 'var(--font-lora)' }}
              >
                {loc.description}
              </p>
            </div>

            {/* Wegbeschaffenheit */}
            <div className="space-y-3">
              <p className="label">Wegbeschaffenheit</p>
              <div className="flex flex-wrap gap-2">
                {loc.pathCondition.map(p => (
                  <span
                    key={p}
                    className="px-3 py-2 border-2 border-ink text-sm font-medium"
                    style={{
                      fontFamily: 'var(--font-source-code)',
                      boxShadow: '2px 2px 0 #1a1a1a',
                      backgroundColor: '#F5EFE8',
                    }}
                  >
                    {PATH_CONDITION_LABEL[p as PathCondition]}
                  </span>
                ))}
              </div>
            </div>

            {/* Map */}
            <div className="space-y-3">
              <p className="label">Standort</p>
              <DetailMap lat={loc.lat} lng={loc.lng} name={loc.name} color={color} />
            </div>

          </div>

          {/* ── Right column: Info card ─────────────────── */}
          <div className="space-y-6">
            <div className="lofi-card p-6 space-y-0 sticky top-24">
              <p className="label mb-4">Auf einen Blick</p>

              {INFO_ROWS.map(({ icon, label, value, link }) => (
                <div
                  key={label}
                  className="flex gap-3 py-4 border-b border-dashed border-ink/25 last:border-0"
                >
                  <span className="text-lg leading-tight mt-0.5">{icon}</span>
                  <div className="space-y-0.5 min-w-0">
                    <p className="label text-ink/50 text-[9px]">{label}</p>
                    {link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm leading-snug hover:underline break-words"
                        style={{ fontFamily: 'var(--font-lora)', color: '#B49139' }}
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm leading-snug break-words" style={{ fontFamily: 'var(--font-lora)' }}>
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {/* CTA: Google Maps */}
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.address)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="lofi-btn lofi-btn-outline w-full justify-center mt-4 text-[10px]"
              >
                📍 In Google Maps öffnen
              </a>
            </div>
          </div>

        </div>

        {/* ── Related ──────────────────────────────────── */}
        {related.length > 0 && (
          <div className="mt-20 space-y-6">
            <hr className="lofi-divider" />
            <p className="label">Ähnliche Ausflugsziele · {loc.category}</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(r => (
                <Link
                  key={r.id}
                  href={`/ort/${r.id}`}
                  className="lofi-card block overflow-hidden"
                >
                  <div className="relative h-36 border-b-2 border-ink overflow-hidden">
                    <img
                      src={r.images[0]}
                      alt={r.name}
                      className="w-full h-full object-cover"
                      style={{ filter: 'saturate(0.85) sepia(0.08)' }}
                    />
                  </div>
                  <div className="p-4 space-y-1">
                    <p className="label text-ink/50">{r.region}</p>
                    <p className="font-bold text-sm" style={{ fontFamily: 'var(--font-courier)' }}>
                      {r.name}
                    </p>
                    <p className="text-xs text-ink/60 line-clamp-2" style={{ fontFamily: 'var(--font-lora)' }}>
                      {r.subline}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  )
}
