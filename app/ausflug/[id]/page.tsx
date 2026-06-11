// app/ausflug/[id]/page.tsx — Shapes-styled destination detail
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { DetailGallery } from '@/components/shapes/DetailGallery'
import { Stars, Tag } from '@/components/shapes/primitives'
import { DESTINATIONS, getDest, detailInfo, destTags } from '@/lib/shapes/data'

export function generateStaticParams() {
  return DESTINATIONS.map((d) => ({ id: d.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const dest = getDest(id)
  if (!dest) return { title: 'Ausflugsziel' }
  return { title: dest.name, description: dest.blurb }
}

const INFO_FIELDS: { key: keyof ReturnType<typeof detailInfo>; icon: string; label: string }[] = [
  { key: 'ort', icon: '📍', label: 'Ort' },
  { key: 'parkplatz', icon: '🅿️', label: 'Parkplatz' },
  { key: 'preis', icon: '💶', label: 'Preis' },
  { key: 'oeffnungszeiten', icon: '🕒', label: 'Öffnungszeiten' },
  { key: 'dauer', icon: '⏱️', label: 'Dauer des Ausflugs' },
]

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dest = getDest(id)
  if (!dest) notFound()

  const info = detailInfo(dest)
  const tags = destTags(dest)

  return (
    <div className="shapes-root">
      <ShapesBar />
      <main className="detail-main fade-in">
        <Link href="/entdecken" className="kicker detail-back">
          ← Zurück zur Entdeckung
        </Link>

        <div className="detail-grid">
          <DetailGallery cat={dest.cat} name={dest.name} />

          <div>
            <div className="detail-head">
              <h1 className="detail-title">{dest.name}</h1>
              <Stars rating={dest.rating} reviews={dest.reviews} />
            </div>
            <p className="caption detail-place">{dest.place}</p>
            <p className="detail-blurb">{dest.blurb}</p>

            <hr className="rule-soft" />

            {/* the 6 categories */}
            <div className="detail-info">
              {INFO_FIELDS.map((f) => (
                <div className="info-item" key={f.key}>
                  <span className="info-label">
                    <span aria-hidden="true">{f.icon}</span> {f.label}
                  </span>
                  <span className="info-value">{info[f.key] as string}</span>
                </div>
              ))}
              <div className="info-item">
                <span className="info-label">
                  <span aria-hidden="true">🚼</span> Wegbeschaffenheit
                </span>
                <span className="info-tags">
                  {info.wegbeschaffenheit.map((w) => (
                    <span key={w} className="chip" style={{ cursor: 'default' }}>
                      {w}
                    </span>
                  ))}
                </span>
              </div>
            </div>

            <hr className="rule-soft" />

            <h3 className="detail-subhead">Highlights</h3>
            <ul className="detail-highlights">
              {dest.highlights.map((h) => (
                <li key={h}>
                  <span className="hl-dot" style={{ background: `var(--c-${dest.cat})` }} />
                  {h}
                </li>
              ))}
            </ul>

            {tags.length > 0 && (
              <>
                <h3 className="detail-subhead">Tags</h3>
                <div className="info-tags">
                  {tags.map((t) => (
                    <Tag key={t.id} label={t.label} icon={t.icon} color={t.color} />
                  ))}
                </div>
              </>
            )}

            <div className="detail-actions">
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
