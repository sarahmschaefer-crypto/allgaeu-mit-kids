// app/layout.tsx
// Schriften kommen komplett über den Google-Fonts <link> unten:
// Playfair Display (Display), Nunito (Body), JetBrains Mono (Mono).
// Die alten Lo-Fi-Loader (Courier Prime, Lora, Source Code Pro) wurden mit dem
// Legacy-System entfernt — keine Konsumenten mehr.
import type { Metadata } from 'next'
import './globals.css'
import './story.css'
import './shapes.css'
import { ContentProvider } from '@/components/content/ContentProvider'
import { getPublicDests } from '@/lib/content/public'

export const metadata: Metadata = {
  title: {
    default: 'Allgäu mit Kids',
    template: '%s | Allgäu mit Kids',
  },
  description: 'Die schönsten Ausflugsziele im Allgäu für Familien mit Kindern. Badeseen, Spielplätze, Wanderungen und mehr.',
  openGraph: {
    title: 'Allgäu mit Kids',
    description: 'Die schönsten Ausflugsziele im Allgäu für Familien mit Kindern.',
    locale: 'de_DE',
    type: 'website',
  },
  robots: { index: true, follow: true },
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const dests = await getPublicDests()
  return (
    <html lang="de">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Serif+Display&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        <ContentProvider dests={dests}>{children}</ContentProvider>
      </body>
    </html>
  )
}
