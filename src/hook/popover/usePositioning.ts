'use client'
import type { Coords, Middleware, Placement, Strategy } from '@floating-ui/dom'
import {
  arrow,
  autoUpdate,
  computePosition,
  flip,
  inline,
  offset,
  platform,
  shift,
  size,
} from '@floating-ui/dom'
import { getOppositePlacement, getSide } from '@floating-ui/utils'
import { isEqual } from 'lodash-es'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { refValue, type RefValue } from '../react'
import type { Position } from './style/positioning.css'
import { placementMap, positionMap } from './style/positioning.css'
import { usePositioningOptions } from './useAnchorPositioning'

export {
  placementMap,
  Position,
  positionAreaMap,
  positionAxisMap,
  positionMap,
} from './style/positioning.css'

export interface PositioningOptions {
  disabled?: boolean | undefined
  position?: Position | undefined
  fallback?: Position | readonly Position[] | undefined
  tryCrossAxis?: boolean | undefined
  strategy?: Strategy | undefined
  offset?: number | undefined
  align?: boolean | undefined
  anchorRef?: RefValue<Element | null> | undefined
}

interface State extends Coords {
  position: Position
  strategy: Strategy
  isRTL?: boolean
  arrow?: React.CSSProperties | undefined
}

export interface Positioning {
  options: {
    position: Position
    strategy: Strategy
  }
  isRTL: boolean | undefined
  position: Position
  strategy: Strategy
  anchorStyle: React.CSSProperties | undefined
  positionedStyle: React.CSSProperties | undefined
  arrowStyle?: React.CSSProperties | undefined
}

export function usePositioning(
  _options: PositioningOptions & {
    anchorRef: RefValue<Element> | undefined
    positionedRef: RefValue<HTMLElement> | undefined
    arrowRef?: RefValue<HTMLElement> | undefined
  }
): Positioning {
  {
    const ref = useRef(_options)

    // eslint-disable-next-line react-hooks/refs
    if (isEqual(_options, ref.current)) {
      // eslint-disable-next-line react-hooks/immutability, react-hooks/refs
      _options = ref.current
    }

    useEffect(() => {
      ref.current = _options
    })
  }

  const { anchorRef, positionedRef, arrowRef } = _options
  const options = usePositioningOptions(_options)
  const { position, strategy } = options
  const [state, setState] = useState<State>({ x: 0, y: 0, position, strategy })
  const ref = useRef({ state })

  useLayoutEffect(() => {
    const anchorEl = refValue(anchorRef)
    const positionedEl = refValue(positionedRef)
    const arrowEl = refValue(arrowRef)
    const disabled = options.disabled || !anchorEl || !positionedEl

    if (disabled) return

    let controller = new AbortController()

    const stop = autoUpdate(anchorEl, positionedEl, async () => {
      controller.abort()
      const { signal } = (controller = new AbortController())

      try {
        const isRTL = await platform.isRTL(positionedEl) // https://github.com/floating-ui/floating-ui/blob/c3042f1f37d96dfadff1d8894daa31e120d89ed4/packages/core/src/computePosition.ts#L35
        const placement = resolve(positionMap[options.position], isRTL)
        const fallbackPlacements = options.fallback.map((position) =>
          resolve(positionMap[position], isRTL)
        )

        signal.throwIfAborted()

        positionedEl.style.minWidth = ''
        positionedEl.style.minHeight = ''
        positionedEl.style.maxWidth = ''
        positionedEl.style.maxHeight = ''

        const middleware: Middleware[] = [
          inline({
            padding: 0,
          }),
          offset({
            mainAxis: options.offset,
          }),
          flip({
            fallbackPlacements,
          }),
          shift({
            // TODO: Allow overlapping when there is not enough space
            crossAxis: false, // https://floating-ui.com/docs/shift#crossaxis
            padding: options.offset,
          }),
          size({
            padding: options.offset,
            apply: ({
              placement,
              elements,
              rects,
              availableWidth,
              availableHeight,
            }) => {
              if (!signal.aborted) {
                if (availableWidth < rects.floating.width) {
                  elements.floating.style.maxWidth = `${Math.max(0, availableWidth)}px`
                }

                if (availableHeight < rects.floating.height) {
                  elements.floating.style.maxHeight = `${Math.max(0, availableHeight)}px`
                }

                switch (options.align && getSide(placement)) {
                  case 'top':
                  case 'bottom':
                    positionedEl.style.minWidth = `${Math.min(rects.reference.width, availableWidth)}px`
                    break
                  case 'left':
                  case 'right':
                    positionedEl.style.minHeight = `${Math.min(rects.reference.height, availableHeight)}px`
                    break
                }
              }
            },
          }),
        ]

        if (arrowEl) {
          middleware.push(
            arrow({
              element: arrowEl,
            })
          )
        }

        const { middlewareData, ..._state } = await computePosition(
          anchorEl,
          positionedEl,
          { platform, placement, strategy: options.strategy, middleware }
        )

        const state: State = {
          x: _state.x,
          y: _state.y,
          position: placementMap[resolve(_state.placement, isRTL)],
          strategy: _state.strategy,
          isRTL,
        }

        signal.throwIfAborted()

        if (middlewareData.arrow) {
          const side = getSide(_state.placement)

          state.arrow = {
            position: 'absolute',
            [getOppositePlacement(side)]: '0',
          }

          if (middlewareData.arrow.y != null) {
            state.arrow.top = `${middlewareData.arrow.y}px`
          }

          if (middlewareData.arrow.x != null) {
            state.arrow.left = `${middlewareData.arrow.x}px`
          }
        }

        if (!isEqual(ref.current.state, state)) {
          ref.current.state = state
          flushSync(() => setState(ref.current.state))
        }
      } catch {}
    })

    return () => {
      stop()
      controller.abort()
    }
  }, [
    anchorRef,
    arrowRef,
    options.align,
    options.disabled,
    options.fallback,
    options.offset,
    options.position,
    options.strategy,
    positionedRef,
  ])

  let anchorStyle: React.CSSProperties | undefined

  let positionedStyle: React.CSSProperties | undefined

  let arrowStyle: React.CSSProperties | undefined

  if (!options.disabled) {
    anchorStyle = undefined

    positionedStyle = {
      position: state.strategy,
      top: 0,
      left: 0,
      translate: `${state.x}px ${state.y}px`,
      willChange: 'translate',
    }

    arrowStyle = state.arrow
  }

  return {
    options: { position, strategy },
    isRTL: options.disabled ? undefined : state.isRTL,
    position: options.disabled ? position : state.position,
    strategy: options.disabled ? strategy : state.strategy,
    anchorStyle,
    positionedStyle,
    arrowStyle,
  }
}

function resolve(placement: Placement, isRTL: boolean) {
  switch (isRTL && getSide(placement)) {
    case 'left':
    case 'right':
      return getOppositePlacement(placement)
    default:
      return placement
  }
}
