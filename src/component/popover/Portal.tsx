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
  // 'usePopover'/'useTooltip'/'useDialog': those hooks only produce props for
  // the positioned element, and merging the scope onto that element would
  // fight both the overlay's own surface styles and the positioning engine's
  // inline styles.
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
      // A 'display: contents' wrapper paints nothing and never affects the
      // layout or positioning of its children, while theme variables and the
      // used color scheme still inherit through it.
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
