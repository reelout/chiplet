export function preventDefault(ev: Event | React.SyntheticEvent) {
  ev.preventDefault()
}

export function stopPropagation(ev: Event | React.SyntheticEvent) {
  ev.stopPropagation()
}

export function isEnterKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'Enter'
}

export function isEscapeKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'Escape'
}

export function isSpaceKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === ' '
}

export function isTabKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'Tab'
}

export function isArrowUpKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'ArrowUp'
}

export function isArrowDownKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'ArrowDown'
}

export function isArrowLeftKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'ArrowLeft'
}

export function isArrowRightKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'ArrowRight'
}

export function isHomeKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'Home'
}

export function isEndKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'End'
}

export function isPageUpKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'PageUp'
}

export function isPageDownKey(ev: KeyboardEvent | React.KeyboardEvent) {
  return ev.key === 'PageDown'
}
