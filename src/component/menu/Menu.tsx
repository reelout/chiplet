import { useForm } from '#hook'
import clsx from 'clsx'
import { Popover, type PopoverProps } from '../popover/Popover'
import { ListStyle } from '../select/style/index.css'

export function Menu(props: PopoverProps<'ul'>) {
  return (
    <Popover
      {...useForm(props)}
      elementType='ul'
      className={clsx(ListStyle, props.className)}
      role='menu'
    />
  )
}
