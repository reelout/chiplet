import type { ChangeCallback } from '#hook'
import { useChange, useGroup, useOption } from '#hook'
import { createMouseEvent as createEvent } from '#test'
import { render, renderHook } from '@testing-library/react'
import { act, createRef } from 'react'
import { expect, test, vi } from 'vitest'

interface Props<T extends object> extends React.PropsWithChildren {
  name?: string | undefined
  defaultValue?: T | undefined
  value?: T | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?:
    ((ev: React.SyntheticEvent<HTMLDivElement>, value: T) => void) | undefined
}

function Page<T extends object>(props: Props<T>) {
  const { name, defaultValue, value, multiple, disabled, onChange, ...attrs } =
    useGroup(props).props

  return <div {...attrs} />
}

interface ItemProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  name: string
  value: string
  defaultChecked?: never
  checked?: never
  defaultSelected?: boolean | undefined
  selected?: boolean | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, boolean> | undefined
}

function Option(props: ItemProps) {
  props = useOption(props)
  props = useChange(props.selected, props)

  const {
    name,
    value,
    defaultChecked,
    checked,
    defaultSelected,
    selected,
    multiple,
    disabled,
    onChange,
    ...attrs
  } = props

  return <div {...attrs} role='option' aria-selected={selected} />
}

test('useOption - name', async () => {
  let { result } = renderHook(() => useOption({ value: '1' }))

  expect(result.current).toEqual({
    role: 'option',
    name: undefined,
    value: '1',
    selected: undefined,
    onChange: expect.any(Function),
  })

  result = renderHook(() => useOption({ name: 'name', value: '1' })).result

  expect(result.current).toEqual({
    role: 'option',
    name: 'name',
    value: '1',
    selected: undefined,
    onChange: expect.any(Function),
  })
})

