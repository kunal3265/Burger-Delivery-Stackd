import { Check, ChevronDown, Minus, Plus } from 'lucide-react'
import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from 'react'

import { cx } from '../lib/hooks'

const control =
  'w-full rounded-[var(--radius-sm)] border-2 border-bun-2 bg-white px-4 text-[16px] text-ink transition-[border-color,box-shadow] duration-[var(--duration-fast)] placeholder:text-muted/80 hov:border-ink/40 focus:border-ink focus:shadow-[var(--shadow-hard-sm)] focus:outline-none data-[force~=focus]:border-ink data-[force~=focus]:shadow-[var(--shadow-hard-sm)] disabled:cursor-not-allowed disabled:bg-bun disabled:text-muted aria-invalid:border-ketchup-ink'

interface FieldProps {
  label: string
  error?: string
  hint?: string
  optional?: boolean
  className?: string
  children: (ids: { id: string; describedBy?: string; invalid: boolean }) => ReactNode
}

export function Field({ label, error, hint, optional, className, children }: FieldProps) {
  const id = useId()
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined
  return (
    <div className={cx('flex flex-col gap-1.5', className)}>
      <label htmlFor={id} className="text-[14px] font-semibold text-ink">
        {label}
        {optional && <span className="font-normal text-muted"> (optional)</span>}
      </label>
      {children({ id, describedBy, invalid: !!error })}
      {hint && !error && (
        <p id={hintId} className="text-[13px] text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="text-[13px] font-semibold text-ketchup-ink">
          {error}
        </p>
      )}
    </div>
  )
}

type InputProps = InputHTMLAttributes<HTMLInputElement> & { label: string; error?: string; hint?: string; optional?: boolean; force?: string; wrapClass?: string }

export function TextField({ label, error, hint, optional, force, wrapClass, className, ...rest }: InputProps) {
  return (
    <Field label={label} error={error} hint={hint} optional={optional} className={wrapClass}>
      {({ id, describedBy, invalid }) => <input id={id} data-force={force} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cx(control, 'h-12', className)} {...rest} />}
    </Field>
  )
}

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & { label: string; error?: string; hint?: string; optional?: boolean; force?: string; wrapClass?: string }

export function SelectField({ label, error, hint, optional, force, wrapClass, className, children, ...rest }: SelectProps) {
  return (
    <Field label={label} error={error} hint={hint} optional={optional} className={wrapClass}>
      {({ id, describedBy, invalid }) => (
        <div className="relative">
          <select id={id} data-force={force} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cx(control, 'h-12 appearance-none pr-10', className)} {...rest}>
            {children}
          </select>
          <ChevronDown className="pointer-events-none absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-muted" aria-hidden />
        </div>
      )}
    </Field>
  )
}

type AreaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; hint?: string; optional?: boolean; wrapClass?: string }

export function TextArea({ label, error, hint, optional, wrapClass, className, ...rest }: AreaProps) {
  return (
    <Field label={label} error={error} hint={hint} optional={optional} className={wrapClass}>
      {({ id, describedBy, invalid }) => <textarea id={id} aria-describedby={describedBy} aria-invalid={invalid || undefined} className={cx(control, 'min-h-28 py-3', className)} {...rest} />}
    </Field>
  )
}

export function Checkbox({ label, checked, onChange, error, disabled, force }: { label: ReactNode; checked: boolean; onChange: (v: boolean) => void; error?: string; disabled?: boolean; force?: string }) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={cx('group inline-flex min-h-10 cursor-pointer items-center gap-3 text-[15px]', disabled && 'cursor-not-allowed opacity-50')}>
        <span className="relative inline-flex">
          <input id={id} type="checkbox" className="peer absolute inset-0 opacity-0" checked={checked} disabled={disabled} onChange={(e) => onChange(e.target.checked)} aria-invalid={!!error || undefined} aria-describedby={error ? `${id}-e` : undefined} />
          <span
            data-force={force}
            className="inline-flex size-6 items-center justify-center rounded-[6px] border-2 border-ink bg-white text-cream transition-colors peer-checked:bg-ketchup peer-checked:border-ketchup peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink data-[force~=focus]:outline-3 data-[force~=focus]:outline-offset-2 data-[force~=focus]:outline-ink"
          >
            {checked && <Check className="size-4" strokeWidth={3} aria-hidden />}
          </span>
        </span>
        <span>{label}</span>
      </label>
      {error && (
        <p id={`${id}-e`} className="text-[13px] font-semibold text-ketchup-ink">
          {error}
        </p>
      )}
    </div>
  )
}

