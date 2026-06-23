'use client'
// components/story/HeroScene.tsx — Vollbild-Allgäu-Foto als Hero.
// Das frühere Silhouetten-Fenster (zweite Foto-Ebene) wurde entfernt, weil die
// beiden Ebenen beim Skalieren nicht deckungsgleich blieben (Nähte). Jetzt: EIN
// Vollbild-Foto, immer 100% sichtbar, mit sanftem Ken-Burns-Zoom beim Scrollen.
import { useRef } from 'react'
import { clamp, easeOut, useScrollScene } from '@/lib/story/scroll'
import { useTweaks } from '@/components/Tweaks'

export function HeroScene() {
  const { fx, direkt } = useTweaks()
  const sec = useRef<HTMLElement>(null)
  const photo = useRef<HTMLImageElement>(null)
  const copy = useRef<HTMLDivElement>(null)
  const cue = useRef<HTMLDivElement>(null)
  const blobA = useRef<HTMLDivElement>(null)
  const blobB = useRef<HTMLDivElement>(null)

  useScrollScene(sec, (p) => {
    const grow = easeOut(clamp(p / 0.82))
    // Ein Vollbild-Foto, immer sichtbar — sanfter Ken-Burns-Zoom beim Scrollen.
    if (photo.current) photo.current.style.transform = `translate(-50%, -50%) scale(${1 + grow * 0.22})`
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
        <div className="hero-blob a" ref={blobA} />
        <div className="hero-blob b" ref={blobB} />

        {/* EIN Vollbild-Foto, dauerhaft 100% sichtbar (kein Silhouetten-Fenster mehr). */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img ref={photo} className="hero-photo-full" src="/hero-lake.jpg" alt="" />
        {/* dezenter Kontrast-Schleier hinter der Headline (ersetzt den alten Fenster-Scrim) */}
        <div className="hero-veil" />

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
