import type { ChangeCallback, FormContext } from '#hook'
import { useChecked, useForm } from '#hook'
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
  value: number
  defaultChecked?: boolean | undefined
  checked?: boolean | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, boolean> | undefined
}

test('useChecked - name', async () => {
  {
    const { result } = renderHook(() => useChecked({} as Props), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useChecked({ name: 'name' } as Props), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: 'name',
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      onChange: expect.any(Function),
    })
  }
})

test('useChecked - disabled', async () => {
  {
    const { result } = renderHook(
      () => useChecked({ value: 0, disabled: undefined }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      disabled: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(
      () => useChecked({ value: 0, disabled: false }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      disabled: false,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(
      () => useChecked({ value: 0, disabled: true }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      disabled: true,
      onChange: expect.any(Function),
    })
  }
})

test('useChecked - multiple', async () => {
  {
    const { result } = renderHook(
      () => useChecked({ value: 0, multiple: undefined }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      multiple: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(
      () => useChecked({ value: 0, multiple: false }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(
      () => useChecked({ value: 0, multiple: true }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      multiple: true,
      onChange: expect.any(Function),
    })
  }
})

test('useChecked - defaultChecked', async () => {
  {
    const multiple = false
    const onChange = vi.fn()

    const { result } = renderHook(
      () => useChecked({ value: 0, defaultChecked: false, multiple, onChange }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      defaultChecked: false,
      multiple: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange(createEvent({}), true))

    expect(result.current).toEqual({
      value: 0,
      defaultChecked: false,
      multiple: false,
      onChange: expect.any(Function),
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ defaultPrevented: false }),
      true
    )
  }

  {
    const multiple = true
    const onChange = vi.fn()

    const { result } = renderHook(
      () => useChecked({ value: 0, defaultChecked: false, multiple, onChange }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      defaultChecked: false,
      multiple: true,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange(createEvent({}), true))

    expect(result.current).toEqual({
      value: 0,
      defaultChecked: false,
      multiple: true,
      onChange: expect.any(Function),
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ defaultPrevented: false }),
      true
    )
  }
})

test('useChecked - checked', async () => {
  {
    const value = 0
    const defaultChecked = false
    let checked = true
    const multiple = false
    const onChange = vi.fn()

    const { result, rerender } = renderHook(
      () => useChecked({ value, defaultChecked, checked, multiple, onChange }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      checked: true,
      multiple: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange(createEvent({}), false))

    expect(result.current).toEqual({
      value: 0,
      checked: true,
      multiple: false,
      onChange: expect.any(Function),
    })

    checked = false
    rerender()

    expect(result.current).toEqual({
      value: 0,
      checked: false,
      multiple: false,
      onChange: expect.any(Function),
    })

    expect(onChange).toHaveBeenCalledTimes(0)
  }

  {
    const value = 0
    const defaultChecked = false
    let checked = true
    const multiple = true
    const onChange = vi.fn()

    const { result, rerender } = renderHook(
      () => useChecked({ value, defaultChecked, checked, multiple, onChange }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      value: 0,
      checked: true,
      multiple: true,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange(createEvent({}), false))

    expect(result.current).toEqual({
      value: 0,
      checked: true,
      multiple: true,
      onChange: expect.any(Function),
    })

    checked = false
    rerender()

    expect(result.current).toEqual({
      value: 0,
      checked: false,
      multiple: true,
      onChange: expect.any(Function),
    })

    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({ defaultPrevented: false }),
      false
    )
  }
})

test('useChecked - onChange', async () => {
  const value = 0
  const defaultChecked = false
  const onChange = vi.fn()

  {
    const { result } = renderHook(
      () => useChecked({ value, defaultChecked, onChange }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      name: undefined,
      value: 0,
      defaultChecked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: undefined,
      value: 0,
      defaultChecked: false,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(
      () => useChecked({ name: 'name', value, defaultChecked, onChange }),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: 0,
      defaultChecked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 0,
      defaultChecked: false,
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(1, expect.any(Object), true)
  expect(onChange).toHaveBeenNthCalledWith(2, expect.any(Object), true)
})

test('useChecked - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)
  const value = 0
  const defaultChecked = false

  const { result } = renderHook(
    () => useChecked({ value, defaultChecked, onChange }),
    { wrapper: undefined }
  )

  expect(result.current).toEqual({
    value: 0,
    defaultChecked: false,
    onChange: expect.any(Function),
  })

  await act(() => result.current.onChange(createEvent({}), true))

  expect(result.current).toEqual({
    value: 0,
    defaultChecked: false,
    onChange: expect.any(Function),
  })

  await act(() => result.current.onChange(createEvent({}), true))

  expect(result.current).toEqual({
    value: 0,
    defaultChecked: false,
    onChange: expect.any(Function),
  })

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    true
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
})

test('useChecked - context - name', async () => {
  {
    context.name = undefined
    context.defaultValue = { name: 0 }

    const { result } = renderHook(() => useChecked({ value: 1 } as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: undefined,
      value: 1,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: undefined,
      value: 1,
      onChange: expect.any(Function),
    })
  }

  {
    context.name = 'name'
    context.defaultValue = { name: 0 }

    const { result } = renderHook(() => useChecked({ value: 2 } as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      checked: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 0 }
    const name = 'name'

    const { result } = renderHook(
      () => useChecked({ name, value: 3 } as Props),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: 3,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 3,
      checked: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 0 }
    let name: string | undefined = 'name'

    const { result, rerender } = renderHook(
      () => useChecked({ name, value: 0 }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: 0,
      checked: true,
      onChange: expect.any(Function),
    })

    name = 'name2'
    rerender()

    expect(result.current).toEqual({
      name: 'name2',
      value: 0,
      checked: false,
      onChange: expect.any(Function),
    })

    name = 'name'
    rerender()

    expect(result.current).toEqual({
      name: 'name',
      value: 0,
      checked: true,
      onChange: expect.any(Function),
    })

    name = undefined
    expect(() => rerender()).toThrow('The "name" property is required.')

    expect(result.current).toEqual({
      name: 'name',
      value: 0,
      checked: true,
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

test('useChecked - context - disabled', async () => {
  {
    context.disabled = false

    const { result } = renderHook(
      () => useChecked({ value: 1, disabled: undefined }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      disabled: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(
      () => useChecked({ value: 1, disabled: undefined }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      disabled: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(
      () => useChecked({ value: 1, disabled: false }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      disabled: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = false

    const { result } = renderHook(
      () => useChecked({ value: 1, disabled: true }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      disabled: true,
      onChange: expect.any(Function),
    })
  }
})

test('useChecked - context - multiple', async () => {
  {
    context.multiple = false

    const { result } = renderHook(
      () => useChecked({ value: 1, multiple: undefined }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(
      () => useChecked({ value: 1, multiple: undefined }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      multiple: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(
      () => useChecked({ value: 1, multiple: false }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = false

    const { result } = renderHook(
      () => useChecked({ value: 1, multiple: true }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      value: 1,
      multiple: true,
      onChange: expect.any(Function),
    })
  }
})

test('useChecked - context - defaultChecked', async () => {
  let defaultChecked: boolean | undefined = undefined
  context.value = { name: undefined }

  const { result, rerender } = renderHook(
    () => useChecked({ name: 'name', value: 1, defaultChecked }),
    { wrapper: Wrapper }
  )

  expect(result.current).toEqual({
    name: 'name',
    value: 1,
    checked: false,
    onChange: expect.any(Function),
  })

  defaultChecked = true
  context.value = { name: undefined }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    value: 1,
    checked: true,
    onChange: expect.any(Function),
  })

  defaultChecked = false
  context.value = { name: undefined }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    value: 1,
    checked: false,
    onChange: expect.any(Function),
  })

  defaultChecked = false
  context.value = { name: 1 }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    value: 1,
    checked: true,
    onChange: expect.any(Function),
  })

  defaultChecked = undefined
  context.value = { name: undefined }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    value: 1,
    checked: false,
    onChange: expect.any(Function),
  })
})

test('useChecked - context - checked', async () => {
  {
    const name = undefined
    const value = 1
    let checked: boolean | undefined = undefined

    const { result, rerender } = renderHook(
      () => useChecked({ name, value, checked } as Props),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: undefined,
      value: 1,
      checked: undefined,
      onChange: expect.any(Function),
    })

    checked = false
    rerender()

    expect(result.current).toEqual({
      name: undefined,
      value: 1,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: undefined,
      value: 1,
      checked: false,
      onChange: expect.any(Function),
    })
  }

  {
    const name = 'name'
    const value = 1
    let checked: boolean | undefined = undefined

    const { result, rerender } = renderHook(
      () => useChecked({ name, value, checked } as Props),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      checked: false,
      onChange: expect.any(Function),
    })

    checked = true
    rerender()

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      checked: true,
      onChange: expect.any(Function),
    })
  }
})

test('useChecked - context - onChange', async () => {
  const onChange = vi.fn()

  {
    context.defaultValue = { name: 0 }

    const { result } = renderHook(
      () => useChecked({ name: undefined, value: 1, onChange }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: undefined,
      value: 1,
      checked: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: undefined,
      value: 1,
      checked: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.defaultValue = { name: 0 }

    const { result } = renderHook(
      () => useChecked({ name: 'name', value: 2, onChange }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      checked: true,
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
  expect(context.onChange).toHaveBeenCalledTimes(1)
  expect(context.onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    { name: 2 },
    'name'
  )
})

test('useChecked - context - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)
  context.onChange = vi.fn().mockImplementationOnce(preventDefault)

  {
    context.defaultValue = { name: 0 }

    const { result } = renderHook(
      () => useChecked({ name: 'name', value: 1, onChange }),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      checked: false,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), true))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      checked: true,
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(3)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    true
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: true }),
    true
  )
  expect(onChange).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
  expect(context.onChange).toHaveBeenCalledTimes(2)
  expect(context.onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    { name: 1 },
    'name'
  )
  expect(context.onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    { name: 1 },
    'name'
  )
})
