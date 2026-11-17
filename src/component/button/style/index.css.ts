import {
  CircleStyle,
  DisabledSelector,
  radiusVar,
  SquircleStyle,
  stretch,
  theme,
  TRANSPARENT,
} from '#theme'
import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const gap = createVar()
const minWidth = createVar()
const height = createVar()
const padding = createVar()
const font = createVar()
const icon = createVar()
const color = createVar()
const colorHover = createVar()
const colorActive = createVar()
const colorDisabled = createVar()
const cursor = createVar()
const cursorDisabled = createVar()
const background = createVar()
const backgroundHover = createVar()
const backgroundActive = createVar()
const backgroundDisabled = createVar()
const border = createVar()
const borderColor = createVar()
const borderColorHover = createVar()
const borderColorActive = createVar()
const borderColorDisabled = createVar()
const borderSize = createVar()
const shadow = createVar()
const shadowDisabled = createVar()
const transition = createVar()

export const InteractiveStyle = style({
  vars: {
    [cursor]: 'pointer',
    [cursorDisabled]: 'not-allowed',
  },
  cursor,
  selectors: {
    [`&${DisabledSelector}`]: {
      vars: {
        [cursor]: cursorDisabled,
      },
    },
  },
})

export const ButtonStyle = recipe({
  base: [
    {
      vars: {
        [gap]: theme.button.gap,
        [cursor]: 'pointer',
        [cursorDisabled]: 'not-allowed',
        [border]: `${borderSize} solid ${borderColor}`,
        [transition]: theme.button.transition,
      },
      boxSizing: 'border-box',
      display: 'inline-flex',
      gap,
      placeContent: 'center',
      placeItems: 'center',
      minInlineSize: minWidth,
      blockSize: height,
      paddingBlock: '0',
      paddingInline: padding,
      font,
      color,
      cursor,
      userSelect: 'none',
      outlineOffset: theme.button.outline,
      background,
      border,
      boxShadow: shadow,
      transition,
      ':hover': {
        vars: {
          [color]: colorHover,
          [background]: backgroundHover,
          [borderColor]: borderColorHover,
        },
      },
      ':active': {
        vars: {
          [color]: colorActive,
          [background]: backgroundActive,
          [borderColor]: borderColorActive,
        },
      },
      selectors: {
        [`&${DisabledSelector}`]: {
          vars: {
            [color]: colorDisabled,
            [cursor]: cursorDisabled,
            [background]: backgroundDisabled,
            [borderColor]: borderColorDisabled,
            [shadow]: shadowDisabled,
          },
        },
      },
    },
  ],
  variants: {
    color: {
      default: {},
      primary: {},
      success: {},
      warning: {},
      danger: {},
    },
    variant: {
      primary: {
        vars: {
          [shadow]: 'none',
          [shadowDisabled]: 'none',
        },
      },
      secondary: {
        vars: {
          [shadow]: theme.button.shadow,
          [shadowDisabled]: 'none',
        },
      },
      tertiary: {
        vars: {
          [shadow]: 'none',
          [shadowDisabled]: 'none',
        },
      },
    },
    size: {
      small: {
        vars: {
          [minWidth]: theme.button.minWidth,
          [height]: theme.button.height.small,
          [padding]: theme.button.padding.small,
          [font]: theme.button.font.small,
          [icon]: theme.icon.size.small,
          [borderSize]: theme.button.border.small,
          [radiusVar]: theme.button.radius.small,
        },
      },
      medium: {
        vars: {
          [minWidth]: theme.button.minWidth,
          [height]: theme.button.height.medium,
          [padding]: theme.button.padding.medium,
          [font]: theme.button.font.medium,
          [icon]: theme.icon.size.medium,
          [borderSize]: theme.button.border.medium,
          [radiusVar]: theme.button.radius.medium,
        },
      },
      large: {
        vars: {
          [minWidth]: theme.button.minWidth,
          [height]: theme.button.height.large,
          [padding]: theme.button.padding.large,
          [font]: theme.button.font.large,
          [icon]: theme.icon.size.large,
          [borderSize]: theme.button.border.large,
          [radiusVar]: theme.button.radius.large,
        },
      },
    },
    shape: {
      rounded: [
        SquircleStyle,
        {
          //
        },
      ],
      circular: [
        CircleStyle,
        {
          // vars: {
          //   [radiusVar]: height,
          // },
        },
      ],
    },
    block: {
      true: {
        display: 'flex',
        inlineSize: stretch,
      },
    },
  },
  compoundVariants: [
    //#region primary
    {
      variants: { variant: 'primary', color: 'default' },
      style: {
        vars: {
          [color]: theme.button.default.contrastColor,
          [colorHover]: theme.button.default.contrastColor,
          [colorActive]: theme.button.default.contrastColor,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.default.background,
          [backgroundHover]: theme.button.default.backgroundHover,
          [backgroundActive]: theme.button.default.backgroundActive,
          [backgroundDisabled]: theme.disabled.background,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'primary', color: 'primary' },
      style: {
        vars: {
          [color]: theme.button.primary.contrastColor,
          [colorHover]: theme.button.primary.contrastColor,
          [colorActive]: theme.button.primary.contrastColor,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.primary.background,
          [backgroundHover]: theme.button.primary.backgroundHover,
          [backgroundActive]: theme.button.primary.backgroundActive,
          [backgroundDisabled]: theme.disabled.background,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'primary', color: 'success' },
      style: {
        vars: {
          [color]: theme.button.success.contrastColor,
          [colorHover]: theme.button.success.contrastColor,
          [colorActive]: theme.button.success.contrastColor,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.success.background,
          [backgroundHover]: theme.button.success.backgroundHover,
          [backgroundActive]: theme.button.success.backgroundActive,
          [backgroundDisabled]: theme.disabled.background,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'primary', color: 'warning' },
      style: {
        vars: {
          [color]: theme.button.warning.contrastColor,
          [colorHover]: theme.button.warning.contrastColor,
          [colorActive]: theme.button.warning.contrastColor,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.warning.background,
          [backgroundHover]: theme.button.warning.backgroundHover,
          [backgroundActive]: theme.button.warning.backgroundActive,
          [backgroundDisabled]: theme.disabled.background,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'primary', color: 'danger' },
      style: {
        vars: {
          [color]: theme.button.danger.contrastColor,
          [colorHover]: theme.button.danger.contrastColor,
          [colorActive]: theme.button.danger.contrastColor,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.danger.background,
          [backgroundHover]: theme.button.danger.backgroundHover,
          [backgroundActive]: theme.button.danger.backgroundActive,
          [backgroundDisabled]: theme.disabled.background,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    //#endregion

    //#region secondary
    {
      variants: { variant: 'secondary', color: 'default' },
      style: {
        vars: {
          [color]: theme.button.default.color,
          [colorHover]: theme.button.default.color,
          [colorActive]: theme.button.default.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: theme.button.default.border,
          [borderColorHover]: theme.button.default.borderHover,
          [borderColorActive]: theme.button.default.borderActive,
          [borderColorDisabled]: theme.disabled.border,
        },
      },
    },
    {
      variants: { variant: 'secondary', color: 'primary' },
      style: {
        vars: {
          [color]: theme.button.primary.color,
          [colorHover]: theme.button.primary.color,
          [colorActive]: theme.button.primary.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: theme.button.primary.border,
          [borderColorHover]: theme.button.primary.borderHover,
          [borderColorActive]: theme.button.primary.borderActive,
          [borderColorDisabled]: theme.disabled.border,
        },
      },
    },
    {
      variants: { variant: 'secondary', color: 'success' },
      style: {
        vars: {
          [color]: theme.button.success.color,
          [colorHover]: theme.button.success.color,
          [colorActive]: theme.button.success.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: theme.button.success.border,
          [borderColorHover]: theme.button.success.borderHover,
          [borderColorActive]: theme.button.success.borderActive,
          [borderColorDisabled]: theme.disabled.border,
        },
      },
    },
    {
      variants: { variant: 'secondary', color: 'warning' },
      style: {
        vars: {
          [color]: theme.button.warning.color,
          [colorHover]: theme.button.warning.color,
          [colorActive]: theme.button.warning.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: theme.button.warning.border,
          [borderColorHover]: theme.button.warning.borderHover,
          [borderColorActive]: theme.button.warning.borderActive,
          [borderColorDisabled]: theme.disabled.border,
        },
      },
    },
    {
      variants: { variant: 'secondary', color: 'danger' },
      style: {
        vars: {
          [color]: theme.button.danger.color,
          [colorHover]: theme.button.danger.color,
          [colorActive]: theme.button.danger.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: theme.button.danger.border,
          [borderColorHover]: theme.button.danger.borderHover,
          [borderColorActive]: theme.button.danger.borderActive,
          [borderColorDisabled]: theme.disabled.border,
        },
      },
    },
    //#endregion

    //#region tertiary
    {
      variants: { variant: 'tertiary', color: 'default' },
      style: {
        vars: {
          [color]: theme.button.default.color,
          [colorHover]: theme.button.default.color,
          [colorActive]: theme.button.default.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'tertiary', color: 'primary' },
      style: {
        vars: {
          [color]: theme.button.primary.color,
          [colorHover]: theme.button.primary.color,
          [colorActive]: theme.button.primary.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'tertiary', color: 'success' },
      style: {
        vars: {
          [color]: theme.button.success.color,
          [colorHover]: theme.button.success.color,
          [colorActive]: theme.button.success.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'tertiary', color: 'warning' },
      style: {
        vars: {
          [color]: theme.button.warning.color,
          [colorHover]: theme.button.warning.color,
          [colorActive]: theme.button.warning.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    {
      variants: { variant: 'tertiary', color: 'danger' },
      style: {
        vars: {
          [color]: theme.button.danger.color,
          [colorHover]: theme.button.danger.color,
          [colorActive]: theme.button.danger.color,
          [colorDisabled]: theme.disabled.color,
          [background]: theme.button.background,
          [backgroundHover]: theme.button.backgroundHover,
          [backgroundActive]: theme.button.backgroundActive,
          [backgroundDisabled]: TRANSPARENT,
          [borderColor]: TRANSPARENT,
          [borderColorHover]: TRANSPARENT,
          [borderColorActive]: TRANSPARENT,
          [borderColorDisabled]: TRANSPARENT,
        },
      },
    },
    //#endregion
  ],
})

export const ButtonAfterStyle = style({
  marginInlineEnd: `calc(${gap} - ${padding})`,
})

export const IconButtonStyle = style({
  vars: {
    [minWidth]: '0',
    [padding]: '0',
    [font]: `${icon} monospace`,
  },
  aspectRatio: '1 / 1',
})

export const LinkButtonStyle = style({
  textDecoration: 'none',
})
