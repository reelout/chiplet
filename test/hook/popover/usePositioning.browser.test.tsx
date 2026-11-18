import type { Position } from '#hook'
import { usePositioning, type PositioningOptions } from '#hook'
import { autoUpdate, computePosition, flip } from '@floating-ui/dom'
import { render } from '@testing-library/react'
import {
  createRef,
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from 'react'
import { beforeEach, expect, test, vi } from 'vitest'
import { page } from 'vitest/browser'

const act = await vi.hoisted(() => import('react').then((mod) => mod.act))

vi.mock(import('@floating-ui/dom'), async (importActual) => ({
  ...(await importActual()),
  autoUpdate: vi.fn((await importActual()).autoUpdate),
  computePosition: vi.fn((await importActual()).computePosition),
  flip: vi.fn((await importActual()).flip),
}))

vi.mock(import('react-dom'), async (importActual) => ({
  ...(await importActual()),
  flushSync: act,
}))

const anchorRef = createRef<HTMLElement>()
const positionedRef = createRef<HTMLElement>()
const arrowRef = createRef<HTMLElement>()
const result = createRef<ReturnType<typeof usePositioning>>()

beforeEach(async () => {
  await page.viewport(400, 400)

  vi.clearAllMocks()

  document.documentElement.dir = 'ltr'
  document.body.innerHTML = ''
  document.body.style.padding = '160px'
  document.body.style.margin = '0'
})

interface Props extends PositioningOptions {
  anchorRef?: RefObject<Element | null> | Element | null | undefined
  positionedRef?: RefObject<HTMLElement | null> | HTMLElement | null | undefined
  arrowRef?: RefObject<HTMLDivElement | null> | undefined
  anchorStyle?: React.CSSProperties | undefined
  positionedStyle?: React.CSSProperties | undefined
  arrowStyle?: React.CSSProperties | undefined
}

function Page({ anchorStyle, positionedStyle, arrowStyle, ...options }: Props) {
  const [, setAnchor] = useState<HTMLElement | null>(null)
  const [, setPositioned] = useState<HTMLElement | null>(null)

  const saveAnchorRef = useCallback((el: HTMLButtonElement) => {
    if (el) setAnchor((anchorRef.current = el))
  }, [])
  const savePositionedRef = useCallback((el: HTMLDivElement) => {
    if (el) setPositioned((positionedRef.current = el))
  }, [])

  const positioning = usePositioning({
    anchorRef,
    positionedRef,
    arrowRef,
    tryCrossAxis: true,
    offset: 0,
    ...options,
  })

  useEffect(() => {
    result.current = positioning
  })

  return (
    <div>
      <button
        data-testid='anchor'
        style={{
          inlineSize: 80,
          blockSize: 80,
          backgroundColor: 'yellow',
          ...positioning.anchorStyle,
          ...anchorStyle,
        }}
        ref={saveAnchorRef}
      >
        Anchor
      </button>
      <div
        data-testid='positioned'
        style={{
          inlineSize: 100,
          blockSize: 100,
          backgroundColor: 'red',
          ...positioning.positionedStyle,
          ...positionedStyle,
        }}
        ref={savePositionedRef}
      >
        <div>Positioned</div>
        {
          // The arrow element renders only when the test passes an
          // 'arrowRef'. Reading the ref from the rest-props object during
          // render is intentional test wiring: 'arrowRef' must stay inside
          // 'options' so it also reaches 'usePositioning' through the spread.
          // eslint-disable-next-line react-hooks/refs
          options.arrowRef && (
            <div
              data-testid='arrow'
              style={{
                position: 'absolute',
                inlineSize: 20,
                blockSize: 20,
                backgroundColor: 'blue',
                ...positioning.arrowStyle,
                ...arrowStyle,
              }}
              // The arrow ref is wired from the rest-props object for the
              // same reason as the guard above.
              // eslint-disable-next-line react-hooks/refs
              ref={options.arrowRef}
            />
          )
        }
      </div>
    </div>
  )
}

test('usePositioning - enabled', () => {
  render(<Page disabled={false} />)

  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '0px 0px',
      willChange: 'translate',
    },
  })

  expect(autoUpdate).toHaveBeenCalledTimes(1)
})

