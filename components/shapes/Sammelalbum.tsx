'use client'
// components/shapes/Sammelalbum.tsx — a small collecting GAME for kids:
// an album of empty numbered slots that fill up as you tap places from the
// "Sammelvorrat". Each fill plops in; reaching 3 / 8 / 16 unlocks a level.
// No swiping. Persists in localStorage.
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { primaryTagOf } from '@/lib/shapes/data'
import { useDests } from '@/components/content/ContentProvider'
import { Photo, TagLabel, Container } from '@/components/shapes/primitives'

const STORAGE_KEY = 'amk-album'

const LEVELS = [
  { at: 16, name: 'Allgäu-Profi' },
  { at: 8, name: 'Kenner' },
  { at: 3, name: 'Entdecker' },
  { at: 0, name: 'Frisch dabei' },
]
const MILESTONES = [3, 8, 16]
const levelName = (n: number) => LEVELS.find((l) => n >= l.at)!.name
const nextMilestone = (n: number) => MILESTONES.find((m) => m > n) ?? null

export function Sammelalbum() {
  const [collected, setCollected] = useState<string[]>([])
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number | null>(null)
  const dests = useDests()
  const TOTAL = dests.length

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setCollected(JSON.parse(raw))
    } catch {
      /* ignore */
    }
    setHydrated(true)
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current)
    }
  }, [])

  const persist = (next: string[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
      /* ignore */
    }
  }
  const fireToast = (msg: string) => {
    setToast(msg)
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 2600)
  }

  const collect = (id: string) => {
    setCollected((c) => {
      if (c.includes(id)) return c
      const next = [...c, id]
      persist(next)
      if (MILESTONES.includes(next.length)) {
        fireToast(next.length === TOTAL ? 'Album voll! 🎉' : `Stufe erreicht: ${levelName(next.length)} 🎉`)
      }
      return next
    })
  }
  const remove = (id: string) => {
    setCollected((c) => {
      const next = c.filter((x) => x !== id)
      persist(next)
      return next
    })
  }
  const reset = () => {
    setCollected([])
    persist([])
  }

  const count = collected.length
  const level = levelName(count)
  const next = nextMilestone(count)
  const vorrat = dests.filter((d) => !collected.includes(d.id))

  return (
    <Container style={{ paddingTop: 30, paddingBottom: 80 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, flexWrap: 'wrap', marginBottom: 6 }}>
        <div>
          <div className="kicker" style={{ marginBottom: 10 }}>Lasst die Kleinen mitsammeln</div>
          <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', lineHeight: 1.3 }}>Euer Sammelalbum</h2>
        </div>
        {count > 0 && (
          <button className="link-arrow" style={{ fontSize: 12.5, borderBottomWidth: 1 }} onClick={reset}>
            Album leeren
          </button>
        )}
      </div>
      <p style={{ color: 'var(--ink-soft)', fontSize: 15.5, maxWidth: '54ch', margin: '0 0 20px' }}>
        Tippt unten einen Ort an – er klebt sich in euer Album. Füllt alle {TOTAL} Plätze und werdet zum Allgäu-Profi!
      </p>

      {/* level meter */}
      <div className="album-meter">
        <div className="album-meter-bar">
          <span style={{ width: `${(count / TOTAL) * 100}%` }} />
          {MILESTONES.map((m) => (
            <i key={m} className={count >= m ? 'on' : ''} style={{ left: `${(m / TOTAL) * 100}%` }} aria-hidden="true" />
          ))}
        </div>
        <div className="album-meter-label">
          <strong>{hydrated ? level : '…'}</strong>
          <span>
            {next ? `${count} / ${TOTAL} · noch ${next - count} bis ${levelName(next)}` : `${count} / ${TOTAL} · komplett!`}
          </span>
        </div>
      </div>

      {/* the album — fixed numbered slots */}
      <h3 className="album-zone-head">Mein Album</h3>
      <div className="album-grid">
        {dests.map((d, i) => {
          const on = collected.includes(d.id)
          if (!on) {
            return (
              <div key={d.id} className="album-slot empty" aria-label={`Platz ${i + 1} – noch frei`}>
                <span className="slot-no">Nº {String(i + 1).padStart(2, '0')}</span>
              </div>
            )
          }
          return (
            <div key={d.id} className="album-slot">
              <Link href={`/ausflug/${d.id}`} className="album-sticker" aria-label={`${d.name} – Details`}>
                <Photo cat={d.cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={d.name.length + 2} />
                <span className="album-no" aria-hidden="true">Nº {String(i + 1).padStart(2, '0')}</span>
                <span className="album-name">{d.name}</span>
                <span className="album-star" aria-hidden="true">★</span>
              </Link>
              <button className="album-remove" onClick={() => remove(d.id)} aria-label={`${d.name} zurücklegen`}>
                ×
              </button>
            </div>
          )
        })}
      </div>

      {/* the pile still to collect */}
      <h3 className="album-zone-head" style={{ marginTop: 40 }}>
        {vorrat.length > 0 ? `Noch einzukleben (${vorrat.length})` : 'Alles gesammelt'}
      </h3>
      {vorrat.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '30px 20px' }}>
          <p className="caption" style={{ fontSize: 18, marginBottom: 14 }}>Glückwunsch – euer Album ist voll! 🎉</p>
          <Link href="/entdecken" className="btn btn--primary">Eure Orte planen</Link>
        </div>
      ) : (
        <div className="vorrat-grid">
          {vorrat.map((d) => (
            <button key={d.id} className="vorrat-card" onClick={() => collect(d.id)} aria-label={`${d.name} ins Album kleben`}>
              <div className="vorrat-img">
                <Photo cat={d.cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={d.name.length + 2} />
                <span className="vorrat-hint" aria-hidden="true">+ Einkleben</span>
              </div>
              <div className="vorrat-meta">
                <TagLabel tag={primaryTagOf(d)} />
                <span className="vorrat-name">{d.name}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {toast && <div className="album-toast" role="status">{toast}</div>}
    </Container>
  )
}
