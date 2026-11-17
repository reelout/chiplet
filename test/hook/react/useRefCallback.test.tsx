import { useRefCallback } from '#hook'
import { render } from '@testing-library/react'
import { createRef, useEffect } from 'react'
import { expect, test, vi } from 'vitest'

test('useRefCallback - null', () => {
  const result = createRef<ReturnType<typeof useRefCallback>>()

  function Page() {
    const value = useRefCallback(null)
    const saveRef = value[1]

    useEffect(() => {
      result.current = value
    })

    return <div ref={saveRef} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])

  rerender(<Page />)

  unmount()

  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])
})

test('useRefCallback - ref object', () => {
  const ref = createRef()
  const result = createRef<ReturnType<typeof useRefCallback>>()

  function Page() {
    const value = useRefCallback(ref)
    const saveRef = value[1]

    useEffect(() => {
      result.current = value
    })

    return <div ref={saveRef} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(ref.current).toBeInstanceOf(HTMLDivElement)
  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])

  rerender(<Page />)

  unmount()

  expect(ref.current).toBe(null)
  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])
})

test('useRefCallback - ref callback', () => {
  const spy = vi.fn()
  const result = createRef<ReturnType<typeof useRefCallback>>()

  function Page() {
    const value = useRefCallback(spy)
    const saveRef = value[1]

    useEffect(() => {
      result.current = value
    })

    return <div ref={saveRef} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(spy).toHaveBeenCalledTimes(1)
  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])

  rerender(<Page />)

  unmount()

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  expect(spy).toHaveBeenCalledWith(null)
  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])
})

test('useRefCallback - ref callback - cleanup', () => {
  const spy1 = vi.fn()
  const spy2 = vi.fn(() => spy1)
  const result = createRef<ReturnType<typeof useRefCallback>>()

  function Page() {
    const value = useRefCallback(spy2)
    const saveRef = value[1]

    useEffect(() => {
      result.current = value
    })

    return <div ref={saveRef} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])

  rerender(<Page />)

  unmount()

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  expect(result.current).toEqual([
    expect.any(HTMLDivElement),
    expect.any(Function),
  ])
})
