import { ShadowRoot } from '#component'
import { render } from '@testing-library/react'
import { createRef, StrictMode } from 'react'
import { expect, test, vi } from 'vitest'

test('ShadowRoot - attaches an open shadow root and renders children into it', () => {
  const { getByTestId } = render(
    <ShadowRoot data-testid='host'>
      <p data-testid='content'>Test</p>
    </ShadowRoot>
  )

  const host = getByTestId('host')
  const shadow = host.shadowRoot

  expect(shadow).toBeInstanceOf(window.ShadowRoot)
  expect(shadow?.mode).toBe('open')
  expect(host).toBeEmptyDOMElement()
  expect(shadow?.querySelector('[data-testid="content"]')).toBeInstanceOf(
    HTMLParagraphElement
  )
})

test('ShadowRoot - forwards attributes to the host element', () => {
  const { getByTestId } = render(
    <ShadowRoot
      data-testid='host'
      id='island'
      className='a b'
      style={{ padding: '1px' }}
    />
  )

  const host = getByTestId('host')

  expect(host).toHaveAttribute('id', 'island')
  expect(host).toHaveClass('a', 'b')
  expect(host).toHaveStyle({ padding: '1px' })
})

test('ShadowRoot - ref receives the host element', () => {
  const objectRef = createRef<HTMLDivElement>()
  const functionRef = vi.fn()

  const { getByTestId, rerender, unmount } = render(
    <ShadowRoot data-testid='host' ref={objectRef} />
  )

  expect(objectRef.current).toBe(getByTestId('host'))

  rerender(<ShadowRoot data-testid='host' ref={functionRef} />)

  expect(functionRef).toHaveBeenCalledWith(getByTestId('host'))
  expect(objectRef.current).toBeNull()

  unmount()

  expect(functionRef).toHaveBeenCalledWith(null)
})

test('ShadowRoot - does not re-attach the shadow root when delegatesFocus changes', () => {
  const spy = vi.spyOn(HTMLElement.prototype, 'attachShadow')

  const { getByTestId, rerender } = render(
    <ShadowRoot data-testid='host'>
      <p>Test</p>
    </ShadowRoot>
  )

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith({ mode: 'open', delegatesFocus: false })

  rerender(
    <ShadowRoot data-testid='host' delegatesFocus={true}>
      <p>Test</p>
    </ShadowRoot>
  )

  expect(spy).toHaveBeenCalledTimes(1)
  expect(getByTestId('host').shadowRoot?.textContent).toBe('Test')

  spy.mockRestore()
})

test('ShadowRoot - rerender updates children in the shadow root', () => {
  const { getByTestId, rerender } = render(
    <ShadowRoot data-testid='host'>{'A'}</ShadowRoot>
  )

  expect(getByTestId('host').shadowRoot?.textContent).toBe('A')

  rerender(<ShadowRoot data-testid='host'>{'B'}</ShadowRoot>)

  expect(getByTestId('host').shadowRoot?.textContent).toBe('B')
})

test('ShadowRoot - attaches the shadow root once under StrictMode', () => {
  const spy = vi.spyOn(HTMLElement.prototype, 'attachShadow')

  const { getByTestId } = render(
    <StrictMode>
      <ShadowRoot data-testid='host'>
        <p data-testid='content'>Test</p>
      </ShadowRoot>
    </StrictMode>
  )

  const host = getByTestId('host')

  expect(spy).toHaveBeenCalledTimes(1)
  expect(host.shadowRoot?.mode).toBe('open')
  expect(
    host.shadowRoot?.querySelector('[data-testid="content"]')
  ).toBeInstanceOf(HTMLParagraphElement)

  spy.mockRestore()
})

test('ShadowRoot - removes children from the shadow root on unmount', () => {
  const { getByTestId, unmount } = render(
    <ShadowRoot data-testid='host'>
      <p data-testid='content'>Test</p>
    </ShadowRoot>
  )

  const host = getByTestId('host')

  expect(host.shadowRoot?.textContent).toBe('Test')

  unmount()

  expect(host.shadowRoot?.childElementCount).toBe(0)
})
