import { createContext } from 'react'

export interface ThemeContext {
  className?: string | undefined
}

export const ThemeContext = createContext<ThemeContext | null>(null)

ThemeContext.displayName = 'ThemeContext'
