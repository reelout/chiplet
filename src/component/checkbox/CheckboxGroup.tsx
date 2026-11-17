import { useGroup, type ChangeCallback } from '#hook'
import clsx from 'clsx'
import { CheckboxGroupStyle } from './style/index.css'

export interface CheckboxGroupProps extends Omit<
  React.ComponentProps<'fieldset'>,
  'onChange'
> {
  name?: string | undefined
  defaultValue?: readonly string[] | undefined
  value?: readonly string[] | undefined
  multiple?: never
  disabled?: boolean | undefined
  onChange?:
    | ChangeCallback<React.ChangeEvent<HTMLInputElement>, readonly string[]>
    | undefined
}

export function CheckboxGroup(props: CheckboxGroupProps) {
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
      className={clsx(CheckboxGroupStyle, attrs.className)}
    />
  )
}
