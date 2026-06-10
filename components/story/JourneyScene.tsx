'use client'
// components/story/JourneyScene.tsx — section 1: the winding reference path draws
// as you scroll, but now FLOWING (not pinned) — the path scrolls up with the page
// while it draws. Each possibility crops up together with an image of the place.
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { clamp, useScrollScene } from '@/lib/story/scroll'
import { POSSIBILITIES, LINE_COLORS } from '@/lib/story/destinations'
import { JOURNEY_DATA } from '@/lib/story/journeyData'
import { Placeholder } from '@/components/story/Placeholder'
import { useTweaks } from '@/components/Tweaks'

export function JourneyScene() {
  const { direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const measureRef = useRef<SVGPathElement>(null)
  const segRefs = useRef<(SVGPathElement | null)[]>([])
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const tipRef = useRef<HTMLSpanElement>(null)
  const footRef = useRef<HTMLParagraphElement>(null)
  const lenRef = useRef(0)
  const segMeta = useRef<{ len: number; start: number }[]>([])

  const D = JOURNEY_DATA

  const apply = (prog: number) => {
    const L = lenRef.current || 1
    const draw = clamp((prog - 0.04) / 0.9)
    const drawnLen = draw * L
    segMeta.current.forEach((mta, i) => {
      const el = segRefs.current[i]
      if (!el) return
      const vis = clamp(drawnLen - mta.start, 0, mta.len)
      el.style.strokeDasharray = `${vis} ${mta.len + 2}`
      el.style.strokeDashoffset = '0'
    })
    const meas = measureRef.current
    if (tipRef.current && meas) {
      const pt = meas.getPointAtLength(L * draw)
      tipRef.current.style.left = (pt.x / D.vw) * 100 + '%'
      tipRef.current.style.top = (pt.y / D.vh) * 100 + '%'
      tipRef.current.style.opacity = draw > 0.01 && draw < 0.99 ? '1' : '0'
    }
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      const k = clamp((draw - POSSIBILITIES[i].t) / 0.05)
      el.style.opacity = String(k)
      el.style.setProperty('--k', (0.7 + k * 0.3).toFixed(3))
    })
    if (footRef.current) footRef.current.style.opacity = String(clamp((draw - 0.88) / 0.12))
  }

  useEffect(() => {
    const meas = measureRef.current
    if (!meas) return
    const L = meas.getTotalLength()
    lenRef.current = L
    let cum = 0
    segMeta.current = segRefs.current.map((el) => {
      const len = el ? el.getTotalLength() : 0
      const start = cum
      cum += len
      return { len, start }
    })
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      const pt = meas.getPointAtLength(L * POSSIBILITIES[i].t)
      el.style.left = (pt.x / D.vw) * 100 + '%'
      el.style.top = (pt.y / D.vh) * 100 + '%'
      el.classList.toggle('poss-left', pt.x > D.vw * 0.5)
      el.classList.toggle('poss-right', pt.x <= D.vw * 0.5)
    })
    apply(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useScrollScene(sec, apply)

  return (
    <section className="scene journey" ref={sec}>
      <div className="journey-head wrap">
        <p className="eyebrow">Berge · Seen · Höfe · Pfade</p>
        <h2 className="display h-lg">
          {direkt ? <>Hunderte Ausflugsziele.</> : <>Über tausend Möglichkeiten.</>}
          <br />
          <span className="accent-terra">Welche passt zu uns?</span>
        </h2>
      </div>

      <div className="journey-canvas">
        <svg className="journey-svg" viewBox={D.viewBox} preserveAspectRatio="none" aria-hidden="true">
          <path className="journey-ghost" d={D.combinedD} vectorEffect="non-scaling-stroke" />
          <path ref={measureRef} d={D.combinedD} fill="none" stroke="none" />
          {D.segments.map((s, i) => (
            <path
              key={i}
              ref={(el) => {
                segRefs.current[i] = el
              }}
              className="journey-line"
              d={s.d}
              style={{ stroke: s.color }}
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        <span className="journey-tip" ref={tipRef} aria-hidden="true" />

        {POSSIBILITIES.map((n, i) => (
          <div
            key={n.label}
            ref={(el) => {
              nodeRefs.current[i] = el
            }}
            className={`poss${n.big ? ' poss-big' : ''}`}
            style={{ ['--c']: LINE_COLORS[n.c] } as CSSProperties}
          >
            <span className="poss-dot" />
            <div className="poss-card">
              <div className="poss-img">
                <Placeholder label={n.label} className="poss-ph" />
              </div>
              <div className="poss-body">
                <span className="poss-label">{n.label}</span>
                {n.sub && <span className="poss-sub">{n.sub}</span>}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="journey-foot wrap" ref={footRef}>
        Schön, oder? Nur: welcher dieser Orte passt heute zu <em>euren</em> Kindern?
      </p>
    </section>
  )
}
