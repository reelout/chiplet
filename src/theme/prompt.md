你是一名专业的设计师，你非常仔细地理解需求，经过深思熟虑，按步骤，逐步地设计出一套「设计系统」；

目标：

- 能方便地自定义主题：可以只写想定制的部分
- 能方便地使用：可以 style({ color: theme.button.primary.background }) 直接使用，theme.button.primary.background 指向一个 CSS Variable

要求：

- Three-Tier Token Architecture：原始、语义、组件；
- 确定好一套统一的术语，术语要专业的，不需要为了 glossary 简短而使用简写，比如不要 sm 而是用 small 全称：
- 详细罗列具体包含哪些内容，要有代码示例（typescript）
  - createTheme from '@vanilla-extract/css'；
  - px 单位统一换为 rem (1rem=16px)；
  - token value 统一为 string；
  - token value 可以放心使用 CSS function 'light-dark()'；
- 最终 theme 要扁平，最多 4 级（count theme itself），比如 theme.button.primary.background；
- 最终 color 要扁平，最多 4 级（count color itself），比如 color.background.primary.hover；

---

## 详细设计 Primitive Token

> status: DONE

- 避免 border.borderX 这样重复「类别」名字，偏好于 `border = { number: value }` 这样编号，每阶 value 不可相同，尽量 <=9 阶，根据情况可以有第 0/none/full 阶
- 将「类别」统一为单数/体系名词，考虑以下「类别」，整理「类别」顺序（不可直接使用「字母」顺序）
  - border：边框粗细刻度
  - filter：视觉滤镜原子（背景模糊、色彩滤镜数值刻度）
  - motion：动画时长与缓动曲线原子与行为
  - opacity：透明度刻度
  - palette：原始色阶与基础色彩，OKLCH，中性色 17 阶，品牌色&彩色 7 阶即可；prefer neutralX over neutral[x] or neutral00X or neutralX00，考虑 neutral1->2->3...->n 这样编号；
  - radius：圆角步长刻度
  - shadow：基础投影参数组合；考虑用户自定义主题 shadow 可能是用逗号分隔的多层阴影（叠加效果，比如 `0 10px 25px -5px light-dark(#0f172a1f, #0000008c), 0 0 0 1px light-dark(#0f172a0f, #ffffff14)`）；绝不可以使用类似于 var(--shadow-color) 这样的方案；绝不可以没有 primitive.shadow；请好好考虑 light/dark mode shadow 颜色如何处理呢？如果有颜色则可以写为 `0 10px 25px -5px light-dark(#0f172a1f, #0000008c)` 是吗？如果 primitive.shadow 没有颜色，那么这个 shadow color 又体现在 primitive 何处呢？主流方案都是带上颜色还是不带上颜色的呢？有什么参考方案吗？
  - sizing：宽高、图标、控件等比例尺寸刻度
  - spacing：内边距、外边距、间距步长刻度；需要分 margin/padding 吗？需要考虑 gap 吗？或是需要在 semantic 里做区分？
  - typography：字体族、字号、字重、行高、字距等排版原子（'fontFamily' 'fontSize' 'fontWidth' 'fontStyle' 'fontVariant' 'fontWeight' 'lineHeight' 'letterSpacing'）；lineHeight 与 fontSize 一一对应；lineHeight 都带 rem 单位；lineHeight 与 fontSize 可以像 1->2->3...->n 那样编号；
- 不需要考虑 icon 高度，可以从 lineHeight 推算出来
- 不需要 zIndex，因为使用 Top Layer

