'use client'
import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

// ── Station data ─────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Ausflug',    color: '#022D53', desc: 'Bergpanoramen, Gondelbahnen & Wanderwege',
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=640&q=80',
  },
  {
    name: 'Baden',      color: '#00436C', desc: 'Badeseen, Bäche & kristallklares Wasser',
    image: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=640&q=80',
  },
  {
    name: 'Sport',      color: '#276299', desc: 'Wandern, Biken, Klettern & Winterabenteuer',
    image: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=640&q=80',
  },
  {
    name: 'Shop',       color: '#307A9A', desc: 'Allgäuer Produkte & regionale Souvenirs',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=640&q=80',
  },
  {
    name: 'Spielplatz', color: '#399CAA', desc: 'Abenteuerplätze, Wasserspiele & Toben',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=640&q=80',
  },
  {
    name: 'Attraktion', color: '#5BAEBD', desc: 'Freizeitparks, Erlebnisse & unvergesslicher Spaß',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=640&q=80',
  },
  {
    name: 'Gastro',     color: '#67C0C0', desc: 'Kässpätzle, Biergärten & Allgäuer Küche',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=640&q=80',
  },
  {
    name: 'Tierpark',   color: '#88D3C1', desc: 'Alpakas, Wildtiere & Erlebnisbauernhöfe',
    image: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef3?w=640&q=80',
  },
  {
    name: 'Kreatives',  color: '#9CDEAF', desc: 'Mitmach-Aktionen, Museen & Freilichtkultur',
    image: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=640&q=80',
  },
  {
    name: 'Unterkunft', color: '#AADC93', desc: 'Familienhotels, Ferienwohnungen & Berghütten',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=640&q=80',
  },
  {
    name: 'Kultur',     color: '#B8CB6E', desc: 'Schlösser, Burgen & lebendige Geschichte',
    image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=640&q=80',
  },
]

// ── SVG geometry (viewBox 0 0 1200 5200) ────────────────────────────────────
// Section height = 5200px = viewBox height → SVG y coords map 1:1 to CSS px

// Allgäu region outer boundary
const REGION_PATH =
  'M 260,820 C 380,680 540,650 700,690 C 860,730 1040,820 1100,1050 ' +
  'C 1150,1260 1150,2000 1120,2700 C 1090,3200 1090,3600 1070,3880 ' +
  'C 1030,4350 900,4800 660,5080 C 570,5200 440,5220 320,5170 ' +
  'C 200,5120 90,4870 60,4480 C 30,4100 40,3600 50,3100 ' +
  'C 60,2600 70,2000 80,1500 C 90,1000 160,840 260,820 Z'

// Alpine zone in the south
const ALPINE_PATH =
  'M 50,4300 C 200,4200 420,4180 630,4230 C 840,4280 1020,4260 1110,4180 ' +
  'L 1200,4180 L 1200,5300 L 0,5300 Z'

// Meadow / forest patches (decorative green blobs)
const MEADOW_PATCHES = [
  'M 180,1100 C 225,1045 320,1075 338,1185 C 356,1295 298,1350 215,1315 C 132,1280 135,1155 180,1100 Z',
  'M 760,1520 C 815,1455 925,1490 942,1605 C 959,1720 892,1770 802,1728 C 712,1686 705,1585 760,1520 Z',
  'M 390,2180 C 445,2115 575,2150 595,2275 C 615,2400 545,2455 448,2408 C 351,2361 335,2245 390,2180 Z',
  'M 850,2750 C 905,2685 1010,2715 1025,2835 C 1040,2955 968,3005 872,2960 C 776,2915 795,2815 850,2750 Z',
  'M 280,3400 C 335,3338 450,3365 468,3480 C 486,3595 415,3645 322,3600 C 229,3555 225,3462 280,3400 Z',
]

// Bodensee (Lake Constance) — eastern shore only, western edge of map
const BODENSEE_PATH =
  'M 68,3550 C 32,3625 12,3760 18,3930 C 24,4100 62,4215 110,4195 ' +
  'C 158,4175 182,4058 175,3900 C 168,3742 128,3620 95,3582 Z'

// Forggensee near Füssen
const FORGGENSEE_PATH =
  'M 1005,3720 C 1058,3688 1112,3730 1118,3838 C 1124,3946 1072,3990 1018,3958 ' +
  'C 964,3926 952,3840 1005,3720 Z'

// Iller river (central, north→south)
const ILLER_PATH =
  'M 470,1020 C 478,1600 488,2200 494,2800 C 500,3360 496,3950 468,4520'

// Lech river (east, north→south)
const LECH_PATH =
  'M 892,1180 C 912,1900 938,2640 958,3240 C 972,3640 998,3720 1035,3840'

