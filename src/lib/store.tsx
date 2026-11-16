import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'

import { REWARDS, SITE, STORES, type Store } from '../data'
import type { Build, CartLine, Fulfilment, Totals } from '../shared/pricing'

// Everything the site remembers lives in localStorage under these keys:
// the bag, the chosen store, past orders and the rewards account.
const KEYS = { bag: 'stackd.bag', store: 'stackd.store', orders: 'stackd.orders', member: 'stackd.member', fulfilment: 'stackd.fulfilment' }

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}
function save(key: string, value: unknown) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* private mode: keep it in memory */
  }
}
function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(() => load(key, fallback))
  useEffect(() => save(key, value), [key, value])
  return [value, setValue] as const
}

export interface Order {
  reference: string
  placedAt: string
  readyInMinutes: number
  fulfilment: Fulfilment
  storeId: string
  name: string
  lines: CartLine[]
  totals: Totals
  pointsEarned: number
}

export interface WalletReward {
  code: string
  rewardId: string
  at: string
  used: boolean
}

export interface Member {
  memberId: string
  name: string
  email: string
  points: number
  lifetime: number
  joinedAt: string
  history: { id: string; label: string; points: number; at: string }[]
  wallet: WalletReward[]
}

type ItemOptions = { combo?: boolean; extraPatty?: boolean; note?: string }

interface StoreValue {
  bag: CartLine[]
  bagCount: number
  bagOpen: boolean
  setBagOpen: (open: boolean) => void
  addItem: (itemId: string, qty?: number, options?: ItemOptions) => void
  addBuild: (build: Build, name: string, qty?: number) => void
  addReward: (code: string) => 'added' | 'already' | 'missing'
  setQty: (key: string, qty: number) => void
  removeLine: (key: string) => void
  clearBag: () => void
  fulfilment: Fulfilment
  setFulfilment: (f: Fulfilment) => void
  store: Store | null
  setStoreId: (id: string | null) => void
  orders: Order[]
  recordOrder: (order: Omit<Order, 'pointsEarned'>) => Order
  member: Member | null
  join: (m: { memberId: string; name: string; email: string }) => void
  leave: () => void
  redeem: (rewardId: string) => WalletReward | null
}

const Ctx = createContext<StoreValue | null>(null)

