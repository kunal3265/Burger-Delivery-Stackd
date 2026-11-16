// Every string, price and record the site shows lives here. Edit this file
// first. The Worker imports the price lists too, so a price changed here is
// the price the server charges.

// ---------------------------------------------------------------------------
// Photography. Every image goes through this map: swap a path for your own
// photo (same aspect ratio) and the whole site follows.

// BASE_URL is './' in the file:// build and '/' everywhere else; some bundlers
// (the Vercel edge function) leave import.meta.env undefined, hence the fallback.
const BASE = import.meta.env?.BASE_URL ?? '/'
const asset = (file: string) => `${BASE}images/${file}`

export const IMAGES = {
  storefront: asset('storefront.webp'),
  handBurger: asset('hand-burger.webp'),
  handChicken: asset('hand-chicken.webp'),
  photoBite: asset('photo-bite.webp'),
  photoFries: asset('photo-fries.webp'),
  photoShake: asset('photo-shake.webp'),
  catering: asset('catering.webp'),
  burgerClassic: asset('burger-classic.webp'),
  burgerDouble: asset('burger-double.webp'),
  burgerChicken: asset('burger-chicken.webp'),
  burgerVeggie: asset('burger-veggie.webp'),
  fries: asset('fries.webp'),
  shake: asset('shake.webp'),
  tenders: asset('tenders.webp'),
  rings: asset('rings.webp'),
  lemonade: asset('lemonade.webp'),
} as const
export type ImageKey = keyof typeof IMAGES

// ---------------------------------------------------------------------------
// Brand and money

export const SITE = {
  name: 'Stackd',
  tagline: 'Burgers built tall',
  heroKicker: 'The',
  heroLine: 'The tallest burger you ever tasted',
  marquee: 'Stack it, the Stackd way. Get ready to stack it, the Stackd way.',
  phone: '+91 8919527406',
  email: 'hello@stackd.example',
  currency: 'INR',
  deliveryFee: 29,
  freeDeliveryOver: 499,
  serviceFeeRate: 0,
  taxRate: 0.05,
  pointsPerRupee: 1,
  welcomePoints: 250,
  socials: [
    { label: 'Instagram', href: 'https://instagram.com' },
    { label: 'TikTok', href: 'https://tiktok.com' },
    { label: 'YouTube', href: 'https://youtube.com' },
  ],
}

export const NAV_LINKS = [
  { to: '/menu', label: 'Menu', note: 'Burgers, chicken, sides, shakes' },
  { to: '/build', label: 'Build a burger', note: 'Stack yours, layer by layer' },
  { to: '/locations', label: 'Locations', note: 'Find the nearest Stackd' },
  { to: '/rewards', label: 'Stackd rewards', note: 'Points on every order' },
  { to: '/catering', label: 'Catering', note: 'Feed 10 to 500' },
  { to: '/orders', label: 'Your orders', note: 'Track and reorder' },
]

// ---------------------------------------------------------------------------
// Menu

export type CategoryId = 'burgers' | 'chicken' | 'plants' | 'sides' | 'shakes'
export const CATEGORIES: { id: CategoryId; label: string; blurb: string }[] = [
  { id: 'burgers', label: 'Burgers', blurb: 'Smashed thin, stacked tall, never frozen.' },
  { id: 'chicken', label: 'Chicken', blurb: 'Buttermilk brined for a full day.' },
  { id: 'plants', label: 'Plants', blurb: 'All of the stack, none of the beef.' },
  { id: 'sides', label: 'Sides', blurb: 'Crinkle, crunch, repeat.' },
  { id: 'shakes', label: 'Shakes & drinks', blurb: 'Spun thick to order.' },
]

export type Tag = 'new' | 'spicy' | 'veg' | 'best'
export const TAG_LABELS: Record<Tag, string> = { new: 'New', spicy: 'Spicy', veg: 'Plant based', best: 'Best seller' }

export interface MenuItem {
  id: string
  name: string
  category: CategoryId
  price: number
  kcal: number
  description: string
  image: ImageKey
  tags: Tag[]
  /** Burgers and chicken can be made a combo (fries + lemonade). */
  comboable?: boolean
}

