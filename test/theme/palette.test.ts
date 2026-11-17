import {
  complement,
  contrastColor,
  contrastRatio,
  mix,
  opacity,
  rgbaToRgb,
  shade,
  tint,
  tone,
} from '#theme'
import { expect, expectTypeOf, test } from 'vitest'

test('contrastColor', () => {
  expect(contrastColor('#000000', [])).toBe('#FFFFFF')
  expect(contrastColor('#FFFFFF', [])).toBe('#000000')
  expect(contrastColor('#FFFFFF', ['#3364E8'])).toBe('#3364E8')
  expect(contrastColor('#FFFFFF', ['#3364E8'], 5)).toBe('#3364E8')
  expect(contrastColor('#FFFFFF', ['#3364E8'], 6)).toBe('#000000')
  expect(contrastColor('#FFFFFF', ['#3364E8', '#404404'], 6)).toBe('#404404')
  expect(contrastColor('#FFFFFF', ['#3364E8', '#404404'], 12)).toBe('#000000')
})

test('contrastRatio', () => {
  expect(contrastRatio('#3364E8', '#FFFFFF')).toBeCloseTo(5.08, 1.7)
  expect(contrastRatio('#3364E8', '#000000')).toBeCloseTo(4.12, 1.7)
})

test('rgbaToRgb', () => {
  for (const [foreground, background, expected] of [
    ['#808ABC', '#806080', '#808ABC'],
    ['#808ABC00', '#806080', '#806080'],
    ['#808ABC80', '#806080', '#80759E'],
  ] as const) {
    expect(rgbaToRgb(foreground, background)).toBe(expected.toLowerCase())
    expect(rgbaToRgb(foreground.toLowerCase(), background.toLowerCase())).toBe(
      expected.toLowerCase()
    )
  }
})

test('mix', () => {
  const color1 = '#808ABC'
  const color2 = '#806080'
  const expected = 'color-mix(in oklch, #808ABC, #806080)' as const

  expect(mix(color1, color2)).toBe(expected)
  expectTypeOf(mix(color1, color2)).toEqualTypeOf(expected)
})

test('relative color', () => {
  const base = '#3364E8'

  for (const [color, percent, expected] of [
    [
      base,
      20,
      [
        'color-mix(in oklch, #3364E8, white 20%)',
        'color-mix(in oklch, #3364E8, black 20%)',
        'color-mix(in oklch, #3364E8, gray 20%)',
        'color-mix(in oklch, #3364E8 20%, transparent)',
      ],
    ],
  ] as const) {
    expect(tint(color, percent)).toBe(expected[0])
    expect(shade(color, percent)).toBe(expected[1])
    expect(tone(color, percent)).toBe(expected[2])
    expect(opacity(color, percent)).toBe(expected[3])

    expectTypeOf(tint(color, percent)).toEqualTypeOf(expected[0])
    expectTypeOf(shade(color, percent)).toEqualTypeOf(expected[1])
    expectTypeOf(tone(color, percent)).toEqualTypeOf(expected[2])
    expectTypeOf(opacity(color, percent)).toEqualTypeOf(expected[3])
  }

  for (const [color, expected] of [
    [base, 'hsl(from #3364E8 calc(h + 180) s l)'],
  ] as const) {
    expect(complement(color)).toBe(expected)
    expectTypeOf(complement(color)).toEqualTypeOf(expected)
  }
})
