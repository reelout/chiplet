import { useClose } from '#hook'
import { IconButton, type IconButtonProps } from '../button'
import { Dismiss24Regular } from '../icon'

export function DismissButton(props: IconButtonProps) {
  return (
    <IconButton {...useClose(props)}>
      {props.children === undefined ? <Dismiss24Regular /> : props.children}
    </IconButton>
  )
}