export const MENU: MenuItem[] = [
  { id: 'classic-stack', name: 'The Classic Stack', category: 'burgers', price: 199, kcal: 820, image: 'burgerClassic', tags: ['best'], comboable: true, description: 'Two smashed patties, American cheese, pickles, red onion, crisp lettuce and Stackd sauce on a sesame brioche.' },
  { id: 'tower', name: 'The Tower', category: 'burgers', price: 319, kcal: 1340, image: 'burgerDouble', tags: ['new'], comboable: true, description: 'Three patties, three slices of cheddar, maple bacon and smoky barbecue glaze. Bring a friend, or don\'t.' },
  { id: 'hot-honey', name: 'Hot Honey Cluck', category: 'chicken', price: 239, kcal: 910, image: 'burgerChicken', tags: ['spicy', 'best'], comboable: true, description: 'Crunchy buttermilk thigh, chilli honey glaze, pickles and tangy slaw on a toasted brioche.' },
  { id: 'tenders', name: 'Crunch Tenders', category: 'chicken', price: 199, kcal: 640, image: 'tenders', tags: [], comboable: true, description: 'Five hand-breaded tenders with a pot of Stackd sauce for dunking.' },
  { id: 'green-stack', name: 'The Green Stack', category: 'plants', price: 229, kcal: 690, image: 'burgerVeggie', tags: ['veg', 'new'], comboable: true, description: 'Charred black bean and beet patty, avocado, tomato, oat cheese and herb sauce on a seeded bun.' },
  { id: 'crinkle-fries', name: 'Crinkle Fries', category: 'sides', price: 129, kcal: 420, image: 'fries', tags: ['veg', 'best'], description: 'Ridged, double fried and dusted with sea salt.' },
  { id: 'onion-rings', name: 'Onion Ring Tower', category: 'sides', price: 149, kcal: 510, image: 'rings', tags: ['veg'], description: 'Thick-cut sweet onion in a crackly batter, stacked like they mean it.' },
  { id: 'vanilla-shake', name: 'Vanilla Bean Shake', category: 'shakes', price: 159, kcal: 680, image: 'shake', tags: ['veg'], description: 'Real vanilla custard spun thick, whipped cream and a cherry.' },
  { id: 'pink-lemonade', name: 'Strawberry Lemonade', category: 'shakes', price: 119, kcal: 190, image: 'lemonade', tags: ['veg'], description: 'Squeezed in store with crushed strawberries. Free refills when you dine in.' },
]

export const COMBO = { price: 139, label: 'Make it a combo', note: 'Crinkle fries and a strawberry lemonade' }
export const EXTRA_PATTY = { price: 69, label: 'Extra patty' }

// ---------------------------------------------------------------------------
// Build-your-burger. `layer` drives the illustration in `BurgerStack`.

export type LayerKind = 'bun-top' | 'bun-bottom' | 'lettuce-wrap' | 'patty' | 'chicken' | 'plant' | 'cheese' | 'lettuce' | 'tomato' | 'onion' | 'pickles' | 'bacon' | 'jalapeno' | 'egg' | 'rings' | 'sauce'

export interface Ingredient {
  id: string
  name: string
  price: number
  kcal: number
  layer: LayerKind
  /** Fill colour for the illustration (sauce, cheese and bun tone). */
  tone?: string
}

