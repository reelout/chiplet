import type { Position, PositioningOptions } from '#hook'
import { isAnchorPositioningSupported, useAnchorPositioning } from '#hook'
import {
  PositionOffset,
  positionTryOptionMap,
} from '#hook/popover/style/positioning.css'
import { render } from '@testing-library/react'
import { act, useCallback, useEffect, useState } from 'react'
import { assert, beforeEach, expect, test } from 'vitest'
import { page, server } from 'vitest/browser'

let container: HTMLElement | null
let anchor: HTMLElement | null
let positioned: HTMLElement | null
let result: ReturnType<typeof useAnchorPositioning> | undefined

beforeEach(async () => {
  await page.viewport(500, 500)

  document.body.innerHTML = ''
  document.body.style.padding = '0'
  document.body.style.margin = '0'
})

function Page({
  containerStyle,
  anchorStyle,
  positionedStyle,
  ...options
}: PositioningOptions & {
  containerStyle?: React.CSSProperties | undefined
  anchorStyle?: React.CSSProperties | undefined
  positionedStyle?: React.CSSProperties | undefined
}) {
  const [, setContainer] = useState<HTMLElement | null>(null)
  const [, setAnchor] = useState<HTMLElement | null>(null)
  const [, setPositioned] = useState<HTMLElement | null>(null)

  const saveContainer = useCallback((el: HTMLElement | null) => {
    setContainer((container = el))
  }, [])
  const saveAnchor = useCallback((el: HTMLElement | null) => {
    setAnchor((anchor = el))
  }, [])
  const savePositioned = useCallback((el: HTMLElement | null) => {
    setPositioned((positioned = el))
  }, [])

  const positioning = useAnchorPositioning(options)

  useEffect(() => {
    result = positioning
  })

  return (
    <div
      ref={saveContainer}
      style={{
        margin: 0,
        padding: 200,
        boxSizing: 'border-box',
        inlineSize: '100%',
        blockSize: '100%',
        overflow: 'clip',
        backgroundColor: '#8888',
        ...containerStyle,
      }}
    >
      <div
        ref={saveAnchor}
        style={{
          margin: 0,
          padding: 0,
          inlineSize: 100,
          blockSize: 100,
          backgroundColor: 'yellow',
          ...anchorStyle,
          ...positioning.anchorStyle,
        }}
      >
        Anchor
      </div>
      <div
        ref={savePositioned}
        style={{
          margin: 0,
          padding: 0,
          inlineSize: 180,
          blockSize: 80,
          backgroundColor: 'red',
          ...positionedStyle,
          ...positioning.positionedStyle,
        }}
      >
        Positioned
      </div>
    </div>
  )
}

test('isAnchorPositioningSupported', () => {
  expect(isAnchorPositioningSupported).toBe(true)
})

test('useAnchorPositioning - auto update', async () => {
  const { rerender } = render(<Page />)

  assert(container)
  assert(anchor)
  assert(positioned)

  {
    await act(() =>
      rerender(
        <Page
          key={1}
          position='above'
          tryCrossAxis={true}
          containerStyle={{ padding: 200 }}
        />
      )
    )

    expect(positioned.getBoundingClientRect()).toMatchObject({
      'width': 180,
      'height': 80,
      'top': 200 - 80 - 8,
      'left': 160,
    })
  }

  {
    await page.viewport(500, 500 - 160)
    await act(() =>
      rerender(
        <Page
          key={2}
          position='above'
          tryCrossAxis={true}
          containerStyle={{ padding: '40px 200px 200px 200px' }}
        />
      )
    )

    expect(positioned.getBoundingClientRect()).toMatchObject({
      'width': 180,
      'height': 80,
      'top': 40 + 100 + 8,
      'left': 160,
    })
  }

  {
    await page.viewport(500, 500 - 160 - 160)
    await act(() =>
      rerender(
        <Page
          key={3}
          position='above'
          tryCrossAxis={true}
          containerStyle={{ padding: '40px 200px 40px 200px' }}
        />
      )
    )

    expect(positioned.getBoundingClientRect()).toMatchObject({
      'width': 180,
      'height': 80,
      'top': 50,
      'left': 200 + 100 + 8,
    })
  }

  {
    await page.viewport(500 - 80, 500 - 160 - 160)
    await act(() =>
      rerender(
        <Page
          key={4}
          position='above'
          tryCrossAxis={true}
          containerStyle={{ padding: '40px 120px 40px 200px' }}
        />
      )
    )

    expect(positioned.getBoundingClientRect()).toMatchObject({
      'width': 180,
      'height': 80,
      'top': 50,
      'left': 200 - 180 - 8,
    })
  }

  {
    await page.viewport(500 - 80 - 80, 500 - 160 - 160)
    await act(() =>
      rerender(
        <Page
          key={5}
          position='above'
          tryCrossAxis={true}
          containerStyle={{ padding: '40px 120px 40px 120px' }}
        />
      )
    )

    expect(positioned.getBoundingClientRect()).toMatchObject({
      'width': 180,
      'height': 80,
      // When no @position-try fallback fits, Chromium and WebKit keep the
      // original styles, so the 8px offset pushes the element above the
      // containing block (top = 40 - 8 - 80 = -48); Firefox instead places
      // it at the top edge of the containing block (top = 0).
      // https://developer.mozilla.org/en-US/docs/Web/CSS/position-try
      'top': server.browser === 'firefox' ? 0 : 40 - 8 - 80,
      'left': 80,
    })
  }
})

