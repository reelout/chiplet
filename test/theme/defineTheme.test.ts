import { defineTheme } from '#theme/defineTheme'
import { expect, expectTypeOf, test } from 'vitest'

test('defineTheme', () => {
  const source = {
    a1: 1,
    a1b: '1',
    a1Bc: 1,
    aBcDE: '1',
    b: {
      c: '2',
      d: { e: 3 },
    },
  } as const

  const theme = defineTheme(source)

  expect(theme).toEqual({
    a1: 'var(--a1)',
    a1b: 'var(--a1b)',
    a1Bc: 'var(--a1-bc)',
    aBcDE: 'var(--a-bc-de)',
    b: {
      c: 'var(--b-c)',
      d: { e: 'var(--b-d-e)' },
    },
  })

  expect(theme.$declaration).toEqual({
    '--a1': 1,
    '--a1b': '1',
    '--a1-bc': 1,
    '--a-bc-de': '1',
    '--b-c': '2',
    '--b-d-e': 3,
  })
})

test('defineTheme - TS', () => {
  const theme1 = defineTheme({
    a1: 1,
    a1b: '1',
    a1Bc: 1,
    aBcDE: '1',
    b: {
      c: '2',
      d: { e: 3 },
    },
  })

  expectTypeOf(theme1).toEqualTypeOf<{
    a1: 'var(--a1)'
    a1b: 'var(--a1b)'
    a1Bc: 'var(--a1-bc)'
    aBcDE: 'var(--a-bc-de)'
    b: {
      c: 'var(--b-c)'
      d: { e: 'var(--b-d-e)' }
    }
    readonly $declaration: {
      '--a1': number
      '--a1b': string
      '--a1-bc': number
      '--a-bc-de': string
      '--b-c': string
      '--b-d-e': number
    }
  }>()

  const theme2 = defineTheme({
    a: 1,
    b1Bb: '2',
    c2Cc: {
      d: 3,
      eFg: '4',
      f: { g: 5 },
    },
  })

  expectTypeOf(theme2).toEqualTypeOf<{
    a: 'var(--a)'
    b1Bb: 'var(--b1-bb)'
    c2Cc: {
      d: 'var(--c2-cc-d)'
      eFg: 'var(--c2-cc-e-fg)'
      f: { g: 'var(--c2-cc-f-g)' }
    }
    readonly $declaration: {
      '--a': number
      '--b1-bb': string
      '--c2-cc-d': number
      '--c2-cc-e-fg': string
      '--c2-cc-f-g': number
    }
  }>()
})
