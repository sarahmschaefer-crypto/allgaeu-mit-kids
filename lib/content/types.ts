// lib/content/types.ts — Content-Modell fürs Admin-CMS.
// ContentDest = die heutige ShapesDest + redaktionell editierbare Zusatzfelder
// (Fotos, Cover, Detail-Overrides). Bewusst ein SUPERSET von ShapesDest, damit
// die öffentliche Seite (die ShapesDest erwartet) unverändert weiterläuft.
import type { ShapesDest } from '@/lib/shapes/data'

// Brand-Farben fürs Cover (aus CLAUDE.md: Ink-Navy + White).
export const COVER_COLORS = {
  ink: '#070E70',
  white: '#ffffff',
} as const
export type CoverColor = keyof typeof COVER_COLORS

// Interim-Cover-Spec für Phase 1. Bewusst klein gehalten und klar benannt; in
// Phase 5 wird sie auf den echten CoverSpec aus lib/cover/* (Branch cover-tool)
// abgebildet. Schichten-Modell (hinten→vorn): Hintergrund · Scrim · Slogan(+Balken) · Stempel.
export type CoverSpec = {
  format: 'feed' // Phase 1: nur Feed (4:5). Reel (9:16) folgt mit echtem Renderer.
  bg: { type: 'photo'; photoUrl: string } | { type: 'color'; color: string }
  scrim: number // 0..1, dunkler Verlauf von unten für Lesbarkeit
  slogan: string // Werbeschrift/Slogan (NICHT der Ortsname)
  sloganColor: CoverColor
  sloganSize: number // relativer Faktor 0.7..1.6 (Slider)
  sloganBar: boolean // optionaler Farbbalken hinter der Schrift
  sloganBarColor: CoverColor
  stamp: string | null // Kategorie-Stempel (Tag-Id), immer oben rechts; null = aus
}

export type DestPhoto = { url: string; alt?: string }

// Frei platzierte Brand-Grafik (Sticker). Position 0..1 relativ zur Cover-Fläche
// (Mittelpunkt), scale = Breite relativ zur Cover-Breite.
export type CoverSticker = { asset: string; x: number; y: number; scale: number; rot?: number }
export type CoverFrameShape = 'template' | 'rect' | 'circle' | 'blob1' | 'blob2' | 'blob3' | 'blob4' | 'none'

// Im Cover-Builder gespeicherte Auswahl — JEDER Layer überschreibbar (Phase 10 /
// Increment 2). Alles optional → fehlt ein Wert, greift der Template-Default bzw.
// das deterministische Auto-Cover (resolveFigmaCover). Wird als JSON in der DB abgelegt.
export type FigmaCoverChoice = {
  templateId?: string                 // eine der FIGMA_TEMPLATES-IDs (Voreinstellung)
  // ── Ebene 1: Foto / Farbfläche ──
  fillMode?: 'photo' | 'color'        // Foto ODER Farbfläche
  fillColor?: string                  // CoverColor, wenn fillMode='color'
  photoUrl?: string                   // gewähltes Foto (Upload oder Platzhalter)
  focal?: { x: number; y: number }    // 0..1 Foto-Fokus (verschieben)
  photoZoom?: number                  // 1 = normal, >1 reinzoomen
  // ── Ebene 2: Rahmen-Form ──
  frameShape?: CoverFrameShape        // organische Blobs / Viereck / Kreis / keiner
  // ── Ebene 3: Scrim ──
  scrim?: number | null               // 0..1 Stärke; null/0 = aus; fehlt = Template-Default
  // ── Ebene 4: Brand-Grafiken (zusätzlich) ──
  stickers?: CoverSticker[]
  // ── Ebene 5: Kategorie-Stempel ──
  showStamp?: boolean
  stampCategory?: string              // welcher Stempel (sonst echte Kategorie)
  // ── Ebene 6: Schrift ──
  slogan?: string
  overline?: string
  number?: string
  fontScale?: number                  // Slogan-Größe × (0.6..1.5)
  sloganColor?: string                // CoverColor | 'white'
  textPos?: { x: number; y: number }  // Slogan per Drag verschoben (1080-Raum, Ebenen-Ursprung)
  textMarker?: boolean                // Slogan als Marker-Balken darstellen
  barColor?: string                   // Marker-/Bandarolen-Balkenfarbe (CoverColor)
  textBar?: string | null             // Farbbalken hinter dem Slogan (CoverColor); fehlt/null = keiner
}

// Redaktionelle Detail-Overrides: leer = aus den Basisdaten abgeleitet (detailInfo()).
export type DestOverrides = {
  adresse?: string
  oeffnungszeiten?: string
  preis?: string
}

export type ContentDest = ShapesDest & {
  photos: DestPhoto[]
  cover: CoverSpec
  figmaCover?: FigmaCoverChoice // im Cover-Builder gestaltetes Karten-Cover (sonst Auto)
  overrides: DestOverrides
  // Redaktioneller Langtext der Schwester (voller „Reisebericht" aus dem Drive-docx)
  // + praktische Hinweise (Tipps). `blurb` bleibt die Kurzfassung für Karten/Meta.
  description?: string
  tips?: string
  // Nur veröffentlichte Ziele erscheinen später auf der öffentlichen Seite (Phase 3).
  // Kuratierte Basis (data.ts-Seed) = true; Drive-Importe starten als Entwurf (false).
  published: boolean
}

export type ContentStore = {
  version: number
  dests: ContentDest[]
}
