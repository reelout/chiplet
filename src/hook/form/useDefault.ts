'use client'
import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import invariant from 'tiny-invariant'
import { useConst } from '../react/useConst'

export type OptionalChangeCallback<E extends Partial<Event>, T> = {
  bivarianceHack(ev: E, value?: T, hint?: string): void
}['bivarianceHack']

export type ChangeCallback<E extends Partial<Event>, T> = {
  bivarianceHack(ev: E, value: T, hint?: string): void
}['bivarianceHack']

type ApplyEvent<E extends Partial<Event>, T> = {
  bivarianceHack(ev: E): T
}['bivarianceHack']

type DefaultValue<T> = T | (() => T)

type Value<T, U extends T> = U | ((prevState: T) => U)

function isValue<T, U extends T>(value: Value<T, U>): value is U {
  return typeof value !== 'function'
}

interface Props<E extends Partial<Event>, T, U extends T> {
  defaultValue?: DefaultValue<T> | undefined
  value?: T | undefined
  onChange?: ChangeCallback<E, U> | undefined
  applyEvent?: ApplyEvent<E, Value<T | undefined, U>> | undefined
}

interface Props1<E extends Partial<Event>, T, U extends T> {
  defaultValue: DefaultValue<T>
  value?: T | undefined
  onChange?: ChangeCallback<E, U> | undefined
  applyEvent: ApplyEvent<E, Value<T, U>>
}

interface Props2<E extends Partial<Event>, T, U extends T> {
  defaultValue: DefaultValue<T>
  value?: T | undefined
  onChange?: ChangeCallback<E, U> | undefined
  applyEvent?: ApplyEvent<E, Value<T, U>> | undefined
}

interface Props3<E extends Partial<Event>, T, U extends T> {
  defaultValue?: DefaultValue<T> | undefined
  value: T
  onChange?: ChangeCallback<E, U> | undefined
  applyEvent: ApplyEvent<E, Value<T, U>>
}

interface Props4<E extends Partial<Event>, T, U extends T> {
  defaultValue?: DefaultValue<T> | undefined
  value: T
  onChange?: ChangeCallback<E, U> | undefined
  applyEvent?: ApplyEvent<E, Value<T, U>> | undefined
}

type Result1<E extends Partial<Event>, T, U extends T> = readonly [
  T,
  OptionalChangeCallback<E, Value<T, U>>,
]

type Result2<E extends Partial<Event>, T, U extends T> = readonly [
  T,
  ChangeCallback<E, Value<T, U>>,
]

export function useDefault<E extends Partial<Event>, T, U extends T>(
  props: Props1<E, T, U>
): Result1<E, T, U>

export function useDefault<E extends Partial<Event>, T, U extends T>(
  props: Props2<E, T, U>
): Result2<E, T, U>

export function useDefault<E extends Partial<Event>, T, U extends T>(
  props: Props3<E, T, U>
): Result1<E, T, U>

export function useDefault<E extends Partial<Event>, T, U extends T>(
  props: Props4<E, T, U>
): Result2<E, T, U>

export function useDefault<E extends Partial<Event>, T, U extends T>(
  props: Props<E, T, U>
) {
  const isControlled = useConst(() => props.value !== undefined)

  invariant(
    /* istanbul ignore next */
    process.env.NODE_ENV === 'production' ||
      isControlled === (props.value !== undefined),
    isControlled
      ? 'A controlled component is being changed to an uncontrolled component.'
      : 'An uncontrolled component is being changed to a controlled component.'
  )

  const [state, setState] = useState(props.defaultValue)

  let { value } = props

  if (!isControlled) {
    value = state
  }

  const ref = useRef({ ...props, isMounted: false, isControlled, value })

  useLayoutEffect(() => {
    ref.current = { ...props, isMounted: true, isControlled, value }

    return () => {
      ref.current.isMounted = false
    }
  })

  type V = Value<T | undefined, U>

  const onChange = useCallback<ChangeCallback<E, V>>((ev, value, hint) => {
    invariant(
      /* istanbul ignore next */
      process.env.NODE_ENV === 'production' || ref.current.isMounted,
      'Cannot call `onChange` within the `useLayoutEffect` hook of a child component, as the parent component has not been mounted yet.'
    )

    if (value === undefined) {
      invariant(
        typeof ref.current.applyEvent === 'function',
        'Warning: `applyEvent` is required when using `onChange(ev)` signature.'
      )

      value = ref.current.applyEvent(ev)
    }

    if (!isValue(value)) {
      value = value(ref.current.value)
    }

    if (hint === undefined) {
      ref.current.onChange?.(ev, value)
    } else {
      ref.current.onChange?.(ev, value, hint)
    }

    if (ev.type !== 'change' && ev.defaultPrevented) return

    ref.current.value = value

    if (!ref.current.isControlled) {
      setState(value)
    }
  }, [])

  return [value, onChange] as const
}
