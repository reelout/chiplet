import {
  VirtualActive,
  VirtualActiveSelector,
  VirtualDisabled,
  VirtualDisabledSelector,
  VirtualFocus,
  VirtualFocusSelector,
} from '#util'
import { expect, test } from 'vitest'

test('VirtualFocus', () => {
  expect(VirtualFocus).toMatch(/^data-focus-visible-\w{9}$/)
  expect(VirtualFocusSelector).toMatch(/^\[data-focus-visible-\w{9}="true"\]$/)
})

test('VirtualActive', () => {
  expect(VirtualActive).toMatch(/^data-active-\w{9}$/)
  expect(VirtualActiveSelector).toMatch(/^\[data-active-\w{9}="true"\]$/)
})

test('VirtualDisabled', () => {
  expect(VirtualDisabled).toBe('aria-disabled')
  expect(VirtualDisabledSelector).toBe('[aria-disabled="true"]')
})
