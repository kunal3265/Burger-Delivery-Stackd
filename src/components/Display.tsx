import { Flame, Leaf, Sparkles, Trophy } from 'lucide-react'
import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Link } from 'react-router'

import { IMAGES, SITE, TAG_LABELS, type ImageKey, type Tag } from '../data'
import { cx, useReducedMotion } from '../lib/hooks'
import { money } from '../shared/pricing'
import { SquiggleArrow, Star, TICKER_ICONS } from './Doodles'

export function Logo({ className, as = 'span' }: { className?: string; as?: 'span' | 'link' }) {
  const mark = <span className={cx('wordmark text-[34px] leading-none', className)}>{SITE.name}</span>
  if (as === 'link')
    return (
      <Link to="/" aria-label={`${SITE.name} home`} className="on-ink inline-flex min-h-10 items-center rounded-[var(--radius-xs)]">
        {mark}
      </Link>
    )
  return mark
}

export function Img({ src, alt, className, eager }: { src: ImageKey; alt: string; className?: string; eager?: boolean }) {
  return <img src={IMAGES[src]} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} draggable={false} />
}

/** A looping line of text or nodes. Duplicated once so the loop is seamless. */
export function Marquee({ children, className, speed = 'normal', reverse, label }: { children: ReactNode; className?: string; speed?: 'normal' | 'fast'; reverse?: boolean; label?: string }) {
  return (
    <div className={cx('relative flex overflow-hidden', className)} role={label ? 'marquee' : undefined} aria-label={label}>
      <div className={cx('flex w-max shrink-0', reverse ? 'animate-marquee-reverse' : speed === 'fast' ? 'animate-marquee-fast' : 'animate-marquee')} aria-hidden={!!label}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  )
}

/** The skewed red and black band of menu words and doodles. */
export function Ticker({ words, className }: { words: string[]; className?: string }) {
  const row = (tone: 'ink' | 'red') => (
    <Marquee speed="fast" reverse={tone === 'red'}>
      {words.map((w, i) => {
        const Icon = TICKER_ICONS[i % TICKER_ICONS.length]
        return (
          <span key={w + i} className="flex items-center gap-5 px-5">
            <span className="condensed text-[20px] whitespace-nowrap">{w}</span>
            <Icon className="size-7" />
          </span>
        )
      })}
    </Marquee>
  )
  return (
    <div className={cx('relative overflow-hidden py-8', className)} aria-hidden>
      <div className="on-red absolute inset-x-[-4%] top-[58%] -translate-y-1/2 rotate-[2.2deg] bg-ketchup py-2 text-cream">{row('red')}</div>
      <div className="on-ink relative -mx-[2%] -rotate-[1.2deg] bg-ink py-2.5 text-cream">{row('ink')}</div>
    </div>
  )
}

/** Text flowing along a wave, the "new stack in town" ribbon. */
export function WavyRibbon({ text, className }: { text: string; className?: string }) {
  const phrase = `${text}   \u2736   `
  const long = phrase.repeat(8)
  const reduced = useReducedMotion()
  return (
    <svg viewBox="0 0 1200 220" className={cx('w-full', className)} aria-hidden preserveAspectRatio="xMidYMid slice">
      <defs>
        <path id="ribbon-wave" d="M-600 120 C-450 40 -300 200 -150 120 S150 40 300 120 S600 200 750 120 S1050 40 1200 120 S1500 200 1650 120 S1950 40 2100 120" />
      </defs>
      <use href="#ribbon-wave" fill="none" stroke="var(--color-ketchup)" strokeWidth="78" />
      <text className="display" fill="var(--color-cream)" fontSize="54" dy="19" style={{ fontStretch: '75%', letterSpacing: '0.02em' }}>
        <textPath href="#ribbon-wave" startOffset="0">
          {long}
          {!reduced && <animate attributeName="startOffset" from="0" to="-1100" dur="18s" repeatCount="indefinite" />}
        </textPath>
      </text>
    </svg>
  )
}

