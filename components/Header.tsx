// components/Header.tsx
import Link from 'next/link'

const NAV = [
  { label: 'Start',      href: '/' },
  { label: 'Ausflüge',   href: '/entdecken' },
  { label: 'Über uns',   href: '/about' },
  { label: 'Kontakt',    href: '/kontakt' },
]

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper/95 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">

        {/* Logo */}
        <Link
          href="/"
          className="font-[family-name:var(--font-courier)] font-bold text-sm tracking-widest uppercase text-ink hover:text-gold transition-colors"
        >
          Allgäu mit Kids
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          {NAV.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="label text-ink hover:text-gold transition-colors hidden sm:block"
            >
              {label}
            </Link>
          ))}

          {/* CTA */}
          <Link href="/entdecken" className="lofi-btn text-xs py-2 px-4">
            Entdecken
          </Link>
        </nav>

      </div>
    </header>
  )
}
