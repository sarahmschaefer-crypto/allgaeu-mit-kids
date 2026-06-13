'use client'
// components/shapes/controls.tsx — kleine, wiederverwendbare Steuer-Primitives
// des Design-Systems: Segmented (Ansicht umschalten) und SortSelect (Sortieren).
// Look kommt aus den globalen Klassen .segmented / .select in globals.css.

export type Option<T extends string> = { value: T; label: string }

// Segmented control (z. B. Liste ⇄ Karte). Eine Quelle, getokte Optik.
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: Option<T>[]
  value: T
  onChange: (v: T) => void
  ariaLabel?: string
}) {
  return (
    <div className="segmented" role="tablist" aria-label={ariaLabel}>
      {options.map((o) => {
        const on = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={on}
            className="segmented__btn"
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

// Token-gestyltes natives Select mit Label + Chevron (z. B. Sortieren).
export function SortSelect<T extends string>({
  value,
  onChange,
  options,
  label = 'Sortieren',
}: {
  value: T
  onChange: (v: T) => void
  options: Option<T>[]
  label?: string
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        fontSize: 12,
        color: 'var(--ink-soft)',
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
      }}
    >
      {label}
      <span className="select">
        <select value={value} onChange={(e) => onChange(e.target.value as T)} aria-label={label}>
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </span>
    </label>
  )
}