export function SectionHeading({ kicker, title, body, align = 'center', className, as: As = 'h2', tone = 'ink' }: { kicker?: string; title: ReactNode; body?: ReactNode; align?: 'center' | 'left'; className?: string; as?: 'h1' | 'h2'; tone?: 'ink' | 'cream' }) {
  return (
    <div className={cx('flex flex-col gap-3', align === 'center' ? 'items-center text-center' : 'items-start', className)}>
      {kicker && <p className={cx('condensed text-[18px]', tone === 'cream' ? 'text-cream' : 'text-ketchup-ink')}>{kicker}</p>}
      <As className={cx('display text-[clamp(40px,5.4vw,68px)]', tone === 'cream' ? 'text-cream' : 'text-ink')}>{title}</As>
      {body && <p className={cx('max-w-[560px] text-[17px] leading-relaxed', tone === 'cream' ? 'text-on-red-muted' : 'text-muted')}>{body}</p>}
    </div>
  )
}

/** Red title band at the top of every inner page, with a scalloped edge. */
export function PageHero({ kicker, title, body, children }: { kicker?: string; title: ReactNode; body?: ReactNode; children?: ReactNode }) {
  return (
    <section className="on-red relative bg-ketchup text-cream">
      <div className="doodles absolute inset-0" aria-hidden />
      <div className="container-page relative flex flex-col items-center gap-5 pt-40 pb-14 text-center sm:pt-44">
        {kicker && <p className="condensed text-[18px] sm:text-[20px]">{kicker}</p>}
        <h1 className="display text-[clamp(56px,10vw,128px)]">{title}</h1>
        {body && <p className="max-w-[620px] text-[17px] leading-relaxed text-on-red-muted sm:text-[18px]">{body}</p>}
        {children}
      </div>
      <div className="scallop absolute inset-x-0 top-full" aria-hidden />
    </section>
  )
}

const TAG_STYLE: Record<Tag, { cls: string; icon: ReactNode }> = {
  new: { cls: 'bg-mustard text-ink', icon: <Sparkles aria-hidden /> },
  spicy: { cls: 'bg-ketchup text-cream', icon: <Flame aria-hidden /> },
  veg: { cls: 'bg-pickle-soft text-pickle', icon: <Leaf aria-hidden /> },
  best: { cls: 'bg-ink text-cream', icon: <Trophy aria-hidden /> },
}

export function TagBadge({ tag, className }: { tag: Tag; className?: string }) {
  const s = TAG_STYLE[tag]
  return <span className={cx('inline-flex h-7 items-center gap-1 rounded-[8px] px-2.5 text-[13px] font-semibold [&_svg]:size-3.5', s.cls, className)}>{s.icon}{TAG_LABELS[tag]}</span>
}

export function Badge({ children, tone = 'bun', className }: { children: ReactNode; tone?: 'bun' | 'ink' | 'ketchup' | 'mustard' | 'pickle'; className?: string }) {
  return (
    <span
      className={cx(
        'inline-flex h-7 items-center gap-1.5 rounded-[8px] px-2.5 text-[13px] font-semibold whitespace-nowrap [&_svg]:size-3.5',
        tone === 'bun' && 'bg-bun text-ink',
        tone === 'ink' && 'bg-ink text-cream',
        tone === 'ketchup' && 'bg-ketchup text-cream',
        tone === 'mustard' && 'bg-mustard text-ink',
        tone === 'pickle' && 'bg-pickle-soft text-pickle',
        className,
      )}
    >
      {children}
    </span>
  )
}

export function Stars({ count, className }: { count: number; className?: string }) {
  return (
    <span className={cx('inline-flex gap-0.5', className)} role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} filled={i < count} className="size-3.5" />
      ))}
    </span>
  )
}

export function Price({ value, className, was }: { value: number; className?: string; was?: number }) {
  return (
    <span className={cx('condensed tabular-nums', className)}>
      {value === 0 ? 'Free' : money(value)}
      {was != null && <s className="ml-2 text-[0.7em] font-normal text-muted">{money(was)}</s>}
    </span>
  )
}

