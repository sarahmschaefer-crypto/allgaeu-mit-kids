// app/sammeln/page.tsx — the sticker album (kid-friendly collecting)
import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { Sammelalbum } from '@/components/shapes/Sammelalbum'

export const metadata: Metadata = {
  title: 'Euer Sammelalbum',
  description: 'Tippt euch durchs Allgäu und sammelt eure Lieblings-Ausflugsziele im Album.',
}

export default function SammelnPage() {
  // /sammeln vorerst deaktiviert → leitet auf die Filterseite. REVERSIBEL: nächste Zeile
  // entfernen, dann ist das Sammelalbum wieder erreichbar (Code unten bleibt erhalten).
  redirect('/entdecken')
  return (
    <div className="shapes-root">
      <ShapesBar active="sammeln" />
      <main>
        <Sammelalbum />
      </main>
    </div>
  )
}