```typescript
export const border = {
  none: '0rem',
  1: '0.0625rem', // 1px (草稿 border.small / border.medium / outline.small)
  2: '0.125rem', // 2px (草稿 border.large / outline.medium / outline.large)
  3: '0.1875rem', // 3px (推算)
  4: '0.25rem', // 4px (推算)
} as const

export const filter = {
  blur: {
    none: '0rem',
    1: '0.125rem', // 2px
    2: '0.25rem', // 4px
    3: '0.5rem', // 8px
    4: '0.75rem', // 12px
    5: '1rem', // 16px
    6: '1.5rem', // 24px
    7: '2.5rem', // 40px
  },
  brightness: {
    1: '0.75',
    2: '0.9',
    3: '0.95',
    4: '1',
    5: '1.05',
    6: '1.1',
    7: '1.25',
  },
  saturate: {
    1: '0',
    2: '0.5',
    3: '1',
    4: '1.25',
    5: '1.5',
    6: '2',
  },
} as const

export const motion = {
  duration: {
    none: '0ms',
    1: '80ms', // 草稿 fast
    2: '160ms', // 草稿 default
    3: '240ms', // 草稿 slow
    4: '320ms', // 草稿 slowest
    5: '480ms', // 推算（6 × 80ms）
    6: '640ms', // 推算（8 × 80ms）
  },
  easing: {
    linear: 'linear',
    easeOut: 'ease-out', // 草稿默认缓动
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  behavior: {
    normal: 'normal',
    allowDiscrete: 'allow-discrete', // 草稿离散属性过渡支持
  },
} as const

export const opacity = {
  none: '0',
  1: '0.09', // 草稿 shadow1 / shadow4
  2: '0.12', // 草稿 background1 / background5
  3: '0.15', // 草稿 border1 / overlay1
  4: '0.29', // 草稿 shadow2 / shadow5（补齐阴影中阶）
  5: '0.32', // 草稿 background2 / background6
  6: '0.35', // 草稿 border2 / border5
  7: '0.49', // 草稿 shadow3 / shadow6（补齐阴影高阶）
  8: '0.52', // 草稿 background3 / background7
  9: '0.72', // 草稿 background4 / background8
  full: '1',
} as const

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

export const radius = {
  none: '0rem',
  1: '0.125rem', // 2px  (推算)
  2: '0.25rem', // 4px  (草稿 radius.small)
  3: '0.375rem', // 6px  (草稿 radius.medium)
  4: '0.5rem', // 8px  (草稿 radius.large)
  5: '0.75rem', // 12px (推算)
  6: '1rem', // 16px (推算)
  7: '1.5rem', // 24px (推算)
  full: '9999rem',
} as const

const lightShadow1 = 'oklch(0.6032725 0 0 / 0.09)'
const darkShadow1 = 'oklch(0.536545 0 0 / 0.09)'
const lightShadow2 = 'oklch(0.6032725 0 0 / 0.29)'
const darkShadow2 = 'oklch(0.536545 0 0 / 0.29)'
const lightShadow3 = 'oklch(0.6032725 0 0 / 0.49)'
const darkShadow3 = 'oklch(0.536545 0 0 / 0.49)'

/**
 * 结合草稿的阴影几何参数与 shadow1–shadow6 色彩规则：
 * 1: 贴合微投影（草稿 shadow.small）
 * 2: 轻度悬浮（推算过渡阶）
 * 3: 卡片悬浮（草稿 shadow.medium）
 * 4: 弹窗/抽屉（草稿 shadow.large）
 * 5: 高层级浮层（推算）
 */
export const shadow = {
  none: 'none',
  1: `0 0.125rem 0.25rem light-dark(${lightShadow1}, ${darkShadow1})`,
  2: `0 0.25rem 0.5rem 0.0625rem light-dark(${lightShadow1}, ${darkShadow1})`,
  3: `0 0 1rem 0.125rem light-dark(${lightShadow2}, ${darkShadow2})`,
  4: `0 0 2rem light-dark(${lightShadow2}, ${darkShadow2})`,
  5: `0 0.5rem 3rem 0.25rem light-dark(${lightShadow3}, ${darkShadow3})`,
} as const

export const sizing = {
  1: '1rem', // 16px (草稿 width.small / typography.lineHeight[1])
  2: '1.25rem', // 20px (草稿 width.medium / typography.lineHeight[2])
  3: '1.5rem', // 24px (草稿 width.large / typography.lineHeight[3])
  4: '1.75rem', // 28px (草稿 height.small)
  5: '2rem', // 32px (草稿 height.medium)
  6: '2.5rem', // 40px (草稿 height.large)
  7: '3rem', // 48px (推算)
  8: '4rem', // 64px (推算)
  9: '8rem', // 128px (推算)
} as const

export const spacing = {
  none: '0rem',
  1: '0.125rem', // 2px  (推算微间距)
  2: '0.25rem', // 4px  (草稿 gap.small)
  3: '0.5rem', // 8px  (草稿 gap.medium / padding.small)
  4: '0.625rem', // 10px (草稿 padding.medium)
  5: '0.75rem', // 12px (草稿 gap.large / padding.large / margin.small)
  6: '1rem', // 16px (推算过渡阶)
  7: '1.5rem', // 24px (草稿 margin.medium)
  8: '2rem', // 32px (推算过渡阶)
  9: '3rem', // 48px (草稿 margin.large)
} as const

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

// primitive.css.ts
import { createTheme } from '@vanilla-extract/css'
import { border } from './primitive/border'
import { filter } from './primitive/filter'
import { motion } from './primitive/motion'
import { opacity } from './primitive/opacity'
import { palette } from './primitive/palette'
import { radius } from './primitive/radius'
import { shadow } from './primitive/shadow'
import { sizing } from './primitive/sizing'
import { spacing } from './primitive/spacing'
import { typography } from './primitive/typography'

export const [primitiveClass, primitive] = createTheme({
  palette,
  opacity,
  typography,
  spacing,
  sizing,
  radius,
  border,
  shadow,
  filter,
  motion,
})
```

