// app/karte/page.tsx
import type { Metadata } from 'next'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { MapExplore } from '@/components/shapes/MapExplore'

export const metadata: Metadata = {
  title: 'Ausflugsziele auf der Karte',
  description: 'Allgäuer Ausflugsziele für Familien auf einer Karte entdecken.',
}

export default function KartePage() {
  return (
    <div className="shapes-root">
      <ShapesBar active="karte" />
      <main>
        <MapExplore />
      </main>
    </div>
  )
}
