import clsx from 'clsx'
import { ButtonStyle } from './style/index.css'

export type ButtonColor =
  'default' | 'primary' | 'success' | 'warning' | 'danger'

// https://uxmovement.com/mobile/why-text-buttons-hurt-mobile-usability/
export type ButtonVariant = 'primary' | 'secondary' | 'tertiary'

export type ButtonSize = 'small' | 'medium' | 'large'

export type ButtonShape = 'rounded' | 'circular'

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    React.RefAttributes<HTMLButtonElement> {
  color?: ButtonColor | undefined
  variant?: ButtonVariant | undefined
  size?: ButtonSize | undefined
  shape?: ButtonShape | undefined
  block?: boolean | undefined
}

export function Button(props: ButtonProps) {
  const {
    color = 'default',
    variant = 'primary',
    size = 'medium',
    shape = 'rounded',
    block = false,
    disabled,
    onClick,
    onClickCapture,
    ...attrs
  } = props

  return (
    <button
      {...attrs}
      className={clsx(
        ButtonStyle({ color, variant, size, shape, block }),
        attrs.className
      )}
      type={attrs.type || 'button'}
      tabIndex={disabled ? -1 : attrs.tabIndex}
      onClick={disabled ? undefined : onClick}
      onClickCapture={disabled ? undefined : onClickCapture}
      aria-disabled={disabled}
    />
  )
}
