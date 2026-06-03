// app/entdecken/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import EntdeckenClient from '@/components/EntdeckenClient'

export const metadata: Metadata = {
  title: 'Ausflugsziele entdecken',
  description: 'Alle Ausflugsziele im Allgäu für Familien – filtern nach Kategorie, Region, Alter und Kosten.',
}

export default function EntdeckenPage() {
  return (
    <>
      <Header />
      <main>
        <EntdeckenClient />
      </main>
      <Footer />
    </>
  )
}
