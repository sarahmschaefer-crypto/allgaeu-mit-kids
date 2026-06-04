'use client'
// components/shapes/MapExplore.tsx — editorial stylized map with pins + side
// list (ported from view_map.jsx).
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DESTINATIONS, CATEGORIES, getDest, type ShapesDest } from '@/lib/shapes/data'
import { Photo, CatPill, Stars, Container } from '@/components/shapes/primitives'

function MapPin({
  dest,
  active,
  hovered,
  onClick,
  onHover,
}: {
  dest: ShapesDest
  active: boolean
  hovered: boolean
  onClick: () => void
  onHover: (id: string | null) => void
}) {
  const big = active || hovered
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => onHover(dest.id)}
      onMouseLeave={() => onHover(null)}
      style={{
        position: 'absolute',
        left: dest.map.x + '%',
        top: dest.map.y + '%',
        transform: `translate(-50%, -50%) scale(${big ? 1.25 : 1})`,
        transformOrigin: 'center',
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        zIndex: big ? 20 : 5,
        transition: 'transform .15s ease',
        filter: big
          ? 'drop-shadow(0 5px 9px rgba(40,30,90,.28))'
          : 'drop-shadow(0 2px 3px rgba(40,30,90,.2))',
      }}
      aria-label={dest.name}
    >
      <span style={{ display: 'grid', placeItems: 'center', width: 24, height: 24, borderRadius: '50%', background: `var(--c-${dest.cat})`, border: '2.5px solid var(--bg)' }}>
        <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--bg)' }} />
      </span>
    </button>
  )
}

export function MapExplore() {
  const router = useRouter()
  const [cats, setCats] = useState<string[]>([])
  const [hovered, setHovered] = useState<string | null>(null)
  const [active, setActive] = useState<string | null>(null)
  const catItems = Object.values(CATEGORIES)
  const toggleCat = (id: string) => setCats((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))
  const visible = DESTINATIONS.filter((d) => cats.length === 0 || cats.includes(d.cat))
  const activeDest = active ? getDest(active) : null
  const open = (id: string) => router.push(`/ausflug/${id}`)

  return (
    <Container style={{ paddingTop: 30, paddingBottom: 56 }} className="fade-in">
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 18, marginBottom: 14, flexWrap: 'wrap' }}>
        <div>
          <div className="kicker" style={{ marginBottom: 8 }}>Karte · Region Allgäu</div>
          <h2 style={{ fontSize: 'clamp(30px, 4vw, 44px)', lineHeight: 1.3 }}>Auf der Karte</h2>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {catItems.map((c) => (
            <button key={c.id} className={'chip cat-' + c.id} data-on={cats.includes(c.id)} onClick={() => toggleCat(c.id)}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: `var(--c-${c.id})`, flex: '0 0 auto' }} />
              {c.short}
            </button>
          ))}
        </div>
      </div>
      <hr className="rule" style={{ marginBottom: 22 }} />

      <div className="map-layout" style={{ display: 'flex', gap: 26, alignItems: 'stretch' }}>
        <div
          style={{
            position: 'relative',
            flex: 1,
            minWidth: 0,
            height: 580,
            borderRadius: 'var(--radius)',
            overflow: 'hidden',
            border: '1px solid var(--ink)',
            background: `
              radial-gradient(circle at 34% 41%, oklch(0.78 0.08 255 / 0.5) 0 4%, transparent 4.6%),
              radial-gradient(ellipse 7% 4% at 60% 80%, oklch(0.78 0.08 255 / 0.45) 0 60%, transparent 62%),
              radial-gradient(circle at 14% 46%, oklch(0.78 0.08 255 / 0.4) 0 2.4%, transparent 3%),
              linear-gradient(150deg, oklch(0.92 0.045 150) 0%, oklch(0.91 0.04 120) 45%, oklch(0.91 0.05 95) 100%)`,
          }}
        >
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.45 }}>
            <path d="M0,72 L18,52 L30,66 L46,40 L60,60 L78,34 L100,58" fill="none" stroke="oklch(0.6 0.06 150)" strokeWidth="0.5" strokeDasharray="1.4 1.4" />
            <path d="M0,86 L22,70 L40,82 L58,66 L80,80 L100,70" fill="none" stroke="oklch(0.6 0.06 150)" strokeWidth="0.5" strokeDasharray="1.4 1.4" />
          </svg>
          <span style={{ position: 'absolute', left: 18, top: 16, fontFamily: 'ui-monospace, monospace', fontSize: 10.5, letterSpacing: '0.1em', color: 'oklch(0.42 0.05 150)', textTransform: 'uppercase' }}>
            Stilisierte Karte · Allgäu
          </span>
          {visible.map((d) => (
            <MapPin key={d.id} dest={d} active={active === d.id} hovered={hovered === d.id} onClick={() => setActive(d.id)} onHover={setHovered} />
          ))}

          {activeDest && (
            <div style={{ position: 'absolute', left: 18, right: 18, bottom: 18, maxWidth: 380 }}>
              <div style={{ background: 'var(--card)', borderRadius: 'var(--radius)', border: '1px solid var(--ink)', overflow: 'hidden', display: 'flex', boxShadow: 'var(--shadow-lg)' }}>
                <Photo cat={activeDest.cat} style={{ width: 116, flex: '0 0 116px' }} rounded={false} seed={5} />
                <div style={{ padding: '14px 16px', flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'flex-start' }}>
                    <CatPill cat={activeDest.cat} />
                    <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: 'var(--ink-faint)', fontSize: 20, lineHeight: 1.3, padding: 0 }} aria-label="Schließen">
                      ×
                    </button>
                  </div>
                  <h3 style={{ fontSize: 20, margin: '9px 0 2px' }}>{activeDest.name}</h3>
                  <div className="caption" style={{ fontSize: 14, marginBottom: 12 }}>
                    {activeDest.place} · {activeDest.duration}
                  </div>
                  <button className="link-arrow" style={{ fontSize: 13 }} onClick={() => open(activeDest.id)}>
                    Details ansehen <span>→</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="map-list" style={{ width: 320, flex: '0 0 320px', display: 'flex', flexDirection: 'column', maxHeight: 580, overflowY: 'auto', borderTop: '1px solid var(--ink)' }}>
          {visible.map((d) => (
            <button
              key={d.id}
              onClick={() => open(d.id)}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                display: 'flex',
                gap: 14,
                textAlign: 'left',
                background: hovered === d.id ? 'var(--bg-2)' : 'transparent',
                border: 'none',
                borderBottom: '1px solid var(--line-soft)',
                padding: '13px 6px',
                cursor: 'pointer',
                transition: 'background .12s, padding-left .15s',
                alignItems: 'center',
                paddingLeft: hovered === d.id ? 14 : 6,
              }}
            >
              <Photo cat={d.cat} style={{ width: 54, height: 54, borderRadius: 'var(--radius-sm)', flex: '0 0 54px' }} seed={d.name.length} />
              <span style={{ minWidth: 0, display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
                <span style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                  <CatPill cat={d.cat} />
                  <Stars rating={d.rating} />
                </span>
                <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 17, lineHeight: 1.3 }}>{d.name}</span>
                <span className="caption" style={{ fontSize: 13.5 }}>{d.place}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
      <style>{`@media (max-width: 860px){ .map-layout{ flex-direction: column; } .map-list{ width:100% !important; flex-basis:auto !important; max-height:none !important; } }`}</style>
    </Container>
  )
}
