// lib/story/scroll.ts — scroll-scene hook + reveal controller (ported from data.jsx)
import { useEffect, useRef } from 'react'

export const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v))
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3)

type SceneCb = (p: number, r: DOMRect) => void

/* imperative scroll progress for a tall section — no re-renders */
export function useScrollScene(
  ref: React.RefObject<HTMLElement | null>,
  cb: SceneCb,
) {
  const cbRef = useRef(cb)
  cbRef.current = cb
  useEffect(() => {
    const compute = () => {
      const el = ref.current
      if (!el) return
      const r = el.getBoundingClientRect()
      const vh = window.innerHeight
      const total = r.height - vh
      const p =
        total > 0
          ? clamp(-r.top / total)
          : r.top < vh && r.bottom > 0
            ? 1
            : 0
      cbRef.current(p, r)
    }
    compute()
    window.addEventListener('scroll', compute, { passive: true })
    window.addEventListener('resize', compute)
    return () => {
      window.removeEventListener('scroll', compute)
      window.removeEventListener('resize', compute)
    }
  }, [ref])
}

/* scroll-driven fade/translate for every .rv element inside #story-root */
export function runRevealController() {
  const update = () => {
    const vh = window.innerHeight
    document.querySelectorAll<HTMLElement>('#story-root .rv').forEach((el) => {
      const r = el.getBoundingClientRect()
      const d = parseFloat(el.getAttribute('data-d') || '0')
      const start = vh * 0.95
      const end = vh * 0.58
      let p = clamp((start - r.top) / (start - end))
      p = clamp(p * (1 + d * 0.16) - d * 0.14)
      el.style.opacity = p.toFixed(3)
      el.style.transform = `translateY(${((1 - p) * 22).toFixed(1)}px)`
    })
  }
  update()
  window.addEventListener('scroll', update, { passive: true })
  window.addEventListener('resize', update)
  const t1 = setTimeout(update, 60)
  const t2 = setTimeout(update, 240)
  return () => {
    window.removeEventListener('scroll', update)
    window.removeEventListener('resize', update)
    clearTimeout(t1)
    clearTimeout(t2)
  }
}
