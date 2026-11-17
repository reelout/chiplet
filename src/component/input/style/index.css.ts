import { radiusVar, SquircleStyle, stretch, theme } from '#theme'
import { createVar, globalStyle, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const gap = createVar()
const height = createVar()
const padding = createVar()
const font = createVar()
const icon = createVar()
const color = createVar()
const colorDisabled = createVar()
const background = createVar()
const backgroundHover = createVar()
const backgroundFocus = createVar()
const backgroundDisabled = createVar()
const border = createVar()
const borderColor = createVar()
const borderColorHover = createVar()
const borderColorFocus = createVar()
const borderColorDisabled = createVar()
const borderSize = createVar()
const placeholder = createVar()
const before = createVar()
const after = createVar()

export const InputStyle = recipe({
  base: [
    SquircleStyle,
    {
      vars: {
        [border]: `${borderSize} solid`,
        [placeholder]: theme.input.placeholder,
        [before]: theme.input.before,
        [after]: theme.input.after,
      },
      boxSizing: 'border-box',
      display: 'flex',
      placeItems: 'center',
      blockSize: height,
      font,
      color,
      background,
      border,
      borderColor,
      ':hover': {
        vars: {
          [background]: backgroundHover,
          [borderColor]: borderColorHover,
        },
      },
      ':focus-within': {
        vars: {
          [background]: backgroundFocus,
          [borderColor]: borderColorFocus,
        },
      },
      selectors: {
        '&:has(> input:disabled)': {
          vars: {
            [color]: colorDisabled,
            [background]: backgroundDisabled,
            [borderColor]: borderColorDisabled,
            [placeholder]: color,
          },
        },
      },
    },
  ],
  variants: {
    variant: {
      primary: {
        vars: {
          [color]: theme.input.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.input.primary.background,
          [backgroundHover]: theme.input.primary.backgroundHover,
          [backgroundFocus]: theme.input.primary.backgroundFocus,
          [backgroundDisabled]: theme.disabled.background,
          [borderColor]: theme.input.primary.border,
          [borderColorHover]: theme.input.primary.borderHover,
          [borderColorFocus]: theme.input.primary.borderFocus,
          [borderColorDisabled]: theme.disabled.border,
        },
      },
      secondary: {
        vars: {
          [color]: theme.input.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.input.secondary.background,
          [backgroundHover]: theme.input.secondary.backgroundHover,
          [backgroundFocus]: theme.input.secondary.backgroundFocus,
          [backgroundDisabled]: theme.disabled.background,
          [borderColor]: theme.input.secondary.border,
          [borderColorHover]: theme.input.secondary.borderHover,
          [borderColorFocus]: theme.input.secondary.borderFocus,
          [borderColorDisabled]: theme.disabled.border,
        },
      },
    },
    size: {
      small: {
        vars: {
          [gap]: theme.input.gap,
          [height]: theme.input.height.small,
          [padding]: theme.input.padding.small,
          [font]: theme.input.font.small,
          [icon]: theme.icon.size.small,
          [borderSize]: theme.input.border.small,
          [radiusVar]: theme.input.radius.small,
        },
      },
      medium: {
        vars: {
          [gap]: theme.input.gap,
          [height]: theme.input.height.medium,
          [padding]: theme.input.padding.medium,
          [font]: theme.input.font.medium,
          [icon]: theme.icon.size.medium,
          [borderSize]: theme.input.border.medium,
          [radiusVar]: theme.input.radius.medium,
        },
      },
      large: {
        vars: {
          [gap]: theme.input.gap,
          [height]: theme.input.height.large,
          [padding]: theme.input.padding.large,
          [font]: theme.input.font.large,
          [icon]: theme.icon.size.large,
          [borderSize]: theme.input.border.large,
          [radiusVar]: theme.input.radius.large,
        },
      },
    },
  },
})

globalStyle(`${InputStyle.classNames.base} > input`, {
  boxSizing: 'border-box',
  flex: '1',
  minInlineSize: '0', // https://stackoverflow.com/questions/48776966/input-doesnt-respect-flex-container-width
  blockSize: stretch,
  paddingBlock: '0',
  paddingInline: padding,
  font: 'inherit',
  color: 'inherit',
  letterSpacing: 'inherit',
  outlineColor: 'transparent', // https://blogs.windows.com/msedgedev/2020/09/17/styling-for-windows-high-contrast-with-new-standards-for-forced-colors/#:~:text=outline
  background: 'none',
  border: '0',
  '@media': {
    '(forced-colors: none)': {
      outlineWidth: '0',
    },
  },
})

globalStyle(`${InputStyle.classNames.base} > input::placeholder`, {
  color: placeholder,
})

globalStyle(`${InputStyle.classNames.base} > :not(style) ~ input`, {
  paddingInlineStart: gap,
})

globalStyle(`${InputStyle.classNames.base} > input:not(:last-child)`, {
  paddingInlineEnd: gap,
})

export const InputBeforeStyle = style({
  marginInlineStart: gap,
})

export const InputAfterStyle = style({
  marginInlineStart: `calc(${gap} - ${padding})`,
  marginInlineEnd: gap,
})

export const SearchInputBeforeStyle = style({
  fontSize: icon,
  color: before,
})
