import { VirtualActive, VirtualFocus } from '#util'
import { use, useCallback } from 'react'
import type { GlobalAttributes } from '../../react/element.d'
import { useRefCallback } from '../../react/useRefCallback'
import { useUniqueId } from '../../react/useUniqueId'
import { KeyboardContext } from './context'

interface Props extends GlobalAttributes, React.RefAttributes<Element> {
  value?: unknown
  disabled?: boolean | undefined
  onClick?: React.MouseEventHandler<Element> | undefined
  onKeyDown?: React.KeyboardEventHandler<Element> | undefined
}

export function useKeyboard<P extends Props>(props: P) {
  const context = use(KeyboardContext)
  const _id = useUniqueId('\0')
  const { key, value, disabled } = props

  const [el, setEl] = useRefCallback(props.ref)

  const add = context?.add

  const remove = context?.remove

  const saveRef = useCallback(
    (el: Element) => {
      const reset = setEl(el)
      add?.(el, { _id, key, value, disabled })

      return () => {
        reset()
        remove?.(el)
      }
    },
    [_id, add, disabled, key, remove, setEl, value]
  )

  const { onKeyDown } = props

  const navigate = context?.navigate

  const handleKeyDown = useCallback<NonNullable<typeof onKeyDown>>(
    (ev) => {
      onKeyDown?.(ev)

      if (!ev.defaultPrevented) {
        navigate?.(ev)
      }
    },
    [navigate, onKeyDown]
  )

  if (context) {
    const { lastActive, active, isFocusVisible } = context
    const isRoving = lastActive != null && lastActive === el
    const isFocused = active != null && active.value === el
    const isActivated = isFocused && context.isActivated

    props = {
      ...props,
      id: props.id || _id,
      tabIndex: !disabled && isRoving ? 0 : -1,
      [VirtualFocus]: (isFocused && isFocusVisible) || undefined,
      [VirtualActive]: (!disabled && isActivated) || undefined,
      onKeyDown: handleKeyDown,
      ref: saveRef,
    }
  }

  return props
}