test('usePositioning - disabled', () => {
  render(<Page disabled={true} />)

  expect(result.current).toEqual({
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

  expect(autoUpdate).toHaveBeenCalledTimes(0)
})

test('usePositioning - no anchor element', () => {
  render(<Page anchorRef={null} />)

  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '0px 0px',
      willChange: 'translate',
    },
  })

  expect(autoUpdate).toHaveBeenCalledTimes(0)
})

test('usePositioning - no positioned element', () => {
  render(<Page positionedRef={null} />)

  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '0px 0px',
      willChange: 'translate',
    },
  })

  expect(autoUpdate).toHaveBeenCalledTimes(0)
})

test('usePositioning - auto update', async () => {
  render(<Page position='above' fallback={['below', 'after', 'before']} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'above',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'above',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '150px 60px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })

  {
    document.body.style.paddingTop = '80px'
    await page.viewport(400, 400 - 80)
    await vi.waitUntil(() => result.current?.position === 'below')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'below',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '150px 160px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '',
      'max-height': '',
    })
  }

  {
    document.body.style.paddingBottom = '80px'
    await page.viewport(400, 400 - 80 - 80)
    await vi.waitUntil(() => result.current?.position === 'after')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'after',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '240px 70px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '',
      'max-height': '',
    })
  }

  {
    document.body.style.paddingRight = '80px'
    await page.viewport(400 - 80, 400 - 80 - 80)
    await vi.waitUntil(() => result.current?.position === 'before')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'before',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '60px 70px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '',
      'max-height': '',
    })
  }

  {
    document.body.style.paddingLeft = '80px'
    await page.viewport(400 - 80 - 80, 400 - 80 - 80)
    await vi.waitUntil(() => result.current?.position === 'above')
    await vi.waitUntil(() => positionedRef.current?.style.maxHeight === '80px')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'above',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '70px 0px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '',
      'max-height': '80px',
    })
  }

  {
    document.body.style.paddingTop = '40px'
    await page.viewport(400 - 80 - 80, 400 - 80 - 80 - 40)
    await vi.waitUntil(() => result.current?.position === 'below')
    await vi.waitUntil(() => positionedRef.current?.style.maxHeight === '80px')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'below',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '70px 120px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '',
      'max-height': '80px',
    })
  }

  {
    document.body.style.paddingBottom = '40px'
    await page.viewport(400 - 80 - 80, 400 - 80 - 80 - 40 - 40)
    await vi.waitUntil(() => result.current?.position === 'after')
    await vi.waitUntil(() => positionedRef.current?.style.maxWidth === '80px')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'after',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '160px 30px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '80px',
      'max-height': '',
    })
  }

  {
    document.body.style.paddingRight = '40px'
    await page.viewport(400 - 80 - 80 - 40, 400 - 80 - 80 - 40 - 40)
    await vi.waitUntil(() => result.current?.position === 'before')
    await vi.waitUntil(() => positionedRef.current?.style.maxWidth === '80px')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'before',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '0px 30px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '80px',
      'max-height': '',
    })
  }

  {
    document.body.style.paddingLeft = '40px'
    await page.viewport(400 - 80 - 80 - 40 - 40, 400 - 80 - 80 - 40 - 40)
    await vi.waitUntil(() => result.current?.position === 'above')
    await vi.waitUntil(() => positionedRef.current?.style.maxHeight === '40px')

    expect(result.current).toEqual({
      options: {
        position: 'above',
        strategy: 'fixed',
      },
      isRTL: false,
      position: 'above',
      strategy: 'fixed',
      anchorStyle: undefined,
      positionedStyle: {
        position: 'fixed',
        top: 0,
        left: 0,
        translate: '30px 0px',
        willChange: 'translate',
      },
    })
    expect(positionedRef.current?.style).toMatchObject({
      'max-width': '',
      'max-height': '40px',
    })
  }
})

