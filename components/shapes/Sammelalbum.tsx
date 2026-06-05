'use client'
// components/shapes/Sammelalbum.tsx — kid-friendly "sticker album": tap a place
// to stick it into your album (no swiping). Collection persists in localStorage.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DESTINATIONS } from '@/lib/shapes/data'
import { Photo, CatPill, Container } from '@/components/shapes/primitives'

const STORAGE_KEY = 'amk-album'

export function Sammelalbum() {
  const [collected, setCollected] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCollected(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    setHydrated(true)
  }, [])

  const toggle = (id: string) =>
    setCollected((c) => {
      const next = c.includes(id) ? c.filter((x) => x !== id) : [...c, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch {
        /* ignore */
      }
      return next
    })

  const total = DESTINATIONS.length
  const count = collected.length
  const pct = Math.round((count / total) * 100)

  return (
    <Container style={{ paddingTop: 30, paddingBottom: 80 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', marginBottom: 8 }}>
        <div>
          <div className="kicker" style={{ marginBottom: 10 }}>Lasst die Kleinen mitsammeln</div>
          <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', lineHeight: 1.3 }}>Euer Sammelalbum</h2>
        </div>
        {count > 0 && (
          <button className="link-arrow" style={{ fontSize: 12.5, borderBottomWidth: 1 }} onClick={() => { setCollected([]); try { localStorage.removeItem(STORAGE_KEY) } catch {} }}>
            Album leeren
          </button>
        )}
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15.5, maxWidth: '52ch', margin: '0 0 18px' }}>
        Tippt die Orte an, die euch gefallen – sie kleben sich ins Album. Über das <span aria-hidden="true">→</span> kommt ihr zu den Details.
      </p>

      {/* progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 26 }}>
        <div style={{ flex: 1, height: 8, borderRadius: 999, background: 'var(--bg-2)', overflow: 'hidden', maxWidth: 320 }}>
          <span style={{ display: 'block', height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 999, transition: 'width .4s cubic-bezier(.2,.7,.2,1)' }} />
        </div>
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, color: 'var(--ink)' }}>
          {hydrated ? `${count} / ${total} gesammelt` : `${total} Orte`}
        </span>
      </div>
      <hr className="rule" style={{ marginBottom: 26 }} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 22 }}>
        {DESTINATIONS.map((d) => {
          const on = collected.includes(d.id)
          return (
            <div key={d.id} className={`sticker${on ? ' on' : ''}`}>
              <button className="sticker-tap" onClick={() => toggle(d.id)} aria-pressed={on} aria-label={on ? `${d.name} aus dem Album nehmen` : `${d.name} ins Album kleben`}>
                <div className="sticker-img">
                  <Photo cat={d.cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={d.name.length + 2} />
                  <span className="sticker-badge" aria-hidden="true">★ Eingeklebt</span>
                  {!on && <span className="sticker-hint" aria-hidden="true">+ Einkleben</span>}
                </div>
                <div className="sticker-meta">
                  <CatPill cat={d.cat} />
                  <h3 style={{ fontSize: 19, lineHeight: 1.3, margin: '2px 0 0' }}>{d.name}</h3>
                  <div className="caption" style={{ fontSize: 14 }}>{d.place}</div>
                </div>
              </button>
              <Link href={`/ausflug/${d.id}`} className="sticker-detail" aria-label={`${d.name} – Details`}>
                →
              </Link>
            </div>
          )
        })}
      </div>

      {hydrated && count > 0 && (
        <div style={{ textAlign: 'center', marginTop: 44 }}>
          <p className="caption" style={{ fontSize: 17, marginBottom: 14 }}>
            Schön gesammelt! {count === 1 ? 'Ein Lieblingsort' : `${count} Lieblingsorte`} im Album.
          </p>
          <Link href="/entdecken" className="btn btn--ghost">Mehr Orte entdecken</Link>
        </div>
      )}
    </Container>
  )
}
