'use client'
// components/story/HeroScene.tsx — Allgäu silhouette as a window into the
// landscape: photo fills the shape, segmented outline draws in, then the whole
// window is pulled away (the "Sog").
import { useEffect, useRef } from 'react'
import { clamp, easeOut, useScrollScene } from '@/lib/story/scroll'
import { LINE_COLORS } from '@/lib/story/destinations'
import { ALLGAEU_SHAPE } from '@/lib/story/allgaeuShape'
import { useTweaks } from '@/components/Tweaks'

const HERO_SEGMENTS = [
  { a: 0.0, b: 0.2, c: 0 },
  { a: 0.2, b: 0.38, c: 1 },
  { a: 0.38, b: 0.56, c: 2 },
  { a: 0.56, b: 0.74, c: 3 },
  { a: 0.74, b: 1.0, c: 4 },
]

export function HeroScene() {
  const { fx, direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const mapWrap = useRef<HTMLDivElement>(null)
  const measureRef = useRef<SVGPathElement>(null)
  const segRefs = useRef<(SVGPathElement | null)[]>([])
  const imgRef = useRef<HTMLImageElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const segWrap = useRef<SVGSVGElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const sub = useRef<HTMLParagraphElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const blobA = useRef<HTMLDivElement>(null)
  const blobB = useRef<HTMLDivElement>(null)
  const lenRef = useRef(0)
  const drawnRef = useRef(0)

  const shape = ALLGAEU_SHAPE

  const paintSegments = () => {
    const L = lenRef.current || 1
    const drawn = drawnRef.current
    HERO_SEGMENTS.forEach((s, i) => {
      const el = segRefs.current[i]
      if (!el) return
      const start = s.a * L
      const full = (s.b - s.a) * L
      const vis = clamp(drawn * L - start, 0, full)
      el.style.strokeDasharray = `${vis} ${L * 2}`
      el.style.strokeDashoffset = String(-start)
    })
    if (imgRef.current) imgRef.current.style.opacity = String(clamp((drawn - 0.12) / 0.5))
  }

  // intro draw-in on load
  useEffect(() => {
    const m = measureRef.current
    if (!m) return
    lenRef.current = m.getTotalLength()
    let raf = 0
    let t0 = 0
    const dur = 1700
    const run = (t: number) => {
      if (!t0) t0 = t
      const k = clamp((t - t0) / dur)
      drawnRef.current = easeOut(k)
      paintSegments()
      if (k < 1) raf = requestAnimationFrame(run)
    }
    const id = window.setTimeout(() => {
      raf = requestAnimationFrame(run)
    }, 280)
    const fb = window.setTimeout(() => {
      if (drawnRef.current < 1) {
        drawnRef.current = 1
        paintSegments()
      }
    }, 2700)
    return () => {
      clearTimeout(id)
      clearTimeout(fb)
      cancelAnimationFrame(raf)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useScrollScene(sec, (p) => {
    const grow = easeOut(clamp(p / 0.82))
    if (mapWrap.current) mapWrap.current.style.transform = `scale(${1 + grow * 5.4})`
    if (segWrap.current) segWrap.current.style.opacity = String(1 - clamp((p - 0.12) / 0.42))
    if (scrimRef.current) scrimRef.current.style.opacity = String(1 - clamp((p - 0.2) / 0.55) * 0.85)
    if (copy.current) {
      const out = clamp((p - 0.05) / 0.4)
      copy.current.style.transform = `translateY(${-out * 9}vh) scale(${1 - out * 0.06})`
      copy.current.style.opacity = String(1 - out)
    }
    if (blobA.current) blobA.current.style.transform = `translate(${p * 8 * fx}vw, ${p * 24 * fx}vh)`
    if (blobB.current) blobB.current.style.transform = `translate(${-p * 10 * fx}vw, ${p * 16 * fx}vh)`
    if (sub.current) {
      const inP = clamp((p - 0.04) / 0.2)
      sub.current.style.opacity = String(inP * (1 - clamp((p - 0.32) / 0.22)))
      sub.current.style.transform = `translateX(-50%) translateY(${(1 - inP) * 22}px)`
    }
    if (cue.current) cue.current.style.opacity = String(clamp(1 - p * 4))
  })

  return (
    <section className="scene pin-tall hero" ref={sec}>
      <div className="sticky-stage hero-stage">
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <clipPath id="allgaeuClipN" clipPathUnits="objectBoundingBox">
              <path d={shape.dNorm} />
            </clipPath>
          </defs>
        </svg>
        <div className="hero-blob a" ref={blobA} />
        <div className="hero-blob b" ref={blobB} />

        <div className="hero-map-wrap" ref={mapWrap}>
          <div className="hero-photo-box" style={{ aspectRatio: `${shape.vw} / ${shape.vh}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={imgRef} className="hero-photo" src="/hero-allgaeu.jpg" alt="" />
            <div className="hero-photo-scrim" ref={scrimRef} />
          </div>

          <svg
            ref={segWrap}
            className="hero-map"
            viewBox={`0 0 ${shape.vw} ${shape.vh}`}
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path ref={measureRef} d={shape.d} fill="none" stroke="none" />
            {HERO_SEGMENTS.map((s, i) => (
              <path
                key={i}
                ref={(el) => {
                  segRefs.current[i] = el
                }}
                className="hero-seg"
                d={shape.d}
                style={{ stroke: LINE_COLORS[s.c] }}
              />
            ))}
          </svg>
        </div>

        <div className="hero-copy" ref={copy}>
          <p className="eyebrow">Für Familien mit kleinen Entdeckern</p>
          <h1 className="display h-xl hero-q">
            {direkt ? (
              <>
                Der richtige
                <br />
                Ausflug.
              </>
            ) : (
              <>
                Wohin
                <br />
                heute?
              </>
            )}
          </h1>
        </div>

        <p className="lede hero-sub" ref={sub}>
          {direkt
            ? 'Ausflugsziele im Allgäu, die zu Alter, Zeit und Budget eurer Kinder passen.'
            : 'Ein ganzes Land voller Möglichkeiten. Wir helfen euch, genau die eine zu finden.'}
        </p>

        <div className="hero-cue" ref={cue}>
          <span>Scrollt mit</span>
          <span className="hero-cue-line" />
        </div>
      </div>
    </section>
  )
}