test('useAnchorPositioning - disabled', () => {
  render(<Page disabled={true} />)

  expect(result).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: undefined,
  })
})

test('useAnchorPositioning - default', () => {
  render(<Page />)

  expect(result).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: {
      'anchorName': expect.stringMatching(/^--anchor-/),
    },
    positionedStyle: {
      [PositionOffset]: '8px',
      'position': 'fixed',
      'positionAnchor': result?.anchorStyle?.anchorName,
      'positionArea': 'block-end',
      'positionTry': positionTryOptionMap['above'],
      'margin': '0',
      'inset': 'auto',
      'insetBlockStart': `var(${PositionOffset})`,
    },
  })
})

test('useAnchorPositioning - above', () => {
  const { rerender } = render(<Page position='above' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 120 - 8,
    'left': 160,
  })

  rerender(<Page position='above-start' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 120 - 8,
    'left': 200,
  })

  rerender(<Page position='above-end' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 120 - 8,
    'left': 120,
  })
})

test('useAnchorPositioning - below', () => {
  const { rerender } = render(<Page position='below' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 300 + 8,
    'left': 160,
  })

  rerender(<Page position='below-start' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 300 + 8,
    'left': 200,
  })

  rerender(<Page position='below-end' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 300 + 8,
    'left': 120,
  })
})

test('useAnchorPositioning - before', () => {
  const { rerender } = render(<Page position='before' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 210,
    'left': 20 - 8,
  })

  rerender(<Page position='before-start' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 200,
    'left': 20 - 8,
  })

  rerender(<Page position='before-end' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 220,
    'left': 20 - 8,
  })
})

test('useAnchorPositioning - after', () => {
  const { rerender } = render(<Page position='after' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 210,
    'left': 300 + 8,
  })

  rerender(<Page position='after-start' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 200,
    'left': 300 + 8,
  })

  rerender(<Page position='after-end' />)

  expect(positioned?.getBoundingClientRect()).toMatchObject({
    'width': 180,
    'height': 80,
    'top': 220,
    'left': 300 + 8,
  })
})

