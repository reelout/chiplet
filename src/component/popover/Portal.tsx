import { createPortal } from 'react-dom'

export interface PortalProps extends React.PropsWithChildren {
  container?: Element | DocumentFragment | null | undefined
}

export function Portal(props: PortalProps) {
  let { container } = props

  if (!container && typeof document !== 'undefined') {
    container = document.body
  }

  if (!container) {
    return null
  }

  return createPortal(props.children, container)
}
