// components/Header.tsx — site header, vereinheitlicht auf die ShapesBar-Chrome
// (gleiches Look&Feel wie auf den Entdecken/Quiz/Sammeln-Seiten). Eigene
// Site-Nav-Links bleiben erhalten.
import Link from 'next/link'

const NAV = [
  { label: 'Start',      href: '/' },
  { label: 'Ausflüge',   href: '/entdecken' },
  { label: 'Über uns',   href: '/about' },
  { label: 'Kontakt',    href: '/kontakt' },
]

export default function Header() {
  return (
    <header className="shapes-bar">
      <div className="shapes-bar-inner">
        <Link href="/" className="shapes-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-allgaeu.png" alt="Allgäu mit Kids" className="brand-logo" width={30} height={30} />
          <b>Allgäu&nbsp;mit&nbsp;Kids</b>
        </Link>

        <nav className="shapes-nav">
          {NAV.map(({ label, href }) => (
            <Link key={href} href={href}>
              {label}
            </Link>
          ))}
        </nav>

        <Link href="/entdecken" className="shapes-cta">
          Entdecken
        </Link>
      </div>
    </header>
  )
}
