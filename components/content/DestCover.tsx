'use client'
// components/content/DestCover.tsx — echtes Cover eines Ziels als responsives 4:5-Bild.
// Nutzt resolveFigmaCover (gespeicherte Builder-Auswahl ODER Auto) + den
// cover-tool-Renderer (FigmaCover). FigmaCover braucht eine NUMERISCHE Breite →
// wir messen die Containerbreite (ResizeObserver + Sofort-Messung).
import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { FigmaCover } from '@/components/cover/FigmaCover'
import { resolveFigmaCover } from '@/lib/content/figma-cover'
import type { ShapesDest } from '@/lib/shapes/data'
import type { FigmaCoverChoice } from '@/lib/content/types'

type CoverDest = ShapesDest & { photos?: { url: string }[]; figmaCover?: FigmaCoverChoice }

export function DestCover({ dest, style }: { dest: CoverDest; style?: CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null)
  const [w, setW] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const measure = () => {
      const cw = Math.round(el.getBoundingClientRect().width)
      if (cw > 0) setW(cw)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const { template, content } = resolveFigmaCover(dest)

  return (
    <div
      ref={ref}
      style={{ width: '100%', aspectRatio: '4 / 5', overflow: 'hidden', background: '#e9e4d8', ...style }}
    >
      {w > 0 && <FigmaCover template={template} content={content} width={w} />}
    </div>
  )
}
