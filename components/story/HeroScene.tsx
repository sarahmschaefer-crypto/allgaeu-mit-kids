'use client'
// components/story/HeroScene.tsx — Allgäu silhouette as a window into the
// landscape. Beim Scrollen WÄCHST das Silhouetten-Fenster, bis seine Ränder den
// Viewport verlassen → randloses Vollbild-Foto (full-bleed). KEIN Opacity-
// Auflösen, kein gerahmter Zwischenzustand (Vorbild: flyward.com).
import { useRef } from 'react'
import { clamp, easeOut, useScrollScene } from '@/lib/story/scroll'
import { ALLGAEU_SHAPE } from '@/lib/story/allgaeuShape'
import { useTweaks } from '@/components/Tweaks'

export function HeroScene() {
  const { fx, direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const mapWrap = useRef<HTMLDivElement>(null)
  const photo = useRef<HTMLImageElement>(null)
  const photoFull = useRef<HTMLImageElement>(null)
  const scrimRef = useRef<HTMLDivElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const blobA = useRef<HTMLDivElement>(null)
  const blobB = useRef<HTMLDivElement>(null)

  const shape = ALLGAEU_SHAPE

  useScrollScene(sec, (p) => {
    const grow = easeOut(clamp(p / 0.82))
    // Silhouette wächst stark, bis ihre Ränder (auch die Konkaven) den Viewport
    // verlassen → das Foto wird randlos full-bleed sichtbar.
    const s = 1 + grow * 7
    if (mapWrap.current) mapWrap.current.style.transform = `scale(${s})`
    // Gegen-Skalierung: das Foto bleibt bildschirmfüllend & scharf, während das
    // wachsende Fenster es Stück für Stück freigibt.
    if (photo.current) photo.current.style.transform = `translate(-50%, -50%) scale(${1 / s})`
    // Vollbild-Foto hinter dem Fenster früh einblenden, damit die grauen Lücken der
    // wachsenden konkaven Silhouette nie sichtbar werden → randlos full-bleed (Plan E).
    if (photoFull.current) photoFull.current.style.opacity = String(clamp(p / 0.12))
    // Scrim (Text-Kontrast) blendet aus, sobald die Headline geht — klares Foto.
    if (scrimRef.current) scrimRef.current.style.opacity = String(1 - clamp((p - 0.05) / 0.4))
    if (copy.current) {
      const out = clamp((p - 0.05) / 0.4)
      copy.current.style.transform = `translateY(${-out * 9}vh) scale(${1 - out * 0.06})`
      copy.current.style.opacity = String(1 - out)
    }
    if (blobA.current) blobA.current.style.transform = `translate(${p * 8 * fx}vw, ${p * 24 * fx}vh)`
    if (blobB.current) blobB.current.style.transform = `translate(${-p * 10 * fx}vw, ${p * 16 * fx}vh)`
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

        {/* Vollbild-Foto hinter dem Silhouetten-Fenster (deckungsgleich), blendet beim
            Scrollen ein und füllt die grauen Ränder → randloses full-bleed (Plan E). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={photoFull} className="hero-photo-full" src="/hero-lake.jpg" alt="" />

        <div className="hero-map-wrap" ref={mapWrap}>
          <div className="hero-photo-box" style={{ aspectRatio: `${shape.vw} / ${shape.vh}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={photo} className="hero-photo" src="/hero-lake.jpg" alt="" style={{ opacity: 1 }} />
            <div className="hero-photo-scrim" ref={scrimRef} />
          </div>
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

        <div className="hero-cue" ref={cue}>
          <span>Scrollt mit</span>
          <span className="hero-cue-line" />
        </div>
      </div>
    </section>
  )
}
