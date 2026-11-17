import { entries } from '#util'
import { createTheme } from '@vanilla-extract/css'
import { palette as _palette, opacity } from './palette'
import { token } from './token.css'
import { typography as _typography } from './typography'

const palette = {
  primary: `light-dark(${token.palette.primary5}, ${token.palette.primary2})`,
  primaryHover: `light-dark(${token.palette.primary4}, ${token.palette.primary1})`,
  primaryActive: `light-dark(${token.palette.primary6}, ${token.palette.primary3})`,
  secondary: `light-dark(${token.palette.secondary1}, ${token.palette.secondary6})`,
  secondaryHover: `light-dark(${token.palette.secondary2}, ${token.palette.secondary5})`,
  secondaryActive: `light-dark(${token.palette.secondary3}, ${token.palette.secondary4})`,
  accent: {
    red: `light-dark(${token.palette.accentRed4}, ${token.palette.accentRed5})`,
    redHover: `light-dark(${token.palette.accentRed3}, ${token.palette.accentRed4})`,
    redActive: `light-dark(${token.palette.accentRed5}, ${token.palette.accentRed6})`,
    redForeground: `light-dark(${token.palette.accentRed4}, ${token.palette.accentRed3})`,
    orange: `light-dark(${token.palette.accentOrange4}, ${token.palette.accentOrange5})`,
    orangeHover: `light-dark(${token.palette.accentOrange3}, ${token.palette.accentOrange4})`,
    orangeActive: `light-dark(${token.palette.accentOrange5}, ${token.palette.accentOrange6})`,
    orangeForeground: `light-dark(${token.palette.accentOrange7}, ${token.palette.accentOrange5})`,
    yellow: `light-dark(${token.palette.accentYellow2}, ${token.palette.accentYellow3})`,
    yellowHover: `light-dark(${token.palette.accentYellow1}, ${token.palette.accentYellow2})`,
    yellowActive: `light-dark(${token.palette.accentYellow3}, ${token.palette.accentYellow4})`,
    yellowForeground: `light-dark(${token.palette.accentYellow7}, ${token.palette.accentYellow3})`,
    green: `light-dark(${token.palette.accentGreen3}, ${token.palette.accentGreen4})`,
    greenHover: `light-dark(${token.palette.accentGreen2}, ${token.palette.accentGreen3})`,
    greenActive: `light-dark(${token.palette.accentGreen4}, ${token.palette.accentGreen5})`,
    greenForeground: `light-dark(${token.palette.accentGreen7}, ${token.palette.accentGreen4})`,
    blue: `light-dark(${token.palette.accentBlue4}, ${token.palette.accentBlue5})`,
    blueHover: `light-dark(${token.palette.accentBlue3}, ${token.palette.accentBlue4})`,
    blueActive: `light-dark(${token.palette.accentBlue5}, ${token.palette.accentBlue6})`,
    blueForeground: `light-dark(${token.palette.accentBlue4}, ${token.palette.accentBlue3})`,
  },
  semantic: {
    error: `light-dark(${token.palette.semanticError1}, ${token.palette.semanticError2})`,
    warning: `light-dark(${token.palette.semanticWarning1}, ${token.palette.semanticWarning2})`,
    success: `light-dark(${token.palette.semanticSuccess1}, ${token.palette.semanticSuccess2})`,
    info: `light-dark(${token.palette.semanticInfo1}, ${token.palette.semanticInfo2})`,
  },
  neutral: {
    foreground1: `light-dark(${token.palette.black}, ${token.palette.white})`,
    foreground2: `light-dark(${token.palette.neutral16}, ${token.palette.neutral2})`,
    foreground3: `light-dark(${token.palette.neutral13}, ${token.palette.neutral7})`,
    foreground4: `light-dark(${token.palette.neutral11}, ${token.palette.neutral10})`,
    foreground6: `light-dark(${token.palette.neutral10}, ${token.palette.neutral11})`,
    foreground7: `light-dark(${token.palette.neutral7}, ${token.palette.neutral13})`,
    foreground8: `light-dark(${token.palette.neutral2}, ${token.palette.neutral16})`,
    foreground9: `light-dark(${token.palette.white}, ${token.palette.black})`,
    light: token.palette.neutral1,
    dark: token.palette.neutral16,
    white: token.palette.white,
    black: token.palette.black,
    transparent: token.palette.transparent,
  },
  adaptive: {
    background1: `light-dark(${token.palette.background5}, ${token.palette.background1})`,
    background2: `light-dark(${token.palette.background6}, ${token.palette.background2})`,
    background3: `light-dark(${token.palette.background7}, ${token.palette.background3})`,
    background4: `light-dark(${token.palette.background8}, ${token.palette.background4})`,
    border1: `light-dark(${token.palette.border4}, ${token.palette.border1})`,
    border2: `light-dark(${token.palette.border5}, ${token.palette.border2})`,
    border3: `light-dark(${token.palette.border6}, ${token.palette.border3})`,
    shadow1: `light-dark(${token.palette.shadow4}, ${token.palette.shadow1})`,
    shadow2: `light-dark(${token.palette.shadow5}, ${token.palette.shadow2})`,
    shadow3: `light-dark(${token.palette.shadow6}, ${token.palette.shadow3})`,
    overlay: `light-dark(${token.palette.overlay2}, ${token.palette.overlay1})`,
  },
} as const

