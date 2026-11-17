import { style } from '@vanilla-extract/css'

export const LayoutStyle = style({
  display: 'flex',
  flexDirection: 'column',
  gap: '1.25rem',
})

export const ItemStyle = style({
  display: 'flex',
  gap: '0.5rem',
  placeItems: 'center',
})
