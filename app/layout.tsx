// app/layout.tsx
import type { Metadata } from 'next'
import { Courier_Prime, Source_Code_Pro, Lora } from 'next/font/google'
import './globals.css'

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
      <body className="min-h-screen">
        {children}
      </body>
    </html>
  )
}
