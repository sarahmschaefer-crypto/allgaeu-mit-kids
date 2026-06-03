'use client'
// components/story/StoryNav.tsx — progress dots + persistent floating CTA
import { useEffect, useState } from 'react'

const NAV = ['Start', 'Möglichkeiten', 'Euer Profil', 'Entdecken', 'Loslegen']

export function goToScene(i: number) {
  const secs = [...document.querySelectorAll('#story-root .scene')]
  const s = secs[i]
  if (s) window.scrollTo({ top: window.scrollY + s.getBoundingClientRect().top + 2, behavior: 'smooth' })
}
export function goToMatcher() {
  const el = document.getElementById('start')
  if (el) window.scrollTo({ top: window.scrollY + el.getBoundingClientRect().top - 16, behavior: 'smooth' })
}

export function ProgressNav() {
  const [active, setActive] = useState(0)
  useEffect(() => {
    const tick = () => {
      const secs = [...document.querySelectorAll('#story-root .scene')]
      const vh = window.innerHeight
      let idx = 0
      secs.forEach((s, i) => {
        const r = s.getBoundingClientRect()
        if (r.top <= vh * 0.5 && r.bottom >= vh * 0.5) idx = i
      })
      setActive(idx)
    }
    tick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)
    return () => {
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
    }
  }, [])
  return (
    <nav className="prog" aria-label="Kapitel">
      {NAV.map((label, i) => (
        <button key={i} className={active === i ? 'on' : ''} title={label} onClick={() => goToScene(i)} />
      ))}
    </nav>
  )
}

export function FloatingCta() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const tick = () => {
      const vh = window.innerHeight
      const hero = document.querySelector('#story-root .hero')
      const matcher = document.getElementById('start')
      let visible = true
      if (hero) {
        const r = hero.getBoundingClientRect()
        if (r.bottom > vh * 0.7) visible = false
      }
      if (matcher) {
        const r = matcher.getBoundingClientRect()
        if (r.top < vh * 0.75 && r.bottom > vh * 0.25) visible = false
      }
      setShow(visible)
    }
    tick()
    window.addEventListener('scroll', tick, { passive: true })
    window.addEventListener('resize', tick)
    return () => {
      window.removeEventListener('scroll', tick)
      window.removeEventListener('resize', tick)
    }
  }, [])
  return (
    <button className={`floating-cta${show ? ' show' : ''}`} onClick={goToMatcher}>
      <span className="fc-dot" aria-hidden="true" />
      Jetzt erkunden
    </button>
  )
}
