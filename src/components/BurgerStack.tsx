// The build-your-burger illustration: one marker-style SVG per layer, stacked
// top to bottom. Layers drop in and squash out as the build changes.
import { AnimatePresence, motion } from 'motion/react'

import { BUILDER, type LayerKind } from '../data'
import type { Build } from '../shared/pricing'
import { cx } from '../lib/hooks'

const INK = '#0b0b0b'
const S = { stroke: INK, strokeWidth: 5, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

function Layer({ kind, tone, seeds }: { kind: LayerKind; tone?: string; seeds?: boolean }) {
  switch (kind) {
    case 'bun-top':
      return (
        <svg viewBox="0 0 300 112" className="w-full">
          <path d="M22 104C18 46 72 10 150 10s132 36 128 94z" fill={tone} {...S} />
          <path d="M60 42c18-14 46-22 76-22" fill="none" stroke="#fff" strokeOpacity=".45" strokeWidth="8" strokeLinecap="round" />
          {seeds && [[96, 46], [130, 34], [168, 38], [204, 50], [116, 66], [156, 60], [192, 74], [80, 70], [228, 72]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx="6" ry="3.4" transform={`rotate(${(i % 3) * 25 - 20} ${x} ${y})`} fill="#fdf8e9" stroke={INK} strokeWidth="2" />)}
        </svg>
      )
    case 'lettuce-wrap':
      return (
        <svg viewBox="0 0 300 70" className="w-full">
          <path d="M18 62c-4-30 30-50 60-46 10-12 34-14 46-4 14-10 40-10 52 2 16-10 40-6 50 6 30-4 60 16 56 42z" fill={tone} {...S} />
          <path d="M60 50c20-10 40-12 60-6M150 30v28M200 36c-10 8-18 16-22 24" fill="none" stroke={INK} strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'bun-bottom':
      return (
        <svg viewBox="0 0 300 54" className="w-full">
          <path d="M24 8h252c4 0 6 4 5 8-4 18-20 30-44 30H63C39 46 23 34 19 16c-1-4 1-8 5-8z" fill={tone} {...S} />
        </svg>
      )
    case 'patty':
      return (
        <svg viewBox="0 0 300 50" className="w-full">
          <path d="M16 18c0-8 8-12 18-12h232c10 0 18 4 18 12v12c0 8-8 14-18 14H34c-10 0-18-6-18-14z" fill="#5b2d17" {...S} />
          <path d="M44 22l20-6M92 28l22-8M150 22l24-6M206 28l22-8M246 20l14-4" stroke="#2b1309" strokeWidth="4" strokeLinecap="round" />
        </svg>
      )
    case 'chicken':
      return (
        <svg viewBox="0 0 300 56" className="w-full">
          <path d="M12 26c0-10 10-16 20-14 6-8 18-8 24-2 8-8 22-8 30 0 8-8 22-8 30 0 8-8 22-8 30 0 8-8 22-8 30 0 8-8 22-6 28 2 10-2 22 4 22 14 4 8-2 18-12 20-6 8-20 8-26 2-8 6-22 6-30 0-8 6-22 6-30 0-8 6-22 6-30 0-8 6-22 6-30 0-8 6-20 6-26-2-12 0-22-10-20-22z" fill="#d98b2b" {...S} />
          <path d="M60 28l6-4M120 32l6-5M180 28l6-4M236 32l6-5" stroke="#8a4a10" strokeWidth="3.5" strokeLinecap="round" />
        </svg>
      )
    case 'plant':
      return (
        <svg viewBox="0 0 300 50" className="w-full">
          <path d="M16 18c0-8 8-12 18-12h232c10 0 18 4 18 12v12c0 8-8 14-18 14H34c-10 0-18-6-18-14z" fill="#6e3a2b" {...S} />
          {[[50, 22], [90, 30], [130, 20], [170, 30], [210, 22], [250, 30], [70, 34], [190, 16]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.4" fill={i % 2 ? '#e8b25a' : '#8bbf4a'} />)}
        </svg>
      )
    case 'cheese':
      return (
        <svg viewBox="0 0 300 40" className="w-full">
          <path d="M20 6h260l-18 12-6 18-14-12-22 14-10-14-30 10-12-12-30 14-14-14-26 12-8-14-26 12-10-16z" fill={tone} {...S} />
        </svg>
      )
    case 'lettuce':
      return (
        <svg viewBox="0 0 300 34" className="w-full">
          <path d="M10 18c10-12 20 8 30-2s20 8 30-2 20 8 30-2 20 8 30-2 20 8 30-2 20 8 30-2 20 8 30-2 20 8 30-2 18 8 30 0c4 6 0 12-6 12H18c-8 0-12-6-8-12z" fill="#7cc242" {...S} />
        </svg>
      )
    case 'tomato':
      return (
        <svg viewBox="0 0 300 30" className="w-full">
          {[78, 150, 222].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="15" rx="62" ry="11" fill="#e0332b" {...S} />
              <path d={`M${x - 26} 15h52`} stroke="#ffb3a1" strokeWidth="3" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      )
    case 'onion':
      return (
        <svg viewBox="0 0 300 24" className="w-full">
          {[70, 130, 190, 240].map((x) => (
            <ellipse key={x} cx={x} cy="12" rx="40" ry="7" fill="#f4e6f2" stroke="#8d3a8a" strokeWidth="5" />
          ))}
        </svg>
      )
    case 'pickles':
      return (
        <svg viewBox="0 0 300 24" className="w-full">
          {[54, 104, 154, 204, 250].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="12" rx="26" ry="8" fill="#8fb339" {...S} strokeWidth={4} />
              <path d={`M${x - 10} 12h20`} stroke="#d7e58a" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          ))}
        </svg>
      )
    case 'bacon':
      return (
        <svg viewBox="0 0 300 30" className="w-full">
          <path d="M14 14c20-10 34 10 54 0s34 10 54 0 34 10 54 0 34 10 54 0 34 10 56 0v8c-22 10-36-10-56 0s-34-10-54 0-34-10-54 0-34-10-54 0-34-10-54 0z" fill="#b8432a" {...S} strokeWidth={4} />
          <path d="M20 17c20-8 34 8 54 0s34 8 54 0 34 8 54 0 34 8 54 0" fill="none" stroke="#f3b69a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )
    case 'jalapeno':
      return (
        <svg viewBox="0 0 300 24" className="w-full">
          {[60, 112, 164, 216, 252].map((x) => (
            <g key={x}>
              <circle cx={x} cy="12" r="10" fill="#4f9a2e" {...S} strokeWidth={4} />
              <circle cx={x} cy="12" r="4" fill="#e9f3b5" />
            </g>
          ))}
        </svg>
      )
    case 'egg':
      return (
        <svg viewBox="0 0 300 40" className="w-full">
          <path d="M30 24c-6-14 20-20 40-16 20-8 56-6 80-2 30-6 70-6 90 2 26-2 40 10 30 20-8 10-30 8-50 8H70c-24 0-36-2-40-12z" fill="#fffaf0" {...S} />
          <ellipse cx="150" cy="20" rx="30" ry="11" fill="#f5b31b" {...S} strokeWidth={4} />
        </svg>
      )
    case 'rings':
      return (
        <svg viewBox="0 0 300 36" className="w-full">
          {[80, 150, 220].map((x) => (
            <g key={x}>
              <ellipse cx={x} cy="18" rx="44" ry="13" fill="#e2a242" {...S} />
              <ellipse cx={x} cy="18" rx="22" ry="5" fill="#fdf8e9" stroke={INK} strokeWidth="3" />
            </g>
          ))}
        </svg>
      )
    case 'sauce':
      return (
        <svg viewBox="0 0 300 26" className="w-full">
          <path d="M30 6h240c6 0 6 6 0 8l-16 4c-4 6-6 8-10 8s-6-4-6-8l-40 0c-2 6-6 8-10 8s-8-4-8-8l-60 0c-2 6-6 8-10 8s-8-4-8-8l-38-2c-2 6-6 8-10 8s-8-4-8-8l-16-4c-6-2-6-8 0-8z" fill={tone} {...S} strokeWidth={4} />
        </svg>
      )
  }
}

// How far each layer tucks under the one above it, in % of its own width.
const OVERLAP: Partial<Record<LayerKind, number>> = { 'bun-top': 0, sauce: -6, cheese: -4, lettuce: -3, tomato: -2, onion: -2, pickles: -2, jalapeno: -2, bacon: -3, egg: -4, rings: -3, patty: -3, chicken: -4, plant: -3, 'bun-bottom': -2, 'lettuce-wrap': -1 }

export function stackLayers(build: Build) {
  const bun = BUILDER.buns.find((b) => b.id === build.bun) ?? BUILDER.buns[0]
  const protein = BUILDER.proteins.find((p) => p.id === build.protein) ?? BUILDER.proteins[0]
  const cheese = BUILDER.cheeses.find((c) => c.id === build.cheese)
  const sauce = BUILDER.sauces.find((s) => s.id === build.sauce)
  const layers: { id: string; kind: LayerKind; tone?: string; seeds?: boolean }[] = []
  const wrap = bun.layer === 'lettuce-wrap'
  layers.push(wrap ? { id: 'top', kind: 'lettuce-wrap', tone: bun.tone } : { id: 'top', kind: 'bun-top', tone: bun.tone, seeds: bun.id === 'brioche' || bun.id === 'seeded' })
  if (sauce?.tone) layers.push({ id: `sauce-${sauce.id}`, kind: 'sauce', tone: sauce.tone })
  for (const t of build.toppings) {
    const top = BUILDER.toppings.find((x) => x.id === t)
    if (top) layers.push({ id: `top-${t}`, kind: top.layer })
  }
  for (let i = 0; i < build.patties; i++) {
    if (cheese?.tone) layers.push({ id: `cheese-${i}`, kind: 'cheese', tone: cheese.tone })
    layers.push({ id: `patty-${i}`, kind: protein.layer })
  }
  layers.push(wrap ? { id: 'bottom', kind: 'lettuce-wrap', tone: bun.tone } : { id: 'bottom', kind: 'bun-bottom', tone: bun.tone })
  return layers
}

export function BurgerStack({ build, className, label }: { build: Build; className?: string; label: string }) {
  const layers = stackLayers(build)
  return (
    <div role="img" aria-label={label} className={cx('relative flex w-full flex-col', className)}>
      <AnimatePresence initial={false} mode="popLayout">
        {layers.map((l, i) => (
          <motion.div
            key={l.id}
            layout
            initial={{ opacity: 0, y: -60, scaleY: 0.6 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, scale: 0.7, transition: { duration: 0.15 } }}
            transition={{ type: 'spring', stiffness: 420, damping: 26 }}
            style={{ marginTop: i === 0 ? 0 : `${OVERLAP[l.kind] ?? -2}%`, zIndex: layers.length - i }}
            className="relative"
          >
            <Layer kind={l.kind} tone={l.tone} seeds={l.seeds} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
