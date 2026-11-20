import { createContext } from 'react'

/**
 * @internal
 */
export interface ThemeContext {
  className?: string | undefined
}

/**
 * @internal
 */
export const ThemeContext = createContext<ThemeContext | null>(null)

ThemeContext.displayName = 'ThemeContext'
