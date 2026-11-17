import { style } from '@vanilla-extract/css'

export const Base = style({
  boxSizing: 'border-box',
  display: 'grid',
  gridAutoFlow: 'column',
  gap: '1.25rem',
  placeContent: 'center',
  placeItems: 'center',
  inlineSize: '100vi',
  blockSize: '100vb',
  paddingInline: '2.5rem',
  margin: 'auto',
})

export const Flex = style([
  Base,
  {
    gridTemplate: 'auto / 1fr',
    gridAutoFlow: 'row',
    maxInlineSize: '20rem',
  },
])

export const Grid = style([
  Base,
  {
    gridTemplate: 'repeat(3, auto) / auto',
  },
])
