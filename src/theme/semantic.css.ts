import { entries } from '#util'
import { createTheme } from '@vanilla-extract/css'
import { primitive } from './primitive.css'
import { opacity } from './primitive/palette'

const { palette, motion, size, space, typography } = primitive

// TODO: what's this?
export const woejowejfowjefowje = {
  primary: `light-dark(${palette.primary5}, ${palette.primary2})`,
  primaryHover: `light-dark(${palette.primary4}, ${palette.primary1})`,
  primaryActive: `light-dark(${palette.primary6}, ${palette.primary3})`,

  accent: {
    red: `light-dark(${palette.accentRed4}, ${palette.accentRed5})`,
    redHover: `light-dark(${palette.accentRed3}, ${palette.accentRed4})`,
    redActive: `light-dark(${palette.accentRed5}, ${palette.accentRed6})`,
    redForeground: `light-dark(${palette.accentRed4}, ${palette.accentRed3})`,
    orange: `light-dark(${palette.accentOrange4}, ${palette.accentOrange5})`,
    orangeHover: `light-dark(${palette.accentOrange3}, ${palette.accentOrange4})`,
    orangeActive: `light-dark(${palette.accentOrange5}, ${palette.accentOrange6})`,
    orangeForeground: `light-dark(${palette.accentOrange7}, ${palette.accentOrange5})`,
    green: `light-dark(${palette.accentGreen3}, ${palette.accentGreen4})`,
    greenHover: `light-dark(${palette.accentGreen2}, ${palette.accentGreen3})`,
    greenActive: `light-dark(${palette.accentGreen4}, ${palette.accentGreen5})`,
    greenForeground: `light-dark(${palette.accentGreen7}, ${palette.accentGreen4})`,
    blue: `light-dark(${palette.accentBlue4}, ${palette.accentBlue5})`,
    blueHover: `light-dark(${palette.accentBlue3}, ${palette.accentBlue4})`,
    blueActive: `light-dark(${palette.accentBlue5}, ${palette.accentBlue6})`,
    blueForeground: `light-dark(${palette.accentBlue4}, ${palette.accentBlue3})`,
  },

  neutral: {
    foreground1: `light-dark(${palette.black}, ${palette.white})`,
    foreground2: `light-dark(${palette.neutral16}, ${palette.neutral2})`,
    foreground3: `light-dark(${palette.neutral13}, ${palette.neutral7})`,
    foreground4: `light-dark(${palette.neutral11}, ${palette.neutral10})`,
    foreground7: `light-dark(${palette.neutral7}, ${palette.neutral13})`,
    foreground8: `light-dark(${palette.neutral2}, ${palette.neutral16})`,
    light: palette.neutral1,
    dark: palette.neutral16,
    transparent: palette.transparent,
    background: `light-dark(${palette.neutral1}, ${palette.neutral16})`,
    backgroundInverted: `light-dark(${palette.neutral16}, ${palette.neutral1})`,
    paper: `light-dark(${palette.neutral2}, ${palette.neutral17})`,
  },

  adaptive: {
    background1: `light-dark(${palette.background5}, ${palette.background1})`,
    background2: `light-dark(${palette.background6}, ${palette.background2})`,
    background4: `light-dark(${palette.background8}, ${palette.background4})`,
    border1: `light-dark(${palette.border4}, ${palette.border1})`,
    border3: `light-dark(${palette.border6}, ${palette.border3})`,
    shadow1: `light-dark(${palette.shadow4}, ${palette.shadow1})`,
    shadow3: `light-dark(${palette.shadow6}, ${palette.shadow3})`,
    overlay: `light-dark(${palette.overlay2}, ${palette.overlay1})`,
    highlight: `light-dark(${opacity(palette.accentYellow2, 30)}, ${opacity(palette.accentYellow3, 40)})`,
    selection: `light-dark(${opacity(palette.accentBlue2, 40)}, ${opacity(palette.accentBlue3, 50)})`,
  },
} as const

const gap = space.gap.medium
const padding = space.padding.medium
const color = woejowejfowjefowje.neutral.foreground2
const colorInverted = woejowejfowjefowje.neutral.foreground8
const transparent = woejowejfowjefowje.neutral.transparent
const outline = `${size.outline.medium} solid ${woejowejfowjefowje.accent.blue}`
const background = woejowejfowjefowje.neutral.background
const backgroundHover = woejowejfowjefowje.adaptive.background1
const backgroundActive = woejowejfowjefowje.adaptive.background2
const backgroundInverted = woejowejfowjefowje.neutral.backgroundInverted
const border = `${size.border.small} solid ${woejowejfowjefowje.adaptive.border1}`
const radius = size.radius.medium
const shadow1 = `${size.shadow.small} ${woejowejfowjefowje.adaptive.shadow1}`
const shadow4 = `${size.shadow.medium} ${woejowejfowjefowje.adaptive.shadow1}`
const shadow7 = `${size.shadow.large} ${woejowejfowjefowje.adaptive.shadow1}`
const filter = {
  blur: 'blur(5px)',
  shadow: `drop-shadow(0.125rem 0.125rem 0 ${woejowejfowjefowje.adaptive.shadow3})`,
}
const transition = `${motion.duration.default} ${motion.easing.default} ${motion.behavior.default}`
const transitionSlowest = `${motion.duration.slowest} ${motion.easing.default} ${motion.behavior.default}`
const controlSize = {
  small: typography.body3.lineHeight,
  medium: typography.body2.lineHeight,
  large: typography.body1.lineHeight,
}
const typographyShorthands = entries(typography).reduce(
  (acc, [name, font]) => ({
    ...acc,
    [name]: `${font.fontStyle} ${font.fontVariant} ${font.fontWeight} ${font.fontSize}/${font.lineHeight} ${font.fontFamily}`,
  }),
  {} as { [K in keyof typeof typography]: string }
)

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/system-color#syntax
 */
export const [semanticClass, semantic] = createTheme({
  ...woejowejfowjefowje,
  ...typographyShorthands,

  gap,
  padding,
  margin: space.margin,
  color,
  colorInverted,
  transparent,
  outline,
  background,
  backgroundHover,
  backgroundActive,
  backgroundInverted,
  border,
  radius,
  shadow: shadow1,
  shadow4,
  shadow7,
  filter,
  transition,
  transitionSlowest,
  controlSize,

  paper: {
    background: woejowejfowjefowje.neutral.paper,
  },

  hover: {
    background: backgroundHover,
  },

  active: {
    background: backgroundActive,
  },

  disabled: {
    color: woejowejfowjefowje.neutral.foreground7,
    background: woejowejfowjefowje.adaptive.background1,
    border: woejowejfowjefowje.adaptive.border1,
  },

  descriptive: {
    color: woejowejfowjefowje.neutral.foreground3,
  },

  danger: {
    color: woejowejfowjefowje.accent.red,
  },

  emphasis: {
    fontWeight: '600',
    color: woejowejfowjefowje.neutral.foreground1,
  },

  highlight: {
    background: woejowejfowjefowje.adaptive.highlight,
  },

  selection: {
    background: woejowejfowjefowje.adaptive.selection,
  },
} as const)
