const WCAG_CONTRAST_RATIO = 4.5
export const WHITE = 'oklch(1 0 0)'
export const BLACK = 'oklch(0 0 0)'
export const TRANSPARENT = 'oklch(0 0 0 / 0%)'
export const BASE_COLOR = 'oklch(0.5499 0.2071 264.82)' // #3364E8 contrast ratio on white = 5.08

/**
 * - https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/contrast-color
 * - https://drafts.csswg.org/css-color-6/#funcdef-contrast-color
 */
export function contrastColor(
  background: string,
  foreground: readonly string[],
  targetContrast = WCAG_CONTRAST_RATIO
) {
  const WHITE = '#FFFFFF'
  const BLACK = '#000000'

  let currentColor = WHITE
  let currentContrast = Number.NEGATIVE_INFINITY

  for (const color of foreground.concat(WHITE, BLACK)) {
    const contrast = contrastRatio(color, background)

    if (contrast >= targetContrast) {
      currentColor = color
      break
    }

    if (contrast > currentContrast) {
      currentContrast = contrast
      currentColor = color
    }
  }

  return currentColor
}

/**
 * - https://www.w3.org/TR/UNDERSTANDING-WCAG20/visual-audio-contrast-contrast.html#contrast-ratiodef
 * - https://developer.mozilla.org/en-US/docs/Web/Accessibility/Guides/Understanding_WCAG/Perceivable/Color_contrast
 */
export function contrastRatio(foreground: string, background: string) {
  let L1 = relativeLuminance(rgbaToRgb(foreground, background))
  let L2 = relativeLuminance(background)
  ;[L1, L2] = [Math.max(L1, L2), Math.min(L1, L2)]
  return (L1 + 0.05) / (L2 + 0.05)
}

/**
 * https://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
 */
function relativeLuminance(color: string) {
  const hex = color.slice(1)
  const R = sRGB(hex.slice(0, 2))
  const G = sRGB(hex.slice(2, 4))
  const B = sRGB(hex.slice(4, 6))
  return 0.2126 * R + 0.7152 * G + 0.0722 * B
}

function sRGB(hex: string) {
  const value = hexToDec(hex) / 255
  return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4
}

// https://stackoverflow.com/a/21576659
export function rgbaToRgb(foreground: string, background: string) {
  const hex1 = foreground.slice(1)
  const hex2 = background.slice(1)

  let alpha = hexToDec(hex1.slice(6, 8)) / 255

  if (Number.isNaN(alpha)) alpha = 1

  return [
    '#',
    decToHex(
      Math.round(
        alpha * hexToDec(hex1.slice(0, 2)) +
          (1 - alpha) * hexToDec(hex2.slice(0, 2))
      )
    ),
    decToHex(
      Math.round(
        alpha * hexToDec(hex1.slice(2, 4)) +
          (1 - alpha) * hexToDec(hex2.slice(2, 4))
      )
    ),
    decToHex(
      Math.round(
        alpha * hexToDec(hex1.slice(4, 6)) +
          (1 - alpha) * hexToDec(hex2.slice(4, 6))
      )
    ),
  ].join('')
}

function hexToDec(hex: string) {
  return Number.parseInt(hex, 16)
}

function decToHex(dec: number) {
  return dec.toString(16).padStart(2, '0')
}

export function mix<T extends string, U extends string>(color1: T, color2: U) {
  return `color-mix(in oklch, ${color1}, ${color2})` as const
}

export function tint<T extends string, U extends number>(color: T, percent: U) {
  return `color-mix(in oklch, ${color}, white ${percent}%)` as const
}

export function shade<T extends string, U extends number>(
  color: T,
  percent: U
) {
  return `color-mix(in oklch, ${color}, black ${percent}%)` as const
}

export function tone<T extends string, U extends number>(color: T, percent: U) {
  return `color-mix(in oklch, ${color}, gray ${percent}%)` as const
}

/**
 * - https://developer.chrome.com/blog/css-relative-color-syntax#adjust_opacity_a_color
 * - https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Colors/Using_relative_colors
 */
export function opacity<T extends string, U extends number>(
  color: T,
  percent: U
) {
  return `color-mix(in oklch, ${color} ${percent}%, transparent)` as const
}

export function complement<T extends string>(color: T) {
  return `hsl(from ${color} calc(h + 180) s l)` as const
}

/**
 * https://ixdf.org/literature/article/ui-color-palette#how_to_create_a_ui_color_palette_trends_and_best_practices-3
 */
