import { createContext } from 'react'
import type { Theme } from './theme.css'

/**
 * @internal
 */
export interface ThemeContext {
  className: string
  declarations: Theme
}

/**
 * @internal
 */
export const ThemeContext = createContext<ThemeContext | null>(null)

ThemeContext.displayName = 'ThemeContext'
