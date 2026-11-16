import { LoaderCircle } from 'lucide-react'
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link, type LinkProps } from 'react-router'

import { cx } from '../lib/hooks'

export type ButtonVariant = 'ketchup' | 'ink' | 'cream' | 'outline' | 'outline-light' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export const BUTTON_VARIANTS: ButtonVariant[] = ['ketchup', 'ink', 'cream', 'outline', 'outline-light', 'ghost']

const base =
  'relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-sm)] condensed tracking-[0.01em] transition-[background-color,color,border-color,box-shadow,transform] duration-[var(--duration-fast)] ease-[var(--ease-out)] hov:-translate-y-0.5 prs:translate-y-0 prs:shadow-none disabled:pointer-events-none disabled:opacity-45 aria-disabled:pointer-events-none aria-disabled:opacity-45 [&_svg]:size-[1.1em] [&_svg]:shrink-0'

const variants: Record<ButtonVariant, string> = {
  ketchup: 'on-red bg-ketchup text-cream hov:bg-ketchup-2 hov:shadow-[var(--shadow-hard-sm)] prs:bg-ketchup-2',
  ink: 'on-ink bg-ink text-cream hov:bg-ink-2 hov:shadow-[2px_2px_0_var(--color-ketchup)] prs:bg-black',
  cream: 'bg-cream text-ketchup-ink shadow-[0_2px_0_rgb(0_0_0/0.25)] hov:bg-white hov:shadow-[var(--shadow-hard-sm)] prs:bg-bun',
  outline: 'border-2 border-ink text-ink hov:bg-ink hov:text-cream prs:bg-black prs:text-cream',
  'outline-light': 'on-red border-2 border-cream text-cream hov:bg-cream hov:text-ketchup-ink prs:bg-bun prs:text-ketchup-ink',
  ghost: 'text-current hov:bg-current/10 hov:translate-y-0 prs:bg-current/15',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-10 px-4 text-[16px]',
  md: 'h-12 px-6 text-[19px]',
  lg: 'h-14 px-8 text-[22px]',
}

export function buttonClass(variant: ButtonVariant = 'ketchup', size: ButtonSize = 'md', className?: string) {
  return cx(base, variants[variant], sizes[size], className)
}

type Common = { variant?: ButtonVariant; size?: ButtonSize; icon?: ReactNode; iconRight?: ReactNode; force?: string }

export function Button({ variant = 'ketchup', size = 'md', loading = false, icon, iconRight, force, className, children, disabled, type = 'button', ...rest }: Common & ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button type={type} data-force={force} className={buttonClass(variant, size, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? <LoaderCircle className="animate-spin" aria-hidden /> : icon}
      <span>{children}</span>
      {!loading && iconRight}
    </button>
  )
}

export function ButtonLink({ variant = 'ketchup', size = 'md', icon, iconRight, force, className, children, ...rest }: Common & LinkProps) {
  return (
    <Link data-force={force} className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </Link>
  )
}

export function ButtonAnchor({ variant = 'ketchup', size = 'md', icon, iconRight, className, children, ...rest }: Common & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={buttonClass(variant, size, className)} {...rest}>
      {icon}
      <span>{children}</span>
      {iconRight}
    </a>
  )
}

export type IconTone = 'ketchup' | 'ink' | 'cream' | 'bun' | 'ghost'
export const ICON_TONES: IconTone[] = ['ketchup', 'ink', 'cream', 'bun', 'ghost']

const tones: Record<IconTone, string> = {
  ketchup: 'on-red bg-ketchup text-cream hov:bg-ketchup-2',
  ink: 'on-ink bg-ink text-cream hov:bg-ink-2',
  cream: 'bg-cream text-ketchup-ink hov:bg-white',
  bun: 'bg-bun text-ink hov:bg-bun-2',
  ghost: 'text-current hov:bg-current/10',
}

/** Square icon-only button. Always pass an aria-label. */
export function IconButton({ className, tone = 'ink', size = 'md', pressed, force, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { tone?: IconTone; size?: 'sm' | 'md' | 'lg'; pressed?: boolean; force?: string; 'aria-label': string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      data-force={force}
      className={cx(
        'inline-flex shrink-0 items-center justify-center rounded-[var(--radius-sm)] transition-[background-color,color,transform] duration-[var(--duration-fast)] prs:scale-90 disabled:pointer-events-none disabled:opacity-40',
        size === 'sm' && 'size-10 [&_svg]:size-4',
        size === 'md' && 'size-11 [&_svg]:size-[18px]',
        size === 'lg' && 'size-12 [&_svg]:size-5',
        tones[tone],
        className,
      )}
      {...rest}
    />
  )
}
