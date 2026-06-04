'use client'
// components/shapes/QuizFlow.tsx — guided question flow → recommendations
// (ported from view_quiz.jsx).
import { useState } from 'react'
import {
  DESTINATIONS,
  CATEGORIES,
  AGES,
  TIMES,
  BUDGETS,
  matchScore,
  type Sel,
} from '@/lib/shapes/data'
import { DestCard, Container } from '@/components/shapes/primitives'
import { Squiggle } from '@/components/shapes/decor'

type QuizItem = { id: string; label: string; sub?: string; dot?: string }
type QuizStep = { key: string; multi: boolean; q: string; hint: string; items: () => QuizItem[] }

const QUIZ_STEPS: QuizStep[] = [
  { key: 'ages', multi: true, q: 'Wie alt sind eure Kinder?', hint: 'Mehrfachauswahl möglich', items: () => AGES.map((a) => ({ id: a.id, label: a.label, sub: a.sub })) },
  { key: 'cats', multi: true, q: 'Worauf habt ihr Lust?', hint: 'Wählt ein oder mehrere Themen', items: () => Object.values(CATEGORIES).map((c) => ({ id: c.id, label: c.label, dot: c.id })) },
  { key: 'times', multi: false, q: 'Wie viel Zeit habt ihr?', hint: '', items: () => TIMES.map((t) => ({ id: t.id, label: t.label, sub: t.sub })) },
  { key: 'budgets', multi: false, q: "Wie sieht's mit dem Budget aus?", hint: '', items: () => BUDGETS.map((b) => ({ id: b.id, label: b.label, sub: b.sub })) },
  {
    key: 'weather',
    multi: false,
    q: 'Wie ist das Wetter heute?',
    hint: '',
    items: () => [
      { id: 'gut', label: 'Schön & trocken', sub: 'Raus an die frische Luft' },
      { id: 'regen', label: 'Regnerisch', sub: 'Lieber etwas Wetterfestes' },
    ],
  },
]

function OptionCard({
  opt,
  on,
  index,
  onClick,
}: {
  opt: QuizItem
  on: boolean
  index: number
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        width: '100%',
        textAlign: 'left',
        background: on ? 'color-mix(in oklch, var(--accent) 9%, var(--card))' : 'var(--card)',
        border: '1.5px solid ' + (on ? 'var(--accent)' : 'var(--line)'),
        borderRadius: 'var(--radius-sm)',
        padding: '16px 20px',
        cursor: 'pointer',
        transition: 'all .14s',
      }}
    >
      <span style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontStyle: 'italic', color: on ? 'var(--accent)' : 'var(--ink-faint)', width: 22, flex: '0 0 22px' }}>
        {String.fromCharCode(97 + index)}
      </span>
      <span style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10 }}>
        {opt.dot && <span style={{ width: 11, height: 11, borderRadius: '50%', background: `var(--c-${opt.dot})`, flex: '0 0 auto' }} />}
        <span>
          <span style={{ display: 'block', fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 19, color: 'var(--ink)', lineHeight: 1.3 }}>{opt.label}</span>
          {opt.sub && <span style={{ display: 'block', fontSize: 13.5, color: 'var(--ink-faint)', marginTop: 2 }}>{opt.sub}</span>}
        </span>
      </span>
      <span style={{ width: 22, height: 22, borderRadius: '50%', flex: '0 0 22px', border: '1.5px solid ' + (on ? 'var(--accent)' : 'var(--line)'), background: on ? 'var(--accent)' : 'transparent', display: 'grid', placeItems: 'center', color: '#fff', fontSize: 13, transition: 'all .14s' }}>
        {on ? '✓' : ''}
      </span>
    </button>
  )
}

type SelState = { ages: string[]; cats: string[]; times: string | null; budgets: string | null; weather: string | null }
const EMPTY: SelState = { ages: [], cats: [], times: null, budgets: null, weather: null }

