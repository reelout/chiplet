import clsx from 'clsx'
import { caption1 } from './style/index.css'

export function Caption1(props: React.ComponentProps<'div'>) {
  return <div {...props} className={clsx(caption1, props.className)} />
}
