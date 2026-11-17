import clsx from 'clsx'
import { heading3 } from './style/index.css'

export function Heading3(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={clsx(heading3, props.className)}
      role='heading'
      aria-level={3}
    />
  )
}
