import { Gift, LogOut, ShoppingBag, Ticket } from 'lucide-react'
import { useState, type FormEvent } from 'react'

import { Button } from '../components/Button'
import { RewardCard } from '../components/Cards'
import { Badge, EmptyState, Img, Notice, PageHero, Progress, SectionHeading, StatTile } from '../components/Display'
import { Checkbox, SelectField, TextField } from '../components/Form'
import { useToast } from '../components/Overlay'
import { MENU, REWARDS, REWARD_STEPS, SITE, STORES, TIERS } from '../data'
import { cx, postJson, useDocumentTitle } from '../lib/hooks'
import { useStore } from '../lib/store'
import { validateJoin, type FieldErrors } from '../shared/validation'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

function tierFor(lifetime: number) {
  const idx = TIERS.reduce((acc, t, i) => (lifetime >= t.min ? i : acc), 0)
  return { tier: TIERS[idx], next: TIERS[idx + 1] }
}

function rewardImage(itemId: string) {
  const item = MENU.find((m) => m.id === itemId)
  return item ? <Img src={item.image} alt="" className="h-full max-h-[180px] w-auto object-contain drop-shadow-[0_14px_14px_rgb(0_0_0/0.22)]" /> : <Gift className="size-12" aria-hidden />
}

function JoinForm() {
  const { join, store } = useStore()
  const toast = useToast()
  const [form, setForm] = useState({ name: '', email: '', birthMonth: '', storeId: store?.id ?? '', terms: false })
  const [errors, setErrors] = useState<FieldErrors>({})
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    const payload = { name: form.name.trim(), email: form.email.trim(), birthMonth: form.birthMonth ? Number(form.birthMonth) : null, storeId: form.storeId || undefined, terms: form.terms }
    const local = validateJoin(payload)
    setErrors(local)
    if (Object.keys(local).length) return
    setStatus('loading')
    const res = await postJson<{ memberId: string }>('/api/rewards/join', payload)
    if (!res.ok) {
      setStatus('error')
      setErrors(res.fieldErrors ?? {})
      setMessage(res.error)
      return
    }
    join({ memberId: res.data.memberId, name: payload.name, email: payload.email })
    toast(`Welcome to the stack, ${payload.name.split(' ')[0]}. ${SITE.welcomePoints} points added.`)
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-4 rounded-[var(--radius-xl)] border-2 border-ink bg-cream p-6 shadow-[var(--shadow-hard)] sm:p-8">
      <div>
        <h2 className="display text-[44px]">Join free</h2>
        <p className="mt-1 text-[15px] text-muted">{SITE.welcomePoints} points the moment you sign up.</p>
      </div>
      {status === 'error' && message && <Notice tone="error">{message}</Notice>}
      <TextField label="Name" autoComplete="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} error={errors.name} />
      <TextField label="Email" type="email" autoComplete="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} error={errors.email} />
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField label="Birthday month" optional value={form.birthMonth} onChange={(e) => setForm({ ...form, birthMonth: e.target.value })} error={errors.birthMonth} hint="For your free shake">
          <option value="">Skip</option>
          {MONTHS.map((m, i) => (
            <option key={m} value={i + 1}>
              {m}
            </option>
          ))}
        </SelectField>
        <SelectField label="Home store" optional value={form.storeId} onChange={(e) => setForm({ ...form, storeId: e.target.value })} error={errors.storeId}>
          <option value="">Any store</option>
          {STORES.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </SelectField>
      </div>
      <Checkbox checked={form.terms} onChange={(v) => setForm({ ...form, terms: v })} label="I agree to the rewards terms and can leave any time." error={errors.terms} />
      <Button type="submit" size="lg" loading={status === 'loading'} className="w-full">
        Join and get {SITE.welcomePoints} points
      </Button>
    </form>
  )
}

