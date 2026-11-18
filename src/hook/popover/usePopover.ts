'use client'
import {
  cloneElement,
  createElement,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
import {
  Keyboard,
  type KeyboardOptions,
  type KeyboardProps,
  type NavigationDirection,
} from '../accessibility/keyboard/Keyboard'
import { useController } from '../accessibility/keyboard/useController'
import type { HTMLElementRef } from '../react/element.d'
import { useRefCallback } from '../react/useRefCallback'
import { useRefObject } from '../react/useRefObject'
import { useUniqueId } from '../react/useUniqueId'
import { OverlayContext } from './context'
import { useAnchor } from './useAnchor'
import { useLightDismiss } from './useLightDismiss'
import {
  useOverlay,
  type Overlay,
  type OverlayAnchorProps,
  type ToggleCallback,
} from './useOverlay'
import { usePositioning, type PositioningOptions } from './usePositioning'
import { useReturnFocus } from './useReturnFocus'

export interface PopoverOptions<T extends React.HTMLElementType>
  extends React.AriaAttributes, React.PropsWithChildren {
  role?: React.AriaRole | undefined
  anchor?: React.ReactElement<OverlayAnchorProps> | null | undefined
  positioning?: PositioningOptions | undefined
  keyboard?: KeyboardOptions | NavigationDirection | undefined
  defaultOpen?: boolean | undefined
  open?: boolean | undefined
  onToggle?: ToggleCallback | undefined
  ref?: React.Ref<Overlay<HTMLElementRef<T>>> | undefined
}

export function usePopover<T extends React.HTMLElementType = 'div'>(
  options: PopoverOptions<T>
) {
  const {
    anchor,
    positioning: positioningOptions = {},
    keyboard: keyboardOptions = 'block',
    defaultOpen,
    open,
    onToggle,
    ref,
    children,
    ...props
  } = options

  let anchorProps: OverlayAnchorProps = { ...anchor?.props }
  let positionedProps: React.JSX.IntrinsicElements[T] = { ...props }
  let keyboardProps: KeyboardProps

  {
    const _id = useUniqueId('popover-')
    positionedProps.id ||= _id

    if (typeof keyboardOptions === 'string') {
      keyboardProps = { direction: keyboardOptions }
    } else {
      keyboardProps = keyboardOptions
    }
  }

  const anchorRef = useRefObject(anchorProps.ref)
  const positionedRef = useRef<HTMLElementRef<T>>(null)
  const [keyboardRef, setKeyboardRef] = useRefCallback(keyboardProps.ref)

  const overlay = useOverlay({
    anchorRef,
    positionedRef,
    defaultOpen,
    open,
    onToggle,
  })

  useImperativeHandle(ref, () => overlay, [overlay])

  const source = useReturnFocus(overlay)

  anchorProps = useAnchor(anchorProps, overlay)

  {
    ;[anchorProps, positionedProps] = useLightDismiss(
      anchorProps,
      positionedProps,
      overlay,
      source
    )
  }

  {
    useLayoutEffect(() => {
      const { anchor, positioned }: Overlay<HTMLElement> = overlay

      if (positioned && overlay.open && !positioned.matches(':popover-open')) {
        const _source = source || anchor

        positioned.showPopover(
          _source instanceof HTMLElement ? { source: _source } : undefined
        )
      }
    })

    {
      const { positioned }: Overlay<HTMLElement> = overlay

      if (positioned && !overlay.open && positioned.matches(':popover-open')) {
        positioned.hidePopover()
      }
    }
  }

  const positioning = usePositioning({
    ...positioningOptions,
    disabled: positioningOptions.disabled || !overlay.open,
    position: positioningOptions.position ?? 'below-start',
    anchorRef: positioningOptions.anchorRef ?? anchorRef,
    positionedRef,
  })

  anchorProps = useController(
    anchorProps,
    positioning.options.position,
    overlay,
    keyboardRef
  )

  anchorProps = {
    ...anchorProps,
    'aria-controls': overlay.open
      ? anchorProps['aria-controls'] || positionedProps.id
      : undefined,
    'aria-expanded': overlay.open,
    'aria-haspopup': true,
    style: {
      ...positioning.anchorStyle,
      ...anchorProps.style,
    },
    ref: anchorRef,
  }

  keyboardProps = {
    ...keyboardProps,
    ref: setKeyboardRef,
    children,
  }

  positionedProps = {
    ...positionedProps,
    role: positionedProps.role || 'dialog',
    'aria-modal': false,
    popover: 'manual',
    tabIndex: undefined,
    style: {
      ...(overlay.open ? positioning.positionedStyle : { display: 'none' }),
      ...positionedProps.style,
    },
    ref: positionedRef,
    children: createElement(
      OverlayContext,
      { value: overlay },
      createElement(Keyboard, keyboardProps)
    ),
  }

  return {
    overlay,
    position: positioning.position,
    anchor: anchor == null ? null : cloneElement(anchor, anchorProps),
    positioned: { props: positionedProps },
    keyboard: { props: keyboardProps },
  }
}
