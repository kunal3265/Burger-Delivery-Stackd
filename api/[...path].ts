import { handle } from 'hono/vercel'

import { createApi } from '../src/worker/app'

// Vercel serves the static client from dist/ and runs the API here.
export const config = { runtime: 'edge' }

export default handle(createApi())
