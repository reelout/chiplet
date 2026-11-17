import { parse } from '#hook/accessibility/keyboard/resolve'
import { createElement, createKeyboardEvent as createEvent } from '#test'
import { expect, test } from 'vitest'

test('parse - inline', () => {
  for (const [key, altKey, expected] of [
    ['Enter', false, null],
    ['Home', false, 'Home'],
    ['End', false, 'End'],
    ['PageUp', false, 'PageUp'],
    ['PageDown', false, 'PageDown'],
    ['ArrowLeft', false, 'ArrowLeft'],
    ['ArrowRight', false, 'ArrowRight'],
    ['ArrowUp', false, null],
    ['ArrowDown', false, null],
    ['ArrowLeft', true, { key: 'ArrowLeft', altKey: true }],
    ['ArrowRight', true, { key: 'ArrowRight', altKey: true }],
    ['ArrowUp', true, null],
    ['ArrowDown', true, null],
    ['0', false, { key: 'Find', detail: '0' }],
    ['1', false, { key: 'Find', detail: '1' }],
    ['a', false, { key: 'Find', detail: 'a' }],
    ['Z', false, { key: 'Find', detail: 'Z' }],
  ] as const) {
    expect(parse('inline', null, createEvent({ key, altKey }))).toEqual(
      expected
    )
  }
})

test('parse - block', () => {
  for (const [key, altKey, expected] of [
    ['Enter', false, null],
    ['Home', false, 'Home'],
    ['End', false, 'End'],
    ['PageUp', false, 'PageUp'],
    ['PageDown', false, 'PageDown'],
    ['ArrowLeft', false, null],
    ['ArrowRight', false, null],
    ['ArrowUp', false, 'ArrowLeft'],
    ['ArrowDown', false, 'ArrowRight'],
    ['ArrowLeft', true, null],
    ['ArrowRight', true, null],
    ['ArrowUp', true, { key: 'ArrowLeft', altKey: true }],
    ['ArrowDown', true, { key: 'ArrowRight', altKey: true }],
    ['0', false, { key: 'Find', detail: '0' }],
    ['1', false, { key: 'Find', detail: '1' }],
    ['a', false, { key: 'Find', detail: 'a' }],
    ['Z', false, { key: 'Find', detail: 'Z' }],
  ] as const) {
    expect(parse('block', null, createEvent({ key, altKey }))).toEqual(expected)
  }
})

test('parse - both', () => {
  for (const [key, altKey, expected] of [
    ['Enter', false, null],
    ['Home', false, 'Home'],
    ['End', false, 'End'],
    ['PageUp', false, 'PageUp'],
    ['PageDown', false, 'PageDown'],
    ['ArrowLeft', false, 'ArrowLeft'],
    ['ArrowRight', false, 'ArrowRight'],
    ['ArrowUp', false, 'ArrowUp'],
    ['ArrowDown', false, 'ArrowDown'],
    ['ArrowLeft', true, { key: 'ArrowLeft', altKey: true }],
    ['ArrowRight', true, { key: 'ArrowRight', altKey: true }],
    ['ArrowUp', true, { key: 'ArrowUp', altKey: true }],
    ['ArrowDown', true, { key: 'ArrowDown', altKey: true }],
    ['0', false, { key: 'Find', detail: '0' }],
    ['1', false, { key: 'Find', detail: '1' }],
    ['a', false, { key: 'Find', detail: 'a' }],
    ['Z', false, { key: 'Find', detail: 'Z' }],
  ] as const) {
    expect(parse('both', null, createEvent({ key, altKey }))).toEqual(expected)
  }
})

