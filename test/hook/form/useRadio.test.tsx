import type { ChangeCallback } from '#hook'
import { useChange, useForm, useGroup, useRadio } from '#hook'
import { createMouseEvent } from '#test'
import { render, renderHook } from '@testing-library/react'
import { act, createRef } from 'react'
import { expect, test, vi } from 'vitest'

interface Props<T extends object> extends React.PropsWithChildren {
  defaultValue?: T | undefined
  value?: T | undefined
  onChange?:
    ((ev: React.SyntheticEvent<HTMLDivElement>, value: T) => void) | undefined
}

function Page<T extends object>(props: Props<T>) {
  const { defaultValue, value, onChange, ...attrs } = useForm(props)

  return <div {...attrs} />
}

interface ItemProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
  name: string
  value: string
  defaultChecked?: boolean | undefined
  checked?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, boolean> | undefined
}

function MenuItemRadio(props: ItemProps) {
  props = useRadio(props)
  props = useChange(props.checked, props)

  const { name, value, defaultChecked, checked, disabled, onChange, ...attrs } =
    props

  return <div {...attrs} role='menuitemradio' aria-checked={checked} />
}

test('useRadio - name', async () => {
  let { result } = renderHook(() => useRadio({ value: '1' }))

  expect(result.current).toEqual({
    name: undefined,
    value: '1',
    defaultChecked: false,
    onChange: expect.any(Function),
  })

  result = renderHook(() => useRadio({ name: 'name', value: '1' })).result

  expect(result.current).toEqual({
    name: 'name',
    value: '1',
    defaultChecked: false,
    onChange: expect.any(Function),
  })
})

