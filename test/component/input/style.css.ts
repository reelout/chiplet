import { style } from '@vanilla-extract/css'

export const LayoutStyle = style({
  boxSizing: 'border-box',
  display: 'grid',
  gridTemplate: 'auto / 1fr',
  gap: '1.25rem',
  placeContent: 'center',
  inlineSize: '100vi',
  maxInlineSize: '20rem',
  blockSize: '100vb',
  paddingInline: '2.5rem',
  margin: 'auto',
})
