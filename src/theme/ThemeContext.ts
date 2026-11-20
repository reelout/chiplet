import { createContext, type CSSProperties } from 'react'

/**
 * @internal
 */
export interface ThemeContext {
  className?: string | undefined
  style?: CSSProperties | undefined
}

/**
 * @internal
 */
export const ThemeContext = createContext<ThemeContext | null>(null)

ThemeContext.displayName = 'ThemeContext'
