import { MapPinOff, Search } from 'lucide-react'
import { motion } from 'motion/react'
import { useMemo, useRef, useState } from 'react'

import { Button } from '../components/Button'
import { StoreCard } from '../components/Cards'
import { EmptyState, PageHero } from '../components/Display'
import { Chip } from '../components/Form'
import { useToast } from '../components/Overlay'
import { FEATURE_LABELS, STORES, type StoreFeature } from '../data'
import { cx, useDocumentTitle } from '../lib/hooks'
import { isOpen, useStore } from '../lib/store'

const FILTERS: StoreFeature[] = ['drive-thru', 'late-night', 'delivery', 'catering']

function StoreMap({ stores, active, onPick }: { stores: typeof STORES; active: string | null; onPick: (id: string) => void }) {
  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-[var(--radius-xl)] border-2 border-ink bg-bun sm:aspect-square">
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full" aria-hidden preserveAspectRatio="none">
        <defs>
          <pattern id="blocks" width="9" height="9" patternUnits="userSpaceOnUse">
            <rect width="9" height="9" fill="none" stroke="#e3d7b8" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#blocks)" />
        <path d="M-5 64 C 15 58, 25 70, 40 63 S 62 55, 75 62 S 95 70, 105 64" fill="none" stroke="#bcd7e6" strokeWidth="5" />
        <path d="M-5 64 C 15 58, 25 70, 40 63 S 62 55, 75 62 S 95 70, 105 64" fill="none" stroke="#0b0b0b" strokeWidth="0.4" strokeDasharray="1.2 1.4" />
        <path d="M52 -2 L 50 30 L 47 70 L 30 102" fill="none" stroke="#0b0b0b" strokeWidth="1.6" />
        <path d="M52 -2 L 50 30 L 47 70 L 30 102" fill="none" stroke="#f5b31b" strokeWidth="0.6" />
        <path d="M-2 30 L 50 30 L 102 24" fill="none" stroke="#0b0b0b" strokeWidth="1.2" />
        <path d="M70 -2 L 66 50 L 72 102" fill="none" stroke="#0b0b0b" strokeWidth="1" />
        <path d="M-2 82 L 104 76" fill="none" stroke="#0b0b0b" strokeWidth="0.8" />
        <ellipse cx="30" cy="52" rx="8" ry="5" fill="#cfe3b4" stroke="#0b0b0b" strokeWidth="0.4" />
        <ellipse cx="78" cy="38" rx="6" ry="4" fill="#cfe3b4" stroke="#0b0b0b" strokeWidth="0.4" />
      </svg>
      <span className="condensed absolute top-[54%] left-[6%] text-[13px] text-muted">Krishna River</span>
      <span className="condensed absolute top-[46%] left-[22%] text-[13px] text-muted">Gandhi Hill</span>
      {stores.map((s) => {
        const on = s.id === active
        return (
          <motion.button
            key={s.id}
            type="button"
            onClick={() => onPick(s.id)}
            aria-label={`${s.name} on the map`}
            aria-pressed={on}
            className="group absolute z-[1] flex -translate-x-1/2 -translate-y-full flex-col items-center focus-visible:outline-none"
            style={{ left: `${s.x}%`, top: `${s.y + 8}%`, zIndex: on ? 3 : 1 }}
            animate={{ scale: on ? 1.15 : 1 }}
            whileHover={{ scale: 1.15 }}
          >
            <span className={cx('condensed mb-1 rounded-[8px] px-2 py-0.5 text-[14px] whitespace-nowrap shadow-[var(--shadow-hard-sm)] transition-colors group-focus-visible:outline-3 group-focus-visible:outline-offset-2 group-focus-visible:outline-ink', on ? 'bg-ink text-cream' : 'bg-cream text-ink')}>{s.name}</span>
            <svg viewBox="0 0 28 36" className="h-9 w-7 drop-shadow-[2px_2px_0_#0b0b0b]" aria-hidden>
              <path d="M14 35C6 24 2 18 2 12a12 12 0 0 1 24 0c0 6-4 12-12 23z" fill={on ? '#0b0b0b' : '#d7141a'} stroke="#0b0b0b" strokeWidth="2" />
              <path d="M8 12c0-3 3-5 6-5s6 2 6 5zM7.5 14h13M8.5 16h11c0 1.5-1 2.5-3 2.5h-5c-2 0-3-1-3-2.5z" fill="#fdf8e9" />
            </svg>
          </motion.button>
        )
      })}
    </div>
  )
}

