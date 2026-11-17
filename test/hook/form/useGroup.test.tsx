import {
  FormContext,
  useChange,
  useCheckbox,
  useDefault,
  useForm,
  useGroup,
  type ChangeCallback,
} from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { render, renderHook } from '@testing-library/react'
import { act, Children, cloneElement, use, useState } from 'react'
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

interface Props<T>
  extends React.RefAttributes<HTMLDivElement>, React.PropsWithChildren {
  name?: string | undefined
  defaultValue?: T | undefined
  value?: T | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, T> | undefined
}

function Form(props: Props<Record<string, unknown>>) {
  return Children.map(useForm({ ...context, ...props }).children, (child) => {
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
}

function Group(props: Props<unknown>) {
  const { name, defaultValue, value, onChange, ...attrs } =
    useGroup(props).props

  return <div {...attrs} data-name={name} data-value={value} />
}

interface CheckboxProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  name?: string | undefined
  value: number
  defaultChecked?: boolean | undefined
  checked?: boolean | undefined
  disabled?: boolean | undefined
  onChange?:
    ChangeCallback<React.MouseEvent<HTMLDivElement>, boolean> | undefined
}

function Checkbox(props: CheckboxProps) {
  props = useCheckbox(props)

  {
    const [checked, onChange] = useDefault({
      defaultValue: props.defaultChecked ?? false,
      value: props.checked,
      onChange: props.onChange,
    })

    props = { ...props, checked, onChange }
  }

  const {
    name,
    value,
    defaultChecked: _defaultChecked,
    checked,
    disabled,
    onChange: _onChange,
    ...attrs
  } = useChange(props.checked, props)

  return (
    <div
      {...attrs}
      data-name={name}
      data-value={value}
      role='checkbox'
      tabIndex={0}
      aria-checked={checked}
      aria-disabled={disabled}
    />
  )
}

interface SliderProps extends React.ComponentProps<'div'> {
  name?: string | undefined
  defaultValue: number
}

function Slider(props: SliderProps) {
  const context = use<FormContext<Record<string, number>> | null>(FormContext)
  const name = props.name || context?.name
  const _value =
    !!context && name ? (context.value[name] ?? props.defaultValue) : undefined

  const [value, onChange] = useDefault({
    defaultValue: props.defaultValue,
    value: _value,
    onChange: (ev: React.SyntheticEvent, value: number) => {
      if (name) {
        context?.onChange(ev, { ...context.value, [name]: value }, name)
      }
    },
  })

  return (
    <div
      {...props}
      role='slider'
      tabIndex={0}
      data-name={name}
      aria-valuenow={value}
      onKeyDown={props.onKeyDown}
      onClick={(ev) => {
        props.onClick?.(ev)

        if (!ev.defaultPrevented) {
          onChange(ev, value + 1)
        }
      }}
    />
  )
}

test('useGroup - name', async () => {
  {
    const { result } = renderHook(
      () => useGroup({ name: undefined } as Props<number>),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 1))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(
      () => useGroup({ name: 'name' } as Props<number>),
      { wrapper: undefined }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: undefined }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 2,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 2 }),
        onChange: expect.any(Function),
      },
    })
  }
})

