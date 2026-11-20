import { Portal } from '#component'
import { createKeyboardEvent as createEvent } from '#test'
import {
  DarkColorScheme,
  GlobalContainerStyle,
  LightColorScheme,
  ThemeProvider,
} from '#theme'
import { render } from '@testing-library/react'
import { act, createRef } from 'react'
import { assert, expect, test, vi } from 'vitest'

const containerClasses = GlobalContainerStyle.split(' ')

function getThemedWrapper(content: HTMLElement) {
  const wrapper = content.parentElement

  assert(wrapper instanceof HTMLDivElement)

  return wrapper
}

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

test('Portal - wraps portaled content in the active theme scope', () => {
  const { getByTestId } = render(
    <div data-testid='root'>
      <ThemeProvider>
        <Portal>
          <div data-testid='content'>Content</div>
        </Portal>
      </ThemeProvider>
    </div>
  )

  const content = getByTestId('content')
  const wrapper = getThemedWrapper(content)

  expect(getByTestId('root')).not.toContainElement(content)
  expect(document.body).toContainElement(wrapper)
  expect(wrapper).toHaveClass(...containerClasses)
})

test('Portal - themed wrapper follows the color scheme', () => {
  const { rerender, getByTestId } = render(
    <ThemeProvider colorScheme='dark'>
      <Portal>
        <div data-testid='content'>Content</div>
      </Portal>
    </ThemeProvider>
  )

  const wrapper = getThemedWrapper(getByTestId('content'))

  expect(wrapper).toHaveClass(DarkColorScheme)
  expect(getComputedStyle(wrapper).colorScheme).toBe('dark')

  rerender(
    <ThemeProvider colorScheme='light'>
      <Portal>
        <div data-testid='content'>Content</div>
      </Portal>
    </ThemeProvider>
  )

  expect(wrapper).toHaveClass(LightColorScheme)
  expect(wrapper).not.toHaveClass(DarkColorScheme)
  expect(getComputedStyle(wrapper).colorScheme).toBe('light')
})

test('Portal - themed wrapper resolves theme colors for portaled content', () => {
  const { getByTestId } = render(
    <>
      <ThemeProvider colorScheme='light'>
        <Portal>
          <div data-testid='light'>Content</div>
        </Portal>
      </ThemeProvider>
      <ThemeProvider colorScheme='dark'>
        <Portal>
          <div data-testid='dark'>Content</div>
        </Portal>
      </ThemeProvider>
    </>
  )

  const light = getThemedWrapper(getByTestId('light'))
  const dark = getThemedWrapper(getByTestId('dark'))

  expect(getComputedStyle(light).color).not.toBe(getComputedStyle(dark).color)
})

test('Portal - nested ThemeProviders scope to the innermost provider', () => {
  const { getByTestId } = render(
    <ThemeProvider colorScheme='light'>
      <ThemeProvider colorScheme='dark'>
        <Portal>
          <div data-testid='content'>Content</div>
        </Portal>
      </ThemeProvider>
    </ThemeProvider>
  )

  const wrapper = getThemedWrapper(getByTestId('content'))

  expect(wrapper).toHaveClass(DarkColorScheme)
  expect(wrapper).not.toHaveClass(LightColorScheme)
})
