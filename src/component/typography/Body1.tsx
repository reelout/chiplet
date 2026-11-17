import clsx from 'clsx'
import { body1 } from './style/index.css'

export function Body1(props: React.ComponentProps<'div'>) {
  return <div {...props} className={clsx(body1, props.className)} />
}
