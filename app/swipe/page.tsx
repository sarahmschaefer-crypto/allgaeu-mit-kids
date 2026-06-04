// app/swipe/page.tsx
import type { Metadata } from 'next'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { SwipeDeck } from '@/components/shapes/SwipeDeck'

export const metadata: Metadata = {
  title: 'Swipe dich durch die Region',
  description: 'Blättere durch Allgäuer Ausflugsziele und merke dir deine Favoriten.',
}

export default function SwipePage() {
  return (
    <div className="shapes-root">
      <ShapesBar active="swipe" />
      <main>
        <SwipeDeck />
      </main>
    </div>
  )
}
