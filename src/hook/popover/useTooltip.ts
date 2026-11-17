'use client'
import {
  cloneElement,
  useCallback,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import { useRefObject } from '../react/useRefObject'
import { useUniqueId } from '../react/useUniqueId'
import { useLightDismiss } from './useLightDismiss'
import {
  useOverlay,
  type Overlay,
  type OverlayAnchorProps,
  type ToggleCallback,
} from './useOverlay'
import { usePositioning, type PositioningOptions } from './usePositioning'
import { useReturnFocus } from './useReturnFocus'

type TooltipTag = 'div'

export interface TooltipOptions {
  delay?: number | undefined
  anchor?: React.ReactElement<OverlayAnchorProps> | null | undefined
  positioning?: PositioningOptions | undefined
  defaultOpen?: boolean | undefined
  open?: boolean | undefined
  onToggle?: ToggleCallback | undefined
  ref?: React.Ref<Overlay<HTMLDivElement>> | undefined
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Roles/tooltip_role
 * https://www.w3.org/WAI/ARIA/apg/patterns/tooltip/
 */
export function useTooltip(options: TooltipOptions) {
  const {
    delay = 200,
    anchor,
    positioning: positioningOptions = {},
    defaultOpen,
    open,
    onToggle,
    ref,
    ...props
  } = options

  let anchorProps: OverlayAnchorProps = { ...anchor?.props }
  let positionedProps: React.JSX.IntrinsicElements[TooltipTag] = { ...props }
  let arrowProps: React.ComponentProps<'div'>

  const _id = useUniqueId('tooltip-')
  positionedProps.id ||= _id

  const anchorRef = useRefObject(anchorProps.ref)
  const positionedRef = useRef<HTMLDivElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)

  const overlay = useOverlay({
    anchorRef,
    positionedRef,
    defaultOpen,
    open,
    onToggle,
  })

  useImperativeHandle(ref, () => overlay, [overlay])

  useReturnFocus(overlay)

  {
    ;[anchorProps, positionedProps] = useLightDismiss(
      anchorProps,
      positionedProps,
      overlay,
      null
    )
  }

  {
    const ref = useRef({
      overlay,
      closing: 0,
      focused: false,
      hovered: false,
      mounted: true,
    })

    useLayoutEffect(() => {
      const { current } = ref
      current.overlay = overlay
      current.mounted = true

      return () => {
        current.mounted = false
      }
    })

    const handleToggle = useCallback(
      (open: boolean, ev: React.FocusEvent | React.PointerEvent) => {
        const { overlay } = ref.current

        if (open && !ref.current.focused && !ref.current.hovered) {
          if (!ref.current.closing) {
            overlay.toggle(ev)
          }
        }

        if (ref.current.closing) {
          window.clearTimeout(ref.current.closing)
          ref.current.closing = 0
        }

        if (ev.nativeEvent instanceof FocusEvent) {
          ref.current.focused = open
        } else {
          ref.current.hovered = open
        }

        if (!open && !ref.current.focused && !ref.current.hovered) {
          ref.current.closing = window.setTimeout(() => {
            if (!ref.current.mounted) return
            ref.current.closing = 0
            overlay.toggle(ev)
          }, delay)
        }
      },
      [delay]
    )

    {
      const { onPointerEnter, onPointerLeave, onFocus, onBlur } = anchorProps

      anchorProps = {
        ...anchorProps,
        onPointerEnter: useCallback(
          (ev: React.PointerEvent) => {
            onPointerEnter?.(ev)
            handleToggle(true, ev)
          },
          [handleToggle, onPointerEnter]
        ),
        onPointerLeave: useCallback(
          (ev: React.PointerEvent) => {
            onPointerLeave?.(ev)
            handleToggle(false, ev)
          },
          [handleToggle, onPointerLeave]
        ),
        onFocus: useCallback(
          (ev: React.FocusEvent) => {
            onFocus?.(ev)
            handleToggle(true, ev)
          },
          [handleToggle, onFocus]
        ),
        onBlur: useCallback(
          (ev: React.FocusEvent) => {
            onBlur?.(ev)
            handleToggle(false, ev)
          },
          [handleToggle, onBlur]
        ),
      }
    }

    {
      const { onPointerEnter, onPointerLeave, onFocus, onBlur } =
        positionedProps

      positionedProps = {
        ...positionedProps,
        onPointerEnter: useCallback<NonNullable<typeof onPointerEnter>>(
          (ev) => {
            onPointerEnter?.(ev)
            handleToggle(true, ev)
          },
          [handleToggle, onPointerEnter]
        ),
        onPointerLeave: useCallback<NonNullable<typeof onPointerLeave>>(
          (ev) => {
            onPointerLeave?.(ev)
            handleToggle(false, ev)
          },
          [handleToggle, onPointerLeave]
        ),
        onFocus: useCallback<NonNullable<typeof onFocus>>(
          (ev) => {
            onFocus?.(ev)
            handleToggle(true, ev)
          },
          [handleToggle, onFocus]
        ),
        onBlur: useCallback<NonNullable<typeof onBlur>>(
          (ev) => {
            onBlur?.(ev)
            handleToggle(false, ev)
          },
          [handleToggle, onBlur]
        ),
      }
    }
  }

  const positioning = usePositioning({
    ...positioningOptions,
    disabled: positioningOptions.disabled || !overlay.open,
    position: positioningOptions.position ?? 'above',
    anchorRef: positioningOptions.anchorRef ?? anchorRef,
    positionedRef,
    arrowRef,
  })

  anchorProps = {
    ...anchorProps,
    'aria-describedby': positionedProps.id,
    style: {
      ...positioning.anchorStyle,
      ...anchorProps.style,
    },
    ref: anchorRef,
  }

  positionedProps = {
    ...positionedProps,
    role: 'tooltip',
    tabIndex: undefined,
    style: {
      // The elements linked via aria-describedby don't need to be visible.
      // It is possible to reference an element even if that element is hidden.
      // https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Reference/Attributes/aria-describedby
      // https://www.accessibility-developer-guide.com/examples/sensible-aria-usage/describedby/
      ...(overlay.open ? positioning.positionedStyle : { display: 'none' }),
      ...positionedProps.style,
    },
    ref: positionedRef,
  }

  // eslint-disable-next-line prefer-const
  arrowProps = {
    style: {
      ...positioning.arrowStyle,
    },
    ref: arrowRef,
  }

  return {
    overlay,
    position: positioning.position,
    // eslint-disable-next-line react-hooks/refs
    anchor: anchor == null ? null : cloneElement(anchor, anchorProps),
    positioned: { props: positionedProps },
    arrow: { props: arrowProps },
  }
}
