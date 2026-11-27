import { entries } from '#util'
import { createTheme } from '@vanilla-extract/css'
import { opacity } from './primitive/palette'
import { semantic } from './semantic.css'

const palette = {
  primary: `light-dark(${semantic.palette.primary5}, ${semantic.palette.primary2})`,
  primaryHover: `light-dark(${semantic.palette.primary4}, ${semantic.palette.primary1})`,
  primaryActive: `light-dark(${semantic.palette.primary6}, ${semantic.palette.primary3})`,
  secondary: `light-dark(${semantic.palette.secondary1}, ${semantic.palette.secondary6})`,
  secondaryHover: `light-dark(${semantic.palette.secondary2}, ${semantic.palette.secondary5})`,
  secondaryActive: `light-dark(${semantic.palette.secondary3}, ${semantic.palette.secondary4})`,
  accent: {
    red: `light-dark(${semantic.palette.accentRed4}, ${semantic.palette.accentRed5})`,
    redHover: `light-dark(${semantic.palette.accentRed3}, ${semantic.palette.accentRed4})`,
    redActive: `light-dark(${semantic.palette.accentRed5}, ${semantic.palette.accentRed6})`,
    redForeground: `light-dark(${semantic.palette.accentRed4}, ${semantic.palette.accentRed3})`,
    orange: `light-dark(${semantic.palette.accentOrange4}, ${semantic.palette.accentOrange5})`,
    orangeHover: `light-dark(${semantic.palette.accentOrange3}, ${semantic.palette.accentOrange4})`,
    orangeActive: `light-dark(${semantic.palette.accentOrange5}, ${semantic.palette.accentOrange6})`,
    orangeForeground: `light-dark(${semantic.palette.accentOrange7}, ${semantic.palette.accentOrange5})`,
    yellow: `light-dark(${semantic.palette.accentYellow2}, ${semantic.palette.accentYellow3})`,
    yellowHover: `light-dark(${semantic.palette.accentYellow1}, ${semantic.palette.accentYellow2})`,
    yellowActive: `light-dark(${semantic.palette.accentYellow3}, ${semantic.palette.accentYellow4})`,
    yellowForeground: `light-dark(${semantic.palette.accentYellow7}, ${semantic.palette.accentYellow3})`,
    green: `light-dark(${semantic.palette.accentGreen3}, ${semantic.palette.accentGreen4})`,
    greenHover: `light-dark(${semantic.palette.accentGreen2}, ${semantic.palette.accentGreen3})`,
    greenActive: `light-dark(${semantic.palette.accentGreen4}, ${semantic.palette.accentGreen5})`,
    greenForeground: `light-dark(${semantic.palette.accentGreen7}, ${semantic.palette.accentGreen4})`,
    blue: `light-dark(${semantic.palette.accentBlue4}, ${semantic.palette.accentBlue5})`,
    blueHover: `light-dark(${semantic.palette.accentBlue3}, ${semantic.palette.accentBlue4})`,
    blueActive: `light-dark(${semantic.palette.accentBlue5}, ${semantic.palette.accentBlue6})`,
    blueForeground: `light-dark(${semantic.palette.accentBlue4}, ${semantic.palette.accentBlue3})`,
  },
  semantic: {
    error: `light-dark(${semantic.palette.semanticError1}, ${semantic.palette.semanticError2})`,
    warning: `light-dark(${semantic.palette.semanticWarning1}, ${semantic.palette.semanticWarning2})`,
    success: `light-dark(${semantic.palette.semanticSuccess1}, ${semantic.palette.semanticSuccess2})`,
    info: `light-dark(${semantic.palette.semanticInfo1}, ${semantic.palette.semanticInfo2})`,
  },
  neutral: {
    foreground1: `light-dark(${semantic.palette.black}, ${semantic.palette.white})`,
    foreground2: `light-dark(${semantic.palette.neutral16}, ${semantic.palette.neutral2})`,
    foreground3: `light-dark(${semantic.palette.neutral13}, ${semantic.palette.neutral7})`,
    foreground4: `light-dark(${semantic.palette.neutral11}, ${semantic.palette.neutral10})`,
    foreground6: `light-dark(${semantic.palette.neutral10}, ${semantic.palette.neutral11})`,
    foreground7: `light-dark(${semantic.palette.neutral7}, ${semantic.palette.neutral13})`,
    foreground8: `light-dark(${semantic.palette.neutral2}, ${semantic.palette.neutral16})`,
    foreground9: `light-dark(${semantic.palette.white}, ${semantic.palette.black})`,
    light: semantic.palette.neutral1,
    dark: semantic.palette.neutral16,
    white: semantic.palette.white,
    black: semantic.palette.black,
    transparent: semantic.palette.transparent,
  },
  adaptive: {
    background1: `light-dark(${semantic.palette.background5}, ${semantic.palette.background1})`,
    background2: `light-dark(${semantic.palette.background6}, ${semantic.palette.background2})`,
    background3: `light-dark(${semantic.palette.background7}, ${semantic.palette.background3})`,
    background4: `light-dark(${semantic.palette.background8}, ${semantic.palette.background4})`,
    border1: `light-dark(${semantic.palette.border4}, ${semantic.palette.border1})`,
    border2: `light-dark(${semantic.palette.border5}, ${semantic.palette.border2})`,
    border3: `light-dark(${semantic.palette.border6}, ${semantic.palette.border3})`,
    shadow1: `light-dark(${semantic.palette.shadow4}, ${semantic.palette.shadow1})`,
    shadow2: `light-dark(${semantic.palette.shadow5}, ${semantic.palette.shadow2})`,
    shadow3: `light-dark(${semantic.palette.shadow6}, ${semantic.palette.shadow3})`,
    overlay: `light-dark(${semantic.palette.overlay2}, ${semantic.palette.overlay1})`,
  },
} as const

