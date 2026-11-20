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
  // for the positioned element. Merging the scope classes onto that element
  // would cascade against the overlay's own surface styles, and merging
  // 'scope.style' would fight the positioning engine for the same inline
  // style attribute.
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
        style={{ ...scope.style, display: 'contents' }}
      >
        {props.children}
      </div>
    ),
    container
  )
}