test('parse - inline - RTL', () => {
  const target = document.createElement('div')
  target.dir = 'rtl'
  document.body.appendChild(target)

  for (const [key, altKey, expected] of [
    ['Enter', false, null],
    ['Home', false, 'Home'],
    ['End', false, 'End'],
    ['PageUp', false, 'PageUp'],
    ['PageDown', false, 'PageDown'],
    ['ArrowLeft', false, 'ArrowRight'],
    ['ArrowRight', false, 'ArrowLeft'],
    ['ArrowUp', false, null],
    ['ArrowDown', false, null],
    ['ArrowLeft', true, { key: 'ArrowRight', altKey: true }],
    ['ArrowRight', true, { key: 'ArrowLeft', altKey: true }],
    ['ArrowUp', true, null],
    ['ArrowDown', true, null],
    ['0', false, { key: 'Find', detail: '0' }],
    ['1', false, { key: 'Find', detail: '1' }],
    ['a', false, { key: 'Find', detail: 'a' }],
    ['Z', false, { key: 'Find', detail: 'Z' }],
  ] as const) {
    expect(parse('inline', target, createEvent({ key, altKey }))).toEqual(
      expected
    )
  }
})

test('parse - block - RTL', () => {
  const target = document.createElement('div')
  target.dir = 'rtl'
  document.body.appendChild(target)

  for (const [key, altKey, expected] of [
    ['Enter', false, null],
    ['Home', false, 'Home'],
    ['End', false, 'End'],
    ['PageUp', false, 'PageUp'],
    ['PageDown', false, 'PageDown'],
    ['ArrowLeft', false, null],
    ['ArrowRight', false, null],
    ['ArrowUp', false, 'ArrowRight'],
    ['ArrowDown', false, 'ArrowLeft'],
    ['ArrowLeft', true, null],
    ['ArrowRight', true, null],
    ['ArrowUp', true, { key: 'ArrowRight', altKey: true }],
    ['ArrowDown', true, { key: 'ArrowLeft', altKey: true }],
    ['0', false, { key: 'Find', detail: '0' }],
    ['1', false, { key: 'Find', detail: '1' }],
    ['a', false, { key: 'Find', detail: 'a' }],
    ['Z', false, { key: 'Find', detail: 'Z' }],
  ] as const) {
    expect(parse('block', target, createEvent({ key, altKey }))).toEqual(
      expected
    )
  }
})

test('parse - both - RTL', () => {
  const target = document.createElement('div')
  target.dir = 'rtl'
  document.body.appendChild(target)

  for (const [key, altKey, expected] of [
    ['Enter', false, null],
    ['Home', false, 'Home'],
    ['End', false, 'End'],
    ['PageUp', false, 'PageUp'],
    ['PageDown', false, 'PageDown'],
    ['ArrowLeft', false, 'ArrowRight'],
    ['ArrowRight', false, 'ArrowLeft'],
    ['ArrowUp', false, 'ArrowUp'],
    ['ArrowDown', false, 'ArrowDown'],
    ['ArrowLeft', true, { key: 'ArrowRight', altKey: true }],
    ['ArrowRight', true, { key: 'ArrowLeft', altKey: true }],
    ['ArrowUp', true, { key: 'ArrowUp', altKey: true }],
    ['ArrowDown', true, { key: 'ArrowDown', altKey: true }],
    ['0', false, { key: 'Find', detail: '0' }],
    ['1', false, { key: 'Find', detail: '1' }],
    ['a', false, { key: 'Find', detail: 'a' }],
    ['Z', false, { key: 'Find', detail: 'Z' }],
  ] as const) {
    expect(parse('both', target, createEvent({ key, altKey }))).toEqual(
      expected
    )
  }
})

test('parse - A-Z', () => {
  for (const [tagName, attributes, expected] of [
    ['div', {}, 'Find'],
    ['span', {}, 'Find'],
    ['button', {}, 'Find'],
    ['input', {}, null],
    ['textarea', {}, null],
    ['div', { contentEditable: 'true' }, null],
    ['span', { contentEditable: 'true' }, null],
    ['input', { readOnly: true }, 'Find'],
    ['textarea', { readOnly: true }, 'Find'],
  ] as const) {
    for (const [direction, isRTL] of [
      ['inline', false],
      ['block', false],
      ['both', false],
      ['inline', true],
      ['block', true],
      ['both', true],
    ] as const) {
      const target = createElement(tagName, attributes)
      target.dir = isRTL ? 'rtl' : 'ltr'
      document.body.appendChild(target)

      for (const key of ['0', '1', 'a', 'Z'] as const) {
        expect(parse(direction, null, createEvent({ target, key }))).toEqual(
          expected && { key: expected, detail: key }
        )
      }
    }
  }
})