const gap = semantic.spacing.gap.medium
const padding = semantic.spacing.padding.medium
const color = palette.neutral.foreground2
const colorInverted = palette.neutral.foreground8
const transparent = palette.neutral.transparent
const outline = `${semantic.sizing.outline.medium} solid ${palette.accent.blue}`
const background = `light-dark(${semantic.palette.neutral1}, ${semantic.palette.neutral16})`
const backgroundHover = palette.adaptive.background1
const backgroundActive = palette.adaptive.background2
const backgroundInverted = `light-dark(${semantic.palette.neutral16}, ${semantic.palette.neutral1})`
const border = `${semantic.sizing.border.small} solid ${palette.adaptive.border1}`
const radius = semantic.sizing.radius.medium
const shadow1 = `${semantic.sizing.shadow.small} ${palette.adaptive.shadow1}`
const shadow4 = `${semantic.sizing.shadow.medium} ${palette.adaptive.shadow1}`
const shadow7 = `${semantic.sizing.shadow.large} ${palette.adaptive.shadow1}`
const filter = {
  blur: 'blur(5px)',
  shadow: `drop-shadow(0.125rem 0.125rem 0 ${palette.adaptive.shadow3})`,
}
const transition = semantic.transition.default
const typography = entries(semantic.typography).reduce(
  (acc, [name, font]) => ({
    ...acc,
    [name]: `${font.fontStyle} ${font.fontVariant} ${font.fontWeight} ${font.fontSize}/${font.lineHeight} ${font.fontFamily}`,
  }),
  {} as { [K in keyof typeof semantic.typography]: string }
)

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/system-color#syntax
 */
export const [themeClass, theme] = createTheme({
  ...typography,

  gap,
  padding,
  margin: semantic.spacing.margin,
  color,
  outline,
  background,
  border,
  radius,
  shadow: shadow1,
  filter,
  transition,

  paper: {
    background: `light-dark(${semantic.palette.neutral2}, ${semantic.palette.neutral17})`,
  },

  hover: {
    background: backgroundHover,
  },

  active: {
    background: backgroundActive,
  },

  disabled: {
    color: `light-dark(${semantic.palette.neutral7}, ${semantic.palette.neutral13})`,
    background: `light-dark(${semantic.palette.background5}, ${semantic.palette.background1})`,
    border: `light-dark(${semantic.palette.border4}, ${semantic.palette.border1})`,
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
    background: `light-dark(${opacity(semantic.palette.accentYellow2, 30)}, ${opacity(semantic.palette.accentYellow3, 40)})`,
  },

  selection: {
    background: `light-dark(${opacity(semantic.palette.accentBlue2, 40)}, ${opacity(semantic.palette.accentBlue3, 50)})`,
  },

  button: {
    gap,
    minWidth: semantic.typography.heading1.lineHeight,
    height: semantic.sizing.height,
    padding: semantic.spacing.padding,
    font: {
      small: typography.button3,
      medium: typography.button2,
      large: typography.button1,
    },
    outline: semantic.sizing.outline.medium,
    background: transparent,
    backgroundHover,
    backgroundActive,
    border: semantic.sizing.border,
    radius: semantic.sizing.radius,
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
    height: semantic.sizing.height,
    padding: semantic.spacing.padding,
    font: {
      small: typography.body3,
      medium: typography.body2,
      large: typography.body1,
    },
    color: palette.neutral.foreground2,
    placeholder: palette.neutral.foreground3,
    before: palette.neutral.foreground3,
    after: palette.neutral.foreground3,
    border: semantic.sizing.border,
    radius: semantic.sizing.radius,
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
    size: semantic.sizing.width,
    color: palette.neutral.foreground4,
    colorHover: palette.neutral.foreground1,
    colorActive: palette.neutral.foreground4,
    colorChecked: palette.accent.blue,
    colorCheckedHover: palette.accent.blueHover,
    colorCheckedActive: palette.accent.blueActive,
    outline: semantic.sizing.outline.medium,
    transition,
  },

  switch: {
    outset: gap,
    width: semantic.sizing.height,
    height: semantic.sizing.width,
    padding: { small: '0.125rem', medium: '0.125rem', large: '0.125rem' },
    color: palette.neutral.light,
    colorChecked: palette.neutral.light,
    outline: semantic.sizing.outline.medium,
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
    size: semantic.sizing.width,
  },

  spinner: {
    size: semantic.sizing.width,
    color: palette.accent.blue,
    duration: '2000ms',
  },

  dialog: {
    size: { small: '15rem', medium: '30rem', large: '45rem' },
    margin: semantic.spacing.margin.large,
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
    transition: semantic.transition.slowest,
  },

  tooltip: {
    minHeight: semantic.sizing.height.medium,
    padding: semantic.spacing.padding.small,
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
    padding: semantic.spacing.padding.small,
  },

  item: {
    gap: semantic.spacing.gap.small,
    height: semantic.sizing.height.small,
    padding: semantic.spacing.padding.medium,
    radius,
    icon: semantic.sizing.width.small,
  },

  group: {
    gap: semantic.spacing.gap.small,
    font: typography.caption2,
    color: palette.neutral.foreground4,
  },

  separator: {
    size: semantic.sizing.border.small,
    color: palette.adaptive.border1,
  },
} as const)
