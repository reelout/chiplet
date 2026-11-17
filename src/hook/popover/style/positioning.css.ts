import { entries, fromEntries, keys } from '#util'
import type { Alignment, Placement } from '@floating-ui/utils'
import { globalStyle } from '@vanilla-extract/css'
import type { Simplify } from 'type-fest'
import { generateDeterministicId } from '../../../util/random/generateDeterministicId'

export type Side = 'above' | 'below' | 'before' | 'after'
export type Axis = 'block' | 'inline'
export type Position = Simplify<Side | `${Side}-${Alignment}`>

export const Position = [
  'above',
  'below',
  'before',
  'after',
  'above-start',
  'above-end',
  'below-start',
  'below-end',
  'before-start',
  'before-end',
  'after-start',
  'after-end',
] as const

export const positionMap: Record<Position, Placement> = {
  'above': 'top',
  'below': 'bottom',
  'before': 'left',
  'after': 'right',
  'above-start': 'top-start',
  'above-end': 'top-end',
  'below-start': 'bottom-start',
  'below-end': 'bottom-end',
  'before-start': 'left-start',
  'before-end': 'left-end',
  'after-start': 'right-start',
  'after-end': 'right-end',
}

export const placementMap: Record<Placement, Position> = fromEntries(
  entries(positionMap).map(([position, placement]) => [placement, position])
)

export const positionAxisMap: Record<Position, Axis> = {
  'above': 'block',
  'above-start': 'block',
  'above-end': 'block',
  'below': 'block',
  'below-start': 'block',
  'below-end': 'block',
  'before': 'inline',
  'before-start': 'inline',
  'before-end': 'inline',
  'after': 'inline',
  'after-start': 'inline',
  'after-end': 'inline',
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/position-area_value#logical_grid_keyword_defaults
 */
export const positionAreaMap: Record<Position, string> = {
  'above': 'block-start',
  'below': 'block-end',
  'before': 'inline-start',
  'after': 'inline-end',
  'above-start': 'start span-end',
  'above-end': 'start span-start',
  'below-start': 'end span-end',
  'below-end': 'end span-start',
  'before-start': 'inline-start span-block-end',
  'before-end': 'inline-start span-block-start',
  'after-start': 'inline-end span-block-end',
  'after-end': 'inline-end span-block-start',
}

export const positionInsetMap: Record<Position, keyof React.CSSProperties> = {
  'above': 'insetBlockEnd',
  'above-start': 'insetBlockEnd',
  'above-end': 'insetBlockEnd',
  'below': 'insetBlockStart',
  'below-start': 'insetBlockStart',
  'below-end': 'insetBlockStart',
  'before': 'insetInlineEnd',
  'before-start': 'insetInlineEnd',
  'before-end': 'insetInlineEnd',
  'after': 'insetInlineStart',
  'after-start': 'insetInlineStart',
  'after-end': 'insetInlineStart',
}

export const PositionOffset = generateDeterministicId('--offset')

const PositionTryOptionName = generateDeterministicId('')

export const positionTryOptionMap: Record<Position, string> = fromEntries(
  keys(positionMap).map((position) => [
    position,
    `--position-try-option-${position}-${PositionTryOptionName}`,
  ])
)

for (const [position, area] of entries(positionAreaMap)) {
  globalStyle(`@position-try ${positionTryOptionMap[position]}`, {
    positionArea: area,
    inset: 'auto',
    [positionInsetMap[position]]: `var(${PositionOffset})`,
    // TODO: extend 'positionTryOptionMap', add '@starting-style' entry
    // animation, and try to reuse 'PopoverStyle'
  })
}
