import type { OverlayAnchorProps } from '#hook'
import { isValidElement } from 'react'
import { Tooltip, type TooltipContent, type TooltipProps } from './Tooltip'

export function renderTooltip(
  anchor: React.ReactElement<OverlayAnchorProps> | null | undefined,
  tooltip: TooltipContent | TooltipProps | null | undefined
) {
  if (anchor == null || tooltip == null) {
    return anchor
  }

  if (
    typeof tooltip === 'string' ||
    typeof tooltip === 'function' ||
    isValidElement(tooltip)
  ) {
    return <Tooltip render={tooltip}>{anchor}</Tooltip>
  }

  return <Tooltip {...tooltip}>{anchor}</Tooltip>
}
