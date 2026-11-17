import clsx from 'clsx'
import { heading4 } from './style/index.css'

export function Heading4(props: React.ComponentProps<'div'>) {
  return (
    <div
      {...props}
      className={clsx(heading4, props.className)}
      role='heading'
      aria-level={4}
    />
  )
}
