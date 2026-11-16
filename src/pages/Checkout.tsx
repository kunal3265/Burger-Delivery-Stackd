import { Lock, ShoppingBag, Ticket } from 'lucide-react'
import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button, ButtonLink } from '../components/Button'
import { EmptyState, Notice, PageHero } from '../components/Display'
import { ChoiceGroup, SelectField, TextField } from '../components/Form'
import { LineThumb, lineDetail } from '../components/Layout'
import { useToast } from '../components/Overlay'
import { REWARDS, SITE, STORES } from '../data'
import { postJson, useDocumentTitle } from '../lib/hooks'
import { useStore } from '../lib/store'
import { lineName, lineUnitPrice, money, totals, type Totals } from '../shared/pricing'
import { validateOrder, type FieldErrors } from '../shared/validation'

const TIPS = [0, 20, 30, 50]

function timeSlots(now = new Date()) {
  const slots: { value: string; label: string }[] = [{ value: 'asap', label: 'As soon as possible' }]
  const d = new Date(now)
  d.setMinutes(Math.ceil((d.getMinutes() + 20) / 15) * 15, 0, 0)
  for (let i = 0; i < 8; i++) {
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    slots.push({ value: `${hh}:${mm}`, label: d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }) })
    d.setMinutes(d.getMinutes() + 15)
  }
  return slots
}

