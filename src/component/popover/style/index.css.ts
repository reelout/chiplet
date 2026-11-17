import { radiusVar, SquircleStyle, stretch, theme } from '#theme'
import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const width = createVar()
const maxWidth = createVar()
const maxHeight = createVar()
const padding = createVar()
const paddingBlock = createVar()
const paddingInline = createVar()
const margin = createVar()
const color = createVar()
const background = createVar()
const border = createVar()
const shadow = createVar()
const backdrop = createVar()
const filter = createVar()
const transform = createVar()
const transformOrigin = createVar()
const translate = createVar()
const translateValue = createVar()
const transition = createVar()
const transitionProperty = `background, opacity, transform, display, overlay`

export const DialogStyle = recipe({
  base: [
    SquircleStyle,
    {
      vars: {
        [maxWidth]: `calc(100% - 2 * ${margin})`,
        [maxHeight]: `calc(100% - 2 * ${margin})`,
        [margin]: theme.dialog.margin,
        [color]: theme.dialog.color,
        [background]: theme.dialog.background,
        [backdrop]: theme.dialog.backdrop,
        [radiusVar]: theme.dialog.radius,
        [shadow]: theme.dialog.shadow,
        [filter]: theme.dialog.filter,
        [transform]: 'none',
        [transition]: theme.dialog.transition,
      },
      boxSizing: 'border-box',
      maxInlineSize: maxWidth,
      maxBlockSize: maxHeight,
      padding: '0',
      margin: 'auto',
      overflow: 'clip auto',
      color,
      background,
      border: 'none',
      boxShadow: shadow,
      transform: 'none',
      transition,
      transitionProperty,
      '::backdrop': {
        background: backdrop,
        backdropFilter: filter,
        transition: 'inherit',
      },
      // https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@starting-style
      '@starting-style': {
        opacity: 0,
        transform,
        '::backdrop': {
          background: 'none',
        },
      },
    },
  ],
  variants: {
    size: {
      auto: {
        inlineSize: 'fit-content',
      },
      stretch: {
        inlineSize: stretch,
      },
      small: {
        inlineSize: theme.dialog.size.small,
      },
      medium: {
        inlineSize: theme.dialog.size.medium,
      },
      large: {
        inlineSize: theme.dialog.size.large,
      },
    },
  },
})

export const PopoverStyle = recipe({
  base: [
    SquircleStyle,
    {
      vars: {
        [color]: theme.popover.color,
        [background]: theme.popover.background,
        [border]: theme.popover.border,
        [radiusVar]: theme.popover.radius,
        [shadow]: theme.popover.shadow,
        [transform]: `${translate} scale(0.95)`,
        [translateValue]: '0.5rem',
        [transition]: theme.popover.transition,
      },
      boxSizing: 'border-box',
      padding: '0',
      margin: '0',
      overflow: 'clip auto',
      color,
      background,
      border,
      boxShadow: shadow,
      transform: 'none',
      transformOrigin,
      transition,
      transitionProperty,
      '@starting-style': {
        opacity: 0,
        // Do not set the CSS 'translate' property here;
        // it is controlled by the 'usePositioning' hook.
        transform,
      },
    },
  ],
  variants: {
    position: {
      'above': {
        vars: {
          [transformOrigin]: '50% 100%',
          [translate]: `translateY(${translateValue})`,
        },
      },
      'above-start': {
        vars: {
          [transformOrigin]: '0% 100%',
          [translate]: `translateY(${translateValue})`,
        },
      },
      'above-end': {
        vars: {
          [transformOrigin]: '100% 100%',
          [translate]: `translateY(${translateValue})`,
        },
      },
      'below': {
        vars: {
          [transformOrigin]: '50% 0%',
          [translate]: `translateY(calc(-1 * ${translateValue}))`,
        },
      },
      'below-start': {
        vars: {
          [transformOrigin]: '0% 0%',
          [translate]: `translateY(calc(-1 * ${translateValue}))`,
        },
      },
      'below-end': {
        vars: {
          [transformOrigin]: '100% 0%',
          [translate]: `translateY(calc(-1 * ${translateValue}))`,
        },
      },
      'before': {
        vars: {
          [transformOrigin]: '100% 50%',
          [translate]: `translateX(${translateValue})`,
        },
      },
      'before-start': {
        vars: {
          [transformOrigin]: '100% 0%',
          [translate]: `translateX(${translateValue})`,
        },
      },
      'before-end': {
        vars: {
          [transformOrigin]: '100% 100%',
          [translate]: `translateX(${translateValue})`,
        },
      },
      'after': {
        vars: {
          [transformOrigin]: '0% 50%',
          [translate]: `translateX(calc(-1 * ${translateValue}))`,
        },
      },
      'after-start': {
        vars: {
          [transformOrigin]: '0% 0%',
          [translate]: `translateX(calc(-1 * ${translateValue}))`,
        },
      },
      'after-end': {
        vars: {
          [transformOrigin]: '0% 100%',
          [translate]: `translateX(calc(-1 * ${translateValue}))`,
        },
      },
    },
  },
})

export const TooltipStyle = style([
  SquircleStyle,
  {
    vars: {
      [padding]: `${paddingBlock} ${paddingInline}`,
      [paddingBlock]: `calc((${theme.tooltip.minHeight} - 1lh) / 2)`,
      [paddingInline]: theme.tooltip.padding,
      [color]: theme.tooltip.color,
      [background]: theme.tooltip.background,
      [border]: theme.tooltip.border,
      [radiusVar]: theme.tooltip.radius,
      [filter]: theme.tooltip.filter,
    },
    boxSizing: 'border-box',
    inlineSize: 'fit-content',
    blockSize: 'fit-content',
    padding,
    margin: '0',
    overflow: 'visible',
    color,
    background,
    border,
    filter,
  },
])

export const TooltipArrowStyle = recipe({
  base: {
    vars: {
      [width]: theme.tooltip.arrow.size,
      [radiusVar]: theme.tooltip.arrow.radius,
    },
    position: 'absolute',
    zIndex: '-1',
    inlineSize: width,
    aspectRatio: '1 / 1',
    background: 'inherit',
    borderRadius: radiusVar,
    transform: 'skew(15deg, 15deg)',
  },
  variants: {
    axis: {
      block: { rotate: '45deg' },
      inline: { rotate: '135deg' },
    },
  },
})
