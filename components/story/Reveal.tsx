// components/story/Reveal.tsx — marker for the scroll-driven reveal controller
import type { CSSProperties, ReactNode } from 'react'

export function Reveal({
  delay = 0,
  className = '',
  children,
  style,
  id,
}: {
  delay?: number
  className?: string
  children: ReactNode
  style?: CSSProperties
  id?: string
}) {
  return (
    <div data-d={delay} id={id} className={`rv ${className}`} style={style}>
      {children}
    </div>
  )
}
