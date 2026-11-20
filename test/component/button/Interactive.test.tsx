import { Interactive } from '#component'
import { VirtualActive } from '#util'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { act, createRef } from 'react'
import { expect, test, vi } from 'vitest'

test('Interactive - reflects the disabled state in tabIndex and aria-disabled', async () => {
  const ref = createRef<HTMLDivElement>()

  const { rerender } = render(<Interactive ref={ref} />)

  expect(ref.current).toBeInstanceOf(HTMLDivElement)
  expect(ref.current).toHaveRole('button')
  expect(ref.current).toHaveAttribute('tabIndex', '0')
  expect(ref.current).not.toHaveAttribute('aria-disabled')
  expect(ref.current).not.toHaveAttribute(VirtualActive)
  expect(ref.current).not.toHaveAttribute('disabled')

  rerender(<Interactive disabled={false} ref={ref} />)

  expect(ref.current).toHaveAttribute('tabIndex', '0')
  expect(ref.current).toHaveAttribute('aria-disabled', 'false')
  expect(ref.current).not.toHaveAttribute('disabled')

  rerender(<Interactive disabled={true} ref={ref} />)

  expect(ref.current).toHaveAttribute('tabIndex', '-1')
  expect(ref.current).toHaveAttribute('aria-disabled', 'true')
  expect(ref.current).not.toHaveAttribute('disabled')
})

test('Interactive - renders the configured elementType', async () => {
  const { getByTestId } = render(
    <>
      <Interactive data-testid='button' />
      <Interactive data-testid='item' elementType='li' />
    </>
  )

  expect(getByTestId('button')).toBeInstanceOf(HTMLDivElement)
  expect(getByTestId('item')).toBeInstanceOf(HTMLLIElement)
})

test('Interactive - fires onClick without key events on a mouse click', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()

  const { getByTestId } = render(
    <Interactive
      data-testid='button'
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  )

  const el = getByTestId('button')

  await act(() => el.focus())
  await act(() => user.click(el))

  expect(el).toHaveFocus()
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onKeyDown).toHaveBeenCalledTimes(0)
  expect(onKeyUp).toHaveBeenCalledTimes(0)
})

test('Interactive - fires onClick on Enter keydown', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()

  const { getByTestId } = render(
    <Interactive
      data-testid='button'
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  )

  const el = getByTestId('button')

  await act(() => el.focus())
  await act(() => user.keyboard('{Enter>}'))

  expect(el).toHaveFocus()
  expect(el).not.toHaveAttribute(VirtualActive)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onKeyDown).toHaveBeenCalledTimes(1)
  expect(onKeyUp).toHaveBeenCalledTimes(0)

  await act(() => user.keyboard('{/Enter}'))

  expect(el).toHaveFocus()
  expect(el).not.toHaveAttribute(VirtualActive)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onKeyDown).toHaveBeenCalledTimes(1)
  expect(onKeyUp).toHaveBeenCalledTimes(1)
})

test('Interactive - holds the active state and fires onClick on Space keyup', async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()

  const { getByTestId } = render(
    <Interactive
      data-testid='button'
      onClick={onClick}
      onKeyDown={onKeyDown}
      onKeyUp={onKeyUp}
    />
  )

  const el = getByTestId('button')

  await act(() => el.focus())
  await act(() => user.keyboard('{ >}'))

  expect(el).toHaveFocus()
  expect(el).toHaveAttribute(VirtualActive, 'true')
  expect(onClick).toHaveBeenCalledTimes(0)
  expect(onKeyDown).toHaveBeenCalledTimes(1)
  expect(onKeyUp).toHaveBeenCalledTimes(0)

  await act(() => user.keyboard('{/ }'))

  expect(el).toHaveFocus()
  expect(el).not.toHaveAttribute(VirtualActive)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onKeyDown).toHaveBeenCalledTimes(1)
  expect(onKeyUp).toHaveBeenCalledTimes(1)
})
