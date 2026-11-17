import type { ChangeCallback, FormContext } from '#hook'
import { useForm, useValue } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { renderHook } from '@testing-library/react'
import { act, Children, cloneElement, type PropsWithChildren } from 'react'
import { beforeEach, expect, test, vi, type Mock } from 'vitest'

let context: {
  name: string | undefined
  defaultValue: object | undefined
  value: object | undefined
  multiple: boolean | undefined
  disabled: boolean | undefined
  onChange: Mock
}

beforeEach(() => {
  context = {
    name: undefined,
    defaultValue: undefined,
    value: undefined,
    multiple: undefined,
    disabled: undefined,
    onChange: vi.fn(),
  }
})

function Wrapper(props: PropsWithChildren) {
  let { children } = useForm({ ...props, ...context })

  children = Children.map(children, (child) => {
    const node = child as React.ReactElement<
      React.ProviderProps<FormContext<object>>
    >

    return cloneElement(node, {
      value: {
        ...node.props.value,
        name: context.name,
        multiple: context.multiple,
        disabled: context.disabled,
      },
    })
  })

  return children
}

interface Props extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  name?: string | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, number> | undefined
}

test('useValue - name', async () => {
  {
    const { result } = renderHook(() => useValue({} as Props), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 1))

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useValue({ name: 'name' } as Props), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })
  }
})

