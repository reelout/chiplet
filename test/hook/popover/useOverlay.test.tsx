import { useOverlay } from '#hook'
import { createMouseEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { renderHook } from '@testing-library/react'
import { act, useRef } from 'react'
import { expect, test, vi } from 'vitest'

function toOverlay({
  anchor,
  positioned,
  open,
  onToggle,
}: {
  anchor: HTMLElement | null | undefined
  positioned: HTMLElement | null | undefined
  open: boolean | undefined
  onToggle: () => void
}) {
  return {
    anchorRef: { current: anchor },
    positionedRef: { current: positioned },
    open,
    onToggle,
  } as Parameters<typeof useOverlay>[0]
}

test('useOverlay - return value', () => {
  const spy = vi.fn()

  expect(
    renderHook(() =>
      useOverlay(
        toOverlay({
          anchor: null,
          positioned: null,
          open: undefined,
          onToggle: spy,
        })
      )
    ).result.current
  ).toEqual({
    anchor: null,
    positioned: null,
    open: false,
    toggle: expect.any(Function),
  })

  expect(
    renderHook(() =>
      useOverlay(
        toOverlay({
          anchor: null,
          positioned: null,
          open: false,
          onToggle: spy,
        })
      )
    ).result.current
  ).toEqual({
    anchor: null,
    positioned: null,
    open: false,
    toggle: expect.any(Function),
  })

  expect(
    renderHook(() =>
      useOverlay(
        toOverlay({
          anchor: null,
          positioned: null,
          open: true,
          onToggle: spy,
        })
      )
    ).result.current
  ).toEqual({
    anchor: null,
    positioned: null,
    open: true,
    toggle: expect.any(Function),
  })

  const positioned = document.createElement('div')

  expect(
    renderHook(() =>
      useOverlay(
        toOverlay({
          anchor: undefined,
          positioned,
          open: false,
          onToggle: spy,
        })
      )
    ).result.current
  ).toEqual({
    anchor: undefined,
    positioned,
    open: false,
    toggle: expect.any(Function),
  })

  const anchor = document.createElement('button')

  expect(
    renderHook(() =>
      useOverlay(
        toOverlay({
          anchor,
          positioned: undefined,
          open: true,
          onToggle: spy,
        })
      )
    ).result.current
  ).toEqual({
    anchor,
    positioned: undefined,
    open: true,
    toggle: expect.any(Function),
  })
})

test('useOverlay - open', () => {
  const spy = vi.fn()
  let defaultOpen = true
  let open = false as boolean | undefined

  const { result, rerender } = renderHook(() =>
    useOverlay({
      anchorRef: useRef(null),
      positionedRef: useRef(null),
      defaultOpen,
      open,
      onToggle: spy,
    })
  )

  expect(result.current.open).toBe(false)

  {
    defaultOpen = true
    open = undefined
    expect(() => rerender()).toThrow()
    expect(result.current.open).toBe(false)
  }

  {
    defaultOpen = false
    open = true
    rerender()
    expect(result.current.open).toBe(true)
  }

  {
    defaultOpen = false
    open = undefined
    expect(() => rerender()).toThrow()
    expect(result.current.open).toBe(true)
  }

  {
    defaultOpen = true
    open = false
    rerender()
    expect(result.current.open).toBe(false)
  }

  {
    defaultOpen = true
    open = undefined
    expect(() => rerender()).toThrow()
    expect(result.current.open).toBe(false)
  }
})

test('useOverlay - defaultOpen', () => {
  const spy = vi.fn()
  let defaultOpen = true
  let open = undefined as boolean | undefined

  const { result, rerender } = renderHook(() =>
    useOverlay({
      anchorRef: useRef(null),
      positionedRef: useRef(null),
      defaultOpen,
      open,
      onToggle: spy,
    })
  )

  expect(result.current.open).toBe(true)

  {
    defaultOpen = false
    open = undefined
    rerender()
    expect(result.current.open).toBe(true)
  }

  {
    defaultOpen = true
    open = false
    expect(() => rerender()).toThrow()
    expect(result.current.open).toBe(true)
  }

  {
    defaultOpen = true
    open = undefined
    rerender()
    expect(result.current.open).toBe(true)
  }

  {
    defaultOpen = false
    open = true
    expect(() => rerender()).toThrow()
    expect(result.current.open).toBe(true)
  }

  {
    defaultOpen = false
    open = undefined
    rerender()
    expect(result.current.open).toBe(false)
  }
})

test('useOverlay - toggle', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() =>
    useOverlay(
      toOverlay({
        anchor: null,
        positioned: null,
        open: undefined,
        onToggle: spy,
      })
    )
  )

  expect(result.current.open).toBe(false)

  await act(() => result.current.toggle(createEvent({ detail: 1 })))

  expect(result.current.open).toBe(false)

  await act(() => result.current.toggle(createEvent({ detail: 2 })))

  expect(result.current.open).toBe(true)

  await act(() => result.current.toggle(createEvent({ detail: 3 })))

  expect(result.current.open).toBe(false)

  await act(() => {
    result.current.toggle(createEvent({ detail: 41 }))
    result.current.toggle(createEvent({ detail: 42 }))
  })

  expect(result.current.open).toBe(false)

  await act(() => {
    result.current.toggle(createEvent({ detail: 51 }))
    result.current.toggle(createEvent({ detail: 52 }))
    result.current.toggle(createEvent({ detail: 53 }))
  })

  expect(result.current.open).toBe(true)

  await act(() => result.current.toggle(createEvent({ detail: 6 }), true))

  expect(result.current.open).toBe(true)

  await act(() => result.current.toggle(createEvent({ detail: 7 }), false))

  expect(result.current.open).toBe(false)

  await act(() => result.current.toggle(createEvent({ detail: 8 }), false))

  expect(result.current.open).toBe(false)

  await act(() => result.current.toggle(createEvent({ detail: 9 }), true))

  expect(result.current.open).toBe(true)

  expect(spy).toHaveBeenCalledTimes(10)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ detail: 1, defaultPrevented: true }),
    true
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ detail: 2, defaultPrevented: false }),
    true
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ detail: 3, defaultPrevented: false }),
    false
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ detail: 41, defaultPrevented: false }),
    true
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ detail: 42, defaultPrevented: false }),
    false
  )
  expect(spy).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({ detail: 51, defaultPrevented: false }),
    true
  )
  expect(spy).toHaveBeenNthCalledWith(
    7,
    expect.objectContaining({ detail: 52, defaultPrevented: false }),
    false
  )
  expect(spy).toHaveBeenNthCalledWith(
    8,
    expect.objectContaining({ detail: 53, defaultPrevented: false }),
    true
  )
  expect(spy).toHaveBeenNthCalledWith(
    9,
    expect.objectContaining({ detail: 7, defaultPrevented: false }),
    false
  )
  expect(spy).toHaveBeenNthCalledWith(
    10,
    expect.objectContaining({ detail: 9, defaultPrevented: false }),
    true
  )
})

