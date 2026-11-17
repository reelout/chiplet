import { useDefault } from '#hook'
import { createMouseEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { render, renderHook } from '@testing-library/react'
import { act, createRef, useLayoutEffect, type SyntheticEvent } from 'react'
import { assert, expect, test, vi } from 'vitest'

test('useDefault - controlled to uncontrolled', () => {
  const ref = { current: 1 as number | undefined }

  const { result, rerender } = renderHook(() =>
    useDefault({ value: ref.current, applyEvent: vi.fn() })
  )

  expect(result.current).toEqual([1, expect.any(Function)])

  ref.current = undefined

  expect(() => rerender()).toThrow(
    'A controlled component is being changed to an uncontrolled component.'
  )
})

test('useDefault - uncontrolled to controlled', () => {
  const ref = { current: undefined as number | undefined }

  const { result, rerender } = renderHook(() =>
    useDefault({ value: ref.current, applyEvent: vi.fn() })
  )

  expect(result.current).toEqual([undefined, expect.any(Function)])

  ref.current = 1

  expect(() => rerender()).toThrow(
    'An uncontrolled component is being changed to a controlled component.'
  )
})

test('useDefault - defaultValue', () => {
  let defaultValue: number | (() => number) | undefined = undefined

  const { result, rerender } = renderHook(() => useDefault({ defaultValue }))

  const onChange = result.current[1]

  expect(result.current).toEqual([undefined, onChange])

  {
    defaultValue = 1

    rerender()

    expect(result.current).toEqual([undefined, onChange])
  }

  {
    defaultValue = () => 2

    rerender()

    expect(result.current).toEqual([undefined, onChange])
  }
})

test('useDefault - defaultValue - function', () => {
  let defaultValue: number | (() => number) | undefined = () => 1

  const { result, rerender } = renderHook(() => useDefault({ defaultValue }))

  const onChange = result.current[1]

  expect(result.current).toEqual([1, onChange])

  {
    defaultValue = undefined

    rerender()

    expect(result.current).toEqual([1, onChange])
  }

  {
    defaultValue = 2

    rerender()

    expect(result.current).toEqual([1, onChange])
  }
})

test('useDefault - value', async () => {
  const spy = vi.fn()
  let value: number | (() => number) = () => 1

  const { result, rerender } = renderHook(() =>
    useDefault({ value, onChange: spy })
  )

  const onChange = result.current[1]

  expect(result.current).toEqual([value, onChange])
  assert(typeof result.current[0] === 'function')
  expect(result.current[0]()).toBe(1)

  {
    value = 2

    rerender()

    expect(result.current).toEqual([2, onChange])
  }

  {
    const spy2 = vi.fn(() => 4)

    await act(() => onChange(createEvent({}), spy2))

    expect(result.current).toEqual([2, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), 4)
    expect(spy2).toHaveBeenCalledWith(2)
  }
})

test('useDefault - onChange', async () => {
  let spy = vi.fn()

  const { result, rerender } = renderHook(() =>
    useDefault({ defaultValue: 1, onChange: spy })
  )

  const onChange = result.current[1]

  expect(result.current).toEqual([1, onChange])

  {
    await act(() => onChange(createEvent({}), 2, 'hint'))

    expect(result.current).toEqual([2, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), 2, 'hint')
  }

  {
    spy = vi.fn()

    rerender()

    const spy2 = vi.fn(() => 3)

    await act(() => onChange(createEvent({}), spy2))

    expect(result.current).toEqual([3, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), 3)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(2)
  }

  {
    expect(() => act(() => onChange(createEvent({}), undefined))).toThrow(
      'Warning: `applyEvent` is required when using `onChange(ev)` signature.'
    )

    expect(result.current).toEqual([3, onChange])
    expect(spy).not.toHaveBeenCalledWith(expect.any(MouseEvent), undefined)
  }

  {
    await act(() => onChange(createEvent({}), () => undefined, 'none'))

    expect(result.current).toEqual([undefined, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), undefined, 'none')
  }
})

test('useDefault - onChange (previous value) - defaultValue', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)
  const spy2 = vi.fn((prev) => prev + 1)

  const { result } = renderHook(() =>
    useDefault({ defaultValue: 1, onChange: spy })
  )

  const onChange = result.current[1]

  expect(result.current).toEqual([1, onChange])

  await act(() => {
    onChange(createEvent({}), spy2)
    onChange(createEvent({}), spy2)
    onChange(createEvent({}), spy2)
  })

  expect(result.current).toEqual([3, onChange])
  expect(spy).toHaveBeenCalledTimes(3)
  expect(spy).toHaveBeenNthCalledWith(1, expect.any(MouseEvent), 2)
  expect(spy).toHaveBeenNthCalledWith(2, expect.any(MouseEvent), 2)
  expect(spy).toHaveBeenNthCalledWith(3, expect.any(MouseEvent), 3)
  expect(spy2).toHaveBeenCalledTimes(3)
})

