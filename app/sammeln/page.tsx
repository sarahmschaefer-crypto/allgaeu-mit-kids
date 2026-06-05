// app/sammeln/page.tsx — the sticker album (kid-friendly collecting)
import type { Metadata } from 'next'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { Sammelalbum } from '@/components/shapes/Sammelalbum'

export const metadata: Metadata = {
  title: 'Euer Sammelalbum',
  description: 'Tippt euch durchs Allgäu und sammelt eure Lieblings-Ausflugsziele im Album.',
}

export default function SammelnPage() {
  return (
    <div className="shapes-root">
      <ShapesBar active="sammeln" />
      <main>
        <Sammelalbum />
      </main>
    </div>
  )
}