test('useRadio - defaultChecked', async () => {
  {
    let defaultChecked: boolean | undefined = undefined

    const { result, rerender } = renderHook(() =>
      useRadio<ItemProps>({
        name: 'name',
        value: '1',
        defaultChecked,
        checked: undefined,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      name: 'name',
      value: '1',
      defaultChecked: false,
      checked: undefined,
      onChange: expect.any(Function),
    })

    defaultChecked = true
    rerender()
    expect(result.current.defaultChecked).toBe(true)
    expect(result.current.checked).toBe(undefined)

    await act(() => onChange?.(createMouseEvent({}), true))
    expect(result.current.defaultChecked).toBe(true)
    expect(result.current.checked).toBe(undefined)
  }

  {
    let defaultChecked: boolean | undefined = false

    const { result, rerender } = renderHook(() =>
      useRadio<ItemProps>({
        name: 'name',
        value: '2',
        defaultChecked,
        checked: undefined,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      name: 'name',
      value: '2',
      defaultChecked,
      checked: undefined,
      onChange: expect.any(Function),
    })

    defaultChecked = true
    rerender()
    expect(result.current.defaultChecked).toBe(true)
    expect(result.current.checked).toBe(undefined)

    await act(() => onChange?.(createMouseEvent({}), true))
    expect(result.current.defaultChecked).toBe(true)
    expect(result.current.checked).toBe(undefined)
  }

  {
    let defaultChecked: boolean | undefined = true

    const { result, rerender } = renderHook(() =>
      useRadio<ItemProps>({
        name: 'name',
        value: '3',
        defaultChecked,
        checked: undefined,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      name: 'name',
      value: '3',
      defaultChecked,
      checked: undefined,
      onChange: expect.any(Function),
    })

    defaultChecked = false
    rerender()
    expect(result.current.defaultChecked).toBe(false)
    expect(result.current.checked).toBe(undefined)

    await act(() => onChange?.(createMouseEvent({}), false))
    expect(result.current.defaultChecked).toBe(false)
    expect(result.current.checked).toBe(undefined)
  }
})

test('useRadio - checked', async () => {
  {
    let checked: boolean | undefined = undefined

    const { result, rerender } = renderHook(() =>
      useRadio({
        name: 'name',
        value: '1',
        defaultChecked: undefined,
        checked,
      })
    )

    expect(result.current).toEqual({
      name: 'name',
      value: '1',
      defaultChecked: false,
      checked: undefined,
      onChange: expect.any(Function),
    })

    checked = true
    rerender()
    expect(result.current.defaultChecked).toBe(undefined)
    expect(result.current.checked).toBe(true)

    checked = undefined
    rerender()
    expect(result.current.defaultChecked).toBe(false)
    expect(result.current.checked).toBe(undefined)

    checked = false
    rerender()
    expect(result.current.defaultChecked).toBe(undefined)
    expect(result.current.checked).toBe(false)
  }

  {
    let checked: boolean | undefined = false

    const { result, rerender } = renderHook(() =>
      useRadio<ItemProps>({
        name: 'name',
        value: '2',
        defaultChecked: undefined,
        checked,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      name: 'name',
      value: '2',
      defaultChecked: undefined,
      checked: false,
      onChange: expect.any(Function),
    })

    checked = true
    rerender()
    expect(result.current.defaultChecked).toBe(undefined)
    expect(result.current.checked).toBe(true)

    await act(() => onChange?.(createMouseEvent({}), false))
    expect(result.current.defaultChecked).toBe(undefined)
    expect(result.current.checked).toBe(true)
  }

  {
    let checked: boolean | undefined = true

    const { result, rerender } = renderHook(() =>
      useRadio<ItemProps>({
        name: 'name',
        value: '3',
        defaultChecked: undefined,
        checked,
      })
    )

    const onChange = result.current.onChange

    expect(result.current).toEqual({
      name: 'name',
      value: '3',
      defaultChecked: undefined,
      checked: true,
      onChange: expect.any(Function),
    })

    checked = false
    rerender()
    expect(result.current.defaultChecked).toBe(undefined)
    expect(result.current.checked).toBe(false)

    await act(() => onChange?.(createMouseEvent({}), true))
    expect(result.current.defaultChecked).toBe(undefined)
    expect(result.current.checked).toBe(false)
  }
})

test('useRadio - preventDefault', async () => {
  const defaultChecked = false
  const spy1 = vi.fn().mockImplementationOnce((ev) => ev.preventDefault())
  const spy2 = vi.fn().mockImplementationOnce((ev) => ev.preventDefault())

  const { result } = renderHook(() =>
    useRadio<ItemProps>({
      name: 'name',
      value: '0',
      defaultChecked,
      onChange: spy2,
      onClick: spy1,
    })
  )

  const onChange = result.current.onChange
  const onClick = result.current.onClick

  expect(result.current).toEqual({
    name: 'name',
    value: '0',
    defaultChecked,
    checked: undefined,
    onChange: expect.any(Function),
    onClick: expect.any(Function),
  })

  await act(() => onClick?.(createMouseEvent({})))
  expect(result.current.defaultChecked).toBe(defaultChecked)
  expect(result.current.checked).toBe(undefined)

  await act(() => onClick?.(createMouseEvent({})))
  expect(result.current.defaultChecked).toBe(defaultChecked)
  expect(result.current.checked).toBe(undefined)

  await act(() => onChange?.(createMouseEvent({}), true))
  expect(result.current.defaultChecked).toBe(defaultChecked)
  expect(result.current.checked).toBe(undefined)

  await act(() => onChange?.(createMouseEvent({}), true))
  expect(result.current.defaultChecked).toBe(defaultChecked)
  expect(result.current.checked).toBe(undefined)

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

test('useRadio - disabled', async () => {
  const defaultChecked = false
  let disabled = true
  const spy = vi.fn()

  const { result, rerender } = renderHook(() =>
    useRadio<ItemProps>({
      name: 'name',
      value: '0',
      defaultChecked,
      disabled,
      onChange: spy,
    })
  )

  let onChange = result.current.onChange

  expect(result.current).toEqual({
    name: 'name',
    value: '0',
    defaultChecked,
    checked: undefined,
    disabled,
    onChange: expect.any(Function),
  })

  await act(() => onChange?.(createMouseEvent({}), true))
  expect(result.current.defaultChecked).toBe(defaultChecked)
  expect(result.current.checked).toBe(undefined)
  expect(result.current.disabled).toBe(disabled)

  disabled = false
  rerender()
  onChange = result.current.onChange

  await act(() => onChange?.(createMouseEvent({}), true))
  expect(result.current.defaultChecked).toBe(defaultChecked)
  expect(result.current.checked).toBe(undefined)
  expect(result.current.disabled).toBe(disabled)

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    true
  )
})

test('useRadio - context - name', async () => {
  let name: string | undefined = undefined

  const wrapper = function Wrapper(props: React.PropsWithChildren) {
    return useGroup({ name, ...props }).props.children
  }

  expect(
    renderHook(() => useRadio({ value: '1' }), { wrapper }).result.current
  ).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: '1',
    checked: false,
    onChange: expect.any(Function),
  })

  name = 'name'

  expect(
    renderHook(() => useRadio({ value: '1' }), { wrapper }).result.current
  ).toEqual({
    name: 'name',
    value: '1',
    checked: false,
    onChange: expect.any(Function),
  })
})

test('useRadio - context - defaultValue', async () => {
  const spy = vi.fn()
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()
  const item3 = createRef<HTMLDivElement>()

  render(
    <Page defaultValue={undefined} onChange={spy}>
      <MenuItemRadio name='name' value='1' ref={item1}>
        Item 1
      </MenuItemRadio>
      <MenuItemRadio name='name' value='2' ref={item2}>
        Item 2
      </MenuItemRadio>
      <MenuItemRadio name='name' value='3' ref={item3} disabled={true}>
        Item 3
      </MenuItemRadio>
    </Page>
  )

  expect(item1.current).toHaveAttribute('aria-checked', 'false')
  expect(item2.current).toHaveAttribute('aria-checked', 'false')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  await act(() => item1.current?.click())

  expect(item1.current).toHaveAttribute('aria-checked', 'true')
  expect(item2.current).toHaveAttribute('aria-checked', 'false')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  await act(() => item1.current?.click())

  expect(item1.current).toHaveAttribute('aria-checked', 'true')
  expect(item2.current).toHaveAttribute('aria-checked', 'false')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  await act(() => item2.current?.click())

  expect(item1.current).toHaveAttribute('aria-checked', 'false')
  expect(item2.current).toHaveAttribute('aria-checked', 'true')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  await act(() => item3.current?.click())

  expect(item1.current).toHaveAttribute('aria-checked', 'false')
  expect(item2.current).toHaveAttribute('aria-checked', 'true')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    { name: '1' },
    'name'
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    { name: '2' },
    'name'
  )
})

test('useRadio - context - value', async () => {
  const spy = vi.fn()
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()
  const item3 = createRef<HTMLDivElement>()

  render(
    <Page value={{ name: '1' }} onChange={spy}>
      <MenuItemRadio name='name' value='1' ref={item1}>
        Item 1
      </MenuItemRadio>
      <MenuItemRadio name='name' value='2' ref={item2}>
        Item 2
      </MenuItemRadio>
      <MenuItemRadio name='name' value='3' ref={item3} disabled={true}>
        Item 3
      </MenuItemRadio>
    </Page>
  )

  expect(item1.current).toHaveAttribute('aria-checked', 'true')
  expect(item2.current).toHaveAttribute('aria-checked', 'false')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  await act(() => item2.current?.click())

  expect(item1.current).toHaveAttribute('aria-checked', 'true')
  expect(item2.current).toHaveAttribute('aria-checked', 'false')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  await act(() => item3.current?.click())

  expect(item1.current).toHaveAttribute('aria-checked', 'true')
  expect(item2.current).toHaveAttribute('aria-checked', 'false')
  expect(item3.current).toHaveAttribute('aria-checked', 'false')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    { name: '2' },
    'name'
  )
})