test('useAnchorPositioning - fallback - #1', () => {
  const { rerender } = render(null)

  for (const [position, fallback, tryCrossAxis, positionTry] of [
    ['above', undefined, false, ['below']],
    [
      'above-end',
      undefined,
      false,
      ['above-start', 'below-end', 'below-start'],
    ],

    ['above', undefined, true, ['below', 'after', 'before']],
    [
      'above-end',
      undefined,
      true,
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

    ['above', 'below-start', false, ['below-start']],
    ['above-end', 'below-start', false, ['below-start']],
    ['above', 'below-start', true, ['below-start']],
    ['above-end', 'below-start', true, ['below-start']],

    ['above', ['below-start', 'below'], false, ['below-start', 'below']],
    ['above-end', ['below-start', 'below'], false, ['below-start', 'below']],
    ['above', ['below-start', 'below'], true, ['below-start', 'below']],
    ['above-end', ['below-start', 'below'], true, ['below-start', 'below']],
  ] as const) {
    rerender(
      <Page
        position={position}
        fallback={fallback}
        tryCrossAxis={tryCrossAxis}
      />
    )

    expect(result?.positionedStyle?.positionTry).toBe(
      positionTry.map((position) => positionTryOptionMap[position]).join(', ')
    )
  }
})

test('useAnchorPositioning - fallback - #2', () => {
  const { rerender } = render(<Page />)

  const expectTry = (options: Position[]) =>
    options.map((position) => positionTryOptionMap[position]).join(', ')

  {
    rerender(<Page position='above' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry(['below', 'after', 'before'])
    )

    rerender(<Page position='below' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry(['above', 'after', 'before'])
    )

    rerender(<Page position='before' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry(['after', 'below', 'above'])
    )

    rerender(<Page position='after' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry(['before', 'below', 'above'])
    )
  }

  {
    rerender(<Page position='above-start' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'above-end',
        'below-start',
        'below-end',
        'after-start',
        'before-start',
        'after-end',
        'before-end',
      ])
    )

    rerender(<Page position='above-end' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'above-start',
        'below-end',
        'below-start',
        'after-end',
        'before-end',
        'after-start',
        'before-start',
      ])
    )

    rerender(<Page position='below-start' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'below-end',
        'above-start',
        'above-end',
        'after-start',
        'before-start',
        'after-end',
        'before-end',
      ])
    )

    rerender(<Page position='below-end' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'below-start',
        'above-end',
        'above-start',
        'after-end',
        'before-end',
        'after-start',
        'before-start',
      ])
    )
  }

  {
    rerender(<Page position='before-start' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'before-end',
        'after-start',
        'after-end',
        'below-start',
        'above-start',
        'below-end',
        'above-end',
      ])
    )

    rerender(<Page position='before-end' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'before-start',
        'after-end',
        'after-start',
        'below-end',
        'above-end',
        'below-start',
        'above-start',
      ])
    )

    rerender(<Page position='after-start' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'after-end',
        'before-start',
        'before-end',
        'below-start',
        'above-start',
        'below-end',
        'above-end',
      ])
    )

    rerender(<Page position='after-end' tryCrossAxis={true} />)
    expect(result?.positionedStyle?.positionTry).toBe(
      expectTry([
        'after-start',
        'before-end',
        'before-start',
        'below-end',
        'above-end',
        'below-start',
        'above-start',
      ])
    )
  }
})

test('useAnchorPositioning - strategy', () => {
  const { rerender } = render(<Page strategy={undefined} />)

  expect(result?.positionedStyle?.position).toBe('fixed')

  rerender(<Page strategy='absolute' />)

  expect(result?.positionedStyle?.position).toBe('absolute')

  rerender(<Page strategy='fixed' />)

  expect(result?.positionedStyle?.position).toBe('fixed')
})

test('useAnchorPositioning - offset', () => {
  const { rerender } = render(null)

  {
    rerender(<Page position='above' offset={undefined} />)

    expect(positioned).toHaveStyle({
      'insetBlockStart': '0px',
      'insetBlockEnd': '8px',
      'insetInlineStart': '0px',
      'insetInlineEnd': '0px',
    })

    rerender(<Page position='above' offset={0} />)

    expect(positioned).toHaveStyle({
      'insetBlockStart': '0px',
      'insetBlockEnd': '0px',
      'insetInlineStart': '0px',
      'insetInlineEnd': '0px',
    })

    rerender(<Page position='above' offset={12} />)

    expect(positioned).toHaveStyle({
      'insetBlockStart': '0px',
      'insetBlockEnd': '12px',
      'insetInlineStart': '0px',
      'insetInlineEnd': '0px',
    })
  }

  {
    rerender(<Page position='after' offset={undefined} />)

    expect(positioned).toHaveStyle({
      'insetBlockStart': '0px',
      'insetBlockEnd': '0px',
      'insetInlineStart': '8px',
      'insetInlineEnd': '0px',
    })

    rerender(<Page position='after' offset={0} />)

    expect(positioned).toHaveStyle({
      'insetBlockStart': '0px',
      'insetBlockEnd': '0px',
      'insetInlineStart': '0px',
      'insetInlineEnd': '0px',
    })

    rerender(<Page position='after' offset={20} />)

    expect(positioned).toHaveStyle({
      'insetBlockStart': '0px',
      'insetBlockEnd': '0px',
      'insetInlineStart': '20px',
      'insetInlineEnd': '0px',
    })
  }
})