export function EmptyState({ icon, title, body, action }: { icon: ReactNode; title: string; body: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[var(--radius-lg)] border-2 border-dashed border-bun-2 px-6 py-12 text-center">
      <span className="flex size-16 items-center justify-center rounded-[var(--radius-md)] bg-bun text-ketchup-ink [&_svg]:size-8">{icon}</span>
      <h3 className="display text-[30px]">{title}</h3>
      <p className="max-w-[360px] text-[15px] text-muted">{body}</p>
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}

export function Notice({ tone = 'info', children, className }: { tone?: 'info' | 'error' | 'success'; children: ReactNode; className?: string }) {
  return (
    <div
      role={tone === 'error' ? 'alert' : 'status'}
      className={cx(
        'rounded-[var(--radius-sm)] border-2 px-4 py-3 text-[15px]',
        tone === 'info' && 'border-bun-2 bg-bun',
        tone === 'error' && 'border-ketchup-ink bg-[#fde6e2] text-ketchup-ink font-semibold',
        tone === 'success' && 'border-pickle bg-pickle-soft text-pickle font-semibold',
        className,
      )}
    >
      {children}
    </div>
  )
}

/** A rounded photo card for the home page strip. */
export function PhotoCard({ image, alt, className, tilt = 0 }: { image: ImageKey; alt: string; className?: string; tilt?: number }) {
  return (
    <motion.figure whileHover={{ rotate: tilt * -1, y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} style={{ rotate: tilt }} className={cx('overflow-hidden rounded-[var(--radius-lg)] bg-bun', className)}>
      <Img src={image} alt={alt} className="size-full object-cover" />
    </motion.figure>
  )
}

export function LinkArrow({ to, children, tone = 'ink' }: { to: string; children: ReactNode; tone?: 'ink' | 'cream' }) {
  return (
    <Link to={to} className={cx('group inline-flex min-h-10 items-center gap-2 condensed text-[18px] underline-offset-4 hover:underline', tone === 'cream' ? 'text-cream' : 'text-ink')}>
      {children}
      <SquiggleArrow className="w-10 transition-transform duration-[var(--duration-base)] group-hover:translate-x-1" />
    </Link>
  )
}

export function StatTile({ label, value, note, tone = 'bun' }: { label: string; value: ReactNode; note?: ReactNode; tone?: 'bun' | 'ink' | 'ketchup' }) {
  return (
    <div className={cx('flex flex-col gap-1 rounded-[var(--radius-md)] p-5', tone === 'bun' && 'bg-bun', tone === 'ink' && 'on-ink bg-ink text-cream', tone === 'ketchup' && 'on-red bg-ketchup text-cream')}>
      <span className={cx('text-[14px] font-semibold', tone === 'bun' ? 'text-muted' : tone === 'ink' ? 'text-on-ink-muted' : 'text-on-red-muted')}>{label}</span>
      <span className="display text-[44px]">{value}</span>
      {note && <span className={cx('text-[13px]', tone === 'bun' ? 'text-muted' : tone === 'ink' ? 'text-on-ink-muted' : 'text-on-red-muted')}>{note}</span>}
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cx('skeleton rounded-[var(--radius-md)]', className)} aria-hidden />
}

export function Progress({ value, max, label, tone = 'ketchup' }: { value: number; max: number; label: string; tone?: 'ketchup' | 'mustard' | 'cream' }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div role="progressbar" aria-label={label} aria-valuemin={0} aria-valuemax={max} aria-valuenow={Math.round(value)} className={cx('round h-3 overflow-hidden rounded-full', tone === 'cream' ? 'bg-white/25' : 'bg-bun-2')}>
      <motion.div className={cx('round h-full rounded-full', tone === 'ketchup' && 'bg-ketchup', tone === 'mustard' && 'bg-mustard', tone === 'cream' && 'bg-cream')} initial={false} animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }} />
    </div>
  )
}
