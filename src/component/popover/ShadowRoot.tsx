import { useIsomorphicLayoutEffect, useRefObject } from '#hook'
import { useRef } from 'react'
import { type Root, createRoot } from 'react-dom/client'

export interface ShadowRootProps extends React.ComponentProps<'div'> {
  delegatesFocus?: boolean | undefined
}

export function ShadowRoot(props: ShadowRootProps) {
  const { children, delegatesFocus = false, ref, ...attrs } = props
  const hostRef = useRefObject<HTMLDivElement>(ref)
  const nestedRootRef = useRef<Root | null>(null)

  useIsomorphicLayoutEffect(() => {
    const host = hostRef.current

    /* istanbul ignore next */
    if (host === null) {
      return
    }

    const shadowRoot =
      host.shadowRoot ??
      host.attachShadow({
        mode: 'open',
        delegatesFocus,
      })
    const nestedRoot = nestedRootRef.current ?? createRoot(shadowRoot)

    nestedRootRef.current = nestedRoot

    return () => {
      nestedRoot.render(null)
    }
  }, [delegatesFocus, hostRef])

  useIsomorphicLayoutEffect(() => {
    nestedRootRef.current?.render(children)
  })

  return <div {...attrs} ref={hostRef} />
}
