import { isQuickNavigationAllowed } from '#hook/accessibility/keyboard/resolve'
import { createElement, createKeyboardEvent as createEvent } from '#test'
import { beforeAll, expect, test } from 'vitest'

beforeAll(() => {
  if (typeof HTMLElement.prototype.isContentEditable === 'undefined') {
    Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
      configurable: true,
      enumerable: true,
      get() {
        return this.getAttribute('contenteditable') === 'true'
      },
    })
  }
})

test('isQuickNavigationAllowed', () => {
  for (const [tagName, attributes, expected] of [
    [null, {}, true],
    [undefined, {}, true],
    [document.createElementNS('http://www.w3.org/2000/svg', 'svg'), {}, true],
    ['div', {}, true],
    ['span', {}, true],
    ['button', {}, true],
    ['input', {}, false],
    ['textarea', {}, false],
    ['div', { contentEditable: 'true' }, false],
    ['span', { contentEditable: 'true' }, false],
    ['input', { readOnly: true }, true],
    ['textarea', { readOnly: true }, true],
    ['input', { disabled: true }, true],
    ['textarea', { disabled: true }, true],
  ] as const) {
    let el: Element | null | undefined

    if (typeof tagName === 'string') {
      el = createElement(tagName, attributes)
    } else {
      el = tagName
    }

    expect(isQuickNavigationAllowed(createEvent({ target: el }))).toBe(expected)
  }
})
