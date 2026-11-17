import { useGroup, type ChangeCallback } from '#hook'
import clsx from 'clsx'
import { RadioGroupStyle } from './style/index.css'

export interface RadioGroupProps extends Omit<
  React.ComponentProps<'fieldset'>,
  'onChange'
> {
  name?: string | undefined
  defaultValue?: string | undefined
  value?: string | undefined
  multiple?: never
  disabled?: boolean | undefined
  onChange?:
    ChangeCallback<React.ChangeEvent<HTMLInputElement>, string> | undefined
}

export function RadioGroup(props: RadioGroupProps) {
  const {
    defaultValue: _defaultValue,
    value: _value,
    multiple: _multiple,
    onChange: _onChange,
    ...attrs
  } = useGroup(props).props

  return (
    <fieldset
      {...attrs}
      className={clsx(RadioGroupStyle, attrs.className)}
      role='radiogroup'
    />
  )
}