const uid = () => Math.random().toString(36).slice(2, 10)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [bag, setBag] = usePersisted<CartLine[]>(KEYS.bag, [])
  const [storeId, setStoreId] = usePersisted<string | null>(KEYS.store, null)
  const [orders, setOrders] = usePersisted<Order[]>(KEYS.orders, [])
  const [member, setMember] = usePersisted<Member | null>(KEYS.member, null)
  const [fulfilment, setFulfilment] = usePersisted<Fulfilment>(KEYS.fulfilment, 'pickup')
  const [bagOpen, setBagOpen] = useState(false)

  const addItem = useCallback(
    (itemId: string, qty = 1, o: ItemOptions = {}) =>
      setBag((prev) => {
        const combo = !!o.combo
        const extraPatty = !!o.extraPatty
        const note = o.note?.trim() || undefined
        const same = prev.find((l) => l.kind === 'item' && l.itemId === itemId && l.combo === combo && l.extraPatty === extraPatty && l.note === note)
        if (same) return prev.map((l) => (l === same ? { ...l, qty: Math.min(20, l.qty + qty) } : l)) as CartLine[]
        return [...prev, { key: uid(), kind: 'item', itemId, qty, combo, extraPatty, note }]
      }),
    [setBag],
  )
  const addBuild = useCallback((build: Build, name: string, qty = 1) => setBag((prev) => [...prev, { key: uid(), kind: 'build', build, name, qty }]), [setBag])

  const addReward = useCallback(
    (code: string) => {
      const reward = member?.wallet.find((w) => w.code === code && !w.used)
      if (!reward) return 'missing' as const
      if (bag.some((l) => l.kind === 'reward')) return 'already' as const
      setBag((prev) => [...prev, { key: `reward:${code}`, kind: 'reward', rewardId: reward.rewardId, qty: 1 }])
      return 'added' as const
    },
    [bag, member, setBag],
  )

  const setQty = useCallback((key: string, qty: number) => setBag((prev) => prev.map((l) => (l.key === key && l.kind !== 'reward' ? { ...l, qty: Math.max(1, Math.min(20, qty)) } : l)) as CartLine[]), [setBag])
  const removeLine = useCallback((key: string) => setBag((prev) => prev.filter((l) => l.key !== key)), [setBag])
  const clearBag = useCallback(() => setBag([]), [setBag])

  const recordOrder = useCallback(
    (o: Omit<Order, 'pointsEarned'>) => {
      const pointsEarned = member ? o.totals.points : 0
      const order = { ...o, pointsEarned }
      setOrders((prev) => [order, ...prev].slice(0, 25))
      if (member) {
        const usedCodes = o.lines.filter((l) => l.kind === 'reward').map((l) => l.key.replace('reward:', ''))
        setMember({
          ...member,
          points: member.points + pointsEarned,
          lifetime: member.lifetime + pointsEarned,
          history: [{ id: uid(), label: `Order ${o.reference}`, points: pointsEarned, at: o.placedAt }, ...member.history].slice(0, 30),
          wallet: member.wallet.map((w) => (usedCodes.includes(w.code) ? { ...w, used: true } : w)),
        })
      }
      return order
    },
    [member, setMember, setOrders],
  )

  const join = useCallback(
    (m: { memberId: string; name: string; email: string }) => {
      const at = new Date().toISOString()
      setMember({ ...m, points: SITE.welcomePoints, lifetime: SITE.welcomePoints, joinedAt: at, history: [{ id: uid(), label: 'Welcome bonus', points: SITE.welcomePoints, at }], wallet: [] })
    },
    [setMember],
  )
  const leave = useCallback(() => {
    setMember(null)
    setBag((prev) => prev.filter((l) => l.kind !== 'reward'))
  }, [setBag, setMember])

  const redeem = useCallback(
    (rewardId: string) => {
      const reward = REWARDS.find((r) => r.id === rewardId)
      if (!member || !reward || member.points < reward.cost) return null
      const item: WalletReward = { code: `${reward.id.slice(2, 5).toUpperCase()}-${uid().slice(0, 5).toUpperCase()}`, rewardId, at: new Date().toISOString(), used: false }
      setMember({
        ...member,
        points: member.points - reward.cost,
        history: [{ id: uid(), label: reward.name, points: -reward.cost, at: item.at }, ...member.history].slice(0, 30),
        wallet: [item, ...member.wallet],
      })
      return item
    },
    [member, setMember],
  )

  const value = useMemo<StoreValue>(
    () => ({
      bag,
      bagCount: bag.reduce((s, l) => s + l.qty, 0),
      bagOpen,
      setBagOpen,
      addItem,
      addBuild,
      addReward,
      setQty,
      removeLine,
      clearBag,
      fulfilment,
      setFulfilment,
      store: STORES.find((s) => s.id === storeId) ?? null,
      setStoreId,
      orders,
      recordOrder,
      member,
      join,
      leave,
      redeem,
    }),
    [bag, bagOpen, addItem, addBuild, addReward, setQty, removeLine, clearBag, fulfilment, setFulfilment, storeId, setStoreId, orders, recordOrder, member, join, leave, redeem],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const v = useContext(Ctx)
  if (!v) throw new Error('useStore outside StoreProvider')
  return v
}

// ---------------------------------------------------------------------------
// Store hours

export function isOpen(store: Store, now = new Date()) {
  const h = now.getHours() + now.getMinutes() / 60
  return (h >= store.opens && h < store.closes) || (store.closes > 24 && h < store.closes - 24)
}

export function formatHour(h: number) {
  const hh = Math.floor(h) % 24
  const mm = Math.round((h % 1) * 60)
  const suffix = hh >= 12 ? 'pm' : 'am'
  const twelve = hh % 12 === 0 ? 12 : hh % 12
  return `${twelve}${mm ? `:${String(mm).padStart(2, '0')}` : ''}${suffix}`
}

export function hoursLabel(store: Store) {
  return `${formatHour(store.opens)} to ${formatHour(store.closes)}`
}
