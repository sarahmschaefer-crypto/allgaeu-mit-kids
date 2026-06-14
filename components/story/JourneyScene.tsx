'use client'
// components/story/JourneyScene.tsx — section 2: the winding reference path draws
// FLOWING (not pinned) as you scroll. The path is the design's MULTI-COLOUR
// "active" path (Path.svg) — each segment keeps its own colour + thickness. The
// driven part is revealed segment-by-segment along the total length; the part
// ahead stays a faint dashed ghost (same shape → perfect overlap). The reveal is
// driven by stroke-dashoffset so it's smooth and organic, never jumpy. Each
// possibility crops up with an image. preserveAspectRatio="meet" → never distorts.
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
  const segRefs = useRef<(SVGPathElement | null)[]>([]) // the coloured drawn segments
  const segLen = useRef<number[]>([]) // length of each segment
  const segStart = useRef<number[]>([]) // cumulative start offset of each segment
  const totalLen = useRef(0)
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([])
  const nodeFracY = useRef<number[]>([]) // each node's y as a fraction of the path height
  const tipRef = useRef<HTMLSpanElement>(null)
  const footRef = useRef<HTMLParagraphElement>(null)

  const D = JOURNEY_DATA
  const SEGS = D.segments

  // point at a global length across the ordered segments
  const pointAt = (g: number) => {
    const lens = segLen.current
    const starts = segStart.current
    let k = 0
    while (k < lens.length - 1 && g > starts[k] + lens[k]) k++
    const p = segRefs.current[k]
    const local = Math.min(Math.max(g - starts[k], 0), lens[k])
    return p ? p.getPointAtLength(local) : { x: 0, y: 0 }
  }

  // draw the path + tip for a given progress f (0..1 along the whole path)
  const drawPath = (f: number) => {
    const L = totalLen.current || 1
    const drawn = L * f
    segRefs.current.forEach((p, k) => {
      if (!p) return
      const local = Math.min(Math.max(drawn - segStart.current[k], 0), segLen.current[k])
      p.style.strokeDashoffset = String(segLen.current[k] - local)
    })
    if (tipRef.current && segRefs.current.length) {
      const pt = pointAt(drawn)
      tipRef.current.style.left = (pt.x / D.vw) * 100 + '%'
      tipRef.current.style.top = (pt.y / D.vh) * 100 + '%'
      tipRef.current.style.opacity = f > 0.01 && f < 0.985 ? '1' : '0'
    }
    if (footRef.current) footRef.current.style.opacity = String(clamp((f - 0.9) / 0.1))
  }

  // measure segment lengths + place the cards along the path
  useEffect(() => {
    let cum = 0
    segRefs.current.forEach((p, k) => {
      if (!p) return
      const L = p.getTotalLength()
      segLen.current[k] = L
      segStart.current[k] = cum
      cum += L
      // one dash the whole length → offset reveals it progressively
      p.style.strokeDasharray = String(L)
      p.style.strokeDashoffset = String(L)
    })
    totalLen.current = cum
    nodeRefs.current.forEach((el, i) => {
      if (!el) return
      const pt = pointAt(cum * POSSIBILITIES[i].t)
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
      drawPath(clamp((vh * 0.88 - r.top) / (vh * 0.66 + r.height)))
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
        <svg className="journey-svg" viewBox={D.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
          {/* ahead of the front: faint dashed ghost of the whole shape */}
          <path className="journey-ghost" d={D.combinedD} />
          {/* driven part: the multi-colour active segments, revealed along their length */}
          {SEGS.map((s, k) => (
            <path
              key={k}
              ref={(el) => {
                segRefs.current[k] = el
              }}
              className="journey-seg"
              d={s.d}
              stroke={s.color}
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
