// components/story/Placeholder.tsx — striped editorial placeholder
import type { CSSProperties } from 'react'

export function Placeholder({
  label,
  className = '',
  style,
  ph,
}: {
  label: string
  className?: string
  style?: CSSProperties
  ph?: [string, string]
}) {
  const s: Record<string, string | number> = { ...(style as object) }
  if (ph) {
    s['--ph-a'] = ph[0]
    s['--ph-b'] = ph[1]
  }
  return <div className={`ph ${className}`} data-label={label} style={s as CSSProperties} />
}
