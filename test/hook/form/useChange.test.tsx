import { useChange } from '#hook'
import { createMouseEvent } from '#test'
import { preventDefault } from '#util'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { expect, test, vi } from 'vitest'

test('useChange - disabled', async () => {
  const spy1 = vi.fn()
  const spy2 = vi.fn()

  const { result } = renderHook(() =>
    useChange(false, {
      disabled: true,
      onChange: spy2,
      onClick: spy1,
    })
  )

  expect(result.current).toEqual({
    disabled: true,
    onChange: expect.any(Function),
    onClick: undefined,
  })
})

test('useChange - onClick', async () => {
  let checked = false
  const spy1 = vi.fn()
  const spy2 = vi.fn().mockImplementation(() => (checked = !checked))

  const { result, rerender } = renderHook(() =>
    useChange(checked, { onChange: spy2, onClick: spy1 })
  )

  expect(result.current).toEqual({
    onChange: expect.any(Function),
    onClick: expect.any(Function),
  })

  await act(() => result.current.onClick?.(createMouseEvent({})))

  rerender()

  await act(() => result.current.onClick?.(createMouseEvent({})))

  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false })
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false })
  )
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    false
  )
})

test('useChange - preventDefault', async () => {
  let checked = false
  const spy1 = vi.fn().mockImplementationOnce(preventDefault)
  const spy2 = vi.fn().mockImplementation(() => (checked = !checked))

  const { result, rerender } = renderHook(() =>
    useChange(checked, { onChange: spy2, onClick: spy1 })
  )

  expect(result.current).toEqual({
    onChange: expect.any(Function),
    onClick: expect.any(Function),
  })

  await act(() => result.current.onClick?.(createMouseEvent({})))

  rerender()

  await act(() => result.current.onClick?.(createMouseEvent({})))

  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true })
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false })
  )
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
})
