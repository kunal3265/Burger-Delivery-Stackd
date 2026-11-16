import { Dices, RotateCcw, ShoppingBag } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '../components/Button'
import { BurgerStack } from '../components/BurgerStack'
import { Badge, PageHero } from '../components/Display'
import { ChoiceGroup, Chip, Stepper, TextField } from '../components/Form'
import { useToast } from '../components/Overlay'
import { BUILDER } from '../data'
import { useDocumentTitle } from '../lib/hooks'
import { useStore } from '../lib/store'
import { buildKcal, buildPrice, money, type Build } from '../shared/pricing'

const KEY = 'stackd.build'

function loadBuild(): Build {
  try {
    const raw = localStorage.getItem(KEY)
    if (raw) return { ...BUILDER.default, ...JSON.parse(raw) }
  } catch {
    /* ignore */
  }
  return { ...BUILDER.default }
}

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

function Step({ n, title, note, children }: { n: number; title: string; note?: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={`step-${n}`} className="flex flex-col gap-4 rounded-[var(--radius-lg)] border-2 border-bun-2 bg-white/60 p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        <h2 id={`step-${n}`} className="flex items-baseline gap-3">
          <span className="condensed flex size-9 shrink-0 items-center justify-center rounded-[10px] bg-ink text-[20px] text-cream">{n}</span>
          <span className="display text-[34px]">{title}</span>
        </h2>
        {note && <span className="text-[14px] text-muted">{note}</span>}
      </div>
      {children}
    </section>
  )
}

export function BuildPage() {
  useDocumentTitle('Build a burger')
  const [build, setBuild] = useState<Build>(loadBuild)
  const [name, setName] = useState('My stack')
  const [qty, setQty] = useState(1)
  const { addBuild, setBagOpen } = useStore()
  const toast = useToast()

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(build))
    } catch {
      /* ignore */
    }
  }, [build])

  const update = (patch: Partial<Build>) => setBuild((b) => ({ ...b, ...patch }))
  const toggleTopping = (id: string) => setBuild((b) => ({ ...b, toppings: b.toppings.includes(id) ? b.toppings.filter((t) => t !== id) : [...b.toppings, id] }))
  const full = build.toppings.length >= BUILDER.maxToppings
  const price = buildPrice(build)
  const kcal = buildKcal(build)

  const surprise = () => {
    const toppings = [...BUILDER.toppings].sort(() => Math.random() - 0.5).slice(0, 2 + Math.floor(Math.random() * 3)).map((t) => t.id)
    setBuild({ bun: pick(BUILDER.buns).id, protein: pick(BUILDER.proteins).id, patties: 1 + Math.floor(Math.random() * 3), cheese: pick(BUILDER.cheeses).id, toppings, sauce: pick(BUILDER.sauces).id })
  }

  const add = () => {
    addBuild(build, name.trim() || 'My stack', qty)
    toast(
      `${name.trim() || 'My stack'} added to your bag`,
      <button type="button" className="on-ink h-9 rounded-[10px] bg-ketchup px-3 text-[14px] font-semibold text-cream hover:bg-ketchup-2" onClick={() => setBagOpen(true)}>
        View bag
      </button>,
    )
  }

  const opt = (i: { name: string; price: number; kcal: number }, perPatty = false) => ({
    label: i.name,
    note: `${i.price ? `+${money(i.price)}${perPatty ? ' each' : ''}` : 'Included'}, ${i.kcal} kcal`,
  })

  return (
    <>
      <PageHero kicker="You are the chef now" title="Build a burger" body="Pick a bun, stack up to four patties, layer on six toppings and finish with a sauce. We grill it exactly like that." />
      <div className="container-page mt-20 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] lg:items-start">
        <aside className="flex flex-col gap-5 rounded-[var(--radius-xl)] border-2 border-ink bg-bun p-6 sm:p-8 lg:sticky lg:top-[120px]">
          <div className="flex min-h-[300px] items-end justify-center sm:min-h-[400px]">
            <BurgerStack build={build} label={`Your burger: ${build.patties} patties and ${build.toppings.length} toppings`} className="max-w-[340px]" />
          </div>
          <div className="flex flex-wrap items-end justify-between gap-3 border-t-2 border-ink/15 pt-5">
            <div className="flex flex-col">
              <span className="text-[14px] font-semibold text-muted">Your stack</span>
              <span className="condensed text-[40px] leading-none tabular-nums" aria-live="polite">
                {money(price)}
              </span>
            </div>
            <Badge tone="ink">{kcal.toLocaleString()} kcal</Badge>
          </div>
          <TextField label="Name your burger" maxLength={32} value={name} onChange={(e) => setName(e.target.value)} />
          <div className="flex items-center gap-3">
            <Stepper value={qty} onChange={setQty} label="quantity" />
            <Button size="lg" className="flex-1" icon={<ShoppingBag aria-hidden />} onClick={add}>
              Add {money(price * qty)}
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" icon={<Dices aria-hidden />} onClick={surprise}>
              Surprise me
            </Button>
            <Button variant="ghost" size="sm" icon={<RotateCcw aria-hidden />} onClick={() => setBuild({ ...BUILDER.default })}>
              Start over
            </Button>
          </div>
        </aside>

        <div className="flex flex-col gap-5">
          <Step n={1} title="Bun">
            <ChoiceGroup label="Bun" hideLabel tone="white" value={build.bun} onChange={(v) => update({ bun: v })} options={BUILDER.buns.map((b) => ({ value: b.id, ...opt(b) }))} />
          </Step>
          <Step n={2} title="Protein" note={`Up to ${BUILDER.maxPatties}`}>
            <ChoiceGroup label="Protein" hideLabel tone="white" columns={3} value={build.protein} onChange={(v) => update({ protein: v })} options={BUILDER.proteins.map((p) => ({ value: p.id, ...opt(p, true) }))} />
            <div className="flex items-center justify-between gap-3 rounded-[var(--radius-sm)] bg-bun px-4 py-2">
              <span className="text-[15px] font-semibold">How many?</span>
              <Stepper value={build.patties} onChange={(n) => update({ patties: n })} min={1} max={BUILDER.maxPatties} label="patties" />
            </div>
          </Step>
          <Step n={3} title="Cheese" note="A slice on every patty">
            <ChoiceGroup label="Cheese" hideLabel tone="white" columns={4} value={build.cheese} onChange={(v) => update({ cheese: v })} options={BUILDER.cheeses.map((c) => ({ value: c.id, ...opt(c, true) }))} />
          </Step>
          <Step n={4} title="Toppings" note={`${build.toppings.length} of ${BUILDER.maxToppings}`}>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Toppings">
              {BUILDER.toppings.map((t) => {
                const on = build.toppings.includes(t.id)
                return (
                  <Chip key={t.id} selected={on} disabled={!on && full} onClick={() => toggleTopping(t.id)}>
                    {t.name}
                    {t.price > 0 && <span className="text-[13px] opacity-75">+{money(t.price)}</span>}
                  </Chip>
                )
              })}
            </div>
            {full && <p className="text-[14px] font-semibold text-ketchup-ink">That is the limit. Remove a topping to swap it.</p>}
          </Step>
          <Step n={5} title="Sauce">
            <ChoiceGroup label="Sauce" hideLabel tone="white" columns={3} value={build.sauce} onChange={(v) => update({ sauce: v })} options={BUILDER.sauces.map((s) => ({ value: s.id, ...opt(s) }))} />
          </Step>
        </div>
      </div>
    </>
  )
}
