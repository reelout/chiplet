import { UUID } from '#util'
import { expect, test } from 'vitest'

test('UUID', () => {
  expect(UUID()).toMatch(
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
  )
})
