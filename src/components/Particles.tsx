import { useEffect, useRef } from 'react'

interface Props {
  /** Density multiplier. */
  count?: number
  /** When true, particles occasionally drift into the outline of a heart. */
  hearts?: boolean
}

interface P {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  a: number
  ci: number
  hx: number
  hy: number
}

const COLORS = ['196,181,253', '124,58,237', '200,162,230', '250,250,250']

/**
 * A lightweight floating-particle field on a canvas. Every so often (when
 * `hearts` is on) the particles ease toward the outline of a small heart, hold,
 * then scatter back to free drift — the idle easter egg.
 */
export default function Particles({ count = 60, hearts = true }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = (canvas.width = window.innerWidth)
    let h = (canvas.height = window.innerHeight)
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = w * dpr
    canvas.height = h * dpr
    ctx.scale(dpr, dpr)

    const n = reduce ? Math.floor(count / 2) : count
    const parts: P[] = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.8 + 0.4,
      a: Math.random() * 0.5 + 0.15,
      ci: Math.floor(Math.random() * COLORS.length),
      hx: 0,
      hy: 0,
    }))

    // Precompute a heart outline the particles can snap to.
    const heartPoints: Array<[number, number]> = []
    const hn = parts.length
    for (let i = 0; i < hn; i++) {
      const t = (i / hn) * Math.PI * 2
      const hx = 16 * Math.pow(Math.sin(t), 3)
      const hy =
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      heartPoints.push([hx, -hy])
    }

    let raf = 0
    let mode: 'free' | 'gather' | 'hold' = 'free'
    let modeUntil = performance.now() + 12000 + Math.random() * 8000

    const draw = (now: number) => {
      ctx.clearRect(0, 0, w, h)

      if (hearts && !reduce && now > modeUntil) {
        if (mode === 'free') {
          mode = 'gather'
          modeUntil = now + 3500
          const cx = w / 2
          const cy = h / 2
          const scale = Math.min(w, h) * 0.014
          parts.forEach((p, i) => {
            const [px, py] = heartPoints[i % heartPoints.length]
            p.hx = cx + px * scale
            p.hy = cy + py * scale
          })
        } else if (mode === 'gather') {
          mode = 'hold'
          modeUntil = now + 2200
        } else {
          mode = 'free'
          modeUntil = now + 14000 + Math.random() * 9000
        }
      }

      for (const p of parts) {
        if (mode === 'gather' || mode === 'hold') {
          p.x += (p.hx - p.x) * 0.06
          p.y += (p.hy - p.y) * 0.06
        } else {
          p.x += p.vx
          p.y += p.vy
          if (p.x < 0) p.x = w
          if (p.x > w) p.x = 0
          if (p.y < 0) p.y = h
          if (p.y > h) p.y = 0
        }
        const color = COLORS[p.ci]
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color},${p.a})`
        ctx.shadowBlur = 8
        ctx.shadowColor = 'rgba(124,58,237,0.6)'
        ctx.fill()
      }
      ctx.shadowBlur = 0
      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    const onResize = () => {
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.scale(dpr, dpr)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
    }
  }, [count, hearts])

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[2] h-full w-full"
      style={{ width: '100vw', height: '100vh' }}
      aria-hidden
    />
  )
}
