import { validateFocusVisible } from '#hook/accessibility/keyboard/resolve'
import { createKeyboardEvent as createEvent } from '#test'
import { getByTestId } from '@testing-library/react'
import { expect, test } from 'vitest'

test('validateFocusVisible', () => {
  for (const [target, expected] of [
    [null, false],
    [undefined, false],
    [document.body, false],
    [document.createElement('div'), false],
    [document.createElement('button'), false],
    [document.createElement('input'), false],
    [document.createElement('textarea'), false],
  ] as const) {
    expect(validateFocusVisible(createEvent({ target }))).toBe(expected)
  }

  {
    document.body.innerHTML = `
      <button data-testid="button1">Button</button>
      <button data-testid="button2">Button</button>
    `

    const button1 = getByTestId(document.body, 'button1')
    const button2 = getByTestId(document.body, 'button2')

    expect(validateFocusVisible({ target: button1 })).toBe(false)
    expect(validateFocusVisible({ target: button2 })).toBe(false)

    button1.blur()
    button1.focus({ focusVisible: false })

    expect(validateFocusVisible({ target: button1 })).toBe(false)
    expect(validateFocusVisible({ target: button2 })).toBe(false)

    button1.blur()
    button1.focus({ focusVisible: true })

    expect(validateFocusVisible({ target: button1 })).toBe(true)
    expect(validateFocusVisible({ target: button2 })).toBe(false)
  }
})
