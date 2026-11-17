'use client'
import {
  createElement,
  use,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
  type PropsWithChildren,
  type SyntheticEvent,
} from 'react'
import invariant from 'tiny-invariant'
import { useConst } from '../react/useConst'
import { useUniqueId } from '../react/useUniqueId'
import { useDefault, type ChangeCallback } from './useDefault'
import { FormContext } from './context'

interface Props<T, E extends SyntheticEvent> extends PropsWithChildren {
  name?: string | undefined
  defaultValue?: T | undefined
  value?: T | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<E, T> | undefined
}

export function useGroup<T, P extends Props<T, SyntheticEvent>>(props: P) {
  const context = use<FormContext<Record<string, T | undefined>> | null>(
    FormContext
  )
  const isControlled = useConst(
    () => context && props.name && props.value === undefined
  )
  const _name = useUniqueId('group-')
  const name = props.name || _name
  const { multiple } = props
  const disabled = context?.disabled || props.disabled

  let _value: readonly [T | undefined] | undefined = undefined

  if (props.value !== undefined) {
    _value = [props.value]
  }

  if (isControlled) {
    invariant(props.name, 'The "name" property is required.')

    let value = context?.value[props.name]

    if (value === undefined) value = props.defaultValue

    _value = [value]
  }

  const [[value], setValue] = useDefault({
    defaultValue: [props.defaultValue],
    value: _value,
  })

  // eslint-disable-next-line react-hooks/immutability, react-compiler/react-compiler
  props = {
    ...props,
    name,
    defaultValue: undefined,
    value,
    multiple,
    disabled,
  }

  const [_state, _setState] = useDefault({
    defaultValue: {},
    value: context?.value,
    onChange: context?.onChange,
  })

  const state = useMemo<typeof _state>(
    () => ({ ..._state, [name]: value }),
    [_state, name, value]
  )

  const ref = useRef({ state })

  useLayoutEffect(() => {
    ref.current.state = state
  })

  const { onChange } = props

  const setState = useCallback<NonNullable<typeof context>['onChange']>(
    (ev, state, hint) => {
      state = typeof state === 'function' ? state(ref.current.state) : state
      state = { ...state }
      const value = state[name]
      delete state[_name]

      if (hint !== name) {
        _setState(ev, state, hint)
        return
      }

      if (isControlled) {
        onChange?.(ev, value as T)

        if (!ev.defaultPrevented) {
          _setState(ev, state, hint)
        }
      } else {
        if (hint !== _name) {
          _setState(ev, state, hint)

          if (ev.defaultPrevented) {
            return
          }
        }

        onChange?.(ev, value as T)
      }

      if (!ev.defaultPrevented) {
        setValue(ev, [value])
      }
    },
    [_name, _setState, isControlled, name, onChange, setValue]
  )

  const handleChange = useCallback<NonNullable<typeof onChange>>(
    (ev, value) => {
      setState(ev, (state) => ({ ...state, [name]: value }), name)
    },
    [name, setState]
  )

  props = {
    ...props,
    onChange: handleChange,
  }

  const _context = useMemo<NonNullable<typeof context>>(
    () => ({ name, value: state, multiple, disabled, onChange: setState }),
    [disabled, multiple, name, setState, state]
  )

  props = {
    ...props,
    // eslint-disable-next-line react-hooks/refs
    children: createElement(FormContext, { value: _context }, props.children),
  }

  return {
    name,
    value,
    multiple,
    disabled,
    onChange: handleChange,
    props,
    context: _context,
  }
}
