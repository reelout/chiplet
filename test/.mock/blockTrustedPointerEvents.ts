/* istanbul ignore file */
import { afterEach, beforeEach } from 'vitest'

const stopTrustedPointerEvent = (ev: Event) => {
  if (ev.isTrusted) {
    ev.stopPropagation()
    ev.stopImmediatePropagation()
  }
}

const trustedPointerEventTypes = [
  'pointerenter',
  'pointerleave',
  'pointerout',
  'pointerover',
]

// The browser-runner frame can receive real pointer input while the machine
// is under load, and in Chromium for Linux focusing an element also fires a
// trusted pointerenter on it. React never listens for native pointerenter or
// pointerleave: it derives both from trusted pointerover and pointerout
// (react-dom registers "onPointerEnter" and "onPointerLeave" with the
// ["pointerout", "pointerover"] direct-event types). Any of these four
// trusted events can therefore flip the hovered state of a popover hook
// mid-test and make the test flake under load. Capture-phase listeners on
// `document` run before React's root-container listeners, and
// `stopImmediatePropagation` keeps the trusted events away from React
// entirely. Synthetic `fireEvent` events have isTrusted=false and pass
// through untouched.
beforeEach(() => {
  for (const type of trustedPointerEventTypes) {
    document.addEventListener(type, stopTrustedPointerEvent, true)
  }
})

afterEach(() => {
  for (const type of trustedPointerEventTypes) {
    document.removeEventListener(type, stopTrustedPointerEvent, true)
  }
})
