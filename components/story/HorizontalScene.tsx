'use client'
// components/story/HorizontalScene.tsx — vertical scroll drives a horizontal
// sweep of places. Plus the closing ResolutionScene.
import { useRef } from 'react'
import Link from 'next/link'
import { clamp, useScrollScene } from '@/lib/story/scroll'
import { DESTINATIONS } from '@/lib/shapes/data'
import { Placeholder } from '@/components/story/Placeholder'
import { useTweaks } from '@/components/Tweaks'

const GALLERY = [
  { id: 'alpsee-coaster', tag: 'Berg & Rodelspaß', perks: ['Bergbahn', 'Einkehr', 'Coaster'] },
  { id: 'breitachklamm', tag: 'Wasser & Felsen', perks: ['Schatten', '~2 Std', 'Steg'] },
  { id: 'bergbauernmuseum', tag: 'Tiere zum Anfassen', perks: ['Buggy ok', 'Hofcafé', 'Almtiere'] },
  { id: 'skywalk', tag: 'Über den Wipfeln', perks: ['Barrierearm', 'Aussicht', 'Spielturm'] },
  { id: 'eistobel', tag: 'Wilde Wasserfälle', perks: ['Kostenlos', 'Schatten', 'Rundweg'] },
  { id: 'hündle', tag: 'Rasante Abfahrt', perks: ['Bergbahn', 'Sommerrodeln', 'Spielberg'] },
]
const BY_ID = Object.fromEntries(DESTINATIONS.map((d) => [d.id, d]))

export function HorizontalScene() {
  const { fx } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const cards = useRef<(HTMLElement | null)[]>([])
  const bar = useRef<HTMLSpanElement>(null)

  useScrollScene(sec, (p) => {
    const tr = track.current
    if (!tr) return
    const vw = window.innerWidth
    const max = Math.max(0, tr.scrollWidth - vw)
    tr.style.transform = `translate3d(${-p * max}px,0,0)`
    if (bar.current) bar.current.style.transform = `scaleX(${p})`
    const center = vw / 2
    cards.current.forEach((el) => {
      if (!el) return
      const r = el.getBoundingClientRect()
      const t = 1 - clamp(Math.abs(r.left + r.width / 2 - center) / (vw * 0.6))
      const imgEl = el.querySelector<HTMLElement>('.hcard-ph')
      if (imgEl) imgEl.style.transform = `scale(${1.06 + t * 0.12 * fx})`
    })
  })

  return (
    <section className="scene horizontal" ref={sec}>
      <div className="sticky-stage horiz-stage">
        <div className="horiz-head wrap">
          <p className="eyebrow">Und plötzlich ist es einfach</p>
          <h2 className="display h-md">Das Allgäu öffnet sich.</h2>
        </div>
        <div className="horiz-track" ref={track}>
          <div className="horiz-spacer" />
          {GALLERY.map((g, i) => {
            const d = BY_ID[g.id]
            return (
              <Link
                href={`/ausflug/${d.id}`}
                className="hcard"
                key={g.id}
                ref={(el) => {
                  cards.current[i] = el
                }}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="hcard-img">
                  <Placeholder label={d.teaser ?? d.place} className="hcard-ph" />
                  <span className="hcard-index">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="hcard-meta">
                  <p className="hcard-tag">{g.tag}</p>
                  <h3 className="display hcard-name">{d.name}</h3>
                  <p className="hcard-area">{d.place}</p>
                  <div className="hcard-perks">
                    {g.perks.map((perk) => (
                      <span className="perk" key={perk}>
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            )
          })}
          <div className="horiz-end">
            <p className="display h-md">
              …und das ist erst
              <br />
              der Anfang.
            </p>
          </div>
        </div>
        <div className="horiz-progress" aria-hidden="true">
          <span ref={bar} />
        </div>
      </div>
    </section>
  )
}

export function ResolutionScene() {
  const { fx } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const img = useRef<HTMLDivElement>(null)
  const card = useRef<HTMLDivElement>(null)
  useScrollScene(sec, (p) => {
    if (img.current)
      img.current.style.transform = `scale(${1.16 - p * 0.16 * fx}) translateY(${(0.5 - p) * 40 * fx}px)`
    const inP = clamp((p - 0.15) / 0.4)
    if (card.current) {
      card.current.style.opacity = String(inP)
      card.current.style.transform = `translateY(${(1 - inP) * 40}px)`
    }
  })
  return (
    <section className="scene pin-tall-2 resolution" ref={sec}>
      <div className="sticky-stage">
        <div className="layer res-img-wrap">
          <div className="res-img-scale" ref={img}>
            <Placeholder label="Familie am Bergsee · Goldene Abendstunde" className="res-img" />
          </div>
        </div>
        <div className="res-veil" />
        <div className="res-card wrap" ref={card}>
          <p className="eyebrow">Euer Allgäu</p>
          <h2 className="display h-lg">Euer Tag wartet.</h2>
          <p className="lede res-lede">
            Ein Nachmittag, der zu euren Kindern passt – ohne langes Suchen, ohne Kompromisse. Sagt
            uns, wer mitkommt.
          </p>
          <div className="res-actions">
            <Link className="btn btn-primary" href="/quiz">
              Passenden Ausflug finden<span aria-hidden="true">→</span>
            </Link>
            <Link className="btn btn-ghost" href="/swipe">
              Lieber durchblättern
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
