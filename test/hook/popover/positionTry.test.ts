import { positionTry } from '#hook'
import { expect, test } from 'vitest'

test('positionTry - true', () => {
  for (const [position, fallback] of [
    ['above', ['below', 'after', 'before']],
    ['below', ['above', 'after', 'before']],
    ['before', ['after', 'below', 'above']],
    ['after', ['before', 'below', 'above']],
    [
      'above-start',
      [
        'above-end',
        'below-start',
        'below-end',
        'after-start',
        'before-start',
        'after-end',
        'before-end',
      ],
    ],
    [
      'above-end',
      [
        'above-start',
        'below-end',
        'below-start',
        'after-end',
        'before-end',
        'after-start',
        'before-start',
      ],
    ],
    [
      'below-start',
      [
        'below-end',
        'above-start',
        'above-end',
        'after-start',
        'before-start',
        'after-end',
        'before-end',
      ],
    ],
    [
      'below-end',
      [
        'below-start',
        'above-end',
        'above-start',
        'after-end',
        'before-end',
        'after-start',
        'before-start',
      ],
    ],
    [
      'before-start',
      [
        'before-end',
        'after-start',
        'after-end',
        'below-start',
        'above-start',
        'below-end',
        'above-end',
      ],
    ],
    [
      'before-end',
      [
        'before-start',
        'after-end',
        'after-start',
        'below-end',
        'above-end',
        'below-start',
        'above-start',
      ],
    ],
    [
      'after-start',
      [
        'after-end',
        'before-start',
        'before-end',
        'below-start',
        'above-start',
        'below-end',
        'above-end',
      ],
    ],
    [
      'after-end',
      [
        'after-start',
        'before-end',
        'before-start',
        'below-end',
        'above-end',
        'below-start',
        'above-start',
      ],
    ],
  ] as const) {
    expect([position, positionTry(position, true)]).toEqual([
      position,
      fallback,
    ])
  }
})

test('positionTry - false', () => {
  for (const [position, fallback] of [
    ['above', ['below']],
    ['below', ['above']],
    ['before', ['after']],
    ['after', ['before']],
    ['above-start', ['above-end', 'below-start', 'below-end']],
    ['above-end', ['above-start', 'below-end', 'below-start']],
    ['below-start', ['below-end', 'above-start', 'above-end']],
    ['below-end', ['below-start', 'above-end', 'above-start']],
    ['before-start', ['before-end', 'after-start', 'after-end']],
    ['before-end', ['before-start', 'after-end', 'after-start']],
    ['after-start', ['after-end', 'before-start', 'before-end']],
    ['after-end', ['after-start', 'before-end', 'before-start']],
  ] as const) {
    expect([position, positionTry(position, false)]).toEqual([
      position,
      fallback,
    ])
  }
})
