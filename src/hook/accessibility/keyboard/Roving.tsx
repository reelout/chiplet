import type { HTMLElementType, JSX } from 'react'
import { useKeyboard } from './useKeyboard'

type Props<T extends HTMLElementType> = JSX.IntrinsicElements[T] & {
  elementType?: T
}

export function Roving<T extends HTMLElementType = 'div'>(props: Props<T>) {
  props = useKeyboard(props)

  const { elementType: ElementType = 'div', ...attrs } = props as Props<'div'>

  return <ElementType {...attrs} />
}