function Dashboard() {
  const { member, addReward, leave, setBagOpen } = useStore()
  const toast = useToast()
  if (!member) return null
  const { tier, next } = tierFor(member.lifetime)
  const unused = member.wallet.filter((w) => !w.used)

  const applyReward = (code: string) => {
    const r = addReward(code)
    if (r === 'added') {
      toast('Reward added to your bag')
      setBagOpen(true)
    } else if (r === 'already') toast('Your bag already has a reward. Use one per order.')
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile tone="ketchup" label="Points to spend" value={member.points.toLocaleString()} note={`${SITE.pointsPerRupee} point per ₹1`} />
        <StatTile tone="ink" label="Tier" value={tier.name} note={next ? `${(next.min - member.lifetime).toLocaleString()} points to ${next.name}` : 'Top of the stack'} />
        <StatTile label="Rewards ready" value={unused.length} note={unused.length ? 'Use one per order' : 'Redeem below'} />
      </div>
      {next && (
        <div className="flex flex-col gap-2 rounded-[var(--radius-md)] bg-bun p-5">
          <div className="flex justify-between text-[14px] font-semibold">
            <span>{tier.name}</span>
            <span>{next.name}</span>
          </div>
          <Progress value={member.lifetime - tier.min} max={next.min - tier.min} label={`Progress to ${next.name} tier`} />
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-2">
        <section aria-labelledby="wallet" className="flex flex-col gap-3 rounded-[var(--radius-lg)] border-2 border-bun-2 p-5">
          <h3 id="wallet" className="display text-[30px]">
            Wallet
          </h3>
          {unused.length === 0 ? (
            <p className="text-[15px] text-muted">No rewards waiting. Redeem points below and they land here.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {unused.map((w) => {
                const r = REWARDS.find((x) => x.id === w.rewardId)
                return (
                  <li key={w.code} className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-bun p-3">
                    <div className="flex items-center gap-3">
                      <Ticket className="size-5 shrink-0 text-ketchup-ink" aria-hidden />
                      <div>
                        <p className="font-semibold">{r?.name}</p>
                        <p className="font-mono text-[13px] text-muted">{w.code}</p>
                      </div>
                    </div>
                    <Button size="sm" variant="ink" icon={<ShoppingBag aria-hidden />} onClick={() => applyReward(w.code)}>
                      Use
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
        <section aria-labelledby="history" className="flex flex-col gap-3 rounded-[var(--radius-lg)] border-2 border-bun-2 p-5">
          <h3 id="history" className="display text-[30px]">
            Points history
          </h3>
          <ul className="flex max-h-64 flex-col divide-y divide-bun-2 overflow-y-auto">
            {member.history.map((h) => (
              <li key={h.id} className="flex items-center justify-between gap-3 py-2.5 text-[15px]">
                <span>
                  {h.label}
                  <span className="block text-[13px] text-muted">{new Date(h.at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </span>
                <span className={cx('condensed text-[19px] tabular-nums', h.points < 0 ? 'text-ketchup-ink' : 'text-pickle')}>
                  {h.points > 0 ? '+' : ''}
                  {h.points.toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3 text-[14px] text-muted">
        <span>
          Signed in as {member.name} ({member.email}). Member {member.memberId}.
        </span>
        <Button variant="ghost" size="sm" icon={<LogOut aria-hidden />} onClick={leave}>
          Sign out of rewards
        </Button>
      </div>
      <span className="sr-only" aria-live="polite">
        {member.points} points
      </span>
    </div>
  )
}

export function RewardsPage() {
  useDocumentTitle('Rewards')
  const { member, redeem } = useStore()
  const toast = useToast()
  return (
    <>
      <PageHero kicker="Stackd rewards" title={member ? `Hey ${member.name.split(' ')[0]}` : 'Eat. Earn. Stack.'} body={member ? 'Your points, your wallet and everything they buy.' : 'Points on every order, a free shake on your birthday and three tiers that keep getting tastier.'} />
      <div className="container-page mt-20">
        {member ? (
          <Dashboard />
        ) : (
          <div className="grid items-start gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div className="flex flex-col gap-8">
              <SectionHeading align="left" kicker="How it works" title="Three steps to free food" />
              <ol className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {REWARD_STEPS.map((s, i) => (
                  <li key={s.title} className="flex flex-col gap-2 rounded-[var(--radius-lg)] bg-bun p-5">
                    <span className="display text-[56px] text-ketchup-ink">{i + 1}</span>
                    <h3 className="condensed text-[24px]">{s.title}</h3>
                    <p className="text-[15px] text-muted">{s.body}</p>
                  </li>
                ))}
              </ol>
              <div className="grid gap-4 sm:grid-cols-3">
                {TIERS.map((t, i) => (
                  <div key={t.id} className={cx('flex flex-col gap-3 rounded-[var(--radius-lg)] p-5', i === 0 && 'bg-bun', i === 1 && 'on-red bg-ketchup text-cream', i === 2 && 'on-ink bg-ink text-cream')}>
                    <Badge tone={i === 0 ? 'ink' : 'mustard'} className="self-start">
                      {t.min ? `${t.min.toLocaleString()}+ points` : 'Day one'}
                    </Badge>
                    <h3 className="display text-[40px]">{t.name}</h3>
                    <ul className="flex flex-col gap-1 text-[14px]">
                      {t.perks.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="lg:sticky lg:top-[120px]">
              <JoinForm />
            </div>
          </div>
        )}

        <section className="mt-20" aria-labelledby="catalog">
          <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <h2 id="catalog" className="display text-[clamp(44px,5.4vw,68px)]">
              Spend your points
            </h2>
            {!member && <p className="text-[15px] text-muted">Join to start redeeming.</p>}
          </div>
          {REWARDS.length === 0 ? (
            <EmptyState icon={<Gift aria-hidden />} title="New rewards soon" body="The catalogue is being restocked." />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {REWARDS.map((r) => (
                <RewardCard
                  key={r.id}
                  reward={r}
                  points={member?.points ?? 0}
                  member={!!member}
                  image={rewardImage(r.itemId)}
                  onRedeem={() => {
                    const w = redeem(r.id)
                    if (w) toast(`${r.name} is in your wallet: ${w.code}`)
                  }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </>
  )
}
