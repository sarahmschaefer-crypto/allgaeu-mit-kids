// components/shapes/ShapesBar.tsx — persistent top navigation for all flows
import Link from 'next/link'

const TABS = [
  { href: '/entdecken', key: 'entdecken', label: 'Entdecken' },
  { href: '/quiz', key: 'quiz', label: 'Quiz' },
  { href: '/sammeln', key: 'sammeln', label: 'Sammeln' },
  { href: '/about', key: 'about', label: 'Über uns' },
  { href: '/kontakt', key: 'kontakt', label: 'Kontakt' },
] as const

export type ShapesNavKey = (typeof TABS)[number]['key']

export function ShapesBar({ active, overlay = false }: { active?: ShapesNavKey; overlay?: boolean }) {
  return (
    <header className={`shapes-bar${overlay ? ' shapes-bar--overlay' : ''}`}>
      <div className="shapes-bar-inner">
        <Link href="/" className="shapes-brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-allgaeu.png" alt="Allgäu mit Kids" className="brand-logo" width={30} height={30} />
          <b>Allgäu&nbsp;mit&nbsp;Kids</b>
        </Link>
        <nav className="shapes-nav">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className={active === t.key ? 'on' : ''}>
              {t.label}
            </Link>
          ))}
        </nav>
        <Link href="/quiz" className="shapes-cta">
          Ausflugsziel finden
        </Link>
      </div>
    </header>
  )
}
