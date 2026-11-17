const WCAG_CONTRAST_RATIO = 4.5
const WHITE = 'oklch(1 0 0)'
const BLACK = 'oklch(0 0 0)'
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
 * https://www.interaction-design.org/literature/article/ui-color-palette#1._choose_primary,_secondary,_and_accent/supplementary_colors_wisely-4
 */
export const palette = {
  primary1: 'oklch(1.00 0.006 264.82)',
  primary2: 'oklch(0.90 0.005 264.82)',
  primary3: 'oklch(0.80 0.004 264.82)',
  primary4: 'oklch(0.40 0.007 264.82)',
  primary5: 'oklch(0.30 0.006 264.82)',
  primary6: 'oklch(0.20 0.005 264.82)',

  secondary1: 'oklch(0.97 0.02 264.82)',
  secondary2: 'oklch(0.87 0.03 264.82)',
  secondary3: 'oklch(0.77 0.04 264.82)',
  secondary4: 'oklch(0.44 0.02 264.82)',
  secondary5: 'oklch(0.34 0.03 264.82)',
  secondary6: 'oklch(0.24 0.04 264.82)',

  // red=#D32F2F orange=#FF8C00 yellow=#FFD43B green=#4ACF87 blue=#3364E8
  // oklch(0.568 0.2002 26.41)
  // oklch(0.7505 0.1791 58.28)
  // oklch(0.8826 0.1648 92.22)
  // oklch(0.7639 0.156 155.81)
  // oklch(0.5499 0.2071 264.82)
  accentRed1: 'oklch(0.744 0.1972 26.41)',
  accentRed2: 'oklch(0.684 0.1982 26.41)',
  accentRed3: 'oklch(0.624 0.1992 26.41)',
  accentRed4: 'oklch(0.564 0.2002 26.41)',
  accentRed5: 'oklch(0.504 0.2012 26.41)',
  accentRed6: 'oklch(0.444 0.2022 26.41)',
  accentRed7: 'oklch(0.384 0.2032 26.41)',
  accentOrange1: 'oklch(0.909 0.1761 58.28)',
  accentOrange2: 'oklch(0.849 0.1771 58.28)',
  accentOrange3: 'oklch(0.789 0.1781 58.28)',
  accentOrange4: 'oklch(0.729 0.1791 58.28)',
  accentOrange5: 'oklch(0.669 0.1801 58.28)',
  accentOrange6: 'oklch(0.609 0.1811 58.28)',
  accentOrange7: 'oklch(0.549 0.1821 58.28)',
  accentYellow1: 'oklch(0.902 0.1643 92.22)',
  accentYellow2: 'oklch(0.842 0.1648 92.22)',
  accentYellow3: 'oklch(0.782 0.1653 92.22)',
  accentYellow4: 'oklch(0.722 0.1658 92.22)',
  accentYellow5: 'oklch(0.662 0.1663 92.22)',
  accentYellow6: 'oklch(0.602 0.1668 92.22)',
  accentYellow7: 'oklch(0.542 0.1673 92.22)',
  accentGreen1: 'oklch(0.872 0.1520 155.81)',
  accentGreen2: 'oklch(0.812 0.1530 155.81)',
  accentGreen3: 'oklch(0.752 0.1540 155.81)',
  accentGreen4: 'oklch(0.692 0.1550 155.81)',
  accentGreen5: 'oklch(0.632 0.1560 155.81)',
  accentGreen6: 'oklch(0.572 0.1570 155.81)',
  accentGreen7: 'oklch(0.512 0.1580 155.81)',
  accentBlue1: 'oklch(0.7299 0.2041 264.82)',
  accentBlue2: 'oklch(0.6699 0.2051 264.82)',
  accentBlue3: 'oklch(0.6099 0.2061 264.82)',
  accentBlue4: BASE_COLOR,
  accentBlue5: 'oklch(0.4899 0.2081 264.82)',
  accentBlue6: 'oklch(0.4299 0.2091 264.82)',
  accentBlue7: 'oklch(0.3699 0.2101 264.82)',

  semanticError1: 'oklch(0.59 0.25 22.5)',
  semanticError2: 'oklch(0.64 0.2 25.5)',
  semanticWarning1: 'oklch(0.68 0.2 64)',
  semanticWarning2: 'oklch(0.7 0.175 61.5)',
  semanticSuccess1: 'oklch(0.655 0.16 152.5)',
  semanticSuccess2: 'oklch(0.675 0.135 154)',
  semanticInfo1: 'oklch(0.66 0.19 242.5)',
  semanticInfo2: 'oklch(0.68 0.17 243.5)',

  white: WHITE,
  black: BLACK,
  transparent: TRANSPARENT,

  // 中性色系生成规则（优先级从高到低）：
  // 1. 格式规范：使用 OKLCH 颜色格式，色度 C = 0，色调 H = 0，亮度值使用小数表示
  // 2. 排列顺序：所有颜色按亮度从高到低排列（neutral1 最亮，neutral17 最暗）
  // 3. 亮度限制：
  //    - neutral1: L = 1.0
  //    - neutral2: L > 0.95
  //    - neutral9: L ≈ 0.67
  // 4. 步长控制：
  //    - 前段（neutral1→neutral9）：步长大致相同，误差 ≤ 0.001
  //    - 后段（neutral9→neutral17）：步长大致相同，误差 ≤ 0.001，且后段步长 ≈ 前段步长 × 1.618
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

  // 功能色系生成规则（优先级从高到低）：
  // 1. 格式规范：使用 OKLCH 颜色格式，色度 C = 0，色调 H = 0，亮度值和透明度值使用小数表示
  // 2. 亮度基准规则：
  //    - 浅色功能色（background1-4、border1-3、shadow1-3、overlay1）：使用 neutral10 的亮度值（0.6032725）
  //    - 深色功能色（background5-8、border4-6、shadow4-6、overlay2）：使用 neutral11 的亮度值（0.536545）
  // 3. 透明度递进规则：
  //    - 所有功能色组内相邻颜色透明度差值保持 0.20
  //    - 不同功能色组的透明度起始值可独立设置
  background1: 'oklch(0.6032725 0 0 / 0.12)',
  background2: 'oklch(0.6032725 0 0 / 0.32)',
  background3: 'oklch(0.6032725 0 0 / 0.52)',
  background4: 'oklch(0.6032725 0 0 / 0.72)',
  background5: 'oklch(0.536545 0 0 / 0.12)',
  background6: 'oklch(0.536545 0 0 / 0.32)',
  background7: 'oklch(0.536545 0 0 / 0.52)',
  background8: 'oklch(0.536545 0 0 / 0.72)',
  border1: 'oklch(0.6032725 0 0 / 0.15)',
  border2: 'oklch(0.6032725 0 0 / 0.35)',
  border3: 'oklch(0.6032725 0 0 / 0.55)',
  border4: 'oklch(0.536545 0 0 / 0.15)',
  border5: 'oklch(0.536545 0 0 / 0.35)',
  border6: 'oklch(0.536545 0 0 / 0.55)',
  shadow1: 'oklch(0.6032725 0 0 / 0.09)',
  shadow2: 'oklch(0.6032725 0 0 / 0.29)',
  shadow3: 'oklch(0.6032725 0 0 / 0.49)',
  shadow4: 'oklch(0.536545 0 0 / 0.09)',
  shadow5: 'oklch(0.536545 0 0 / 0.29)',
  shadow6: 'oklch(0.536545 0 0 / 0.49)',
  overlay1: 'oklch(0.6032725 0 0 / 0.15)',
  overlay2: 'oklch(0.536545 0 0 / 0.15)',
} as const