---

## 详细设计 Semantic Token

> status: PENDING

- 必须用 'light-dark()'
- 统一必须使用“视觉属性/视觉类型优先”的命名结构（<property>.[role].[intent|status|emphasis|state].[intent|status|emphasis|state]）
  - required: property
    - enum: color typography spacing sizing radius border shadow opacity filter motion
    - 统一为单数/体系名词，仔细考虑顺序（不可直接使用「字母」顺序）
  - optional: 2nd segment (role), 3rd segment (intent|status|emphasis|state), 4th segment (intent|status|emphasis|state)
- prefer color.{foreground,background,...}.primary.hover
- 禁用出现任何 camelCase 命名；
- 禁用出现任何 kebab-case 命名；
- 禁用出现任何 snake_case 命名；
- 禁用出现 'on' 相关命名；
- 禁用出现 'brand' 相关命名；
- 禁用出现具体色彩名：比如 red/green/blue 等等；
- 区分好 background / surface / ...etc.，有必要多个？要不要统一为一个呢？
  - 关于 dialog/popover 的「遮罩」？也归入 background 吗？或是 mask / overlay / scrim / backdrop 还是什么呢？
  - 有关于 viewport 的 background，应该是什么？是 background / viewport / body / canvas 或者是什么呢？或者类似于「遮罩」那样单独一类，是 paper / viewport / body / canvas 吗或者是其它？
- 考虑好 inverse color 位置；
- 考虑好 disabled color 位置；
- 考虑好 "success warning error info" 放哪儿？
  - 可考虑命名为 feedback；
  - 'warning' 使用 amber 色系；
- 考虑好 button 会有多种颜色
  - 在 semantic token 里边如何体现多种按钮颜色？注意 color.background.primary 是背景色，不是给按钮来使用的；
  - 可考虑命名为 action；
  - ‘红色’ 按钮与上述的 'error' 是同样概念吗？若不相同，那么在 semantic 里需要区分开来吗？

---

你只需要输出「语义层」的“词表”即可，之后我们再继续讨论更上层的设计。

---

design system Three-Tier Token Architecture：原始、语义、组件；
Primitive Token：palette, opacity, typography, spacing, sizing, radius, border, shadow, filter, motion；
Semantic Token：prefer color.{foreground,background}.primary；统一必须使用“视觉属性/视觉类型优先”的命名结构（<property={color typography spacing sizing radius border shadow opacity filter motion}>.<role>.[intent|status](optional).[emphasis|state](optional)），映射为真实嵌套对象结构；你需要根据“视觉属性/视觉类型优先”提供10套「命名」方案；先仔细理解什么是视觉属性/视觉类型（比如颜色），然后再拆解后面的 <role> 以及更后面的；必须仔细地考虑每一套命名方案所使用的 keys/names 是统一的专业的规范的，是能够直接用于定义 `semantic = {}` 对象的；不用考虑 zIndex；先别动手去写具体实现；最后好好评估这些方案优劣，只输出评分最高的1套，显示为表格；

---

- prefer primary.background over primaryBackground
- prefer background/backgroundHover/backgroundActive/backgroundFocus over background.{base|normal|default|anything else}/background.hover/background.active/background.focus；

---

