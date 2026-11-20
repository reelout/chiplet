import { usePromise } from '#hook/promise'
import { ErrorBoundary } from '#test'
import { renderHook } from '@testing-library/react'
import { act, createElement, createRef, type PropsWithChildren } from 'react'
import { expect, test, vi } from 'vitest'

test('usePromise - resolves with the promise result', async () => {
  const promise = Promise.resolve(1)

  const { result } = renderHook(() => usePromise(promise))

  expect(result.current).toBeUndefined()

  await act(async () => {})

  expect(result.current).toBe(1)
})

test('usePromise - returns the initial value until the promise resolves', async () => {
  const promise = Promise.resolve(1)

  const { result } = renderHook(() => usePromise(promise, 0))

  expect(result.current).toBe(0)

  await act(async () => {})

  expect(result.current).toBe(1)
})

test('usePromise - does not subscribe when the signal is already aborted', async () => {
  const promise = Promise.resolve(1)
  const signal = AbortSignal.abort()
  const spy1 = vi.spyOn(promise, 'then')
  const spy2 = vi.spyOn(signal, 'aborted', 'get')

  const { result } = renderHook(() => usePromise(promise, undefined, signal))

  expect(result.current).toBeUndefined()

  await act(async () => {})

  expect(result.current).toBeUndefined()
  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(1)
})

test('usePromise - ignores the resolved value after the signal aborts', async () => {
  const promise = Promise.resolve(1)
  const controller = new AbortController()
  const spy1 = vi.spyOn(promise, 'then')
  const spy2 = vi.spyOn(controller.signal, 'aborted', 'get')

  const { result } = renderHook(() =>
    usePromise(promise, undefined, controller.signal)
  )

  expect(result.current).toBeUndefined()

  controller.abort()

  await act(async () => {})

  expect(result.current).toBeUndefined()
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(2)
})

test('usePromise - rethrows a rejection through an effect', async () => {
  const promise = Promise.reject(new Error('Test error 0529'))
  const controller = new AbortController()
  const spy1 = vi.spyOn(promise, 'catch')
  const spy2 = vi.spyOn(controller.signal, 'aborted', 'get')
  const spy3 = vi.fn()

  const { result } = renderHook(
    () => usePromise(promise, undefined, controller.signal),
    { wrapper: ErrorBoundary, onCaughtError: spy3 }
  )

  expect(result.current).toBeUndefined()

  await act(async () => {})

  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(
    expect.objectContaining({ message: 'Test error 0529' }),
    expect.objectContaining({})
  )
})

test('usePromise - does not rethrow a rejection after the signal aborts', async () => {
  const promise = Promise.reject(new Error('Test error 0529'))
  vi.spyOn(promise, 'then').mockReturnValueOnce(promise)
  const controller = new AbortController()
  const spy1 = vi.spyOn(promise, 'catch')
  const spy2 = vi.spyOn(controller.signal, 'aborted', 'get')
  const spy3 = vi.fn()

  const { result } = renderHook(
    () => usePromise(promise, undefined, controller.signal),
    { wrapper: ErrorBoundary, onCaughtError: spy3 }
  )

  expect(result.current).toBeUndefined()

  controller.abort()

  await act(async () => {})

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy3).toHaveBeenCalledTimes(0)
})

test('usePromise - ignores the resolved value when the swapped signal is aborted', async () => {
  let resolvePromise: (value: number) => void = () => {}

  const promise = new Promise<number>((resolve) => {
    resolvePromise = resolve
  })

  const controller1 = new AbortController()
  const controller2 = new AbortController()

  const { result, rerender } = renderHook(
    ({ signal }) => usePromise(promise, 0, signal),
    { initialProps: { signal: controller1.signal } }
  )

  expect(result.current).toBe(0)

  rerender({ signal: controller2.signal })

  controller2.abort()

  await act(async () => {
    resolvePromise(1)
  })

  expect(result.current).toBe(0)
})

test('usePromise - resolves after the error boundary resets from a transient failure', async () => {
  const promise = Promise.resolve(1)
  const spy1 = vi.spyOn(promise, 'then').mockRejectedValueOnce('Transient')
  const spy2 = vi.fn()

  const ref = createRef<ErrorBoundary>()

  function Wrapper(props: PropsWithChildren) {
    return createElement(ErrorBoundary, { ref }, props.children)
  }

  const { result } = renderHook(() => usePromise(promise), {
    wrapper: Wrapper,
    onCaughtError: spy2,
  })

  await act(async () => {})

  expect(result.current).toBeUndefined()
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)

  await act(async () => ref.current?.resetError())

  expect(result.current).toBe(1)
  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith('Transient', expect.objectContaining({}))
})
