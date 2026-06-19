// lib/content/cover.ts — Auto-Cover-Entwurf + Defaults.
// Erzeugt aus einem Ziel einen ersten Cover-Entwurf (Foto/Farbe + Slogan +
// Kategorie-Stempel), der danach im Editor frei angepasst wird.
import { TYPES, primaryTagOf, type ShapesDest } from '@/lib/shapes/data'
import type { CoverSpec, DestPhoto } from '@/lib/content/types'

const TAG_COLORS = TYPES as Record<string, { color: string }>

// Heller Brand-Farbton der Hauptkategorie als Fallback-Fläche, wenn (noch) kein
// Foto vorhanden ist.
export function tagColor(dest: ShapesDest): string {
  return TAG_COLORS[primaryTagOf(dest)]?.color ?? '#9ba1ff'
}

export function coverFromDest(dest: ShapesDest, photos: DestPhoto[] = []): CoverSpec {
  const hasPhoto = photos.length > 0
  const slogan = dest.teaser || dest.highlights?.[0] || dest.name
  return {
    format: 'feed',
    bg: hasPhoto
      ? { type: 'photo', photoUrl: photos[0].url }
      : { type: 'color', color: tagColor(dest) },
    // Foto braucht Scrim für Lesbarkeit, Farbfläche nicht.
    scrim: hasPhoto ? 0.42 : 0,
    slogan,
    sloganColor: hasPhoto ? 'white' : 'ink',
    sloganSize: 1,
    sloganBar: false,
    sloganBarColor: 'ink',
    stamp: primaryTagOf(dest),
  }
}