export const palette = {
  white: WHITE,
  black: BLACK,
  transparent: TRANSPARENT,

  neutral1: 'oklch(1 0 0)',
  neutral2: 'oklch(0.95875 0 0)',
  neutral3: 'oklch(0.9175 0 0)',
  neutral4: 'oklch(0.87625 0 0)',
  neutral5: 'oklch(0.835 0 0)',
  neutral6: 'oklch(0.79375 0 0)',
  neutral7: 'oklch(0.7525 0 0)',
  neutral8: 'oklch(0.71125 0 0)',
  neutral9: 'oklch(0.67 0 0)',
  neutral10: 'oklch(0.6032725 0 0)',
  neutral11: 'oklch(0.536545 0 0)',
  neutral12: 'oklch(0.4698175 0 0)',
  neutral13: 'oklch(0.40309 0 0)',
  neutral14: 'oklch(0.3363625 0 0)',
  neutral15: 'oklch(0.269635 0 0)',
  neutral16: 'oklch(0.2029075 0 0)',
  neutral17: 'oklch(0.13618 0 0)',

  // 品牌基准色阶（定制主题时覆盖此组即可）
  brand1: 'oklch(0.7299 0.2041 264.82)',
  brand2: 'oklch(0.6699 0.2051 264.82)',
  brand3: 'oklch(0.6099 0.2061 264.82)',
  brand4: BASE_COLOR,
  brand5: 'oklch(0.4899 0.2081 264.82)',
  brand6: 'oklch(0.4299 0.2091 264.82)',
  brand7: 'oklch(0.3699 0.2101 264.82)',

  red1: 'oklch(0.744 0.1972 26.41)',
  red2: 'oklch(0.684 0.1982 26.41)',
  red3: 'oklch(0.624 0.1992 26.41)',
  red4: 'oklch(0.564 0.2002 26.41)',
  red5: 'oklch(0.504 0.2012 26.41)',
  red6: 'oklch(0.444 0.2022 26.41)',
  red7: 'oklch(0.384 0.2032 26.41)',

  orange1: 'oklch(0.909 0.1761 58.28)',
  orange2: 'oklch(0.849 0.1771 58.28)',
  orange3: 'oklch(0.789 0.1781 58.28)',
  orange4: 'oklch(0.729 0.1791 58.28)',
  orange5: 'oklch(0.669 0.1801 58.28)',
  orange6: 'oklch(0.609 0.1811 58.28)',
  orange7: 'oklch(0.549 0.1821 58.28)',

  amber1: 'oklch(0.9055 0.1702 75.25)',
  amber2: 'oklch(0.8455 0.17095 75.25)',
  amber3: 'oklch(0.7855 0.1717 75.25)',
  amber4: 'oklch(0.7255 0.17245 75.25)',
  amber5: 'oklch(0.6655 0.1732 75.25)',
  amber6: 'oklch(0.6055 0.17395 75.25)',
  amber7: 'oklch(0.5455 0.1747 75.25)',

  yellow1: 'oklch(0.902 0.1643 92.22)',
  yellow2: 'oklch(0.842 0.1648 92.22)',
  yellow3: 'oklch(0.782 0.1653 92.22)',
  yellow4: 'oklch(0.722 0.1658 92.22)',
  yellow5: 'oklch(0.662 0.1663 92.22)',
  yellow6: 'oklch(0.602 0.1668 92.22)',
  yellow7: 'oklch(0.542 0.1673 92.22)',

  green1: 'oklch(0.872 0.1520 155.81)',
  green2: 'oklch(0.812 0.1530 155.81)',
  green3: 'oklch(0.752 0.1540 155.81)',
  green4: 'oklch(0.692 0.1550 155.81)',
  green5: 'oklch(0.632 0.1560 155.81)',
  green6: 'oklch(0.572 0.1570 155.81)',
  green7: 'oklch(0.512 0.1580 155.81)',

  blue1: 'oklch(0.7299 0.2041 264.82)',
  blue2: 'oklch(0.6699 0.2051 264.82)',
  blue3: 'oklch(0.6099 0.2061 264.82)',
  blue4: 'oklch(0.5499 0.2071 264.82)',
  blue5: 'oklch(0.4899 0.2081 264.82)',
  blue6: 'oklch(0.4299 0.2091 264.82)',
  blue7: 'oklch(0.3699 0.2101 264.82)',
} as const
