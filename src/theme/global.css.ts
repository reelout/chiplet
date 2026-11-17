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
    colorScheme: 'light dark', // https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/color_value/light-dark
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

declare module 'csstype' {
  export interface StandardShorthandProperties<
    TLength = (string & {}) | 0,
    TTime = string & {},
  > {
    /**
     * The corner-shape shorthand CSS property specifies the shape of a box's corners, within the area specified by its border-radius property value.
     *
     * @see https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape
     */
    cornerShape?: Property.CornerShape | undefined
  }

  export namespace Property {
    export type CornerShape =
      | Globals
      | 'round'
      | 'scoop'
      | 'bevel'
      | 'notch'
      | 'square'
      | 'squircle'
      | `superellipse(${number})`
      | (string & {})
  }
}
