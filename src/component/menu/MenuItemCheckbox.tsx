import { useChange, useCheckbox, useInteractive, useKeyboard } from '#hook'
import { Checkmark24Regular } from '../icon'
import { ItemIconStyle } from '../select/style/index.css'
import { renderMenuItem, type MenuItemProps } from './renderMenuItem'

export interface MenuItemCheckboxProps extends Omit<MenuItemProps, 'onChange'> {
  name: string
  value: string
  defaultChecked?: boolean | undefined
  checked?: boolean | undefined
  disabled?: boolean | undefined
  onChange?:
    | ((ev: React.MouseEvent<HTMLDivElement>, checked: boolean) => void)
    | undefined
}

export function MenuItemCheckbox(props: MenuItemCheckboxProps) {
  props = useCheckbox(props)
  props = useChange(props.checked, props)
  props = useKeyboard(props)
  props = useInteractive(props)

  const {
    name,
    value,
    defaultChecked,
    checked,
    disabled,
    onChange,
    children,
    ...attrs
  } = props

  return renderMenuItem({
    ...attrs,
    role: 'menuitemcheckbox',
    'aria-checked': checked,
    before: <Checkmark24Regular className={ItemIconStyle} />,
    children,
  })
}
