// app/layout.tsx
import type { Metadata } from 'next'
import { Courier_Prime, Source_Code_Pro, Lora } from 'next/font/google'
import './globals.css'
import './story.css'
import './shapes.css'

const courierPrime = Courier_Prime({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-courier',
  display: 'swap',
})

const sourceCodePro = Source_Code_Pro({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-source-code',
  display: 'swap',
})

const lora = Lora({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
})

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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de" className={`${courierPrime.variable} ${sourceCodePro.variable} ${lora.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=DM+Serif+Display&family=Nunito:ital,wght@0,400;0,500;0,600;0,700;0,800;1,500&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
