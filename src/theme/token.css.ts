import { createTheme } from '@vanilla-extract/css'
import { palette } from './palette'
import { typography } from './typography'

export const [tokenClass, token] = createTheme({
  palette,
  sizing: {
    width: {
      small: typography.body3.lineHeight,
      medium: typography.body2.lineHeight,
      large: typography.body1.lineHeight,
    },
    height: {
      small: '1.75rem',
      medium: '2rem',
      large: '2.5rem',
    },
    outline: {
      small: '1px',
      medium: '2px',
      large: '2px',
    },
    border: {
      small: '1px',
      medium: '1px',
      large: '2px',
    },
    radius: {
      small: '0.25rem',
      medium: '0.375rem',
      large: '0.5rem',
    },
    shadow: {
      small: '0 0.125rem 0.25rem',
      medium: '0 0 1rem 0.125rem',
      large: '0 0 2rem',
    },
  },
  spacing: {
    gap: {
      small: '0.25rem',
      medium: '0.5rem',
      large: '0.75rem',
    },
    padding: {
      small: '0.5rem',
      medium: '0.625rem',
      large: '0.75rem',
    },
    margin: {
      small: '0.75rem',
      medium: '1.5rem',
      large: '3rem',
    },
  },
  transition: {
    fast: '80ms ease-out allow-discrete',
    default: '160ms ease-out allow-discrete',
    slow: '240ms ease-out allow-discrete',
    slowest: '320ms ease-out allow-discrete',
  },
  typography,
} as const)
