'use client'
// components/story/SammelnTeaser.tsx — quiet "soft off-ramp" in the story for
// the collecting game. Not a pinned scene (keeps the page from getting longer).
import Link from 'next/link'
import { DESTINATIONS } from '@/lib/shapes/data'
import { Reveal } from '@/components/story/Reveal'
import { Placeholder } from '@/components/story/Placeholder'

export function SammelnTeaser() {
  const peek = DESTINATIONS.slice(0, 3)
  return (
    <section className="sammeln-teaser">
      <div className="wrap st-grid">
        <Reveal className="st-copy">
          <p className="eyebrow">Für die kleinen Entdecker</p>
          <h2 className="display h-md">
            Lasst die Kinder
            <br />
            mitsammeln.
          </h2>
          <p className="lede">
            Tippt euch durchs Allgäu und klebt eure Lieblingsorte ins Album – Stück für Stück, bis
            ihr echte Allgäu-Profis seid.
          </p>
          <Link className="btn btn--primary" href="/sammeln">
            Sammelalbum öffnen<span aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <Reveal delay={1} className="st-album" aria-hidden="true">
          {peek.map((d) => (
            <div className="st-slot filled" key={d.id}>
              <Placeholder label={d.name} className="st-ph" />
              <span className="st-star">★</span>
            </div>
          ))}
          {[4, 5, 6].map((n) => (
            <div className="st-slot empty" key={n}>
              <span>Nº 0{n}</span>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