export function QuizFlow() {
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState<SelState>(EMPTY)
  const [done, setDone] = useState(false)

  const cur = QUIZ_STEPS[step]
  const choose = (id: string) => {
    setSel((s) => {
      if (cur.multi) {
        const arr = s[cur.key as 'ages' | 'cats']
        return { ...s, [cur.key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] }
      }
      return { ...s, [cur.key]: s[cur.key as 'times' | 'budgets' | 'weather'] === id ? null : id }
    })
  }
  const curVal = sel[cur.key as keyof SelState]
  const hasAnswer = cur.multi ? (curVal as string[]).length > 0 : !!curVal
  const next = () => {
    if (step < QUIZ_STEPS.length - 1) setStep(step + 1)
    else setDone(true)
  }
  const back = () => {
    if (done) setDone(false)
    else if (step > 0) setStep(step - 1)
  }

  const sSel: Sel = {
    ages: sel.ages,
    cats: sel.cats,
    weather: sel.weather,
    stroller: false,
    times: sel.times ? [sel.times] : [],
    budgets: sel.budgets ? [sel.budgets] : [],
  }

  if (done) {
    const ranked = DESTINATIONS.map((d) => ({ d, m: matchScore(d, sSel) })).sort(
      (a, b) => b.m - a.m || b.d.rating - a.d.rating,
    )
    const top = ranked.slice(0, 6)
    return (
      <Container style={{ paddingTop: 40, paddingBottom: 70, maxWidth: 1100 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="kicker" style={{ marginBottom: 12 }}>Euer Ergebnis</div>
          <h2 style={{ fontSize: 'clamp(34px, 5vw, 54px)' }}>
            Die <em style={{ fontStyle: 'italic', fontWeight: 500 }}>besten</em> Treffer
          </h2>
          <p className="caption" style={{ fontSize: 17, marginTop: 8 }}>
            Auf Basis eurer Antworten — sortiert nach Übereinstimmung.
          </p>
          <button
            className="btn btn--ghost"
            style={{ marginTop: 18 }}
            onClick={() => {
              setDone(false)
              setStep(0)
              setSel(EMPTY)
            }}
          >
            Neu starten
          </button>
        </div>
        <hr className="rule" style={{ marginBottom: 28 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: 22 }}>
          {top.map(({ d, m }) => (
            <DestCard key={d.id} dest={d} match={m} />
          ))}
        </div>
      </Container>
    )
  }

  return (
    <Container style={{ paddingTop: 34, paddingBottom: 64, maxWidth: 640 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, marginBottom: 14 }}>
        <button
          onClick={back}
          disabled={step === 0}
          className="kicker"
          style={{ background: 'none', border: 'none', padding: 0, color: step === 0 ? 'var(--line)' : 'var(--ink-soft)', cursor: step === 0 ? 'default' : 'pointer' }}
        >
          ← Zurück
        </button>
        <span className="caption" style={{ fontSize: 15 }}>
          Frage {String(step + 1).padStart(2, '0')} / {String(QUIZ_STEPS.length).padStart(2, '0')}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 36 }}>
        {QUIZ_STEPS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: i <= step ? 'var(--accent)' : 'var(--line)', transition: 'background .3s' }} />
        ))}
      </div>

      <div key={step} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: cur.hint ? 4 : 22 }}>
          <Squiggle color="var(--accent)" width={44} height={26} humps={3} thickness={9} />
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.3 }}>{cur.q}</h2>
        </div>
        {cur.hint && <p className="caption" style={{ fontSize: 15.5, marginTop: 0, marginBottom: 24, marginLeft: 58 }}>{cur.hint}</p>}
        <div style={{ display: 'grid', gap: 12 }}>
          {cur.items().map((opt, i) => {
            const on = cur.multi ? (curVal as string[]).includes(opt.id) : curVal === opt.id
            return <OptionCard key={opt.id} opt={opt} index={i} on={on} onClick={() => choose(opt.id)} />
          })}
        </div>
        <button
          className="btn btn--primary"
          disabled={!hasAnswer}
          onClick={next}
          style={{ width: '100%', marginTop: 28, padding: '16px', fontSize: 16, opacity: hasAnswer ? 1 : 0.4, cursor: hasAnswer ? 'pointer' : 'default' }}
        >
          {step === QUIZ_STEPS.length - 1 ? 'Ergebnisse anzeigen' : 'Weiter'}
        </button>
        {cur.multi && (
          <p style={{ textAlign: 'center', marginTop: 14 }}>
            <button onClick={next} className="kicker" style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink-faint)' }}>
              Überspringen
            </button>
          </p>
        )}
      </div>
    </Container>
  )
}
