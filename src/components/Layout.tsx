import { ArrowRight, MapPin, ShoppingBag, Trash2, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation, useNavigate } from 'react-router'

import { IMAGES, MENU, NAV_LINKS, REWARDS, SITE } from '../data'
import { cx, postJson, useFocusTrap } from '../lib/hooks'
import { useStore } from '../lib/store'
import { lineName, lineUnitPrice, money, totals, type CartLine } from '../shared/pricing'
import { Button, ButtonLink, IconButton } from './Button'
import { BurgerStack } from './BurgerStack'
import { EmptyState, Logo, Progress } from './Display'
import { BurgerDoodle } from './Doodles'
import { Stepper } from './Form'
import { Drawer } from './Overlay'

// ---------------------------------------------------------------------------
// Nav

export function Nav() {
  const { bagCount, setBagOpen, store } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  useEffect(() => setMenuOpen(false), [location.pathname])
  const [bump, setBump] = useState(0)
  const prev = useRef(bagCount)
  useEffect(() => {
    if (bagCount > prev.current) setBump((b) => b + 1)
    prev.current = bagCount
  }, [bagCount])

  return (
    <>
      <a href="#main" className="sr-only z-[80] rounded-[var(--radius-sm)] bg-ink px-4 py-3 text-cream focus:not-sr-only focus:fixed focus:top-3 focus:left-3">
        Skip to content
      </a>
      <header className="fixed inset-x-0 top-0 z-50 px-[clamp(12px,1.6vw,24px)] pt-[clamp(12px,1.6vw,24px)]">
        <nav aria-label="Main" className="on-ink mx-auto flex h-[clamp(64px,5.6vw,80px)] max-w-[1392px] items-center justify-between gap-3 rounded-[var(--radius-md)] bg-ink pr-3 pl-5 shadow-[0_14px_30px_-18px_rgb(0_0_0/0.6)] sm:pr-4 sm:pl-6">
          <Logo as="link" className="text-[clamp(30px,2.6vw,38px)]" />
          <div className="flex items-center gap-2">
            <Link to="/locations" className="hidden h-10 max-w-[200px] items-center gap-1.5 rounded-[var(--radius-sm)] px-3 text-[14px] font-semibold text-on-ink-muted hover:bg-white/10 hover:text-cream md:inline-flex">
              <MapPin className="size-4 shrink-0" aria-hidden />
              <span className="truncate">{store ? store.name : 'Choose a store'}</span>
            </Link>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label={`Bag, ${bagCount} ${bagCount === 1 ? 'item' : 'items'}`}
              className="relative inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] border-2 border-cream/80 px-3 text-cream transition-colors hover:bg-cream hover:text-ink"
            >
              <ShoppingBag className="size-[18px]" aria-hidden />
              <motion.span key={bump} initial={bump ? { scale: 1.5 } : false} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 500, damping: 14 }} className="condensed min-w-3 text-[18px] tabular-nums">
                {bagCount}
              </motion.span>
            </button>
            <Button variant="cream" size="sm" className="h-10 px-4 text-[19px]" aria-expanded={menuOpen} aria-haspopup="dialog" onClick={() => setMenuOpen(true)}>
              Menu
            </Button>
          </div>
        </nav>
      </header>
      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  )
}

function MenuOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  useFocusTrap(ref, open, onClose)
  const { member } = useStore()
  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label="Site menu"
          tabIndex={-1}
          initial={{ clipPath: 'inset(0 0 100% 0)' }}
          animate={{ clipPath: 'inset(0 0 0% 0)' }}
          exit={{ clipPath: 'inset(0 0 100% 0)' }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="on-red fixed inset-0 z-[60] overflow-y-auto bg-ketchup text-cream outline-none"
        >
          <div className="doodles absolute inset-0" aria-hidden />
          <div className="container-page relative flex min-h-full flex-col gap-10 pt-6 pb-10">
            <div className="flex items-center justify-between">
              <Logo className="text-[38px] [text-shadow:3px_3px_0_var(--color-ink)]" />
              <IconButton tone="ink" size="lg" aria-label="Close menu" onClick={onClose}>
                <X aria-hidden />
              </IconButton>
            </div>
            <div className="grid flex-1 items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
              <ul className="flex flex-col">
                {NAV_LINKS.map((l, i) => (
                  <motion.li key={l.to} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
                    <NavLink to={l.to} onClick={onClose} className="group flex items-baseline justify-between gap-4 border-b-2 border-cream/25 py-3">
                      <span className="display text-[clamp(44px,7vw,88px)] transition-transform duration-[var(--duration-base)] group-hover:translate-x-3">{l.label}</span>
                      <span className="hidden text-[15px] text-on-red-muted sm:block">{l.note}</span>
                    </NavLink>
                  </motion.li>
                ))}
              </ul>
              <div className="on-ink hidden flex-col gap-4 rounded-[var(--radius-lg)] bg-ink p-8 lg:flex">
                <BurgerStack build={{ bun: 'brioche', protein: 'beef', patties: 2, cheese: 'american', toppings: ['lettuce', 'tomato', 'pickles'], sauce: 'stackd' }} label="An illustrated double cheeseburger" className="mx-auto max-w-[260px]" />
                <p className="display text-[40px]">Stack it your way</p>
                <p className="text-[15px] text-on-ink-muted">Pick the bun, the patties, the cheese and up to six toppings.</p>
                <ButtonLink to="/build" onClick={onClose} variant="ketchup" iconRight={<ArrowRight aria-hidden />}>
                  Build a burger
                </ButtonLink>
              </div>
            </div>
            <p className="text-[15px] text-on-red-muted">{member ? `Signed in to rewards as ${member.name}. ${member.points.toLocaleString()} points to spend.` : 'Join Stackd rewards and get 250 points to start.'}</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

// ---------------------------------------------------------------------------
// Footer

export function Footer() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState<{ kind: 'idle' | 'loading' | 'done' | 'error'; message?: string }>({ kind: 'idle' })
  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setState({ kind: 'loading' })
    const res = await postJson('/api/newsletter', { email })
    if (res.ok) {
      setState({ kind: 'done', message: 'You are on the list. First drop lands Thursday.' })
      setEmail('')
    } else setState({ kind: 'error', message: res.fieldErrors?.email ?? res.error })
  }
  return (
    <footer className="on-ink relative mt-24 bg-ink text-cream">
      <div className="scallop-top absolute inset-x-0 bottom-full [--scallop:var(--color-ink)]" aria-hidden />
      <div className="container-page grid gap-12 pt-16 pb-10 lg:grid-cols-[1.2fr_2fr]">
        <div className="flex flex-col gap-5">
          <Logo className="text-[64px]" />
          <p className="max-w-[340px] text-[15px] text-on-ink-muted">Smashed thin, stacked tall and served hot from eight shops around Vijayawada since 2014.</p>
          <form onSubmit={submit} noValidate className="flex max-w-[420px] flex-col gap-2">
            <label htmlFor="footer-email" className="text-[14px] font-semibold">
              Get secret menu drops by email
            </label>
            <div className="flex gap-2">
              <input
                id="footer-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={state.kind === 'error' || undefined}
                aria-describedby="footer-email-msg"
                className="h-12 min-w-0 flex-1 rounded-[var(--radius-sm)] border-2 border-cream/30 bg-transparent px-4 text-cream placeholder:text-on-ink-muted/70 focus:border-cream focus:outline-none aria-invalid:border-ketchup"
              />
              <Button type="submit" loading={state.kind === 'loading'}>
                Sign up
              </Button>
            </div>
            <p id="footer-email-msg" aria-live="polite" className={cx('min-h-5 text-[13px]', state.kind === 'error' ? 'font-semibold text-[#ff9b8f]' : 'text-on-ink-muted')}>
              {state.message}
            </p>
          </form>
        </div>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          <FooterCol title="Eat" links={[{ to: '/menu', label: 'Menu' }, { to: '/build', label: 'Build a burger' }, { to: '/catering', label: 'Catering' }]} />
          <FooterCol title="Visit" links={[{ to: '/locations', label: 'Locations' }, { to: '/orders', label: 'Your orders' }, { to: '/rewards', label: 'Rewards' }]} />
          <div className="flex flex-col gap-3">
            <h2 className="condensed text-[18px] text-on-ink-muted">Say hi</h2>
            <a className="inline-flex min-h-10 items-center text-[15px] hover:underline" href={`tel:${SITE.phone.replace(/\D/g, '')}`}>
              {SITE.phone}
            </a>
            <a className="inline-flex min-h-10 items-center text-[15px] hover:underline" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              {SITE.socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noreferrer" className="inline-flex min-h-10 items-center text-[15px] hover:underline">
                  {s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="container-page flex flex-col gap-2 border-t border-white/15 py-6 text-[13px] text-on-ink-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {SITE.name} Burger Co. Demo site: no real orders or payments.
        </p>
        <Link to="/styleguide" className="inline-flex min-h-10 items-center hover:text-cream hover:underline">
          Style guide
        </Link>
      </div>
    </footer>
  )
}

function FooterCol({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div className="flex flex-col gap-1">
      <h2 className="condensed mb-2 text-[18px] text-on-ink-muted">{title}</h2>
      {links.map((l) => (
        <Link key={l.to} to={l.to} className="inline-flex min-h-10 items-center text-[16px] hover:underline">
          {l.label}
        </Link>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Bag

export function LineThumb({ line }: { line: CartLine }) {
  if (line.kind === 'build')
    return (
      <span className="flex size-16 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bun p-1.5">
        <BurgerStack build={line.build} label="" className="w-full" />
      </span>
    )
  const itemId = line.kind === 'item' ? line.itemId : REWARDS.find((r) => r.id === line.rewardId)?.itemId
  const item = MENU.find((m) => m.id === itemId)
  return (
    <span className="flex size-16 shrink-0 items-center justify-center rounded-[var(--radius-sm)] bg-bun">
      {item ? <img src={IMAGES[item.image]} alt="" className="size-[86%] object-contain" /> : <BurgerDoodle className="size-8" />}
    </span>
  )
}

export function lineDetail(line: CartLine) {
  if (line.kind === 'reward') return 'Rewards redemption'
  if (line.kind === 'build') return `${line.build.patties} ${line.build.protein === 'beef' ? 'patties' : line.build.protein === 'chicken' ? 'chicken' : 'plant patties'}, ${line.build.toppings.length} toppings`
  return [line.combo && 'Combo', line.extraPatty && 'Extra patty', line.note && `“${line.note}”`].filter(Boolean).join(', ')
}

export function BagDrawer() {
  const { bag, bagOpen, setBagOpen, setQty, removeLine, fulfilment, member } = useStore()
  const navigate = useNavigate()
  const t = totals(bag, fulfilment)
  return (
    <Drawer
      open={bagOpen}
      onClose={() => setBagOpen(false)}
      title="Your bag"
      footer={
        bag.length ? (
          <div className="flex flex-col gap-4">
            {fulfilment === 'delivery' && (
              <div className="flex flex-col gap-2">
                <p className="text-[14px] font-semibold">{t.freeDeliveryLeft > 0 ? `${money(t.freeDeliveryLeft)} more for free delivery` : 'Free delivery unlocked'}</p>
                <Progress value={t.subtotal} max={SITE.freeDeliveryOver} label="Progress to free delivery" />
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-[15px] text-muted">Subtotal</span>
              <span className="condensed text-[26px]">{money(t.subtotal)}</span>
            </div>
            <p className="text-[13px] text-muted">{member ? `You will earn ${t.points.toLocaleString()} points on this order.` : `Rewards members would earn ${t.points.toLocaleString()} points on this order.`}</p>
            <Button
              size="lg"
              className="w-full"
              iconRight={<ArrowRight aria-hidden />}
              onClick={() => {
                setBagOpen(false)
                navigate('/checkout')
              }}
            >
              Checkout
            </Button>
          </div>
        ) : undefined
      }
    >
      {bag.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<ShoppingBag aria-hidden />}
            title="Your bag is empty"
            body="Nothing on the grill yet. Grab a Classic Stack or build your own."
            action={
              <ButtonLink to="/menu" onClick={() => setBagOpen(false)}>
                Browse the menu
              </ButtonLink>
            }
          />
        </div>
      ) : (
        <ul className="flex flex-col divide-y-2 divide-bun-2 px-6">
          {bag.map((line) => {
            const unit = lineUnitPrice(line)
            const detail = lineDetail(line)
            return (
              <li key={line.key} className="flex gap-4 py-4">
                <LineThumb line={line} />
                <div className="flex min-w-0 flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="condensed truncate text-[20px]">{lineName(line)}</p>
                      {detail && <p className="truncate text-[13px] text-muted">{detail}</p>}
                    </div>
                    <span className="condensed shrink-0 text-[19px]">{unit === 0 ? 'Free' : money(unit * line.qty)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    {line.kind === 'reward' ? <span className="text-[13px] font-semibold text-pickle">Reward applied</span> : <Stepper size="sm" value={line.qty} onChange={(q) => setQty(line.key, q)} label={`quantity of ${lineName(line)}`} />}
                    <IconButton tone="ghost" size="sm" aria-label={`Remove ${lineName(line)}`} onClick={() => removeLine(line.key)}>
                      <Trash2 aria-hidden />
                    </IconButton>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </Drawer>
  )
}
