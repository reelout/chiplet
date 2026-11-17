import clsx from 'clsx'
import { SeparatorStyle } from '../select/style/index.css'

export interface SeparatorProps extends React.ComponentProps<'li'> {}

export function Separator(props: SeparatorProps) {
  return (
    <li
      {...props}
      className={clsx(SeparatorStyle, props.className)}
      role='separator'
    />
  )
}
