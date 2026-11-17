import { useClose, type Overlay } from '#hook'
import { OverlayContext } from '#hook/popover/context'
import { createMouseEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { renderHook } from '@testing-library/react'
import { act, createElement } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'

let overlay: Overlay

beforeEach(() => {
  overlay = { toggle: vi.fn() } as Partial<Overlay> as Overlay
})

function Wrapper(props: React.PropsWithChildren) {
  return createElement(OverlayContext, { value: overlay }, props.children)
}

test('useClose - disabled', async () => {
  let count = 0
  let multiple: boolean | undefined = undefined
  let disabled: boolean | undefined = undefined
  const onClick = vi.fn((ev: Partial<Event>) => {})

  const { result, rerender } = renderHook(
    () => useClose({ disabled, onClick }, multiple),
    { wrapper: Wrapper }
  )

  expect(result.current).toEqual({
    disabled: undefined,
    onClick: expect.any(Function),
  })

  await act(() => result.current.onClick(createEvent({ detail: ++count })))

  multiple = false
  disabled = undefined
  rerender()

  expect(result.current).toEqual({
    disabled: undefined,
    onClick: expect.any(Function),
  })

  await act(() => result.current.onClick(createEvent({ detail: ++count })))

  multiple = false
  disabled = false
  rerender()

  expect(result.current).toEqual({
    disabled: false,
    onClick: expect.any(Function),
  })

  await act(() => result.current.onClick(createEvent({ detail: ++count })))

  multiple = true
  disabled = false
  rerender()

  expect(result.current).toEqual({
    disabled: false,
    onClick: expect.any(Function),
  })

  await act(() => result.current.onClick(createEvent({ detail: ++count })))

  multiple = undefined
  disabled = true
  rerender()

  expect(result.current).toEqual({
    disabled: true,
    onClick: expect.any(Function),
  })

  await act(() => result.current.onClick(createEvent({ detail: ++count })))

  expect(onClick).toHaveBeenCalledTimes(5)
  expect(onClick).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false, detail: 1 })
  )
  expect(onClick).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false, detail: 2 })
  )
  expect(onClick).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false, detail: 3 })
  )
  expect(onClick).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false, detail: 4 })
  )
  expect(onClick).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ defaultPrevented: false, detail: 5 })
  )
  expect(overlay.toggle).toHaveBeenCalledTimes(3)
  expect(overlay.toggle).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ detail: 1 }),
    false,
    'close'
  )
  expect(overlay.toggle).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ detail: 2 }),
    false,
    'close'
  )
  expect(overlay.toggle).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ detail: 3 }),
    false,
    'close'
  )
})

test('useClose - preventDefault', async () => {
  const onClick = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(
    () => useClose({ disabled: undefined, onClick }),
    { wrapper: Wrapper }
  )

  await act(() => result.current.onClick(createEvent({ detail: 1 })))
  await act(() => result.current.onClick(createEvent({ detail: 2 })))

  expect(onClick).toHaveBeenCalledTimes(2)
  expect(onClick).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true, detail: 1 })
  )
  expect(onClick).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false, detail: 2 })
  )
  expect(overlay.toggle).toHaveBeenCalledTimes(1)
  expect(overlay.toggle).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ detail: 2 }),
    false,
    'close'
  )
})
