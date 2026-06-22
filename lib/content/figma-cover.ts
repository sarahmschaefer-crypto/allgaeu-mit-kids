// lib/content/figma-cover.ts — bestimmt das Karten-Cover eines Ziels.
// Eine gespeicherte Builder-Auswahl (dest.figmaCover) gewinnt; sonst ein
// deterministisches Auto-Cover (gewichteter Vorlagen-Mix + Demo-Platzhalter).
// EINE Quelle für DestCover (Karte) und den Cover-Builder.
import { figmaTemplate, FIGMA_TEMPLATES, type FigmaTemplate } from '@/lib/cover/figma-templates'
import type { FigmaContent } from '@/components/cover/FigmaCover'
import type { CoverColor } from '@/lib/cover/types'
import type { FigmaCoverChoice } from '@/lib/content/types'
import { primaryTagOf, type ShapesDest } from '@/lib/shapes/data'

// Vorhandene Kategorie-Stempel (public/cover/stamps/<cat>.png).
export const COVER_STAMPS = new Set(['attraktion', 'ausflug', 'kreatives', 'kultur', 'schwimmen', 'shop', 'spielplatz', 'sport', 'tierpark', 'unterkunft'])
export const DEMO_PHOTOS = Array.from({ length: 10 }, (_, i) => `/cover/demo/${String(i + 1).padStart(2, '0')}.jpg`)

export const hasMarker = (t: FigmaTemplate) => t.layers.some((l) => l.type === 'marker')
export const hasPhotoLayer = (t: FigmaTemplate) => t.layers.some((l) => l.type === 'photo')
export const needsNumber = (t: FigmaTemplate) => !!t.needs?.number

// FNV-1a — gute Streuung auch in den unteren Bits.
function fnv(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) }
  return h >>> 0
}

// Gewichteter Vorlagen-Mix (Sarah): 3× Vollbild : je 1× Bandarole / Rahmen Blob /
// Rahmen Viereck / Vollbild Grafik&Schrift 2 / Textmarker. Hohe Hash-Bits → gleichmäßig.
export function autoTemplateId(id: string): string {
  const h = fnv(id), slot = (h >>> 16) % 8, v = (h >> 3) & 1
  if (slot < 3) return 'vollbild-einfach'
  if (slot === 3) return v ? 'bandarole-2' : 'bandarole-1'
  if (slot === 4) return v ? 'rahmen-blob-3' : 'rahmen-blob-1'
  if (slot === 5) return v ? 'rahmen-viereck-2' : 'rahmen-viereck-1'
  if (slot === 6) return 'vollbild-grafik-schrift-2'
  return v ? 'textmarker-2' : 'textmarker-1'
}
export const autoDemoPhoto = (id: string) => DEMO_PHOTOS[fnv(id) % DEMO_PHOTOS.length]

type CoverDest = ShapesDest & { photos?: { url: string }[]; figmaCover?: FigmaCoverChoice }

// Vorlagen, die der Builder zur Auswahl anbietet (alle 19 — die Redaktion entscheidet).
export const PICKER_TEMPLATES = FIGMA_TEMPLATES

export function resolveFigmaCover(dest: CoverDest): { template: FigmaTemplate; content: FigmaContent } {
  const c = dest.figmaCover
  const template = figmaTemplate(c?.templateId || '') ?? figmaTemplate(autoTemplateId(dest.id))!
  const photo = c?.photoUrl || dest.photos?.[0]?.url || autoDemoPhoto(dest.id)
  const teaser = (c?.slogan ?? dest.teaser ?? dest.highlights?.[0] ?? dest.name) || dest.name
  const cat = primaryTagOf(dest)
  const content: FigmaContent = {
    photo,
    focal: c?.focal,
    photoZoom: c?.photoZoom,
    fontScale: c?.fontScale,
    sloganColor: c?.sloganColor as CoverColor | 'white' | undefined,
    slogan: hasMarker(template) ? teaser.split(' ').join('\n') : teaser,
    overline: c?.overline,
    place: dest.place,
    number: c?.number ?? '',
    stampCategory: cat,
    showStamp: c?.showStamp ?? COVER_STAMPS.has(cat),
  }
  return { template, content }
}
