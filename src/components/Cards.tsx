import { Check, Clock, MapPin, Phone, Plus, Shuffle, Users } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState, type ReactNode } from 'react'

import { FEATURE_LABELS, type CateringPackage, type MenuItem, type Reward, type Store } from '../data'
import { cx, useMediaQuery } from '../lib/hooks'
import { hoursLabel, isOpen } from '../lib/store'
import { money } from '../shared/pricing'
import { Button, IconButton } from './Button'
import { Badge, Img, Price, Stars, TagBadge } from './Display'

// ---------------------------------------------------------------------------
// Menu

export function MenuCard({ item, onOpen, onQuickAdd, force }: { item: MenuItem; onOpen: () => void; onQuickAdd: () => void; force?: string }) {
  return (
    <article data-force={force} className="group relative flex flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 border-ink bg-bun transition-[transform,box-shadow] duration-[var(--duration-base)] ease-[var(--ease-out)] hov:-translate-y-1 hov:shadow-[var(--shadow-hard)] group-data-[force~=hover]:-translate-y-1">
      <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden bg-cream">
        <div className="doodles absolute inset-0 opacity-0" aria-hidden />
        <Img src={item.image} alt="" className="h-[86%] w-[86%] object-contain drop-shadow-[0_18px_18px_rgb(0_0_0/0.25)] transition-transform duration-[var(--duration-slow)] ease-[var(--ease-spring)] group-hover:scale-[1.06] group-hover:-rotate-3 group-data-[force~=hover]:scale-[1.06]" />
        {item.tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            {item.tags.map((t) => (
              <TagBadge key={t} tag={t} />
            ))}
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-2 border-t-2 border-ink p-5">
        <h3 className="display text-[30px]">
          <button type="button" onClick={onOpen} className="stretched text-left focus-visible:outline-none" aria-haspopup="dialog">
            {item.name}
          </button>
        </h3>
        <p className="line-clamp-2 text-[15px] leading-snug text-muted">{item.description}</p>
        <div className="mt-auto flex items-end justify-between gap-3 pt-3">
          <div className="flex flex-col">
            <Price value={item.price} className="text-[26px]" />
            <span className="text-[13px] text-muted">{item.kcal} kcal</span>
          </div>
          <IconButton tone="ketchup" size="lg" aria-label={`Add ${item.name} to bag`} onClick={onQuickAdd} className="relative z-[2]">
            <Plus strokeWidth={3} aria-hidden />
          </IconButton>
        </div>
      </div>
      {/* Focus ring for the stretched title button. */}
      <span className="pointer-events-none absolute inset-0 rounded-[inherit] outline-3 outline-offset-3 outline-ink opacity-0 group-has-[h3_button:focus-visible]:opacity-100" aria-hidden />
    </article>
  )
}

// ---------------------------------------------------------------------------
// Reviews

export function ReviewCard({ name, where, stars, text, tone = 'ink', className }: { name: string; where: string; stars: number; text: string; tone?: 'ink' | 'ketchup'; className?: string }) {
  return (
    <figure className={cx('flex flex-col gap-3 rounded-[var(--radius-md)] p-6 shadow-[var(--shadow-card)]', tone === 'ink' ? 'on-ink bg-ink text-cream' : 'on-red bg-ketchup text-cream', className)}>
      <Stars count={stars} className={tone === 'ink' ? 'text-ketchup' : 'text-cream'} />
      <blockquote className="condensed text-[20px] leading-[1.15]">{text}</blockquote>
      <figcaption className={cx('mt-auto text-[13px] font-semibold', tone === 'ink' ? 'text-on-ink-muted' : 'text-on-red-muted')}>
        {name}, {where}
      </figcaption>
    </figure>
  )
}

const STACK_POSE = [
  { x: 0, y: 0, r: 4 },
  { x: -150, y: 40, r: -10 },
  { x: 150, y: 46, r: 9 },
  { x: -60, y: 90, r: -4 },
  { x: 80, y: 110, r: 6 },
]

/** A messy pile of review cards. Shuffle sends the top card to the back. */
export function ReviewStack({ reviews }: { reviews: { name: string; where: string; stars: number; text: string }[] }) {
  const [order, setOrder] = useState(() => reviews.map((_, i) => i))
  const top = reviews[order[0]]
  const spread = useMediaQuery('(max-width: 640px)') ? 0.3 : 1
  const shuffle = () => setOrder((o) => [...o.slice(1), o[0]])
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="relative h-[430px] w-full max-w-[640px] sm:h-[400px]">
        {order
          .slice()
          .reverse()
          .map((idx) => {
            const depth = order.indexOf(idx)
            const pose = STACK_POSE[depth % STACK_POSE.length]
            const r = reviews[idx]
            return (
              <motion.div
                key={idx}
                className="absolute top-0 left-1/2 w-[min(300px,72vw)]"
                initial={false}
                animate={{ x: `calc(-50% + ${pose.x * spread}px)`, y: pose.y, rotate: pose.r, scale: depth === 0 ? 1 : 0.94 }}
                transition={{ type: 'spring', stiffness: 260, damping: 24 }}
                style={{ zIndex: reviews.length - depth }}
                aria-hidden={depth !== 0}
              >
                <ReviewCard {...r} tone={idx % 2 ? 'ink' : 'ketchup'} className="min-h-[240px]" />
              </motion.div>
            )
          })}
      </div>
      <p className="sr-only" aria-live="polite">
        Showing review from {top.name}
      </p>
      <Button variant="ink" size="sm" icon={<Shuffle aria-hidden />} onClick={shuffle}>
        Next review
      </Button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Stores

export function StoreCard({ store, selected, active, onSelect, onFocusMap, distance, force }: { store: Store; selected?: boolean; active?: boolean; onSelect: () => void; onFocusMap?: () => void; distance?: string; force?: string }) {
  const open = isOpen(store)
  return (
    <article
      data-force={force}
      className={cx('flex flex-col gap-3 rounded-[var(--radius-md)] border-2 bg-cream p-5 transition-[border-color,box-shadow] duration-[var(--duration-fast)]', active ? 'border-ink shadow-[var(--shadow-hard)]' : 'border-bun-2 hov:border-ink/50')}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <h3 className="display text-[28px]">
            {onFocusMap ? (
              <button type="button" className="min-h-10 text-left hover:underline" onClick={onFocusMap}>
                {store.name}
              </button>
            ) : (
              store.name
            )}
          </h3>
          <p className="flex items-center gap-1.5 text-[14px] text-muted">
            <MapPin className="size-4 shrink-0" aria-hidden />
            {store.street}, {store.city}, {store.state} {store.zip}
          </p>
        </div>
        {distance && <span className="condensed shrink-0 text-[18px] text-muted">{distance}</span>}
      </div>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={open ? 'pickle' : 'bun'}>
          <Clock aria-hidden />
          {open ? 'Open now' : 'Closed'}, {hoursLabel(store)}
        </Badge>
        {store.features.map((f) => (
          <Badge key={f}>{FEATURE_LABELS[f]}</Badge>
        ))}
      </div>
      <p className="text-[14px] text-muted">{store.note}</p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <Button variant={selected ? 'ink' : 'ketchup'} size="sm" icon={selected ? <Check aria-hidden /> : undefined} onClick={onSelect} aria-pressed={selected}>
          {selected ? 'Your store' : 'Order from here'}
        </Button>
        <a href={`tel:${store.phone.replace(/\D/g, '')}`} className="inline-flex h-10 items-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-[15px] font-semibold hover:bg-bun">
          <Phone className="size-4" aria-hidden />
          {store.phone}
        </a>
      </div>
    </article>
  )
}

// ---------------------------------------------------------------------------
// Rewards and catering

export function RewardCard({ reward, points, member, onRedeem, image }: { reward: Reward; points: number; member: boolean; onRedeem: () => void; image: ReactNode }) {
  const short = Math.max(0, reward.cost - points)
  return (
    <article className="flex flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 border-ink bg-cream">
      <div className="flex aspect-[4/3] items-center justify-center bg-bun p-4">{image}</div>
      <div className="flex flex-1 flex-col gap-2 border-t-2 border-ink p-5">
        <p className="condensed text-[18px] text-ketchup-ink">{reward.cost.toLocaleString()} points</p>
        <h3 className="display text-[28px]">{reward.name}</h3>
        <p className="text-[14px] text-muted">{reward.note}</p>
        <div className="mt-auto pt-3">
          <Button variant={member && !short ? 'ketchup' : 'outline'} size="sm" className="w-full" disabled={!member || short > 0} onClick={onRedeem}>
            {!member ? 'Join to redeem' : short > 0 ? `${short.toLocaleString()} more points` : 'Redeem'}
          </Button>
        </div>
      </div>
    </article>
  )
}

export function PackageCard({ pkg, selected, onSelect }: { pkg: CateringPackage; selected: boolean; onSelect: () => void }) {
  return (
    <article className={cx('flex flex-col overflow-hidden rounded-[var(--radius-lg)] border-2 bg-cream transition-shadow', selected ? 'border-ink shadow-[var(--shadow-hard)]' : 'border-ink/70')}>
      <div className="relative aspect-[3/2] overflow-hidden bg-bun">
        <Img src={pkg.image} alt="" className={cx('size-full', pkg.image === 'catering' ? 'object-cover' : 'object-contain p-6')} />
        <Badge tone="ink" className="absolute top-3 left-3">
          <Users aria-hidden />
          {pkg.serves}
        </Badge>
      </div>
      <div className="flex flex-1 flex-col gap-3 border-t-2 border-ink p-5">
        <h3 className="display text-[30px]">{pkg.name}</h3>
        <p className="condensed text-[22px] text-ketchup-ink">{money(pkg.perGuest)} per guest</p>
        <ul className="flex flex-col gap-1.5 text-[15px]">
          {pkg.includes.map((i) => (
            <li key={i} className="flex gap-2">
              <Check className="mt-0.5 size-4 shrink-0 text-pickle" strokeWidth={3} aria-hidden />
              {i}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-2">
          <Button variant={selected ? 'ink' : 'outline'} size="sm" className="w-full" onClick={onSelect} aria-pressed={selected} icon={selected ? <Check aria-hidden /> : undefined}>
            {selected ? 'Selected' : 'Choose package'}
          </Button>
        </div>
      </div>
    </article>
  )
}

/** A collapsible question, used for FAQs. */
export function Disclosure({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b-2 border-bun-2">
      <h3>
        <button type="button" aria-expanded={open} onClick={() => setOpen(!open)} className="flex min-h-16 w-full items-center justify-between gap-4 py-4 text-left">
          <span className="condensed text-[22px]">{q}</span>
          <Plus className={cx('size-6 shrink-0 transition-transform duration-[var(--duration-base)]', open && 'rotate-45')} aria-hidden />
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <p className="max-w-[640px] pb-5 text-[16px] leading-relaxed text-muted">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
