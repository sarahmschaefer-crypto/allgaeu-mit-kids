// app/quiz/page.tsx
import type { Metadata } from 'next'
import { ShapesBar } from '@/components/shapes/ShapesBar'
import { QuizFlow } from '@/components/shapes/QuizFlow'

export const metadata: Metadata = {
  title: 'Finde den passenden Ausflug',
  description: 'Beantworte ein paar Fragen und finde die besten Allgäuer Ausflugsziele für deine Familie.',
}

export default function QuizPage() {
  return (
    <div className="shapes-root">
      <ShapesBar active="quiz" />
      <main>
        <QuizFlow />
      </main>
    </div>
  )
}
