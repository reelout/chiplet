import { createContext, type CSSProperties } from 'react'

/**
 * @internal
 */
export interface ThemeScopeValue {
  className: string
  style?: CSSProperties | undefined
}

/**
 * @internal
 */
export const ThemeContext = createContext<ThemeScopeValue | null>(null)

ThemeContext.displayName = 'ThemeContext'