// Town positions
const TOWNS = [
  { name: 'Memmingen',  cx: 580, cy: 1156 },
  { name: 'Kempten',    cx: 720, cy: 2720 },
  { name: 'Lindau',     cx: 88,  cy: 3778 },
  { name: 'Füssen',     cx: 1095,cy: 3653 },
  { name: 'Oberstdorf', cx: 675, cy: 4560 },
]

// Journey path — winding north → south through the Allgäu
const PATH_D = [
  'M 600,80',
  'C 950,200 1080,400 1020,620',
  'C 960,840 730,940 600,1080',
  'C 470,1220 200,1320 180,1540',
  'C 160,1740 340,1900 540,2040',
  'C 740,2180 1060,2240 1050,2460',
  'C 1040,2680 830,2840 640,2980',
  'C 450,3120 180,3200 170,3420',
  'C 160,3640 380,3780 580,3920',
  'C 780,4060 1080,4140 1050,4360',
  'C 1020,4580 800,4720 580,4840',
  'C 440,4920 380,5020 400,5180',
].join(' ')

// ── Component ────────────────────────────────────────────────────────────────

export default function CategoryJourney() {
  const [activeIndex,  setActiveIndex]  = useState(-1)
  const [drawnLength,  setDrawnLength]  = useState(0)
  const [totalLength,  setTotalLength]  = useState(0)
  const [pinPositions, setPinPositions] = useState<Array<{ x: number; y: number }>>([])
  const [pinLengths,   setPinLengths]   = useState<number[]>([])

  const sectionRef = useRef<HTMLElement>(null)
  const measureRef = useRef<SVGPathElement>(null)
  const rafRef     = useRef<number | null>(null)

  // ── Measure path after mount ─────────────────────────────────────────────
  useEffect(() => {
    const path = measureRef.current
    if (!path) return

    const total     = path.getTotalLength()
    const positions: Array<{ x: number; y: number }> = []
    const lengths: number[] = []

    for (let i = 0; i < CATEGORIES.length; i++) {
      const t   = i / (CATEGORIES.length - 1)
      const len = t * total
      const pt  = path.getPointAtLength(len)
      positions.push({ x: pt.x, y: pt.y })
      lengths.push(len)
    }

    setTotalLength(total)
    setPinPositions(positions)
    setPinLengths(lengths)
  }, [])

  // ── Scroll → rAF → drawnLength + activeIndex ─────────────────────────────
  useEffect(() => {
    const section = sectionRef.current
    if (!section || totalLength === 0 || pinLengths.length === 0) return

    const update = () => {
      const rect       = section.getBoundingClientRect()
      const scrollable = section.offsetHeight - window.innerHeight
      const progress   = Math.min(1, Math.max(0, -rect.top / scrollable))
      const drawn      = progress * totalLength

      setDrawnLength(drawn)

      let next = -1
      for (let i = 0; i < pinLengths.length; i++) {
        if (drawn >= pinLengths[i]) next = i
      }
      setActiveIndex(next)
      rafRef.current = null
    }

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      rafRef.current = requestAnimationFrame(update)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [totalLength, pinLengths])

  const dashOff = totalLength > 0 ? totalLength - drawnLength : 0

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        height: '5200px',
        background: '#F5EFE8',
        backgroundImage: 'url(/allgaeu-map.svg)',
        backgroundSize: '32% auto',
        backgroundRepeat: 'repeat-y',
        backgroundPosition: 'center top',
      }}
    >
      {/* ── Sticky heading ──────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 pt-10 pb-4 px-10 pointer-events-none"
           style={{ background: 'linear-gradient(to bottom, #F5EFE8 60%, transparent)' }}>
        <p className="label text-ink/40 mb-1">Allgäu mit Kids</p>
        <h2 style={{ fontFamily: 'var(--font-courier)' }}
            className="text-2xl md:text-4xl font-bold tracking-widest uppercase text-ink">
          Entdecke das Allgäu
        </h2>
      </div>

      {/* ── Full-section SVG: map + path + pins ─────────────────────── */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1200 5200"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* --- Terrain base --- */}
        <path d={REGION_PATH} fill="#EDE6D6" />

        {/* --- Alpine zone --- */}
        <path d={ALPINE_PATH} fill="#DDD5C0" />

        {/* --- Meadow / forest patches --- */}
        {MEADOW_PATCHES.map((d, i) => (
          <path key={i} d={d} fill="#CBD8B6" opacity="0.6" />
        ))}

        {/* --- Water bodies --- */}
        <path d={BODENSEE_PATH}   fill="#B8CCE0" stroke="#9AB8D4" strokeWidth="1.5" />
        <path d={FORGGENSEE_PATH} fill="#B8CCE0" stroke="#9AB8D4" strokeWidth="1.5" />

        {/* --- Rivers --- */}
        <path d={ILLER_PATH} fill="none" stroke="#A8BCE8" strokeWidth="3" strokeLinecap="round" opacity="0.7" />
        <path d={LECH_PATH}  fill="none" stroke="#A8BCE8" strokeWidth="3" strokeLinecap="round" opacity="0.7" />

        {/* --- Region outline --- */}
        <path d={REGION_PATH} fill="none" stroke="#B09568" strokeWidth="2" opacity="0.35" />

        {/* --- Town dots + labels --- */}
        {TOWNS.map(t => (
          <g key={t.name} opacity="0.55">
            <circle cx={t.cx} cy={t.cy} r="5" fill="#8C7455" />
            <text
              x={t.cx + 10}
              y={t.cy + 5}
              fill="#6B5B45"
              fontSize="22"
              fontFamily="'Source Code Pro', monospace"
              letterSpacing="1"
            >
              {t.name}
            </text>
          </g>
        ))}

        {/* --- Invisible measurement path --- */}
        <path ref={measureRef} d={PATH_D} fill="none" stroke="none" />

        {/* --- Dim ghost path --- */}
        <path
          d={PATH_D}
          fill="none"
          stroke="#B09568"
          strokeWidth="4"
          strokeDasharray="8 5"
          strokeLinecap="round"
          opacity="0.18"
        />

        {/* --- Drawn path --- */}
        {totalLength > 0 && (
          <path
            d={PATH_D}
            fill="none"
            stroke="#C9A84C"
            strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={totalLength}
            strokeDashoffset={dashOff}
          />
        )}

        {/* --- Pins --- */}
        {pinPositions.map((pos, i) => {
          const isPassed  = drawnLength >= (pinLengths[i] ?? Infinity)
          const isCurrent = i === activeIndex
          return (
            <circle
              key={isCurrent ? `pin-${i}-active` : `pin-${i}`}
              cx={pos.x}
              cy={pos.y}
              r="14"
              fill={CATEGORIES[i].color}
              stroke="#F5EFE8"
              strokeWidth="3"
              opacity={isPassed ? 1 : 0.2}
              style={{
                transformBox: 'fill-box',
                transformOrigin: 'center',
                transition: 'transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.3s ease',
                transform: isCurrent ? 'scale(1.5)' : isPassed ? 'scale(1.25)' : 'scale(1)',
                ...(isCurrent && { animation: 'jm-pulse 0.55s cubic-bezier(0.22, 1, 0.36, 1) both' }),
              }}
            />
          )
        })}
      </svg>

      {/* ── Station cards (HTML, absolute positioned) ───────────────── */}
      {pinPositions.map((pos, i) => {
        const isPassed  = drawnLength >= (pinLengths[i] ?? Infinity)
        const isRight   = i % 2 !== 0
        const cat       = CATEGORIES[i]

        return (
          <div
            key={i}
            className="absolute w-64 md:w-72 transition-all duration-500"
            style={{
              top:     `${pos.y - 160}px`,
              ...(isRight ? { right: '6%' } : { left: '6%' }),
              opacity:   isPassed ? 1 : 0,
              transform: isPassed ? 'translateY(0)' : 'translateY(14px)',
              transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          >
            <Link href={`/entdecken?category=${cat.name}`} className="block group">
              <div className="lofi-card overflow-hidden group-hover:shadow-[5px_5px_0_#1a1a1a] group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">

                {/* Photo */}
                <div className="relative w-full overflow-hidden" style={{ height: '160px' }}>
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover"
                    style={{ filter: 'saturate(0.85) sepia(0.08)' }}
                    sizes="(max-width: 768px) 256px, 288px"
                  />
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Station number */}
                  <p className="label mb-1" style={{ color: cat.color }}>
                    {String(i + 1).padStart(2, '0')} / {String(CATEGORIES.length).padStart(2, '0')}
                  </p>
                  {/* Category name */}
                  <h3
                    className="font-bold text-sm tracking-widest uppercase mb-1.5"
                    style={{ fontFamily: 'var(--font-source-code)', color: cat.color }}
                  >
                    {cat.name}
                  </h3>
                  {/* Description */}
                  <p className="text-xs leading-relaxed" style={{ color: '#7a7068' }}>
                    {cat.desc}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        )
      })}

      {/* ── Keyframe for pin pulse (injected inline) ────────────────── */}
      <style>{`
        @keyframes jm-pulse {
          0%   { transform: scale(1.0); }
          45%  { transform: scale(2.4); }
          100% { transform: scale(1.5); }
        }
      `}</style>
    </section>
  )
}
