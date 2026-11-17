import { Portal } from '#component'
import { createKeyboardEvent as createEvent } from '#test'
import { render } from '@testing-library/react'
import { act, createRef } from 'react'
import { expect, test, vi } from 'vitest'

test('Portal - default mount point', () => {
  const ref = createRef<HTMLDivElement>()

  const { getByTestId } = render(
    <div data-testid='container'>
      <Portal>
        <div data-testid='content' ref={ref}>
          Content
        </div>
      </Portal>
    </div>
  )

  expect(ref.current).toBeInstanceOf(HTMLDivElement)
  expect(getByTestId('container')).toBeEmptyDOMElement()
  expect(document.body).toContainElement(ref.current)
})

test('Portal - custom mount point', () => {
  const doc = document.createElement('div')
  const ref = createRef<HTMLDivElement>()

  const { getByTestId } = render(
    <div data-testid='container'>
      <Portal container={doc}>
        <div data-testid='content' ref={ref}>
          Content
        </div>
      </Portal>
    </div>
  )

  expect(ref.current).toBeInstanceOf(HTMLDivElement)
  expect(getByTestId('container')).toBeEmptyDOMElement()
  expect(document.body).not.toContainElement(ref.current)
  expect(doc).toContainElement(ref.current)
})

test('Portal - event propagation', async () => {
  const ref1 = createRef<HTMLDivElement>()
  const ref2 = createRef<HTMLDivElement>()
  const spy1 = vi.fn()
  const spy2 = vi.fn()

  render(
    <div role='menuitem' ref={ref1} tabIndex={-1} onKeyDown={spy2}>
      <Portal>
        <div role='menu' ref={ref2} />
      </Portal>
    </div>
  )

  ref1.current?.addEventListener('keydown', spy1)

  await act(() => createEvent({ target: ref2.current, key: 'Enter' }))

  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keydown',
      key: 'Enter',
      target: ref2.current,
    })
  )
})
