import { useValue, type ChangeCallback } from '#hook'
import clsx from 'clsx'
import type { JSX } from 'react'
import { InputStyle } from './style/index.css'

export type InputVariant = 'primary' | 'secondary'

export type InputSize = 'small' | 'medium' | 'large'

export interface InputProps extends Omit<
  React.ComponentProps<'input'>,
  'size' | 'onChange' | 'slot'
> {
  variant?: InputVariant | undefined
  size?: InputSize | undefined
  defaultValue?: string | undefined
  value?: string | undefined
  onChange?:
    ChangeCallback<React.ChangeEvent<HTMLInputElement>, string> | undefined
  before?: JSX.Element | null | undefined
  after?: JSX.Element | null | undefined
  slot?: {
    root?: React.ComponentProps<'div'> | undefined
    input?: React.ComponentProps<'input'> | undefined
  }
}

export function Input(props: InputProps) {
  const {
    className,
    style,
    variant = 'primary',
    size = 'medium',
    onChange,
    before,
    after,
    slot,
    ...attrs
  } = useValue<InputProps>({
    ...props,
    defaultValue: props.defaultValue ?? '',
  })

  return (
    <div
      {...slot?.root}
      className={clsx(InputStyle({ variant, size }), className)}
      style={style}
    >
      {before}
      <input
        {...slot?.input}
        {...attrs}
        onChange={(ev) => onChange?.(ev, ev.currentTarget.value)}
      />
      {after}
    </div>
  )
}
