// app/kontakt/page.tsx
import type { Metadata } from 'next'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import KontaktForm from '@/components/KontaktForm'

export const metadata: Metadata = {
  title: 'Kontakt',
  description: 'Tipp einreichen, Frage stellen oder einfach hallo sagen.',
}

export default function KontaktPage() {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-2 gap-16 items-start">

          {/* Left: text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="label">Kontakt</p>
              <h1 className="text-5xl font-bold leading-tight">
                Sag<br />
                <span style={{ color: 'var(--terra)' }}>Hallo.</span>
              </h1>
            </div>

            <hr className="lofi-divider" />

            <div className="space-y-6" style={{ color: 'var(--ink-soft)' }}>
              <p className="text-base leading-relaxed">
                Kennst du ein Ausflugsziel, das hier noch fehlt? Hast du einen Fehler entdeckt?
                Oder willst du einfach Hallo sagen? Schreib uns — wir freuen uns über jede Nachricht.
              </p>
              <div className="space-y-3">
                {[
                  { icon: '📍', label: 'Neues Ausflugsziel vorschlagen' },
                  { icon: '✏️', label: 'Fehler oder veraltete Infos melden' },
                  { icon: '🤝', label: 'Kooperation anfragen' },
                  { icon: '💬', label: 'Einfach Hallo sagen' },
                ].map(({ icon, label }) => (
                  <div key={label} className="flex items-center gap-3">
                    <span className="text-xl">{icon}</span>
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct email */}
            <div className="surface p-5">
              <p className="label mb-2" style={{ color: 'var(--ink-mute)' }}>Direkt per Mail</p>
              <a
                href="mailto:hallo@allgaeu-mit-kids.de"
                className="font-bold text-sm hover:underline"
                style={{ fontFamily: 'var(--font-body)', color: 'var(--accent)' }}
              >
                hallo@allgaeu-mit-kids.de
              </a>
            </div>
          </div>

          {/* Right: form */}
          <KontaktForm />

        </div>
      </main>
      <Footer />
    </>
  )
}
