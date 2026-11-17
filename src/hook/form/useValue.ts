import invariant from 'tiny-invariant'
import { useConst } from '../react/useConst'
import type { ChangeCallback } from './useDefault'
import { useName } from './useName'

interface Props<T> {
  name?: string | undefined
  defaultValue?: T | undefined
  value?: T | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, T> | undefined
}

export function useValue<P extends Props<unknown>>(props: P) {
  const {
    context,
    name,
    value: _value,
    multiple,
    disabled,
    onChange,
  } = useName(props)

  const { defaultValue, value } = props

  props = {
    ...props,
    name,
    multiple,
    disabled,
    onChange,
  }

  if (useConst(() => context && name && value === undefined)) {
    invariant(name, 'The "name" property is required.')

    const value = _value === undefined ? defaultValue : _value

    invariant(value !== undefined, `Default value is required for "${name}".`)

    props = {
      ...props,
      value,
    }
  }

  if (props.value !== undefined && props.defaultValue !== undefined) {
    props = {
      ...props,
      defaultValue: undefined,
    }
  }

  return props
}
