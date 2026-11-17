import { useInteractive } from '#hook'
import clsx from 'clsx'
import type { HTMLElementType } from 'react'
import { InteractiveStyle } from './style/index.css'

type Props<T extends HTMLElementType> = React.ComponentProps<T> & {
  elementType?: T
  disabled?: boolean | undefined
}

/**
 * https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/blob/main/docs/rules/anchor-is-valid.md#case-i-want-to-perform-an-action-and-need-a-clickable-ui-element
 */
export function Interactive<T extends HTMLElementType = 'div'>(
  props: Props<T>
) {
  props = useInteractive(props)

  const {
    elementType: ElementType = 'div',
    disabled,
    ...attrs
  } = props as Props<'div'>

  return (
    <ElementType
      {...attrs}
      className={clsx(InteractiveStyle, attrs.className)}
    />
  )
}
