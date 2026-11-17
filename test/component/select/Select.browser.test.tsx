import { Select } from '#component'
import { createKeyboardEvent } from '#test'
import { render } from '@testing-library/react'
import { act, createRef } from 'react'
import { expect, test, vi } from 'vitest'

test('Select - structure', () => {
  function Page() {
    return (
      <Select
        defaultOpen={true}
        options={[
          { value: '001', label: '001' },
          { value: '002', label: '002' },
        ]}
      />
    )
  }

  const { getByRole } = render(<Page />)

  expect(getByRole('combobox')).toBeInstanceOf(HTMLButtonElement)
  expect(getByRole('listbox')).toBeInstanceOf(HTMLUListElement)
  expect(getByRole('option', { name: '001' })).toBeInstanceOf(HTMLLIElement)
  expect(getByRole('option', { name: '002' })).toBeInstanceOf(HTMLLIElement)
})

test('Select - single', async () => {
  const spy1 = vi.fn()
  const spy2 = vi.fn()
  const ref = createRef<Select>()

  const { getByRole } = render(
    <Select
      placeholder='Select'
      options={[
        { value: 1, label: 'Item 1' },
        { value: 2, label: 'Item 2' },
        { value: 3, label: 'Item 3' },
      ]}
      onChange={spy1}
      onToggle={spy2}
      ref={ref}
    />
  )

  const combobox = getByRole('combobox')

  expect(ref.current?.open).toBe(false)
  expect(combobox).toHaveTextContent('Select')

  await act(() => {
    combobox.focus()
    combobox.click()
  })

  expect(ref.current?.open).toBe(true)
  expect(combobox).toHaveTextContent('Select')

  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'ArrowDown' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'Enter' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'ArrowUp' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'Enter' })
  })

  expect(ref.current?.open).toBe(false)
  expect(combobox).toHaveTextContent('Item 3')

  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    1
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    3
  )
  expect(spy2).toHaveBeenCalledTimes(4)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    true,
    'anchor'
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'click' }),
    false,
    'close'
  )
  expect(spy2).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ type: 'keydown', key: 'ArrowUp' }),
    true
  )
  expect(spy2).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ type: 'click' }),
    false,
    'close'
  )
})

test('Select - multiple', async () => {
  const spy1 = vi.fn()
  const spy2 = vi.fn()
  const ref = createRef<Select>()

  const { getByRole } = render(
    <Select
      placeholder='Select'
      multiple={true}
      options={[
        { value: 1, label: 'Item 1' },
        { value: 2, label: 'Item 2' },
        { value: 3, label: 'Item 3' },
      ]}
      onChange={spy1}
      onToggle={spy2}
      ref={ref}
    />
  )

  const combobox = getByRole('combobox')

  expect(ref.current?.open).toBe(false)
  expect(combobox).toHaveTextContent('Select')

  await act(() => {
    combobox.focus()
    combobox.click()
  })

  expect(ref.current?.open).toBe(true)
  expect(combobox).toHaveTextContent('Select')

  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'ArrowDown' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'Enter' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'ArrowDown' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'Enter' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'ArrowUp' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'Enter' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'ArrowUp' })
  })
  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'Enter' })
  })

  expect(ref.current?.open).toBe(true)
  expect(combobox).toHaveTextContent('Item 2, Item 3')

  await act(() => {
    createKeyboardEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(ref.current?.open).toBe(false)
  expect(combobox).toHaveTextContent('Item 2, Item 3')

  expect(spy1).toHaveBeenCalledTimes(4)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    [1]
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    [1, 2]
  )
  expect(spy1).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false }),
    [2]
  )
  expect(spy1).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false }),
    [2, 3]
  )
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    true,
    'anchor'
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'keydown', key: 'Escape' }),
    false,
    'escape'
  )
})

test('Select - icon', () => {
  function Page() {
    return (
      <>
        <Select slot={{ icon: { 'data-testid': 'icon1' } as object }} />
        <Select icon={<div data-testid='icon2' />} />
      </>
    )
  }

  const { getByTestId } = render(<Page />)

  expect(getByTestId('icon1')).toBeInstanceOf(SVGElement)
  expect(getByTestId('icon2')).toBeInstanceOf(HTMLElement)
})
