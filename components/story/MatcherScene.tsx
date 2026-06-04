'use client'
// components/story/MatcherScene.tsx — interactive "tell us about you" → live
// matched trips.
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { clamp, lerp, easeOut } from '@/lib/story/scroll'
import {
  matchDestinations,
  DESTINATIONS,
  AGE_BANDS,
  TIME_OPTS,
  BUDGET_OPTS,
  TYPE_OPTS,
  type Destination,
} from '@/lib/story/destinations'
import { Reveal } from '@/components/story/Reveal'
import { Placeholder } from '@/components/story/Placeholder'
import { useTweaks } from '@/components/Tweaks'

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button className={`chip${active ? ' on' : ''}`} onClick={onClick} type="button">
      {children}
    </button>
  )
}

const TIME_LABEL: Record<string, string> = { kurz: '2–3 Std', halb: 'Halber Tag', ganz: 'Ganzer Tag' }
const BUDGET_LABEL: Record<number, string> = { 0: 'Kostenlos', 1: 'Günstig', 2: '€€' }

function ResultCard({ d, i }: { d: Destination; i: number }) {
  return (
    <article className="rescard" style={{ ['--i']: i } as CSSProperties}>
      <div className="rescard-thumb">
        <Placeholder label={d.img} className="rescard-ph" />
      </div>
      <div className="rescard-body">
        <div className="rescard-top">
          <h4 className="rescard-name">{d.name}</h4>
          <span className="rescard-area">{d.area}</span>
        </div>
        <div className="rescard-tags">
          <span className="tag">ab {d.ages[0]} J.</span>
          <span className="tag">{TIME_LABEL[d.time]}</span>
          <span className="tag tag-terra">{BUDGET_LABEL[d.budget]}</span>
          <span className="tag tag-ghost">{d.km} km</span>
        </div>
      </div>
    </article>
  )
}

function useCountUp(target: number) {
  const [n, setN] = useState(target)
  const raf = useRef(0)
  const nRef = useRef(target)
  nRef.current = n
  useEffect(() => {
    cancelAnimationFrame(raf.current)
    const from = nRef.current
    const start = performance.now()
    const dur = 420
    const tick = (t: number) => {
      const k = clamp((t - start) / dur)
      setN(Math.round(lerp(from, target, easeOut(k))))
      if (k < 1) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target])
  return n
}

export function MatcherScene() {
  const { direkt } = useTweaks()
  const [age, setAge] = useState<string | null>('a35')
  const [time, setTime] = useState<string | null>('halb')
  const [budget, setBudget] = useState<number | null>(2)
  const [types, setTypes] = useState<string[]>(['wasser'])
  const toggleType = (id: string) =>
    setTypes((ts) => (ts.includes(id) ? ts.filter((t) => t !== id) : [...ts, id]))
  const results = useMemo(
    () => matchDestinations({ age, time, budget, types }),
    [age, time, budget, types],
  )
  const count = useCountUp(results.length)

  return (
    <section className="scene matcher" id="start">
      <div className="matcher-inner wrap">
        <Reveal className="matcher-head">
          <p className="eyebrow">Schritt für Schritt</p>
          <h2 className="display h-lg">
            {direkt ? (
              <>
                Sagt uns, <span className="accent-terra">wer mitkommt.</span>
              </>
            ) : (
              <>
                Erzählt uns <span className="accent-terra">von euch.</span>
              </>
            )}
          </h2>
          <p className="lede">
            Vier kleine Angaben genügen – die Liste passt sich mit jedem Tippen an.
          </p>
        </Reveal>

        <div className="matcher-grid">
          <Reveal delay={1} className="matcher-controls">
            <fieldset className="ctrl">
              <legend className="ctrl-label">
                <span className="ctrl-num">01</span> Wie alt sind die Kinder?
              </legend>
              <div className="chiprow">
                {AGE_BANDS.map((b) => (
                  <Chip key={b.id} active={age === b.id} onClick={() => setAge(age === b.id ? null : b.id)}>
                    {b.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset className="ctrl">
              <legend className="ctrl-label">
                <span className="ctrl-num">02</span> Wie viel Zeit habt ihr?
              </legend>
              <div className="chiprow">
                {TIME_OPTS.map((o) => (
                  <Chip key={o.id} active={time === o.id} onClick={() => setTime(time === o.id ? null : o.id)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset className="ctrl">
              <legend className="ctrl-label">
                <span className="ctrl-num">03</span> Wie viel darf&rsquo;s kosten?
              </legend>
              <div className="chiprow">
                {BUDGET_OPTS.map((o) => (
                  <Chip
                    key={o.id}
                    active={budget === o.id}
                    onClick={() => setBudget(budget === o.id ? null : o.id)}
                  >
                    {o.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
            <fieldset className="ctrl">
              <legend className="ctrl-label">
                <span className="ctrl-num">04</span> Worauf habt ihr Lust?
              </legend>
              <div className="chiprow">
                {TYPE_OPTS.map((o) => (
                  <Chip key={o.id} active={types.includes(o.id)} onClick={() => toggleType(o.id)}>
                    {o.label}
                  </Chip>
                ))}
              </div>
            </fieldset>
          </Reveal>

          <Reveal delay={2} className="matcher-results">
            <div className="results-head">
              <div className="results-count">
                <span className="results-num">{count}</span>
                <span className="results-word">
                  {results.length === 1 ? 'Ort passt' : 'Orte passen'}
                  <br />
                  zu euch
                </span>
              </div>
              <div className="results-bar" aria-hidden="true">
                <span style={{ width: `${(results.length / DESTINATIONS.length) * 100}%` }} />
              </div>
            </div>
            <div className="results-list">
              {results.length === 0 && (
                <p className="results-empty">
                  Keine Treffer – lockert eine Angabe, dann öffnet sich das Allgäu wieder.
                </p>
              )}
              {results.slice(0, 6).map((d, i) => (
                <ResultCard key={d.id} d={d} i={i} />
              ))}
              {results.length > 6 && <p className="results-more">+ {results.length - 6} weitere Orte</p>}
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 22 }}>
              <Link className="btn btn-primary" href="/quiz">
                Genauer eingrenzen<span aria-hidden="true">→</span>
              </Link>
              <Link className="btn btn-ghost" href="/swipe">
                Durchblättern
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