export function LocationsPage() {
  useDocumentTitle('Locations')
  const [query, setQuery] = useState('')
  const [filters, setFilters] = useState<StoreFeature[]>([])
  const [openNow, setOpenNow] = useState(false)
  const [active, setActive] = useState<string | null>(null)
  const { store, setStoreId } = useStore()
  const toast = useToast()
  const listRef = useRef<HTMLUListElement>(null)

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    return STORES.filter((s) => (!q || `${s.name} ${s.city} ${s.state} ${s.zip} ${s.street}`.toLowerCase().includes(q)) && filters.every((f) => s.features.includes(f)) && (!openNow || isOpen(s)))
  }, [query, filters, openNow])

  const pick = (id: string) => {
    setActive(id)
    const el = listRef.current?.querySelector<HTMLElement>(`[data-store="${id}"]`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }

  return (
    <>
      <PageHero kicker={`${STORES.length} shops and counting`} title="Find a Stackd" body="Pick your store once and we will use it for pickup, delivery and catering. Every shop smashes the same patties the same way." />
      <div className="container-page mt-20 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <div className="flex flex-col gap-5">
          <form
            role="search"
            onSubmit={(e) => {
              e.preventDefault()
              if (results[0]) pick(results[0].id)
            }}
            className="flex gap-2"
          >
            <label className="relative flex-1">
              <span className="sr-only">Locality, city or PIN</span>
              <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted" aria-hidden />
              <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Locality, city or PIN" className="h-14 w-full rounded-[var(--radius-sm)] border-2 border-ink bg-white pr-4 pl-12 text-[17px] focus:shadow-[var(--shadow-hard-sm)] focus:outline-none" />
            </label>
            <Button type="submit" size="lg" className="h-14">
              Search
            </Button>
          </form>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Filter stores">
            <Chip selected={openNow} onClick={() => setOpenNow(!openNow)}>
              Open now
            </Chip>
            {FILTERS.map((f) => (
              <Chip key={f} selected={filters.includes(f)} onClick={() => setFilters((p) => (p.includes(f) ? p.filter((x) => x !== f) : [...p, f]))}>
                {FEATURE_LABELS[f]}
              </Chip>
            ))}
          </div>
          <p className="text-[14px] text-muted" aria-live="polite">
            {results.length === 1 ? '1 store' : `${results.length} stores`}
            {store ? `. Your store is ${store.name}.` : '.'}
          </p>
          {results.length === 0 ? (
            <EmptyState
              icon={<MapPinOff aria-hidden />}
              title="No stores match"
              body="Try a nearby locality or PIN, or loosen the filters."
              action={
                <Button
                  variant="ink"
                  onClick={() => {
                    setQuery('')
                    setFilters([])
                    setOpenNow(false)
                  }}
                >
                  Show all stores
                </Button>
              }
            />
          ) : (
            <ul ref={listRef} className="flex flex-col gap-4">
              {results.map((s) => (
                <li key={s.id} data-store={s.id} className="scroll-mt-32">
                  <StoreCard
                    store={s}
                    active={active === s.id}
                    selected={store?.id === s.id}
                    onFocusMap={() => setActive(s.id)}
                    onSelect={() => {
                      setStoreId(s.id)
                      setActive(s.id)
                      toast(`${s.name} is now your store`)
                    }}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="order-first lg:order-none">
          <div className="lg:sticky lg:top-[120px]">
            <StoreMap stores={results} active={active} onPick={pick} />
          </div>
        </div>
      </div>
    </>
  )
}
