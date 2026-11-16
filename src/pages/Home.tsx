import { ArrowRight, MapPin } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

import { ButtonLink } from '../components/Button'
import { BurgerStack } from '../components/BurgerStack'
import { MenuCard, ReviewStack } from '../components/Cards'
import { Img, LinkArrow, Marquee, PhotoCard, SectionHeading, Ticker, WavyRibbon } from '../components/Display'
import { Cloud, GroundLine, SquiggleArrow } from '../components/Doodles'
import { ItemDialog } from '../components/ItemDialog'
import { useToast } from '../components/Overlay'
import { HOME, IMAGES, MENU, REVIEWS, SITE, TICKER, type MenuItem } from '../data'
import { useDocumentTitle, useReducedMotion } from '../lib/hooks'
import { useStore } from '../lib/store'
import type { Build } from '../shared/pricing'

function Hero() {
  const letters = SITE.name.split('')
  return (
    <section className="on-red relative bg-ketchup text-cream [overflow-x:clip]">
      <div className="relative mx-auto flex max-w-[1440px] flex-col items-center px-4 pt-[clamp(120px,min(11vw,15vh),170px)] text-center">
        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="display text-[clamp(32px,min(4vw,5.2vh),60px)]">
          {SITE.heroKicker}
        </motion.p>
        <h1 className="display mt-[0.1em] text-[clamp(96px,min(17.4vw,23vh),252px)] leading-[0.8]" aria-label={SITE.name}>
          {letters.map((l, i) => (
            <motion.span key={i} aria-hidden className="inline-block" initial={{ opacity: 0, y: 60, rotate: i % 2 ? 6 : -6 }} animate={{ opacity: 1, y: 0, rotate: 0 }} transition={{ type: 'spring', stiffness: 380, damping: 18, delay: 0.08 + i * 0.06 }}>
              {l}
            </motion.span>
          ))}
        </h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5, duration: 0.5 }} className="display mt-[clamp(12px,min(1.8vw,2.6vh),26px)] text-[clamp(20px,min(2.3vw,3.4vh),33px)]">
          {SITE.heroLine}
        </motion.p>

        <div className="relative mt-[clamp(14px,min(2vw,2.6vh),34px)] z-[1] -mb-[calc(min(94vw,clamp(340px,min(52vw,80vh),760px))*0.085)] w-[min(94vw,clamp(340px,min(52vw,80vh),760px))] [container-type:inline-size]">
          <GroundLine className="absolute bottom-[5%] left-[-38%] w-[48%] text-ink" />
          <GroundLine className="absolute bottom-[5%] right-[-38%] w-[48%] -scale-x-100 text-ink" />
          <Cloud className="absolute top-[30%] left-[-30%] w-[17%] animate-drift text-ink" />
          <Cloud className="absolute top-[12%] right-[-26%] w-[14%] animate-drift text-ink [animation-delay:-4s]" />
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="relative">
            <img src={IMAGES.storefront} alt="Illustration of the original Stackd shop with a burger mascot on the roof sign" className="relative w-full" width={1536} height={1024} fetchPriority="high" />
            {/* The roof sign: the brand name painted onto the blank board. */}
            <span aria-hidden className="display absolute top-[30.4%] left-[53.6%] -translate-x-1/2 -translate-y-1/2 rotate-[10.2deg] text-[10.6cqw] leading-none text-ink">
              {SITE.name}
            </span>
          </motion.div>
        </div>
      </div>
      <div className="scallop absolute inset-x-0 top-[calc(100%-1px)]" aria-hidden />
      <div className="absolute inset-x-0 bottom-0 z-[2] flex translate-y-1/2 justify-center">
        <ButtonLink to="/locations" size="lg" className="border-2 border-ketchup px-7 text-[24px] shadow-[0_6px_0_rgb(0_0_0/0.18)]" icon={<MapPin aria-hidden />}>
          Find location
        </ButtonLink>
      </div>
    </section>
  )
}