test('useOption - defaultSelected', async () => {
  {
    let defaultSelected: boolean | undefined = undefined

    const { result, rerender } = renderHook(() =>
      useOption<ItemProps>({
        name: 'name',
        value: '1',
        defaultSelected,
        selected: undefined,
        multiple: true,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      role: 'option',
      name: 'name',
      value: '1',
      defaultSelected,
      selected: undefined,
      multiple: true,
      onChange: expect.any(Function),
    })

    defaultSelected = true
    rerender()
    expect(result.current.defaultSelected).toBe(true)
    expect(result.current.selected).toBe(undefined)

    await act(() => onChange?.(createEvent({}), true))
    expect(result.current.defaultSelected).toBe(true)
    expect(result.current.selected).toBe(undefined)
  }

  {
    let defaultSelected: boolean | undefined = false

    const { result, rerender } = renderHook(() =>
      useOption<ItemProps>({
        name: 'name',
        value: '2',
        defaultSelected,
        selected: undefined,
        multiple: true,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      role: 'option',
      name: 'name',
      value: '2',
      defaultSelected,
      selected: undefined,
      multiple: true,
      onChange: expect.any(Function),
    })

    defaultSelected = true
    rerender()
    expect(result.current.defaultSelected).toBe(true)
    expect(result.current.selected).toBe(undefined)

    await act(() => onChange?.(createEvent({}), true))
    expect(result.current.defaultSelected).toBe(true)
    expect(result.current.selected).toBe(undefined)
  }

  {
    let defaultSelected: boolean | undefined = true

    const { result, rerender } = renderHook(() =>
      useOption<ItemProps>({
        name: 'name',
        value: '3',
        defaultSelected,
        selected: undefined,
        multiple: true,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      role: 'option',
      name: 'name',
      value: '3',
      defaultSelected,
      selected: undefined,
      multiple: true,
      onChange: expect.any(Function),
    })

    defaultSelected = false
    rerender()
    expect(result.current.defaultSelected).toBe(false)
    expect(result.current.selected).toBe(undefined)

    await act(() => onChange?.(createEvent({}), false))
    expect(result.current.defaultSelected).toBe(false)
    expect(result.current.selected).toBe(undefined)
  }
})

test('useOption - selected', async () => {
  {
    let selected: boolean | undefined = undefined

    const { result, rerender } = renderHook(() =>
      useOption({
        name: 'name',
        value: '1',
        defaultSelected: undefined,
        selected,
        multiple: true,
      })
    )

    expect(result.current).toEqual({
      role: 'option',
      name: 'name',
      value: '1',
      defaultSelected: undefined,
      selected: undefined,
      multiple: true,
      onChange: expect.any(Function),
    })

    selected = true
    rerender()
    expect(result.current.defaultSelected).toBe(undefined)
    expect(result.current.selected).toBe(true)

    selected = undefined
    rerender()
    expect(result.current.defaultSelected).toBe(undefined)
    expect(result.current.selected).toBe(undefined)

    selected = false
    rerender()
    expect(result.current.defaultSelected).toBe(undefined)
    expect(result.current.selected).toBe(false)
  }

  {
    let selected: boolean | undefined = false

    const { result, rerender } = renderHook(() =>
      useOption<ItemProps>({
        name: 'name',
        value: '2',
        defaultSelected: undefined,
        selected,
        multiple: true,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      role: 'option',
      name: 'name',
      value: '2',
      defaultSelected: undefined,
      selected: false,
      multiple: true,
      onChange: expect.any(Function),
    })

    selected = true
    rerender()
    expect(result.current.defaultSelected).toBe(undefined)
    expect(result.current.selected).toBe(true)

    await act(() => onChange?.(createEvent({}), false))
    expect(result.current.defaultSelected).toBe(undefined)
    expect(result.current.selected).toBe(true)
  }

  {
    let selected: boolean | undefined = true

    const { result, rerender } = renderHook(() =>
      useOption<ItemProps>({
        name: 'name',
        value: '3',
        defaultSelected: undefined,
        selected,
        multiple: true,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      role: 'option',
      name: 'name',
      value: '3',
      defaultSelected: undefined,
      selected: true,
      multiple: true,
      onChange: expect.any(Function),
    })

    selected = false
    rerender()
    expect(result.current.defaultSelected).toBe(undefined)
    expect(result.current.selected).toBe(false)

    await act(() => onChange?.(createEvent({}), true))
    expect(result.current.defaultSelected).toBe(undefined)
    expect(result.current.selected).toBe(false)
  }
})

test('useOption - preventDefault', async () => {
  const defaultSelected = false
  const spy1 = vi.fn().mockImplementationOnce((ev) => ev.preventDefault())
  const spy2 = vi.fn().mockImplementationOnce((ev) => ev.preventDefault())

  const { result } = renderHook(() =>
    useOption<ItemProps>({
      name: 'name',
      value: '0',
      defaultSelected,
      multiple: true,
      onChange: spy2,
      onClick: spy1,
    })
  )

  const onChange = result.current.onChange
  const onClick = result.current.onClick

  expect(result.current).toEqual({
    role: 'option',
    name: 'name',
    value: '0',
    defaultSelected,
    selected: undefined,
    multiple: true,
    onChange: expect.any(Function),
    onClick: expect.any(Function),
  })

  await act(() => onClick?.(createEvent({})))
  expect(result.current.defaultSelected).toBe(defaultSelected)
  expect(result.current.selected).toBe(undefined)

  await act(() => onClick?.(createEvent({})))
  expect(result.current.defaultSelected).toBe(defaultSelected)
  expect(result.current.selected).toBe(undefined)

  await act(() => onChange?.(createEvent({}), true))
  expect(result.current.defaultSelected).toBe(defaultSelected)
  expect(result.current.selected).toBe(undefined)

  await act(() => onChange?.(createEvent({}), true))
  expect(result.current.defaultSelected).toBe(defaultSelected)
  expect(result.current.selected).toBe(undefined)

  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true })
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false })
  )
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    true
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
})

test('useOption - disabled', async () => {
  const defaultSelected = false
  let disabled = true
  const spy = vi.fn()

  const { result, rerender } = renderHook(() =>
    useOption<ItemProps>({
      name: 'name',
      value: '0',
      defaultSelected,
      multiple: true,
      disabled,
      onChange: spy,
    })
  )

  let onChange = result.current.onChange

  expect(result.current).toEqual({
    role: 'option',
    name: 'name',
    value: '0',
    defaultSelected,
    selected: undefined,
    multiple: true,
    disabled,
    onChange: expect.any(Function),
  })

  await act(() => onChange?.(createEvent({}), true))
  expect(result.current.defaultSelected).toBe(defaultSelected)
  expect(result.current.selected).toBe(undefined)
  expect(result.current.disabled).toBe(disabled)

  disabled = false
  rerender()
  onChange = result.current.onChange

  await act(() => onChange?.(createEvent({}), true))
  expect(result.current.defaultSelected).toBe(defaultSelected)
  expect(result.current.selected).toBe(undefined)
  expect(result.current.disabled).toBe(disabled)

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
})

