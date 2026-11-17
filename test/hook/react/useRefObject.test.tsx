import { useRefObject } from '#hook'
import { render } from '@testing-library/react'
import { createRef, type RefObject } from 'react'
import { expect, test, vi } from 'vitest'

test('useRefObject - null', () => {
  let result: RefObject<HTMLDivElement | null> = createRef()

  function Page() {
    return <div ref={(result = useRefObject(null))} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(result.current).toBeInstanceOf(HTMLDivElement)

  rerender(<Page />)

  unmount()

  expect(result.current).toBe(null)
})

test('useRefObject - ref object', () => {
  const ref = createRef<HTMLDivElement>()
  let result: RefObject<HTMLDivElement | null> = createRef()

  function Page() {
    return <div ref={(result = useRefObject(ref))} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(ref.current).toBeInstanceOf(HTMLDivElement)
  expect(result.current).toBeInstanceOf(HTMLDivElement)

  rerender(<Page />)

  unmount()

  expect(ref.current).toBe(null)
  expect(result.current).toBe(null)
})

test('useRefObject - ref callback', () => {
  const spy = vi.fn()
  let result: RefObject<HTMLDivElement | null> = createRef()

  function Page() {
    return <div ref={(result = useRefObject(spy))} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(spy).toHaveBeenCalledTimes(1)
  expect(result.current).toBeInstanceOf(HTMLDivElement)

  rerender(<Page />)

  unmount()

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  expect(spy).toHaveBeenCalledWith(null)
  expect(result.current).toBe(null)
})

test('useRefObject - ref callback - cleanup', () => {
  const spy1 = vi.fn()
  const spy2 = vi.fn(() => spy1)
  let result: RefObject<HTMLDivElement | null> = createRef()

  function Page() {
    return <div ref={(result = useRefObject(spy2))} />
  }

  const { rerender, unmount } = render(<Page />)

  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(result.current).toBeInstanceOf(HTMLDivElement)

  rerender(<Page />)

  unmount()

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  expect(result.current).toBe(null)
})