test('useDefault - onChange (previous value) - value', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)
  const spy2 = vi.fn((prev) => prev + 1)

  const { result } = renderHook(() => useDefault({ value: 1, onChange: spy }))

  const onChange = result.current[1]

  expect(result.current).toEqual([1, onChange])

  await act(() => {
    onChange(createEvent({}), spy2)
    onChange(createEvent({}), spy2)
    onChange(createEvent({}), spy2)
  })

  expect(result.current).toEqual([1, onChange])
  expect(spy).toHaveBeenCalledTimes(3)
  expect(spy).toHaveBeenNthCalledWith(1, expect.any(MouseEvent), 2)
  expect(spy).toHaveBeenNthCalledWith(2, expect.any(MouseEvent), 2)
  expect(spy).toHaveBeenNthCalledWith(3, expect.any(MouseEvent), 3)
  expect(spy2).toHaveBeenCalledTimes(3)
})

test('useDefault - applyEvent', async () => {
  let spy = vi.fn().mockReturnValue(2)

  const { result, rerender } = renderHook(() =>
    useDefault({ defaultValue: 1, applyEvent: spy })
  )

  const onChange = result.current[1]

  expect(result.current).toEqual([1, onChange])

  {
    await act(() => onChange(createEvent({})))

    expect(result.current).toEqual([2, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent))
  }

  {
    spy = vi.fn().mockReturnValue(3)

    rerender()
  }

  {
    await act(() => onChange(createEvent({})))

    expect(result.current).toEqual([3, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent))
  }
})

test('useDefault - preventDefault', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() =>
    useDefault({ defaultValue: 1, onChange: spy })
  )

  const onChange = result.current[1]

  expect(result.current).toEqual([1, onChange])

  {
    await act(() => onChange(createEvent({}), 2))

    expect(result.current).toEqual([1, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), 2)
  }

  {
    await act(() => onChange(createEvent({}), 3))

    expect(result.current).toEqual([3, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), 3)
  }
})

test('useDefault - preventDefault (not cancelable)', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() =>
    useDefault({ defaultValue: 1, onChange: spy })
  )

  const onChange = result.current[1]

  expect(result.current).toEqual([1, onChange])

  {
    await act(() => onChange(createEvent({ type: 'change' }), 2))

    expect(result.current).toEqual([2, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), 2)
  }

  {
    await act(() => onChange(createEvent({ type: 'change' }), 3))

    expect(result.current).toEqual([3, onChange])
    expect(spy).toHaveBeenCalledWith(expect.any(MouseEvent), 3)
  }
})

test('useDefault - unsafe', async () => {
  expect.assertions(11)

  const ref = createRef()
  const spy1 = vi.fn()
  const spy2 = vi.fn()

  function Parent() {
    const [value, onChange] = useDefault({ defaultValue: 0, onChange: spy2 })

    spy1.mockImplementation(onChange)

    return <Child value={value} onChange={spy1} />
  }

  function Child({
    value,
    onChange,
  }: {
    value: number
    onChange: (ev: SyntheticEvent, value: number) => void
  }) {
    useLayoutEffect(() => {
      ref.current = [value, onChange]

      if (value === 2) {
        expect(() => onChange(createEvent({}), value + 1)).toThrow(
          'Cannot call `onChange` within the `useLayoutEffect` hook of a child component, as the parent component has not been mounted yet.'
        )
      }
    })

    return <button onClick={(ev) => onChange(ev, value + 1)} />
  }

  const { getByRole } = render(<Parent />)
  expect(ref.current).toEqual([0, expect.any(Function)])

  await act(() => getByRole('button').click())
  expect(ref.current).toEqual([1, expect.any(Function)])

  await act(() => getByRole('button').click())
  expect(ref.current).toEqual([2, expect.any(Function)])

  expect(spy1).toHaveBeenCalledTimes(3)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    1
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'click' }),
    2
  )
  expect(spy1).toHaveBeenNthCalledWith(3, expect.any(MouseEvent), 3)
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    1
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'click' }),
    2
  )
})
