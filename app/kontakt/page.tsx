// app/kontakt/page.tsx — Kontakt im Magazin-Stil (wie Detail-View), ohne Formular.
import type { Metadata } from 'next'
import Link from 'next/link'
import { ShapesBar } from '@/components/shapes/ShapesBar'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Tipp einreichen, Frage stellen oder einfach Hallo sagen.',
}

export default function KontaktPage() {
  return (
    <div className="shapes-root">
      <ShapesBar />
      <main className="mag fade-in">
        <Link href="/" className="kicker mag-back">
          ← Zurück zur Startseite
        </Link>

        <header className="mag-top">
          <div className="mag-headcol">
            <div className="kicker mag-eyebrow">Kontakt</div>
            <h1 className="mag-headline">
              Sag <span style={{ color: 'var(--brand-purple)' }}>Hallo.</span>
            </h1>
          </div>
          <div className="mag-introcol">
            <hr className="mag-hair" />
            <p className="mag-intro">
              Kennst du ein Ausflugsziel, das hier noch fehlt? Hast du einen Fehler entdeckt? Oder
              willst du einfach Hallo sagen? Ich freue mich über jede Nachricht.
            </p>
          </div>
        </header>

        <section className="mag-block">
          <div className="mag-prose">
            <p>
              Egal ob du ein neues Ausflugsziel vorschlagen, einen Fehler oder veraltete Infos
              melden, eine Kooperation anfragen oder einfach Hallo sagen möchtest – schreib mir
              gern direkt per Mail.
            </p>
          </div>

          <div>
            <h2 className="mag-h2">Direkt per Mail</h2>
            <p className="mag-lead">
              <a href="mailto:allgaeumitkids@gmail.com" style={{ color: 'var(--accent)' }}>
                allgaeumitkids@gmail.com
              </a>
            </p>
          </div>
        </section>
      </main>
    </div>
  )
}
