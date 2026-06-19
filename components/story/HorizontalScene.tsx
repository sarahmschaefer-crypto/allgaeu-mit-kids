'use client'
// components/story/HorizontalScene.tsx — vertical scroll drives a horizontal
// sweep of places. Plus the closing ResolutionScene.
import { useRef } from 'react'
import Link from 'next/link'
import { clamp, useScrollScene } from '@/lib/story/scroll'
import { DestCard } from '@/components/shapes/primitives'
import { useTweaks } from '@/components/Tweaks'
import { useMatch } from '@/components/story/MatchContext'
import { buildExploreHref } from '@/lib/shapes/explore'

function scrollToQuiz() {
  const el = document.getElementById('start')
  if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 16, behavior: 'smooth' })
}

export function HorizontalScene() {
  const { fx } = useTweaks()
  const { matches, sel } = useMatch()
  const cardsData = matches.slice(0, 12)
  const exploreHref = buildExploreHref(sel, { from: 'quiz' })
  const empty = matches.length === 0
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
      const imgEl = el.querySelector<HTMLElement>('.ph')
      if (imgEl) imgEl.style.transform = `scale(${1.04 + t * 0.1 * fx})`
    })
  })

  return (
    <section className="scene horizontal" ref={sec}>
      <div className="sticky-stage horiz-stage">
        <div className="horiz-head wrap">
          <p className="eyebrow">Eure Treffer</p>
          <h2 className="display h-md">Das Allgäu öffnet sich.</h2>
          {!empty && (
            <Link className="horiz-cta" href={exploreHref}>
              Alle {matches.length} ansehen<span aria-hidden="true">→</span>
            </Link>
          )}
        </div>

        {empty ? (
          <div className="horiz-empty wrap">
            <p className="display h-md">Noch nichts Perfektes dabei.</p>
            <p className="lede">Lockert oben eine Angabe – dann öffnet sich das Allgäu wieder.</p>
            <div className="horiz-empty-actions">
              <button className="btn btn-primary" onClick={scrollToQuiz}>Angaben anpassen</button>
              <Link className="btn btn-ghost" href="/entdecken">Alle Ziele ansehen</Link>
            </div>
          </div>
        ) : (
          <>
            <div className="horiz-track" ref={track}>
              <div className="horiz-spacer" />
              {cardsData.map((d, i) => (
                <div
                  className="hcard"
                  key={d.id}
                  ref={(el) => {
                    cards.current[i] = el
                  }}
                >
                  <DestCard dest={d} />
                </div>
              ))}
              <Link className="horiz-end" href={exploreHref}>
                <p className="display h-md">
                  Alle Treffer<br />
                  auf einen Blick <span aria-hidden="true">→</span>
                </p>
              </Link>
            </div>
            <div className="horiz-progress" aria-hidden="true">
              <span ref={bar} />
            </div>
          </>
        )}
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
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="res-photo" src="/hero-allgaeu.jpg" alt="" />
          </div>
        </div>
        <div className="res-veil" />
        <div className="res-card wrap" ref={card}>
          <p className="eyebrow">Euer Allgäu</p>
          <h2 className="display h-lg">Es gibt noch viel zu entdecken.</h2>
          <p className="lede res-lede">
            Über 100 Ausflugsziele für Familien – Berge, Seen, Höfe und Pfade. Stöbert in Ruhe und
            findet euren nächsten Lieblingsort.
          </p>
          <div className="res-actions">
            <Link className="btn btn-primary" href="/entdecken">
              Alle Ausflugsziele entdecken<span aria-hidden="true">→</span>
            </Link>
            {/* "Mit den Kindern sammeln" → /sammeln vorerst deaktiviert (Sammeln versteckt) */}
          </div>
        </div>
      </div>
    </section>
  )
}
