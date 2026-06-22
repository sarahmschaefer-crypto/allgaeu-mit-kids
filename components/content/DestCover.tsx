// components/content/DestCover.tsx — echtes Cover eines Ziels als responsives 4:5-Bild.
// Nutzt den cover-tool-Renderer (FigmaCover, 1:1 Figma-Templates). Ziele MIT Foto →
// Foto-Template, OHNE Foto → Farbflächen-Template (sauberes buntes Cover). Auto-Wahl
// deterministisch per id-Hash, damit jedes Ziel ein stabiles Template hat.
// Dies ersetzt die Interim-Vorschau (DestPreview); der Schicht-Editor kommt in Phase 10.
import type { CSSProperties } from 'react'
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
    <div style={{ width: '100%', containerType: 'inline-size', aspectRatio: '4 / 5', overflow: 'hidden', background: '#e9e4d8', ...style }}>
      <div style={{ width: 1080, height: 1350, transform: 'scale(calc(100cqw / 1080))', transformOrigin: 'top left' }}>
        <FigmaCover template={template} content={content} width={1080} />
      </div>
    </div>
  )
}
