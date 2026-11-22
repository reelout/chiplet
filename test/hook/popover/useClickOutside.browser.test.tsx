import '#.mock/stableHoverState'
import { useClickOutside } from '#hook'
import { renderHook } from '@testing-library/react'
import { beforeEach, expect, test, vi } from 'vitest'

beforeEach(() => {
  vi.restoreAllMocks()
})

test('useClickOutside - #1', () => {
  const el = document.createElement('button')
  const spy1 = vi.fn()
  const spy2 = vi.spyOn(el, 'addEventListener')
  const spy3 = vi.spyOn(el, 'removeEventListener')
  const spy4 = vi
    .spyOn(document, 'addEventListener')
    .mockImplementation((type, listener) => {
      if (type === 'click') {
        document.onclick = vi.fn(listener as EventListener)
      }
    })
  const spy5 = vi.spyOn(document, 'removeEventListener')

  document.body.appendChild(el)

  const { result } = renderHook(() => useClickOutside(el, spy1))

  el.click()
  document.body.click()

  expect(result.current).toBeUndefined()

  expect(document.onclick).toHaveBeenCalledTimes(2)
  expect(document.onclick).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: el })
  )
  expect(document.onclick).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: document.body })
  )

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: document.body }),
    el
  )

  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)
  expect(spy4).toHaveBeenCalledWith('click', expect.any(Function))
  expect(spy5).toHaveBeenCalledTimes(0)

  document.body.removeChild(el)
})

test('useClickOutside - #2', () => {
  const el = document.createElement('button')
  const ref = { current: null as HTMLElement | null }
  let spy1 = vi.fn()
  const spy2 = vi
    .spyOn(document, 'addEventListener')
    .mockImplementation((type, listener) => {
      if (type === 'selectionchange') {
        spy2.mockClear()
      } else if (type === 'click') {
        document.onclick = vi.fn(listener as EventListener)
      }
    })
  const spy3 = vi
    .spyOn(document, 'removeEventListener')
    .mockImplementation((type, listener) => {
      if (type === 'click') {
        document.onclick = null
      }
    })

  const { rerender } = renderHook(() => useClickOutside(ref.current, spy1))

  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)

  {
    ref.current = el
    spy1 = vi.fn()

    rerender()

    document.body.click()

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'click', target: document.body }),
      el
    )
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith('click', expect.any(Function))
  }

  {
    ref.current = null
    spy1 = vi.fn()

    rerender()

    document.body.click()

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith('click', expect.any(Function))
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledWith('click', expect.any(Function))
  }
})