test('useGroup - disabled', async () => {
  {
    const { result } = renderHook(() => useGroup({ disabled: undefined }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        disabled: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: undefined,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useGroup({ disabled: false }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: false,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        disabled: false,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: false,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useGroup({ disabled: true }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: true,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        disabled: true,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useGroup - multiple', async () => {
  {
    const { result } = renderHook(() => useGroup({ multiple: undefined }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        multiple: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: undefined,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useGroup({ multiple: false }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: false,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        multiple: false,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: false,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useGroup({ multiple: true }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        multiple: true,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useGroup - defaultValue', async () => {
  const onChange = vi.fn()

  const { result } = renderHook(() => useGroup({ defaultValue: 1, onChange }), {
    wrapper: undefined,
  })

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.props.onChange(createEvent({}), 2))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 2,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 2,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    2
  )
})

test('useGroup - value', async () => {
  const onChange = vi.fn()
  const defaultValue = 0
  let value: number | undefined = undefined

  const { result, rerender } = renderHook(
    () => useGroup({ defaultValue, value, onChange }),
    { wrapper: undefined }
  )

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 0,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 0,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  value = 1
  expect(() => rerender()).toThrow(
    'An uncontrolled component is being changed to a controlled component.'
  )
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.props.onChange(createEvent({}), 2))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  value = 3
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 3,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 3,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    2
  )
})

test('useGroup - onChange', async () => {
  const onChange = vi.fn()

  {
    const { result } = renderHook(() => useGroup({ onChange }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 1))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useGroup({ name: 'name', onChange }), {
      wrapper: undefined,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: undefined }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 2,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 2 }),
        onChange: expect.any(Function),
      },
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(1, expect.any(Object), 1)
  expect(onChange).toHaveBeenNthCalledWith(2, expect.any(Object), 2)
})

test('useGroup - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() => useGroup({ defaultValue: 1, onChange }), {
    wrapper: undefined,
  })

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.props.onChange(createEvent({}), 2))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.props.onChange(createEvent({}), 3))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 3,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 3,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
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

test('useGroup - context - name', async () => {
  {
    context.name = undefined
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useGroup({} as Props<number>), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 2,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 2,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.name = 'name'
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useGroup({} as Props<number>), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 2,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 2,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 1 }
    const name = 'name'

    const { result } = renderHook(() => useGroup({ name } as Props<number>), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      value: 3,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 3,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 3 }),
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.name = undefined
    context.defaultValue = { name: 1 }
    let name: string | undefined = 'name'

    const { result, rerender } = renderHook(() => useGroup({ name }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    name = 'name2'
    rerender()

    expect(result.current).toEqual({
      name: 'name2',
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name2',
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name2',
        value: expect.objectContaining({ name: 1, name2: undefined }),
        onChange: expect.any(Function),
      },
    })

    name = 'name'
    rerender()

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    name = undefined
    expect(() => rerender()).toThrow('The "name" property is required.')
    rerender()

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  expect(context.onChange).toHaveBeenCalledTimes(1)
  expect(context.onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    { name: 3 },
    'name'
  )
})

test('useGroup - context - disabled', async () => {
  {
    context.disabled = false

    const { result } = renderHook(() => useGroup({ disabled: undefined }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        disabled: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: undefined,
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(() => useGroup({ disabled: undefined }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: true,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        disabled: true,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: true,
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.disabled = true

    const { result } = renderHook(() => useGroup({ disabled: false }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: true,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        disabled: true,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: true,
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.disabled = false

    const { result } = renderHook(() => useGroup({ disabled: true }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: true,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        disabled: true,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useGroup - context - multiple', async () => {
  {
    context.multiple = false

    const { result } = renderHook(() => useGroup({ multiple: undefined }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        multiple: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: undefined,
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(() => useGroup({ multiple: undefined }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        multiple: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: undefined,
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.multiple = true

    const { result } = renderHook(() => useGroup({ multiple: false }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: false,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        multiple: false,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: false,
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.multiple = false

    const { result } = renderHook(() => useGroup({ multiple: true }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        multiple: true,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useGroup - context - defaultValue', async () => {
  let defaultValue: number | undefined = 1
  context.value = { name: undefined }

  const { result, rerender } = renderHook(
    () => useGroup({ name: 'name', defaultValue }),
    { wrapper: Form }
  )

  expect(result.current).toEqual({
    name: 'name',
    value: 1,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: 'name',
      defaultValue: undefined,
      value: 1,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: 'name',
      value: expect.objectContaining({ name: 1 }),
      onChange: expect.any(Function),
    },
  })

  defaultValue = 2
  context.value = { name: undefined }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    value: 2,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: 'name',
      defaultValue: undefined,
      value: 2,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: 'name',
      value: expect.objectContaining({ name: 2 }),
      onChange: expect.any(Function),
    },
  })

  defaultValue = 3
  context.value = { name: 4 }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    value: 4,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: 'name',
      defaultValue: undefined,
      value: 4,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: 'name',
      value: expect.objectContaining({ name: 4 }),
      onChange: expect.any(Function),
    },
  })

  defaultValue = undefined
  context.value = { name: undefined }
  rerender()

  expect(result.current).toEqual({
    name: 'name',
    value: undefined,
    multiple: undefined,
    disabled: undefined,
    onChange: expect.any(Function),
    props: {
      name: 'name',
      defaultValue: undefined,
      value: undefined,
      onChange: expect.any(Function),
      children: expect.any(Object),
    },
    context: {
      name: 'name',
      value: expect.objectContaining({ name: undefined }),
      onChange: expect.any(Function),
    },
  })
})

test('useGroup - context - value', async () => {
  {
    let value: number | undefined = undefined

    const { result, rerender } = renderHook(
      () => useGroup({ defaultValue: 1, value } as Props<number>),
      { wrapper: Form }
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    value = 2
    expect(() => rerender()).toThrow(
      'An uncontrolled component is being changed to a controlled component.'
    )
    rerender()

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 2,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 2,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 2,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 2,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    let value: number | undefined = undefined

    const { result, rerender } = renderHook(
      () => useGroup({ name: 'name', defaultValue: 1, value } as Props<number>),
      { wrapper: Form }
    )

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    value = 2
    rerender()

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      value: 3,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 3,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 3 }),
        onChange: expect.any(Function),
      },
    })
  }
})

test('useGroup - context - onChange', async () => {
  const onChange = vi.fn()

  {
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useGroup({ onChange }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: undefined,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 2,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: 2,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useGroup({ name: 'name', onChange }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      value: 3,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 3,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 3 }),
        onChange: expect.any(Function),
      },
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

test('useGroup - context - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)
  context.onChange = vi.fn().mockImplementationOnce(preventDefault)

  {
    context.defaultValue = { name: 1 }

    const { result } = renderHook(() => useGroup({ name: 'name', onChange }), {
      wrapper: Form,
    })

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 3))

    expect(result.current).toEqual({
      name: 'name',
      value: 1,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 1,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 1 }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.props.onChange?.(createEvent({}), 4))

    expect(result.current).toEqual({
      name: 'name',
      value: 4,
      multiple: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      props: {
        name: 'name',
        value: 4,
        onChange: expect.any(Function),
        children: expect.any(Object),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 4 }),
        onChange: expect.any(Function),
      },
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

test('useGroup - control - name', async () => {
  const spy = vi.fn()

  const { getByTestId } = render(
    <>
      <Checkbox data-testid='item1' name={undefined} value={1} />
      <Checkbox data-testid='item2' name={'k2'} value={2} />
      <Group onChange={spy}>
        <Checkbox data-testid='item3' name={undefined} value={3} />
        <Checkbox data-testid='item4' name={'k4'} value={4} />
      </Group>
      <Group name={'k5'} onChange={spy}>
        <Checkbox data-testid='item5' name={undefined} value={5} />
        <Checkbox data-testid='item6' name={'k6'} value={6} />
      </Group>
      <Form onChange={spy}>
        <Checkbox data-testid='item7' name={undefined} value={7} />
        <Checkbox data-testid='item8' name={'k8'} value={8} />
        <Group onChange={spy}>
          <Checkbox data-testid='item9' name={undefined} value={9} />
          <Checkbox data-testid='item10' name={'k10'} value={10} />
        </Group>
        <Group name={'k11'} onChange={spy}>
          <Checkbox data-testid='item11' name={undefined} value={11} />
          <Checkbox data-testid='item12' name={'k12'} value={12} />
        </Group>
      </Form>
    </>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')
  const item3 = getByTestId('item3')
  const item4 = getByTestId('item4')
  const item5 = getByTestId('item5')
  const item6 = getByTestId('item6')
  const item7 = getByTestId('item7')
  const item8 = getByTestId('item8')
  const item9 = getByTestId('item9')
  const item10 = getByTestId('item10')
  const item11 = getByTestId('item11')
  const item12 = getByTestId('item12')

  {
    expect(item1).not.toHaveAttribute('data-name')
    expect(item2).toHaveAttribute('data-name', 'k2')
    expect(item3).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item4).toHaveAttribute('data-name', 'k4')
    expect(item5).toHaveAttribute('data-name', 'k5')
    expect(item6).toHaveAttribute('data-name', 'k6')
    expect(item7).not.toHaveAttribute('data-name')
    expect(item8).toHaveAttribute('data-name', 'k8')
    expect(item9).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item10).toHaveAttribute('data-name', 'k10')
    expect(item11).toHaveAttribute('data-name', 'k11')
    expect(item12).toHaveAttribute('data-name', 'k12')
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).toBeChecked()
    expect(item2).toBeChecked()
    expect(item3).toBeChecked()
    expect(item4).toBeChecked()
    expect(item5).toBeChecked()
    expect(item6).toBeChecked()
    expect(item7).toBeChecked()
    expect(item8).toBeChecked()
    expect(item9).toBeChecked()
    expect(item10).toBeChecked()
    expect(item11).toBeChecked()
    expect(item12).toBeChecked()
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).not.toBeChecked()
    expect(item2).not.toBeChecked()
    expect(item3).not.toBeChecked()
    expect(item4).not.toBeChecked()
    expect(item5).not.toBeChecked()
    expect(item6).not.toBeChecked()
    expect(item7).not.toBeChecked()
    expect(item8).not.toBeChecked()
    expect(item9).not.toBeChecked()
    expect(item10).not.toBeChecked()
    expect(item11).not.toBeChecked()
    expect(item12).not.toBeChecked()
  }

  expect(spy).toHaveBeenCalledTimes(16)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    [3]
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    [5]
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false }),
    [9]
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({ defaultPrevented: false }),
    [11]
  )
  expect(spy).toHaveBeenNthCalledWith(
    7,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [11] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    8,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [11], k12: [12] },
    'k12'
  )
  expect(spy).toHaveBeenNthCalledWith(
    9,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    10,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    11,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [10], k11: [11], k12: [12] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    12,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    13,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [12] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    14,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    15,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [], k12: [12] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    16,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [], k12: [] },
    'k12'
  )
})

test('useGroup - control - defaultValue - #1', async () => {
  const spy = vi.fn()

  const { getByTestId } = render(
    <>
      <Checkbox data-testid='item1' name={undefined} value={1} />
      <Checkbox data-testid='item2' name={'k2'} value={2} />
      <Group defaultValue={[3]} onChange={spy}>
        <Checkbox data-testid='item3' name={undefined} value={3} />
        <Checkbox data-testid='item4' name={'k4'} value={4} />
      </Group>
      <Group name={'k5'} defaultValue={[5]} onChange={spy}>
        <Checkbox data-testid='item5' name={undefined} value={5} />
        <Checkbox data-testid='item6' name={'k6'} value={6} />
      </Group>
      <Form onChange={spy}>
        <Checkbox data-testid='item7' name={undefined} value={7} />
        <Checkbox data-testid='item8' name={'k8'} value={8} />
        <Group defaultValue={[9]} onChange={spy}>
          <Checkbox data-testid='item9' name={undefined} value={9} />
          <Checkbox data-testid='item10' name={'k10'} value={10} />
        </Group>
        <Group name={'k11'} defaultValue={[11]} onChange={spy}>
          <Checkbox data-testid='item11' name={undefined} value={11} />
          <Checkbox data-testid='item12' name={'k12'} value={12} />
        </Group>
      </Form>
    </>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')
  const item3 = getByTestId('item3')
  const item4 = getByTestId('item4')
  const item5 = getByTestId('item5')
  const item6 = getByTestId('item6')
  const item7 = getByTestId('item7')
  const item8 = getByTestId('item8')
  const item9 = getByTestId('item9')
  const item10 = getByTestId('item10')
  const item11 = getByTestId('item11')
  const item12 = getByTestId('item12')

  {
    expect(item1).not.toHaveAttribute('data-name')
    expect(item2).toHaveAttribute('data-name', 'k2')
    expect(item3).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item4).toHaveAttribute('data-name', 'k4')
    expect(item5).toHaveAttribute('data-name', 'k5')
    expect(item6).toHaveAttribute('data-name', 'k6')
    expect(item7).not.toHaveAttribute('data-name')
    expect(item8).toHaveAttribute('data-name', 'k8')
    expect(item9).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item10).toHaveAttribute('data-name', 'k10')
    expect(item11).toHaveAttribute('data-name', 'k11')
    expect(item12).toHaveAttribute('data-name', 'k12')
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).toBeChecked()
    expect(item2).toBeChecked()
    expect(item3).not.toBeChecked()
    expect(item4).toBeChecked()
    expect(item5).not.toBeChecked()
    expect(item6).toBeChecked()
    expect(item7).toBeChecked()
    expect(item8).toBeChecked()
    expect(item9).not.toBeChecked()
    expect(item10).toBeChecked()
    expect(item11).not.toBeChecked()
    expect(item12).toBeChecked()
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).not.toBeChecked()
    expect(item2).not.toBeChecked()
    expect(item3).toBeChecked()
    expect(item4).not.toBeChecked()
    expect(item5).toBeChecked()
    expect(item6).not.toBeChecked()
    expect(item7).not.toBeChecked()
    expect(item8).not.toBeChecked()
    expect(item9).toBeChecked()
    expect(item10).not.toBeChecked()
    expect(item11).toBeChecked()
    expect(item12).not.toBeChecked()
  }

  expect(spy).toHaveBeenCalledTimes(16)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    7,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    8,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [], k12: [12] },
    'k12'
  )
  expect(spy).toHaveBeenNthCalledWith(
    9,
    expect.objectContaining({ defaultPrevented: false }),
    [3]
  )
  expect(spy).toHaveBeenNthCalledWith(
    10,
    expect.objectContaining({ defaultPrevented: false }),
    [5]
  )
  expect(spy).toHaveBeenNthCalledWith(
    11,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [10], k11: [], k12: [12] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    12,
    expect.objectContaining({ defaultPrevented: false }),
    [9]
  )
  expect(spy).toHaveBeenNthCalledWith(
    13,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [], k12: [12] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    14,
    expect.objectContaining({ defaultPrevented: false }),
    [11]
  )
  expect(spy).toHaveBeenNthCalledWith(
    15,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [12] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    16,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [] },
    'k12'
  )
})

