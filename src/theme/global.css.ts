import {
  VirtualActiveSelector,
  VirtualDisabledSelector,
  VirtualFocusSelector,
} from '#util'
import {
  createVar,
  globalStyle,
  style,
  type StyleRule,
} from '@vanilla-extract/css'
import { generateDeterministicId } from '../util/random/generateDeterministicId'
import { theme, themeClass } from './theme.css'
import { tokenClass } from './token.css'

export const radiusVar = createVar()

export const HighlightName = generateDeterministicId('highlight-')

export const FocusSelector = `:where(:focus-visible, ${VirtualFocusSelector})`

export const ActiveSelector = `:is(:active, ${VirtualActiveSelector})`

export const DisabledSelector = `:is(:disabled, ${VirtualDisabledSelector})`

export const stretch: StyleRule['inlineSize'] = [
  '-webkit-fill-available',
  'stretch',
]

export const GlobalContainerStyle = style([
  tokenClass,
  themeClass,
  {
    padding: '0',
    margin: '0',
    font: theme.body2,
    WebkitFontSmoothing: 'antialiased',
    color: theme.color,
    // Enables 'light-dark()' in the theme tokens; it resolves only with an
    // explicit 'color-scheme'.
    // https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
    colorScheme: 'light dark',
    background: theme.paper.background,
  },
])

globalStyle(`${GlobalContainerStyle} ${FocusSelector}`, {
  outline: theme.outline,
})

export const LightColorScheme = style({
  colorScheme: 'light',
})

export const DarkColorScheme = style({
  colorScheme: 'dark',
})

// Standalone 'light dark' opt-in for containers that do not carry
// 'GlobalContainerStyle'.
export const LightDarkColorScheme = style({
  colorScheme: 'light dark',
})

export const DarkLightColorScheme = style({
  colorScheme: 'dark light',
})

export const SquircleStyle = style({
  borderRadius: radiusVar,
  '@supports': {
    '(corner-shape: squircle)': {
      borderRadius: `calc(${radiusVar} * 2)`,
      cornerShape: 'squircle',
    },
  },
})

export const CircleStyle = style({
  borderRadius: '100vmax',
})
