// app/impressum/page.tsx — Rechtliches im Magazin-Stil (wie Detail-View).
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShapesBar } from '@/components/shapes/ShapesBar'

export const metadata: Metadata = {
  title: 'Impressum',
  description: 'Impressum und rechtliche Angaben zu Allgäu mit Kids.',
}

export default function ImpressumPage() {
  return (
    <div className="shapes-root">
      <ShapesBar />
      <main className="mag fade-in">
        <Link href="/" className="kicker mag-back">
          ← Zurück zur Startseite
        </Link>

        <header className="mag-top">
          <div className="mag-headcol">
            <div className="kicker mag-eyebrow">Rechtliches</div>
            <h1 className="mag-headline">Impressum</h1>
          </div>
          <div className="mag-introcol">
            <hr className="mag-hair" />
            <p className="mag-intro">Angaben gemäß § 5 TMG.</p>
          </div>
        </header>

        <section className="mag-legal">
          <div>
            <h2>Angaben gemäß § 5 TMG</h2>
            <p>
              Purista Merk, Journalistin<br />
              Höhenweg 9<br />
              82269 Geltendorf
            </p>
          </div>

          <div>
            <h2>Kontakt</h2>
            <p>
              Telefon: <a href="tel:017661535439">017661535439</a><br />
              E-Mail: <a href="mailto:allgaeumitkids@gmail.com">allgaeumitkids@gmail.com</a>
            </p>
          </div>

          <div>
            <h2>Berufsbezeichnung und berufsrechtliche Regelungen</h2>
            <p>Berufsbezeichnung: Journalistin</p>
          </div>

          <div>
            <h2>Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h2>
            <p>
              Purista Merk<br />
              Höhenweg 9<br />
              82269 Geltendorf
            </p>
          </div>

          <div>
            <h2>Verbraucherstreitbeilegung / Universalschlichtungsstelle</h2>
            <p>
              Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