test('useGroup - control - defaultValue - #2', async () => {
  const spy = vi.fn()

  const { getByTestId } = render(
    <>
      <Form defaultValue={{ k5: [] }} onChange={spy}>
        <Checkbox data-testid='item1' name={undefined} value={1} />
        <Checkbox data-testid='item2' name={'k2'} value={2} />
        <Group defaultValue={[3]} onChange={spy}>
          <Checkbox data-testid='item3' name={undefined} value={3} />
          <Checkbox data-testid='item4' name={'k4'} value={4} />
        </Group>
        <Group name={'k5'} defaultValue={[5]} onChange={spy}>
          <Checkbox data-testid='item5' name={undefined} value={5} />
          <Checkbox data-testid='item6' name={'k6'} value={6} />
        </Group>
      </Form>
      <Form defaultValue={{ k11: [11] }} onChange={spy}>
        <Checkbox data-testid='item7' name={undefined} value={7} />
        <Checkbox data-testid='item8' name={'k8'} value={8} />
        <Group defaultValue={[9]} onChange={spy}>
          <Checkbox data-testid='item9' name={undefined} value={9} />
          <Checkbox data-testid='item10' name={'k10'} value={10} />
        </Group>
        <Group name={'k11'} defaultValue={[]} onChange={spy}>
          <Checkbox data-testid='item11' name={undefined} value={11} />
          <Checkbox data-testid='item12' name={'k12'} value={12} />
        </Group>
      </Form>
    </>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')
  const item3 = getByTestId('item3')
  const item4 = getByTestId('item4')
  const item5 = getByTestId('item5')
  const item6 = getByTestId('item6')
  const item7 = getByTestId('item7')
  const item8 = getByTestId('item8')
  const item9 = getByTestId('item9')
  const item10 = getByTestId('item10')
  const item11 = getByTestId('item11')
  const item12 = getByTestId('item12')

  {
    expect(item1).not.toHaveAttribute('data-name')
    expect(item2).toHaveAttribute('data-name', 'k2')
    expect(item3).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item4).toHaveAttribute('data-name', 'k4')
    expect(item5).toHaveAttribute('data-name', 'k5')
    expect(item6).toHaveAttribute('data-name', 'k6')
    expect(item7).not.toHaveAttribute('data-name')
    expect(item8).toHaveAttribute('data-name', 'k8')
    expect(item9).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item10).toHaveAttribute('data-name', 'k10')
    expect(item11).toHaveAttribute('data-name', 'k11')
    expect(item12).toHaveAttribute('data-name', 'k12')
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).toBeChecked()
    expect(item2).toBeChecked()
    expect(item3).not.toBeChecked()
    expect(item4).toBeChecked()
    expect(item5).toBeChecked()
    expect(item6).toBeChecked()
    expect(item7).toBeChecked()
    expect(item8).toBeChecked()
    expect(item9).not.toBeChecked()
    expect(item10).toBeChecked()
    expect(item11).not.toBeChecked()
    expect(item12).toBeChecked()
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).not.toBeChecked()
    expect(item2).not.toBeChecked()
    expect(item3).toBeChecked()
    expect(item4).not.toBeChecked()
    expect(item5).not.toBeChecked()
    expect(item6).not.toBeChecked()
    expect(item7).not.toBeChecked()
    expect(item8).not.toBeChecked()
    expect(item9).toBeChecked()
    expect(item10).not.toBeChecked()
    expect(item11).toBeChecked()
    expect(item12).not.toBeChecked()
  }

  expect(spy).toHaveBeenCalledTimes(24)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k5: [] },
    'k2'
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k4: [4], k5: [] },
    'k4'
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false }),
    [5]
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k4: [4], k5: [5] },
    'k5'
  )
  expect(spy).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k4: [4], k5: [5], k6: [6] },
    'k6'
  )
  expect(spy).toHaveBeenNthCalledWith(
    7,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k11: [11] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    8,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    9,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [11] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    10,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    11,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    12,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [], k12: [12] },
    'k12'
  )
  expect(spy).toHaveBeenNthCalledWith(
    13,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [4], k5: [5], k6: [6] },
    'k2'
  )
  expect(spy).toHaveBeenNthCalledWith(
    14,
    expect.objectContaining({ defaultPrevented: false }),
    [3]
  )
  expect(spy).toHaveBeenNthCalledWith(
    15,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [], k5: [5], k6: [6] },
    'k4'
  )
  expect(spy).toHaveBeenNthCalledWith(
    16,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    17,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [], k5: [], k6: [6] },
    'k5'
  )
  expect(spy).toHaveBeenNthCalledWith(
    18,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [], k5: [], k6: [] },
    'k6'
  )
  expect(spy).toHaveBeenNthCalledWith(
    19,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [10], k11: [], k12: [12] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    20,
    expect.objectContaining({ defaultPrevented: false }),
    [9]
  )
  expect(spy).toHaveBeenNthCalledWith(
    21,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [], k12: [12] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    22,
    expect.objectContaining({ defaultPrevented: false }),
    [11]
  )
  expect(spy).toHaveBeenNthCalledWith(
    23,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [12] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    24,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [] },
    'k12'
  )
})

