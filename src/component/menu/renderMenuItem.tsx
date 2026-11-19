import clsx from 'clsx'
import type { JSX } from 'react'
import {
  ItemAfterStyle,
  ItemBeforeStyle,
  ItemContentStyle,
  ItemStyle,
} from '../select/style/index.css'

export interface MenuItemProps extends Omit<
  React.ComponentProps<'li'>,
  'slot'
> {
  danger?: boolean | undefined
  disabled?: boolean | undefined
  before?: JSX.Element | undefined
  after?: JSX.Element | undefined
  slot?: {
    root?: React.ComponentProps<'li'> | undefined
    before?: React.ComponentProps<'div'> | undefined
    content?: React.ComponentProps<'div'> | undefined
    after?: React.ComponentProps<'div'> | undefined
  }
}

export function renderMenuItem(props: MenuItemProps) {
  const { danger, disabled, before, after, slot, ...attrs } = props

  return (
    <li
      {...slot?.root}
      {...attrs}
      className={clsx(
        ItemStyle({ danger }),
        slot?.root?.className,
        attrs.className
      )}
    >
      <div
        {...slot?.before}
        className={clsx(ItemBeforeStyle, slot?.before?.className)}
      >
        {before}
      </div>
      <div
        {...slot?.content}
        className={clsx(ItemContentStyle, slot?.content?.className)}
      >
        {attrs.children}
      </div>
      <div
        {...slot?.after}
        className={clsx(ItemAfterStyle, slot?.after?.className)}
      >
        {after}
      </div>
    </li>
  )
}
