// components/Footer.tsx
import Link from 'next/link'

const LINKS = [
  { label: 'Ausflüge entdecken', href: '/entdecken' },
  { label: 'Über uns',           href: '/about' },
  { label: 'Kontakt',            href: '/kontakt' },
]

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink">
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div className="space-y-2">
            <p className="font-bold text-sm tracking-widest uppercase" style={{ fontFamily: 'var(--font-courier)' }}>
              Allgäu mit Kids
            </p>
            <p className="text-xs text-ink/60" style={{ fontFamily: 'var(--font-lora)' }}>
              Die schönsten Familienausflüge im Allgäu
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-6">
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="label hover:text-gold transition-colors">
                {label}
              </Link>
            ))}
          </nav>

        </div>

        <hr className="lofi-divider" />

        <p className="text-center text-xs text-ink/40 label">
          © {new Date().getFullYear()} Allgäu mit Kids · Mit ♥ gemacht
        </p>

      </div>
    </footer>
  )
}
