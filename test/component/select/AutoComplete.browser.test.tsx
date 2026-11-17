import { AutoComplete } from '#component'
import { fireEvent, render } from '@testing-library/react'
import { act } from 'react'
import { beforeAll, expect, test, vi } from 'vitest'

function toArray() {
  return Array.from(CSS.highlights.values()).flatMap((highlight) => {
    return Array.from(highlight.values()).map((range) => [
      range.startContainer.textContent,
      range.startOffset,
      range.endContainer.textContent,
      range.endOffset,
    ])
  })
}

beforeAll(() => {
  globalThis.Highlight ??= Set as unknown as typeof Highlight
  CSS.highlights ??= new Map<string, Highlight>()
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

test('AutoComplete - structure', () => {
  function Page() {
    return (
      <AutoComplete
        defaultOpen={true}
        options={[
          { value: '001', label: '001' },
          { value: '002', label: '002' },
        ]}
      />
    )
  }

  const { getByRole } = render(<Page />)

  expect(getByRole('combobox')).toBeInstanceOf(HTMLInputElement)
  expect(getByRole('listbox')).toBeInstanceOf(HTMLUListElement)
  expect(getByRole('option', { name: '001' })).toBeInstanceOf(HTMLLIElement)
  expect(getByRole('option', { name: '002' })).toBeInstanceOf(HTMLLIElement)
})

test('AutoComplete - icon', () => {
  function Page() {
    return (
      <>
        <AutoComplete slot={{ icon: { 'data-testid': 'icon1' } as object }} />
        <AutoComplete icon={<div data-testid='icon2' />} />
      </>
    )
  }

  const { getByTestId } = render(<Page />)

  expect(getByTestId('icon1')).toBeInstanceOf(SVGElement)
  expect(getByTestId('icon2')).toBeInstanceOf(HTMLElement)
})

test('AutoComplete - highlight', async () => {
  function Page() {
    return (
      <AutoComplete
        defaultOpen={true}
        options={[
          { value: 'abc', label: 'Abc' },
          { value: 'xyz', label: 'Xyz' },
        ]}
      />
    )
  }

  const { getByRole } = render(<Page />)

  const el = getByRole('combobox') as HTMLInputElement

  await act(() => vi.runOnlyPendingTimersAsync())

  expect(CSS.highlights.size).toBe(0)
  expect(toArray()).toEqual([])

  await act(() => fireEvent.change(el, { target: { value: 'ab' } }))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(CSS.highlights.size).toBe(1)
  expect(toArray()).toEqual([['Abc', 0, 'Abc', 2]])

  await act(() => fireEvent.change(el, { target: { value: '12' } }))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(CSS.highlights.size).toBe(0)
  expect(toArray()).toEqual([])

  await act(() => fireEvent.change(el, { target: { value: 'yz' } }))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(CSS.highlights.size).toBe(1)
  expect(toArray()).toEqual([['Xyz', 1, 'Xyz', 3]])

  await act(() => fireEvent.change(el, { target: { value: '' } }))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(CSS.highlights.size).toBe(0)
  expect(toArray()).toEqual([])
})
