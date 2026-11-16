// Validation shared by the forms (instant feedback) and the Worker (the
// source of truth). Each validator returns field errors keyed by field name.
import { CATERING_PACKAGES, MENU, REWARDS, STORES } from '../data'
import { resolveBuild, type CartLine, type Fulfilment } from './pricing'

export type FieldErrors = Record<string, string>

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

export function checkName(v: unknown, errors: FieldErrors, field = 'name') {
  const s = str(v)
  if (s.length < 2) errors[field] = 'Enter your name.'
  else if (s.length > 60) errors[field] = 'Keep it under 60 characters.'
}
export function checkEmail(v: unknown, errors: FieldErrors, field = 'email') {
  if (!EMAIL.test(str(v))) errors[field] = 'Enter a valid email address.'
}
export function checkPhone(v: unknown, errors: FieldErrors, field = 'phone') {
  const digits = str(v).replace(/\D/g, '')
  if (digits.length < 10 || digits.length > 15) errors[field] = 'Enter a phone number with area code.'
}

// ---------------------------------------------------------------------------
// Orders

export interface OrderInput {
  fulfilment: Fulfilment
  storeId: string
  name: string
  phone: string
  email: string
  street?: string
  zip?: string
  time: string
  tip: number
  payment: 'card' | 'store'
  lines: CartLine[]
}

function validLine(l: unknown): l is CartLine {
  if (!l || typeof l !== 'object') return false
  const line = l as Record<string, unknown>
  if (typeof line.key !== 'string') return false
  if (line.kind === 'reward') return REWARDS.some((r) => r.id === line.rewardId) && line.qty === 1
  if (!Number.isInteger(line.qty) || (line.qty as number) < 1 || (line.qty as number) > 20) return false
  if (line.kind === 'item') return MENU.some((m) => m.id === line.itemId) && typeof line.combo === 'boolean' && typeof line.extraPatty === 'boolean'
  if (line.kind === 'build') {
    const b = line.build as Record<string, unknown> | undefined
    if (!b || !Array.isArray(b.toppings) || typeof line.name !== 'string') return false
    return resolveBuild(b as never) !== null
  }
  return false
}

export function validateOrder(input: Partial<OrderInput>): FieldErrors {
  const e: FieldErrors = {}
  if (input.fulfilment !== 'pickup' && input.fulfilment !== 'delivery') e.fulfilment = 'Choose pickup or delivery.'
  const store = STORES.find((s) => s.id === input.storeId)
  if (!store) e.storeId = 'Choose a store.'
  else if (input.fulfilment === 'delivery' && !store.features.includes('delivery')) e.storeId = `${store.name} does not deliver. Pick another store or choose pickup.`
  checkName(input.name, e)
  checkPhone(input.phone, e)
  checkEmail(input.email, e)
  if (input.fulfilment === 'delivery') {
    if (str(input.street).length < 5) e.street = 'Enter a street address.'
    if (!/^\d{6}$/.test(str(input.zip))) e.zip = 'Enter a 6-digit PIN code.'
  }
  if (input.time !== 'asap' && !/^([01]\d|2[0-3]):[0-5]\d$/.test(str(input.time))) e.time = 'Choose a time.'
  if (typeof input.tip !== 'number' || input.tip < 0 || input.tip > 500) e.tip = 'Tip must be between ₹0 and ₹500.'
  if (input.payment !== 'card' && input.payment !== 'store') e.payment = 'Choose how to pay.'
  const lines = Array.isArray(input.lines) ? input.lines : []
  if (!lines.length) e.lines = 'Your bag is empty.'
  else if (lines.length > 30 || !lines.every(validLine)) e.lines = 'Something in your bag is no longer on the menu. Remove it and try again.'
  else if (lines.filter((l) => l.kind === 'reward').length > 1) e.lines = 'Use one reward per order.'
  else if (lines.every((l) => l.kind === 'reward')) e.lines = 'Add at least one paid item to use a reward.'
  return e
}

// ---------------------------------------------------------------------------
// Catering

export interface CateringInput {
  name: string
  email: string
  phone: string
  company?: string
  date: string
  guests: number
  packageId: string
  storeId: string
  fulfilment: Fulfilment
  notes?: string
}

/** The earliest event date we accept: two days from `now`, as YYYY-MM-DD. */
export function earliestCateringDate(now = new Date()) {
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function validateCatering(input: Partial<CateringInput>, now = new Date()): FieldErrors {
  const e: FieldErrors = {}
  checkName(input.name, e)
  checkEmail(input.email, e)
  checkPhone(input.phone, e)
  if (str(input.company).length > 80) e.company = 'Keep it under 80 characters.'
  const date = str(input.date)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) e.date = 'Choose a date.'
  else if (date < earliestCateringDate(now)) e.date = 'We need at least two days of notice.'
  const pkg = CATERING_PACKAGES.find((p) => p.id === input.packageId)
  if (!pkg) e.packageId = 'Choose a package.'
  const guests = Number(input.guests)
  if (!Number.isInteger(guests) || guests < 1) e.guests = 'Enter the number of guests.'
  else if (pkg && (guests < pkg.minGuests || guests > pkg.maxGuests)) e.guests = `${pkg.name} serves ${pkg.minGuests} to ${pkg.maxGuests} guests.`
  const store = STORES.find((s) => s.id === input.storeId)
  if (!store) e.storeId = 'Choose a store.'
  else if (!store.features.includes('catering')) e.storeId = `${store.name} does not cater. Pick another store.`
  if (input.fulfilment !== 'pickup' && input.fulfilment !== 'delivery') e.fulfilment = 'Choose pickup or delivery.'
  if (str(input.notes).length > 500) e.notes = 'Keep notes under 500 characters.'
  return e
}

// ---------------------------------------------------------------------------
// Rewards and newsletter

export interface JoinInput {
  name: string
  email: string
  birthMonth?: number | null
  storeId?: string
  terms: boolean
}

export function validateJoin(input: Partial<JoinInput>): FieldErrors {
  const e: FieldErrors = {}
  checkName(input.name, e)
  checkEmail(input.email, e)
  if (input.birthMonth != null && (!Number.isInteger(input.birthMonth) || input.birthMonth < 1 || input.birthMonth > 12)) e.birthMonth = 'Choose a month.'
  if (input.storeId && !STORES.some((s) => s.id === input.storeId)) e.storeId = 'Choose a store.'
  if (input.terms !== true) e.terms = 'Accept the rewards terms to join.'
  return e
}

export function validateEmailOnly(input: { email?: unknown }): FieldErrors {
  const e: FieldErrors = {}
  checkEmail(input.email, e)
  return e
}
