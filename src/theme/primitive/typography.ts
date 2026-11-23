import type { Properties } from 'csstype'

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font
 */
export type Typography = Pick<
  Properties,
  | 'fontFamily'
  | 'fontSize'
  | 'fontWidth'
  | 'fontStyle'
  | 'fontVariant'
  | 'fontWeight'
  | 'lineHeight'
  | 'letterSpacing'
>

const sansFontFamily = `system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Helvetica, Arial, sans-serif`

/**
 * - https://www.w3.org/TR/css-fonts-3/#font-size-prop
 * - https://app.uxcel.com/courses/typography-basics/typographic-hierarchy-107
 */
export const typography = {
  fontFamily: {
    display: `'Avenir Next', 'Proxima Nova', ${sansFontFamily}`,
    sans: sansFontFamily,
    serif: `ui-serif, 'New York', Georgia, Cambria, 'Times New Roman', Times, serif`,
    monospace: `ui-monospace, Consolas, Menlo, Monaco, 'Roboto Mono', Courier, monospace`,
  },
  fontSize: {
    1: '0.75rem', // 12px (草稿 body3 / caption2 / button3)
    2: '0.875rem', // 14px (草稿 body2 / caption1 / quote2 / code2 / button2)
    3: '1rem', // 16px (草稿 heading4 / body1 / quote1 / code1 / button1)
    4: '1.125rem', // 18px (推算)
    5: '1.25rem', // 20px (草稿 heading3)
    6: '1.5rem', // 24px (草稿 heading2)
    7: '1.75rem', // 28px (推算)
    8: '2rem', // 32px (草稿 heading1)
    9: '2.5rem', // 40px (推算)
  },
  lineHeight: {
    1: '1rem', // 16px -> 对应 fontSize[1]
    2: '1.25rem', // 20px -> 对应 fontSize[2]
    3: '1.5rem', // 24px -> 对应 fontSize[3]
    4: '1.625rem', // 26px -> 对应 fontSize[4]
    5: '1.75rem', // 28px -> 对应 fontSize[5]
    6: '2rem', // 32px -> 对应 fontSize[6]
    7: '2.25rem', // 36px -> 对应 fontSize[7]
    8: '2.5rem', // 40px -> 对应 fontSize[8]
    9: '3rem', // 48px -> 对应 fontSize[9]
  },
  fontWeight: {
    1: '300',
    2: '400', // 草稿 body / quote / code
    3: '500',
    4: '600', // 草稿 heading / caption / button
    5: '700',
  },
  fontWidth: {
    1: '75%',
    2: '87.5%',
    3: '100%',
    4: '112.5%',
    5: '125%',
  },
  fontStyle: {
    normal: 'normal',
    italic: 'italic', // 草稿 quote
    oblique: 'oblique',
  },
  fontVariant: {
    normal: 'normal',
    tabular: 'tabular-nums',
    smallCaps: 'small-caps',
  },
  letterSpacing: {
    1: '-0.04em',
    2: '-0.02em',
    3: '-0.01em',
    4: '0em',
    5: '0.02em',
    6: '0.05em',
  },
} as const
