'use client'
// components/story/JourneyScene.tsx — the reference SVG path draws on as you
// scroll (pinned), each colour segment revealing in turn, possibilities
// cropping up along it.
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { clamp, useScrollScene } from '@/lib/story/scroll'
import { POSSIBILITIES, LINE_COLORS } from '@/lib/story/destinations'
import { JOURNEY_DATA } from '@/lib/story/journeyData'
import { useTweaks } from '@/components/Tweaks'

export function JourneyScene() {
  const { direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const measureRef = useRef<SVGPathElement>(null)
  const segRefs = useRef<(SVGPathElement | null)[]>([])
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const tipRef = useRef<HTMLSpanElement>(null)
  const headRef = useRef<HTMLDivElement>(null)
  const footRef = useRef<HTMLParagraphElement>(null)
  const lenRef = useRef(0)
  const segMeta = useRef<{ len: number; start: number }[]>([])

  const D = JOURNEY_DATA

  const apply = (prog: number) => {
    const L = lenRef.current || 1
    const draw = clamp((prog - 0.06) / 0.86)
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
      const k = clamp((draw - POSSIBILITIES[i].t) / 0.04)
      el.style.opacity = String(k)
      el.style.setProperty('--k', (0.6 + k * 0.4).toFixed(3))
    })
    if (headRef.current)
      headRef.current.style.opacity = String(
        clamp(prog / 0.1) * (1 - clamp((prog - 0.92) / 0.08)),
      )
    if (footRef.current) footRef.current.style.opacity = String(clamp((draw - 0.9) / 0.1))
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
      <div className="journey-sticky">
        <div className="journey-grid-bg" aria-hidden="true" />

        <div className="journey-head" ref={headRef}>
          <p className="eyebrow">Berge · Seen · Höfe · Pfade</p>
          <h2 className="display h-lg">
            {direkt ? <>Hunderte Ausflugsziele.</> : <>Über tausend Möglichkeiten.</>}
            <br />
            <span className="accent-terra">Welche passt zu uns?</span>
          </h2>
        </div>

        <div className="journey-canvas" style={{ aspectRatio: `${D.vw} / ${D.vh}` }}>
          <svg
            className="journey-svg"
            viewBox={D.viewBox}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path className="journey-ghost" d={D.combinedD} />
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
                <span className="poss-label">{n.label}</span>
                {n.sub && <span className="poss-sub">{n.sub}</span>}
              </div>
            </div>
          ))}
        </div>

        <p className="journey-foot" ref={footRef}>
          Schön, oder? Nur: welcher dieser Orte passt heute zu <em>euren</em> Kindern?
        </p>
      </div>
    </section>
  )
}
