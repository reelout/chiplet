import { ThemeContext } from '#theme'
import { use } from 'react'
import { createPortal } from 'react-dom'

export interface PortalProps extends React.PropsWithChildren {
  container?: Element | DocumentFragment | null | undefined
}

export function Portal(props: PortalProps) {
  let { container } = props

  // Portaled content leaves the themed root, so re-establish the active
  // 'ThemeContext' scope around it here rather than in
  // 'usePopover'/'useTooltip'/'useDialog': those hooks only produce props
  // for the positioned element, and merging the scope classes onto that
  // element would compete with the overlay's own surface styles in the
  // cascade.
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
      <div
        className={scope.className}
        style={{ display: 'contents', ...scope.declarations }}
      >
        {props.children}
      </div>
    ),
    container
  )
}
