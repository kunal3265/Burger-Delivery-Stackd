# Burger delivery

Stackd: a single-brand burger site in ketchup red, cream and ink. The home
page opens on a red hero with a giant condensed wordmark over a line-art corner
shop (the brand name painted on its roof sign), a scalloped edge and a
"Find location" button, then a crave marquee, a photo strip, a flavour
adventure band, top stacks, a wavy "new stack in town" ribbon over a photo
collage, a build-your-burger teaser, a shuffling pile of reviews, a skewed menu
ticker and a "fuel up" sign-off. Behind it:

- **Menu** (`/menu`): category, plant based and spicy filters plus search, all
  kept in the URL. Each item opens a dialog for combo, extra patty, a note for
  the grill and quantity.
- **Build a burger** (`/build`): bun, protein and patty count, cheese, up to
  six toppings and a sauce, with an illustrated stack that rebuilds layer by
  layer and a live price and calorie count. The current build survives reload.
- **Locations** (`/locations`): search by city or PIN, filters (open now,
  drive-thru, open late, delivery, catering), an illustrated map with pins and
  "Order from here", which sets the store used by checkout and the nav.
- **Rewards** (`/rewards`): join form (posts to the Worker), points balance,
  tiers with progress, a rewards catalogue, a wallet of redeemed rewards you
  can drop into the bag, and points history. Orders earn points.
- **Catering** (`/catering`): three packages, a guest-count estimate, a quote
  request form with two days' notice (posts to the Worker) and an FAQ.
- **Checkout** (`/checkout`): pickup or delivery, store, address, time slot,
  rider tip and a demo payment choice. No card details are collected.
- **Order tracking** (`/orders/:reference`) and **Your orders** (`/orders`):
  a two-minute demo journey from placed to picked up or delivered, receipt and
  one-tap reorder.
- A 404 page and a live style guide at
  [`/styleguide`](http://localhost:5313/styleguide), linked from the footer.

## Run it

```sh
bun install
bun run dev        # http://localhost:5313 (Vite + the Worker in workerd)
bun run build      # dist/client (assets) + dist/burger_delivery/index.js (Worker)
bun run typecheck
```

## Edit it

- **`src/data.ts` holds every string, price and record.** Start there.
  - `IMAGES`: every photo goes through this map. The images in
    `public/images/` are generated placeholders: swap in your own
    photography at the same aspect ratio (product cut-outs are transparent
    WebP) and change the path here.
  - `SITE`: name, contact, delivery fee, free delivery threshold, fee and tax
    rates, points per ₹100.
  - `MENU`, `CATEGORIES`, `COMBO`, `EXTRA_PATTY`: the menu.
  - `BUILDER`: buns, proteins, cheeses, toppings, sauces and their prices.
  - `STORES`: addresses, hours, features and map pin positions (0 to 100).
  - `TIERS`, `REWARDS`: the loyalty programme.
  - `CATERING_PACKAGES`, `CATERING_FAQ`, `REVIEWS`, `HOME`: everything else.
- `src/shared/pricing.ts` and `src/shared/validation.ts` are shared by the
  pages and the Worker, so the price the bag shows is the price the server
  computes.
- Tokens (colours, radii, shadows, motion) live in `@theme` in
  `src/styles.css`. Components are in `src/components/`, pages in
  `src/pages/`.

## State and the Worker

The bag, chosen store, orders, current build and rewards account live in
`localStorage` (keys under `stackd.*` in `src/lib/store.tsx`). The Worker
(`src/worker/index.ts`) validates and prices every form and stores nothing:

| Route | Good input | Bad input |
| --- | --- | --- |
| `GET /api/health` | `200 { ok: true }` | |
| `POST /api/orders` | `201` with reference and totals | `400` not JSON, `422` field errors |
| `POST /api/catering` | `201` with reference and estimate | `400`, `422` |
| `POST /api/rewards/join` | `201` with member id | `400`, `422` |
| `POST /api/newsletter` | `201` | `400`, `422` |
| any other `/api/*` | | `404` JSON |

Wire these to your POS, email provider or a D1 table when you go live.
