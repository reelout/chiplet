import {
  positionAxisMap,
  useTooltip,
  type Overlay,
  type TooltipOptions,
} from '#hook'
import clsx from 'clsx'
import { Portal } from './Portal'
import { TooltipArrowStyle, TooltipStyle } from './style/index.css'

export type TooltipContent =
  ((tooltip: Tooltip) => React.ReactNode) | string | React.ReactElement

export interface TooltipProps
  extends
    Omit<React.ComponentProps<'div'>, keyof TooltipOptions>,
    Omit<TooltipOptions, 'anchor' | 'ref'>,
    React.RefAttributes<Tooltip> {
  render?: TooltipContent | null | undefined
  children?: TooltipOptions['anchor'] | undefined
}

export interface Tooltip extends Overlay<HTMLDivElement> {}

export function Tooltip(props: TooltipProps) {
  const { render, children, ...attrs } = props
  const tooltip = useTooltip({ ...attrs, anchor: children })

  return (
    <>
      {tooltip.anchor}
      <Portal>
        <div
          {...tooltip.positioned.props}
          className={clsx(TooltipStyle, tooltip.positioned.props.className)}
        >
          {typeof render === 'function' ? render(tooltip.overlay) : render}
          <div
            {...tooltip.arrow.props}
            className={clsx(
              TooltipArrowStyle({ axis: positionAxisMap[tooltip.position] }),
              tooltip.arrow.props.className
            )}
          />
        </div>
      </Portal>
    </>
  )
}
