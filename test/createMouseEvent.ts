import { createEvent, type EventOptions } from './createEvent'

export function createMouseEvent(options: EventOptions & MouseEventInit) {
  const ev = createEvent({
    ...options,
    Event: MouseEvent,
    type: options.type ?? 'click',
  })

  return ev as MouseEvent & React.MouseEvent<never>
}
