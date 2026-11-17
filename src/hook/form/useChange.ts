import { useCallback } from 'react'
import type { ChangeCallback } from './useDefault'

interface Props {
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, boolean> | undefined
  onClick?: React.MouseEventHandler | undefined
}

export function useChange<P extends Props>(
  checked: boolean | undefined,
  props: P
) {
  const { onChange, onClick } = props

  const handleClick = useCallback<NonNullable<typeof onClick>>(
    (ev) => {
      onClick?.(ev)

      if (!ev.defaultPrevented) {
        onChange?.(ev, !checked)
      }
    },
    [checked, onChange, onClick]
  )

  props = {
    ...props,
    onClick: props.disabled ? undefined : handleClick,
  }

  return props
}
