import { useDialog, type DialogOptions, type Overlay } from '#hook'
import clsx from 'clsx'
import { Portal } from './Portal'
import type { TooltipContent, TooltipProps } from './Tooltip'
import { renderTooltip } from './renderTooltip'
import { DialogStyle } from './style/index.css'

export type DialogSize = 'auto' | 'small' | 'medium' | 'large' | 'stretch'

export interface DialogProps
  extends
    Omit<React.ComponentProps<'dialog'>, keyof DialogOptions>,
    Omit<DialogOptions, 'ref'>,
    React.RefAttributes<Dialog> {
  size?: DialogSize | undefined
  tooltip?: TooltipContent | TooltipProps | null | undefined
}

export interface Dialog extends Overlay<HTMLDialogElement> {}

export function Dialog(props: DialogProps) {
  const { size = 'auto', tooltip, ...attrs } = props
  const dialog = useDialog(attrs)

  return (
    <>
      {renderTooltip(dialog.anchor, tooltip)}
      {dialog.overlay.open && (
        <Portal>
          <dialog
            {...dialog.positioned.props}
            className={clsx(
              DialogStyle({ size }),
              dialog.positioned.props.className
            )}
          />
        </Portal>
      )}
    </>
  )
}