test('useGroup - control - value - #1', async () => {
  const spy = vi.fn()

  const { getByTestId } = render(
    <>
      <Checkbox data-testid='item1' name={undefined} value={1} />
      <Checkbox data-testid='item2' name={'k2'} value={2} />
      <Group value={[3]} onChange={spy}>
        <Checkbox data-testid='item3' name={undefined} value={3} />
        <Checkbox data-testid='item4' name={'k4'} value={4} />
      </Group>
      <Group name={'k5'} value={[5]} onChange={spy}>
        <Checkbox data-testid='item5' name={undefined} value={5} />
        <Checkbox data-testid='item6' name={'k6'} value={6} />
      </Group>
      <Form onChange={spy}>
        <Checkbox data-testid='item7' name={undefined} value={7} />
        <Checkbox data-testid='item8' name={'k8'} value={8} />
        <Group value={[9]} onChange={spy}>
          <Checkbox data-testid='item9' name={undefined} value={9} />
          <Checkbox data-testid='item10' name={'k10'} value={10} />
        </Group>
        <Group name={'k11'} value={[11]} onChange={spy}>
          <Checkbox data-testid='item11' name={undefined} value={11} />
          <Checkbox data-testid='item12' name={'k12'} value={12} />
        </Group>
      </Form>
    </>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')
  const item3 = getByTestId('item3')
  const item4 = getByTestId('item4')
  const item5 = getByTestId('item5')
  const item6 = getByTestId('item6')
  const item7 = getByTestId('item7')
  const item8 = getByTestId('item8')
  const item9 = getByTestId('item9')
  const item10 = getByTestId('item10')
  const item11 = getByTestId('item11')
  const item12 = getByTestId('item12')

  {
    expect(item1).not.toHaveAttribute('data-name')
    expect(item2).toHaveAttribute('data-name', 'k2')
    expect(item3).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item4).toHaveAttribute('data-name', 'k4')
    expect(item5).toHaveAttribute('data-name', 'k5')
    expect(item6).toHaveAttribute('data-name', 'k6')
    expect(item7).not.toHaveAttribute('data-name')
    expect(item8).toHaveAttribute('data-name', 'k8')
    expect(item9).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item10).toHaveAttribute('data-name', 'k10')
    expect(item11).toHaveAttribute('data-name', 'k11')
    expect(item12).toHaveAttribute('data-name', 'k12')
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).toBeChecked()
    expect(item2).toBeChecked()
    expect(item3).toBeChecked()
    expect(item4).toBeChecked()
    expect(item5).toBeChecked()
    expect(item6).toBeChecked()
    expect(item7).toBeChecked()
    expect(item8).toBeChecked()
    expect(item9).toBeChecked()
    expect(item10).toBeChecked()
    expect(item11).toBeChecked()
    expect(item12).toBeChecked()
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).not.toBeChecked()
    expect(item2).not.toBeChecked()
    expect(item3).toBeChecked()
    expect(item4).not.toBeChecked()
    expect(item5).toBeChecked()
    expect(item6).not.toBeChecked()
    expect(item7).not.toBeChecked()
    expect(item8).not.toBeChecked()
    expect(item9).toBeChecked()
    expect(item10).not.toBeChecked()
    expect(item11).toBeChecked()
    expect(item12).not.toBeChecked()
  }

  expect(spy).toHaveBeenCalledTimes(16)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    7,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    8,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [11], k12: [12] },
    'k12'
  )
  expect(spy).toHaveBeenNthCalledWith(
    9,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    10,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    11,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [10], k11: [11], k12: [12] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    12,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    13,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [12] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    14,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [], k12: [12] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    15,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    16,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [] },
    'k12'
  )
})