test('useValue - disabled', async () => {
  {
    const { result } = renderHook(() => useValue({ disabled: undefined }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      disabled: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useValue({ disabled: false }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      disabled: false,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useValue({ disabled: true }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      disabled: true,
      onChange: expect.any(Function),
    })
  }
})

test('useValue - multiple', async () => {
  {
    const { result } = renderHook(() => useValue({ multiple: undefined }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      multiple: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useValue({ multiple: false }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useValue({ multiple: true }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      multiple: true,
      onChange: expect.any(Function),
    })
  }
})

test('useValue - defaultValue', async () => {
  const onChange = vi.fn()

  const { result } = renderHook(() => useValue({ defaultValue: 1, onChange }), {
    wrapper: undefined,
  })

  expect(result.current).toEqual({
    defaultValue: 1,
    onChange: expect.any(Function),
  })

  await act(() => result.current.onChange(createEvent({}), 2))

  expect(result.current).toEqual({
    defaultValue: 1,
    onChange: expect.any(Function),
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    2
  )
})

test('useValue - value', async () => {
  const onChange = vi.fn()
  const defaultValue = 0
  let value: number | undefined = undefined

  const { result, rerender } = renderHook(
    () => useValue({ defaultValue, value, onChange }),
    { wrapper: undefined }
  )

  expect(result.current).toEqual({
    defaultValue: 0,
    value: undefined,
    onChange: expect.any(Function),
  })

  value = 1
  rerender()

  expect(result.current).toEqual({
    value: 1,
    onChange: expect.any(Function),
  })

  await act(() => result.current.onChange(createEvent({}), 2))

  expect(result.current).toEqual({
    value: 1,
    onChange: expect.any(Function),
  })

  value = 3
  rerender()

  expect(result.current).toEqual({
    value: 3,
    onChange: expect.any(Function),
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    2
  )
})

test('useValue - onChange', async () => {
  const onChange = vi.fn()

  {
    const { result } = renderHook(() => useValue({ onChange }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 1))

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useValue({ name: 'name', onChange }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(1, expect.any(Object), 1)
  expect(onChange).toHaveBeenNthCalledWith(2, expect.any(Object), 2)
})

test('useValue - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() => useValue({ defaultValue: 1, onChange }), {
    wrapper: undefined,
  })

  expect(result.current).toEqual({
    defaultValue: 1,
    onChange: expect.any(Function),
  })

  await act(() => result.current.onChange(createEvent({}), 2))

  expect(result.current).toEqual({
    defaultValue: 1,
    onChange: expect.any(Function),
  })

  await act(() => result.current.onChange(createEvent({}), 3))

  expect(result.current).toEqual({
    defaultValue: 1,
    onChange: expect.any(Function),
  })

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    2
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    3
  )
})

test('useValue - context - name', async () => {
  {
    context.name = undefined
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useValue({} as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.name = 'name'
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useValue({} as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      onChange: expect.any(Function),
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 1 }
    const name = 'name'

    const { result } = renderHook(() => useValue({ name } as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      value: 3,
      onChange: expect.any(Function),
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 1 }
    let name: string | undefined = 'name'

    const { result, rerender } = renderHook(() => useValue({ name }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    name = 'name2'
    expect(() => rerender()).toThrow('Default value is required for "name2".')

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    name = 'name'
    rerender()

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    name = undefined
    expect(() => rerender()).toThrow('The "name" property is required.')

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })
  }

  expect(context.onChange).toHaveBeenCalledTimes(2)
  expect(context.onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    { name: 2 },
    'name'
  )
  expect(context.onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    { name: 3 },
    'name'
  )
})

test('useValue - context - disabled', async () => {
  {
    context.disabled = false

    const { result } = renderHook(() => useValue({ disabled: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      disabled: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(() => useValue({ disabled: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      disabled: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(() => useValue({ disabled: false }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      disabled: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = false

    const { result } = renderHook(() => useValue({ disabled: true }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      disabled: true,
      onChange: expect.any(Function),
    })
  }
})

test('useValue - context - multiple', async () => {
  {
    context.multiple = false

    const { result } = renderHook(() => useValue({ multiple: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(() => useValue({ multiple: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      multiple: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(() => useValue({ multiple: false }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = false

    const { result } = renderHook(() => useValue({ multiple: true }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      multiple: true,
      onChange: expect.any(Function),
    })
  }
})

test('useValue - context - defaultValue', async () => {
  let defaultValue: number | undefined = 1
  context.value = { name: undefined }

  const { result, rerender } = renderHook(
    () => useValue({ name: 'name', defaultValue }),
    { wrapper: Wrapper }
  )

  expect(result.current).toEqual({
    name: 'name',
    defaultValue: undefined,
    value: 1,
    onChange: expect.any(Function),
  })

  defaultValue = 2
  context.value = { name: undefined }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    defaultValue: undefined,
    value: 2,
    onChange: expect.any(Function),
  })

  defaultValue = 3
  context.value = { name: 4 }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    defaultValue: undefined,
    value: 4,
    onChange: expect.any(Function),
  })

  defaultValue = undefined
  context.value = { name: undefined }
  expect(() => rerender()).toThrow('Default value is required for "name".')

  expect(result.current).toEqual({
    name: 'name',
    defaultValue: undefined,
    value: 4,
    onChange: expect.any(Function),
  })
})

test('useValue - context - value', async () => {
  {
    let value: number | undefined = undefined

    const { result, rerender } = renderHook(
      () => useValue({ defaultValue: 1, value } as Props),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: undefined,
      defaultValue: 1,
      value: undefined,
      onChange: expect.any(Function),
    })

    value = 2
    rerender()

    expect(result.current).toEqual({
      name: undefined,
      defaultValue: undefined,
      value: 2,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: undefined,
      defaultValue: undefined,
      value: 2,
      onChange: expect.any(Function),
    })
  }

  {
    let value: number | undefined = undefined

    const { result, rerender } = renderHook(
      () => useValue({ name: 'name', defaultValue: 1, value } as Props),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: 'name',
      defaultValue: undefined,
      value: 1,
      onChange: expect.any(Function),
    })

    value = 2
    rerender()

    expect(result.current).toEqual({
      name: 'name',
      defaultValue: undefined,
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      defaultValue: undefined,
      value: 3,
      onChange: expect.any(Function),
    })
  }
})

test('useValue - context - onChange', async () => {
  const onChange = vi.fn()

  {
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useValue({ onChange }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useValue({ name: 'name', onChange }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      value: 3,
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(1, expect.any(Object), 2)
  expect(onChange).toHaveBeenNthCalledWith(2, expect.any(Object), 3)
  expect(context.onChange).toHaveBeenCalledTimes(1)
  expect(context.onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    { name: 3 },
    'name'
  )
})

test('useValue - context - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)
  context.onChange = vi.fn().mockImplementationOnce(preventDefault)

  {
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useValue({ name: 'name', onChange }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 4))

    expect(result.current).toEqual({
      name: 'name',
      value: 4,
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(3)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    2
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: true }),
    3
  )
  expect(onChange).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    4
  )
  expect(context.onChange).toHaveBeenCalledTimes(2)
  expect(context.onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    { name: 3 },
    'name'
  )
  expect(context.onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    { name: 4 },
    'name'
  )
})
