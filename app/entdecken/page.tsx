// app/entdecken/page.tsx — Shapes-styled filter/browse on the unified dataset
import type { Metadata } from 'next'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { FilterBrowse } from '@/components/shapes/FilterBrowse'
import { CATEGORIES } from '@/lib/shapes/data'

export const metadata: Metadata = {
  title: 'Ausflugsziele entdecken',
  description: 'Alle Ausflugsziele im Allgäu für Familien – filtern nach Alter, Aktivität, Zeit und Budget.',
}

export default async function EntdeckenPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>
}) {
  const { cat } = await searchParams
  const valid = cat && cat in CATEGORIES ? [cat] : []
  return (
    <div className="shapes-root">
      <ShapesBar active="entdecken" />
      <main>
        <FilterBrowse initialCats={valid} />
      </main>
    </div>
  )
}
