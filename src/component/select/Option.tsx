import {
  useChange,
  useClose,
  useInteractive,
  useKeyboard,
  useOption,
  type ChangeCallback,
  type OptionValue,
} from '#hook'
import clsx from 'clsx'
import { Checkmark24Regular } from '../icon'
import { ItemIconStyle, ItemStyle } from '../select/style/index.css'

export interface OptionProps<T extends OptionValue> extends Omit<
  React.ComponentProps<'li'>,
  'onChange' | 'slot'
> {
  name?: never
  value: T
  defaultChecked?: never
  checked?: never
  defaultSelected?: never
  selected?: never
  multiple?: never
  disabled?: boolean | undefined
  onChange?:
    ChangeCallback<React.MouseEvent<HTMLLIElement>, boolean> | undefined
  slot?: {
    root?: React.ComponentProps<'li'> | undefined
    icon?: React.ComponentProps<'svg'> | undefined
  }
}

export interface Option<T extends OptionValue> extends OptionProps<T> {
  value: T
  label: string
}

export function Option<T extends OptionValue>(props: OptionProps<T>) {
  props = useOption(props)
  props = useChange(props.selected, props)
  props = useClose(props, props.multiple)
  props = useKeyboard(props)
  props = useInteractive(props)

  const {
    name,
    value,
    defaultChecked,
    checked,
    defaultSelected,
    selected,
    multiple,
    disabled,
    onChange,
    slot,
    ...attrs
  } = props

  return (
    <li
      {...slot?.root}
      {...attrs}
      className={clsx(ItemStyle(), slot?.root?.className, attrs.className)}
      role='option'
      value={value}
      aria-selected={selected}
      aria-disabled={disabled}
    >
      <Checkmark24Regular
        {...slot?.icon}
        className={clsx(ItemIconStyle, slot?.icon?.className)}
      />
      {attrs.children}
    </li>
  )
}
