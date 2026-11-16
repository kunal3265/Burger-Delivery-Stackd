// Hand-drawn line icons in the brand's marker style. Stroke follows
// currentColor, so they work on cream, ketchup and ink.
import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 2.4, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true } as const

export function BurgerDoodle(p: P) {
  return (
    <svg viewBox="0 0 32 32" {...base} {...p}>
      <path d="M5 14c0-6 5-9 11-9s11 3 11 9z" />
      <path d="M4 18h24M6 22h20c0 3-3 5-6 5h-8c-3 0-6-2-6-5z" />
      <path d="M11 9.5l.6.4M16 8.5v.6M20.5 9.5l-.6.4" />
    </svg>
  )
}
export function FriesDoodle(p: P) {
  return (
    <svg viewBox="0 0 32 32" {...base} {...p}>
      <path d="M8 14h16l-2 14H10z" />
      <path d="M11 14l-2-9M15 14V4M19 14l1-9M23 14l2-7" />
    </svg>
  )
}
export function ShakeDoodle(p: P) {
  return (
    <svg viewBox="0 0 32 32" {...base} {...p}>
      <path d="M9 12h14l-2 16H11z" />
      <path d="M8 12c0-3 3-5 8-5s8 2 8 5M18 7l3-5" />
    </svg>
  )
}
export function DrumstickDoodle(p: P) {
  return (
    <svg viewBox="0 0 32 32" {...base} {...p}>
      <path d="M20 4c5 0 8 4 8 8 0 6-6 9-11 8l-5 5" />
      <path d="M20 4c-5 0-9 4-9 9 0 2 1 4 2 5" />
      <circle cx="9" cy="26" r="2.5" />
      <circle cx="6" cy="23" r="2.5" />
    </svg>
  )
}
export function RingDoodle(p: P) {
  return (
    <svg viewBox="0 0 32 32" {...base} {...p}>
      <ellipse cx="16" cy="12" rx="11" ry="5" />
      <ellipse cx="16" cy="20" rx="11" ry="5" />
      <ellipse cx="16" cy="12" rx="5" ry="2" />
    </svg>
  )
}
export function CupDoodle(p: P) {
  return (
    <svg viewBox="0 0 32 32" {...base} {...p}>
      <path d="M8 9h16l-2 19H10zM7 9h18M18 9l2-7h4" />
      <path d="M9 15h14" />
    </svg>
  )
}

export const TICKER_ICONS = [BurgerDoodle, DrumstickDoodle, FriesDoodle, ShakeDoodle, RingDoodle, DrumstickDoodle, CupDoodle, BurgerDoodle]

export function Cloud(p: P) {
  return (
    <svg viewBox="0 0 120 56" {...base} strokeWidth={2.2} {...p}>
      <path d="M14 50h92c8 0 12-6 12-11s-5-11-12-10c0-9-7-15-15-14-3-8-11-12-19-11-7 1-12 6-13 12-7-3-15 1-17 8-8-2-15 4-15 12 0 8 6 14 15 14" />
      <path d="M2 54h30" />
    </svg>
  )
}

export function SquiggleArrow(p: P) {
  return (
    <svg viewBox="0 0 48 16" {...base} strokeWidth={2} {...p}>
      <path d="M2 8c4-5 7 5 11 0s7 5 11 0 7 5 11 0 5 3 9 0" />
      <path d="M40 3l5 5-5 5" />
    </svg>
  )
}

export function Star({ filled = true, ...p }: P & { filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden {...p}>
      <path d="M10 1.8l2.5 5.1 5.6.8-4 4 1 5.5L10 14.6l-5 2.6 1-5.5-4-4 5.5-.8z" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  )
}

/** A wobbly ground line with tufts, used under the hero storefront. */
export function GroundLine(p: P) {
  return (
    <svg viewBox="0 0 600 30" preserveAspectRatio="none" {...base} strokeWidth={2.6} {...p}>
      <path d="M0 22c60-3 120 2 180-1s140 1 220-2 150 3 200 1" />
      <path d="M90 22c2-6 4-9 6-12M98 22c1-5 3-7 7-9M470 20c1-5 3-8 6-11M478 20c2-4 4-6 8-7" />
    </svg>
  )
}
