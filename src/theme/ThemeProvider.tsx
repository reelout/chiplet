import clsx from 'clsx'
import { ThemeContext } from './ThemeContext'
import {
  DarkColorScheme,
  GlobalContainerStyle,
  LightColorScheme,
} from './global.css'

export type ThemeColorScheme = 'auto' | 'light' | 'dark'

export interface ThemeProviderProps extends React.ComponentProps<'div'> {
  colorScheme?: ThemeColorScheme | undefined
}

export function ThemeProvider(props: ThemeProviderProps) {
  const { colorScheme = 'auto', className, style, children, ...attrs } = props

  const themeClassName = clsx(
    GlobalContainerStyle,
    colorScheme === 'light' && LightColorScheme,
    colorScheme === 'dark' && DarkColorScheme
  )

  return (
    <div {...attrs} className={clsx(themeClassName, className)} style={style}>
      <ThemeContext value={{ className: themeClassName }}>
        {children}
      </ThemeContext>
    </div>
  )
}
