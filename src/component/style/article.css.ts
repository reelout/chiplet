import { createVar, globalStyle, style } from '@vanilla-extract/css'

const gap = createVar()
const width = createVar()
const color = createVar()
const background = createVar()

export const ArticleStyle = style({
  vars: {
    [width]: '48rem',
    [color]: 'light-dark(#131313, #fff)',
    [background]: 'light-dark(#fff, #131313)',
  },
  maxInlineSize: width,
  paddingInline: '1.5rem',
  margin: 'auto',
  fontFamily: `'Proxima Nova', 'Myriad Set Pro', 'Lucida Grande', 'Helvetica Neue', Helvetica, Arial, Verdana, sans-serif`,
  fontSize: '0.875rem',
  lineHeight: '1.25rem',
})

globalStyle(`${ArticleStyle} h1, ${ArticleStyle} section`, {
  color,
  background,
})

globalStyle(
  ['h1', 'h2', 'h3', 'p', 'ul', 'ol', 'pre', 'hr', 'section']
    .map((selector) => `${ArticleStyle} ${selector}`)
    .join(', '),
  {
    maxInlineSize: width,
    margin: 'auto',
  }
)

globalStyle(`${ArticleStyle} h1`, {
  padding: '2.5rem 2rem',
  fontFamily: `'Proxima Nova', 'Segoe UI Light', Quicksand, 'Myriad Set Pro', 'Lucida Grande', sans-serif`,
  fontSize: '2rem',
  lineHeight: '3rem',
  textAlign: 'center',
})

globalStyle(`${ArticleStyle} h2`, {
  padding: '1rem 1.5rem 0.75rem 1.25rem',
  fontSize: '1.125rem',
  lineHeight: '1.75rem',
  borderInlineStart: '0.25rem solid #aaf',
})

globalStyle(`${ArticleStyle} h3`, {
  position: 'relative',
  marginBlock: '1.25rem',
})

globalStyle(`${ArticleStyle} h3::before`, {
  position: 'absolute',
  insetBlock: '0.1875rem 0.375rem',
  insetInlineStart: '-1.5rem',
  content: '',
  borderInlineStart: '0.25rem solid #999',
})

globalStyle(`${ArticleStyle} p, ${ArticleStyle} li`, {
  marginBlock: '1.25rem',
})

globalStyle(`${ArticleStyle} ul`, {
  paddingInlineStart: '1em',
  listStyle: 'circle',
})

globalStyle(`${ArticleStyle} ol`, {
  paddingInlineStart: '1em',
  listStyle: 'auto',
})

globalStyle(`${ArticleStyle} a`, {
  color: '#08c',
})

globalStyle(`${ArticleStyle} a:hover`, {
  color: '#15c',
  textDecoration: 'underline',
  textDecorationColor: '#58e',
})

globalStyle(`${ArticleStyle} a:focus-visible`, {
  outline: '1px dotted rgb(0 0 0 / 75%)',
  outlineOffset: '2px',
})

globalStyle(`${ArticleStyle} a[download]`, {
  vars: {
    [color]: 'light-dark(#fff, #fff)',
    [background]: 'light-dark(#acc, #222)',
  },
  display: 'inline-block',
  blockSize: '1.75rem',
  padding: '0 0.5rem',
  fontSize: '0.875rem',
  lineHeight: '1.75rem',
  color,
  background,
  borderRadius: '0.125rem',
})

globalStyle(`${ArticleStyle} :has(> a[download]:only-child)`, {
  paddingInline: '1.5rem',
})

globalStyle(`${ArticleStyle} a[download]:hover`, {
  color: '#fff',
  textDecoration: 'none',
  background: '#8aa',
})

globalStyle(`${ArticleStyle} a[download]:focus-visible`, {
  outline: '2px solid rgb(102 136 136 / 40%)',
  outlineOffset: '1px',
  background: '#688',
})

globalStyle(`${ArticleStyle} code`, {
  display: 'inline-block',
  padding: '0.125rem',
  fontFamily: `Monaco, 'Andale Mono', 'Bitstream Vera Sans Mono', Consolas, 'Courier New', monospace`,
  fontSize: '0.875rem',
  lineHeight: '1rem',
  verticalAlign: 'top',
  color: '#333',
  whiteSpace: 'pre',
  background: '#e5e5e5',
  borderRadius: '0.125rem',
})

globalStyle(`${ArticleStyle} code::selection`, {
  background: '#bbb',
})

globalStyle(`${ArticleStyle} section`, {
  padding: '0.25rem 1.5rem',
})

globalStyle(`${ArticleStyle} footer`, {
  vars: {
    [gap]: '1.25rem',
    [color]: '#aaf',
  },
  display: 'flex',
  gap,
  placeContent: 'center',
  placeItems: 'center',
  marginBlock: '2.5rem',
  overflow: 'clip',
  color,
})

globalStyle(`${ArticleStyle} footer::selection`, {
  color: '#88d',
  background: '#ccc',
})

globalStyle(`${ArticleStyle} footer strong, ${ArticleStyle} footer time`, {
  position: 'relative',
})

globalStyle(
  `${ArticleStyle} footer strong::before, ${ArticleStyle} footer time::after`,
  {
    position: 'absolute',
    insetBlockStart: '0.5625rem',
    inlineSize: width,
    blockSize: '0.125rem',
    content: '',
    background: color,
  }
)

globalStyle(`${ArticleStyle} footer strong::before`, {
  insetInlineEnd: '100%',
  marginInlineEnd: gap,
})

globalStyle(`${ArticleStyle} footer time::after`, {
  insetInlineStart: '100%',
  marginInlineStart: gap,
})
