import { ArrowRight, Plus, RotateCcw, ShoppingBag, X } from 'lucide-react'
import { useState, type ReactNode } from 'react'

import { BUTTON_VARIANTS, Button, ICON_TONES, IconButton } from '../components/Button'
import { BurgerStack } from '../components/BurgerStack'
import { Disclosure, MenuCard, PackageCard, RewardCard, ReviewCard, StoreCard } from '../components/Cards'
import { Badge, EmptyState, Img, LinkArrow, Marquee, Notice, PageHero, Price, Progress, Skeleton, StatTile, Stars, TagBadge, Ticker, WavyRibbon } from '../components/Display'
import { BurgerDoodle, Cloud, CupDoodle, DrumstickDoodle, FriesDoodle, RingDoodle, ShakeDoodle, SquiggleArrow } from '../components/Doodles'
import { Checkbox, ChoiceGroup, Chip, SelectField, Stepper, Switch, TextArea, TextField } from '../components/Form'
import { Modal, ToastPreview, useToast } from '../components/Overlay'
import { CATERING_PACKAGES, MENU, REVIEWS, REWARDS, STORES, TICKER, type Tag } from '../data'
import { cx, useDocumentTitle } from '../lib/hooks'
import { useStore } from '../lib/store'

const COLORS = [
  { group: 'Brand', items: [['ketchup', '#d7141a', 'Hero, bands, primary buttons'], ['ketchup-2', '#b80f15', 'Ketchup hover and pressed'], ['ketchup-ink', '#c11117', 'Small red text on cream'], ['mustard', '#f5b31b', 'Cheese, highlight chips'], ['pickle', '#2f6b2c', 'Plant based, success'], ['pickle-soft', '#dcebc9', 'Plant based tag fill']] },
  { group: 'Neutrals', items: [['cream', '#fdf8e9', 'Page'], ['bun', '#f5ecd3', 'Cards and wells'], ['bun-2', '#ebdfbe', 'Borders, hover'], ['ink', '#0b0b0b', 'Nav, text, dark cards'], ['ink-2', '#242019', 'Dark hover'], ['muted', '#5b5245', 'Secondary text'], ['on-red-muted', '#ffe3d6', 'Secondary text on ketchup'], ['on-ink-muted', '#cfc6b3', 'Secondary text on ink']] },
]

const TYPE = [
  ['Display XL', 'display text-[120px]', '120 / 0.88, 800 condensed caps'],
  ['Display L', 'display text-[68px]', '68 / 0.88, section titles'],
  ['Display M', 'display text-[44px]', '44, card and form titles'],
  ['Display S', 'display text-[30px]', '30, item names'],
  ['Condensed', 'condensed text-[22px]', '22, prices, labels, buttons'],
  ['Body L', 'text-[18px]', '18 / 1.6, lead copy'],
  ['Body', 'text-[16px]', '16 / 1.5, default'],
  ['Small', 'text-[14px]', '14, hints and meta'],
  ['Caption', 'text-[13px]', '13, fine print'],
]

const SPACING = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96]
const RADII = [['xs', 8], ['sm', 12], ['md', 18], ['lg', 26], ['xl', 40]] as const
const SHADOWS = [['hard', 'var(--shadow-hard)'], ['hard-sm', 'var(--shadow-hard-sm)'], ['card', 'var(--shadow-card)'], ['float', 'var(--shadow-float)']] as const
const MOTION = [
  ['marquee', 'animate-marquee', '38s linear, crave line'],
  ['bob', 'animate-bob', '2.6s ease-in-out'],
  ['pop', 'animate-pop', '380ms spring, bag count'],
  ['wiggle', 'animate-wiggle', '2.8s, attention'],
  ['drift', 'animate-drift', '9s, doodle clouds'],
] as const

