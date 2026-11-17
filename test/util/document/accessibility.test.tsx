import {
  isARIAChecked,
  isARIACollapsed,
  isARIADisabled,
  isARIAExpanded,
  isARIAFalse,
  isARIAHasPopup,
  isARIAMultiSelectable,
  isARIASelected,
  isARIATrue,
} from '#util'
import { expect, test } from 'vitest'

test('isARIATrue', () => {
  expect(isARIATrue('true')).toBe(true)
  expect(isARIATrue('True')).toBe(false)
  expect(isARIATrue('TRUE')).toBe(false)
  expect(isARIATrue('false')).toBe(false)
  expect(isARIATrue('False')).toBe(false)
  expect(isARIATrue('FALSE')).toBe(false)
  expect(isARIATrue('')).toBe(false)
  expect(isARIATrue('Hello World')).toBe(false)
  expect(isARIATrue('true ')).toBe(false)
  expect(isARIATrue(' true')).toBe(false)
  expect(isARIATrue('true\n')).toBe(false)
  expect(isARIATrue('\ntrue')).toBe(false)
  expect(isARIATrue(null)).toBe(false)
  expect(isARIATrue(undefined)).toBe(false)
  expect(isARIATrue(true as never)).toBe(true)
  expect(isARIATrue(false as never)).toBe(false)
  expect(isARIATrue(1 as never)).toBe(false)
  expect(isARIATrue(0 as never)).toBe(false)
  expect(isARIATrue([] as never)).toBe(false)
  expect(isARIATrue({} as never)).toBe(false)
  expect(isARIATrue(Symbol('test') as never)).toBe(false)
  expect(isARIATrue(new Date() as never)).toBe(false)
  expect(isARIATrue((() => {}) as never)).toBe(false)
})

test('isARIAFalse', () => {
  expect(isARIAFalse('false')).toBe(true)
  expect(isARIAFalse('False')).toBe(false)
  expect(isARIAFalse('FALSE')).toBe(false)
  expect(isARIAFalse('true')).toBe(false)
  expect(isARIAFalse('True')).toBe(false)
  expect(isARIAFalse('TRUE')).toBe(false)
  expect(isARIAFalse('')).toBe(false)
  expect(isARIAFalse('Hello World')).toBe(false)
  expect(isARIAFalse('false ')).toBe(false)
  expect(isARIAFalse(' false')).toBe(false)
  expect(isARIAFalse('false\n')).toBe(false)
  expect(isARIAFalse('\nfalse')).toBe(false)
  expect(isARIAFalse(null)).toBe(false)
  expect(isARIAFalse(undefined)).toBe(false)
  expect(isARIAFalse(true as never)).toBe(false)
  expect(isARIAFalse(false as never)).toBe(true)
  expect(isARIAFalse(1 as never)).toBe(false)
  expect(isARIAFalse(0 as never)).toBe(false)
  expect(isARIAFalse([] as never)).toBe(false)
  expect(isARIAFalse({} as never)).toBe(false)
  expect(isARIAFalse(Symbol('test') as never)).toBe(false)
  expect(isARIAFalse(new Date() as never)).toBe(false)
  expect(isARIAFalse((() => {}) as never)).toBe(false)
})

test('isARIADisabled - SVGElement', () => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')

  expect(el).toBeInstanceOf(SVGElement)

  expect(isARIADisabled(el)).toBe(false)

  el.setAttribute('aria-disabled', 'true')

  expect(isARIADisabled(el)).toBe(true)
})

test('isARIADisabled', () => {
  const el = document.createElement('div')

  expect(isARIADisabled(el)).toBe(false)

  el.setAttribute('aria-disabled', 'true')

  expect(isARIADisabled(el)).toBe(true)
})

test('isARIAExpanded', () => {
  const el = document.createElement('div')

  expect(isARIAExpanded(el)).toBe(false)

  el.setAttribute('aria-expanded', 'true')

  expect(isARIAExpanded(el)).toBe(true)
})

test('isARIACollapsed', () => {
  const el = document.createElement('div')

  expect(isARIACollapsed(el)).toBe(false)

  el.setAttribute('aria-expanded', 'false')

  expect(isARIACollapsed(el)).toBe(true)
})

test('isARIAMultiSelectable', () => {
  const el = document.createElement('div')

  expect(isARIAMultiSelectable(el)).toBe(false)

  el.setAttribute('aria-multiselectable', 'true')

  expect(isARIAMultiSelectable(el)).toBe(true)
})

test('isARIASelected', () => {
  const el = document.createElement('div')

  expect(isARIASelected(el)).toBe(false)

  el.setAttribute('aria-selected', 'true')

  expect(isARIASelected(el)).toBe(true)
})

test('isARIAChecked', () => {
  const el = document.createElement('div')

  expect(isARIAChecked(el)).toBe(false)

  el.setAttribute('aria-checked', 'true')

  expect(isARIAChecked(el)).toBe(true)
})

test('isARIAHasPopup', () => {
  const el = document.createElement('div')

  expect(isARIAHasPopup(el)).toBe(false)

  el.setAttribute('aria-haspopup', 'true')

  expect(isARIAHasPopup(el)).toBe(true)

  el.setAttribute('aria-haspopup', 'false')

  expect(isARIAHasPopup(el)).toBe(false)

  el.setAttribute('aria-haspopup', '')

  expect(isARIAHasPopup(el)).toBe(false)

  el.setAttribute('aria-haspopup', 'dialog')

  expect(isARIAHasPopup(el)).toBe(true)

  el.setAttribute('aria-haspopup', 'menu')

  expect(isARIAHasPopup(el)).toBe(true)
})
