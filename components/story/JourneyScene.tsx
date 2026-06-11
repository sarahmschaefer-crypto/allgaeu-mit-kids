'use client'
// components/story/JourneyScene.tsx — section 1: the winding reference path draws
// FLOWING (not pinned) as you scroll. The driven part is a solid continuous
// stroke, the part ahead stays dashed — both are the SAME path (perfect overlap),
// and the reveal runs along the path length (stroke-dashoffset) so it's smooth
// and organic, never jumpy. Each possibility crops up with an image.
import { useEffect, useRef } from 'react'
import type { CSSProperties } from 'react'
import { clamp } from '@/lib/story/scroll'
import { POSSIBILITIES, LINE_COLORS } from '@/lib/story/destinations'
import { JOURNEY_DATA } from '@/lib/story/journeyData'
import { Placeholder } from '@/components/story/Placeholder'
import { useTweaks } from '@/components/Tweaks'

export function JourneyScene() {
  const { direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<SVGPathElement>(null) // the drawn (solid) path = our measure
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const nodeFracY = useRef<number[]>([]) // each node's y as a fraction of the path height
  const tipRef = useRef<HTMLSpanElement>(null)
  const footRef = useRef<HTMLParagraphElement>(null)
  const lenRef = useRef(0)

  const D = JOURNEY_DATA

  // draw the path + tip for a given progress f (0..1 along the path)
  const drawPath = (f: number) => {
    const L = lenRef.current || 1
    if (lineRef.current) lineRef.current.style.strokeDashoffset = String(L * (1 - f))
    if (tipRef.current && lineRef.current) {
      const pt = lineRef.current.getPointAtLength(L * f)
      tipRef.current.style.left = (pt.x / D.vw) * 100 + '%'
      tipRef.current.style.top = (pt.y / D.vh) * 100 + '%'
      tipRef.current.style.opacity = f > 0.01 && f < 0.985 ? '1' : '0'
    }
    if (footRef.current) footRef.current.style.opacity = String(clamp((f - 0.9) / 0.1))
  }

  useEffect(() => {
    const line = lineRef.current
    if (!line) return
    const L = line.getTotalLength()
    lenRef.current = L
    // one dash the whole length → offset reveals it progressively
    line.style.strokeDasharray = String(L)
    line.style.strokeDashoffset = String(L)
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      const pt = line.getPointAtLength(L * POSSIBILITIES[i].t)
      el.style.left = (pt.x / D.vw) * 100 + '%'
      el.style.top = (pt.y / D.vh) * 100 + '%'
      el.classList.toggle('poss-left', pt.x > D.vw * 0.5)
      el.classList.toggle('poss-right', pt.x <= D.vw * 0.5)
      nodeFracY.current[i] = pt.y / D.vh
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Everything tied to scroll: the path draws as the canvas passes through, and
  // each image card pops in as ITS point reaches the middle of the viewport
  // (so the images always appear centred, never off-screen). Responsive: all
  // measures come from the live canvas rect + window height.
  useEffect(() => {
    const onScroll = () => {
      const c = canvasRef.current
      if (!c) return
      const r = c.getBoundingClientRect()
      const vh = window.innerHeight
      // path draw: clean 0→1 as the canvas travels through the viewport
      drawPath(clamp((vh * 0.88 - r.top) / (vh * 0.66 + r.height)))
      // card reveal: each image is fully visible only near the MIDDLE of the
      // viewport and fades above/below — so it pops up centred, is never shown
      // off-screen, and cards never stack on top of each other (works on any
      // screen size).
      nodeRefs.current.forEach((el, i) => {
        if (!el) return
        const screenY = r.top + (nodeFracY.current[i] ?? 0.5) * r.height
        const dist = Math.abs(screenY - vh * 0.5) / vh // 0 at centre
        const k = clamp((0.34 - dist) / 0.2) // full within 14% of centre, gone past 34%
        el.style.opacity = String(k)
        el.style.setProperty('--k', (0.86 + k * 0.14).toFixed(3))
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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

      <div className="journey-canvas" ref={canvasRef}>
        <svg className="journey-svg" viewBox={D.viewBox} preserveAspectRatio="none" aria-hidden="true">
          {/* ahead of the front: dashed (same path → perfect overlap) */}
          <path className="journey-ghost" d={D.combinedD} />
          {/* driven part: solid single-colour, revealed along its length */}
          <path ref={lineRef} className="journey-line" d={D.combinedD} />
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
