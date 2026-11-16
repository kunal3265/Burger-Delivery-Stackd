import { CATERING_PACKAGES, STORES } from '../data'
import { cateringEstimate, totals, type CartLine } from '../shared/pricing'
import { validateCatering, validateEmailOnly, validateJoin, validateOrder } from '../shared/validation'

import type { ApiResult } from './hooks'

// The site normally posts its forms to the Worker. Opened from disk there is no
// server, so these routes are answered in the page with the same validation and
// pricing the Worker uses. Nothing is stored either way.

const reference = (prefix: string) => `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`

export function offlinePostJson<T>(url: string, body: unknown): ApiResult<T> {
  const input = (body && typeof body === 'object' ? body : {}) as Record<string, unknown>
  const ok = (data: unknown) => ({ ok: true, data }) as ApiResult<T>
  const invalid = (fieldErrors: Record<string, string>) => ({ ok: false, error: 'Check the highlighted fields.', fieldErrors }) as ApiResult<T>

  if (url === '/api/orders') {
    const errors = validateOrder(input)
    if (Object.keys(errors).length) return invalid(errors)
    const fulfilment = input.fulfilment as 'pickup' | 'delivery'
    const store = STORES.find((s) => s.id === input.storeId)
    return ok({
      ok: true,
      reference: reference('STK'),
      totals: totals(input.lines as CartLine[], fulfilment, input.tip as number),
      store: store?.id ?? '',
      readyInMinutes: fulfilment === 'delivery' ? 28 : 14,
      placedAt: new Date().toISOString(),
    })
  }

  if (url === '/api/catering') {
    const errors = validateCatering(input)
    if (Object.keys(errors).length) return invalid(errors)
    const pkg = CATERING_PACKAGES.find((p) => p.id === input.packageId)
    if (!pkg) return { ok: false, error: 'Pick a package.' }
    return ok({ ok: true, reference: reference('CAT'), estimate: cateringEstimate(pkg.perGuest, Number(input.guests)) })
  }

  if (url === '/api/rewards/join') {
    const errors = validateJoin(input)
    if (Object.keys(errors).length) return invalid(errors)
    return ok({ ok: true, memberId: reference('MBR') })
  }

  if (url === '/api/newsletter') {
    const errors = validateEmailOnly(input)
    if (Object.keys(errors).length) return invalid(errors)
    return ok({ ok: true })
  }

  return { ok: false, error: 'Not found.' }
}
