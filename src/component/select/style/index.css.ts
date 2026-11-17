import {
  ActiveSelector,
  DisabledSelector,
  HighlightName,
  radiusVar,
  SquircleStyle,
  theme,
  TRANSPARENT,
} from '#theme'
import { createVar, style } from '@vanilla-extract/css'
import { recipe } from '@vanilla-extract/recipes'

const gap = createVar()
const width = createVar()
const padding = createVar()
const paddingBlock = createVar()
const paddingInline = createVar()
const margin = createVar()
const marginBlock = createVar()
const marginInline = createVar()
const font = createVar()
const icon = createVar()
const color = createVar()
const colorChecked = createVar()
const colorDisabled = createVar()
const cursor = createVar()
const cursorDisabled = createVar()
const background = createVar()
const backgroundHover = createVar()
const backgroundActive = createVar()
const backgroundDisabled = createVar()
const border = createVar()
const borderSize = createVar()

const gridTemplate = "'a b c' / auto 1fr auto"
const gridColumn = 'span 3'
const paddingBlockValue = `calc((${theme.item.height} - 1lh) / 2)`

export const ListStyle = style({
  vars: {
    [gap]: theme.group.gap,
    [width]: theme.menu.width,
    [padding]: theme.menu.padding,
  },
  position: 'relative',
  boxSizing: 'border-box',
  display: 'grid',
  gridTemplate,
  gap,
  inlineSize: width,
  padding,
  margin: '0',
  overflow: 'auto',
  scrollSnapType: 'both mandatory',
  scrollPadding: padding,
  selectors: {
    [`&::highlight(${HighlightName})`]: {
      textDecorationLine: 'underline',
    },
  },
})

export const ItemStyle = recipe({
  base: [
    SquircleStyle,
    {
      vars: {
        [gap]: theme.item.gap,
        [padding]: `${paddingBlock} ${paddingInline}`,
        [paddingBlock]: paddingBlockValue,
        [paddingInline]: theme.item.padding,
        [icon]: theme.item.icon,
        [color]: 'inherit',
        [colorDisabled]: theme.disabled.color,
        [cursor]: 'pointer',
        [cursorDisabled]: 'not-allowed',
        [background]: 'none',
        [backgroundHover]: theme.hover.background,
        [backgroundActive]: theme.active.background,
        [backgroundDisabled]: 'none',
        [radiusVar]: theme.item.radius,
      },
      display: 'grid',
      gridTemplateRows: 'subgrid',
      gridTemplateColumns: 'subgrid',
      gridColumn,
      gap,
      placeItems: 'start',
      padding,
      color,
      cursor,
      scrollSnapAlign: 'center',
      background,
      ':hover': {
        vars: {
          [background]: backgroundHover,
        },
      },
      selectors: {
        [`&${ActiveSelector}`]: {
          vars: {
            [background]: backgroundActive,
          },
        },
        [`&${DisabledSelector}`]: {
          vars: {
            [color]: colorDisabled,
            [cursor]: cursorDisabled,
            [background]: backgroundDisabled,
          },
        },
      },
    },
  ],
  variants: {
    danger: {
      true: {
        vars: {
          [color]: theme.danger.color,
        },
      },
    },
  },
})

export const ItemContentStyle = style({
  gridArea: 'b',
})

export const ItemBeforeStyle = style({
  display: 'flex',
  gridArea: 'a',
  placeItems: 'center',
  ':empty': {
    display: 'none',
  },
})

export const ItemAfterStyle = style({
  display: 'flex',
  gridArea: 'c',
  placeItems: 'center',
  ':empty': {
    display: 'none',
  },
})

export const ItemIconStyle = style({
  vars: {
    [marginBlock]: `calc((1lh - ${icon}) / 2)`,
    [color]: TRANSPARENT,
    [colorChecked]: 'inherit',
  },
  flexShrink: '0',
  marginBlock,
  fontSize: icon,
  color,
  selectors: {
    ':is([aria-checked="true"], [aria-selected="true"]) &': {
      vars: {
        [color]: colorChecked,
      },
    },
  },
})

export const SeparatorStyle = style({
  vars: {
    [margin]: `${marginBlock} ${marginInline}`,
    [marginBlock]: paddingBlockValue,
    [marginInline]: '0',
    [color]: theme.separator.color,
    [border]: `${borderSize} solid`,
    [borderSize]: theme.separator.size,
  },
  display: 'block',
  gridColumn,
  padding: '0',
  margin,
  color,
  borderBlockEnd: border,
})

export const GroupStyle = style({
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  gridColumn,
  gap: 'inherit',
})

export const GroupHeaderStyle = style({
  vars: {
    [padding]: `${paddingBlock} ${paddingInline}`,
    [paddingBlock]: paddingBlockValue,
    [paddingInline]: theme.item.padding,
    [font]: theme.group.font,
    [color]: theme.group.color,
  },
  position: 'sticky',
  insetBlockStart: '0',
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  gridColumn,
  gap: 'inherit',
  padding,
})

export const GroupLabelStyle = style({
  gridColumn,
  font,
  color,
})

export const GroupNestedListStyle = style({
  display: 'grid',
  gridTemplateColumns: 'subgrid',
  gridColumn,
  gap: 'inherit',
  padding: '0',
  margin: '0',
})
