import { Bike, ChefHat, CircleCheck, Flame, Layers, PackageCheck, Receipt, RotateCcw, SearchX } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import { Button, ButtonLink } from '../components/Button'
import { Badge, EmptyState, PageHero, Progress } from '../components/Display'
import { LineThumb, lineDetail } from '../components/Layout'
import { useToast } from '../components/Overlay'
import { STORES } from '../data'
import { cx, useDocumentTitle } from '../lib/hooks'
import { useStore, type Order } from '../lib/store'
import { lineName, money } from '../shared/pricing'

// The demo kitchen runs fast: the whole journey takes two minutes.
const STAGES = (o: Order) => [
  { at: 0, label: 'Order placed', icon: Receipt },
  { at: 15, label: 'On the grill', icon: Flame },
  { at: 45, label: 'Stacking', icon: Layers },
  { at: 75, label: o.fulfilment === 'delivery' ? 'Out for delivery' : 'Ready for pickup', icon: o.fulfilment === 'delivery' ? Bike : ChefHat },
  { at: 120, label: o.fulfilment === 'delivery' ? 'Delivered' : 'Picked up', icon: PackageCheck },
]

function useElapsed(since: string) {
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    const t = window.setInterval(() => setNow(Date.now()), 1000)
    return () => window.clearInterval(t)
  }, [])
  return Math.max(0, (now - new Date(since).getTime()) / 1000)
}

function useReorder() {
  const { addItem, addBuild, setBagOpen } = useStore()
  const toast = useToast()
  return (o: Order) => {
    for (const l of o.lines) {
      if (l.kind === 'item') addItem(l.itemId, l.qty, { combo: l.combo, extraPatty: l.extraPatty, note: l.note })
      if (l.kind === 'build') addBuild(l.build, l.name, l.qty)
    }
    toast('Order added to your bag')
    setBagOpen(true)
  }
}

export function OrderTracking() {
  const { reference } = useParams()
  const { orders } = useStore()
  const order = orders.find((o) => o.reference === reference)
  useDocumentTitle(order ? `Order ${order.reference}` : 'Order not found')
  if (!order)
    return (
      <>
        <PageHero title="Order not found" />
        <div className="container-page mt-20 max-w-[640px]">
          <EmptyState icon={<SearchX aria-hidden />} title="We cannot find that order" body="Orders are kept in this browser. Check the link, or look through your past orders." action={<ButtonLink to="/orders">Your orders</ButtonLink>} />
        </div>
      </>
    )
  return <Tracking order={order} />
}

