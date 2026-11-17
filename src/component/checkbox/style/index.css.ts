import { theme } from '#theme'
import {
  createVar,
  globalStyle,
  style,
  type StyleRule,
} from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const outset = createVar()
const gap = createVar()
const width = createVar()
const height = createVar()
const size = createVar()
const padding = createVar()
const color = createVar()
const colorHover = createVar()
const colorActive = createVar()
const colorChecked = createVar()
const colorCheckedHover = createVar()
const colorCheckedActive = createVar()
const colorDisabled = createVar()
const cursor = createVar()
const cursorDisabled = createVar()
const background = createVar()
const backgroundChecked = createVar()
const backgroundDisabled = createVar()
const scale = createVar()
const scaleActive = createVar()
const scaleDisabled = createVar()
const translate = createVar()
const translateChecked = createVar()
const transition = createVar()

export const CheckboxGroupStyle = style({
  vars: {
    [gap]: theme.group.gap,
  },
  display: 'flex',
  flexDirection: 'column',
  gap,
  padding: 'unset',
  margin: 'unset',
  border: 'unset',
})

export const RadioGroupStyle = style({
  vars: {
    [gap]: theme.group.gap,
  },
  display: 'flex',
  flexDirection: 'column',
  gap,
  padding: 'unset',
  margin: 'unset',
  border: 'unset',
})

export const CheckboxStyle = recipe({
  base: {
    vars: {
      [color]: theme.checkbox.color,
      [colorHover]: theme.checkbox.colorHover,
      [colorActive]: theme.checkbox.colorActive,
      [colorChecked]: theme.checkbox.colorChecked,
      [colorCheckedHover]: theme.checkbox.colorCheckedHover,
      [colorCheckedActive]: theme.checkbox.colorCheckedActive,
      [colorDisabled]: theme.disabled.color,
      [cursor]: 'pointer',
      [cursorDisabled]: 'not-allowed',
      [transition]: theme.checkbox.transition,
    },
    position: 'relative',
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: '0',
    placeContent: 'center',
    placeItems: 'center',
    inlineSize: size,
    aspectRatio: '1 / 1',
    verticalAlign: 'top',
    color,
    cursor,
    outlineOffset: theme.checkbox.outline,
    transition,
    selectors: {
      // https://kizu.dev/label-to-input/
      '&:has(:hover, :focus-visible)': {
        vars: {
          [color]: colorHover,
        },
      },
      // https://larsmagnus.co/blog/focus-visible-within-the-missing-pseudo-class#using-has-to-emulate-focus-visible-within
      '&:has(:focus-visible)': {
        outline: theme.outline,
      },
      '&:has(:active)': {
        vars: {
          [color]: colorActive,
        },
      },
      '&:has(:indeterminate, :checked)': {
        vars: {
          [color]: colorChecked,
        },
      },
      '&:has(:indeterminate, :checked):where(:has(:hover, :focus-visible))': {
        vars: {
          [color]: colorCheckedHover,
        },
      },
      '&:has(:indeterminate, :checked):where(:has(:active))': {
        vars: {
          [color]: colorCheckedActive,
        },
      },
      '&:has(:disabled)': {
        vars: {
          [color]: colorDisabled,
          [cursor]: cursorDisabled,
        },
      },
    },
  },
  variants: {
    size: {
      small: {
        vars: {
          [outset]: theme.checkbox.outset,
          [size]: theme.checkbox.size.small,
        },
      },
      medium: {
        vars: {
          [outset]: theme.checkbox.outset,
          [size]: theme.checkbox.size.medium,
        },
      },
      large: {
        vars: {
          [outset]: theme.checkbox.outset,
          [size]: theme.checkbox.size.large,
        },
      },
    },
  },
})

globalStyle(`${CheckboxStyle.classNames.base} > input`, {
  position: 'absolute',
  inset: `calc(-1 * ${outset})`,
  margin: '0',
  appearance: 'none',
  cursor: 'inherit',
  outlineColor: 'transparent',
  borderRadius: '50%',
})

