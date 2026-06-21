// lib/content/public.ts — öffentliche Datenquelle (Server-only).
// Liefert NUR veröffentlichte Ziele aus dem Store, in der Form, die die öffentlichen
// Komponenten erwarten (ShapesDest; ContentDest ist ein Superset). Entwürfe (Drive-
// Importe vor Freigabe) erscheinen NICHT.
import { getAllDests } from '@/lib/content/store'
import type { ShapesDest } from '@/lib/shapes/data'

export async function getPublicDests(): Promise<ShapesDest[]> {
  return (await getAllDests()).filter((d) => d.published)
}