test('useOption - context - name', async () => {
  let name: string | undefined = undefined

  const wrapper = function Wrapper(props: React.PropsWithChildren) {
    return useGroup({ name, ...props }).props.children
  }

  expect(
    renderHook(() => useOption({ value: '1' }), { wrapper }).result.current
  ).toEqual({
    role: 'option',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: '1',
    selected: false,
    onChange: expect.any(Function),
  })

  name = 'name'

  expect(
    renderHook(() => useOption({ value: '1' }), { wrapper }).result.current
  ).toEqual({
    role: 'option',
    name: 'name',
    value: '1',
    selected: false,
    onChange: expect.any(Function),
  })
})

test('useOption - context - defaultValue', async () => {
  const spy = vi.fn()
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()
  const item3 = createRef<HTMLDivElement>()

  render(
    <Page name='name' defaultValue={undefined} onChange={spy}>
      <Option name='name' value='1' ref={item1}>
        Item 1
      </Option>
      <Option name='name' value='2' ref={item2}>
        Item 2
      </Option>
      <Option name='name' value='3' ref={item3} disabled={true}>
        Item 3
      </Option>
    </Page>
  )

  expect(item1.current).toHaveAttribute('aria-selected', 'false')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item1.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item1.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item2.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'false')
  expect(item2.current).toHaveAttribute('aria-selected', 'true')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item3.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'false')
  expect(item2.current).toHaveAttribute('aria-selected', 'true')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    '1'
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    '2'
  )
})

test('useOption - context - value', async () => {
  const spy = vi.fn()
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()
  const item3 = createRef<HTMLDivElement>()

  render(
    <Page name='name' value={'1'} onChange={spy}>
      <Option name='name' value='1' ref={item1}>
        Item 1
      </Option>
      <Option name='name' value='2' ref={item2}>
        Item 2
      </Option>
      <Option name='name' value='3' ref={item3} disabled={true}>
        Item 3
      </Option>
    </Page>
  )

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item2.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item3.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    '2'
  )
})

test('useOption - context - defaultValue - multiple', async () => {
  const spy = vi.fn()
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()
  const item3 = createRef<HTMLDivElement>()

  render(
    <Page name='name' defaultValue={undefined} multiple={true} onChange={spy}>
      <Option name='name' value='1' ref={item1}>
        Item 1
      </Option>
      <Option name='name' value='2' ref={item2}>
        Item 2
      </Option>
      <Option name='name' value='3' ref={item3} disabled={true}>
        Item 3
      </Option>
    </Page>
  )

  expect(item1.current).toHaveAttribute('aria-selected', 'false')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item1.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item1.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'false')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item2.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'false')
  expect(item2.current).toHaveAttribute('aria-selected', 'true')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item3.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'false')
  expect(item2.current).toHaveAttribute('aria-selected', 'true')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item1.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'true')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item2.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  expect(spy).toHaveBeenCalledTimes(5)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    ['1']
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    []
  )
  expect(spy).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    ['2']
  )
  expect(spy).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false }),
    ['2', '1']
  )
  expect(spy).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({ defaultPrevented: false }),
    ['1']
  )
})

test('useOption - context - value - multiple', async () => {
  const spy = vi.fn()
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()
  const item3 = createRef<HTMLDivElement>()

  render(
    <Page name='name' value={['1']} multiple={true} onChange={spy}>
      <Option name='name' value='1' ref={item1}>
        Item 1
      </Option>
      <Option name='name' value='2' ref={item2}>
        Item 2
      </Option>
      <Option name='name' value='3' ref={item3} disabled={true}>
        Item 3
      </Option>
    </Page>
  )

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item2.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  await act(() => item3.current?.click())

  expect(item1.current).toHaveAttribute('aria-selected', 'true')
  expect(item2.current).toHaveAttribute('aria-selected', 'false')
  expect(item3.current).toHaveAttribute('aria-selected', 'false')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    ['1', '2']
  )
})
