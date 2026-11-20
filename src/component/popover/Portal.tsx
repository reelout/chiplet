import { ThemeContext } from '#theme'
import { use } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps extends React.PropsWithChildren {
  container?: Element | DocumentFragment | null | undefined
}

export function Portal(props: PortalProps) {
  let { container } = props

  const scope = use(ThemeContext)

  if (!container && typeof document !== 'undefined') {
    container = document.body
  }

  if (!container) {
    return null
  }

  return createPortal(
    scope === null ? (
      props.children
    ) : (
      <div className={scope.className} style={scope.style}>
        {props.children}
      </div>
    ),
    container
  )
}
