'use client'
// components/shapes/ShapesBar.tsx — persistent top navigation for all flows.
// Mobile: nav-Links kollabieren in ein Hamburger-Menü (kein horizontaler Überlauf).
import Link from 'next/link'
import { useState, useEffect } from 'react'

const TABS = [
  { href: '/entdecken', key: 'entdecken', label: 'Entdecken' },
  { href: '/quiz', key: 'quiz', label: 'Quiz' },
  { href: '/sammeln', key: 'sammeln', label: 'Sammeln' },
  { href: '/about', key: 'about', label: 'Über uns' },
  { href: '/kontakt', key: 'kontakt', label: 'Kontakt' },
] as const

export type ShapesNavKey = (typeof TABS)[number]['key']

// Vorerst aus der Nav versteckt — REVERSIBEL: Key hier entfernen = Reiter wieder da.
// entdecken: Reiter obsolet (CTA "Ziel finden" führt dorthin). quiz/sammeln: deaktiviert.
const HIDDEN_NAV = new Set<ShapesNavKey>(['entdecken', 'quiz', 'sammeln'])
const NAV_TABS = TABS.filter((t) => !HIDDEN_NAV.has(t.key))

export function ShapesBar({ active, overlay = false }: { active?: ShapesNavKey; overlay?: boolean }) {
  const [open, setOpen] = useState(false)
  // Hohe Navbar als Default, schrumpft beim Scrollen zu einer kompakten Leiste.
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  return (
    <header className={`shapes-bar${overlay ? ' shapes-bar--overlay' : ''}${scrolled ? ' is-scrolled' : ''}`}>
      <div className="shapes-bar-inner">
        <Link href="/" className="shapes-brand" onClick={() => setOpen(false)} aria-label="Allgäu mit Kids — Startseite">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-allgaeu.svg" alt="Allgäu mit Kids" className="brand-logo" />
        </Link>
        <nav className="shapes-nav">
          {NAV_TABS.map((t) => (
            <Link key={t.href} href={t.href} className={active === t.key ? 'on' : ''}>
              {t.label}
            </Link>
          ))}
        </nav>
        <Link href="/entdecken" className="shapes-cta">
          <span className="cta-long">Ausflugsziel finden</span>
          <span className="cta-mini">Ziel finden</span>
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
          {NAV_TABS.map((t) => (
            <Link key={t.href} href={t.href} className={active === t.key ? 'on' : ''} onClick={() => setOpen(false)}>
              {t.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
