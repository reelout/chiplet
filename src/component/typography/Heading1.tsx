import clsx from 'clsx'
import { heading1 } from './style/index.css'

export function Heading1(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={clsx(heading1, props.className)}
      role='heading'
      aria-level={1}
    />
  )
}
