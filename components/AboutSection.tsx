// components/AboutSection.tsx
import Link from 'next/link'

export default function AboutSection() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-24">
      <div className="grid md:grid-cols-2 gap-16 items-center">

        {/* Text */}
        <div className="space-y-6">
          <p className="label">Über Allgäu mit Kids</p>
          <h2 className="text-4xl md:text-5xl font-bold" style={{ fontFamily: 'var(--font-courier)' }}>
            Entdeckt von<br />Familien, gemacht<br />
            <span style={{ color: '#B49139' }}>für Familien</span>
          </h2>
          <hr className="lofi-divider my-6" />
          <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
            Wir sind Eltern aus dem Allgäu, die die schönsten Ecken der Region kennen —
            und sie mit euch teilen wollen. Kein Tourismus-Hochglanz, keine bezahlten Empfehlungen.
            Nur ehrliche Tipps von Menschen, die das Allgäu lieben.
          </p>
          <p className="text-base leading-relaxed" style={{ fontFamily: 'var(--font-lora)' }}>
            Ob Badesee, Spielplatz, Bergbahn oder Alpaka-Farm: Hier findet ihr Ausflugsziele,
            die wirklich für Familien taugen.
          </p>
          <Link href="/entdecken" className="lofi-btn inline-flex mt-4">
            Alle Ausflugsziele →
          </Link>
        </div>

        {/* Visual card */}
        <div className="relative">
          <div className="lofi-card p-8 space-y-4">
            <p className="label">Was ihr findet</p>
            {[
              ['11', 'Kategorien'],
              ['5', 'Regionen'],
              ['Kostenlos', 'bis günstig bis bezahlt'],
              ['0–3', 'bis 12+ Jahre'],
            ].map(([num, desc]) => (
              <div key={num} className="flex items-baseline gap-3 border-b border-dashed border-ink/30 pb-3 last:border-0 last:pb-0">
                <span
                  className="text-2xl font-bold"
                  style={{ fontFamily: 'var(--font-courier)', color: '#B49139' }}
                >
                  {num}
                </span>
                <span className="text-sm" style={{ fontFamily: 'var(--font-lora)' }}>{desc}</span>
              </div>
            ))}
          </div>
          {/* Decorative offset */}
          <div
            className="absolute inset-0 -z-10 border-2 border-ink/20"
            style={{ transform: 'translate(8px, 8px)' }}
          />
        </div>

      </div>
    </section>
  )
}