function Section({ id, title, children, note }: { id: string; title: string; children: ReactNode; note?: string }) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="scroll-mt-28 border-t-2 border-ink pt-8">
      <div className="mb-6 flex flex-col gap-1">
        <h2 id={`${id}-h`} className="display text-[48px]">
          {title}
        </h2>
        {note && <p className="text-[15px] text-muted">{note}</p>}
      </div>
      {children}
    </section>
  )
}

function Label({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-[13px] font-semibold text-muted">{children}</p>
}

const STATES = ['default', 'hover', 'focus', 'pressed'] as const

export function Styleguide() {
  useDocumentTitle('Style guide')
  const toast = useToast()
  const { setBagOpen } = useStore()
  const [replay, setReplay] = useState(0)
  const [modal, setModal] = useState(false)
  const [choice, setChoice] = useState('pickup')
  const [chips, setChips] = useState<string[]>(['lettuce'])
  const [qty, setQty] = useState(2)
  const [sw, setSw] = useState(true)
  const [check, setCheck] = useState(true)

  return (
    <>
      <PageHero kicker="Design system" title="Style guide" body="Every token and component the site is built from, rendered by the real components. Hover, focus and pressed states are pinned with data-force." />
      <div className="container-page mt-20 flex flex-col gap-16">
        <nav aria-label="Style guide sections" className="flex flex-wrap gap-2">
          {['colour', 'type', 'space', 'motion', 'buttons', 'forms', 'feedback', 'cards', 'brand'].map((s) => (
            <a key={s} href={`#${s}`} className="inline-flex h-10 items-center rounded-[var(--radius-sm)] bg-bun px-4 text-[15px] font-semibold capitalize hover:bg-bun-2">
              {s}
            </a>
          ))}
        </nav>

        <Section id="colour" title="Colour" note="Cream text on ketchup is 4.9:1. Ink text on ketchup is only used at display sizes.">
          {COLORS.map((g) => (
            <div key={g.group} className="mb-8">
              <Label>{g.group}</Label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {g.items.map(([name, hex, use]) => (
                  <div key={name} className="overflow-hidden rounded-[var(--radius-md)] border-2 border-bun-2">
                    <div className="h-20" style={{ background: hex }} />
                    <div className="p-3">
                      <p className="font-semibold">{name}</p>
                      <p className="font-mono text-[13px] text-muted">{hex}</p>
                      <p className="text-[13px] text-muted">{use}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </Section>

        <Section id="type" title="Type" note="Bricolage Grotesque. Display type runs at 75% width, weight 800, in caps; everything else is sentence case.">
          <div className="flex flex-col divide-y-2 divide-bun-2">
            {TYPE.map(([name, cls, spec]) => (
              <div key={name} className="flex flex-col gap-2 py-4 lg:flex-row lg:items-baseline lg:gap-8">
                <div className="w-48 shrink-0">
                  <p className="font-semibold">{name}</p>
                  <p className="text-[13px] text-muted">{spec}</p>
                </div>
                <p className={cx(cls, 'min-w-0 break-words')}>Stack it tall</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="space" title="Space, radii, shadows">
          <Label>Spacing (px)</Label>
          <div className="mb-8 flex flex-wrap items-end gap-3">
            {SPACING.map((s) => (
              <div key={s} className="flex flex-col items-center gap-1">
                <div className="bg-ketchup" style={{ width: s, height: s }} />
                <span className="text-[13px] text-muted">{s}</span>
              </div>
            ))}
          </div>
          <Label>Radii (squircle)</Label>
          <div className="mb-8 flex flex-wrap gap-4">
            {RADII.map(([n, r]) => (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className="size-24 border-2 border-ink bg-bun" style={{ borderRadius: r }} />
                <span className="text-[13px] text-muted">
                  {n} {r}px
                </span>
              </div>
            ))}
          </div>
          <Label>Shadows</Label>
          <div className="flex flex-wrap gap-6">
            {SHADOWS.map(([n, v]) => (
              <div key={n} className="flex flex-col items-center gap-2">
                <div className="size-28 rounded-[var(--radius-md)] border-2 border-ink bg-cream" style={{ boxShadow: v }} />
                <span className="text-[13px] text-muted">{n}</span>
              </div>
            ))}
          </div>
        </Section>

        <Section id="motion" title="Motion" note="Ease out cubic-bezier(0.22, 1, 0.36, 1); spring cubic-bezier(0.34, 1.56, 0.64, 1). Fast 140ms, base 260ms, slow 560ms. Reduced motion turns loops off.">
          <Button variant="ink" size="sm" icon={<RotateCcw aria-hidden />} onClick={() => setReplay((r) => r + 1)} className="mb-6">
            Replay
          </Button>
          <div key={replay} className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            {MOTION.map(([n, cls, spec]) => (
              <div key={n} className="flex flex-col items-center gap-3 overflow-hidden rounded-[var(--radius-md)] bg-bun p-5">
                <div className={cx('flex size-14 items-center justify-center rounded-[var(--radius-sm)] bg-ketchup text-cream', n !== 'marquee' && cls)}>
                  <BurgerDoodle className="size-8" />
                </div>
                <p className="font-semibold">{n}</p>
                <p className="text-center text-[13px] text-muted">{spec}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 overflow-hidden rounded-[var(--radius-md)] bg-bun py-3">
            <Marquee>
              <span className="display px-6 text-[40px]">Marquee: stack it, the Stackd way.</span>
            </Marquee>
          </div>
        </Section>

        <Section id="buttons" title="Buttons" note="Rows: default, hover, focus-visible, pressed, disabled, loading.">
          <div className="flex flex-col gap-6">
            {BUTTON_VARIANTS.map((v) => {
              const dark = v === 'outline-light'
              return (
                <div key={v} className={cx('rounded-[var(--radius-md)] p-4', dark ? 'on-red bg-ketchup text-cream' : v === 'cream' ? 'on-ink bg-ink text-cream' : 'bg-bun')}>
                  <Label>
                    <span className={dark || v === 'cream' ? 'text-cream' : ''}>{v}</span>
                  </Label>
                  <div className="flex flex-wrap items-center gap-3">
                    {STATES.map((s) => (
                      <Button key={s} variant={v} force={s === 'default' ? undefined : s}>
                        {s === 'default' ? 'Add to bag' : s[0].toUpperCase() + s.slice(1)}
                      </Button>
                    ))}
                    <Button variant={v} disabled>
                      Disabled
                    </Button>
                    <Button variant={v} loading>
                      Loading
                    </Button>
                  </div>
                </div>
              )
            })}
            <div className="flex flex-wrap items-center gap-3">
              <Label>Sizes</Label>
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg" iconRight={<ArrowRight aria-hidden />}>
                Large
              </Button>
              <LinkArrow to="/menu">Link arrow</LinkArrow>
            </div>
            <div>
              <Label>Icon buttons</Label>
              <div className="flex flex-wrap items-center gap-3">
                {ICON_TONES.map((t) => (
                  <IconButton key={t} tone={t} aria-label={`${t} icon button`}>
                    <Plus aria-hidden />
                  </IconButton>
                ))}
                <IconButton tone="ink" force="focus" aria-label="Focused icon button">
                  <X aria-hidden />
                </IconButton>
                <IconButton tone="ketchup" disabled aria-label="Disabled icon button">
                  <ShoppingBag aria-hidden />
                </IconButton>
              </div>
            </div>
          </div>
        </Section>

        <Section id="forms" title="Forms">
          <div className="grid gap-6 md:grid-cols-2">
            <TextField label="Default" placeholder="Your name" />
            <TextField label="Focus" force="focus" defaultValue="Dana" />
            <TextField label="Error" defaultValue="dana@" error="Enter a valid email address." />
            <TextField label="Disabled" disabled defaultValue="Locked" />
            <TextField label="With hint" optional hint="We text when it is ready" />
            <SelectField label="Select">
              <option>East Sixth</option>
              <option>Mueller</option>
            </SelectField>
            <TextArea label="Text area" wrapClass="md:col-span-2" placeholder="No onions, extra pickles…" />
            <ChoiceGroup label="Choice group" value={choice} onChange={setChoice} options={[{ value: 'pickup', label: 'Pickup', note: 'About 15 minutes' }, { value: 'delivery', label: 'Delivery', note: '₹29' }, { value: 'off', label: 'Disabled', disabled: true }]} columns={3} />
            <div className="flex flex-col gap-4">
              <Checkbox checked={check} onChange={setCheck} label="Checkbox" />
              <Checkbox checked={false} onChange={() => {}} label="Focused checkbox" force="focus" />
              <Checkbox checked={false} onChange={() => {}} label="Checkbox with error" error="Accept the terms to join." />
              <Switch checked={sw} onChange={setSw} label="Switch" note="Make it a combo" />
            </div>
            <div>
              <Label>Chips: off, on, hover, focus, disabled</Label>
              <div className="flex flex-wrap gap-2">
                {['lettuce', 'tomato'].map((c) => (
                  <Chip key={c} selected={chips.includes(c)} onClick={() => setChips((p) => (p.includes(c) ? p.filter((x) => x !== c) : [...p, c]))}>
                    {c[0].toUpperCase() + c.slice(1)}
                  </Chip>
                ))}
                <Chip selected={false} force="hover" onClick={() => {}}>
                  Hover
                </Chip>
                <Chip selected={false} force="focus" onClick={() => {}}>
                  Focus
                </Chip>
                <Chip selected={false} disabled onClick={() => {}}>
                  Disabled
                </Chip>
                <Chip selected onClick={() => {}} count={4}>
                  With count
                </Chip>
              </div>
            </div>
            <div>
              <Label>Stepper</Label>
              <div className="flex items-center gap-4">
                <Stepper value={qty} onChange={setQty} label="quantity" />
                <Stepper value={1} onChange={() => {}} label="small quantity" size="sm" />
              </div>
            </div>
          </div>
        </Section>

        <Section id="feedback" title="Feedback and overlays">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <Notice>Info: orders are kept in this browser.</Notice>
              <Notice tone="success">Success: request received.</Notice>
              <Notice tone="error">Error: check the highlighted fields.</Notice>
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {(['bun', 'ink', 'ketchup', 'mustard', 'pickle'] as const).map((t) => (
                  <Badge key={t} tone={t}>
                    {t}
                  </Badge>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(['new', 'spicy', 'veg', 'best'] as Tag[]).map((t) => (
                  <TagBadge key={t} tag={t} />
                ))}
              </div>
              <div className="flex items-center gap-4 text-ketchup-ink">
                <Stars count={4} />
                <Price value={9.49} className="text-[26px] text-ink" />
                <Price value={0} className="text-[26px] text-ink" />
              </div>
              <Progress value={18} max={30} label="Example progress" />
              <ToastPreview>Toast: Classic Stack added</ToastPreview>
              <div className="flex flex-wrap gap-2">
                <Button variant="ink" size="sm" onClick={() => toast('A live toast')}>
                  Show toast
                </Button>
                <Button variant="outline" size="sm" onClick={() => setModal(true)}>
                  Open modal
                </Button>
                <Button variant="outline" size="sm" onClick={() => setBagOpen(true)}>
                  Open bag drawer
                </Button>
              </div>
            </div>
            <EmptyState icon={<ShoppingBag aria-hidden />} title="Empty state" body="Nothing on the grill yet." action={<Button size="sm">Browse the menu</Button>} />
            <div className="flex flex-col gap-3">
              <Label>Loading skeleton</Label>
              <Skeleton className="h-40" />
              <Skeleton className="h-6 w-2/3" />
              <Skeleton className="h-6 w-1/3" />
            </div>
            <div className="grid grid-cols-3 gap-3 md:col-span-2">
              <StatTile tone="ketchup" label="Points" value="1,240" note="1 per ₹1" />
              <StatTile tone="ink" label="Tier" value="Double" />
              <StatTile label="Rewards" value={2} />
            </div>
            <div className="md:col-span-2">
              <Disclosure q="Disclosure: how much notice do you need?" a="Two days for most orders." />
            </div>
          </div>
        </Section>

        <Section id="cards" title="Cards">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <Label>Menu card</Label>
              <MenuCard item={MENU[0]} onOpen={() => {}} onQuickAdd={() => {}} />
            </div>
            <div>
              <Label>Menu card, hover</Label>
              <MenuCard item={MENU[2]} onOpen={() => {}} onQuickAdd={() => {}} force="hover" />
            </div>
            <div>
              <Label>Reward, ready</Label>
              <RewardCard reward={REWARDS[0]} points={900} member onRedeem={() => {}} image={<Img src="fries" alt="" className="h-full max-h-[150px] w-auto object-contain" />} />
            </div>
            <div>
              <Label>Reward, locked</Label>
              <RewardCard reward={REWARDS[4]} points={900} member onRedeem={() => {}} image={<Img src="burgerDouble" alt="" className="h-full max-h-[150px] w-auto object-contain" />} />
            </div>
            <div className="sm:col-span-2">
              <Label>Store card, default and active</Label>
              <div className="flex flex-col gap-3">
                <StoreCard store={STORES[0]} onSelect={() => {}} />
                <StoreCard store={STORES[1]} onSelect={() => {}} active selected />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label>Package card, selected</Label>
              <PackageCard pkg={CATERING_PACKAGES[0]} selected onSelect={() => {}} />
            </div>
            <ReviewCard {...REVIEWS[0]} tone="ketchup" />
            <ReviewCard {...REVIEWS[1]} />
          </div>
        </Section>

        <Section id="brand" title="Brand pieces">
          <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
            <div className="flex flex-col items-center rounded-[var(--radius-lg)] bg-bun p-6">
              <Label>Burger stack illustration</Label>
              <BurgerStack build={{ bun: 'potato', protein: 'beef', patties: 2, cheese: 'cheddar', toppings: ['bacon', 'egg', 'rings'], sauce: 'bbq' }} label="Example stack" className="max-w-[240px]" />
            </div>
            <div className="flex flex-col gap-6">
              <div>
                <Label>Doodles</Label>
                <div className="flex flex-wrap items-center gap-5 text-ink">
                  {[BurgerDoodle, FriesDoodle, ShakeDoodle, DrumstickDoodle, RingDoodle, CupDoodle].map((D, i) => (
                    <D key={i} className="size-10" />
                  ))}
                  <Cloud className="w-24" />
                  <SquiggleArrow className="w-14" />
                </div>
              </div>
              <div className="on-ink rounded-[var(--radius-md)] bg-ink p-5">
                <Label>
                  <span className="text-on-ink-muted">Wordmark</span>
                </Label>
                <span className="wordmark text-[64px] leading-none">Stackd</span>
              </div>
              <div className="on-red overflow-hidden rounded-[var(--radius-md)] bg-ketchup">
                <div className="doodles h-24" />
                <div className="scallop -mb-px [--scallop:var(--color-cream)] rotate-180" />
              </div>
            </div>
          </div>
          <div className="mt-6 overflow-hidden">
            <Ticker words={TICKER} />
          </div>
          <div className="relative mt-6 h-48 overflow-hidden">
            <WavyRibbon text="New stack in town" className="absolute inset-0 h-full" />
          </div>
        </Section>
      </div>
      <Modal open={modal} onClose={() => setModal(false)} title="Modal" footer={<Button onClick={() => setModal(false)}>Done</Button>}>
        <p className="text-[16px] text-muted">Focus is trapped here. Esc closes it and returns focus to the button that opened it.</p>
      </Modal>
    </>
  )
}
