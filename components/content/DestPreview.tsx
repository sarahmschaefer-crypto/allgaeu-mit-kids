// components/content/DestPreview.tsx — INTERIM Cover-Renderer (Phase 1).
// Rendert eine CoverSpec als Bild (Schichten: Hintergrund · Scrim · Slogan(+Balken)
// · Kategorie-Stempel oben rechts). Reine Präsentation, kein State → in Server- und
// Client-Komponenten nutzbar. Skaliert per Container-Queries (cqw) mit der Boxbreite.
//
// ⚠️ Übergangslösung: In Phase 5 wird genau dieses Component durch den echten
// <Cover>-Renderer aus components/cover/* (Branch cover-tool) ersetzt — gleiche Naht.
import type { CSSProperties } from 'react'
import { TYPES } from '@/lib/shapes/data'
import { COVER_COLORS, type CoverSpec } from '@/lib/content/types'

const TAGS = TYPES as Record<string, { label: string; color: string }>

export function DestPreview({
  spec,
  radius = 14,
  style,
  className = '',
}: {
  spec: CoverSpec
  radius?: number
  style?: CSSProperties
  className?: string
}) {
  const ink = COVER_COLORS.ink
  const white = COVER_COLORS.white
  const sloganColor = COVER_COLORS[spec.sloganColor]
  const barColor = COVER_COLORS[spec.sloganBarColor]
  const stamp = spec.stamp ? TAGS[spec.stamp] : null

  return (
    <div
      className={className}
      style={{
        position: 'relative',
        aspectRatio: '4 / 5',
        overflow: 'hidden',
        borderRadius: radius,
        containerType: 'inline-size',
        background: spec.bg.type === 'color' ? spec.bg.color : '#e9e4d8',
        ...style,
      }}
    >
      {/* 1 · Hintergrundfoto */}
      {spec.bg.type === 'photo' && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={spec.bg.photoUrl}
          alt=""
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        />
      )}

      {/* 2 · Scrim (Verlauf von unten) */}
      {spec.scrim > 0 && (
        <div
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(to top, rgba(7,14,112,${spec.scrim}) 0%, rgba(7,14,112,${spec.scrim * 0.5}) 35%, rgba(7,14,112,0) 65%)`,
          }}
        />
      )}

      {/* 5 · Kategorie-Stempel — IMMER oben rechts (fester Anker) */}
      {stamp && (
        <div
          style={{
            position: 'absolute',
            top: '6cqw',
            right: '6cqw',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2.4cqw',
            padding: '2.6cqw 4cqw',
            borderRadius: 999,
            background: stamp.color,
            color: ink,
            fontFamily: 'Nunito, system-ui, sans-serif',
            fontWeight: 800,
            fontSize: '4cqw',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            whiteSpace: 'nowrap',
          }}
        >
          {stamp.label}
        </div>
      )}

      {/* 6 · Slogan unten links, optional mit Farbbalken */}
      <div style={{ position: 'absolute', left: '6cqw', right: '6cqw', bottom: '6cqw' }}>
        <span
          style={{
            display: 'inline',
            boxDecorationBreak: 'clone',
            WebkitBoxDecorationBreak: 'clone',
            fontFamily: '"Playfair Display", Georgia, serif',
            fontWeight: 800,
            lineHeight: 1.08,
            fontSize: `calc(11cqw * ${spec.sloganSize})`,
            color: sloganColor,
            ...(spec.sloganBar
              ? {
                  background: barColor,
                  padding: '1cqw 2.4cqw',
                  // weißer Balken + weiße Schrift wäre unlesbar → bei gleichem Ton invertieren
                  color: spec.sloganBarColor === spec.sloganColor ? (spec.sloganColor === 'ink' ? white : ink) : sloganColor,
                }
              : null),
          }}
        >
          {spec.slogan}
        </span>
      </div>
    </div>
  )
}
