import { VirtualActive } from '#util'
import { useCallback } from 'react'
import { useActivate } from './useActivate'

type Props = Pick<
  React.ButtonHTMLAttributes<HTMLElement>,
  | 'disabled'
  | 'role'
  | 'tabIndex'
  | 'onClick'
  | 'onClickCapture'
  | 'onKeyDown'
  | 'onKeyUp'
>

export function useInteractive<P extends Props>(props: P) {
  const [isActivated, activate] = useActivate()

  const { disabled, onKeyDown, onKeyUp } = props

  const handleKeyDown = useCallback<NonNullable<typeof onKeyDown>>(
    (ev) => {
      onKeyDown?.(ev)

      if (!ev.defaultPrevented && !disabled) {
        activate(ev)
      }
    },
    [activate, disabled, onKeyDown]
  )

  const handleKeyUp = useCallback<NonNullable<typeof onKeyUp>>(
    (ev) => {
      onKeyUp?.(ev)

      if (!ev.defaultPrevented && !disabled) {
        activate(ev)
      }
    },
    [activate, disabled, onKeyUp]
  )

  props = {
    ...props,
    role: props.role || 'button',
    tabIndex: props.tabIndex ?? (props.disabled ? -1 : 0), // Can still receive focus even when disabled
    'aria-disabled': props.disabled,
  }

  if (!props.disabled && isActivated) {
    props = {
      ...props,
      [VirtualActive]: true,
    }
  }

  if (props.disabled) {
    props.onClick = undefined
    props.onClickCapture = undefined
  }

  props = {
    ...props,
    onKeyDown: handleKeyDown,
    onKeyUp: handleKeyUp,
  }

  return props
}
