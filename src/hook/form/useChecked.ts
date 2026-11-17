'use client'
import { uniq, without } from 'lodash-es'
import { useCallback, useLayoutEffect, useRef } from 'react'
import invariant from 'tiny-invariant'
import { useConst } from '../react/useConst'
import type { ChangeCallback } from './useDefault'
import { useName } from './useName'

type Value<T, M extends boolean> = M extends true ? readonly T[] : T

interface Props<T> {
  name?: string | undefined
  value: T
  defaultChecked?: boolean | undefined
  checked?: boolean | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, boolean> | undefined
}

export function useChecked<P extends Props<unknown>>(props: P) {
  type T = P['value']

  const {
    context,
    name,
    value: _value,
    multiple,
    disabled,
    onChange: setValue,
  } = useName<Value<T, boolean>>({
    ...props,
    value: undefined,
    onChange: undefined,
  })

  const { value, defaultChecked, checked } = props

  props = {
    ...props,
    name,
    multiple,
    disabled,
  }

  if (useConst(() => context && name && checked === undefined)) {
    invariant(name, 'The "name" property is required.')

    const checked =
      _value === undefined
        ? (defaultChecked ?? false)
        : normalizeValue(multiple, _value).includes(value)

    props = {
      ...props,
      checked,
    }
  }

  if (props.checked !== undefined && props.defaultChecked !== undefined) {
    props = {
      ...props,
      defaultChecked: undefined,
    }
  }

  {
    const ref = useRef({ value: _value })

    useLayoutEffect(() => {
      ref.current.value = _value
    })

    const { onChange } = props

    props = {
      ...props,
      onChange: useCallback<NonNullable<typeof onChange>>(
        (ev, checked) => {
          if (disabled) {
            return
          }

          // Cannot uncheck a radio button
          if (!multiple && !checked) {
            return
          }

          onChange?.(ev, checked)

          if (ev.defaultPrevented) {
            return
          }

          if (!multiple) {
            setValue(ev, value)
            return
          }

          let _value = normalizeValue(multiple, ref.current.value)

          _value = checked ? uniq(_value.concat(value)) : without(_value, value)

          setValue(ev, _value)
        },
        [disabled, multiple, onChange, setValue, value]
      ),
    }
  }

  return props
}

export function normalizeValue<T>(
  multiple: boolean | undefined,
  value: Value<T, boolean> | undefined
): readonly T[] {
  if (value === undefined) return []

  if (multiple) return value as Value<T, true>

  return [value as Value<T, false>]
}
