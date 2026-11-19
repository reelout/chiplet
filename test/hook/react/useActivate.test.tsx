import { useActivate } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'

let buttonEl: HTMLDivElement
let svgEl: SVGSVGElement

beforeEach(() => {
  document.body.innerHTML = `
    <div role="button" tabIndex="0"></div>
    <svg tabIndex="0"><circle cx="12" cy="12" r="10" /></svg>
  `

  buttonEl = document.querySelector('[role="button"]') as HTMLDivElement
  svgEl = document.querySelector('svg') as SVGSVGElement

  buttonEl.focus()
})

test('useActivate - HTMLElement', async () => {
  {
    buttonEl.onclick = vi.fn()

    const { result } = renderHook(() => useActivate())

    expect(result.current).toEqual([
      false,
      expect.any(Function),
      expect.any(Function),
    ])

    await act(() =>
      result.current[1](
        createEvent({ target: buttonEl, key: 'Enter', detail: 1 })
      )
    )

    expect(buttonEl.onclick).toHaveBeenCalledTimes(1)
    expect(buttonEl.onclick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: buttonEl,
        isTrusted: false,
      })
    )
  }

  {
    buttonEl.onclick = vi.fn()
    const onActivate = vi.fn().mockImplementationOnce(preventDefault)

    const { result } = renderHook(() => useActivate(onActivate))

    expect(result.current).toEqual([
      false,
      expect.any(Function),
      expect.any(Function),
    ])

    await act(() =>
      result.current[1](
        createEvent({ target: buttonEl, key: 'Enter', detail: 2 })
      )
    )
    await act(() =>
      result.current[1](
        createEvent({ target: buttonEl, key: 'Enter', detail: 3 })
      )
    )

    expect(buttonEl.onclick).toHaveBeenCalledTimes(1)
    expect(buttonEl.onclick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: buttonEl,
        isTrusted: false,
      })
    )
    expect(onActivate).toHaveBeenCalledTimes(2)
    expect(onActivate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'keydown',
        target: buttonEl,
        key: 'Enter',
        detail: 2,
        defaultPrevented: true,
      }),
      buttonEl
    )
    expect(onActivate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'keydown',
        target: buttonEl,
        key: 'Enter',
        detail: 3,
        defaultPrevented: true,
      }),
      buttonEl
    )
  }
})

test('useActivate - invokes the latest onActivate callback after a rerender', async () => {
  buttonEl.onclick = vi.fn()

  const onActivate1 = vi.fn()
  const onActivate2 = vi.fn()
  let onActivate = onActivate1

  const { result, rerender } = renderHook(() => useActivate(onActivate))

  onActivate = onActivate2
  rerender()

  await act(() =>
    result.current[1](
      createEvent({ target: buttonEl, key: 'Enter', detail: 1 })
    )
  )

  expect(onActivate1).toHaveBeenCalledTimes(0)
  expect(onActivate2).toHaveBeenCalledTimes(1)
  expect(buttonEl.onclick).toHaveBeenCalledTimes(1)
})

test('useActivate - SVGElement', async () => {
  {
    svgEl.onclick = vi.fn()

    const { result } = renderHook(() => useActivate())

    expect(result.current).toEqual([
      false,
      expect.any(Function),
      expect.any(Function),
    ])

    await act(() =>
      result.current[1](createEvent({ target: svgEl, key: 'Enter', detail: 1 }))
    )

    expect(svgEl.onclick).toHaveBeenCalledTimes(1)
    expect(svgEl.onclick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: svgEl,
        isTrusted: false,
      })
    )
  }

  {
    svgEl.onclick = vi.fn()
    const onActivate = vi.fn().mockImplementationOnce(preventDefault)

    const { result } = renderHook(() => useActivate(onActivate))

    expect(result.current).toEqual([
      false,
      expect.any(Function),
      expect.any(Function),
    ])

    await act(() =>
      result.current[1](createEvent({ target: svgEl, key: 'Enter', detail: 2 }))
    )
    await act(() =>
      result.current[1](createEvent({ target: svgEl, key: 'Enter', detail: 3 }))
    )

    expect(svgEl.onclick).toHaveBeenCalledTimes(1)
    expect(svgEl.onclick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: svgEl,
        isTrusted: false,
      })
    )
    expect(onActivate).toHaveBeenCalledTimes(2)
    expect(onActivate).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'keydown',
        target: svgEl,
        key: 'Enter',
        detail: 2,
        defaultPrevented: true,
      }),
      svgEl
    )
    expect(onActivate).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'keydown',
        target: svgEl,
        key: 'Enter',
        detail: 3,
        defaultPrevented: true,
      }),
      svgEl
    )
  }
})

