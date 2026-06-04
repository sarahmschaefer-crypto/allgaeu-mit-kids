// components/shapes/ShapesBar.tsx — top navigation for the discovery flows
import Link from 'next/link'

const TABS = [
  { href: '/entdecken', label: 'Filter' },
  { href: '/quiz', label: 'Quiz' },
  { href: '/swipe', label: 'Swipe' },
]

export function ShapesBar({ active }: { active?: 'entdecken' | 'quiz' | 'swipe' }) {
  return (
    <header className="shapes-bar">
      <div className="shapes-bar-inner">
        <Link href="/" className="shapes-brand">
          <i />
          <b>Allgäu&nbsp;mit&nbsp;Kindern</b>
        </Link>
        <nav className="shapes-nav">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className={active && t.href === `/${active}` ? 'on' : ''}>
              {t.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  )
}
