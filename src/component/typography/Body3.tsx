import clsx from 'clsx'
import { body3 } from './style/index.css'

export function Body3(props: React.ComponentProps<'div'>) {
  return <div {...props} className={clsx(body3, props.className)} />
}
