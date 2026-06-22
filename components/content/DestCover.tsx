'use client'
// components/content/DestCover.tsx — echtes Cover eines Ziels als responsives 4:5-Bild.
// Nutzt den cover-tool-Renderer (FigmaCover). Alle Ziele bekommen eine FOTO-Vorlage;
// fehlt das echte Foto, wird ein Demo-Platzhalter genutzt (die Schwester ergänzt später).
// Vorlagen-Verhältnis (von Sarah): 3× Vollbild : je 1× Bandarole / Rahmen Blob /
// Rahmen Viereck / Vollbild Grafik&Schrift 2 / Textmarker. FigmaCover braucht eine
// NUMERISCHE Breite → wir messen die Containerbreite (ResizeObserver + Sofort-Messung).
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { figmaTemplate, type FigmaTemplate } from '@/lib/cover/figma-templates'
import { FigmaCover, type FigmaContent } from '@/components/cover/FigmaCover'
import { primaryTagOf, type ShapesDest } from '@/lib/shapes/data'

// Vorhandene Kategorie-Stempel (public/cover/stamps/<cat>.png) — Rest: kein Stempel.
const STAMPS = new Set(['attraktion', 'ausflug', 'kreatives', 'kultur', 'schwimmen', 'shop', 'spielplatz', 'sport', 'tierpark', 'unterkunft'])

const hasMarker = (t: FigmaTemplate) => t.layers.some((l) => l.type === 'marker')

// FNV-1a: gute Streuung auch in den unteren Bits → gleichmäßige %8-Verteilung.
function hash(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

// Gewichtete Vorlagen-Mischung: 8 Slots (3 Vollbild + je 1 der anderen).
// Variante je Familie über ein zweites Hash-Bit → mehr Abwechslung.
function templateFor(id: string): FigmaTemplate {
  const h = hash(id)
  const slot = (h >>> 16) % 8 // hohe Bits → gleichmäßigste Verteilung, kein Cluster
  const v = (h >> 3) & 1
  let tid: string
  if (slot < 3) tid = 'vollbild-einfach'
  else if (slot === 3) tid = v ? 'bandarole-2' : 'bandarole-1'
  else if (slot === 4) tid = v ? 'rahmen-blob-3' : 'rahmen-blob-1'
  else if (slot === 5) tid = v ? 'rahmen-viereck-2' : 'rahmen-viereck-1'
  else if (slot === 6) tid = 'vollbild-grafik-schrift-2'
  else tid = v ? 'textmarker-2' : 'textmarker-1'
  return figmaTemplate(tid)!
}

const demoPhoto = (h: number) => `/cover/demo/${String((h % 10) + 1).padStart(2, '0')}.jpg`

type CoverDest = ShapesDest & { photos?: { url: string }[] }

export function DestCover({ dest, style }: { dest: CoverDest; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const cw = Math.round(el.getBoundingClientRect().width)
      if (cw > 0) setW(cw)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const template = templateFor(dest.id)
  const photo = dest.photos?.[0]?.url || demoPhoto(hash(dest.id))
  const teaser = dest.teaser || dest.highlights?.[0] || dest.name
  const cat = primaryTagOf(dest)
  const content: FigmaContent = {
    photo,
    slogan: hasMarker(template) ? teaser.split(' ').join('\n') : teaser,
    place: dest.place,
    stampCategory: cat,
    showStamp: STAMPS.has(cat),
    number: '', // Einzelziele: keine große Listen-Zahl (Rahmen Viereck)
  }

  return (
    <div
      ref={ref}
      style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', background: '#e9e4d8', ...style }}
    >
      {w > 0 && <FigmaCover template={template} content={content} width={w} />}
    </div>
  )
}
