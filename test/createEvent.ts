/* istanbul ignore file */

export interface EventOptions extends EventInit {
  target?: Document | Element | null | undefined
  type?: string | undefined
  defaultPrevented?: boolean | undefined
}

export function createEvent<E extends Event>({
  Event,
  type,
  target,
  defaultPrevented,
  ...init
}: EventOptions & {
  Event: new (type: string, eventInitDict?: EventInit) => E
  type: string
}) {
  const ev = new Event(type, {
    bubbles: true,
    cancelable: true,
    ...init,
  })

  if (defaultPrevented) ev.preventDefault()

  target?.dispatchEvent(ev)

  if (target) {
    Object.defineProperty(ev, 'target', {
      configurable: true,
      get: () => target,
    })

    Object.defineProperty(ev, 'currentTarget', {
      configurable: true,
      get: () => target,
    })
  }

  return ev
}