| Property   | Role 全量                                           | 第三层：Intent / Status                                                     | 第四层：Emphasis / State                                                                             | 默认键 / 约束                                                                | 示例路径                                                                  |
| ---------- | --------------------------------------------------- | --------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| color      | foreground                                          | primary, secondary, neutral, inverse, success, warning, danger, error, info | subtle, default, strong, hover, pressed, active, disabled, focus, selected, visited, interactive     | 有第四层对象时显式 default；inverse 仅放第三层；error 用于错误文本和校验文本 | color.foreground.primary.default                                          |
| color      | background                                          | primary, secondary, neutral, inverse, success, warning, danger, error, info | subtle, default, strong, hover, pressed, active, disabled, selected                                  | 有第四层对象时显式 default；不使用 focus                                     | color.background.primary.subtle                                           |
| color      | outline                                             | primary, secondary, neutral, inverse, danger, success, warning, error, info | subtle, default, strong, hover, focus, disabled, selected                                            | 有第四层对象时显式 default；破坏性边界用 danger；校验错误边界用 error        | color.outline.danger.focus                                                |
| color      | action                                              | primary, secondary, neutral, danger                                         | subtle, default, strong, hover, pressed, disabled, focus, selected                                   | 有第四层对象时显式 default；不使用 error、inverse、status                    | color.action.primary.hover                                                |
| color      | feedback                                            | success, warning, error, info                                               | subtle, default, strong                                                                              | 有第四层对象时显式 default；仅表达反馈强调，不表达交互状态                   | color.feedback.error.default                                              |
| color      | overlay                                             | neutral, inverse                                                            | subtle, default, strong, disabled                                                                    | 有第四层对象时显式 default；仅用于遮罩和浮层背景                             | color.overlay.neutral.default                                             |
| typography | display, title, heading, body, label, caption, code | 不使用                                                                      | subtle, default, strong                                                                              | 有第四层对象时显式 default                                                   | typography.body.default；typography.label.strong；typography.code.default |
| spacing    | inset, stack, inline, gap, section, gutter          | 不使用                                                                      | tight, compact, default, comfortable, loose, spacious                                                | 有第四层对象时显式 default                                                   | spacing.inset.default；spacing.stack.loose                                |
| sizing     | control, icon, container, avatar, hitArea           | 不使用                                                                      | xs, sm, default, lg, xl, extraLarge, compact, narrow, wide, full                                     | 有第四层对象时显式 default                                                   | sizing.control.default；sizing.icon.sm                                    |
| radius     | control, container, surface, overlay, interactive   | 不使用                                                                      | none, subtle, default, strong, small, medium, large, extraLarge, full, pill                          | 有第四层对象时显式 default；pill 可作为 full 的语义别名                      | radius.control.default；radius.overlay.full                               |
| border     | control, container, surface, overlay, divider       | 不使用                                                                      | subtle, default, strong, hover, focus, active, disabled, selected, invalid, danger                   | 有第四层对象时显式 default；状态仅在对应角色下使用                           | border.control.default；border.container.strong                           |
| shadow     | surface, overlay, control, focus                    | 不使用                                                                      | subtle, default, strong, flat, low, medium, high, raised, floating, dropdown, popover, dialog, modal | 有第四层对象时显式 default；focus 角色用于焦点阴影                           | shadow.surface.default；shadow.overlay.strong                             |
| opacity    | overlay, content, background, border                | 不使用                                                                      | subtle, default, strong, disabled, hover, active, ghost                                              | 有第四层对象时显式 default                                                   | opacity.overlay.disabled；opacity.content.subtle                          |
| filter     | backdrop, content, surface, image                   | 不使用                                                                      | subtle, default, strong, disabled, muted, medium, heavy                                              | 有第四层对象时显式 default                                                   | filter.backdrop.default；filter.content.strong                            |
| motion     | duration                                            | 不使用                                                                      | instant, fast, default, normal, slow, deliberate                                                     | 有第四层对象时显式 default                                                   | motion.duration.fast；motion.duration.default                             |
| motion     | easing                                              | 不使用                                                                      | linear, standard, emphasized, decelerated, accelerated, enter, exit                                  | 不使用 default；直接使用具体缓动值                                           | motion.easing.standard；motion.easing.emphasized                          |
| motion     | transition                                          | 不使用                                                                      | standard, expressive, calm, crisp, enter, exit, move                                                 | 默认使用 standard                                                            | motion.transition.standard                                                |
| motion     | interaction                                         | 不使用                                                                      | hover, press, focus, expand, collapse                                                                | 直接使用交互行为名称                                                         | motion.interaction.hover                                                  |
