// app/ausflug/[id]/page.tsx — Shapes-styled destination detail
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { Photo, CatPill, Stars, MetaRow } from '@/components/shapes/primitives'
import { DESTINATIONS, getDest } from '@/lib/shapes/data'

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.id }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const dest = getDest(id)
  if (!dest) return { title: 'Ausflugsziel' }
  return { title: dest.name, description: dest.blurb }
}

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dest = getDest(id)
  if (!dest) notFound()

  return (
    <div className="shapes-root">
      <ShapesBar />
      <main style={{ maxWidth: 1100, margin: '0 auto', padding: '24px 24px 70px' }} className="fade-in">
        <Link href="/entdecken" className="kicker" style={{ display: 'inline-block', marginBottom: 18, color: 'var(--ink-soft)' }}>
          ← Zurück zur Entdeckung
        </Link>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 1fr)', gap: 'clamp(24px, 4vw, 56px)', alignItems: 'start' }} className="detail-grid">
          {/* Hero image */}
          <div style={{ position: 'relative', aspectRatio: '4 / 3', overflow: 'hidden', borderRadius: 'var(--radius)', border: '1px solid var(--ink)' }}>
            <Photo cat={dest.cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={dest.name.length + 5} />
            <div style={{ position: 'absolute', top: 16, left: 18 }}>
              <CatPill cat={dest.cat} />
            </div>
          </div>

          {/* Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
              <h1 style={{ fontSize: 'clamp(30px, 4vw, 46px)', lineHeight: 1.2 }}>{dest.name}</h1>
              <Stars rating={dest.rating} reviews={dest.reviews} />
            </div>
            <p className="caption" style={{ fontSize: 17, marginTop: 6 }}>{dest.place}</p>
            <div style={{ marginTop: 14 }}>
              <MetaRow dest={dest} />
            </div>
            <p style={{ margin: '20px 0 24px', color: 'var(--ink-soft)', fontSize: 16.5, lineHeight: 1.5 }}>{dest.blurb}</p>

            <hr className="rule-soft" />

            <h3 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '0.16em', color: 'var(--ink-faint)', margin: '20px 0 12px', fontFamily: 'var(--font-body)', fontWeight: 700 }}>
              Highlights
            </h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dest.highlights.map((h) => (
                <li key={h} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: `var(--c-${dest.cat})`, flex: '0 0 auto' }} />
                  {h}
                </li>
              ))}
            </ul>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 22 }}>
              {dest.facilities.map((f) => (
                <span key={f} className="chip" style={{ cursor: 'default' }}>
                  {f}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px 22px', flexWrap: 'wrap', marginTop: 22, fontSize: 14, color: 'var(--ink-soft)' }}>
              <span><strong style={{ color: 'var(--ink)' }}>Saison:</strong> {dest.season}</span>
              <span><strong style={{ color: 'var(--ink)' }}>Dauer:</strong> {dest.duration}</span>
            </div>

            <div style={{ display: 'flex', gap: 14, marginTop: 30, flexWrap: 'wrap' }}>
              <Link href="/quiz" className="btn btn--primary">
                Mehr passende Ziele finden
              </Link>
              <Link href="/sammeln" className="btn btn--ghost">
                Ins Album sammeln
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
