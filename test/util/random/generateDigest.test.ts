import { generateDigest } from '#util'
import { expect, test } from 'vitest'

test('generateDigest', async () => {
  expect(await generateDigest('')).toBe(
    'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'
  )
  expect(await generateDigest('hello world')).toBe(
    'b94d27b9934d3e08a52e52d7da7dabfac484efe37a5380ee9088f7ace2efcde9'
  )
  expect(await generateDigest('2026-01-01')).toBe(
    'aa939a761f410928b499b4f7a5fa056065e40c2b2b771be5a180bf40b559d81f'
  )
})
