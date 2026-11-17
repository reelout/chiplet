import clsx from 'clsx'
import { heading2 } from './style/index.css'

export function Heading2(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={clsx(heading2, props.className)}
      role='heading'
      aria-level={2}
    />
  )
}
