import { createContext } from 'react'

/**
 * @internal
 */
export interface ThemeContext {
  className: string
}

/**
 * @internal
 */
export const ThemeContext = createContext<ThemeContext | null>(null)

ThemeContext.displayName = 'ThemeContext'
