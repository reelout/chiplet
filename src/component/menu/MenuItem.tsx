import { useClose, useInteractive, useKeyboard } from '#hook'
import { renderMenuItem, type MenuItemProps } from './renderMenuItem'

export { type MenuItemProps }

export function MenuItem(props: MenuItemProps) {
  props = useClose(props)
  props = useKeyboard(props)
  props = useInteractive(props)

  return renderMenuItem({
    ...props,
    role: 'menuitem',
  })
}
