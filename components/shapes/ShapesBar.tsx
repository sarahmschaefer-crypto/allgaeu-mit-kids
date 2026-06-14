'use client'
// components/shapes/ShapesBar.tsx — persistent top navigation for all flows.
// Mobile: nav-Links kollabieren in ein Hamburger-Menü (kein horizontaler Überlauf).
import Link from 'next/link'
import { useState } from 'react'

const TABS = [
  { href: '/entdecken', key: 'entdecken', label: 'Entdecken' },
  { href: '/quiz', key: 'quiz', label: 'Quiz' },
  { href: '/sammeln', key: 'sammeln', label: 'Sammeln' },
  { href: '/about', key: 'about', label: 'Über uns' },
  { href: '/kontakt', key: 'kontakt', label: 'Kontakt' },
] as const

export type ShapesNavKey = (typeof TABS)[number]['key']

export function ShapesBar({ active, overlay = false }: { active?: ShapesNavKey; overlay?: boolean }) {
  const [open, setOpen] = useState(false)
  return (
    <header className={`shapes-bar${overlay ? ' shapes-bar--overlay' : ''}`}>
      <div className="shapes-bar-inner">
        <Link href="/" className="shapes-brand" onClick={() => setOpen(false)}>
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
        <button
          type="button"
          className="shapes-burger"
          aria-label={open ? 'Menü schließen' : 'Menü öffnen'}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
        >
          <span data-x={open} />
          <span data-x={open} />
          <span data-x={open} />
        </button>
      </div>
      {open && (
        <nav className="shapes-menu">
          {TABS.map((t) => (
            <Link key={t.href} href={t.href} className={active === t.key ? 'on' : ''} onClick={() => setOpen(false)}>
              {t.label}
            </Link>
          ))}
          <Link href="/quiz" className="shapes-cta shapes-menu-cta" onClick={() => setOpen(false)}>
            Ausflugsziel finden
          </Link>
        </nav>
      )}
    </header>
  )
}
