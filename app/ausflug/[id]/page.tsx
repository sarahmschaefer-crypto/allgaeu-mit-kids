// app/ausflug/[id]/page.tsx — Shapes-styled destination detail · Variante B "Magazin-Feature"
// Liest aus dem Content-Store (Store = Quelle, ContentDest ⊃ ShapesDest). Bestehendes
// Layout bleibt; Reisebericht/Hinweise/echte Foto-Galerie kommen additiv dazu (nur wenn Inhalt da).
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { DetailGallery } from '@/components/shapes/DetailGallery'
import { Tag } from '@/components/shapes/primitives'
import { detailInfo, destTags, TYPES, primaryTagOf } from '@/lib/shapes/data'
import { getAllDests, getContentDest } from '@/lib/content/store'

export async function generateStaticParams() {
  return (await getAllDests()).map((d) => ({ id: d.id }))
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  const dest = await getContentDest(id)
  if (!dest) return { title: 'Ausflugsziel' }
  return { title: dest.name, description: dest.blurb }
}

// "Für Kinder" range label from the age buckets present on a destination.
function agesLabel(ages: string[]): string {
  const order = ['0-2', '3-5', '6-9', '10+']
  const present = order.filter((o) => ages.includes(o))
  if (!present.length) return 'Jedes Alter'
  const lo = present[0].split('-')[0]
  const hi = present[present.length - 1]
  if (hi === '10+') return `ab ${lo} Jahre`
  return `${lo}–${hi.split('-')[1]} Jahre`
}

const WEATHER_LABEL: Record<string, string> = {
  gut: 'Bei schönem Wetter',
  regen: 'Auch bei Regen',
  egal: 'Wetterunabhängig',
}

export default async function DetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const dest = await getContentDest(id)
  if (!dest) notFound()

  const info = detailInfo(dest)
  // Redaktionelle Overrides bevorzugen (was die Schwester im Admin gepflegt hat).
  if (dest.overrides?.adresse) info.ort = dest.overrides.adresse
  if (dest.overrides?.oeffnungszeiten) info.oeffnungszeiten = dest.overrides.oeffnungszeiten
  if (dest.overrides?.preis) info.preis = dest.overrides.preis

  const tags = destTags(dest)
  const ptag = (TYPES as Record<string, { label: string }>)[primaryTagOf(dest)]

  const facts: { label: string; value: string }[] = [
    { label: 'Ort', value: info.ort },
    { label: 'Für Kinder', value: agesLabel(dest.ages) },
    { label: 'Dauer des Ausflugs', value: info.dauer },
    { label: 'Öffnungszeiten', value: info.oeffnungszeiten },
    { label: 'Preis', value: info.preis },
    { label: 'Parkplatz', value: info.parkplatz },
    { label: 'Wetter', value: WEATHER_LABEL[dest.weather] ?? '—' },
    { label: 'Wegbeschaffenheit', value: info.wegbeschaffenheit.join(' · ') },
  ].filter((f) => f.value && f.value !== '—')

  const story = (dest.description ?? '').split(/\n+/).map((p) => p.trim()).filter(Boolean)
  const tips = (dest.tips ?? '').split(/\n+/).map((t) => t.trim()).filter(Boolean)

  return (
    <div className="shapes-root">
      <ShapesBar />
      <main className="mag fade-in">
        <Link href="/entdecken" className="kicker mag-back">
          ← Zurück zur Entdeckung
        </Link>

        {/* TOP — oversized serif headline (teaser) + intro */}
        <header className="mag-top">
          <div className="mag-headcol">
            <div className="kicker mag-eyebrow">
              {dest.name} · {dest.place}
            </div>
            <h1 className="mag-headline">{dest.teaser ?? dest.name}</h1>
          </div>
          <div className="mag-introcol">
            <hr className="mag-hair" />
            <p className="mag-intro">{dest.blurb}</p>
          </div>
        </header>

        {/* MIDDLE — 4:5 gallery (echte Fotos, sonst Platzhalter) + facts + highlights */}
        <section className="mag-mid">
          <DetailGallery cat={dest.cat} tag={primaryTagOf(dest)} name={dest.name} photos={dest.photos} />

          <div className="mag-col">
            <div>
              <h2 className="mag-h2">Auf einen Blick</h2>
              <dl className="mag-facts">
                {facts.map((f) => (
                  <div className="mag-factrow" key={f.label}>
                    <dt className="kicker">{f.label}</dt>
                    <dd className="mag-factval">{f.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            {dest.highlights.length > 0 && (
              <div>
                <h2 className="mag-h2">Highlights</h2>
                <div className="mag-hls">
                  {dest.highlights.map((h, i) => (
                    <div className="mag-hl" key={h}>
                      <span className="mag-hlnum">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mag-hltext">{h}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Praktische Hinweise — nur wenn vorhanden */}
            {tips.length > 0 && (
              <div>
                <h2 className="mag-h2">Gut zu wissen</h2>
                <div className="mag-hls">
                  {tips.map((t, i) => (
                    <div className="mag-hl" key={t}>
                      <span className="mag-hlnum">{String(i + 1).padStart(2, '0')}</span>
                      <span className="mag-hltext">{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tags.length > 0 && (
              <div>
                <h2 className="mag-h2">Themen</h2>
                <div className="info-tags">
                  {tags.map((t) => (
                    <Tag key={t.id} label={t.label} icon={t.icon} color={t.color} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* REISEBERICHT — der ausführliche Text, nur wenn vorhanden */}
        {story.length > 0 && (
          <section className="mag-story">
            <h2 className="mag-h2">Reisebericht</h2>
            {story.map((p, i) => (
              <p className="mag-intro mag-story-p" key={i}>
                {p}
              </p>
            ))}
          </section>
        )}

        <div className="mag-actions">
          <Link href="/entdecken" className="btn btn--primary">
            Mehr passende Ziele finden
          </Link>
        </div>

        <footer className="mag-foot">
          <span className="mag-pg">01</span>
          <span className="kicker">Ausgabe · {ptag?.label ?? 'Familie & Allgäu'}</span>
        </footer>
      </main>
    </div>
  )
}
