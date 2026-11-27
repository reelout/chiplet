import clsx from 'clsx'
import type { ColorScheme } from './ColorScheme'
import { ThemeContext } from './ThemeContext'
import {
  DarkColorScheme,
  DarkLightColorScheme,
  GlobalContainerStyle,
  LightColorScheme,
} from './global.css'
import type { Theme } from './theme.css'

export interface ThemeProviderProps extends React.PropsWithChildren {
  colorScheme?: ColorScheme | undefined
  theme?: Theme | undefined
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { colorScheme = 'auto', theme = {}, children } = props

  const className = clsx(
    GlobalContainerStyle,
    colorScheme === 'light' && LightColorScheme,
    colorScheme === 'dark' && DarkColorScheme,
    colorScheme === 'dark light' && DarkLightColorScheme
  )

  return (
    <ThemeContext value={{ className, declarations: theme }}>
      {children}
    </ThemeContext>
  )
}
