import type { Properties } from 'csstype'

const BODY_FONT_FAMILY = `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif`
const HEADING_FONT_FAMILY = `'Avenir Next', 'Proxima Nova', ${BODY_FONT_FAMILY}`
const MONOSPACE_FONT_FAMILY = `ui-monospace, Consolas, Menlo, Monaco, 'Roboto Mono', Courier, monospace`

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font
 */
type Typography = Pick<
  Properties,
  | 'fontFamily'
  | 'fontSize'
  | 'fontStyle'
  | 'fontVariant'
  | 'fontWeight'
  | 'lineHeight'
>

/**
 * https://www.w3.org/TR/css-fonts-3/#font-size-prop
 *
 * https://app.uxcel.com/courses/typography-basics/typographic-hierarchy-107
 */
export const typography = {
  heading1: {
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: '2rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '2.5rem',
  } as const satisfies Typography,
  heading2: {
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: '1.5rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '2rem',
  } as const satisfies Typography,
  heading3: {
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: '1.25rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '1.75rem',
  } as const satisfies Typography,
  heading4: {
    fontFamily: HEADING_FONT_FAMILY,
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '1.5rem',
  } as const satisfies Typography,
  body1: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '400',
    fontVariant: 'normal',
    lineHeight: '1.5rem',
  } as const satisfies Typography,
  body2: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '400',
    fontVariant: 'normal',
    lineHeight: '1.25rem',
  } as const satisfies Typography,
  body3: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '0.75rem',
    fontStyle: 'normal',
    fontWeight: '400',
    fontVariant: 'normal',
    lineHeight: '1rem',
  } as const satisfies Typography,
  caption1: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '1.25rem',
  } as const satisfies Typography,
  caption2: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '0.75rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '1rem',
  } as const satisfies Typography,
  quote1: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '1rem',
    fontStyle: 'italic',
    fontWeight: '400',
    fontVariant: 'normal',
    lineHeight: '1.5rem',
  } as const satisfies Typography,
  quote2: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '0.875rem',
    fontStyle: 'italic',
    fontWeight: '400',
    fontVariant: 'normal',
    lineHeight: '1.25rem',
  } as const satisfies Typography,
  code1: {
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '400',
    fontVariant: 'normal',
    lineHeight: '1.5rem',
  } as const satisfies Typography,
  code2: {
    fontFamily: MONOSPACE_FONT_FAMILY,
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '400',
    fontVariant: 'normal',
    lineHeight: '1.25rem',
  } as const satisfies Typography,
  button1: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '1rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '1.5rem',
  } as const satisfies Typography,
  button2: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '0.875rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '1.25rem',
  } as const satisfies Typography,
  button3: {
    fontFamily: BODY_FONT_FAMILY,
    fontSize: '0.75rem',
    fontStyle: 'normal',
    fontWeight: '600',
    fontVariant: 'normal',
    lineHeight: '1rem',
  } as const satisfies Typography,
}
