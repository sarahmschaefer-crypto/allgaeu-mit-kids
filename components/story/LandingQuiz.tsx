'use client'
// components/story/LandingQuiz.tsx — section 2: the step-by-step quiz, embedded
// as the start of discovery. Writes the shared selection so the gallery (§3)
// reacts live. Same questions as /quiz.
import { useState } from 'react'
import { QUESTIONS } from '@/lib/shapes/questions'
import { Reveal } from '@/components/story/Reveal'
import { useMatch, type ArrField } from '@/components/story/MatchContext'

function scrollToGallery() {
  const el = document.querySelector('#story-root .horizontal')
  if (el) el.scrollIntoView({ behavior: 'smooth' })
}

export function LandingQuiz() {
  const { sel, toggle, setWeather, matches } = useMatch()
  const [step, setStep] = useState(0)
  const last = QUESTIONS.length - 1
  const cur = QUESTIONS[step]

  const isOn = (id: string) =>
    cur.key === 'weather' ? sel.weather === id : (sel[cur.key as ArrField] as string[]).includes(id)
  const choose = (id: string) => (cur.key === 'weather' ? setWeather(id) : toggle(cur.key as ArrField, id))
  const next = () => (step < last ? setStep(step + 1) : scrollToGallery())
  const back = () => setStep((s) => Math.max(0, s - 1))

  return (
    <section className="scene lquiz" id="start">
      <div className="wrap lquiz-inner">
        <Reveal className="lquiz-head">
          <p className="eyebrow">Schritt für Schritt</p>
          <h2 className="display h-lg">Erzählt uns <span className="accent-terra">von euch.</span></h2>
        </Reveal>

        <div className="lquiz-card">
          <div className="lquiz-top">
            <button className="lquiz-back" onClick={back} disabled={step === 0}>
              ← Zurück
            </button>
            <span className="lquiz-count">
              Frage {String(step + 1).padStart(2, '0')} / {String(QUESTIONS.length).padStart(2, '0')}
            </span>
          </div>
          <div className="lquiz-progress" aria-hidden="true">
            {QUESTIONS.map((_, i) => (
              <span key={i} className={i <= step ? 'on' : ''} />
            ))}
          </div>

          <div key={step} className="lquiz-body">
            <h3 className="display lquiz-q">{cur.q}</h3>
            {cur.hint && <p className="lquiz-hint">{cur.hint}</p>}
            <div className="chiprow lquiz-chips">
              {cur.options.map((o) => (
                <button key={o.id} type="button" className={`chip${isOn(o.id) ? ' on' : ''}`} onClick={() => choose(o.id)}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>

          <button className="btn btn--primary lquiz-next" onClick={next}>
            {step < last ? 'Weiter' : `${matches.length} Treffer ansehen`}
            <span aria-hidden="true">→</span>
          </button>
        </div>
      </div>
    </section>
  )
}
