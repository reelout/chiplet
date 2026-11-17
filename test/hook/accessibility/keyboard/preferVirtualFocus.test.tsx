import { preferVirtualFocus } from '#hook/accessibility/keyboard/resolve'
import { createElement, createKeyboardEvent as createEvent } from '#test'
import { expect, test } from 'vitest'

test('preferVirtualFocus', () => {
  for (const [target, expected] of [
    [null, false],
    [undefined, false],
    [document.body, false],
    [document.createElement('div'), false],
    [document.createElement('button'), false],
    [document.createElement('input'), false],
    [document.createElement('textarea'), false],
  ] as const) {
    expect(preferVirtualFocus(createEvent({ target }))).toBe(expected)
  }
})

test('preferVirtualFocus - combobox', () => {
  for (const [tagName, attributes, expected] of [
    ['div', {}, true],
    ['span', {}, true],
    ['button', {}, true],
    ['input', {}, true],
    ['textarea', {}, true],
    ['input', { readOnly: true }, true],
    ['textarea', { readOnly: true }, true],
    ['input', { disabled: true }, false],
    ['textarea', { disabled: true }, false],
    ['input', { 'aria-disabled': true }, true],
    ['textarea', { 'aria-disabled': true }, true],
  ] as const) {
    const el = createElement(tagName, {
      role: 'combobox',
      tabIndex: 0,
      ...attributes,
    })

    document.body.appendChild(el)

    expect(preferVirtualFocus(createEvent({ target: el }))).toBe(false)

    el.focus()

    expect(preferVirtualFocus(createEvent({ target: el }))).toBe(expected)
  }
})
