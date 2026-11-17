import { ShadowRoot } from '#component'
import { render } from '@testing-library/react'
import { act } from 'react'
import { assert, expect, test, vi } from 'vitest'

test('ShadowRoot - renders children into an open shadow root', () => {
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

test('ShadowRoot - styles do not cross the shadow boundary', () => {
  const style = document.createElement('style')

  style.textContent = '.leak-probe { color: rgb(255, 0, 0) }'

  document.head.append(style)

  try {
    const { getByTestId } = render(
      <div>
        <p className='leak-probe' data-testid='control'>
          document rule target
        </p>
        <p className='outbound-probe' data-testid='outbound'>
          shadow rule target
        </p>
        <ShadowRoot data-testid='host'>
          <style>
            {
              '[data-testid="scoped"] { color: rgb(0, 128, 0) } .outbound-probe { color: rgb(0, 128, 0) }'
            }
          </style>
          <p className='leak-probe' data-testid='leak'>
            document rule target
          </p>
          <p data-testid='scoped'>shadow style target</p>
        </ShadowRoot>
      </div>
    )

    const host = getByTestId('host')
    const leak = host.shadowRoot?.querySelector('[data-testid="leak"]')
    const scoped = host.shadowRoot?.querySelector('[data-testid="scoped"]')

    const control = getByTestId('control')

    assert(control instanceof HTMLParagraphElement)
    assert(leak instanceof HTMLParagraphElement)
    assert(scoped instanceof HTMLParagraphElement)

    expect(getComputedStyle(control).color).toBe('rgb(255, 0, 0)')
    expect(getComputedStyle(scoped).color).toBe('rgb(0, 128, 0)')
    expect(getComputedStyle(leak).color).not.toBe('rgb(255, 0, 0)')
    expect(getComputedStyle(getByTestId('outbound')).color).not.toBe(
      'rgb(0, 128, 0)'
    )
  } finally {
    style.remove()
  }
})

test('ShadowRoot - custom properties inherit through the shadow boundary', () => {
  const { getByTestId } = render(
    <ShadowRoot
      data-testid='host'
      style={{ '--brand': 'rgb(0, 0, 255)' } as React.CSSProperties}
    >
      <p data-testid='themed' style={{ color: 'var(--brand, rgb(255, 0, 0))' }}>
        themed
      </p>
    </ShadowRoot>
  )

  const host = getByTestId('host')
  const themed = host.shadowRoot?.querySelector('[data-testid="themed"]')

  assert(themed instanceof HTMLParagraphElement)

  expect(getComputedStyle(themed).color).toBe('rgb(0, 0, 255)')
})

test('ShadowRoot - events bubble through the shadow boundary', async () => {
  const innerClick = vi.fn()
  const hostClick = vi.fn()

  const { getByTestId } = render(
    <ShadowRoot data-testid='host' onClick={hostClick}>
      <button data-testid='button' onClick={innerClick}>
        button
      </button>
    </ShadowRoot>
  )

  const host = getByTestId('host')
  const button = host.shadowRoot?.querySelector('[data-testid="button"]')

  assert(button instanceof HTMLButtonElement)

  await act(() => {
    button.click()
  })

  expect(innerClick).toHaveBeenCalledTimes(1)
  expect(hostClick).toHaveBeenCalledTimes(1)
})

test('ShadowRoot - delegatesFocus moves focus into the shadow tree', () => {
  const { getByTestId } = render(
    <ShadowRoot data-testid='host' tabIndex={-1} delegatesFocus={true}>
      <button data-testid='button'>button</button>
    </ShadowRoot>
  )

  const host = getByTestId('host')
  const shadow = host.shadowRoot
  const button = shadow?.querySelector('[data-testid="button"]')

  expect(shadow?.delegatesFocus).toBe(true)

  act(() => {
    host.focus()
  })

  expect(shadow?.activeElement).toBe(button)
  expect(document.activeElement).toBe(host)
})
