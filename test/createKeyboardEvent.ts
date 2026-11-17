/* istanbul ignore file */
import { createEvent, type EventOptions } from './createEvent'

export function createKeyboardEvent(options: EventOptions & KeyboardEventInit) {
  if (options.key === 'Space') {
    options.key = ' '
  }

  const ev = createEvent({
    ...options,
    Event: KeyboardEvent,
    type: options.type ?? 'keydown',
  })

  return ev as KeyboardEvent & React.KeyboardEvent<never>
}