test('useGroup - control - value - #2', async () => {
  const spy = vi.fn()

  const { getByTestId } = render(
    <>
      <Form defaultValue={{ k5: [] }} onChange={spy}>
        <Checkbox data-testid='item1' name={undefined} value={1} />
        <Checkbox data-testid='item2' name={'k2'} value={2} />
        <Group value={[3]} onChange={spy}>
          <Checkbox data-testid='item3' name={undefined} value={3} />
          <Checkbox data-testid='item4' name={'k4'} value={4} />
        </Group>
        <Group name={'k5'} value={[5]} onChange={spy}>
          <Checkbox data-testid='item5' name={undefined} value={5} />
          <Checkbox data-testid='item6' name={'k6'} value={6} />
        </Group>
      </Form>
      <Form defaultValue={{ k11: [11] }} onChange={spy}>
        <Checkbox data-testid='item7' name={undefined} value={7} />
        <Checkbox data-testid='item8' name={'k8'} value={8} />
        <Group value={[9]} onChange={spy}>
          <Checkbox data-testid='item9' name={undefined} value={9} />
          <Checkbox data-testid='item10' name={'k10'} value={10} />
        </Group>
        <Group name={'k11'} value={[]} onChange={spy}>
          <Checkbox data-testid='item11' name={undefined} value={11} />
          <Checkbox data-testid='item12' name={'k12'} value={12} />
        </Group>
      </Form>
    </>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')
  const item3 = getByTestId('item3')
  const item4 = getByTestId('item4')
  const item5 = getByTestId('item5')
  const item6 = getByTestId('item6')
  const item7 = getByTestId('item7')
  const item8 = getByTestId('item8')
  const item9 = getByTestId('item9')
  const item10 = getByTestId('item10')
  const item11 = getByTestId('item11')
  const item12 = getByTestId('item12')

  {
    expect(item1).not.toHaveAttribute('data-name')
    expect(item2).toHaveAttribute('data-name', 'k2')
    expect(item3).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item4).toHaveAttribute('data-name', 'k4')
    expect(item5).toHaveAttribute('data-name', 'k5')
    expect(item6).toHaveAttribute('data-name', 'k6')
    expect(item7).not.toHaveAttribute('data-name')
    expect(item8).toHaveAttribute('data-name', 'k8')
    expect(item9).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item10).toHaveAttribute('data-name', 'k10')
    expect(item11).toHaveAttribute('data-name', 'k11')
    expect(item12).toHaveAttribute('data-name', 'k12')
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).toBeChecked()
    expect(item2).toBeChecked()
    expect(item3).toBeChecked()
    expect(item4).toBeChecked()
    expect(item5).toBeChecked()
    expect(item6).toBeChecked()
    expect(item7).toBeChecked()
    expect(item8).toBeChecked()
    expect(item9).toBeChecked()
    expect(item10).toBeChecked()
    expect(item11).not.toBeChecked()
    expect(item12).toBeChecked()
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).not.toBeChecked()
    expect(item2).not.toBeChecked()
    expect(item3).toBeChecked()
    expect(item4).not.toBeChecked()
    expect(item5).toBeChecked()
    expect(item6).not.toBeChecked()
    expect(item7).not.toBeChecked()
    expect(item8).not.toBeChecked()
    expect(item9).toBeChecked()
    expect(item10).not.toBeChecked()
    expect(item11).not.toBeChecked()
    expect(item12).not.toBeChecked()
  }

  expect(spy).toHaveBeenCalledTimes(24)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k5: [] },
    'k2'
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k4: [4], k5: [] },
    'k4'
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k4: [4], k5: [] },
    'k5'
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2], k4: [4], k5: [5], k6: [6] },
    'k6'
  )
  expect(spy).toHaveBeenNthCalledWith(
    7,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k11: [11] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    8,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    9,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [11] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    10,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [11] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    11,
    expect.objectContaining({ defaultPrevented: false }),
    [11]
  )
  expect(spy).toHaveBeenNthCalledWith(
    12,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [8], k10: [10], k11: [], k12: [12] },
    'k12'
  )
  expect(spy).toHaveBeenNthCalledWith(
    13,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [4], k5: [5], k6: [6] },
    'k2'
  )
  expect(spy).toHaveBeenNthCalledWith(
    14,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    15,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [], k5: [5], k6: [6] },
    'k4'
  )
  expect(spy).toHaveBeenNthCalledWith(
    16,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [], k5: [], k6: [6] },
    'k5'
  )
  expect(spy).toHaveBeenNthCalledWith(
    17,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    18,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [], k4: [], k5: [5], k6: [] },
    'k6'
  )
  expect(spy).toHaveBeenNthCalledWith(
    19,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [10], k11: [], k12: [12] },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    20,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    21,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [], k12: [12] },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    22,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [11], k12: [12] },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    23,
    expect.objectContaining({ defaultPrevented: false }),
    [11]
  )
  expect(spy).toHaveBeenNthCalledWith(
    24,
    expect.objectContaining({ defaultPrevented: false }),
    { k8: [], k10: [], k11: [], k12: [] },
    'k12'
  )
})