test('useActivate - press Enter key', async () => {
  const spy = vi.spyOn(buttonEl, 'click')

  const { result } = renderHook(() => useActivate())

  expect(result.current).toEqual([
    false,
    expect.any(Function),
    expect.any(Function),
  ])

  const ev1 = createEvent({ target: buttonEl, type: 'keydown', key: 'Enter' })
  const ev2 = createEvent({ target: buttonEl, type: 'keyup', key: 'Enter' })

  await act(() => result.current[1](ev1))

  expect(result.current[0]).toBe(false)

  await act(() => result.current[1](ev2))

  expect(result.current[0]).toBe(false)
  expect(ev1.defaultPrevented).toBe(true)
  expect(ev2.defaultPrevented).toBe(false)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('useActivate - press Space key', async () => {
  const spy = vi.spyOn(buttonEl, 'click')

  const { result } = renderHook(() => useActivate())

  expect(result.current).toEqual([
    false,
    expect.any(Function),
    expect.any(Function),
  ])

  const ev1 = createEvent({ target: buttonEl, type: 'keydown', key: ' ' })
  const ev2 = createEvent({ target: buttonEl, type: 'keyup', key: ' ' })

  await act(() => result.current[1](ev1))

  expect(result.current[0]).toBe(true)

  await act(() => result.current[1](ev2))

  expect(result.current[0]).toBe(false)
  expect(ev1.defaultPrevented).toBe(true)
  expect(ev2.defaultPrevented).toBe(true)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('useActivate - abort when losing focus', async () => {
  const spy = vi.spyOn(buttonEl, 'click')

  const { result } = renderHook(() => useActivate())

  expect(result.current).toEqual([
    false,
    expect.any(Function),
    expect.any(Function),
  ])

  const ev1 = createEvent({ target: buttonEl, type: 'keydown', key: ' ' })
  const ev2 = createEvent({ target: buttonEl, type: 'keyup', key: ' ' })

  await act(() => result.current[1](ev1))

  expect(result.current[0]).toBe(true)

  await act(() => buttonEl.blur())

  expect(result.current[0]).toBe(false)

  await act(() => result.current[1](ev2))

  expect(result.current[0]).toBe(false)
  expect(ev1.defaultPrevented).toBe(true)
  expect(ev2.defaultPrevented).toBe(false)
  expect(spy).toHaveBeenCalledTimes(0)
})

test('useActivate - abort when the event is not captured', async () => {
  const spy = vi.spyOn(buttonEl, 'click')

  const { result } = renderHook(() => useActivate())

  expect(result.current).toEqual([
    false,
    expect.any(Function),
    expect.any(Function),
  ])

  const ev1 = createEvent({ target: buttonEl, type: 'keydown', key: ' ' })
  const ev2 = createEvent({ target: undefined, type: 'keyup', key: ' ' })

  await act(() => result.current[1](ev1))

  expect(result.current[0]).toBe(true)

  await act(() => document.body.dispatchEvent(ev2))

  expect(result.current[0]).toBe(false)
  expect(ev1.defaultPrevented).toBe(true)
  expect(ev2.defaultPrevented).toBe(false)
  expect(spy).toHaveBeenCalledTimes(0)
})

test('useActivate - reset manually', async () => {
  const spy = vi.spyOn(buttonEl, 'click')

  const { result } = renderHook(() => useActivate())

  expect(result.current).toEqual([
    false,
    expect.any(Function),
    expect.any(Function),
  ])

  const ev1 = createEvent({ target: buttonEl, type: 'keydown', key: ' ' })
  const ev2 = createEvent({ target: buttonEl, type: 'keyup', key: ' ' })

  await act(() => result.current[1](ev1))

  expect(result.current[0]).toBe(true)

  await act(() => result.current[2]())

  expect(result.current[0]).toBe(false)

  await act(() => result.current[1](ev2))

  expect(result.current[0]).toBe(false)
  expect(ev1.defaultPrevented).toBe(true)
  expect(ev2.defaultPrevented).toBe(false)
  expect(spy).toHaveBeenCalledTimes(0)
})

test('useActivate - perform action on proxy element', async () => {
  const controller = document.createElement('div')
  const target = document.createElement('div')

  controller.onclick = vi.fn()
  target.onclick = vi.fn()

  const { result } = renderHook(() => useActivate())

  expect(result.current).toEqual([
    false,
    expect.any(Function),
    expect.any(Function),
  ])

  await act(() =>
    result.current[1](
      createEvent({ target: controller, type: 'keydown', key: 'Enter' }),
      target
    )
  )

  expect(controller.onclick).toHaveBeenCalledTimes(0)
  expect(target.onclick).toHaveBeenCalledTimes(1)
  expect(target.onclick).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'click',
      target,
      isTrusted: false,
    })
  )
})
