// components/shapes/decor.tsx — deterministic decorative SVGs (Blob, Squiggle)
import type { CSSProperties } from 'react'

function rng(seed: number) {
  let s = (seed * 9301 + 49297) % 233280
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

function blobPath(seed = 1, n = 8, r = 80, jitter = 0.32) {
  const rnd = rng(seed)
  const pts: [number, number][] = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2
    const rr = r * (1 - jitter + rnd() * jitter * 2)
    pts.push([Math.cos(a) * rr, Math.sin(a) * rr])
  }
  const mid = (p: number[], q: number[]) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2]
  let d = ''
  const m0 = mid(pts[0], pts[1])
  d += `M${m0[0].toFixed(1)},${m0[1].toFixed(1)}`
  for (let i = 1; i <= n; i++) {
    const cur = pts[i % n]
    const nxt = pts[(i + 1) % n]
    const m = mid(cur, nxt)
    d += `Q${cur[0].toFixed(1)},${cur[1].toFixed(1)} ${m[0].toFixed(1)},${m[1].toFixed(1)}`
  }
  return d + 'Z'
}

export function Blob({
  color,
  size = 200,
  seed = 1,
  n = 8,
  jitter = 0.32,
  style,
  opacity = 1,
}: {
  color: string
  size?: number
  seed?: number
  n?: number
  jitter?: number
  style?: CSSProperties
  opacity?: number
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="-100 -100 200 200"
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <path d={blobPath(seed, n, 82, jitter)} fill={color} opacity={opacity} />
    </svg>
  )
}

function squigglePath(w: number, h: number, humps: number) {
  const amp = h / 2 - h * 0.16
  const midY = h / 2
  const seg = w / humps
  let d = `M0,${midY.toFixed(1)}`
  for (let i = 0; i < humps; i++) {
    const x1 = seg * i + seg / 2
    const x2 = seg * (i + 1)
    const dir = i % 2 === 0 ? -1 : 1
    d += ` Q${x1.toFixed(1)},${(midY + dir * amp).toFixed(1)} ${x2.toFixed(1)},${midY.toFixed(1)}`
  }
  return d
}

export function Squiggle({
  color,
  width = 300,
  height = 60,
  humps = 5,
  thickness,
  style,
}: {
  color: string
  width?: number
  height?: number
  humps?: number
  thickness?: number
  style?: CSSProperties
}) {
  const t = thickness || height * 0.34
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{ display: 'block', overflow: 'visible', ...style }}
      aria-hidden="true"
    >
      <path
        d={squigglePath(width, height, humps)}
        fill="none"
        stroke={color}
        strokeWidth={t}
        strokeLinecap="round"
      />
    </svg>
  )
}
