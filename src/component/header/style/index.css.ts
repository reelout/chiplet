import { style } from '@vanilla-extract/css'

export const HeaderStyle = style({
  display: 'flex',
  gap: '0.75rem',
})

export const NavStyle = style({
  display: 'flex',
  gap: 'inherit',
  ':empty': {
    display: 'none',
  },
})
