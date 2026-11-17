import { theme } from '#theme'
import { createVar, keyframes } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const size = createVar()
const color = createVar()
const border = createVar()
const borderSize = createVar()
const animation = createVar()
const duration = createVar()

const SpinnerAnimation = keyframes({
  '0%': {
    clipPath: `polygon(50% 50%, 0% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%, 50% 0%)`,
    rotate: '0deg',
  },
  '20%': {
    clipPath: `polygon(50% 50%, 0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%)`,
  },
  '30%': {
    clipPath: `polygon(50% 50%, 0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 50% 100%, 50% 100%)`,
  },
  '40%': {
    clipPath: `polygon(50% 50%, 0% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)`,
  },
  '50%': {
    clipPath: `polygon(50% 50%, 50% 0%, 50% 0%, 100% 0%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)`,
  },
  '60%': {
    clipPath: `polygon(50% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 50%, 100% 100%, 50% 100%, 0% 100%, 0% 50%)`,
  },
  '70%': {
    clipPath: `polygon(50% 50%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 50% 100%, 0% 100%, 0% 50%)`,
  },
  '80%': {
    clipPath: `polygon(50% 50%, 0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 100%, 0% 50%)`,
  },
  '90%': {
    clipPath: `polygon(50% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%)`,
    rotate: '360deg',
  },
  '100%': {
    clipPath: `polygon(50% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%, 0% 50%)`,
  },
})

export const SpinnerStyle = recipe({
  base: {
    vars: {
      [color]: theme.spinner.color,
      [border]: `${borderSize} solid currentcolor`,
      [animation]: SpinnerAnimation,
      [duration]: theme.spinner.duration,
    },
    boxSizing: 'border-box',
    display: 'block',
    inlineSize: size,
    aspectRatio: '1 / 1',
    color,
    border,
    borderRadius: '50%',
    animation: `${duration} linear infinite ${animation}`,
  },
  variants: {
    size: {
      small: {
        vars: {
          [size]: theme.spinner.size.small,
          [borderSize]: '2px',
        },
      },
      medium: {
        vars: {
          [size]: theme.spinner.size.medium,
          [borderSize]: '2px',
        },
      },
      large: {
        vars: {
          [size]: theme.spinner.size.large,
          [borderSize]: '2px',
        },
      },
    },
  },
})
