'use client'
// components/story/MatcherScene.tsx — interactive "tell us about you" → live
// matched trips. Uses the unified Shapes dataset (lib/shapes/data).
import { useEffect, useMemo, useRef, useState } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { clamp, lerp, easeOut } from '@/lib/story/scroll'
import {
  filterDests,
  matchScore,
  DESTINATIONS,
  AGES,
  TIMES,
  BUDGETS,
  CATEGORIES,
  type ShapesDest,
} from '@/lib/shapes/data'
import { Reveal } from '@/components/story/Reveal'
import { Placeholder } from '@/components/story/Placeholder'
import { useTweaks } from '@/components/Tweaks'
import { buildExploreHref } from '@/lib/shapes/explore'

const TIME_LABEL: Record<string, string> = Object.fromEntries(TIMES.map((t) => [t.id, t.label]))
const BUDGET_GLYPH: Record<string, string> = Object.fromEntries(BUDGETS.map((b) => [b.id, b.glyph]))
const CAT_LIST = Object.values(CATEGORIES)

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

function ResultCard({ d, i }: { d: ShapesDest; i: number }) {
  return (
    <article className="rescard" style={{ ['--i']: i } as CSSProperties}>
      <div className="rescard-thumb">
        <Placeholder label={d.teaser ?? d.place} className="rescard-ph" />
      </div>
      <div className="rescard-body">
        <div className="rescard-top">
          <h4 className="rescard-name">{d.name}</h4>
          <span className="rescard-area">{d.place}</span>
        </div>
        <div className="rescard-tags">
          <span className="tag">ab {d.ages[0]} J.</span>
          <span className="tag">{TIME_LABEL[d.time]}</span>
          <span className="tag tag-terra">{BUDGET_GLYPH[d.budget]}</span>
          <span className="tag tag-ghost">★ {d.rating.toFixed(1)}</span>
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
  const [ages, setAges] = useState<string[]>(['3-5'])
  const [times, setTimes] = useState<string[]>(['halb'])
  const [budgets, setBudgets] = useState<string[]>([])
  const [cats, setCats] = useState<string[]>(['wasser'])

  const toggle = (set: React.Dispatch<React.SetStateAction<string[]>>, id: string) =>
    set((arr) => (arr.includes(id) ? arr.filter((x) => x !== id) : [...arr, id]))

  const results = useMemo(() => {
    const sel = { ages, times, budgets, cats }
    return filterDests(sel)
      .map((d) => ({ d, m: matchScore(d, sel) }))
      .sort((a, b) => b.m - a.m || b.d.rating - a.d.rating)
      .map((r) => r.d)
  }, [ages, times, budgets, cats])
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
                {AGES.map((b) => (
                  <Chip key={b.id} active={ages.includes(b.id)} onClick={() => toggle(setAges, b.id)}>
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
                {TIMES.map((o) => (
                  <Chip key={o.id} active={times.includes(o.id)} onClick={() => toggle(setTimes, o.id)}>
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
                {BUDGETS.map((o) => (
                  <Chip key={o.id} active={budgets.includes(o.id)} onClick={() => toggle(setBudgets, o.id)}>
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
                {CAT_LIST.map((o) => (
                  <Chip key={o.id} active={cats.includes(o.id)} onClick={() => toggle(setCats, o.id)}>
                    {o.short}
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
              {results.length > 0 && (
                <Link className="btn btn-primary" href={buildExploreHref({ ages, times, budgets, cats }, { from: 'quiz' })}>
                  {results.length === 1 ? 'Treffer ansehen' : 'Alle Treffer ansehen'}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
              <Link className="btn btn-ghost" href="/quiz">
                Schritt für Schritt
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
