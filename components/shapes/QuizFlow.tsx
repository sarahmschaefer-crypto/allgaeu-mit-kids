'use client'
// components/shapes/QuizFlow.tsx — guided question flow → recommendations
// (ported from view_quiz.jsx).
import { useState } from 'react'
import Link from 'next/link'
import { filterDests, TYPES } from '@/lib/shapes/data'
import { QUESTIONS } from '@/lib/shapes/questions'
import { Container } from '@/components/shapes/primitives'
import { Squiggle } from '@/components/shapes/decor'
import { buildExploreHref } from '@/lib/shapes/explore'

type SelState = { ages: string[]; types: string[]; times: string | null; budgets: string | null; weather: string | null }
const EMPTY: SelState = { ages: [], types: [], times: null, budgets: null, weather: null }

export function QuizFlow() {
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState<SelState>(EMPTY)
  const [done, setDone] = useState(false)

  const cur = QUESTIONS[step]
  const choose = (id: string) => {
    setSel((s) => {
      if (cur.multi) {
        const arr = s[cur.key as 'ages' | 'types']
        return { ...s, [cur.key]: arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id] }
      }
      return { ...s, [cur.key]: s[cur.key as 'times' | 'budgets' | 'weather'] === id ? null : id }
    })
  }
  const curVal = sel[cur.key as keyof SelState]
  const hasAnswer = cur.multi ? (curVal as string[]).length > 0 : !!curVal
  const next = () => {
    if (step < QUESTIONS.length - 1) setStep(step + 1)
    else setDone(true)
  }
  const back = () => {
    if (done) setDone(false)
    else if (step > 0) setStep(step - 1)
  }

  // quiz answers → shared filter shape (arrays), the language Entdecken speaks
  const handoffSel = {
    ages: sel.ages,
    types: sel.types,
    times: sel.times ? [sel.times] : [],
    budgets: sel.budgets ? [sel.budgets] : [],
    weather: sel.weather === 'regen' ? 'regen' : null,
  }

  if (done) {
    const count = filterDests(handoffSel).length
    const href = buildExploreHref(handoffSel, { from: 'quiz' })
    return (
      <Container style={{ paddingTop: 64, paddingBottom: 90, maxWidth: 640 }} className="fade-in">
        <div style={{ textAlign: 'center' }}>
          <div style={{ display: 'inline-block', marginBottom: 18 }}>
            <Squiggle color="var(--accent)" width={90} height={30} humps={4} />
          </div>
          <div className="kicker" style={{ marginBottom: 14 }}>Euer Ergebnis</div>
          <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(72px, 16vw, 128px)', lineHeight: 0.9, color: 'var(--accent)' }}>
            {count}
          </div>
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 38px)', marginTop: 8 }}>
            {count === 1 ? 'Ort passt zu euch' : 'Orte passen zu euch'}
          </h2>
          <p className="caption" style={{ fontSize: 17, marginTop: 10, maxWidth: 420, marginInline: 'auto' }}>
            Auf Basis eurer Antworten. Schaut sie euch an – als Liste oder auf der Karte.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginTop: 30 }}>
            {count > 0 && (
              <Link href={href} className="btn btn--primary" style={{ fontSize: 16, padding: '15px 26px' }}>
                Eure Treffer ansehen<span aria-hidden="true">→</span>
              </Link>
            )}
            <button
              className="btn btn--ghost"
              onClick={() => {
                setDone(false)
                setStep(0)
                setSel(EMPTY)
              }}
            >
              {count > 0 ? 'Neu starten' : 'Antworten lockern'}
            </button>
          </div>
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
          Frage {String(step + 1).padStart(2, '0')} / {String(QUESTIONS.length).padStart(2, '0')}
        </span>
      </div>
      <div style={{ display: 'flex', gap: 6, marginBottom: 36 }}>
        {QUESTIONS.map((_, i) => (
          <div key={i} style={{ flex: 1, height: 3, background: i <= step ? 'var(--accent)' : 'var(--line)', transition: 'background .3s' }} />
        ))}
      </div>

      <div key={step} className="fade-in">
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: cur.hint ? 4 : 22 }}>
          <Squiggle color="var(--accent)" width={44} height={26} humps={3} thickness={9} />
          <h2 style={{ fontSize: 'clamp(26px, 4vw, 36px)', lineHeight: 1.3 }}>{cur.q}</h2>
        </div>
        {cur.hint && <p className="caption" style={{ fontSize: 15.5, marginTop: 0, marginBottom: 24, marginLeft: 58 }}>{cur.hint}</p>}
        <div className="quiz-chips">
          {cur.options.map((opt) => {
            const on = cur.multi ? (curVal as string[]).includes(opt.id) : curVal === opt.id
            return (
              <button key={opt.id} type="button" className="chip quiz-chip" data-on={on} onClick={() => choose(opt.id)}>
                {cur.key === 'types' && <span className="quiz-chip-dot" style={{ background: (TYPES as Record<string, { color: string }>)[opt.id]?.color }} />}
                {opt.label}
              </button>
            )
          })}
        </div>
        <button
          className="btn btn--primary"
          disabled={!hasAnswer}
          onClick={next}
          style={{ width: '100%', marginTop: 28, padding: '16px', fontSize: 16, opacity: hasAnswer ? 1 : 0.4, cursor: hasAnswer ? 'pointer' : 'default' }}
        >
          {step === QUESTIONS.length - 1 ? 'Ergebnisse anzeigen' : 'Weiter'}
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