function Tracking({ order }: { order: Order }) {
  const elapsed = useElapsed(order.placedAt)
  const stages = STAGES(order)
  const current = stages.reduce((acc, s, i) => (elapsed >= s.at ? i : acc), 0)
  const store = STORES.find((s) => s.id === order.storeId)
  const reorder = useReorder()
  const done = current === stages.length - 1
  return (
    <>
      <PageHero kicker={`Order ${order.reference}`} title={stages[current].label} body={done ? `Enjoy it, ${order.name.split(' ')[0]}. Rate the stack next time you are in.` : `${order.fulfilment === 'delivery' ? 'Delivery' : 'Pickup'} from ${store?.name}. This page updates by itself.`} />
      <div className="container-page mt-20 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:items-start">
        <section className="flex flex-col gap-6 rounded-[var(--radius-xl)] border-2 border-ink bg-cream p-6 sm:p-8" aria-labelledby="progress">
          <h2 id="progress" className="sr-only">
            Order progress
          </h2>
          <Progress value={Math.min(elapsed, stages[stages.length - 1].at)} max={stages[stages.length - 1].at} label="Order progress" />
          <ol className="flex flex-col gap-1" aria-live="polite">
            {stages.map((s, i) => {
              const Icon = s.icon
              const state = i < current ? 'done' : i === current ? 'now' : 'next'
              return (
                <li key={s.label} className="flex items-center gap-4 py-2">
                  <motion.span
                    animate={state === 'now' && !done ? { scale: [1, 1.08, 1] } : { scale: 1 }}
                    transition={{ duration: 1.4, repeat: state === 'now' && !done ? Infinity : 0 }}
                    className={cx('flex size-12 shrink-0 items-center justify-center rounded-[var(--radius-sm)] border-2 [&_svg]:size-5', state === 'done' && 'border-ink bg-ink text-cream', state === 'now' && 'border-ketchup bg-ketchup text-cream', state === 'next' && 'border-bun-2 bg-bun text-muted')}
                  >
                    {state === 'done' ? <CircleCheck aria-hidden /> : <Icon aria-hidden />}
                  </motion.span>
                  <span className={cx('condensed text-[24px]', state === 'next' && 'text-muted')}>{s.label}</span>
                  {state === 'now' && !done && <Badge tone="mustard">Now</Badge>}
                </li>
              )
            })}
          </ol>
          {store && (
            <p className="text-[15px] text-muted">
              {store.name}, {store.street}. Questions? Call{' '}
              <a className="font-semibold text-ink underline" href={`tel:${store.phone.replace(/\D/g, '')}`}>
                {store.phone}
              </a>
              .
            </p>
          )}
        </section>
        <aside className="flex flex-col gap-4 rounded-[var(--radius-xl)] bg-bun p-6" aria-labelledby="receipt">
          <h2 id="receipt" className="display text-[34px]">
            Receipt
          </h2>
          <ul className="flex flex-col divide-y-2 divide-bun-2">
            {order.lines.map((l) => (
              <li key={l.key} className="flex items-center gap-3 py-2.5">
                <LineThumb line={l} />
                <div className="min-w-0 flex-1">
                  <p className="condensed truncate text-[18px]">
                    {l.qty > 1 && `${l.qty} × `}
                    {lineName(l)}
                  </p>
                  <p className="truncate text-[13px] text-muted">{lineDetail(l)}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex items-baseline justify-between border-t-2 border-ink/15 pt-3">
            <span className="font-semibold">Total paid</span>
            <span className="condensed text-[32px]">{money(order.totals.total)}</span>
          </div>
          {order.pointsEarned > 0 && <Badge tone="pickle">+{order.pointsEarned.toLocaleString()} rewards points</Badge>}
          <Button variant="ink" icon={<RotateCcw aria-hidden />} onClick={() => reorder(order)}>
            Order this again
          </Button>
        </aside>
      </div>
    </>
  )
}

export function Orders() {
  useDocumentTitle('Your orders')
  const { orders } = useStore()
  const reorder = useReorder()
  return (
    <>
      <PageHero kicker="Kept in this browser" title="Your orders" />
      <div className="container-page mt-20 max-w-[920px]">
        {orders.length === 0 ? (
          <EmptyState icon={<Receipt aria-hidden />} title="No orders yet" body="Your first stack is a few taps away. Orders you place show up here for tracking and one-tap reorder." action={<ButtonLink to="/menu">Start an order</ButtonLink>} />
        ) : (
          <ul className="flex flex-col gap-4">
            {orders.map((o) => {
              const store = STORES.find((s) => s.id === o.storeId)
              const items = o.lines.reduce((s, l) => s + l.qty, 0)
              return (
                <li key={o.reference} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border-2 border-bun-2 bg-cream p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col gap-1">
                    <Link to={`/orders/${o.reference}`} className="condensed text-[24px] hover:underline">
                      {o.reference}
                    </Link>
                    <p className="text-[14px] text-muted">
                      {new Date(o.placedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}, {o.fulfilment} from {store?.name}, {items} {items === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="condensed text-[24px]">{money(o.totals.total)}</span>
                    <ButtonLink to={`/orders/${o.reference}`} variant="outline" size="sm">
                      Track
                    </ButtonLink>
                    <Button variant="ink" size="sm" icon={<RotateCcw aria-hidden />} onClick={() => reorder(o)}>
                      Reorder
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
