import { createApi } from './app'

// The Cloudflare Worker in front of the static site: API routes first, then assets.
const app = createApi()

app.all('*', (c) => c.env.ASSETS.fetch(c.req.raw))

export default app
