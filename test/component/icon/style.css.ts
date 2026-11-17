import { theme } from '#theme'
import { style } from '@vanilla-extract/css'

export const ListStyle = style({
  display: 'grid',
  gridTemplate: 'auto / repeat(auto-fill, minmax(12.5rem, 1fr))',
  gap: '1.25rem',
})

export const ItemStyle = style({
  position: 'relative',
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  placeItems: 'center',
  padding: '1.25rem 0.75rem 1rem',
  textAlign: 'center',
  cursor: 'pointer',
  userSelect: 'none',
  backgroundColor: theme.background,
  border: theme.border,
  borderRadius: `calc(${theme.radius} * 2)`,
  cornerShape: 'squircle',
  boxShadow: theme.shadow,
  ':hover': {
    backgroundColor: theme.hover.background,
  },
})

export const ItemIconStyle = style({
  fontSize: '1.5rem',
})

export const ItemLabelStyle = style({
  alignSelf: 'stretch',
  overflow: 'clip',
  textOverflow: 'ellipsis',
  textAlign: 'center',
  whiteSpace: 'nowrap',
})