test('useGroup - control - onChange', async () => {
  const spy = vi.fn()

  const { getByTestId } = render(
    <>
      <Slider data-testid='item1' name={undefined} defaultValue={1} />
      <Slider data-testid='item2' name={'k2'} defaultValue={2} />
      <Group onChange={spy}>
        <Slider data-testid='item3' name={undefined} defaultValue={3} />
        <Slider data-testid='item4' name={'k4'} defaultValue={4} />
      </Group>
      <Group name={'k5'} onChange={spy}>
        <Slider data-testid='item5' name={undefined} defaultValue={5} />
        <Slider data-testid='item6' name={'k6'} defaultValue={6} />
      </Group>
      <Form onChange={spy}>
        <Slider data-testid='item7' name={undefined} defaultValue={7} />
        <Slider data-testid='item8' name={'k8'} defaultValue={8} />
        <Group onChange={spy}>
          <Slider data-testid='item9' name={undefined} defaultValue={9} />
          <Slider data-testid='item10' name={'k10'} defaultValue={10} />
        </Group>
        <Group name={'k11'} onChange={spy}>
          <Slider data-testid='item11' name={undefined} defaultValue={11} />
          <Slider data-testid='item12' name={'k12'} defaultValue={12} />
        </Group>
      </Form>
    </>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')
  const item3 = getByTestId('item3')
  const item4 = getByTestId('item4')
  const item5 = getByTestId('item5')
  const item6 = getByTestId('item6')
  const item7 = getByTestId('item7')
  const item8 = getByTestId('item8')
  const item9 = getByTestId('item9')
  const item10 = getByTestId('item10')
  const item11 = getByTestId('item11')
  const item12 = getByTestId('item12')

  {
    expect(item1).not.toHaveAttribute('data-name')
    expect(item2).toHaveAttribute('data-name', 'k2')
    expect(item3).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item4).toHaveAttribute('data-name', 'k4')
    expect(item5).toHaveAttribute('data-name', 'k5')
    expect(item6).toHaveAttribute('data-name', 'k6')
    expect(item7).not.toHaveAttribute('data-name')
    expect(item8).toHaveAttribute('data-name', 'k8')
    expect(item9).toHaveAttribute(
      'data-name',
      expect.stringMatching(/^group-[a-z0-9]{8}$/)
    )
    expect(item10).toHaveAttribute('data-name', 'k10')
    expect(item11).toHaveAttribute('data-name', 'k11')
    expect(item12).toHaveAttribute('data-name', 'k12')
  }

  {
    expect(item1).toHaveAttribute('aria-valuenow', '1')
    expect(item2).toHaveAttribute('aria-valuenow', '2')
    expect(item3).toHaveAttribute('aria-valuenow', '3')
    expect(item4).toHaveAttribute('aria-valuenow', '4')
    expect(item5).toHaveAttribute('aria-valuenow', '5')
    expect(item6).toHaveAttribute('aria-valuenow', '6')
    expect(item7).toHaveAttribute('aria-valuenow', '7')
    expect(item8).toHaveAttribute('aria-valuenow', '8')
    expect(item9).toHaveAttribute('aria-valuenow', '9')
    expect(item10).toHaveAttribute('aria-valuenow', '10')
    expect(item11).toHaveAttribute('aria-valuenow', '11')
    expect(item12).toHaveAttribute('aria-valuenow', '12')
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).toHaveAttribute('aria-valuenow', '2')
    expect(item2).toHaveAttribute('aria-valuenow', '3')
    expect(item3).toHaveAttribute('aria-valuenow', '4')
    expect(item4).toHaveAttribute('aria-valuenow', '5')
    expect(item5).toHaveAttribute('aria-valuenow', '6')
    expect(item6).toHaveAttribute('aria-valuenow', '7')
    expect(item7).toHaveAttribute('aria-valuenow', '8')
    expect(item8).toHaveAttribute('aria-valuenow', '9')
    expect(item9).toHaveAttribute('aria-valuenow', '10')
    expect(item10).toHaveAttribute('aria-valuenow', '11')
    expect(item11).toHaveAttribute('aria-valuenow', '12')
    expect(item12).toHaveAttribute('aria-valuenow', '13')
  }

  {
    await act(() => item1.click())
    await act(() => item2.click())
    await act(() => item3.click())
    await act(() => item4.click())
    await act(() => item5.click())
    await act(() => item6.click())
    await act(() => item7.click())
    await act(() => item8.click())
    await act(() => item9.click())
    await act(() => item10.click())
    await act(() => item11.click())
    await act(() => item12.click())

    expect(item1).toHaveAttribute('aria-valuenow', '3')
    expect(item2).toHaveAttribute('aria-valuenow', '4')
    expect(item3).toHaveAttribute('aria-valuenow', '5')
    expect(item4).toHaveAttribute('aria-valuenow', '6')
    expect(item5).toHaveAttribute('aria-valuenow', '7')
    expect(item6).toHaveAttribute('aria-valuenow', '8')
    expect(item7).toHaveAttribute('aria-valuenow', '9')
    expect(item8).toHaveAttribute('aria-valuenow', '10')
    expect(item9).toHaveAttribute('aria-valuenow', '11')
    expect(item10).toHaveAttribute('aria-valuenow', '12')
    expect(item11).toHaveAttribute('aria-valuenow', '13')
    expect(item12).toHaveAttribute('aria-valuenow', '14')
  }

  expect(spy).toHaveBeenCalledTimes(16)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    4
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'click' }),
    6
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ type: 'click' }),
    { k8: 9 },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ type: 'click' }),
    10
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ type: 'click' }),
    { k8: 9, k10: 11 },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({ type: 'click' }),
    12
  )
  expect(spy).toHaveBeenNthCalledWith(
    7,
    expect.objectContaining({ type: 'click' }),
    { k8: 9, k10: 11, k11: 12 },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    8,
    expect.objectContaining({ type: 'click' }),
    { k8: 9, k10: 11, k11: 12, k12: 13 },
    'k12'
  )
  expect(spy).toHaveBeenNthCalledWith(
    9,
    expect.objectContaining({ type: 'click' }),
    5
  )
  expect(spy).toHaveBeenNthCalledWith(
    10,
    expect.objectContaining({ type: 'click' }),
    7
  )
  expect(spy).toHaveBeenNthCalledWith(
    11,
    expect.objectContaining({ type: 'click' }),
    { k8: 10, k10: 11, k11: 12, k12: 13 },
    'k8'
  )
  expect(spy).toHaveBeenNthCalledWith(
    12,
    expect.objectContaining({ type: 'click' }),
    11
  )
  expect(spy).toHaveBeenNthCalledWith(
    13,
    expect.objectContaining({ type: 'click' }),
    { k8: 10, k10: 12, k11: 12, k12: 13 },
    'k10'
  )
  expect(spy).toHaveBeenNthCalledWith(
    14,
    expect.objectContaining({ type: 'click' }),
    13
  )
  expect(spy).toHaveBeenNthCalledWith(
    15,
    expect.objectContaining({ type: 'click' }),
    { k8: 10, k10: 12, k11: 13, k12: 13 },
    'k11'
  )
  expect(spy).toHaveBeenNthCalledWith(
    16,
    expect.objectContaining({ type: 'click' }),
    { k8: 10, k10: 12, k11: 13, k12: 14 },
    'k12'
  )
})

