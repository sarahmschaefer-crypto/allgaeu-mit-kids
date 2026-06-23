// lib/content/figma-cover.ts — bestimmt das Karten-Cover eines Ziels.
// Eine gespeicherte Builder-Auswahl (dest.figmaCover) gewinnt; sonst ein
// deterministisches Auto-Cover (gewichteter Vorlagen-Mix + Demo-Platzhalter).
// EINE Quelle für DestCover (Karte) und den Cover-Builder.
import { figmaTemplate, FIGMA_TEMPLATES, type FigmaTemplate, type FTLayer, type FTPhoto, type FTText, type FTMarker } from '@/lib/cover/figma-templates'
import type { FigmaContent } from '@/components/cover/FigmaCover'
import type { CoverColor } from '@/lib/cover/types'
import type { FigmaCoverChoice, CoverFrameShape } from '@/lib/content/types'
import { primaryTagOf, type ShapesDest } from '@/lib/shapes/data'

// Vorhandene Kategorie-Stempel (public/cover/stamps/<cat>.png).
export const COVER_STAMPS = new Set(['attraktion', 'ausflug', 'kreatives', 'kultur', 'schwimmen', 'shop', 'spielplatz', 'sport', 'tierpark', 'unterkunft'])
// Original-Figma-Platzhalterfoto (aus dem Cover-System extrahiert) — wird genutzt,
// solange ein Ziel noch kein echtes Foto hat. Die Schwester ersetzt es später.
export const PLACEHOLDER_PHOTO = '/cover/demo/figma.png'
export const DEMO_PHOTOS = [PLACEHOLDER_PHOTO]

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
export const autoDemoPhoto = (_id: string) => PLACEHOLDER_PHOTO

type CoverDest = ShapesDest & { photos?: { url: string }[]; figmaCover?: FigmaCoverChoice }

// Vorlagen, die der Builder zur Auswahl anbietet (alle 19 — die Redaktion entscheidet).
export const PICKER_TEMPLATES = FIGMA_TEMPLATES

// Editor-Paletten.
export const BRAND_COLORS: (CoverColor | 'white')[] = ['white', 'ink', 'pink', 'yellow', 'purple', 'orange', 'paper']
export const STICKER_GRAPHICS = ['logo', 'logo-bade', 'spots', 'footprints', 'path', 'blob1', 'blob2', 'blob3', 'blob4']
export const FRAME_SHAPES: { id: CoverFrameShape; label: string }[] = [
  { id: 'template', label: 'Wie Vorlage' },
  { id: 'rect', label: 'Viereck' },
  { id: 'circle', label: 'Kreis' },
  { id: 'blob1', label: 'Blob 1' },
  { id: 'blob2', label: 'Blob 2' },
  { id: 'blob3', label: 'Blob 3' },
  { id: 'blob4', label: 'Blob 4' },
  { id: 'none', label: 'Vollbild' },
]
export const STAMP_CATEGORIES = [...COVER_STAMPS]