export function Checkout() {
  useDocumentTitle('Checkout')
  const { bag, store, setStoreId, fulfilment, setFulfilment, member, addReward, recordOrder, clearBag, removeLine } = useStore()
  const navigate = useNavigate()
  const toast = useToast()
  const slots = useMemo(() => timeSlots(), [])
  const [form, setForm] = useState({ name: member?.name ?? '', phone: '', email: member?.email ?? '', street: '', zip: '', time: 'asap', payment: 'card' as 'card' | 'store' })
  const [tip, setTip] = useState(20)
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const effectiveTip = fulfilment === 'delivery' ? tip : 0
  const t = totals(bag, fulfilment, effectiveTip)
  const wallet = member?.wallet.filter((w) => !w.used) ?? []
  const hasReward = bag.some((l) => l.kind === 'reward')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const payload = { ...form, fulfilment, storeId: store?.id ?? '', tip: effectiveTip, lines: bag }
    const local = validateOrder(payload)
    setErrors(local)
    if (Object.keys(local).length) {
      setStatus('error')
      setMessage(local.lines ?? 'Check the highlighted fields.')
      return
    }
    setStatus('loading')
    const res = await postJson<{ reference: string; totals: Totals; readyInMinutes: number; placedAt: string }>('/api/orders', payload)
    if (!res.ok) {
      setStatus('error')
      setErrors(res.fieldErrors ?? {})
      setMessage(res.fieldErrors?.lines ?? res.error)
      return
    }
    const order = recordOrder({ reference: res.data.reference, placedAt: res.data.placedAt, readyInMinutes: res.data.readyInMinutes, fulfilment, storeId: store!.id, name: form.name.trim(), lines: bag, totals: res.data.totals })
    clearBag()
    if (order.pointsEarned) toast(`${order.pointsEarned.toLocaleString()} points added to your rewards`)
    navigate(`/orders/${order.reference}`)
  }

  if (!bag.length)
    return (
      <>
        <PageHero title="Checkout" />
        <div className="container-page mt-20 max-w-[640px]">
          <EmptyState icon={<ShoppingBag aria-hidden />} title="Your bag is empty" body="Add something from the menu or build your own burger, then come back here." action={<ButtonLink to="/menu">Browse the menu</ButtonLink>} />
        </div>
      </>
    )

  return (
    <>
      <PageHero kicker="Almost on the grill" title="Checkout" />
      <form onSubmit={submit} noValidate className="container-page mt-20 grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-start">
        <div className="flex flex-col gap-6">
          {status === 'error' && message && <Notice tone="error">{message}</Notice>}

          <section className="flex flex-col gap-5 rounded-[var(--radius-lg)] border-2 border-bun-2 p-5 sm:p-6" aria-labelledby="how">
            <h2 id="how" className="display text-[34px]">
              How and where
            </h2>
            <ChoiceGroup
              label="Pickup or delivery"
              hideLabel
              tone="white"
              value={fulfilment}
              onChange={setFulfilment}
              error={errors.fulfilment}
              options={[
                { value: 'pickup', label: 'Pickup', note: 'Ready in about 15 minutes' },
                { value: 'delivery', label: 'Delivery', note: `${money(SITE.deliveryFee)}, free over ${money(SITE.freeDeliveryOver)}` },
              ]}
            />
            <SelectField label="Store" value={store?.id ?? ''} onChange={(e) => setStoreId(e.target.value || null)} error={errors.storeId} hint={store ? store.street : undefined}>
              <option value="">Choose a store</option>
              {STORES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}, {s.city}
                  {s.features.includes('delivery') ? '' : ' (pickup only)'}
                </option>
              ))}
            </SelectField>
            {fulfilment === 'delivery' && (
              <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
                <TextField label="Street address" autoComplete="street-address" value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} error={errors.street} />
                <TextField label="PIN code" inputMode="numeric" autoComplete="postal-code" maxLength={6} value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} error={errors.zip} />
              </div>
            )}
            <SelectField label={fulfilment === 'delivery' ? 'Deliver at' : 'Pick up at'} value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} error={errors.time}>
              {slots.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </SelectField>
          </section>

          <section className="flex flex-col gap-4 rounded-[var(--radius-lg)] border-2 border-bun-2 p-5 sm:p-6" aria-labelledby="you">
            <h2 id="you" className="display text-[34px]">
              You
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <TextField label="Name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
              <TextField label="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} hint="We text when it is ready" />
              <TextField wrapClass="sm:col-span-2" label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
            </div>
          </section>

          <section className="flex flex-col gap-4 rounded-[var(--radius-lg)] border-2 border-bun-2 p-5 sm:p-6" aria-labelledby="pay">
            <h2 id="pay" className="display text-[34px]">
              Pay
            </h2>
            {fulfilment === 'delivery' && (
              <ChoiceGroup label="Tip your rider" columns={4} tone="white" value={String(tip)} onChange={(v) => setTip(Number(v))} error={errors.tip} options={TIPS.map((n) => ({ value: String(n), label: n ? money(n) : 'No tip' }))} />
            )}
            <ChoiceGroup
              label="Payment"
              tone="white"
              value={form.payment}
              onChange={(v) => setForm({ ...form, payment: v })}
              error={errors.payment}
              options={[
                { value: 'card', label: 'Demo card', note: 'Nothing is charged' },
                { value: 'store', label: fulfilment === 'delivery' ? 'Pay the rider' : 'Pay in store', note: 'Card or cash' },
              ]}
            />
            <p className="flex items-center gap-2 text-[13px] text-muted">
              <Lock className="size-4" aria-hidden />
              This is a demo checkout. No card details are collected or sent.
            </p>
          </section>
        </div>

        <aside className="flex flex-col gap-5 rounded-[var(--radius-xl)] border-2 border-ink bg-bun p-5 sm:p-6 lg:sticky lg:top-[120px]" aria-labelledby="summary">
          <h2 id="summary" className="display text-[34px]">
            Your order
          </h2>
          <ul className="flex flex-col divide-y-2 divide-bun-2">
            {bag.map((l) => (
              <li key={l.key} className="flex items-center gap-3 py-3">
                <LineThumb line={l} />
                <div className="min-w-0 flex-1">
                  <p className="condensed truncate text-[19px]">
                    {l.qty > 1 && `${l.qty} × `}
                    {lineName(l)}
                  </p>
                  <p className="truncate text-[13px] text-muted">{lineDetail(l)}</p>
                </div>
                <span className="condensed text-[18px]">{l.kind === 'reward' ? 'Free' : money(lineUnitPrice(l) * l.qty)}</span>
                {l.kind === 'reward' && (
                  <button type="button" onClick={() => removeLine(l.key)} className="min-h-10 px-1 text-[13px] font-semibold underline">
                    Remove
                  </button>
                )}
              </li>
            ))}
          </ul>
          {member && wallet.length > 0 && !hasReward && (
            <div className="flex flex-col gap-2 rounded-[var(--radius-sm)] bg-cream p-3">
              <p className="text-[14px] font-semibold">Use a reward</p>
              <div className="flex flex-wrap gap-2">
                {wallet.map((w) => (
                  <Button key={w.code} variant="outline" size="sm" icon={<Ticket aria-hidden />} onClick={() => addReward(w.code)}>
                    {REWARDS.find((r) => r.id === w.rewardId)?.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
          <dl className="flex flex-col gap-2 border-t-2 border-ink/15 pt-4 text-[15px]">
            <Row label="Subtotal" value={money(t.subtotal)} />
            {fulfilment === 'delivery' && <Row label="Delivery" value={t.delivery ? money(t.delivery) : 'Free'} />}
            {t.service > 0 && <Row label="Service fee" value={money(t.service)} />}
            <Row label="GST" value={money(t.tax)} />
            {fulfilment === 'delivery' && <Row label="Rider tip" value={money(t.tip)} />}
            <div className="flex items-baseline justify-between border-t-2 border-ink/15 pt-3">
              <dt className="font-semibold">Total</dt>
              <dd className="condensed text-[38px] tabular-nums">{money(t.total)}</dd>
            </div>
          </dl>
          <p className="text-[13px] text-muted">
            {member ? (
              `You will earn ${t.points.toLocaleString()} points.`
            ) : (
              <>
                <Link to="/rewards" className="font-semibold text-ink underline">
                  Join rewards
                </Link>{' '}
                to earn {t.points.toLocaleString()} points on this order.
              </>
            )}
          </p>
          <Button type="submit" size="lg" loading={status === 'loading'} className="w-full">
            Place order {money(t.total)}
          </Button>
        </aside>
      </form>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="tabular-nums">{value}</dd>
    </div>
  )
}