export const BUILDER = {
  buns: [
    { id: 'brioche', name: 'Sesame brioche', price: 0, kcal: 260, layer: 'bun-top', tone: '#E9A54B' },
    { id: 'potato', name: 'Potato roll', price: 0, kcal: 230, layer: 'bun-top', tone: '#F2C46E' },
    { id: 'seeded', name: 'Seeded wholewheat', price: 20, kcal: 240, layer: 'bun-top', tone: '#B97A3D' },
    { id: 'lettuce-wrap', name: 'Lettuce wrap', price: 0, kcal: 10, layer: 'lettuce-wrap', tone: '#6FB83F' },
  ] as Ingredient[],
  proteins: [
    { id: 'beef', name: 'Smashed beef', price: 60, kcal: 240, layer: 'patty' },
    { id: 'chicken', name: 'Crispy chicken', price: 60, kcal: 310, layer: 'chicken' },
    { id: 'plant', name: 'Black bean patty', price: 60, kcal: 190, layer: 'plant' },
  ] as Ingredient[],
  cheeses: [
    { id: 'american', name: 'American', price: 20, kcal: 70, layer: 'cheese', tone: '#F7B523' },
    { id: 'cheddar', name: 'Aged cheddar', price: 29, kcal: 110, layer: 'cheese', tone: '#EE8E1E' },
    { id: 'pepper-jack', name: 'Pepper jack', price: 29, kcal: 100, layer: 'cheese', tone: '#F6E3A1' },
    { id: 'no-cheese', name: 'No cheese', price: 0, kcal: 0, layer: 'cheese' },
  ] as Ingredient[],
  toppings: [
    { id: 'lettuce', name: 'Lettuce', price: 0, kcal: 5, layer: 'lettuce' },
    { id: 'tomato', name: 'Tomato', price: 0, kcal: 5, layer: 'tomato' },
    { id: 'onion', name: 'Red onion', price: 0, kcal: 10, layer: 'onion' },
    { id: 'pickles', name: 'Pickles', price: 0, kcal: 5, layer: 'pickles' },
    { id: 'bacon', name: 'Maple bacon', price: 39, kcal: 140, layer: 'bacon' },
    { id: 'jalapeno', name: 'Jalapeños', price: 19, kcal: 5, layer: 'jalapeno' },
    { id: 'egg', name: 'Fried egg', price: 25, kcal: 90, layer: 'egg' },
    { id: 'rings', name: 'Onion rings', price: 29, kcal: 160, layer: 'rings' },
  ] as Ingredient[],
  sauces: [
    { id: 'stackd', name: 'Stackd sauce', price: 0, kcal: 90, layer: 'sauce', tone: '#F08A4B' },
    { id: 'bbq', name: 'Smoky barbecue', price: 0, kcal: 70, layer: 'sauce', tone: '#7A2E14' },
    { id: 'hot-honey', name: 'Hot honey', price: 19, kcal: 60, layer: 'sauce', tone: '#E8A317' },
    { id: 'garlic', name: 'Garlic mayo', price: 0, kcal: 100, layer: 'sauce', tone: '#F7F0D8' },
    { id: 'no-sauce', name: 'No sauce', price: 0, kcal: 0, layer: 'sauce' },
  ] as Ingredient[],
  basePrice: 49,
  maxPatties: 4,
  maxToppings: 6,
  default: { bun: 'brioche', protein: 'beef', patties: 2, cheese: 'american', toppings: ['lettuce', 'pickles', 'onion'], sauce: 'stackd' },
}

// ---------------------------------------------------------------------------
// Stores. `x`/`y` place the pin on the illustrated map (0 to 100).

export type StoreFeature = 'drive-thru' | 'late-night' | 'delivery' | 'catering' | 'dine-in'
export const FEATURE_LABELS: Record<StoreFeature, string> = {
  'drive-thru': 'Drive-thru',
  'late-night': 'Open late',
  delivery: 'Delivery',
  catering: 'Catering',
  'dine-in': 'Dine in',
}

export interface Store {
  id: string
  name: string
  street: string
  city: string
  state: string
  zip: string
  phone: string
  /** 24h opening hours, the same every day. Close past midnight is e.g. 26. */
  opens: number
  closes: number
  features: StoreFeature[]
  x: number
  y: number
  note: string
}

