import { Keyboard, Roving } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { render } from '@testing-library/react'
import { act, createRef } from 'react'
import { expect, test } from 'vitest'

test('Roving', async () => {
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()
  const item3 = createRef<HTMLDivElement>()

  function Page() {
    return (
      <Keyboard>
        <Roving role='menuitem' ref={item1}>
          Item 1
        </Roving>
        <Roving role='menuitem' ref={item2}>
          Item 2
        </Roving>
        <Roving role='menuitem' ref={item3}>
          Item 3
        </Roving>
      </Keyboard>
    )
  }

  render(<Page />)

  await act(() => item1.current?.focus())

  expect(document.activeElement).toBe(item1.current)

  for (const [key, ref] of [
    ['ArrowDown', item2],
    ['ArrowDown', item3],
    ['ArrowDown', item1],
    ['ArrowUp', item3],
    ['ArrowUp', item2],
    ['ArrowUp', item1],
  ] as const) {
    await act(() => {
      createEvent({ target: document.activeElement, key })
    })

    expect(document.activeElement).toBe(ref.current)
  }
})

test('Roving - elementType', async () => {
  function Page() {
    return (
      <>
        <Roving data-testid='item1' />
        <Roving data-testid='item2' elementType='li' />
      </>
    )
  }

  const { getByTestId } = render(<Page />)

  expect(getByTestId('item1')).toBeInstanceOf(HTMLDivElement)
  expect(getByTestId('item2')).toBeInstanceOf(HTMLLIElement)
})
