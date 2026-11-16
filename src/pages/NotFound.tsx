import { ArrowRight } from 'lucide-react'

import { ButtonLink } from '../components/Button'
import { BurgerStack } from '../components/BurgerStack'
import { useDocumentTitle } from '../lib/hooks'

export function NotFound() {
  useDocumentTitle('Page not found')
  return (
    <section className="on-red relative bg-ketchup text-cream">
      <div className="doodles absolute inset-0" aria-hidden />
      <div className="container-page relative grid items-center gap-10 pt-40 pb-24 md:grid-cols-2">
        <div className="flex flex-col items-start gap-5">
          <p className="condensed text-[20px]">Error 404</p>
          <h1 className="display text-[clamp(64px,10vw,140px)]">This stack fell over</h1>
          <p className="max-w-[440px] text-[17px] text-on-red-muted">The page you wanted is not on the menu. It may have moved, or the link has a typo.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink to="/" variant="ink" size="lg" iconRight={<ArrowRight aria-hidden />}>
              Back home
            </ButtonLink>
            <ButtonLink to="/menu" variant="outline-light" size="lg">
              See the menu
            </ButtonLink>
          </div>
        </div>
        <div className="flex justify-center md:rotate-[14deg]">
          <BurgerStack build={{ bun: 'brioche', protein: 'beef', patties: 1, cheese: 'american', toppings: ['tomato', 'lettuce'], sauce: 'stackd' }} label="A tipped-over illustrated burger" className="max-w-[300px]" />
        </div>
      </div>
      <div className="scallop absolute inset-x-0 top-full" aria-hidden />
    </section>
  )
}
