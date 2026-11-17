import type { ChangeCallback, FormContext } from '#hook'
import { useForm, useName } from '#hook'
import { createMouseEvent as createEvent } from '#test'
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
  onChange?: ChangeCallback<React.SyntheticEvent, string> | undefined
}

test('useName - name', async () => {
  {
    const { result } = renderHook(() => useName({} as Props), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value1'))

    expect(result.current).toEqual({
      context: null,
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useName({ name: 'name' } as Props), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value2'))

    expect(result.current).toEqual({
      context: null,
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })
  }
})

test('useName - disabled', async () => {
  {
    const { result } = renderHook(() => useName({ disabled: undefined }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      disabled: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useName({ disabled: false }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      disabled: false,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useName({ disabled: true }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      disabled: true,
      onChange: expect.any(Function),
    })
  }
})

test('useName - multiple', async () => {
  {
    const { result } = renderHook(() => useName({ multiple: undefined }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      multiple: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useName({ multiple: false }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useName({ multiple: true }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      multiple: true,
      onChange: expect.any(Function),
    })
  }
})

test('useName - value', async () => {
  const name = 'name'
  let value: string | undefined = undefined

  const { result, rerender } = renderHook(() => useName({ name, value }), {
    wrapper: undefined,
  })

  expect(result.current).toEqual({
    context: null,
    name: 'name',
    value: undefined,
    onChange: expect.any(Function),
  })

  value = 'value2'
  rerender()

  expect(result.current).toEqual({
    context: null,
    name: 'name',
    value: undefined,
    onChange: expect.any(Function),
  })
})

test('useName - onChange', async () => {
  const onChange = vi.fn()

  {
    const { result } = renderHook(() => useName({ onChange }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value1'))

    expect(result.current).toEqual({
      context: null,
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    const { result } = renderHook(() => useName({ name: 'name', onChange }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      context: null,
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value2'))

    expect(result.current).toEqual({
      context: null,
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(1, expect.any(Object), 'value1')
  expect(onChange).toHaveBeenNthCalledWith(2, expect.any(Object), 'value2')
})

test('useName - context - name', async () => {
  {
    context.name = undefined
    context.defaultValue = { name: 'value1' }

    const { result } = renderHook(() => useName({} as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value2'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.name = 'name'
    context.defaultValue = { name: 'value1' }

    const { result } = renderHook(() => useName({} as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name',
      value: 'value1',
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value2'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value2' } }),
      name: 'name',
      value: 'value2',
      onChange: expect.any(Function),
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 'value1' }
    const name = 'name'

    const { result } = renderHook(() => useName({ name } as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name',
      value: 'value1',
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value3'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value3' } }),
      name: 'name',
      value: 'value3',
      onChange: expect.any(Function),
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 'value1' }
    let name: string | undefined = 'name'

    const { result, rerender } = renderHook(() => useName({ name }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name',
      value: 'value1',
      onChange: expect.any(Function),
    })

    name = 'name2'
    rerender()

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name2',
      value: undefined,
      onChange: expect.any(Function),
    })

    name = 'name'
    rerender()

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name',
      value: 'value1',
      onChange: expect.any(Function),
    })

    name = undefined
    rerender()

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  expect(context.onChange).toHaveBeenCalledTimes(2)
  expect(context.onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click', defaultPrevented: false }),
    { name: 'value2' },
    'name'
  )
  expect(context.onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'click', defaultPrevented: false }),
    { name: 'value3' },
    'name'
  )
})

test('useName - context - disabled', async () => {
  {
    context.disabled = false

    const { result } = renderHook(() => useName({ disabled: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      disabled: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(() => useName({ disabled: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      disabled: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(() => useName({ disabled: false }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      disabled: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.disabled = false

    const { result } = renderHook(() => useName({ disabled: true }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      disabled: true,
      onChange: expect.any(Function),
    })
  }
})

test('useName - context - multiple', async () => {
  {
    context.multiple = false

    const { result } = renderHook(() => useName({ multiple: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(() => useName({ multiple: undefined }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      multiple: true,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(() => useName({ multiple: false }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      multiple: false,
      onChange: expect.any(Function),
    })
  }

  {
    context.multiple = false

    const { result } = renderHook(() => useName({ multiple: true }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: {} }),
      multiple: true,
      onChange: expect.any(Function),
    })
  }
})

test('useName - context - defaultValue', async () => {
  context.value = { name: undefined }

  const { result, rerender } = renderHook(() => useName({ name: 'name' }), {
    wrapper: Wrapper,
  })

  expect(result.current).toEqual({
    context: expect.objectContaining({ value: { name: undefined } }),
    name: 'name',
    value: undefined,
    onChange: expect.any(Function),
  })

  context.value = { name: 'value4' }
  rerender()

  expect(result.current).toEqual({
    context: expect.objectContaining({ value: { name: 'value4' } }),
    name: 'name',
    value: 'value4',
    onChange: expect.any(Function),
  })

  context.value = { name: undefined }
  rerender()

  expect(result.current).toEqual({
    context: expect.objectContaining({ value: { name: undefined } }),
    name: 'name',
    defaultValue: undefined,
    value: undefined,
    onChange: expect.any(Function),
  })
})

test('useName - context - value', async () => {
  {
    let value: string | undefined = undefined

    const { result, rerender } = renderHook(() => useName({ value } as Props), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: undefined } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    value = 'value2'
    rerender()

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: undefined } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value3'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: undefined } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    let value: string | undefined = undefined

    const { result, rerender } = renderHook(
      () => useName({ name: 'name', value } as Props),
      { wrapper: Wrapper }
    )

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: undefined } }),
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })

    value = 'value2'
    rerender()

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: undefined } }),
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value3'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value3' } }),
      name: 'name',
      value: 'value3',
      onChange: expect.any(Function),
    })
  }
})

test('useName - context - onChange', async () => {
  const onChange = vi.fn()

  {
    context.defaultValue = { name: 'value1' }

    const { result } = renderHook(() => useName({ onChange }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value2'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: undefined,
      value: undefined,
      onChange: expect.any(Function),
    })
  }

  {
    context.defaultValue = { name: 'value1' }

    const { result } = renderHook(() => useName({ name: 'name', onChange }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name',
      value: 'value1',
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value3'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value3' } }),
      name: 'name',
      value: 'value3',
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(1, expect.any(Object), 'value2')
  expect(onChange).toHaveBeenNthCalledWith(2, expect.any(Object), 'value3')
  expect(context.onChange).toHaveBeenCalledTimes(1)
  expect(context.onChange).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', defaultPrevented: false }),
    { name: 'value3' },
    'name'
  )
})

test('useName - context - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)

  {
    context.defaultValue = { name: 'value1' }

    const { result } = renderHook(() => useName({ name: 'name', onChange }), {
      wrapper: Wrapper,
    })

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name',
      value: 'value1',
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value2'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value1' } }),
      name: 'name',
      value: 'value1',
      onChange: expect.any(Function),
    })

    await act(() => result.current.onChange?.(createEvent({}), 'value3'))

    expect(result.current).toEqual({
      context: expect.objectContaining({ value: { name: 'value3' } }),
      name: 'name',
      value: 'value3',
      onChange: expect.any(Function),
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(1, expect.any(Object), 'value2')
  expect(onChange).toHaveBeenNthCalledWith(2, expect.any(Object), 'value3')
  expect(context.onChange).toHaveBeenCalledTimes(1)
  expect(context.onChange).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', defaultPrevented: false }),
    { name: 'value3' },
    'name'
  )
})
