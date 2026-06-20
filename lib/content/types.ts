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

// Redaktionelle Detail-Overrides: leer = aus den Basisdaten abgeleitet (detailInfo()).
export type DestOverrides = {
  adresse?: string
  oeffnungszeiten?: string
  preis?: string
}

export type ContentDest = ShapesDest & {
  photos: DestPhoto[]
  cover: CoverSpec
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
