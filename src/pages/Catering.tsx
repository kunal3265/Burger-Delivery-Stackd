import { CalendarCheck, PartyPopper } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '../components/Button'
import { Disclosure, PackageCard } from '../components/Cards'
import { Img, Notice, PageHero, SectionHeading } from '../components/Display'
import { ChoiceGroup, SelectField, TextArea, TextField } from '../components/Form'
import { CATERING_FAQ, CATERING_PACKAGES, STORES } from '../data'
import { postJson, useDocumentTitle } from '../lib/hooks'
import { useStore } from '../lib/store'
import { cateringEstimate, money, type Fulfilment } from '../shared/pricing'
import { earliestCateringDate, validateCatering, type FieldErrors } from '../shared/validation'

const CATERING_STORES = STORES.filter((s) => s.features.includes('catering'))

export function CateringPage() {
  useDocumentTitle('Catering')
  const { store } = useStore()
  const [packageId, setPackageId] = useState(CATERING_PACKAGES[0].id)
  const [guests, setGuests] = useState(25)
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    date: '',
    storeId: store?.features.includes('catering') ? store.id : '',
    fulfilment: 'delivery' as Fulfilment,
    notes: '',
  })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [done, setDone] = useState<{ reference: string; total: number } | null>(null)

  const pkg = CATERING_PACKAGES.find((p) => p.id === packageId)!
  const clamped = Math.min(pkg.maxGuests, Math.max(pkg.minGuests, guests))
  const estimate = cateringEstimate(pkg.perGuest, clamped)

  const choose = (id: string) => {
    setPackageId(id)
    const p = CATERING_PACKAGES.find((x) => x.id === id)!
    setGuests((g) => Math.min(p.maxGuests, Math.max(p.minGuests, g)))
    document.getElementById('quote')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const payload = { ...form, guests: clamped, packageId }
    const local = validateCatering(payload)
    setErrors(local)
    if (Object.keys(local).length) {
      setStatus('error')
      setMessage('Check the highlighted fields.')
      return
    }
    setStatus('loading')
    const res = await postJson<{ reference: string; estimate: { total: number } }>('/api/catering', payload)
    if (!res.ok) {
      setStatus('error')
      setErrors(res.fieldErrors ?? {})
      setMessage(res.error)
      return
    }
    setStatus('idle')
    setDone({ reference: res.data.reference, total: res.data.estimate.total })
  }

  return (
    <>
      <PageHero kicker="Catering for 10 to 500" title="Feed the whole crew" body="Slider parties, a hot stack bar with a crew member, or labelled box lunches for the office. Tell us the date and we will do the rest." />
      <div className="container-page mt-20">
        <div className="overflow-hidden rounded-[var(--radius-xl)] border-2 border-ink">
          <Img src="catering" alt="A party table of sliders, fries, tenders and shakes with hands reaching in" className="aspect-[21/9] w-full object-cover max-sm:aspect-[4/3]" />
        </div>

        <section className="mt-20" aria-labelledby="packages">
          <SectionHeading align="left" kicker="Pick a package" title={<span id="packages">Three ways to cater</span>} />
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {CATERING_PACKAGES.map((p) => (
              <PackageCard key={p.id} pkg={p} selected={p.id === packageId} onSelect={() => choose(p.id)} />
            ))}
          </div>
        </section>

        <section id="quote" className="mt-20 grid scroll-mt-28 gap-8 lg:grid-cols-[1fr_1.3fr] lg:items-start">
          <div className="on-ink flex flex-col gap-5 rounded-[var(--radius-xl)] bg-ink p-6 text-cream sm:p-8 lg:sticky lg:top-[120px]">
            <h2 className="display text-[48px]">Your estimate</h2>
            <div className="flex flex-col gap-3">
              <label htmlFor="guests" className="flex items-baseline justify-between text-[15px] font-semibold">
                Guests
                <span className="condensed text-[36px] tabular-nums">{clamped}</span>
              </label>
              <input id="guests" type="range" min={pkg.minGuests} max={pkg.maxGuests} step={1} value={clamped} onChange={(e) => setGuests(Number(e.target.value))} className="h-10 w-full accent-[var(--color-ketchup)]" />
              <div className="flex justify-between text-[13px] text-on-ink-muted">
                <span>{pkg.minGuests}</span>
                <span>{pkg.maxGuests}</span>
              </div>
            </div>
            <dl className="flex flex-col gap-2 border-t border-white/15 pt-4 text-[15px]">
              <div className="flex justify-between">
                <dt className="text-on-ink-muted">{pkg.name}</dt>
                <dd>
                  {clamped} × {money(pkg.perGuest)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-on-ink-muted">Delivery and set-up</dt>
                <dd>{estimate.delivery ? money(estimate.delivery) : 'Free'}</dd>
              </div>
              <div className="flex items-baseline justify-between border-t border-white/15 pt-3">
                <dt className="font-semibold">Estimated total</dt>
                <dd className="condensed text-[40px] tabular-nums" aria-live="polite">
                  {money(estimate.total)}
                </dd>
              </div>
            </dl>
            <p className="text-[13px] text-on-ink-muted">No deposit. We confirm by phone and you pay on the day.</p>
          </div>

          {done ? (
            <div role="status" className="flex flex-col items-start gap-4 rounded-[var(--radius-xl)] border-2 border-ink bg-bun p-8 shadow-[var(--shadow-hard)]">
              <PartyPopper className="size-12 text-ketchup-ink" aria-hidden />
              <h2 className="display text-[48px]">Request received</h2>
              <p className="text-[16px]">
                Reference <strong className="font-mono">{done.reference}</strong>. Our catering crew will call {form.phone} within one business day to confirm {pkg.name.toLowerCase()} for {clamped} guests, estimated at {money(done.total)}.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setDone(null)
                  setForm({ ...form, date: '', notes: '' })
                }}
              >
                Plan another event
              </Button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="flex flex-col gap-5 rounded-[var(--radius-xl)] border-2 border-ink bg-cream p-6 sm:p-8">
              <div>
                <h2 className="display text-[48px]">Request a quote</h2>
                <p className="mt-1 text-[15px] text-muted">
                  {pkg.name}, {clamped} guests. Change either on the left.
                </p>
              </div>
              {status === 'error' && message && <Notice tone="error">{message}</Notice>}
              <div className="grid gap-4 sm:grid-cols-2">
                <TextField label="Name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
                <TextField label="Company" optional autoComplete="organization" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} error={errors.company} />
                <TextField label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
                <TextField label="Phone" type="tel" autoComplete="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} error={errors.phone} />
                <TextField label="Event date" type="date" min={earliestCateringDate()} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} error={errors.date ?? errors.guests} hint="At least two days from today" />
                <SelectField label="Catering store" value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })} error={errors.storeId}>
                  <option value="">Choose a store</option>
                  {CATERING_STORES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}, {s.city}
                    </option>
                  ))}
                </SelectField>
              </div>
              <ChoiceGroup
                label="Delivery or pickup"
                value={form.fulfilment}
                onChange={(v) => setForm({ ...form, fulfilment: v })}
                error={errors.fulfilment}
                options={[
                  { value: 'delivery', label: 'We deliver and set up', note: 'Free over ₹4,999' },
                  { value: 'pickup', label: 'You pick up', note: 'Ready 15 minutes early' },
                ]}
              />
              <TextArea label="Anything else" optional maxLength={500} placeholder="Allergies, timings, a theme…" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} error={errors.notes} />
              <Button type="submit" size="lg" loading={status === 'loading'} icon={<CalendarCheck aria-hidden />}>
                Send request
              </Button>
            </form>
          )}
        </section>

        <section className="mt-20 max-w-[860px]" aria-labelledby="faq">
          <h2 id="faq" className="display mb-4 text-[clamp(44px,5.4vw,68px)]">
            Good questions
          </h2>
          {CATERING_FAQ.map((f) => (
            <Disclosure key={f.q} q={f.q} a={f.a} />
          ))}
        </section>
      </div>
    </>
  )
}
