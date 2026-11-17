import clsx from 'clsx'
import { body2 } from './style/index.css'

export function Body2(props: React.ComponentProps<'div'>) {
  return <div {...props} className={clsx(body2, props.className)} />
}
