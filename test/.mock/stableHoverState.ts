/* istanbul ignore file */
import { afterEach, beforeEach } from 'vitest'

const stopTrustedPointerEvent = (ev: Event) => {
  if (ev.isTrusted) {
    ev.stopImmediatePropagation()
  }
}

const trustedPointerEventTypes = [
  'pointerenter',
  'pointerleave',
  'pointerout',
  'pointerover',
]

// Real pointer input can reach the browser-runner frame while the machine is
// under load — in Chromium for Linux, focusing an element even fires a
// trusted pointerenter on it. React never listens for native pointerenter or
// pointerleave: it derives both from pointerover and pointerout (react-dom
// registers "onPointerEnter" and "onPointerLeave" against the
// ["pointerout", "pointerover"] direct-event types), so a stray trusted
// pointerover or pointerout flips the hovered state of a popover hook
// mid-test and flakes the suite under load. Stopping the trusted enter/leave
// family at document capture keeps it from React's root-container listeners
// and from any native listener alike; synthetic `fireEvent` events keep
// isTrusted === false and pass through untouched.

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
