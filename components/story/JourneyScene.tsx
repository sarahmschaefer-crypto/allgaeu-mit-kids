'use client'
// components/story/JourneyScene.tsx — section 1: the winding reference path. As
// you scroll, it draws FLOWING (not pinned). The already-driven part is a solid
// continuous stroke; the part ahead stays dashed. Each possibility crops up with
// an image. Draw is done with a growing clip (robust under the stretched canvas),
// so the solid part never looks dashed.
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { clamp, useScrollScene } from '@/lib/story/scroll'
import { POSSIBILITIES, LINE_COLORS } from '@/lib/story/destinations'
import { JOURNEY_DATA } from '@/lib/story/journeyData'
import { Placeholder } from '@/components/story/Placeholder'
import { useTweaks } from '@/components/Tweaks'

function pointAtY(meas: SVGPathElement, L: number, targetY: number) {
  let lo = 0
  let hi = L
  for (let i = 0; i < 14; i++) {
    const mid = (lo + hi) / 2
    if (meas.getPointAtLength(mid).y < targetY) lo = mid
    else hi = mid
  }
  return meas.getPointAtLength((lo + hi) / 2)
}

export function JourneyScene() {
  const { direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const measureRef = useRef<SVGPathElement>(null)
  const clipRef = useRef<SVGRectElement>(null)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const nodeY = useRef<number[]>([])
  const tipRef = useRef<HTMLSpanElement>(null)
  const footRef = useRef<HTMLParagraphElement>(null)
  const lenRef = useRef(0)

  const D = JOURNEY_DATA

  const apply = (prog: number) => {
    const f = clamp((prog - 0.04) / 0.9) // 0..1 how far we've driven
    const frontY = f * D.vh
    if (clipRef.current) clipRef.current.setAttribute('height', String(frontY))
    const meas = measureRef.current
    if (tipRef.current && meas && lenRef.current) {
      const pt = pointAtY(meas, lenRef.current, frontY)
      tipRef.current.style.left = (pt.x / D.vw) * 100 + '%'
      tipRef.current.style.top = (pt.y / D.vh) * 100 + '%'
      tipRef.current.style.opacity = f > 0.01 && f < 0.99 ? '1' : '0'
    }
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      const k = clamp((frontY - (nodeY.current[i] ?? D.vh)) / (D.vh * 0.03))
      el.style.opacity = String(k)
      el.style.setProperty('--k', (0.7 + k * 0.3).toFixed(3))
    })
    if (footRef.current) footRef.current.style.opacity = String(clamp((f - 0.9) / 0.1))
  }

  useEffect(() => {
    const meas = measureRef.current
    if (!meas) return
    const L = meas.getTotalLength()
    lenRef.current = L
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      const pt = meas.getPointAtLength(L * POSSIBILITIES[i].t)
      el.style.left = (pt.x / D.vw) * 100 + '%'
      el.style.top = (pt.y / D.vh) * 100 + '%'
      el.classList.toggle('poss-left', pt.x > D.vw * 0.5)
      el.classList.toggle('poss-right', pt.x <= D.vw * 0.5)
      nodeY.current[i] = pt.y
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
          <defs>
            <clipPath id="journeyDrawn">
              <rect ref={clipRef} x="0" y="0" width={D.vw} height="0" />
            </clipPath>
          </defs>
          {/* not-yet-driven: dashed */}
          <path className="journey-ghost" d={D.combinedD} vectorEffect="non-scaling-stroke" />
          {/* measure path (invisible) */}
          <path ref={measureRef} d={D.combinedD} fill="none" stroke="none" />
          {/* already-driven: solid continuous, revealed by the growing clip */}
          <g clipPath="url(#journeyDrawn)">
            {D.segments.map((s, i) => (
              <path key={i} className="journey-line" d={s.d} style={{ stroke: s.color }} vectorEffect="non-scaling-stroke" />
            ))}
          </g>
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