export const STORES: Store[] = [
  { id: 'gurunanak-colony', name: 'Gurunanak Colony', street: 'Door No. 40-1-52, MG Road', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520008', phone: '+91 8919527406', opens: 10.5, closes: 26, features: ['late-night', 'delivery', 'dine-in', 'catering'], x: 61, y: 46, note: 'The original. Still has the burger on the roof.' },
  { id: 'benz-circle', name: 'Benz Circle', street: 'Door No. 40-9-27, Benz Circle', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520010', phone: '+91 8919527406', opens: 10.5, closes: 23, features: ['dine-in', 'delivery', 'catering'], x: 47, y: 70, note: 'Patio seating and the best people watching in town.' },
  { id: 'patamata', name: 'Patamata', street: 'Door No. 74-1-8, Patamata Main Road', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520007', phone: '+91 8919527406', opens: 10, closes: 22, features: ['drive-thru', 'delivery', 'dine-in'], x: 72, y: 22, note: 'Drive-thru with a two-lane order board.' },
  { id: 'labbipet', name: 'Labbipet', street: 'Door No. 29-8-14, Labbipet', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520010', phone: '+91 8919527406', opens: 11, closes: 23, features: ['dine-in', 'delivery', 'catering'], x: 40, y: 10, note: 'Next to the cinema. Shakes are mandatory.' },
  { id: 'gunadala', name: 'Gunadala', street: 'Door No. 2-56, Gunadala Hill Road', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520004', phone: '+91 8919527406', opens: 10.5, closes: 22, features: ['dine-in', 'catering'], x: 33, y: 58, note: 'Walk-up window by the park. Picnic packs to go.' },
  { id: 'bhavanipuram', name: 'Bhavanipuram', street: 'Door No. 12-4-3, Bhavanipuram Main Road', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520012', phone: '+91 8919527406', opens: 10, closes: 25, features: ['drive-thru', 'late-night', 'delivery'], x: 82, y: 6, note: 'Open till 1am, with a two-lane drive-thru.' },
  { id: 'satyanarayanapuram', name: 'Satyanarayanapuram', street: 'Door No. 9-32, Satyanarayanapuram', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '520011', phone: '+91 8919527406', opens: 10.5, closes: 26, features: ['late-night', 'dine-in', 'delivery'], x: 24, y: 90, note: 'Campus favourite. Late-night tenders until 2am.' },
  { id: 'gollapudi', name: 'Gollapudi', street: 'Door No. 3-115, Gollapudi Main Road', city: 'Vijayawada', state: 'Andhra Pradesh', zip: '521225', phone: '+91 8919527406', opens: 10, closes: 22, features: ['drive-thru', 'dine-in', 'catering'], x: 14, y: 18, note: 'Big tables, a kids menu and room for the team.' },
]
// ---------------------------------------------------------------------------
// Rewards

export const TIERS = [
  { id: 'single', name: 'Single', min: 0, perks: ['1 point per ₹1', 'Free shake on your birthday'] },
  { id: 'double', name: 'Double', min: 1500, perks: ['1.2 points per ₹1', 'Free side every month', 'Early access to new stacks'] },
  { id: 'triple', name: 'Triple', min: 4000, perks: ['1.5 points per ₹1', 'Free delivery, always', 'Secret menu unlocked'] },
] as const

export interface Reward {
  id: string
  name: string
  cost: number
  /** The menu item it unlocks for free at checkout. */
  itemId: string
  note: string
}

export const REWARDS: Reward[] = [
  { id: 'r-fries', name: 'Free crinkle fries', cost: 400, itemId: 'crinkle-fries', note: 'Any size, any order.' },
  { id: 'r-lemonade', name: 'Free strawberry lemonade', cost: 350, itemId: 'pink-lemonade', note: 'Squeezed in store.' },
  { id: 'r-shake', name: 'Free vanilla shake', cost: 700, itemId: 'vanilla-shake', note: 'Spun thick to order.' },
  { id: 'r-classic', name: 'Free Classic Stack', cost: 1200, itemId: 'classic-stack', note: 'The one that started it all.' },
  { id: 'r-tower', name: 'Free Tower', cost: 1800, itemId: 'tower', note: 'Three patties, zero regrets.' },
]

export const REWARD_STEPS = [
  { title: 'Join free', body: 'Sign up in 20 seconds and get 250 points to start.' },
  { title: 'Order and earn', body: 'Every ₹1 earns 1 point, in store or online.' },
  { title: 'Stack and redeem', body: 'Swap points for fries, shakes and whole burgers.' },
]

// ---------------------------------------------------------------------------
// Catering

export interface CateringPackage {
  id: string
  name: string
  serves: string
  minGuests: number
  maxGuests: number
  /** Price per guest. */
  perGuest: number
  includes: string[]
  image: ImageKey
}

export const CATERING_PACKAGES: CateringPackage[] = [
  { id: 'slider-party', name: 'Slider party', serves: '10 to 40 guests', minGuests: 10, maxGuests: 40, perGuest: 449, image: 'catering', includes: ['Three sliders per guest', 'Crinkle fries by the tray', 'Lemonade by the gallon'] },
  { id: 'stack-bar', name: 'Build-your-own stack bar', serves: '20 to 150 guests', minGuests: 20, maxGuests: 150, perGuest: 599, image: 'burgerClassic', includes: ['Patties kept hot on site', 'Twelve toppings and four sauces', 'One Stackd crew member'] },
  { id: 'box-lunch', name: 'Office box lunch', serves: '10 to 500 guests', minGuests: 10, maxGuests: 500, perGuest: 499, image: 'burgerChicken', includes: ['One stack, side and cookie per box', 'Names on every box', 'Plant based boxes on request'] },
]

export const CATERING_FAQ = [
  { q: 'How much notice do you need?', a: 'Two days for most orders. For more than 150 guests, give us a week so we can staff the grill.' },
  { q: 'Do you deliver catering?', a: 'Yes, within 25 km of any catering store. Delivery and set-up are free over ₹4,999.' },
  { q: 'Can you handle allergies?', a: 'Every box is labelled. We can make gluten-free buns and plant based patties on request.' },
  { q: 'Is there a deposit?', a: 'No deposit. We confirm by phone, then you pay on the day.' },
]

// ---------------------------------------------------------------------------
// Social proof

export const REVIEWS = [
  { name: 'Dana R.', where: 'Benz Circle', stars: 5, text: 'I love how Stackd keeps things simple but so flavourful. The fries are crisp and the burgers are perfection in a bun.' },
  { name: 'Marcus T.', where: 'Patamata', stars: 5, text: 'Stackd burgers hit the spot every time. Bold flavours, fresh ingredients and the friendliest drive-thru crew.' },
  { name: 'Priya S.', where: 'Gurunanak Colony', stars: 5, text: 'Ordering from Stackd is always easy and the delivery is fast. The Tower is unbeatable after a long week.' },
  { name: 'Jo L.', where: 'Labbipet', stars: 5, text: 'This is not just fast food, it\'s an experience. The hot honey chicken has ruined every other sandwich for me.' },
  { name: 'Theo B.', where: 'Bhavanipuram', stars: 4, text: 'Took the slider party to the park for my birthday. Thirty people, zero leftovers, one very happy me.' },
]

export const TICKER = ['Burgers', 'Chicken', 'Crinkle fries', 'Shakes', 'Onion rings', 'Tenders', 'Lemonade', 'Plant stacks']

export const HOME = {
  photoStrip: [
    { image: 'photoBite' as ImageKey, alt: 'Hands holding a dripping cheeseburger in paper' },
    { image: 'photoFries' as ImageKey, alt: 'Crinkle fries and a smash burger on a red tray' },
    { image: 'photoShake' as ImageKey, alt: 'A vanilla shake beside a burger in a diner booth' },
  ],
  stripCard: { title: 'Two stacks, one price', body: 'Every Tuesday, a second Classic Stack is on us with rewards.', cta: 'Join rewards' },
  adventure: { title: 'Ready for a flavor adventure', body: 'Dive into bold stacks and playful bites built just for you.', cta: 'Discover now' },
  ribbon: 'New stack in town',
  reviewsTitle: 'Real talk from real foodies',
  fuel: { kicker: 'Join the flavor revolution!', title: 'Fuel up with Stackd!', body: 'Build it your way, pick it up hot, earn points on every bite.' },
  builderTeaser: { title: 'Stack it your way', body: 'Up to four patties, eight toppings, five sauces. You are the chef now.', cta: 'Build a burger' },
}