test('useGroup - control - preventDefault - #1', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  const { getByTestId } = render(
    <Group onChange={spy}>
      <Checkbox data-testid='item1' name={undefined} value={1} />
      <Checkbox data-testid='item2' name={'k2'} value={2} />
    </Group>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')

  expect(item1).toHaveAttribute(
    'data-name',
    expect.stringMatching(/^group-[a-z0-9]{8}$/)
  )
  expect(item2).toHaveAttribute('data-name', 'k2')

  await act(() => item1.click())
  await act(() => item2.click())
  await act(() => item1.click())
  await act(() => item2.click())

  expect(item1).toBeChecked()
  expect(item2).not.toBeChecked()

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    [1]
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    [1]
  )
})

test('useGroup - control - preventDefault - #2', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  const { getByTestId } = render(
    <Group name='k1' onChange={spy}>
      <Checkbox data-testid='item1' name={undefined} value={1} />
      <Checkbox data-testid='item2' name={'k2'} value={2} />
    </Group>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')

  expect(item1).toHaveAttribute('data-name', 'k1')
  expect(item2).toHaveAttribute('data-name', 'k2')

  await act(() => item1.click())
  await act(() => item2.click())
  await act(() => item1.click())
  await act(() => item2.click())

  expect(item1).toBeChecked()
  expect(item2).not.toBeChecked()

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    [1]
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    [1]
  )
})