function Crave() {
  return (
    <section aria-label="Stack it, the Stackd way" className="pt-[clamp(80px,9vw,120px)]">
      <Marquee className="text-ink">
        {SITE.marquee.split('. ').map((t, i) => (
          <span key={i} className="display pr-[0.3em] text-[clamp(56px,7.6vw,110px)] whitespace-nowrap">
            {t.replace(/\.$/, '')}.
          </span>
        ))}
      </Marquee>
    </section>
  )
}

function PhotoStrip() {
  return (
    <section className="container-page mt-10 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
      {HOME.photoStrip.map((p, i) => (
        <PhotoCard key={p.image} image={p.image} alt={p.alt} tilt={[-1.5, 1, -1][i]} className="aspect-[4/5]" />
      ))}
      <div className="on-red flex aspect-[4/5] flex-col justify-between gap-4 rounded-[var(--radius-lg)] bg-ketchup p-6 text-cream">
        <p className="display text-[clamp(34px,3.2vw,46px)]">{HOME.stripCard.title}</p>
        <div className="flex flex-col gap-4">
          <p className="text-[15px] leading-snug text-on-red-muted">{HOME.stripCard.body}</p>
          <ButtonLink to="/rewards" variant="ink" size="sm" iconRight={<SquiggleArrow className="!w-8" />}>
            {HOME.stripCard.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

function Adventure() {
  return (
    <section className="container-page mt-24">
      <div className="on-red relative bg-ketchup text-cream" style={{ borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
        <div className="doodles absolute inset-0" aria-hidden />
        <div className="relative flex flex-col items-center gap-5 px-6 py-20 text-center sm:py-24">
          <h2 className="display max-w-[780px] text-[clamp(48px,7vw,104px)]">{HOME.adventure.title}</h2>
          <p className="display max-w-[520px] text-[clamp(18px,1.8vw,24px)]">{HOME.adventure.body}</p>
          <ButtonLink to="/menu" variant="ink" size="md" className="mt-2" iconRight={<SquiggleArrow className="!w-9" />}>
            {HOME.adventure.cta}
          </ButtonLink>
        </div>
      </div>
      <div className="zigzag" aria-hidden />
    </section>
  )
}

function TopPicks() {
  const { addItem } = useStore()
  const toast = useToast()
  const [open, setOpen] = useState<MenuItem | null>(null)
  const picks = MENU.filter((m) => m.tags.includes('best') || m.tags.includes('new')).slice(0, 4)
  return (
    <section className="container-page mt-28">
      <div className="mb-10 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <SectionHeading align="left" kicker="Hot off the flat-top" title="Today's top stacks" />
        <LinkArrow to="/menu">See the full menu</LinkArrow>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {picks.map((m) => (
          <MenuCard
            key={m.id}
            item={m}
            onOpen={() => setOpen(m)}
            onQuickAdd={() => {
              addItem(m.id)
              toast(`${m.name} added to your bag`)
            }}
          />
        ))}
      </div>
      <ItemDialog item={open} onClose={() => setOpen(null)} />
    </section>
  )
}

function NewInTown() {
  return (
    <section className="relative mt-28 overflow-hidden py-10" aria-label={HOME.ribbon}>
      <WavyRibbon text={HOME.ribbon} className="absolute top-1/2 left-0 h-[clamp(130px,16vw,220px)] -translate-y-1/2" />
      <div className="relative mx-auto flex h-[clamp(420px,46vw,620px)] w-[min(92vw,560px)] items-center justify-center">
        <motion.div whileHover={{ rotate: -2, scale: 1.03 }} className="absolute top-0 left-[4%] w-[46%] -rotate-6">
          <Img src="handBurger" alt="A hand holding a bitten smash cheeseburger" className="w-full drop-shadow-[0_20px_20px_rgb(0_0_0/0.25)]" />
        </motion.div>
        <motion.div whileHover={{ rotate: 2, scale: 1.04 }} className="absolute top-[22%] left-[32%] z-[2] w-[38%] overflow-hidden rounded-[48%_52%_44%_56%/58%_46%_54%_42%] border-4 border-cream shadow-[var(--shadow-card)]">
          <Img src="photoShake" alt="A vanilla shake lifted beside a burger in a diner booth" className="aspect-square w-full object-cover" />
        </motion.div>
        <motion.div whileHover={{ rotate: 3, scale: 1.03 }} className="absolute right-[2%] bottom-0 w-[42%] rotate-6">
          <Img src="handChicken" alt="A hand holding a glazed fried chicken drumstick against blue sky" className="w-full drop-shadow-[0_20px_20px_rgb(0_0_0/0.25)]" />
        </motion.div>
      </div>
    </section>
  )
}

const DEMO_BUILDS: Build[] = [
  { bun: 'brioche', protein: 'beef', patties: 2, cheese: 'american', toppings: ['lettuce', 'tomato', 'pickles'], sauce: 'stackd' },
  { bun: 'potato', protein: 'beef', patties: 3, cheese: 'cheddar', toppings: ['bacon', 'rings'], sauce: 'bbq' },
  { bun: 'brioche', protein: 'chicken', patties: 1, cheese: 'pepper-jack', toppings: ['lettuce', 'jalapeno', 'pickles'], sauce: 'hot-honey' },
  { bun: 'seeded', protein: 'plant', patties: 2, cheese: 'no-cheese', toppings: ['lettuce', 'tomato', 'onion', 'egg'], sauce: 'garlic' },
]

function BuilderTeaser() {
  const reduced = useReducedMotion()
  const [i, setI] = useState(0)
  useEffect(() => {
    if (reduced) return
    const t = window.setInterval(() => setI((n) => (n + 1) % DEMO_BUILDS.length), 2600)
    return () => window.clearInterval(t)
  }, [reduced])
  return (
    <section className="container-page mt-20">
      <div className="on-ink grid items-center gap-10 overflow-hidden rounded-[var(--radius-xl)] bg-ink px-6 py-14 text-cream sm:px-12 lg:grid-cols-2 lg:px-16">
        <div className="flex flex-col items-start gap-5">
          <p className="condensed text-[18px] text-mustard">Build-your-burger</p>
          <h2 className="display text-[clamp(48px,6vw,88px)]">{HOME.builderTeaser.title}</h2>
          <p className="max-w-[440px] text-[17px] leading-relaxed text-on-ink-muted">{HOME.builderTeaser.body}</p>
          <ButtonLink to="/build" size="lg" iconRight={<ArrowRight aria-hidden />}>
            {HOME.builderTeaser.cta}
          </ButtonLink>
        </div>
        <div className="flex h-[360px] items-end justify-center sm:h-[420px]">
          <BurgerStack build={DEMO_BUILDS[i]} label="An illustrated burger cycling through example builds" className="max-w-[340px]" />
        </div>
      </div>
    </section>
  )
}

function Reviews() {
  return (
    <section className="container-page mt-28 flex flex-col items-center gap-12 [overflow-x:clip]">
      <SectionHeading title={HOME.reviewsTitle} />
      <ReviewStack reviews={REVIEWS} />
    </section>
  )
}

function FuelUp() {
  return (
    <section className="relative mt-20 overflow-hidden pt-16 pb-8">
      <Cloud className="absolute top-6 left-[8%] w-[clamp(80px,9vw,130px)] animate-drift text-ink" />
      <Cloud className="absolute top-20 right-[6%] w-[clamp(90px,11vw,160px)] animate-drift text-ink [animation-delay:-3s]" />
      <div className="container-page relative flex flex-col items-center gap-5 text-center">
        <p className="display text-[clamp(18px,1.8vw,24px)]">{HOME.fuel.kicker}</p>
        <h2 className="display text-[clamp(56px,8vw,120px)]">{HOME.fuel.title}</h2>
        <p className="max-w-[480px] text-[17px] text-muted">{HOME.fuel.body}</p>
        <div className="mt-3 flex flex-wrap justify-center gap-3">
          <ButtonLink to="/rewards" size="lg">
            Join rewards
          </ButtonLink>
          <ButtonLink to="/build" variant="outline" size="lg">
            Build a burger
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}

export function Home() {
  useDocumentTitle('')
  return (
    <>
      <Hero />
      <Crave />
      <PhotoStrip />
      <Adventure />
      <TopPicks />
      <NewInTown />
      <BuilderTeaser />
      <Reviews />
      <Ticker words={TICKER} className="mt-24" />
      <FuelUp />
    </>
  )
}

