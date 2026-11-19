import clsx from 'clsx'
import { ButtonStyle, LinkButtonStyle } from './style/index.css'
import type {
  ButtonColor,
  ButtonShape,
  ButtonSize,
  ButtonVariant,
} from './Button'

export interface LinkButtonProps
  extends
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    React.RefAttributes<HTMLAnchorElement> {
  color?: ButtonColor | undefined
  variant?: ButtonVariant | undefined
  size?: ButtonSize | undefined
  shape?: ButtonShape | undefined
  block?: boolean | undefined
  disabled?: boolean | undefined
}

export function LinkButton(props: LinkButtonProps) {
  const {
    color = 'primary',
    variant = 'secondary',
    size = 'medium',
    shape = 'rounded',
    block = false,
    disabled,
    href,
    onClick,
    onClickCapture,
    ...attrs
  } = props

  return (
    <a
      {...attrs}
      // A disabled link must not navigate: 'aria-disabled' alone does not
      // prevent activation of an anchor with an 'href'.
      href={disabled ? undefined : href}
      className={clsx(
        ButtonStyle({ color, variant, size, shape, block }),
        LinkButtonStyle,
        attrs.className
      )}
      rel={attrs.rel || 'noopener noreferrer'}
      tabIndex={disabled ? -1 : attrs.tabIndex}
      onClick={disabled ? undefined : onClick}
      onClickCapture={disabled ? undefined : onClickCapture}
      aria-disabled={disabled}
    >
      {attrs.children}
    </a>
  )
}
