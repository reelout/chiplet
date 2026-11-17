import { kebabCase } from '#util'
import { expect, test } from 'vitest'

test('kebabCase', () => {
  expect(kebabCase('')).toBe('')
  expect(kebabCase('ab aBb c1CdEE2EEe')).toBe('ab-a-bb-c1-cd-ee2-e-ee')
  expect(kebabCase('HTML5')).toBe('html5')
  expect(kebabCase('DOMParser')).toBe('dom-parser')
  expect(kebabCase('SVG2PNG')).toBe('svg2-png')
  expect(kebabCase('p2pNetwork')).toBe('p2p-network')
})
