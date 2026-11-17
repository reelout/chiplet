import { Button, type ButtonProps } from '../button'
import { ChevronDown24Regular } from '../icon'

export function MenuButton(props: ButtonProps) {
  return (
    <Button {...props}>
      {props.children}
      <ChevronDown24Regular />
    </Button>
  )
}
