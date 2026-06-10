'use client'
// components/story/JourneyScene.tsx — section 1: the path now FLOWS (not pinned).
// A vertical rail starts below the heading and "draws" (fills) as you scroll
// with it; each possibility reveals together with its image.
import { useRef } from 'react'
import { clamp, useScrollScene } from '@/lib/story/scroll'
import { POSSIBILITIES, LINE_COLORS } from '@/lib/story/destinations'
import { Placeholder } from '@/components/story/Placeholder'
import { useTweaks } from '@/components/Tweaks'

export function JourneyScene() {
  const { direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const fill = useRef<HTMLDivElement>(null)

  useScrollScene(sec, (p) => {
    if (fill.current) fill.current.style.height = `${clamp((p - 0.02) / 0.86) * 100}%`
  })

  return (
    <section className="scene journey2" ref={sec}>
      <div className="journey2-head wrap rv" data-d="0">
        <p className="eyebrow">Berge · Seen · Höfe · Pfade</p>
        <h2 className="display h-lg">
          {direkt ? <>Hunderte Ausflugsziele.</> : <>Über tausend Möglichkeiten.</>}
          <br />
          <span className="accent-terra">Welche passt zu uns?</span>
        </h2>
      </div>

      <div className="journey2-track wrap">
        <div className="journey2-rail" aria-hidden="true">
          <div className="journey2-fill" ref={fill} />
        </div>
        {POSSIBILITIES.map((n, i) => (
          <div key={n.label} className={`jstation ${i % 2 === 0 ? 'l' : 'r'} rv`} data-d={(i % 3) * 0.5}>
            <span className="jstation-dot" style={{ background: LINE_COLORS[n.c] }} />
            <article className={`jcard${n.big ? ' big' : ''}`}>
              <div className="jcard-img">
                <Placeholder label={n.label} className="jcard-ph" />
              </div>
              <div className="jcard-body">
                <span className="jcard-label">{n.label}</span>
                {n.sub && <span className="jcard-sub">{n.sub}</span>}
              </div>
            </article>
          </div>
        ))}
      </div>

      <p className="journey2-foot wrap rv" data-d="0.3">
        Schön, oder? Nur: welcher dieser Orte passt heute zu <em>euren</em> Kindern?
      </p>
    </section>
  )
}