const gap = token.spacing.gap.medium
const padding = token.spacing.padding.medium
const color = palette.neutral.foreground2
const colorInverted = palette.neutral.foreground8
const transparent = palette.neutral.transparent
const outline = `${token.sizing.outline.medium} solid ${palette.accent.blue}`
const background = `light-dark(${token.palette.neutral1}, ${token.palette.neutral16})`
const backgroundHover = palette.adaptive.background1
const backgroundActive = palette.adaptive.background2
const backgroundInverted = `light-dark(${token.palette.neutral16}, ${token.palette.neutral1})`
const border = `${token.sizing.border.small} solid ${palette.adaptive.border1}`
const radius = token.sizing.radius.medium
const shadow1 = `${token.sizing.shadow.small} ${palette.adaptive.shadow1}`
const shadow4 = `${token.sizing.shadow.medium} ${palette.adaptive.shadow1}`
const shadow7 = `${token.sizing.shadow.large} ${palette.adaptive.shadow1}`
const filter = {
  blur: 'blur(5px)',
  shadow: `drop-shadow(0.125rem 0.125rem 0 ${palette.adaptive.shadow3})`,
}
const transition = token.transition.default
const typography = entries(token.typography).reduce(
  (acc, [name, font]) => ({
    ...acc,
    [name]: `${font.fontStyle} ${font.fontVariant} ${font.fontWeight} ${font.fontSize}/${font.lineHeight} ${font.fontFamily}`,
  }),
  {} as { [K in keyof typeof token.typography]: string }
)

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/system-color#syntax
 */
