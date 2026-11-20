import clsx from 'clsx'
import type { ColorScheme } from './ColorScheme'
import { ThemeContext } from './ThemeContext'
import {
  DarkColorScheme,
  GlobalContainerStyle,
  LightColorScheme,
} from './global.css'

export interface ThemeProviderProps extends React.PropsWithChildren {
  colorScheme?: ColorScheme | undefined
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { colorScheme = 'auto', children } = props

  const className = clsx(
    GlobalContainerStyle,
    colorScheme === 'light' && LightColorScheme,
    colorScheme === 'dark' && DarkColorScheme
  )

  return <ThemeContext value={{ className }}>{children}</ThemeContext>
}
