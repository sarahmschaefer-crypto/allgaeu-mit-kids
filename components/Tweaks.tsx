'use client'
// components/Tweaks.tsx — unified design-system controls (Shapes base).
// Persists to localStorage, applies CSS variables to :root, exposes tone/motion
// to scenes via context. Replaces the Claude-Design host protocol with a
// self-contained floating panel.
import { createContext, useContext, useEffect, useState, useCallback } from 'react'

export type Tweaks = {
  accent: string // --accent / primary action color
  headingFont: string // --font-display
  radius: number // --radius (px)
  motion: 'Sanft' | 'Ausgewogen' | 'Lebhaft'
  tone: 'Poetisch' | 'Direkt'
}

export const TWEAK_DEFAULTS: Tweaks = {
  accent: 'oklch(0.55 0.21 300)', // violet (Shapes default)
  headingFont: 'Playfair Display',
  radius: 6,
  motion: 'Ausgewogen',
  tone: 'Poetisch',
}

const ACCENTS = [
  'oklch(0.55 0.21 300)', // violet
  'oklch(0.72 0.17 50)', // orange
  'oklch(0.74 0.14 35)', // coral
  'oklch(0.55 0.13 255)', // blue
]
const HEADING_FONTS = ['Playfair Display', 'DM Serif Display']
const MOTIONS: Tweaks['motion'][] = ['Sanft', 'Ausgewogen', 'Lebhaft']
const TONES: Tweaks['tone'][] = ['Poetisch', 'Direkt']
const MOTION_FX: Record<Tweaks['motion'], number> = { Sanft: 0.55, Ausgewogen: 1, Lebhaft: 1.6 }

const STORAGE_KEY = 'amk-tweaks'

type Ctx = {
  t: Tweaks
  setTweak: <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => void
  fx: number
  direkt: boolean
}
const TweaksContext = createContext<Ctx | null>(null)

export function useTweaks(): Ctx {
  const ctx = useContext(TweaksContext)
  if (!ctx) throw new Error('useTweaks must be used inside <TweaksProvider>')
  return ctx
}

export function TweaksProvider({ children }: { children: React.ReactNode }) {
  const [t, setT] = useState<Tweaks>(TWEAK_DEFAULTS)

  // hydrate from localStorage once on mount (avoids SSR mismatch)
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setT({ ...TWEAK_DEFAULTS, ...JSON.parse(raw) })
    } catch {
      /* ignore */
    }
  }, [])

  const setTweak = useCallback(
    <K extends keyof Tweaks>(key: K, value: Tweaks[K]) => {
      setT((prev) => {
        const next = { ...prev, [key]: value }
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        } catch {
          /* ignore */
        }
        return next
      })
    },
    [],
  )

  // apply tweaks → CSS variables on :root
  useEffect(() => {
    const r = document.documentElement.style
    r.setProperty('--accent', t.accent)
    r.setProperty('--story-primary', t.accent)
    r.setProperty('--font-display', `"${t.headingFont}", Georgia, serif`)
    r.setProperty('--radius', t.radius + 'px')
    r.setProperty('--radius-sm', Math.max(2, Math.round(t.radius * 0.6)) + 'px')
    r.setProperty('--fx', String(MOTION_FX[t.motion]))
  }, [t])

  const value: Ctx = {
    t,
    setTweak,
    fx: MOTION_FX[t.motion],
    direkt: t.tone === 'Direkt',
  }
  return <TweaksContext.Provider value={value}>{children}</TweaksContext.Provider>
}

// ── Floating panel UI ─────────────────────────────────────────────────────────
function Swatch({
  value,
  options,
  onChange,
}: {
  value: string
  options: string[]
  onChange: (v: string) => void
}) {
  return (
    <div className="twk-chips">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={`twk-chip${o === value ? ' on' : ''}`}
          style={{ background: o }}
          aria-label={o}
          onClick={() => onChange(o)}
        />
      ))}
    </div>
  )
}

function Seg<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T
  options: readonly T[]
  onChange: (v: T) => void
}) {
  return (
    <div className="twk-seg">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          className={o === value ? 'on' : ''}
          onClick={() => onChange(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

export function TweaksPanel() {
  const { t, setTweak } = useTweaks()
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="twk-fab"
        aria-label="Stil anpassen"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? '✕' : '✦'}
      </button>
      {open && (
        <div className="twk-panel" role="dialog" aria-label="Stil-Tweaks">
          <div className="twk-hd">
            <b>Stil</b>
            <span className="twk-hint">wird gespeichert</span>
          </div>
          <div className="twk-body">
            <div className="twk-sect">Akzentfarbe</div>
            <Swatch value={t.accent} options={ACCENTS} onChange={(v) => setTweak('accent', v)} />

            <div className="twk-sect">Überschriften</div>
            <Seg
              value={t.headingFont}
              options={HEADING_FONTS}
              onChange={(v) => setTweak('headingFont', v)}
            />

            <div className="twk-sect">Ecken-Radius</div>
            <div className="twk-row">
              <input
                type="range"
                className="twk-slider"
                min={0}
                max={18}
                step={2}
                value={t.radius}
                onChange={(e) => setTweak('radius', Number(e.target.value))}
              />
              <span className="twk-val">{t.radius}px</span>
            </div>

            <div className="twk-sect">Bewegung</div>
            <Seg value={t.motion} options={MOTIONS} onChange={(v) => setTweak('motion', v)} />

            <div className="twk-sect">Erzählton</div>
            <Seg value={t.tone} options={TONES} onChange={(v) => setTweak('tone', v)} />
          </div>
        </div>
      )}
    </>
  )
}
