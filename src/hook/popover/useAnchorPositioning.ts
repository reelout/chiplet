import {
  getAlignment,
  getExpandedPlacements,
  getOppositeAxisPlacements,
  getOppositePlacement,
} from '@floating-ui/utils'
import { useMemo } from 'react'
import { useUniqueId } from '../react/useUniqueId'
import {
  placementMap,
  positionAreaMap,
  positionAxisMap,
  positionInsetMap,
  positionMap,
  PositionOffset,
  positionTryOptionMap,
  type Position,
} from './style/positioning.css'
import type { Positioning, PositioningOptions } from './usePositioning'

/**
 * https://developer.mozilla.org/en-US/docs/Web/CSS/position-area
 */
export const isAnchorPositioningSupported =
  typeof CSS !== 'undefined' &&
  typeof CSS.supports === 'function' &&
  CSS.supports('position-area: center')

export function useAnchorPositioning(options: PositioningOptions): Positioning {
  const { disabled, position, fallback, strategy, offset } =
    usePositioningOptions(options)

  const anchorName = useUniqueId('--anchor-')

  let anchorStyle: React.CSSProperties | undefined

  let positionedStyle: React.CSSProperties | undefined

  if (!disabled) {
    anchorStyle = {
      anchorName,
    }

    positionedStyle = {
      [PositionOffset]: `${offset}px`,
      position: strategy,
      positionAnchor: anchorName,
      positionArea: positionAreaMap[position],
      positionTry: fallback
        .map((position) => positionTryOptionMap[position])
        .join(', '),
      margin: '0',
      inset: 'auto',
      [positionInsetMap[position]]: `var(${PositionOffset})`,
    }

    switch (options.align && positionAxisMap[position]) {
      case 'block':
        positionedStyle.minInlineSize = `min(100vi, 100%, anchor-size(self-inline))`
        break
      case 'inline':
        positionedStyle.minBlockSize = `min(100vb, 100%, anchor-size(self-block))`
        break
    }
  }

  return {
    options: { position, strategy },
    isRTL: undefined,
    position,
    strategy,
    anchorStyle,
    positionedStyle,
  }
}

/**
 * https://floating-ui.com/docs/flip#fallbackplacements
 *
 * https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/position-try
 */
export function positionTry(position: Position, tryCrossAxis?: boolean) {
  const placement = positionMap[position]

  return (
    getAlignment(placement)
      ? getExpandedPlacements(placement).concat(
          tryCrossAxis ? getOppositeAxisPlacements(placement, true, 'end') : []
        )
      : [getOppositePlacement(placement)].concat(
          tryCrossAxis ? getOppositeAxisPlacements(placement, true, 'end') : []
        )
  ).map((placement) => placementMap[placement])
}

export function usePositioningOptions(options: PositioningOptions) {
  const { position = 'below' } = options

  const fallback = useMemo(() => {
    const fallback = options.fallback

    if (typeof fallback === 'string') {
      return [fallback]
    }

    if (fallback == null) {
      return positionTry(position, options.tryCrossAxis)
    }

    return fallback
  }, [options.fallback, options.tryCrossAxis, position])

  return {
    disabled: options.disabled ?? false,
    position,
    fallback,
    strategy: options.strategy ?? 'fixed',
    offset: options.offset ?? 8,
    align: options.align ?? false,
  }
}

declare module 'react' {
  interface CSSProperties {
    anchorName?: string
    positionAnchor?: string
    positionArea?: string
    positionTry?: string
  }
}
