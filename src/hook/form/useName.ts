import { use, useCallback } from 'react'
import type { ChangeCallback } from './useDefault'
import { FormContext } from './context'

interface Props<T> {
  name?: string | undefined
  value?: T | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, T> | undefined
}

export function useName<T>(props: Props<T>) {
  const context = use<FormContext<Record<string, T>> | null>(FormContext)
  const name = props.name || context?.name
  const value = name ? context?.value[name] : undefined
  const multiple = props.multiple ?? context?.multiple
  const disabled = context?.disabled || props.disabled
  const { onChange } = props
  const setValue = context?.onChange

  return {
    context,
    name,
    value,
    multiple,
    disabled,
    onChange: useCallback<NonNullable<typeof onChange>>(
      (ev, value) => {
        onChange?.(ev, value)

        if (!ev.defaultPrevented && name) {
          setValue?.(ev, (prev) => ({ ...prev, [name]: value }), name)
        }
      },
      [name, onChange, setValue]
    ),
  }
}