test('usePositioning - update as needed', async () => {
  let position: Position = 'below-start'
  let fallback: Position[] = ['above']

  const { rerender } = render(<Page position={position} fallback={fallback} />)

  expect(autoUpdate).toHaveBeenCalledTimes(1)

  position = 'below-end'
  rerender(<Page position={position} fallback={fallback} />)

  expect(autoUpdate).toHaveBeenCalledTimes(2)

  fallback = ['above']
  rerender(<Page position={position} fallback={fallback} />)

  expect(autoUpdate).toHaveBeenCalledTimes(2)

  fallback = ['above', 'after']
  rerender(<Page position={position} fallback={fallback} />)

  expect(autoUpdate).toHaveBeenCalledTimes(3)
})

test('usePositioning - cancel the last update', async () => {
  let position: Position = 'below-start'

  const { rerender } = render(<Page position={position} />)

  expect(autoUpdate).toHaveBeenCalledTimes(1)
  expect(computePosition).toHaveBeenCalledTimes(0)

  position = 'after-start'
  rerender(<Page position={position} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'after-start',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'after-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '240px 160px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })

  expect(autoUpdate).toHaveBeenCalledTimes(2)
  expect(computePosition).toHaveBeenCalled()
  expect(computePosition).not.toHaveBeenCalledWith(
    expect.any(HTMLElement),
    expect.any(HTMLElement),
    expect.objectContaining({ placement: 'below-start' })
  )
})

test('usePositioning - before updating', async () => {
  const throwIfAborted = vi.spyOn(AbortSignal.prototype, 'throwIfAborted')

  const { unmount } = render(<Page />)

  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '0px 0px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })

  unmount()

  await act(() => vi.waitFor(() => expect(throwIfAborted).toHaveBeenCalled()))

  expect(autoUpdate).toHaveBeenCalledTimes(1)
  expect(computePosition).toHaveBeenCalledTimes(0)
  expect(throwIfAborted).toHaveBeenCalledTimes(1)
  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '0px 0px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
})

test('usePositioning - after updating', async () => {
  const throwIfAborted = vi.spyOn(AbortSignal.prototype, 'throwIfAborted')

  const { unmount } = render(<Page />)

  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: undefined,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '0px 0px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })

  await act(() => vi.waitFor(() => expect(throwIfAborted).toHaveBeenCalled()))

  unmount()

  expect(autoUpdate).toHaveBeenCalledTimes(1)
  expect(computePosition).toHaveBeenCalled()
  expect(throwIfAborted).toHaveBeenCalled()
  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '150px 240px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
})

test('usePositioning - default', async () => {
  render(
    <Page
      disabled={undefined}
      position={undefined}
      fallback={undefined}
      tryCrossAxis={undefined}
      strategy={undefined}
      offset={undefined}
      align={undefined}
    />
  )

  await act(() => {})

  expect(autoUpdate).toHaveBeenCalledTimes(1)
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({
      placement: 'bottom',
      strategy: 'fixed',
      middleware: [
        expect.objectContaining({
          name: 'inline',
          options: { padding: 0 },
        }),
        expect.objectContaining({
          name: 'offset',
          options: { mainAxis: 8 },
        }),
        expect.objectContaining({
          name: 'flip',
          options: { fallbackPlacements: ['top'] },
        }),
        expect.objectContaining({
          name: 'shift',
          options: { crossAxis: false, padding: 8 },
        }),
        expect.objectContaining({
          name: 'size',
          options: { padding: 8, apply: expect.any(Function) },
        }),
      ],
    })
  )
  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '150px 248px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
})

test('usePositioning - above', async () => {
  render(<Page position='above' offset={0} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'above',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'above',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '150px 60px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'top' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['bottom', 'right', 'left'],
    })
  )
})

test('usePositioning - above-start', async () => {
  render(<Page position='above-start' offset={4} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'above-start',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'above-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '160px 56px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'top-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'top-end',
        'bottom-start',
        'bottom-end',
        'right-start',
        'left-start',
        'right-end',
        'left-end',
      ],
    })
  )
})

