// lib/shapes/questions.ts — single source for the guided questions. Both the
// landing Matcher (quick, all-at-once) and the /quiz page (step-by-step) read
// these, so they're truly "aus einem Guss": same wording, same options, same
// chips.
import { TIMES, BUDGETS, TYPES } from './data'

export type QOption = { id: string; label: string }
export type QKey = 'ages' | 'types' | 'times' | 'budgets' | 'weather'
export type Question = { key: QKey; q: string; short: string; hint?: string; multi: boolean; options: QOption[] }

// "Alter der Kinder" wurde projektweit entfernt (Sarah-Feedback). REVERSIBEL:
// ages-Frage hier wieder ergänzen (AGES aus ./data importieren) bringt den Schritt zurück.
export const QUESTIONS: Question[] = [
  { key: 'types', q: 'Worauf habt ihr Lust?', short: 'Lust', hint: 'Wählt ein oder mehrere Themen', multi: true, options: Object.values(TYPES).map((t) => ({ id: t.id, label: t.label })) },
  { key: 'times', q: 'Wie viel Zeit habt ihr?', short: 'Zeit', multi: false, options: TIMES.map((t) => ({ id: t.id, label: t.label })) },
  { key: 'budgets', q: 'Wie viel darf’s kosten?', short: 'Budget', multi: false, options: BUDGETS.map((b) => ({ id: b.id, label: b.label })) },
  { key: 'weather', q: 'Wie ist das Wetter heute?', short: 'Wetter', multi: false, options: [{ id: 'gut', label: 'Schön & trocken' }, { id: 'regen', label: 'Regnerisch' }] },
]

// the four the quick Matcher asks (weather is full-quiz only)
export const MATCHER_QUESTIONS = QUESTIONS.filter((q) => q.key !== 'weather')
