import { handle } from 'hono/vercel'

import { createApi } from '../../src/worker/app'

export const config = { runtime: 'edge' }

export default handle(createApi())
