import { SearchInput } from '#component'
import { preventDefault } from '#util'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act } from 'react'
import { expect, test, vi } from 'vitest'

test('SearchInput - props', async () => {
  const { queryByRole, rerender } = render(null)

  rerender(<SearchInput before={undefined} />)

  expect(queryByRole('searchbox')).toBeInstanceOf(HTMLInputElement)
  expect(queryByRole('img', { hidden: true })).toBeInstanceOf(SVGElement)

  rerender(<SearchInput before={null} />)

  expect(queryByRole('searchbox')).toBeInstanceOf(HTMLInputElement)
  expect(queryByRole('img', { hidden: true })).toBe(null)
})

test('SearchInput - onSearch', async () => {
  const onKeyDown = vi.fn()
  const onSearch = vi.fn()

  const { getByRole } = render(
    <SearchInput
      placeholder='Search...'
      onKeyDown={onKeyDown}
      onSearch={onSearch}
    />
  )

  const input = getByRole('searchbox')

  await act(() => userEvent.type(input, 'Hello'))

  expect(input).toHaveValue('Hello')
  expect(onKeyDown).toHaveBeenCalledTimes(5)
  expect(onSearch).toHaveBeenCalledTimes(0)

  onKeyDown.mockImplementationOnce(preventDefault)
  await act(() => userEvent.type(input, '{Enter}'))
  await act(() => userEvent.type(input, '{Enter}'))

  expect(input).toHaveValue('Hello')
  expect(onKeyDown).toHaveBeenCalledTimes(7)
  expect(onSearch).toHaveBeenCalledTimes(1)
  expect(onSearch).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'keydown' }),
    'Hello'
  )
})