test('usePositioning - above-end', async () => {
  render(<Page position='above-end' offset={8} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'above-end',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'above-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '140px 52px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'top-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'top-start',
        'bottom-end',
        'bottom-start',
        'right-end',
        'left-end',
        'right-start',
        'left-start',
      ],
    })
  )
})

test('usePositioning - below', async () => {
  render(<Page position='below' offset={8} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '150px 248px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'bottom' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['top', 'right', 'left'],
    })
  )
})

test('usePositioning - below-start', async () => {
  render(<Page position='below-start' offset={0} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'below-start',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'below-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '160px 240px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'bottom-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'bottom-end',
        'top-start',
        'top-end',
        'right-start',
        'left-start',
        'right-end',
        'left-end',
      ],
    })
  )
})

test('usePositioning - below-end', async () => {
  render(<Page position='below-end' offset={4} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'below-end',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'below-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '140px 244px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'bottom-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'bottom-start',
        'top-end',
        'top-start',
        'right-end',
        'left-end',
        'right-start',
        'left-start',
      ],
    })
  )
})

test('usePositioning - before', async () => {
  render(<Page position='before' offset={4} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'before',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'before',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '56px 150px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'left' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['right', 'bottom', 'top'],
    })
  )
})

test('usePositioning - before-start', async () => {
  render(<Page position='before-start' offset={8} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'before-start',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'before-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '52px 160px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'left-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'left-end',
        'right-start',
        'right-end',
        'bottom-start',
        'top-start',
        'bottom-end',
        'top-end',
      ],
    })
  )
})

test('usePositioning - before-end', async () => {
  render(<Page position='before-end' offset={0} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'before-end',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'before-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '60px 140px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'left-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'left-start',
        'right-end',
        'right-start',
        'bottom-end',
        'top-end',
        'bottom-start',
        'top-start',
      ],
    })
  )
})

test('usePositioning - after', async () => {
  render(<Page position='after' offset={8} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'after',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'after',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '248px 150px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'right' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['left', 'bottom', 'top'],
    })
  )
})

test('usePositioning - after-start', async () => {
  render(<Page position='after-start' offset={4} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'after-start',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'after-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '244px 160px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'right-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'right-end',
        'left-start',
        'left-end',
        'bottom-start',
        'top-start',
        'bottom-end',
        'top-end',
      ],
    })
  )
})

test('usePositioning - after-end', async () => {
  render(<Page position='after-end' offset={0} />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'after-end',
      strategy: 'fixed',
    },
    isRTL: false,
    position: 'after-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '240px 140px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'right-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'right-start',
        'left-end',
        'left-start',
        'bottom-end',
        'top-end',
        'bottom-start',
        'top-start',
      ],
    })
  )
})

test('usePositioning - above - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='above' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'above',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'above',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '150px 60px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'top' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['bottom', 'left', 'right'],
    })
  )
})

test('usePositioning - above-start - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='above-start' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'above-start',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'above-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '140px 60px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'top-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'top-end',
        'bottom-start',
        'bottom-end',
        'left-start',
        'right-start',
        'left-end',
        'right-end',
      ],
    })
  )
})

test('usePositioning - above-end - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='above-end' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'above-end',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'above-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '160px 60px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'top-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'top-start',
        'bottom-end',
        'bottom-start',
        'left-end',
        'right-end',
        'left-start',
        'right-start',
      ],
    })
  )
})

test('usePositioning - below - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='below' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'below',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'below',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '150px 240px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'bottom' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['top', 'left', 'right'],
    })
  )
})

test('usePositioning - below-start - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='below-start' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'below-start',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'below-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '140px 240px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'bottom-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'bottom-end',
        'top-start',
        'top-end',
        'left-start',
        'right-start',
        'left-end',
        'right-end',
      ],
    })
  )
})

test('usePositioning - below-end - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='below-end' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'below-end',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'below-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '160px 240px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'bottom-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'bottom-start',
        'top-end',
        'top-start',
        'left-end',
        'right-end',
        'left-start',
        'right-start',
      ],
    })
  )
})

