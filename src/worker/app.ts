import { Hono, type Context } from 'hono'

import { CATERING_PACKAGES, STORES } from '../data'
import { cateringEstimate, totals, type CartLine } from '../shared/pricing'
import { validateCatering, validateEmailOnly, validateJoin, validateOrder, type FieldErrors } from '../shared/validation'

// The API the site posts its forms to. Used twice: by the Cloudflare Worker
// (src/worker/index.ts) and by the Vercel edge function (api/[...path].ts).
// It validates and prices every form, and stores nothing: wire these routes to
// your POS, email provider or a D1 table when you go live.
export type Env = { ASSETS: Fetcher }

export function createApi() {
  const app = new Hono<{ Bindings: Env }>()

  const reference = (prefix: string) =>
    `${prefix}-${Math.random().toString(36).slice(2, 6).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`

  async function readJson(c: Context): Promise<Record<string, unknown> | null> {
    if (!c.req.header('content-type')?.includes('application/json')) return null
    const body = await c.req.json().catch(() => null)
    return body && typeof body === 'object' && !Array.isArray(body) ? (body as Record<string, unknown>) : null
  }

  const invalid = (c: Context, fieldErrors: FieldErrors) => c.json({ error: 'Check the highlighted fields.', fieldErrors }, 422)

  app.get('/api/health', (c) => c.json({ ok: true }))

  app.post('/api/orders', async (c) => {
    const body = await readJson(c)
    if (!body) return c.json({ error: 'Send the order as JSON.' }, 400)
    const errors = validateOrder(body)
    if (Object.keys(errors).length) return invalid(c, errors)
    const lines = body.lines as CartLine[]
    const priced = totals(lines, body.fulfilment as 'pickup' | 'delivery', body.tip as number)
    const store = STORES.find((s) => s.id === body.storeId)!
    const minutes = body.fulfilment === 'delivery' ? 28 : 14
    return c.json(
      { ok: true, reference: reference('STK'), totals: priced, store: store.id, readyInMinutes: minutes, placedAt: new Date().toISOString() },
      201,
    )
  })

  app.post('/api/catering', async (c) => {
    const body = await readJson(c)
    if (!body) return c.json({ error: 'Send the request as JSON.' }, 400)
    const errors = validateCatering(body)
    if (Object.keys(errors).length) return invalid(c, errors)
    const pkg = CATERING_PACKAGES.find((p) => p.id === body.packageId)!
    return c.json({ ok: true, reference: reference('CAT'), estimate: cateringEstimate(pkg.perGuest, Number(body.guests)) }, 201)
  })

  app.post('/api/rewards/join', async (c) => {
    const body = await readJson(c)
    if (!body) return c.json({ error: 'Send the form as JSON.' }, 400)
    const errors = validateJoin(body)
    if (Object.keys(errors).length) return invalid(c, errors)
    return c.json({ ok: true, memberId: reference('MBR') }, 201)
  })

  app.post('/api/newsletter', async (c) => {
    const body = await readJson(c)
    if (!body) return c.json({ error: 'Send the form as JSON.' }, 400)
    const errors = validateEmailOnly(body)
    if (Object.keys(errors).length) return invalid(c, errors)
    return c.json({ ok: true }, 201)
  })

  app.all('/api/*', (c) => c.json({ error: 'Not found.' }, 404))

  return app
}
