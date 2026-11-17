'use client'
import {
  cloneElement,
  createElement,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react'
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
import { useReturnFocus } from './useReturnFocus'

type DialogTag = 'dialog'

export interface DialogOptions {
  anchor?: React.ReactElement<OverlayAnchorProps> | null | undefined
  defaultOpen?: boolean | undefined
  open?: boolean | undefined
  onToggle?: ToggleCallback | undefined
  ref?: React.Ref<Overlay<HTMLDialogElement>> | undefined
}

export function useDialog(options: DialogOptions) {
  const { anchor, defaultOpen, open, onToggle, ref, ...props } = options

  let anchorProps: OverlayAnchorProps = { ...anchor?.props }
  let positionedProps: React.JSX.IntrinsicElements[DialogTag] = { ...props }

  const _id = useUniqueId('dialog-')
  positionedProps.id ||= _id

  const anchorRef = useRefObject(anchorProps.ref)
  const positionedRef = useRef<HTMLDialogElement>(null)

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
      const { positioned } = overlay

      if (positioned && overlay.open && !positioned.open) {
        // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#accessibility
        // <dialog> elements invoked by the showModal() method implicitly have aria-modal="true",
        // whereas <dialog> elements invoked by the show() method or displayed using the open attribute or by changing the default display of a <dialog> are exposed as [aria-modal="false"].
        positioned.showModal()
      }
    })

    {
      const { positioned } = overlay

      if (positioned && !overlay.open && positioned.open) {
        positioned.close()
      }
    }
  }

  anchorProps = {
    ...anchorProps,
    'aria-controls': overlay.open
      ? anchorProps['aria-controls'] || positionedProps.id
      : undefined,
    'aria-expanded': overlay.open,
    'aria-haspopup': true,
    ref: anchorRef,
  }

  positionedProps = {
    ...positionedProps,
    role: 'dialog',
    'aria-modal': true,
    tabIndex: -1,
    ref: positionedRef,
    children: createElement(
      OverlayContext,
      { value: overlay },
      positionedProps.children
    ),
  }

  return {
    overlay,
    anchor: anchor == null ? null : cloneElement(anchor, anchorProps),
    positioned: { props: positionedProps },
  }
}
