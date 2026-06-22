// components/Footer.tsx
import Link from 'next/link'

const LINKS = [
  { label: 'Ausflüge entdecken', href: '/entdecken' },
  { label: 'Über',               href: '/about' },
  { label: 'Kontakt',            href: '/kontakt' },
  { label: 'Impressum',          href: '/impressum' },
]

const INSTAGRAM = 'https://www.instagram.com/allgaeumitkids/'

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid var(--line)' }}>
      <div className="max-w-6xl mx-auto px-6 py-12">

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">

          {/* Brand */}
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo-allgaeu.svg" alt="Allgäu mit Kids" style={{ height: 64, width: 'auto', display: 'block' }} />
            <p className="text-sm" style={{ fontFamily: 'var(--font-body)', color: 'var(--ink-soft)' }}>
              Die schönsten Familienausflüge im Allgäu
            </p>
          </div>

          {/* Nav */}
          <nav className="flex flex-wrap gap-6">
            {LINKS.map(({ label, href }) => (
              <Link key={href} href={href} className="label transition-colors hover:text-[var(--accent)]">
                {label}
              </Link>
            ))}
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="label transition-colors hover:text-[var(--accent)]">
              Instagram
            </a>
          </nav>

        </div>

        <hr className="lofi-divider" />

        <p className="text-center text-xs text-ink/40 label">
          © {new Date().getFullYear()} Allgäu mit Kids · Design & Umsetzung: sarahfordesign.com
        </p>

      </div>
    </footer>
  )
}
