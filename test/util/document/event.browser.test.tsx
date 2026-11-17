import {
  isArrowDownKey,
  isArrowLeftKey,
  isArrowRightKey,
  isArrowUpKey,
  isEndKey,
  isEnterKey,
  isEscapeKey,
  isHomeKey,
  isPageDownKey,
  isPageUpKey,
  isSpaceKey,
  isTabKey,
  preventDefault,
  stopPropagation,
} from '#util'
import { expect, test, vi } from 'vitest'

test('prevent default behavior', () => {
  const ev = new MouseEvent('click')
  const spy1 = vi.spyOn(ev, 'preventDefault')
  const spy2 = vi.spyOn(ev, 'stopPropagation')
  const spy3 = vi.spyOn(ev, 'stopImmediatePropagation')

  expect(preventDefault(ev)).toBe(undefined)

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)
})

test('stop event propagation', () => {
  const ev = new MouseEvent('click')
  const spy1 = vi.spyOn(ev, 'preventDefault')
  const spy2 = vi.spyOn(ev, 'stopPropagation')
  const spy3 = vi.spyOn(ev, 'stopImmediatePropagation')

  expect(stopPropagation(ev)).toBe(undefined)

  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(0)
})

test('create new event based on another event', () => {
  const ev1 = new MouseEvent('click', { bubbles: true, cancelable: true })
  ev1.preventDefault()
  ev1.stopPropagation()

  expect({ ...ev1 }).toEqual({ isTrusted: false })
  expect(ev1.bubbles).toBe(true)
  expect(ev1.cancelable).toBe(true)
  expect(ev1.defaultPrevented).toBe(true)

  const ev2 = new MouseEvent(ev1.type, ev1)
  ev2.stopPropagation()

  expect({ ...ev2 }).toEqual({ isTrusted: false })
  expect(ev2.bubbles).toBe(true)
  expect(ev2.cancelable).toBe(true)
  expect(ev2.defaultPrevented).toBe(false)
})

test('detect specific keyboard event', () => {
  for (const [_key, isKey] of [
    ['ArrowDown', isArrowDownKey],
    ['ArrowLeft', isArrowLeftKey],
    ['ArrowRight', isArrowRightKey],
    ['ArrowUp', isArrowUpKey],
    ['End', isEndKey],
    ['Enter', isEnterKey],
    ['Escape', isEscapeKey],
    ['Home', isHomeKey],
    ['PageDown', isPageDownKey],
    ['PageUp', isPageUpKey],
    ['Space', isSpaceKey],
    ['Tab', isTabKey],
  ] as const) {
    const key = _key === 'Space' ? ' ' : _key
    const ev1 = new KeyboardEvent('keydown', { key })
    const ev2 = new KeyboardEvent('keyup', { key })

    expect(isKey(ev1)).toBe(true)
    expect(isKey(ev2)).toBe(true)
  }
})