test('usePositioning - before - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='before' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'before',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'before',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '240px 150px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'right' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['left', 'bottom', 'top'],
    })
  )
})

test('usePositioning - before-start - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='before-start' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'before-start',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'before-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '240px 160px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'right-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'right-end',
        'left-start',
        'left-end',
        'bottom-start',
        'top-start',
        'bottom-end',
        'top-end',
      ],
    })
  )
})

test('usePositioning - before-end - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='before-end' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'before-end',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'before-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '240px 140px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'right-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'right-start',
        'left-end',
        'left-start',
        'bottom-end',
        'top-end',
        'bottom-start',
        'top-start',
      ],
    })
  )
})

test('usePositioning - after - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='after' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'after',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'after',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '60px 150px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'left' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: ['right', 'bottom', 'top'],
    })
  )
})

test('usePositioning - after-start - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='after-start' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'after-start',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'after-start',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '60px 160px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'left-start' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'left-end',
        'right-start',
        'right-end',
        'bottom-start',
        'top-start',
        'bottom-end',
        'top-end',
      ],
    })
  )
})

test('usePositioning - after-end - RTL', async () => {
  document.documentElement.dir = 'rtl'

  render(<Page position='after-end' />)

  await act(() => {})

  expect(result.current).toEqual({
    options: {
      position: 'after-end',
      strategy: 'fixed',
    },
    isRTL: true,
    position: 'after-end',
    strategy: 'fixed',
    anchorStyle: undefined,
    positionedStyle: {
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '60px 140px',
      willChange: 'translate',
    },
  })
  expect(positionedRef.current?.style).toMatchObject({
    'max-width': '',
    'max-height': '',
  })
  expect(computePosition).toHaveBeenCalledWith(
    anchorRef.current,
    positionedRef.current,
    expect.objectContaining({ placement: 'left-end' })
  )
  expect(flip).toHaveBeenCalledWith(
    expect.objectContaining({
      fallbackPlacements: [
        'left-start',
        'right-end',
        'right-start',
        'bottom-end',
        'top-end',
        'bottom-start',
        'top-start',
      ],
    })
  )
})

test('usePositioning - fallback', async () => {
  const position = 'above'
  let fallback: Position | readonly Position[] | undefined = undefined

  const { rerender } = render(<Page position={position} fallback={fallback} />)

  {
    vi.clearAllMocks()

    fallback = 'below-start'

    await act(() => rerender(<Page position={position} fallback={fallback} />))

    expect(flip).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackPlacements: ['bottom-start'],
      })
    )
  }

  {
    vi.clearAllMocks()

    fallback = ['above-end', 'after-start']

    await act(() => rerender(<Page position={position} fallback={fallback} />))

    expect(flip).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackPlacements: ['top-end', 'right-start'],
      })
    )
  }

  {
    vi.clearAllMocks()

    fallback = undefined

    await act(() => rerender(<Page position={position} fallback={fallback} />))

    expect(flip).toHaveBeenCalledWith(
      expect.objectContaining({
        fallbackPlacements: ['bottom', 'right', 'left'],
      })
    )
  }
})

test('usePositioning - align - #1', async () => {
  const { rerender } = render(null)

  {
    vi.clearAllMocks()

    rerender(
      <Page
        position='below-start'
        align={true}
        anchorStyle={{ inlineSize: 60, blockSize: 80 }}
        positionedStyle={{ inlineSize: 100, blockSize: 100 }}
      />
    )

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.style).toMatchObject({
      'min-width': '60px',
      'min-height': '',
    })
    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160 + 80,
      left: 160,
      width: 100,
      height: 100,
    })
  }

  {
    vi.clearAllMocks()

    rerender(
      <Page
        position='above-start'
        align={true}
        anchorStyle={{ inlineSize: 70, blockSize: 80 }}
        positionedStyle={{ inlineSize: 60, blockSize: 100 }}
      />
    )

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.style).toMatchObject({
      'min-width': '70px',
      'min-height': '',
    })
    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160 - 100,
      left: 160,
      width: 70,
      height: 100,
    })
  }

  {
    vi.clearAllMocks()

    rerender(
      <Page
        position='after-start'
        align={true}
        anchorStyle={{ inlineSize: 80, blockSize: 70 }}
        positionedStyle={{ inlineSize: 100, blockSize: 100 }}
      />
    )

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.style).toMatchObject({
      'min-width': '',
      'min-height': '70px',
    })
    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160,
      left: 160 + 80,
      width: 100,
      height: 100,
    })
  }

  {
    vi.clearAllMocks()

    rerender(
      <Page
        position='before-start'
        align={true}
        anchorStyle={{ inlineSize: 80, blockSize: 60 }}
        positionedStyle={{ inlineSize: 100, blockSize: 50 }}
      />
    )

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.style).toMatchObject({
      'min-width': '',
      'min-height': '60px',
    })
    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160,
      left: 160 - 100,
      width: 100,
      height: 60,
    })
  }
})