// Wendet die Builder-Auswahl auf ein Basis-Template an → neues Template. EINE Stelle
// für alle Layer-Overrides; FigmaCover bleibt ein schlanker Renderer.
export function applyOverrides(base: FigmaTemplate, c?: FigmaCoverChoice): FigmaTemplate {
  if (!c) return base
  let layers: FTLayer[] = base.layers.map((l) => ({ ...l }))
  let bg = base.bg
  const photoIdx = layers.findIndex((l) => l.type === 'photo')
  const sloganIdx = layers.findIndex((l) => l.type === 'text' && l.field === 'slogan')

  // Ebene 1+2: Foto/Farbfläche + Rahmen-Form
  if (photoIdx >= 0) {
    const p = { ...(layers[photoIdx] as FTPhoto) }
    if (c.fillMode === 'color') p.fillColor = (c.fillColor as CoverColor) ?? 'purple'
    else if (c.fillMode === 'photo') p.fillColor = undefined
    if (c.frameShape && c.frameShape !== 'template') {
      if (c.frameShape === 'none') {
        p.x = 0; p.y = 0; p.w = 1080; p.h = 1350; p.mask = undefined; p.radius = undefined
      } else {
        // Rahmen behält Randabstand (klebt nicht am Cover-Rand). Ein Vollbild-Foto
        // wird auf einen eingerückten Rahmen (60px Rand) gebracht; ein bereits
        // gerahmtes Foto behält seine Vorlagen-Geometrie.
        const fullBleed = p.x <= 20 && p.y <= 20 && p.w >= 1060 && p.h >= 1300
        if (fullBleed) {
          if (c.frameShape === 'circle') { p.x = 60; p.y = 195; p.w = 960; p.h = 960 }
          else { p.x = 60; p.y = 60; p.w = 960; p.h = 1230 }
        }
        if (c.frameShape === 'rect') { p.mask = undefined; p.radius = [40, 40, 40, 40] }
        else if (c.frameShape === 'circle') { const r = Math.round(Math.min(p.w, p.h) / 2); p.mask = undefined; p.radius = [r, r, r, r] }
        else { p.mask = c.frameShape; p.radius = undefined } // blob1..4
      }
    }
    layers[photoIdx] = p
  } else if (c.fillMode === 'color' && c.fillColor) {
    bg = c.fillColor as CoverColor
  }

  // Ebene 3: Scrim an/aus + Stärke
  if (c.scrim !== undefined && photoIdx >= 0) {
    const p = { ...(layers[photoIdx] as FTPhoto) }
    if (c.scrim && c.scrim > 0) {
      const y = p.scrim?.y ?? Math.round(p.y + p.h * 0.52)
      const h = p.scrim?.h ?? Math.round(p.h * 0.48)
      p.scrim = { y, h, to: c.scrim }
    } else p.scrim = undefined
    layers[photoIdx] = p
  }

  // Ebene 6: Schrift (Position, Farbbalken, Marker-Umschaltung)
  if (sloganIdx >= 0) {
    const s = { ...(layers[sloganIdx] as FTText) }
    if (c.textPos) { s.x = Math.round(c.textPos.x); s.y = Math.round(c.textPos.y) }
    if (c.textBar) s.bar = c.textBar as CoverColor
    if (c.sloganColor) s.color = c.sloganColor as CoverColor | 'white'
    layers[sloganIdx] = s
    if (c.textMarker) {
      const m: FTMarker = {
        type: 'marker', x: s.x, y: s.y, gap: 12, size: 100,
        barColor: (c.barColor as CoverColor) ?? 'purple', textColor: (c.sloganColor as CoverColor) ?? 'white',
        pad: [10, 24, 12, 24], radius: 14, tracking: -1,
        align: s.align === 'center' ? 'center' : 'left', w: s.align === 'center' ? 1080 : undefined,
      }
      layers[sloganIdx] = m
    }
  }

  // Ebene 6b: Eyebrow/Overline — sichtbar machen (Layer ergänzen, falls keiner)
  // + per Drag verschiebbar.
  const overlineIdx = layers.findIndex((l) => l.type === 'text' && l.field === 'overline')
  if (overlineIdx >= 0) {
    if (c.overlinePos) {
      const o = { ...(layers[overlineIdx] as FTText) }
      o.x = Math.round(c.overlinePos.x); o.y = Math.round(c.overlinePos.y)
      layers[overlineIdx] = o
    }
  } else if (c.overline) {
    const sl = layers.find((l) => (l.type === 'text' && l.field === 'slogan') || l.type === 'marker')
    const defX = (sl?.x ?? 60) + 19
    const defY = sl ? Math.max(40, sl.y - 126) : 820
    layers.push({
      type: 'text', field: 'overline',
      x: Math.round(c.overlinePos?.x ?? defX), y: Math.round(c.overlinePos?.y ?? defY), w: 922,
      size: 41.5, color: 'white', font: 'nunito', lh: 1, tracking: 6.64, upper: true, weight: 700,
    })
  }

  // Marker-/Bandarolen-Farbe (auf vorhandene Marker + Bänder)
  if (c.barColor) {
    layers = layers.map((l) =>
      l.type === 'marker' ? { ...l, barColor: c.barColor as CoverColor }
      : l.type === 'band' ? { ...l, color: c.barColor as CoverColor }
      : l,
    )
  }

  // Ebene 4: zusätzliche Brand-Grafiken (Sticker)
  if (c.stickers?.length) {
    for (const st of c.stickers) {
      const w = Math.round(st.scale * 1080)
      layers.push({ type: 'graphic', asset: st.asset, x: Math.round(st.x * 1080 - w / 2), y: Math.round(st.y * 1350 - w / 2), w, rot: st.rot })
    }
  }

  return { ...base, bg, layers }
}

export function resolveFigmaCover(dest: CoverDest): { template: FigmaTemplate; content: FigmaContent } {
  const c = dest.figmaCover
  const base = figmaTemplate(c?.templateId || '') ?? figmaTemplate(autoTemplateId(dest.id))!
  const template = applyOverrides(base, c)
  const photo = c?.photoUrl || dest.photos?.[0]?.url || PLACEHOLDER_PHOTO
  const teaser = (c?.slogan ?? dest.teaser ?? dest.highlights?.[0] ?? dest.name) || dest.name
  const cat = c?.stampCategory || primaryTagOf(dest)
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
