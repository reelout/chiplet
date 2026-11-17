import type { ChangeCallback } from './useDefault'
import { useChecked } from './useChecked'

export type OptionValue = string | number

interface Props<T extends OptionValue> extends React.AriaAttributes {
  role?: React.AriaRole | undefined
  name?: string | undefined
  value: T
  defaultChecked?: never
  checked?: never
  defaultSelected?: boolean | undefined
  selected?: boolean | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, boolean> | undefined
}

export function useOption<P extends Props<OptionValue>>(props: P) {
  props = useChecked<P>({
    ...props,
    defaultChecked: props.defaultSelected,
    checked: props.selected,
  })

  props = {
    ...props,
    role: props.role || 'option',
    defaultChecked: undefined,
    checked: undefined,
    defaultSelected: props.defaultChecked,
    selected: props.checked,
  }

  return props
}