test('useOverlay - toggle returns whether the change succeeded', async () => {
  const spy = vi.fn()

  const { result } = renderHook(() =>
    useOverlay(
      toOverlay({
        anchor: null,
        positioned: null,
        open: undefined,
        onToggle: spy,
      })
    )
  )

  let opened: boolean | undefined
  let noop: boolean | undefined
  let closed: boolean | undefined

  await act(() => {
    opened = result.current.toggle(createEvent({ detail: 1 }))
    noop = result.current.toggle(createEvent({ detail: 2 }), true)
  })

  expect(opened).toBe(true)
  expect(noop).toBe(false)
  expect(result.current.open).toBe(true)
  expect(spy).toHaveBeenCalledTimes(1)

  await act(() => {
    closed = result.current.toggle(createEvent({ detail: 3 }))
  })

  expect(closed).toBe(true)
  expect(result.current.open).toBe(false)
  expect(spy).toHaveBeenCalledTimes(2)
})

test('useOverlay - toggle reports a vetoed change', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() =>
    useOverlay(
      toOverlay({
        anchor: null,
        positioned: null,
        open: undefined,
        onToggle: spy,
      })
    )
  )

  let vetoed: boolean | undefined

  await act(() => {
    vetoed = result.current.toggle(createEvent({ detail: 1 }))
  })

  expect(vetoed).toBe(false)
  expect(result.current.open).toBe(false)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('useOverlay - toggle to the committed state is a no-op while idle or committed', async () => {
  const spy = vi.fn()

  const { result } = renderHook(() =>
    useOverlay(
      toOverlay({
        anchor: null,
        positioned: null,
        open: undefined,
        onToggle: spy,
      })
    )
  )

  let idle: boolean | undefined
  let committed: boolean | undefined

  await act(() => {
    idle = result.current.toggle(
      createEvent({ detail: 1 }),
      result.current.open,
      'escape'
    )
  })

  expect(idle).toBe(false)
  expect(result.current.open).toBe(false)
  expect(spy).toHaveBeenCalledTimes(0)

  await act(() => result.current.toggle(createEvent({ detail: 2 })))

  expect(result.current.open).toBe(true)

  await act(() => {
    committed = result.current.toggle(
      createEvent({ detail: 3 }),
      result.current.open,
      'escape'
    )
  })

  expect(committed).toBe(false)
  expect(result.current.open).toBe(true)
  expect(spy).toHaveBeenCalledTimes(1)
})

