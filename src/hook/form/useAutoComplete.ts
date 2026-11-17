'use client'
import { uniq } from 'lodash-es'
import {
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import type {
  KeyboardOptions,
  KeyboardProps,
  NavigationDirection,
} from '../accessibility/keyboard/Keyboard'
import { useHighlight } from '../document/useHighlight'
import type { Overlay, ToggleCallback } from '../popover/useOverlay'
import type { PopoverOptions } from '../popover/usePopover'
import type { PositioningOptions } from '../popover/usePositioning'
import type { GlobalAttributes } from '../react/element.d'
import { useRefObject } from '../react/useRefObject'
import { useRegExp } from '../react/useRegExp'
import type { ChangeCallback, OptionalChangeCallback } from './useDefault'
import { useGroup } from './useGroup'

type Option<T> = { value: T; label: string }

type Value<T, M extends boolean> = M extends true ? readonly T[] : T

type ChangeEventHandler<E, T> = OptionalChangeCallback<React.ChangeEvent<E>, T>

interface _InputProps
  extends
    GlobalAttributes,
    React.AriaAttributes,
    React.RefAttributes<HTMLInputElement | HTMLTextAreaElement>,
    React.PropsWithChildren {
  name?: string | undefined
  placeholder?: string | undefined
  defaultValue?: unknown
  value?: unknown
  disabled?: boolean | undefined
  onChange?:
    | ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement, unknown>
    | undefined
  onBlur?: React.FocusEventHandler | undefined
}

interface Slot {
  input?: _InputProps | undefined
  popover?: PopoverOptions<React.HTMLElementType> | undefined
}

export interface AutoCompleteOptions<
  T extends string,
  M extends false = false,
  O extends Option<T> = Option<T>,
  S extends Slot = Slot,
>
  extends React.PropsWithChildren {
  type?: 'list' | 'both' | undefined
  name?: string | undefined
  placeholder?: string | undefined
  defaultValue?: Value<T, M> | undefined
  value?: Value<T, M> | undefined
  options?: readonly O[] | undefined
  multiple?: M | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, Value<T, M>> | undefined
  positioning?: PositioningOptions | undefined
  keyboard?: KeyboardOptions | NavigationDirection | undefined
  defaultOpen?: boolean | undefined
  open?: boolean | undefined
  onToggle?: ToggleCallback | undefined
  ref?: React.Ref<Overlay> | undefined
  slot?: S | undefined
}

export function useAutoComplete<
  T extends string,
  M extends false = false,
  O extends Option<T> = Option<T>,
  S extends Slot = Slot,
>(autoCompleteOptions: AutoCompleteOptions<T, M, O, S>) {
  const inputRef = useRefObject(autoCompleteOptions.slot?.input?.ref)
  const popoverRef = useRefObject(autoCompleteOptions.ref)
  const positionedRef = useRef<Element>(null)

  useImperativeHandle<Element | null | undefined, Element | null | undefined>(
    positionedRef,
    () => popoverRef.current?.positioned
  )

  const [{ query, prediction }, setState] = useState({
    query: undefined as string | undefined,
    prediction: undefined as string | undefined,
  })

  const queryRE = useRegExp(query, 'i')

  const highlight = useHighlight(query, positionedRef)

  {
    const { onChange } = autoCompleteOptions

    autoCompleteOptions = {
      ...autoCompleteOptions,
      onChange: useCallback<NonNullable<typeof onChange>>(
        (ev, value) => {
          onChange?.(ev, value)

          setState({
            query: undefined,
            prediction: undefined,
          })

          const el = inputRef.current

          if (el && el.selectionStart !== el.selectionEnd) {
            el.setSelectionRange(el.value.length, el.value.length)
          }
        },
        [inputRef, onChange]
      ),
    }
  }

  const group = useGroup(autoCompleteOptions)

  const {
    type = 'both',
    name,
    placeholder,
    defaultValue,
    value,
    options,
    multiple,
    disabled,
    onChange,
    positioning,
    keyboard,
    defaultOpen,
    open,
    onToggle,
    ref,
    slot,
    children,
    ...props
  } = group.props

  let inputProps: NonNullable<S['input']> = { ...slot?.input, ...props }
  let popoverProps: NonNullable<S['popover']> = { ...slot?.popover }

  inputProps.ref = inputRef
  popoverProps.ref = popoverRef

  {
    useLayoutEffect(() => {
      if (inputRef.current && prediction) {
        inputRef.current.setSelectionRange(
          query && prediction.toLowerCase().startsWith(query.toLowerCase())
            ? query.length
            : 0,
          prediction.length,
          'backward'
        )
      }
    })

    const { onChange, onBlur } = inputProps

    inputProps = {
      ...inputProps,
      onChange: useCallback<NonNullable<typeof onChange>>(
        (ev, ...args) => {
          onChange?.(ev, ...args)

          popoverRef.current?.toggle(ev, true)

          const query = ev.currentTarget.value

          setState((prev) => ({
            query,
            prediction:
              (prev.query?.length ?? 0) < query.length &&
              prev.prediction?.toLowerCase().startsWith(query.toLowerCase())
                ? query + prev.prediction.slice(query.length)
                : undefined,
          }))
        },
        [onChange, popoverRef]
      ),
      onBlur: useCallback<NonNullable<typeof onBlur>>(
        (ev) => {
          onBlur?.(ev)

          /* istanbul ignore else */
          if (!ev.defaultPrevented) {
            setState({
              query: undefined,
              prediction: undefined,
            })
          }
        },
        [onBlur]
      ),
    }
  }

  {
    if (typeof keyboard === 'string') {
      popoverProps.keyboard = { direction: keyboard }
    } else {
      popoverProps.keyboard = { ...keyboard }
    }

    const { onNavigate } = popoverProps.keyboard

    popoverProps.keyboard = {
      ...popoverProps.keyboard,
      onNavigate: useCallback<NonNullable<KeyboardProps['onNavigate']>>(
        (ev, ...args) => {
          onNavigate?.(ev, ...args)

          if (ev.defaultPrevented || type === 'list') {
            return
          }

          const value = args[0].context.value

          /* istanbul ignore next */
          if (typeof value !== 'string') return

          const label = options?.find((option) => option.value === value)?.label

          setState((prev) => {
            const { query } = prev

            if (
              typeof label === 'string' &&
              (!query || label.toLowerCase().startsWith(query.toLowerCase()))
            ) {
              return {
                query,
                prediction: query ? query + label.slice(query.length) : label,
              }
            }

            return {
              query,
              prediction: value,
            }
          })
        },
        [onNavigate, options, type]
      ),
    }
  }

  inputProps = {
    ...inputProps,
    role: 'combobox',
    'aria-autocomplete': type,
    name,
    placeholder,
    defaultValue: undefined,
    value: useMemo<string>(() => {
      if (prediction != null) return prediction

      if (query != null) return query

      /* istanbul ignore next */
      if (multiple) return ''

      if (value === undefined) return ''

      const option = options?.find((option) => option.value === value)

      if (option) return option.label

      return value
    }, [multiple, options, prediction, query, value]),
    disabled,
  }

  popoverProps = {
    ...popoverProps,
    role: 'listbox',
    'aria-multiselectable': multiple,
    positioning: { ...positioning, align: positioning?.align ?? true },
    defaultOpen,
    open,
    onToggle,
    children,
  }

  return {
    type,
    name,
    placeholder,
    defaultValue,
    value,
    options: useMemo(() => {
      if (!options) return undefined

      if (!queryRE || queryRE.test('')) return options

      if (type === 'list') {
        return options.filter(
          (option) => queryRE.test(option.label) || queryRE.test(option.value)
        )
      }

      return uniq([
        ...options.filter((option) => queryRE.test(option.label)),
        ...options.filter((option) => queryRE.test(option.value)),
      ])
    }, [options, queryRE, type]),
    query,
    queryRE,
    highlight,
    multiple,
    disabled,
    onChange,
    input: { props: inputProps },
    popover: { props: popoverProps },
    context: group.context,
  }
}
