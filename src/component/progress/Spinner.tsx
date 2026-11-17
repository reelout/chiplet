import clsx from 'clsx'
import { SpinnerStyle } from './style/index.css'

export type SpinnerSize = 'small' | 'medium' | 'large'

export interface SpinnerProps extends React.ComponentProps<'div'> {
  size?: SpinnerSize | undefined
}

export function Spinner(props: SpinnerProps) {
  const { size = 'medium', ...attrs } = props

  return (
    <div
      {...attrs}
      className={clsx(SpinnerStyle({ size }), attrs.className)}
      role={attrs.role || 'progressbar'}
    />
  )
}