export const [themeClass, theme] = createTheme({
  ...typography,

  gap,
  padding,
  margin: token.spacing.margin,
  color,
  outline,
  background,
  border,
  radius,
  shadow: shadow1,
  filter,
  transition,

  paper: {
    background: `light-dark(${token.palette.neutral2}, ${token.palette.neutral17})`,
  },

  hover: {
    background: backgroundHover,
  },

  active: {
    background: backgroundActive,
  },

  disabled: {
    color: `light-dark(${token.palette.neutral7}, ${token.palette.neutral13})`,
    background: `light-dark(${token.palette.background5}, ${token.palette.background1})`,
    border: `light-dark(${token.palette.border4}, ${token.palette.border1})`,
  },

  descriptive: {
    color: palette.neutral.foreground3,
  },

  danger: {
    color: palette.accent.red,
  },

  emphasis: {
    fontWeight: '600',
    color: palette.neutral.foreground1,
  },

  highlight: {
    background: `light-dark(${opacity(token.palette.accentYellow2, 30)}, ${opacity(token.palette.accentYellow3, 40)})`,
  },

  selection: {
    background: `light-dark(${opacity(token.palette.accentBlue2, 40)}, ${opacity(token.palette.accentBlue3, 50)})`,
  },

  button: {
    gap,
    minWidth: token.typography.heading1.lineHeight,
    height: token.sizing.height,
    padding: token.spacing.padding,
    font: {
      small: typography.button3,
      medium: typography.button2,
      large: typography.button1,
    },
    outline: token.sizing.outline.medium,
    background: transparent,
    backgroundHover,
    backgroundActive,
    border: token.sizing.border,
    radius: token.sizing.radius,
    shadow: shadow1,
    transition,
    default: {
      color: palette.primary,
      background: palette.primary,
      backgroundHover: palette.primaryHover,
      backgroundActive: palette.primaryActive,
      border: palette.adaptive.border1,
      borderHover: palette.adaptive.border3,
      borderActive: palette.adaptive.border3,
      contrastColor: colorInverted,
    },
    primary: {
      color: palette.accent.blueForeground,
      background: palette.accent.blue,
      backgroundHover: palette.accent.blueHover,
      backgroundActive: palette.accent.blueActive,
      border: palette.accent.blue,
      borderHover: palette.accent.blueActive,
      borderActive: palette.accent.blueActive,
      contrastColor: palette.neutral.light,
    },
    success: {
      color: palette.accent.greenForeground,
      background: palette.accent.green,
      backgroundHover: palette.accent.greenHover,
      backgroundActive: palette.accent.greenActive,
      border: palette.accent.green,
      borderHover: palette.accent.greenActive,
      borderActive: palette.accent.greenActive,
      contrastColor: palette.neutral.dark,
    },
    warning: {
      color: palette.accent.orangeForeground,
      background: palette.accent.orange,
      backgroundHover: palette.accent.orangeHover,
      backgroundActive: palette.accent.orangeActive,
      border: palette.accent.orange,
      borderHover: palette.accent.orangeActive,
      borderActive: palette.accent.orangeActive,
      contrastColor: palette.neutral.dark,
    },
    danger: {
      color: palette.accent.redForeground,
      background: palette.accent.red,
      backgroundHover: palette.accent.redHover,
      backgroundActive: palette.accent.redActive,
      border: palette.accent.red,
      borderHover: palette.accent.redActive,
      borderActive: palette.accent.redActive,
      contrastColor: palette.neutral.light,
    },
  },

  input: {
    gap,
    height: token.sizing.height,
    padding: token.spacing.padding,
    font: {
      small: typography.body3,
      medium: typography.body2,
      large: typography.body1,
    },
    color: palette.neutral.foreground2,
    placeholder: palette.neutral.foreground3,
    before: palette.neutral.foreground3,
    after: palette.neutral.foreground3,
    border: token.sizing.border,
    radius: token.sizing.radius,
    primary: {
      background: transparent,
      backgroundHover: transparent,
      backgroundFocus: transparent,
      border: palette.adaptive.border1,
      borderHover: palette.adaptive.border3,
      borderFocus: palette.accent.blue,
    },
    secondary: {
      background: palette.adaptive.background1,
      backgroundHover: palette.adaptive.background2,
      backgroundFocus: palette.adaptive.background1,
      border: transparent,
      borderHover: transparent,
      borderFocus: `${transparent} ${transparent} ${palette.accent.blue}`,
    },
  },

  checkbox: {
    outset: gap,
    size: token.sizing.width,
    color: palette.neutral.foreground4,
    colorHover: palette.neutral.foreground1,
    colorActive: palette.neutral.foreground4,
    colorChecked: palette.accent.blue,
    colorCheckedHover: palette.accent.blueHover,
    colorCheckedActive: palette.accent.blueActive,
    outline: token.sizing.outline.medium,
    transition,
  },

  switch: {
    outset: gap,
    width: token.sizing.height,
    height: token.sizing.width,
    padding: { small: '0.125rem', medium: '0.125rem', large: '0.125rem' },
    color: palette.neutral.light,
    colorChecked: palette.neutral.light,
    outline: token.sizing.outline.medium,
    background: palette.adaptive.background4,
    backgroundChecked: palette.accent.blue,
    transition,
  },

  link: {
    color: palette.accent.blue,
    colorHover: palette.accent.blueHover,
    colorActive: palette.accent.blueActive,
    colorVisited: palette.accent.blueActive,
  },

  icon: {
    size: token.sizing.width,
  },

  spinner: {
    size: token.sizing.width,
    color: palette.accent.blue,
    duration: '2000ms',
  },

  dialog: {
    size: { small: '15rem', medium: '30rem', large: '45rem' },
    margin: token.spacing.margin.large,
    color,
    background,
    radius,
    shadow: shadow7,
    backdrop: palette.adaptive.overlay,
    filter: filter.blur,
    transition,
  },

  popover: {
    color,
    background,
    border,
    radius,
    shadow: shadow4,
    transition: token.transition.slowest,
  },

  tooltip: {
    minHeight: token.sizing.height.medium,
    padding: token.spacing.padding.small,
    color: colorInverted,
    background: backgroundInverted,
    border: 'none',
    radius,
    filter: filter.shadow,
    arrow: {
      size: '1rem',
      radius: '1px',
    },
  },

  menu: {
    width: '12.5rem',
    padding: token.spacing.padding.small,
  },

  item: {
    gap: token.spacing.gap.small,
    height: token.sizing.height.small,
    padding: token.spacing.padding.medium,
    radius,
    icon: token.sizing.width.small,
  },

  group: {
    gap: token.spacing.gap.small,
    font: typography.caption2,
    color: palette.neutral.foreground4,
  },

  separator: {
    size: token.sizing.border.small,
    color: palette.adaptive.border1,
  },
} as const)
