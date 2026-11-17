import clsx from 'clsx'
import { IconButtonStyle } from './style/index.css'
import { Button, type ButtonProps } from './Button'

export interface IconButtonProps extends Omit<ButtonProps, 'block'> {}

export function IconButton(props: IconButtonProps) {
  return (
    <Button
      {...props}
      className={clsx([IconButtonStyle, props.className])}
      color={props.color ?? 'default'}
      variant={props.variant ?? 'tertiary'}
      size={props.size ?? 'medium'}
      shape={props.shape ?? 'rounded'}
    />
  )
}