const CheckboxIconStyle = style({
  position: 'absolute',
  inset: 'auto',
  inlineSize: '100%',
  color: 'transparent',
  pointerEvents: 'none',
  transition: 'inherit',
})

const CheckboxIconShownStyle: StyleRule = {
  color: 'inherit',
}

export const CheckboxUncheckedIconStyle = style([
  CheckboxIconStyle,
  {
    selectors: {
      ':not(:checked, :indeterminate) ~ &': CheckboxIconShownStyle,
    },
  },
])

export const CheckboxIndeterminateIconStyle = style([
  CheckboxIconStyle,
  {
    selectors: {
      ':indeterminate ~ &': CheckboxIconShownStyle,
    },
  },
])

export const CheckboxCheckedIconStyle = style([
  CheckboxIconStyle,
  {
    selectors: {
      ':checked ~ &': CheckboxIconShownStyle,
    },
  },
])

export const RadioUncheckedIconStyle = style([
  CheckboxIconStyle,
  CheckboxIconShownStyle,
])

export const RadioCheckedIconStyle = style([
  CheckboxIconStyle,
  CheckboxIconShownStyle,
  {
    scale: 0,
    selectors: {
      ':checked ~ &': {
        scale: 1,
      },
    },
  },
])

export const SwitchStyle = recipe({
  base: {
    vars: {
      [size]: `calc(${height} - ${padding} * 2)`,
      [color]: theme.switch.color,
      [colorChecked]: theme.switch.colorChecked,
      [colorDisabled]: theme.disabled.color,
      [cursor]: 'pointer',
      [cursorDisabled]: 'not-allowed',
      [background]: theme.switch.background,
      [backgroundChecked]: theme.switch.backgroundChecked,
      [backgroundDisabled]: theme.disabled.background,
      [scale]: '1',
      [scaleActive]: '1.25',
      [scaleDisabled]: '1',
      [translate]: padding,
      [translateChecked]: `calc(${width} - ${size} * ${scale} - ${padding})`,
      [transition]: theme.switch.transition,
    },
    position: 'relative',
    boxSizing: 'border-box',
    display: 'inline-flex',
    flexShrink: '0',
    placeContent: 'center',
    placeItems: 'center',
    inlineSize: width,
    blockSize: height,
    padding,
    color,
    cursor,
    outlineOffset: theme.switch.outline,
    background,
    borderRadius: height,
    transition,
    '::after': {
      position: 'absolute',
      insetInlineStart: '0',
      inlineSize: `calc(${size} * ${scale})`,
      blockSize: size,
      pointerEvents: 'none',
      content: '',
      background: 'currentcolor',
      borderRadius: 'inherit',
      translate,
      transition: 'inherit',
    },
    selectors: {
      '&:has(:focus-visible)': {
        outline: theme.outline,
      },
      '&:has(:active)': {
        vars: {
          [scale]: scaleActive,
        },
      },
      '&:has(:checked)': {
        vars: {
          [color]: colorChecked,
          [background]: backgroundChecked,
          [translate]: translateChecked,
        },
      },
      '&:has(:disabled)': {
        vars: {
          [color]: colorDisabled,
          [cursor]: cursorDisabled,
          [background]: backgroundDisabled,
          [scale]: scaleDisabled,
        },
      },
    },
  },
  variants: {
    size: {
      small: {
        vars: {
          [outset]: theme.switch.outset,
          [width]: theme.switch.width.small,
          [height]: theme.switch.height.small,
          [padding]: theme.switch.padding.small,
        },
      },
      medium: {
        vars: {
          [outset]: theme.switch.outset,
          [width]: theme.switch.width.medium,
          [height]: theme.switch.height.medium,
          [padding]: theme.switch.padding.medium,
        },
      },
      large: {
        vars: {
          [outset]: theme.switch.outset,
          [width]: theme.switch.width.large,
          [height]: theme.switch.height.large,
          [padding]: theme.switch.padding.large,
        },
      },
    },
  },
})

export const SwitchInputStyle = style({
  position: 'absolute',
  inset: `calc(-1 * ${outset})`,
  margin: '0',
  appearance: 'none',
  cursor: 'inherit',
  opacity: '0',
})
