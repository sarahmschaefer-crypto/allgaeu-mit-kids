'use client'
// components/content/DestCover.tsx — echtes Cover eines Ziels als responsives 4:5-Bild.
// Nutzt den cover-tool-Renderer (FigmaCover, 1:1 Figma-Templates). FigmaCover braucht eine
// NUMERISCHE Breite (skaliert intern via scale(width/1080)) → wir messen die Containerbreite
// per ResizeObserver. Ziel mit Foto → Foto-Template, ohne Foto → Farbflächen-Template.
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FIGMA_TEMPLATES, type FigmaTemplate } from '@/lib/cover/figma-templates'
import { FigmaCover, type FigmaContent } from '@/components/cover/FigmaCover'
import { primaryTagOf, type ShapesDest } from '@/lib/shapes/data'

// Vorhandene Kategorie-Stempel (public/cover/stamps/<cat>.png) — Rest: kein Stempel.
const STAMPS = new Set(['attraktion', 'ausflug', 'kreatives', 'kultur', 'schwimmen', 'shop', 'spielplatz', 'sport', 'tierpark', 'unterkunft'])

const noNumber = (t: FigmaTemplate) => !t.needs?.number
const hasPhotoLayer = (t: FigmaTemplate) => t.layers.some((l) => l.type === 'photo')
const hasMarker = (t: FigmaTemplate) => t.layers.some((l) => l.type === 'marker')

const PHOTO_POOL = FIGMA_TEMPLATES.filter((t) => noNumber(t) && hasPhotoLayer(t))
const COLOR_POOL = FIGMA_TEMPLATES.filter((t) => noNumber(t) && !hasPhotoLayer(t))

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0
  return h
}

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
    measure() // sofort messen (ResizeObserver feuert beim Mount nicht überall zuverlässig)
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const photo = dest.photos?.[0]?.url
  const pool = photo ? PHOTO_POOL : COLOR_POOL
  const template = pool[hash(dest.id) % pool.length]
  const teaser = dest.teaser || dest.highlights?.[0] || dest.name
  const cat = primaryTagOf(dest)
  const content: FigmaContent = {
    photo,
    slogan: hasMarker(template) ? teaser.split(' ').join('\n') : teaser,
    place: dest.place,
    stampCategory: cat,
    showStamp: STAMPS.has(cat),
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
