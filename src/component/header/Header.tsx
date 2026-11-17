import clsx from 'clsx'
import type { JSX } from 'react'
import { HeaderStyle, NavStyle } from './style/index.css'

export interface HeaderProps extends Omit<
  React.ComponentProps<'header'>,
  'slot'
> {
  renderNav: () => JSX.Element | JSX.Element[] | null
  slot?: {
    root?: React.ComponentProps<'header'> | undefined
    nav?: React.ComponentProps<'nav'> | undefined
  }
}

export function Header(props: HeaderProps) {
  const { renderNav, slot, ...attrs } = props

  return (
    <header
      {...slot?.root}
      {...attrs}
      className={clsx(HeaderStyle, attrs.className)}
    >
      <nav {...slot?.nav} className={clsx(NavStyle, slot?.nav?.className)}>
        {props.renderNav()}
      </nav>
      {props.children}
    </header>
  )
}
