import { toHex } from '#util'
import { expect, test } from 'vitest'

test('toHex', () => {
  expect(toHex(new Uint8Array([]))).toBe('')
  expect(toHex(new Uint8Array([0, 15, 16, 255]))).toBe('000f10ff')
  expect(toHex(new Uint8Array([0, 0, 11, 22, 33, 44]))).toBe('00000b16212c')
})