test('useOverlay - toggle reverts a pending open to the committed state', async () => {
  const spy = vi.fn()

  const { result } = renderHook(() =>
    useOverlay(
      toOverlay({
        anchor: null,
        positioned: null,
        open: undefined,
        onToggle: spy,
      })
    )
  )

  let reverted: boolean | undefined

  await act(() => {
    result.current.toggle(createEvent({ detail: 1 }))
    reverted = result.current.toggle(
      createEvent({ detail: 2 }),
      result.current.open,
      'escape'
    )
  })

  expect(reverted).toBe(true)
  expect(result.current.open).toBe(false)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ detail: 2, defaultPrevented: false }),
    false,
    'escape'
  )
})

test('useOverlay - toggle reverts a pending close to the committed state', async () => {
  const spy = vi.fn()

  const { result } = renderHook(() =>
    useOverlay(
      toOverlay({
        anchor: null,
        positioned: null,
        open: undefined,
        onToggle: spy,
      })
    )
  )

  await act(() => result.current.toggle(createEvent({ detail: 1 })))

  expect(result.current.open).toBe(true)

  let reverted: boolean | undefined

  await act(() => {
    result.current.toggle(createEvent({ detail: 2 }), false, 'delay')
    reverted = result.current.toggle(
      createEvent({ detail: 3 }),
      result.current.open,
      'test'
    )
  })

  expect(reverted).toBe(true)
  expect(result.current.open).toBe(true)
  expect(spy).toHaveBeenCalledTimes(3)
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ detail: 2, defaultPrevented: false }),
    false,
    'delay'
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ detail: 3, defaultPrevented: false }),
    true,
    'test'
  )
})

test('useOverlay - toggle reports a vetoed revert', async () => {
  const spy = vi
    .fn()
    .mockImplementationOnce(() => undefined)
    .mockImplementationOnce(preventDefault)

  const { result } = renderHook(() =>
    useOverlay(
      toOverlay({
        anchor: null,
        positioned: null,
        open: undefined,
        onToggle: spy,
      })
    )
  )

  let reverted: boolean | undefined

  await act(() => {
    result.current.toggle(createEvent({ detail: 1 }))
    reverted = result.current.toggle(
      createEvent({ detail: 2 }),
      result.current.open,
      'escape'
    )
  })

  expect(reverted).toBe(false)
  expect(result.current.open).toBe(true)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ detail: 2, defaultPrevented: true }),
    false,
    'escape'
  )
})