/** A row of mutually exclusive options rendered as chunky radio tiles. */
export function ChoiceGroup<T extends string>({
  label,
  value,
  onChange,
  options,
  columns = 2,
  error,
  hideLabel,
  tone = 'cream',
}: {
  label: string
  value: T
  onChange: (v: T) => void
  options: { value: T; label: ReactNode; note?: ReactNode; disabled?: boolean }[]
  columns?: 2 | 3 | 4
  error?: string
  hideLabel?: boolean
  tone?: 'cream' | 'white'
}) {
  const name = useId()
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className={cx('mb-2 text-[14px] font-semibold', hideLabel && 'sr-only')}>{label}</legend>
      <div className={cx('grid gap-2', columns === 2 && 'grid-cols-2', columns === 3 && 'grid-cols-2 sm:grid-cols-3', columns === 4 && 'grid-cols-2 sm:grid-cols-4')}>
        {options.map((o) => {
          const on = o.value === value
          return (
            <label
              key={o.value}
              className={cx(
                'relative flex min-h-14 cursor-pointer flex-col justify-center rounded-[var(--radius-sm)] border-2 px-4 py-2.5 transition-[border-color,background-color,box-shadow] duration-[var(--duration-fast)] has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-ink',
                on ? 'border-ink bg-ink text-cream shadow-[var(--shadow-hard-sm)]' : cx('border-bun-2 hover:border-ink/50', tone === 'white' ? 'bg-white' : 'bg-cream'),
                o.disabled && 'pointer-events-none opacity-45',
              )}
            >
              <input type="radio" name={name} className="absolute opacity-0" value={o.value} checked={on} disabled={o.disabled} onChange={() => onChange(o.value)} />
              <span className="text-[15px] font-semibold">{o.label}</span>
              {o.note && <span className={cx('text-[13px]', on ? 'text-on-ink-muted' : 'text-muted')}>{o.note}</span>}
            </label>
          )
        })}
      </div>
      {error && <p className="text-[13px] font-semibold text-ketchup-ink">{error}</p>}
    </fieldset>
  )
}

/** Toggle chip, used for multi-select toppings and filters. */
export function Chip({ selected, onClick, children, disabled, force, className, count }: { selected: boolean; onClick: () => void; children: ReactNode; disabled?: boolean; force?: string; className?: string; count?: number }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      data-force={force}
      disabled={disabled}
      onClick={onClick}
      className={cx(
        'inline-flex h-10 items-center gap-2 rounded-[var(--radius-sm)] border-2 px-4 text-[15px] font-semibold transition-[background-color,color,border-color,transform] duration-[var(--duration-fast)] prs:scale-95 disabled:cursor-not-allowed disabled:opacity-40',
        selected ? 'border-ink bg-ink text-cream on-ink' : 'border-bun-2 bg-cream text-ink hov:border-ink',
        className,
      )}
    >
      {selected && <Check className="size-4" strokeWidth={3} aria-hidden />}
      {children}
      {count != null && <span className={cx('text-[13px]', selected ? 'text-on-ink-muted' : 'text-muted')}>{count}</span>}
    </button>
  )
}

export function Stepper({ value, onChange, min = 1, max = 20, label, size = 'md' }: { value: number; onChange: (v: number) => void; min?: number; max?: number; label: string; size?: 'sm' | 'md' }) {
  const btn = cx('inline-flex items-center justify-center rounded-[10px] text-ink transition-colors hover:bg-bun-2 disabled:opacity-35 disabled:hover:bg-transparent', size === 'sm' ? 'size-10' : 'size-11')
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-[var(--radius-sm)] border-2 border-bun-2 bg-white p-0.5">
      <button type="button" className={btn} aria-label={`Decrease ${label}`} disabled={value <= min} onClick={() => onChange(value - 1)}>
        <Minus className="size-4" aria-hidden />
      </button>
      <output aria-live="polite" className={cx('condensed text-center tabular-nums', size === 'sm' ? 'w-7 text-[17px]' : 'w-9 text-[20px]')}>
        {value}
      </output>
      <button type="button" className={btn} aria-label={`Increase ${label}`} disabled={value >= max} onClick={() => onChange(value + 1)}>
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  )
}

export function Switch({ checked, onChange, label, note, force }: { checked: boolean; onChange: (v: boolean) => void; label: string; note?: string; force?: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-force={force}
      onClick={() => onChange(!checked)}
      className="flex min-h-14 w-full items-center justify-between gap-4 rounded-[var(--radius-sm)] border-2 border-bun-2 bg-white px-4 py-2.5 text-left transition-colors hov:border-ink/50"
    >
      <span className="flex flex-col">
        <span className="text-[15px] font-semibold">{label}</span>
        {note && <span className="text-[13px] text-muted">{note}</span>}
      </span>
      <span className={cx('round relative h-7 w-12 shrink-0 rounded-full transition-colors', checked ? 'bg-ketchup' : 'bg-bun-2')}>
        <span className={cx('round absolute top-1 size-5 rounded-full bg-white shadow transition-[left] duration-[var(--duration-base)] ease-[var(--ease-spring)]', checked ? 'left-6' : 'left-1')} />
      </span>
    </button>
  )
}
