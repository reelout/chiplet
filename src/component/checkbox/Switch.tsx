import type { GlobalAttributes } from '#hook/react/element.d'
import clsx from 'clsx'
import { useCallback } from 'react'
import { SwitchInputStyle, SwitchStyle } from './style/index.css'

export type SwitchSize = 'small' | 'medium' | 'large'

type InputProps = React.ComponentProps<'input'>

export interface SwitchProps
  extends
    GlobalAttributes,
    React.AriaAttributes,
    React.RefAttributes<HTMLDivElement> {
  size?: SwitchSize | undefined
  defaultChecked?: boolean | undefined
  checked?: boolean | undefined
  disabled?: boolean | undefined
  onChange?:
    | ((ev: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void)
    | undefined
  slot?: {
    root?: React.ComponentProps<'div'> | undefined
    input?: React.ComponentProps<'input'> | undefined
  }
}

export function Switch(props: SwitchProps) {
  const {
    className,
    style,
    size = 'medium',
    onChange,
    slot,
    ref,
    ...attrs
  } = props

  const handleChange: NonNullable<InputProps['onChange']> = useCallback(
    (ev) => onChange?.(ev, ev.currentTarget.checked),
    [onChange]
  )

  return (
    <div
      {...slot?.root}
      className={clsx(SwitchStyle({ size }), className)}
      style={style}
      ref={ref}
    >
      <input
        {...slot?.input}
        {...attrs}
        className={clsx(SwitchInputStyle, slot?.input?.className)}
        type='checkbox'
        role='switch'
        onChange={handleChange}
      />
    </div>
  )
}
