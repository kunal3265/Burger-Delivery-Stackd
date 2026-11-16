// Pricing shared by the browser and the Worker, so the bag, checkout and the
// server always agree. Prices come from `src/data.ts`.
import { BUILDER, COMBO, EXTRA_PATTY, MENU, REWARDS, SITE, type Ingredient } from '../data'

export interface Build {
  bun: string
  protein: string
  patties: number
  cheese: string
  toppings: string[]
  sauce: string
}

export type CartLine =
  | { key: string; kind: 'item'; itemId: string; qty: number; combo: boolean; extraPatty: boolean; note?: string }
  | { key: string; kind: 'build'; build: Build; qty: number; name: string }
  | { key: string; kind: 'reward'; rewardId: string; qty: 1 }

export type Fulfilment = 'pickup' | 'delivery'

const round2 = (n: number) => Math.round(n * 100) / 100

const find = (list: Ingredient[], id: string) => list.find((i) => i.id === id)

/** Returns the ingredients of a build or null when any id is unknown. */
export function resolveBuild(b: Build) {
  const bun = find(BUILDER.buns, b.bun)
  const protein = find(BUILDER.proteins, b.protein)
  const cheese = find(BUILDER.cheeses, b.cheese)
  const sauce = find(BUILDER.sauces, b.sauce)
  const toppings = b.toppings.map((t) => find(BUILDER.toppings, t))
  if (!bun || !protein || !cheese || !sauce || toppings.some((t) => !t)) return null
  if (!Number.isInteger(b.patties) || b.patties < 1 || b.patties > BUILDER.maxPatties) return null
  if (b.toppings.length > BUILDER.maxToppings || new Set(b.toppings).size !== b.toppings.length) return null
  return { bun, protein, cheese, sauce, toppings: toppings as Ingredient[] }
}

export function buildPrice(b: Build): number {
  const r = resolveBuild(b)
  if (!r) return NaN
  const perPatty = r.protein.price + (r.cheese.price || 0)
  return round2(BUILDER.basePrice + r.bun.price + perPatty * b.patties + r.sauce.price + r.toppings.reduce((s, t) => s + t.price, 0))
}

export function buildKcal(b: Build): number {
  const r = resolveBuild(b)
  if (!r) return 0
  return r.bun.kcal + (r.protein.kcal + r.cheese.kcal) * b.patties + r.sauce.kcal + r.toppings.reduce((s, t) => s + t.kcal, 0)
}

export function lineUnitPrice(line: CartLine): number {
  if (line.kind === 'reward') return 0
  if (line.kind === 'build') return buildPrice(line.build)
  const item = MENU.find((m) => m.id === line.itemId)
  if (!item) return NaN
  let price = item.price
  if (line.combo && item.comboable) price += COMBO.price
  if (line.extraPatty && item.comboable) price += EXTRA_PATTY.price
  return round2(price)
}

export function lineName(line: CartLine): string {
  if (line.kind === 'build') return line.name
  if (line.kind === 'reward') return REWARDS.find((r) => r.id === line.rewardId)?.name ?? 'Reward'
  return MENU.find((m) => m.id === line.itemId)?.name ?? 'Item'
}

export interface Totals {
  subtotal: number
  delivery: number
  service: number
  tax: number
  tip: number
  total: number
  points: number
  freeDeliveryLeft: number
}

export function totals(lines: CartLine[], fulfilment: Fulfilment, tip = 0): Totals {
  const subtotal = round2(lines.reduce((s, l) => s + lineUnitPrice(l) * l.qty, 0))
  const freeDeliveryLeft = Math.max(0, round2(SITE.freeDeliveryOver - subtotal))
  const delivery = fulfilment === 'delivery' && subtotal > 0 && freeDeliveryLeft > 0 ? SITE.deliveryFee : 0
  const service = round2(subtotal * SITE.serviceFeeRate)
  const tax = round2((subtotal + service) * SITE.taxRate)
  const total = round2(subtotal + delivery + service + tax + tip)
  return { subtotal, delivery, service, tax, tip: round2(tip), total, points: Math.floor(subtotal * SITE.pointsPerRupee), freeDeliveryLeft }
}

export function cateringEstimate(perGuest: number, guests: number) {
  const food = round2(perGuest * guests)
  const delivery = food >= 4999 ? 0 : 299
  return { food, delivery, total: round2(food + delivery) }
}

export const money = (n: number) =>
  n.toLocaleString('en-IN', {
    style: 'currency',
    currency: SITE.currency,
    // Whole rupee prices read as ₹149; tax and service keep their paise.
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  })