test('usePositioning - align - #2', async () => {
  document.body.style.margin = '0'
  document.body.style.padding = '0'

  render(
    <Page
      position='below-start'
      offset={20}
      align={true}
      anchorStyle={{ inlineSize: 500, blockSize: 80 }}
      positionedStyle={{ inlineSize: 100, blockSize: 100 }}
    />
  )

  await act(() => {})

  expect(positionedRef.current?.style).toMatchObject({
    'min-width': '360px',
    'min-height': '',
  })
  expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
    top: 80 + 20,
    left: 20,
    width: 360,
    height: 100,
  })
})

test('usePositioning - align - #3', async () => {
  document.body.style.margin = '0'
  document.body.style.padding = '0'

  render(
    <Page
      position='after-start'
      offset={20}
      align={true}
      anchorStyle={{ inlineSize: 80, blockSize: 600 }}
      positionedStyle={{ inlineSize: 100, blockSize: 100 }}
    />
  )

  await act(() => {})

  expect(positionedRef.current?.style).toMatchObject({
    'min-width': '',
    'min-height': '360px',
  })
  expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
    top: 20,
    left: 80 + 20,
    width: 100,
    height: 360,
  })
})

test('usePositioning - arrow', async () => {
  const arrowRef = createRef<HTMLDivElement>()

  const { rerender } = render(null)

  {
    vi.clearAllMocks()

    rerender(<Page position='above' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 60,
      left: 150,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='above-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 60,
      left: 160,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='above-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 60,
      left: 140,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='below' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 150,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='below-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 160,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='below-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 140,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='before' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 150,
      left: 60,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 140,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='before-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160,
      left: 60,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 140,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='before-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 60,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 140,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='after' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 150,
      left: 240,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 240,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='after-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160,
      left: 240,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 240,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='after-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 240,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 240,
      width: 20,
      height: 20,
    })
  }
})

test('usePositioning - arrow - RTL', async () => {
  document.documentElement.dir = 'rtl'

  const arrowRef = createRef<HTMLDivElement>()

  const { rerender } = render(null)

  {
    vi.clearAllMocks()

    rerender(<Page position='above' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 60,
      left: 150,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='above-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 60,
      left: 140,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='above-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 60,
      left: 160,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='below' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 150,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='below-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 140,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='below-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 160,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 240,
      left: 190,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='before' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 150,
      left: 240,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 240,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='before-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160,
      left: 240,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 240,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='before-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 240,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 240,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='after' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 150,
      left: 60,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 140,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='after-start' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 160,
      left: 60,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 140,
      width: 20,
      height: 20,
    })
  }

  {
    vi.clearAllMocks()

    rerender(<Page position='after-end' arrowRef={arrowRef} />)

    await vi.waitFor(() => expect(computePosition).toHaveBeenCalled())

    expect(positionedRef.current?.getBoundingClientRect()).toMatchObject({
      top: 140,
      left: 60,
      width: 100,
      height: 100,
    })
    expect(arrowRef.current?.getBoundingClientRect()).toMatchObject({
      top: 190,
      left: 140,
      width: 20,
      height: 20,
    })
  }
})
