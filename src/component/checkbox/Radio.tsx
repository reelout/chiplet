import type { ChangeCallback } from '#hook'
import { useRadio } from '#hook'
import clsx from 'clsx'
import { RadioChecked, RadioUnchecked } from './icon'
import {
  CheckboxStyle,
  RadioCheckedIconStyle,
  RadioUncheckedIconStyle,
} from './style/index.css'

export type RadioSize = 'small' | 'medium' | 'large'

export interface RadioProps extends Omit<
  React.ComponentProps<'input'>,
  'size' | 'onChange' | 'slot'
> {
  size?: RadioSize | undefined
  value: string
  onChange?:
    ChangeCallback<React.ChangeEvent<HTMLInputElement>, boolean> | undefined
  slot?: {
    root?: React.ComponentProps<'div'> | undefined
    input?: React.ComponentProps<'input'> | undefined
  }
}

export function Radio(props: RadioProps) {
  const {
    className,
    style,
    size = 'medium',
    onChange,
    slot,
    ...attrs
  } = useRadio(props)

  return (
    <div
      {...slot?.root}
      className={clsx(
        CheckboxStyle({ size }),
        slot?.root?.className,
        className
      )}
      style={style}
    >
      <input
        {...slot?.input}
        {...attrs}
        type='radio'
        onChange={(ev) => onChange?.(ev, ev.currentTarget.checked)}
      />
      <RadioUnchecked className={RadioUncheckedIconStyle} />
      <RadioChecked className={RadioCheckedIconStyle} />
    </div>
  )
}
