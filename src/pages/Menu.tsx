import { ArrowRight, Search, SearchX } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router'

import { Button, ButtonLink } from '../components/Button'
import { MenuCard } from '../components/Cards'
import { EmptyState, PageHero } from '../components/Display'
import { Chip } from '../components/Form'
import { ItemDialog } from '../components/ItemDialog'
import { useToast } from '../components/Overlay'
import { CATEGORIES, MENU, type CategoryId, type MenuItem } from '../data'
import { useDocumentTitle } from '../lib/hooks'
import { useStore } from '../lib/store'

export function MenuPage() {
  useDocumentTitle('Menu')
  const [params, setParams] = useSearchParams()
  const category = (params.get('c') as CategoryId | null) ?? null
  const query = params.get('q') ?? ''
  const veg = params.get('veg') === '1'
  const spicy = params.get('spicy') === '1'
  const [open, setOpen] = useState<MenuItem | null>(null)
  const { addItem, setBagOpen } = useStore()
  const toast = useToast()

  const set = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return MENU.filter((m) => (!category || m.category === category) && (!veg || m.tags.includes('veg')) && (!spicy || m.tags.includes('spicy')) && (!q || `${m.name} ${m.description}`.toLowerCase().includes(q)))
  }, [category, query, veg, spicy])

  const groups = CATEGORIES.map((c) => ({ ...c, items: results.filter((m) => m.category === c.id) })).filter((g) => g.items.length)

  return (
    <>
      <PageHero kicker="Smashed to order, every time" title="The menu" body="Everything is cooked when you order it. Tap any item to make it a combo, add a patty or leave a note for the grill." />
      <div className="container-page mt-20">
        <div className="sticky top-[clamp(84px,7.4vw,108px)] z-30 -mx-2 flex flex-col gap-3 rounded-[var(--radius-md)] bg-cream/95 px-2 py-3 backdrop-blur lg:flex-row lg:items-center lg:justify-between">
          <div className="no-scrollbar flex gap-2 overflow-x-auto" role="group" aria-label="Category">
            <Chip selected={!category} onClick={() => set('c', null)} count={MENU.length}>
              All
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip key={c.id} selected={category === c.id} onClick={() => set('c', category === c.id ? null : c.id)} count={MENU.filter((m) => m.category === c.id).length} className="shrink-0">
                {c.label}
              </Chip>
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Chip selected={veg} onClick={() => set('veg', veg ? null : '1')}>
              Plant based
            </Chip>
            <Chip selected={spicy} onClick={() => set('spicy', spicy ? null : '1')}>
              Spicy
            </Chip>
            <label className="relative flex min-w-0 flex-1 sm:flex-none">
              <span className="sr-only">Search the menu</span>
              <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
              <input type="search" value={query} onChange={(e) => set('q', e.target.value || null)} placeholder="Search the menu" className="h-10 w-full rounded-[var(--radius-sm)] border-2 border-bun-2 bg-white pr-3 pl-10 text-[15px] focus:border-ink focus:outline-none sm:w-60" />
            </label>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          {results.length} items shown
        </p>

        {groups.length === 0 ? (
          <div className="mt-10">
            <EmptyState
              icon={<SearchX aria-hidden />}
              title="Nothing on the grill"
              body="No items match those filters. Try a different word or clear the filters."
              action={
                <Button variant="ink" onClick={() => setParams(new URLSearchParams(), { replace: true })}>
                  Clear filters
                </Button>
              }
            />
          </div>
        ) : (
          groups.map((g) => (
            <section key={g.id} aria-labelledby={`cat-${g.id}`} className="mt-12">
              <div className="mb-6 flex flex-col gap-1 border-b-2 border-ink pb-3 sm:flex-row sm:items-end sm:justify-between">
                <h2 id={`cat-${g.id}`} className="display text-[clamp(40px,5vw,64px)]">
                  {g.label}
                </h2>
                <p className="text-[15px] text-muted">{g.blurb}</p>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {g.items.map((m) => (
                  <MenuCard
                    key={m.id}
                    item={m}
                    onOpen={() => setOpen(m)}
                    onQuickAdd={() => {
                      addItem(m.id)
                      toast(
                        `${m.name} added`,
                        <button type="button" className="on-ink h-9 rounded-[10px] bg-ketchup px-3 text-[14px] font-semibold text-cream hover:bg-ketchup-2" onClick={() => setBagOpen(true)}>
                          View bag
                        </button>,
                      )
                    }}
                  />
                ))}
              </div>
            </section>
          ))
        )}

        <div className="on-red mt-16 flex flex-col items-start justify-between gap-6 rounded-[var(--radius-lg)] bg-ketchup p-8 text-cream sm:flex-row sm:items-center sm:p-10">
          <div>
            <h2 className="display text-[clamp(36px,4vw,56px)]">Not seeing your stack?</h2>
            <p className="mt-2 text-[16px] text-on-red-muted">Build it from the bun up: four proteins deep, six toppings high.</p>
          </div>
          <ButtonLink to="/build" variant="ink" size="lg" iconRight={<ArrowRight aria-hidden />}>
            Build a burger
          </ButtonLink>
        </div>
      </div>
      <ItemDialog item={open} onClose={() => setOpen(null)} />
    </>
  )
}
