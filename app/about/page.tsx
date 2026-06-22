// app/about/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Über uns',
  description: 'Wer hinter Allgäu mit Kids steckt und warum wir diese Plattform gebaut haben.',
}

const TEAM = [
  {
    name: 'Sarah M.',
    role: 'Gründerin & Allgäu-Fan',
    text: 'Aufgewachsen im Oberallgäu, zwei Kinder, zu viele Wanderschuhe. Ich kenne fast jeden Badesee und jeden Spielplatz zwischen Kempten und Oberstdorf.',
    emoji: '🏔️',
  },
  {
    name: 'Markus B.',
    role: 'Redaktion & Fotografie',
    text: 'Vater von drei Kindern, leidenschaftlicher Fotograf. Ich teste alle Ausflugsziele persönlich – meine Familie begleitet mich dabei meistens freiwillig.',
    emoji: '📷',
  },
]

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16 space-y-24">

        {/* Intro */}
        <div className="max-w-2xl space-y-6">
          <p className="label">Über uns</p>
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Wir kennen<br />das Allgäu<br />
            <span style={{ color: 'var(--accent)' }}>wie unsere Kinder.</span>
          </h1>
          <hr className="lofi-divider" />
          <p className="text-lg leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Allgäu mit Kids ist eine unabhängige Plattform für Familien, die in der Region wohnen
            oder sie besuchen. Wir sammeln, testen und beschreiben Ausflugsziele — ehrlich, persönlich
            und ohne bezahlte Werbung.
          </p>
          <p className="text-base leading-relaxed" style={{ color: 'var(--ink-soft)' }}>
            Angefangen hat alles mit einer privaten Liste in den Notizen von Sarahs iPhone.
            Irgendwann wurde daraus eine Website — und jetzt bist du hier.
          </p>
        </div>

        {/* Team */}
        <div className="space-y-8">
          <p className="label">Die Menschen dahinter</p>
          <div className="grid md:grid-cols-2 gap-8">
            {TEAM.map(({ name, role, text, emoji }) => (
              <div key={name} className="surface p-8 space-y-4">
                <div className="text-5xl">{emoji}</div>
                <div>
                  <h2 className="text-xl font-bold">{name}</h2>
                  <p className="label mt-1" style={{ color: 'var(--ink-mute)' }}>{role}</p>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--ink-soft)' }}>{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Mission */}
        <div className="surface--accent p-10 space-y-6 relative">
          <p className="label">Unsere Mission</p>
          <blockquote className="text-2xl md:text-3xl font-bold leading-snug">
            „Jede Familie im Allgäu soll wissen, wohin sie am Wochenende fahren kann — ohne stundenlang zu googeln."
          </blockquote>
          <p className="text-sm" style={{ color: 'var(--ink-soft)' }}>
            Deshalb gibt es Allgäu mit Kids: eine kuratierte, ehrliche und immer aktuelle Übersicht
            für alle, die das Allgäu mit Kindern erkunden wollen.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4 py-8">
          <p className="text-2xl font-bold">
            Neugierig geworden?
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/entdecken" className="btn btn--primary">
              Ausflugsziele entdecken →
            </Link>
            <Link href="/kontakt" className="btn btn--ghost">
              Schreib uns
            </Link>
          </div>
        </div>

      </main>
      <Footer />
    </>
  )
}
