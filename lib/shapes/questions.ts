// lib/shapes/questions.ts — single source for the guided questions. Both the
// landing Matcher (quick, all-at-once) and the /quiz page (step-by-step) read
// these, so they're truly "aus einem Guss": same wording, same options, same
// chips.
import { AGES, TIMES, BUDGETS, CATEGORIES } from './data'

export type QOption = { id: string; label: string }
export type QKey = 'ages' | 'cats' | 'times' | 'budgets' | 'weather'
export type Question = { key: QKey; q: string; short: string; hint?: string; multi: boolean; options: QOption[] }

export const QUESTIONS: Question[] = [
  { key: 'ages', q: 'Wie alt sind die Kinder?', short: 'Alter', hint: 'Mehrfachauswahl möglich', multi: true, options: AGES.map((a) => ({ id: a.id, label: a.label })) },
  { key: 'cats', q: 'Worauf habt ihr Lust?', short: 'Lust', hint: 'Wählt ein oder mehrere Themen', multi: true, options: Object.values(CATEGORIES).map((c) => ({ id: c.id, label: c.short })) },
  { key: 'times', q: 'Wie viel Zeit habt ihr?', short: 'Zeit', multi: false, options: TIMES.map((t) => ({ id: t.id, label: t.label })) },
  { key: 'budgets', q: 'Wie viel darf’s kosten?', short: 'Budget', multi: false, options: BUDGETS.map((b) => ({ id: b.id, label: b.label })) },
  { key: 'weather', q: 'Wie ist das Wetter heute?', short: 'Wetter', multi: false, options: [{ id: 'gut', label: 'Schön & trocken' }, { id: 'regen', label: 'Regnerisch' }] },
]

// the four the quick Matcher asks (weather is full-quiz only)
export const MATCHER_QUESTIONS = QUESTIONS.filter((q) => q.key !== 'weather')
