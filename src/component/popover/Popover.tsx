import type { Overlay, PopoverOptions } from '#hook'
import { usePopover } from '#hook'
import type { HTMLElementRef } from '#hook/react/element.d'
import clsx from 'clsx'
import type { HTMLAttributes, JSX } from 'react'
import { Portal } from './Portal'
import type { TooltipContent, TooltipProps } from './Tooltip'
import { renderTooltip } from './renderTooltip'
import { PopoverStyle } from './style/index.css'

export interface PopoverProps<T extends React.HTMLElementType>
  extends
    Omit<HTMLAttributes<HTMLElementRef<T>>, keyof PopoverOptions<T>>,
    Omit<PopoverOptions<T>, 'ref'>,
    React.RefAttributes<Popover<T>> {
  elementType?: T
  tooltip?: TooltipContent | TooltipProps | null | undefined
}

export interface Popover<
  T extends React.HTMLElementType = 'div',
> extends Overlay<HTMLElementRef<T>> {}

export function Popover<T extends React.HTMLElementType = 'div'>(
  props: PopoverProps<T> & Omit<JSX.IntrinsicElements[T], keyof PopoverProps<T>>
) {
  const {
    elementType: Tag = 'div',
    tooltip,
    ...attrs
  } = props as PopoverProps<'div'>
  const popover = usePopover(attrs)

  return (
    <>
      {renderTooltip(popover.anchor, tooltip)}
      {popover.overlay.open && (
        <Portal>
          <Tag
            {...popover.positioned.props}
            className={clsx(
              PopoverStyle({ position: popover.position }),
              popover.positioned.props.className
            )}
          />
        </Portal>
      )}
    </>
  )
}