test('useAnchorPositioning - align - #1', () => {
  const { rerender } = render(null)

  rerender(<Page position='above' align={true} />)

  expect(result?.positionedStyle?.minInlineSize).toBe(
    'min(100vi, 100%, anchor-size(self-inline))'
  )

  rerender(<Page position='below-end' align={true} />)

  expect(result?.positionedStyle?.minInlineSize).toBe(
    'min(100vi, 100%, anchor-size(self-inline))'
  )

  rerender(<Page position='before' align={true} />)

  expect(result?.positionedStyle?.minBlockSize).toBe(
    'min(100vb, 100%, anchor-size(self-block))'
  )

  rerender(<Page position='after-start' align={true} />)

  expect(result?.positionedStyle?.minBlockSize).toBe(
    'min(100vb, 100%, anchor-size(self-block))'
  )
})

test('useAnchorPositioning - align - #2', async () => {
  const { rerender } = render(<Page />)

  assert(container)
  assert(anchor)
  assert(positioned)

  await act(() =>
    rerender(
      <Page
        position='below-start'
        align={true}
        anchorStyle={{ inlineSize: 80, blockSize: 80 }}
        positionedStyle={{ inlineSize: 50, blockSize: 100 }}
      />
    )
  )

  expect(positioned.getBoundingClientRect()).toMatchObject({
    width: 80,
    height: 100,
    top: 200 + 80 + 8,
    left: 200,
  })

  await act(() =>
    rerender(
      <Page
        position='below-start'
        align={true}
        anchorStyle={{ inlineSize: 80, blockSize: 80 }}
        positionedStyle={{ inlineSize: 100, blockSize: 100 }}
      />
    )
  )

  expect(positioned.getBoundingClientRect()).toMatchObject({
    width: 100,
    height: 100,
    top: 200 + 80 + 8,
    left: 200,
  })

  await act(() =>
    rerender(
      <Page
        position='after-start'
        align={true}
        anchorStyle={{ inlineSize: 80, blockSize: 80 }}
        positionedStyle={{ inlineSize: 110, blockSize: 60 }}
      />
    )
  )

  expect(positioned.getBoundingClientRect()).toMatchObject({
    width: 110,
    height: 80,
    top: 200,
    left: 200 + 80 + 8,
  })

  await act(() =>
    rerender(
      <Page
        position='after-start'
        align={true}
        anchorStyle={{ inlineSize: 80, blockSize: 80 }}
        positionedStyle={{ inlineSize: 110, blockSize: 110 }}
      />
    )
  )

  expect(positioned.getBoundingClientRect()).toMatchObject({
    width: 110,
    height: 110,
    top: 200,
    left: 200 + 80 + 8,
  })
})

test('useAnchorPositioning - align - #3', async () => {
  const { rerender } = render(<Page />)

  assert(container)
  assert(anchor)
  assert(positioned)

  await act(() =>
    rerender(
      <Page
        position='below-start'
        align={true}
        anchorStyle={{ inlineSize: 600, blockSize: 80 }}
        positionedStyle={{ inlineSize: 100, blockSize: 100 }}
      />
    )
  )

  expect(positioned.getBoundingClientRect()).toMatchObject({
    width: 500, // TODO: expect 300 = 500 - 200
    height: 100,
    top: 200 + 80 + 8,
    left: 200,
  })

  await act(() =>
    rerender(
      <Page
        position='after-start'
        align={true}
        anchorStyle={{ inlineSize: 80, blockSize: 600 }}
        positionedStyle={{ inlineSize: 110, blockSize: 110 }}
      />
    )
  )

  expect(positioned.getBoundingClientRect()).toMatchObject({
    width: 110,
    height: 500,
    top: 200,
    left: 200 + 80 + 8,
  })
})
