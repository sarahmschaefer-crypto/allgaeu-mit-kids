'use client'
// components/story/MatchContext.tsx — shared landing state. The embedded quiz
// (section 2) writes the selection; the gallery (section 3) reads `matches`.
import { createContext, useContext, useMemo, useState } from 'react'
import { filterDests, isAny, type ShapesDest, type Sel } from '@/lib/shapes/data'

// Mehrfach-Auswahl (Array) nur bei 'types'; alle anderen Quiz-Fragen sind
// Einfach-Auswahl (String | null).
export type ArrField = 'types'
export type SingleField = 'times' | 'budgets' | 'weather' | 'setting' | 'region'
export type MatchSel = {
  types: string[]
  times: string | null
  budgets: string | null
  weather: string | null
  setting: string | null
  region: string | null
}
const DEFAULT: MatchSel = { types: [], times: null, budgets: null, weather: null, setting: null, region: null }

// MatchSel → das Array-/String-Shape, das filterDests + buildExploreHref
// erwarten. Wildcards (egal / jede-wetterlage / ueberall) = "keine Einschränkung".
export function toSel(s: MatchSel): Sel {
  return {
    types: s.types,
    times: s.times && !isAny(s.times) ? [s.times] : [],
    budgets: s.budgets && !isAny(s.budgets) ? [s.budgets] : [],
    weather: isAny(s.weather) ? null : s.weather,
    setting: isAny(s.setting) ? null : s.setting,
    region: isAny(s.region) ? null : s.region,
  }
}

type Ctx = {
  sel: MatchSel
  toggle: (field: ArrField, id: string) => void
  setSingle: (field: SingleField, id: string) => void
  setWeather: (id: string | null) => void
  reset: () => void
  matches: ShapesDest[]
}
const MatchCtx = createContext<Ctx | null>(null)

export function useMatch(): Ctx {
  const c = useContext(MatchCtx)
  if (!c) throw new Error('useMatch must be used inside <MatchProvider>')
  return c
}

export function MatchProvider({ children }: { children: React.ReactNode }) {
  const [sel, setSel] = useState<MatchSel>(DEFAULT)

  const toggle = (field: ArrField, id: string) =>
    setSel((s) => ({ ...s, [field]: s[field].includes(id) ? s[field].filter((x) => x !== id) : [...s[field], id] }))
  // Einfach-Auswahl: erneut tippen hebt die Auswahl wieder auf.
  const setSingle = (field: SingleField, id: string) => setSel((s) => ({ ...s, [field]: s[field] === id ? null : id }))
  const setWeather = (id: string | null) => setSel((s) => ({ ...s, weather: s.weather === id ? null : id }))
  const reset = () => setSel(DEFAULT)

  const matches = useMemo(() => filterDests(toSel(sel)), [sel])

  return <MatchCtx.Provider value={{ sel, toggle, setSingle, setWeather, reset, matches }}>{children}</MatchCtx.Provider>
}
