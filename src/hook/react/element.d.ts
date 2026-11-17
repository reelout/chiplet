import type { HTMLElementType } from 'react'

export type HTMLElementRef<T extends HTMLElementType> =
  T extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[T] : never

/**
 * [MDN](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes)
 */
export interface GlobalAttributes {
  className?: string | undefined
  dir?: 'ltr' | 'rtl' | 'auto' | (string & {}) | undefined
  id?: string | undefined
  inert?: boolean | undefined
  lang?: string | undefined
  role?: React.AriaRole | undefined
  style?: React.CSSProperties | undefined
  tabIndex?: number | undefined
  title?: string | undefined
}

export interface SlotAttributes<S extends object> {
  slot?: S | undefined
}