test('useGroup - control - preventDefault - #3', async () => {
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  const { getByTestId } = render(
    <Form onChange={spy}>
      <Checkbox data-testid='item1' name={undefined} value={1} />
      <Checkbox data-testid='item2' name={'k2'} value={2} />
    </Form>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')

  expect(item1).not.toHaveAttribute('data-name')
  expect(item2).toHaveAttribute('data-name', 'k2')

  await act(() => item1.click())
  await act(() => item2.click())
  await act(() => item1.click())
  await act(() => item2.click())

  expect(item1).not.toBeChecked()
  expect(item2).toBeChecked()

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    { k2: [2] },
    'k2'
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2] },
    'k2'
  )
})

test('useGroup - control - preventDefault - #4', async () => {
  const spy1 = vi.fn().mockImplementationOnce(preventDefault)
  const spy2 = vi.fn().mockImplementationOnce(preventDefault)

  const { getByTestId } = render(
    <Form onChange={spy2}>
      <Group onChange={spy1}>
        <Checkbox data-testid='item1' name={undefined} value={1} />
        <Checkbox data-testid='item2' name={'k2'} value={2} />
      </Group>
    </Form>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')

  expect(item1).toHaveAttribute(
    'data-name',
    expect.stringMatching(/^group-[a-z0-9]{8}$/)
  )
  expect(item2).toHaveAttribute('data-name', 'k2')

  await act(() => item1.click())
  await act(() => item2.click())
  await act(() => item1.click())
  await act(() => item2.click())

  expect(item1).toBeChecked()
  expect(item2).toBeChecked()

  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    [1]
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    [1]
  )
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    { k2: [2] },
    'k2'
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    { k2: [2] },
    'k2'
  )
})

test('useGroup - control - preventDefault - #5', async () => {
  const spy1 = vi.fn().mockImplementationOnce(preventDefault)
  const spy2 = vi.fn().mockImplementationOnce(preventDefault)

  const { getByTestId } = render(
    <Form onChange={spy2}>
      <Group name='k1' onChange={spy1}>
        <Checkbox data-testid='item1' name={undefined} value={1} />
        <Checkbox data-testid='item2' name={'k2'} value={2} />
      </Group>
    </Form>
  )

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')

  expect(item1).toHaveAttribute('data-name', 'k1')
  expect(item2).toHaveAttribute('data-name', 'k2')

  {
    await act(() => item1.click())
    await act(() => item1.click())
    await act(() => item1.click())

    expect(item1).toBeChecked()

    expect(spy1).toHaveBeenCalledTimes(3)
    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ defaultPrevented: true }),
      [1]
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ defaultPrevented: true }),
      [1]
    )
    expect(spy1).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ defaultPrevented: false }),
      [1]
    )
    expect(spy2).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ defaultPrevented: true }),
      { k1: [1] },
      'k1'
    )
    expect(spy2).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ defaultPrevented: false }),
      { k1: [1] },
      'k1'
    )
  }

  vi.clearAllMocks()
  spy1.mockImplementationOnce(preventDefault)
  spy2.mockImplementationOnce(preventDefault)

  {
    await act(() => item2.click())
    await act(() => item2.click())
    await act(() => item2.click())

    expect(item2).not.toBeChecked()

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(3)
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ defaultPrevented: true }),
      { k1: [1], k2: [2] },
      'k2'
    )
    expect(spy2).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ defaultPrevented: false }),
      { k1: [1], k2: [2] },
      'k2'
    )
    expect(spy2).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ defaultPrevented: false }),
      { k1: [1], k2: [] },
      'k2'
    )
  }
})

test('useGroup - control - preventDefault - #6', async () => {
  const spy1 = vi.fn().mockImplementationOnce(preventDefault)
  const spy2 = vi.fn().mockImplementationOnce(preventDefault)

  function Page() {
    const [value, setValue] = useState<unknown>([])

    return (
      <Form onChange={spy2}>
        <Group
          name='k1'
          value={value}
          onChange={(ev, value) => {
            spy1(ev, value)

            if (!ev.defaultPrevented) {
              setValue(value)
            }
          }}
        >
          <Checkbox data-testid='item1' name={undefined} value={1} />
          <Checkbox data-testid='item2' name={'k2'} value={2} />
        </Group>
      </Form>
    )
  }

  const { getByTestId } = render(<Page />)

  const item1 = getByTestId('item1')
  const item2 = getByTestId('item2')

  expect(item1).toHaveAttribute('data-name', 'k1')
  expect(item2).toHaveAttribute('data-name', 'k2')

  {
    await act(() => item1.click())
    await act(() => item1.click())
    await act(() => item1.click())

    expect(item1).toBeChecked()

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ defaultPrevented: true }),
      [1]
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ defaultPrevented: false }),
      [1]
    )
    expect(spy2).toHaveBeenCalledTimes(3)
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ defaultPrevented: true }),
      { k1: [1] },
      'k1'
    )
    expect(spy2).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ defaultPrevented: true }),
      { k1: [1] },
      'k1'
    )
    expect(spy2).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ defaultPrevented: false }),
      { k1: [1] },
      'k1'
    )
  }

  vi.clearAllMocks()
  spy1.mockImplementationOnce(preventDefault)
  spy2.mockImplementationOnce(preventDefault)

  {
    await act(() => item2.click())
    await act(() => item2.click())
    await act(() => item2.click())

    expect(item2).not.toBeChecked()

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(3)
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ defaultPrevented: true }),
      { k1: [1], k2: [2] },
      'k2'
    )
    expect(spy2).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ defaultPrevented: false }),
      { k1: [1], k2: [2] },
      'k2'
    )
    expect(spy2).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ defaultPrevented: false }),
      { k1: [1], k2: [] },
      'k2'
    )
  }
})
