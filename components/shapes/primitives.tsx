// components/shapes/primitives.tsx — editorial UI primitives (Shapes design)
import Link from 'next/link'
import type { CSSProperties, ReactNode } from 'react'
import { CATEGORIES, BUDGETS, TIMES, type ShapesDest } from '@/lib/shapes/data'
import { Blob } from '@/components/shapes/decor'

const CAT = CATEGORIES as Record<string, { id: string; label: string; short: string; hue: number; emoji: string }>

// Coloured category tag: design-system icon (masked from /tags/<icon>.svg) + name.
// Interactive (button, toggles) when `onClick` is given, otherwise a static label.
export function Tag({
  label,
  icon,
  color,
  on = false,
  onClick,
}: {
  label: string
  icon: string
  color: string
  on?: boolean
  onClick?: () => void
}) {
  const mask = { WebkitMaskImage: `url(/tags/${icon}.svg)`, maskImage: `url(/tags/${icon}.svg)` } as CSSProperties
  const inner = (
    <>
      <span className="tag-ico" style={mask} aria-hidden="true" />
      {label}
    </>
  )
  const style = { '--tag': color } as CSSProperties
  if (!onClick) return <span className="tag" data-static="true" style={style}>{inner}</span>
  return (
    <button type="button" className="tag" data-on={on} style={style} onClick={onClick} aria-pressed={on}>
      {inner}
    </button>
  )
}

export function Container({
  children,
  style,
  className = '',
}: {
  children: ReactNode
  style?: CSSProperties
  className?: string
}) {
  return (
    <div className={className} style={{ maxWidth: 1180, margin: '0 auto', padding: '0 24px', ...style }}>
      {children}
    </div>
  )
}

export function Photo({
  label = '',
  cat,
  style,
  rounded = true,
  seed = 2,
}: {
  label?: string
  cat: string
  style?: CSSProperties
  rounded?: boolean
  seed?: number
}) {
  const hue = CAT[cat]?.hue ?? 88
  return (
    <div
      className="ph"
      style={{ ['--ph-h']: hue, borderRadius: rounded ? 'inherit' : 0, ...style } as CSSProperties}
    >
      <div
        style={{ position: 'absolute', right: '-12%', bottom: '-22%', width: '75%', pointerEvents: 'none' }}
        aria-hidden="true"
      >
        <Blob color={`oklch(0.875 0.06 ${hue})`} size={260} seed={seed} jitter={0.3} style={{ width: '100%', height: 'auto' }} />
      </div>
      {label ? <span className="ph__label">{label}</span> : null}
    </div>
  )
}

export function Stars({ rating, reviews, light }: { rating: number; reviews?: number; light?: boolean }) {
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 13, fontWeight: 700, color: light ? 'rgba(255,255,255,0.95)' : 'var(--ink-soft)' }}>
      <span style={{ color: 'var(--coral)' }}>★</span>
      {rating.toFixed(1)}
      {reviews != null && <span style={{ opacity: 0.7, fontWeight: 600 }}>({reviews.toLocaleString('de-DE')})</span>}
    </span>
  )
}

export function CatPill({ cat, light, full }: { cat: string; light?: boolean; full?: boolean }) {
  const c = CAT[cat]
  if (!c) return null
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontFamily: 'var(--font-body)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: 11.5, color: light ? 'rgba(255,255,255,0.95)' : 'var(--ink)', whiteSpace: 'nowrap' }}>
      <span style={{ width: 9, height: 9, borderRadius: '50%', background: `var(--c-${cat})`, boxShadow: light ? '0 0 0 1.5px rgba(255,255,255,0.5)' : 'none', flex: '0 0 auto' }} />
      {full ? c.label : c.short}
    </span>
  )
}

export function MetaRow({ dest }: { dest: ShapesDest }) {
  const minAge = ({ '0-2': 0, '3-5': 3, '6-9': 6, '10+': 10 } as Record<string, number>)[dest.ages[0]] ?? 0
  const ageLabel = minAge === 0 ? 'Jedes Alter' : `ab ${minAge} J.`
  const budget = BUDGETS.find((b) => b.id === dest.budget)
  const time = TIMES.find((t) => t.id === dest.time)
  const Item = ({ children }: { children: ReactNode }) => (
    <span style={{ whiteSpace: 'nowrap', color: 'var(--ink-soft)', fontSize: 13, fontWeight: 600 }}>{children}</span>
  )
  const Sep = () => <span aria-hidden="true" style={{ color: 'var(--line)', fontWeight: 400 }}>/</span>
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 10px', alignItems: 'center' }}>
      <Item>{ageLabel}</Item>
      <Sep />
      <Item>{time?.label}</Item>
      <Sep />
      <Item>{budget?.glyph}</Item>
    </div>
  )
}

export function DestCard({ dest }: { dest: ShapesDest }) {
  return (
    <Link href={`/ausflug/${dest.id}`} className="dc-link" style={{ textDecoration: 'none', color: 'inherit' }}>
      <article style={{ display: 'flex', flexDirection: 'column', gap: 13, cursor: 'pointer' }}>
        <div style={{ position: 'relative', aspectRatio: '4 / 5', overflow: 'hidden', borderRadius: 'var(--radius)' }}>
          <Photo label={dest.name} cat={dest.cat} style={{ position: 'absolute', inset: 0 }} rounded={false} seed={dest.name.length + 2} />
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <CatPill cat={dest.cat} />
          {/* Display-Schrift explizit: DestCard wird auch in #story-root (Landing)
              gerendert, wo sonst die globale h3-Regel erben würde → Leak schließen. */}
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 23, lineHeight: 1.3 }}>{dest.name}</h3>
          <div className="caption" style={{ fontSize: 15 }}>{dest.place}</div>
        </div>
      </article>
    </Link>
  )
}
