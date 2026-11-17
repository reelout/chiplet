import clsx from 'clsx'
import { caption2 } from './style/index.css'

export function Caption2(props: React.ComponentProps<'div'>) {
  return <div {...props} className={clsx(caption2, props.className)} />
}
