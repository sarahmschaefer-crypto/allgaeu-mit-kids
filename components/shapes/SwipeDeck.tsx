'use client'
// components/shapes/SwipeDeck.tsx — editorial postcard swipe deck (ported from
// view_swipe.jsx) on the unified design tokens.
import { useState, useRef } from 'react'
import type { PointerEvent as RPointerEvent, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { DESTINATIONS, getDest, type ShapesDest } from '@/lib/shapes/data'
import { Photo, CatPill, Stars, MetaRow, DestCard, Container } from '@/components/shapes/primitives'
import { Blob, Squiggle } from '@/components/shapes/decor'

function SwipeCard({
  dest,
  onDecide,
  onOpen,
  isTop,
  offset,
  no,
}: {
  dest: ShapesDest
  onDecide: (a: 'like' | 'skip') => void
  onOpen: () => void
  isTop: boolean
  offset: number
  no: number
}) {
  const [drag, setDrag] = useState({ x: 0, y: 0, active: false })
  const start = useRef<{ x: number; y: number } | null>(null)

  const onDown = (e: RPointerEvent) => {
    if (!isTop) return
    start.current = { x: e.clientX, y: e.clientY }
    setDrag((d) => ({ ...d, active: true }))
    ;(e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId)
  }
  const onMove = (e: RPointerEvent) => {
    if (!start.current) return
    setDrag({ x: e.clientX - start.current.x, y: e.clientY - start.current.y, active: true })
  }
  const onUp = () => {
    if (!start.current) return
    const { x } = drag
    start.current = null
    if (Math.abs(x) > 110) {
      const dir = x > 0 ? 1 : -1
      setDrag({ x: dir * 620, y: drag.y, active: false })
      setTimeout(() => onDecide(dir > 0 ? 'like' : 'skip'), 180)
    } else {
      setDrag({ x: 0, y: 0, active: false })
    }
  }

  const rot = drag.x / 18
  const likeOp = Math.max(0, Math.min(1, drag.x / 90))
  const nopeOp = Math.max(0, Math.min(1, -drag.x / 90))
  const scale = isTop ? 1 : 1 - offset * 0.035
  const ty = isTop ? 0 : offset * 16

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 100 - offset,
        transform: `translate(${drag.x}px, ${drag.y + ty}px) rotate(${rot}deg) scale(${scale})`,
        transition: drag.active ? 'none' : 'transform .28s cubic-bezier(.2,.8,.3,1)',
        cursor: isTop ? (drag.active ? 'grabbing' : 'grab') : 'default',
        touchAction: 'none',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          height: '100%',
          background: 'var(--card)',
          borderRadius: 'var(--radius)',
          overflow: 'hidden',
          boxShadow: isTop ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
          border: '1px solid var(--ink)',
          display: 'flex',
          flexDirection: 'column',
          pointerEvents: isTop ? 'auto' : 'none',
        }}
      >
        <div style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <Photo cat={dest.cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={no + 3} />
          <div style={{ position: 'absolute', top: 16, left: 18 }}>
            <CatPill cat={dest.cat} />
          </div>
          <div style={{ position: 'absolute', top: 14, right: 18, fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-soft)' }}>
            Nº {String(no).padStart(2, '0')}
          </div>
          <span style={{ position: 'absolute', top: 30, left: 24, transform: 'rotate(-13deg)', border: '3px solid var(--c-natur)', color: 'var(--c-natur)', padding: '5px 16px', fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', opacity: likeOp, fontFamily: 'var(--font-body)', textTransform: 'uppercase', background: 'var(--card)' }}>
            Merken
          </span>
          <span style={{ position: 'absolute', top: 30, right: 24, transform: 'rotate(13deg)', border: '3px solid var(--ink)', color: 'var(--ink)', padding: '5px 16px', fontWeight: 700, fontSize: 24, letterSpacing: '0.12em', opacity: nopeOp, fontFamily: 'var(--font-body)', textTransform: 'uppercase', background: 'var(--card)' }}>
            Weiter
          </span>
        </div>
        <div style={{ padding: '20px 22px 22px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10 }}>
            <h3 style={{ fontSize: 28, lineHeight: 1.3 }}>{dest.name}</h3>
            <Stars rating={dest.rating} />
          </div>
          <div className="caption" style={{ fontSize: 16, marginTop: 4 }}>{dest.place}</div>
          <p style={{ margin: '12px 0 14px', color: 'var(--ink-soft)', fontSize: 14.5, lineHeight: 1.3, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {dest.blurb}
          </p>
          <hr className="rule-soft" />
          <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <MetaRow dest={dest} />
            <button className="link-arrow" onClick={onOpen} style={{ fontSize: 13 }}>
              Details →
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function CircleBtn({
  onClick,
  label,
  children,
  filled,
  accent,
}: {
  onClick: () => void
  label: string
  children: ReactNode
  filled?: boolean
  accent?: string
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 9 }}>
      <button
        onClick={onClick}
        aria-label={label}
        style={{
          width: 64,
          height: 64,
          borderRadius: '50%',
          border: filled ? 'none' : '1.5px solid var(--ink)',
          background: filled ? accent || 'var(--accent)' : 'transparent',
          color: filled ? '#fff' : 'var(--ink)',
          fontSize: 24,
          transition: 'transform .12s, background .15s',
        }}
      >
        {children}
      </button>
      <span className="kicker" style={{ fontSize: 10.5, letterSpacing: '0.18em' }}>
        {label}
      </span>
    </div>
  )
}

export function SwipeDeck() {
  const router = useRouter()
  const [idx, setIdx] = useState(0)
  const [liked, setLiked] = useState<string[]>([])
  const deck = DESTINATIONS
  const decide = (action: 'like' | 'skip') => {
    if (action === 'like')
      setLiked((l) => (l.includes(deck[idx].id) ? l : [...l, deck[idx].id]))
    setIdx((i) => i + 1)
  }
  const reset = () => {
    setIdx(0)
    setLiked([])
  }

  if (idx >= deck.length) {
    const matches = liked.map(getDest).filter(Boolean) as ShapesDest[]
    return (
      <Container style={{ paddingTop: 40, paddingBottom: 70, maxWidth: 1040 }} className="fade-in">
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <div className="kicker" style={{ marginBottom: 12 }}>Eure Auswahl</div>
          <h2 style={{ fontSize: 'clamp(34px, 5vw, 54px)' }}>Die Merkliste</h2>
          <p className="caption" style={{ fontSize: 17, marginTop: 8 }}>
            {matches.length === 0
              ? 'Diesmal war nichts dabei — blättert gerne erneut.'
              : `${matches.length} Ziele, die euch gefallen haben.`}
          </p>
          <button className="btn btn--ghost" onClick={reset} style={{ marginTop: 18 }}>
            Neu blättern
          </button>
        </div>
        {matches.length > 0 && (
          <>
            <hr className="rule" style={{ marginBottom: 28 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 22 }}>
              {matches.map((d) => (
                <DestCard key={d.id} dest={d} />
              ))}
            </div>
          </>
        )}
      </Container>
    )
  }

  return (
    <Container style={{ paddingTop: 30, paddingBottom: 50 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', paddingBottom: 16 }}>
        <div>
          <div className="kicker" style={{ marginBottom: 10 }}>Durchblättern</div>
          <h2 style={{ fontSize: 'clamp(30px, 4.4vw, 46px)', lineHeight: 1.3 }}>
            Swipe dich <em style={{ fontStyle: 'italic', fontWeight: 500 }}>durch</em> die Region
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="caption" style={{ fontSize: 15 }}>
            Blatt {String(idx + 1).padStart(2, '0')} / {String(deck.length).padStart(2, '0')}
          </div>
          <div className="kicker" style={{ marginTop: 6 }}>{liked.length} gemerkt</div>
        </div>
      </div>
      <hr className="rule" />

      <p style={{ textAlign: 'center', color: 'var(--ink-soft)', fontSize: 14.5, margin: '22px 0 8px' }}>
        Nach rechts ziehen = <strong style={{ color: 'var(--c-natur)', fontWeight: 700 }}>merken</strong>, nach links ={' '}
        <strong style={{ color: 'var(--ink)', fontWeight: 700 }}>weiter</strong>.
      </p>

      <div style={{ position: 'relative', maxWidth: 460, margin: '0 auto' }}>
        <div style={{ position: 'absolute', left: '-16%', top: '12%', width: '40%', zIndex: 0 }} aria-hidden="true">
          <Blob color="var(--yellow)" size={200} seed={9} jitter={0.3} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div style={{ position: 'absolute', right: '-18%', top: '30%', width: '42%', zIndex: 0 }} aria-hidden="true">
          <Blob color="var(--lavender)" size={200} seed={14} jitter={0.32} style={{ width: '100%', height: 'auto' }} />
        </div>
        <div style={{ position: 'absolute', right: '-10%', top: '-6%', width: '34%', zIndex: 0, transform: 'rotate(12deg)' }} aria-hidden="true">
          <Squiggle color="var(--violet)" width={160} height={56} humps={4} thickness={12} style={{ width: '100%', height: 'auto' }} />
        </div>

        <div style={{ position: 'relative', zIndex: 1, height: 490, marginTop: 14 }}>
          {deck
            .slice(idx, idx + 3)
            .reverse()
            .map((d, i, arr) => {
              const offset = arr.length - 1 - i
              return (
                <SwipeCard
                  key={d.id}
                  dest={d}
                  offset={offset}
                  isTop={offset === 0}
                  onDecide={decide}
                  onOpen={() => router.push(`/ausflug/${d.id}`)}
                  no={deck.indexOf(d) + 1}
                />
              )
            })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 30, marginTop: 26 }}>
        <CircleBtn onClick={() => decide('skip')} label="Weiter">
          ✕
        </CircleBtn>
        <CircleBtn onClick={() => router.push(`/ausflug/${deck[idx].id}`)} label="Details">
          ℹ
        </CircleBtn>
        <CircleBtn onClick={() => decide('like')} label="Merken" filled accent="var(--c-natur)">
          ♥
        </CircleBtn>
      </div>
    </Container>
  )
}
