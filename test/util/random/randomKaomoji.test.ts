import { randomKaomoji } from '#util/random/randomKaomoji'
import { expect, test } from 'vitest'

test('randomKaomoji', () => {
  expect(randomKaomoji()).toMatch(/^(\S|\S.*\S)$/)
})
