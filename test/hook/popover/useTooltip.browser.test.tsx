import type {
  Overlay,
  OverlayAnchorProps,
  PositioningOptions,
  TooltipOptions,
} from '#hook'
import { useTooltip } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { fireEvent, render, renderHook } from '@testing-library/react'
import {
  act,
  createRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
  type Ref,
  type RefObject,
} from 'react'
import type { Mock, MockInstance } from 'vitest'
import {
  afterEach,
  assert,
  beforeAll,
  beforeEach,
  expect,
  test,
  vi,
} from 'vitest'
import { page } from 'vitest/browser'

vi.mock(import('#hook/popover/usePositioning'), async (importOriginal) => {
  const { usePositioning } = await importOriginal()

  return {
    usePositioning: vi.fn<typeof usePositioning>((props) => {
      if ((props as { __actual__?: boolean }).__actual__) {
        return usePositioning(props)
      }

      return {
        options: {
          position: props.position ?? 'below',
          strategy: 'fixed',
        },
        isRTL: undefined,
        position: props.position ?? 'below',
        strategy: 'fixed',
        anchorStyle: undefined,
        positionedStyle: undefined,
      }
    }),
  }
})

function toOverlay({
  anchor = <button />,
  positioning,
  open,
  onToggle,
  children = <div />,
  ref,
}: {
  anchor?: React.ReactElement<OverlayAnchorProps> | null | undefined
  positioning?: (PositioningOptions & { __actual__?: boolean }) | undefined
  open?: boolean | undefined
  onToggle?: () => void
  children?: React.ReactNode
  ref?: React.Ref<Overlay> | undefined
}) {
  return {
    anchor,
    positioning,
    open,
    onToggle,
    children,
    ref,
  } as TooltipOptions
}

function refValue<T>(ref: Ref<T> | undefined) {
  if (ref == null) return null
  if (typeof ref === 'function') return null
  return ref.current
}

{
  const onPointerEnter = (ev: PointerEvent) => {
    if (ev.isTrusted) {
      // Edge case: In Chromium for Linux, focusing on an element will also trigger a pointerenter event on that element.
      ev.stopPropagation()
      ev.stopImmediatePropagation()
    }
  }

  beforeEach(() => {
    document.addEventListener('pointerenter', onPointerEnter, true)
  })

  afterEach(() => {
    document.removeEventListener('pointerenter', onPointerEnter, true)
  })
}

let lastFocusedElement: HTMLElement | null = null
let lastHoveredElement: HTMLElement | null = null

async function focus(el: HTMLElement | null) {
  await act(() => {
    if (lastFocusedElement) fireEvent.focusOut(lastFocusedElement)
  })

  await act(() => {
    if (el) fireEvent.focusIn(el)
    lastFocusedElement = el
  })
}

async function hover(el: HTMLElement | null) {
  await act(() => {
    if (lastHoveredElement) fireEvent.pointerLeave(lastHoveredElement)
  })

  await act(() => {
    if (el) fireEvent.pointerEnter(el)
    lastHoveredElement = el
  })
}

let tooltip1: ReturnType<typeof useTooltip>
let tooltip2: ReturnType<typeof useTooltip>
let container1: RefObject<HTMLDivElement | null>
let container2: RefObject<HTMLDivElement | null>
let trigger1: RefObject<HTMLButtonElement | null>
let trigger2: RefObject<HTMLButtonElement | null>
let trigger3: RefObject<HTMLButtonElement | null>
let link1: RefObject<HTMLAnchorElement | null>
let onToggle1: Mock
let onToggle2: Mock
let positioning1: (PositioningOptions & { __actual__?: boolean }) | undefined
let positioning2: (PositioningOptions & { __actual__?: boolean }) | undefined

beforeAll(async () => {
  await page.viewport(1000, 1000)
})

beforeEach(() => {
  vi.restoreAllMocks()

  vi.useFakeTimers()

  document.body.innerHTML = `
    <style>
      button {
        inline-size: 80px;
        block-size: 80px;
      }

      div[role="tooltip"] {
        box-sizing: border-box;
        inline-size: 240px;
        margin: 0;
        padding: 8px;
        text-align: center;
        white-space: nowrap;
        font-size: 12px;
        line-height: 20px;
        background: white;
        border: none;
        border-radius: 8px;
        box-shadow: 0 1px 3px 2px #0001;
      }
    </style>
  `

  document.body.style.inlineSize = '100vi'
  document.body.style.blockSize = '100vb'
  document.body.style.padding = '160px'
  document.body.style.margin = '0'
  document.body.style.background = '#8888'

  container1 = createRef()
  container2 = createRef()
  trigger1 = createRef()
  trigger2 = createRef()
  trigger3 = createRef()
  link1 = createRef()
  onToggle1 = vi.fn()
  onToggle2 = vi.fn()
  positioning1 = undefined
  positioning2 = undefined

  lastFocusedElement = null
  lastHoveredElement = null
})

afterEach(() => {
  vi.useRealTimers()
})

function Page() {
  const [, setTrigger1] = useState<HTMLButtonElement | null>(null)
  const [, setTrigger2] = useState<HTMLButtonElement | null>(null)
  const [, setTrigger3] = useState<HTMLButtonElement | null>(null)

  const saveTrigger1 = useCallback((el: HTMLButtonElement | null) => {
    setTrigger1(el)
    trigger1.current = el
    if (el) vi.spyOn(el, 'focus').mockReturnValue()
  }, [])
  const saveTrigger2 = useCallback((el: HTMLButtonElement | null) => {
    setTrigger2(el)
    trigger2.current = el
    if (el) vi.spyOn(el, 'focus').mockReturnValue()
  }, [])
  const saveTrigger3 = useCallback((el: HTMLButtonElement | null) => {
    setTrigger3(el)
    trigger3.current = el
    if (el) vi.spyOn(el, 'focus').mockReturnValue()
  }, [])

  const tooltip1Value = useTooltip({
    anchor: (
      <button ref={saveTrigger1} aria-describedby='container1'>
        Trigger1
      </button>
    ),
    onToggle: onToggle1,
    positioning: positioning1,
  })

  const tooltip2Value = useTooltip({
    anchor: (
      <button ref={saveTrigger2} aria-describedby='container2'>
        Trigger2
      </button>
    ),
    onToggle: onToggle2,
    positioning: positioning2,
  })

  useEffect(() => {
    tooltip1 = tooltip1Value
    tooltip2 = tooltip2Value
  })

  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
    container1,
    () => refValue(tooltip1Value.positioned.props.ref)
  )
  useImperativeHandle<HTMLDivElement | null, HTMLDivElement | null>(
    container2,
    () => refValue(tooltip2Value.positioned.props.ref)
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {tooltip1Value.anchor}

      {tooltip2Value.anchor}

      <button ref={saveTrigger3}>Trigger3</button>

      <div
        {...tooltip1Value.positioned.props}
        data-testid='container1'
        id='container1'
        role='tooltip'
      >
        <span>This is a tooltip for Trigger1.</span>
        &nbsp;
        <a ref={link1} href='https://example.com/'>
          Learn more
        </a>
      </div>

      <div
        {...tooltip2Value.positioned.props}
        data-testid='container2'
        id='container2'
        role='tooltip'
      >
        <span>This is a tooltip for Trigger2.</span>
      </div>
    </div>
  )
}

test('useTooltip - props', () => {
  let anchor: React.ReactElement<OverlayAnchorProps> | null = null
  let open = false
  const onToggle = vi.fn()
  let children: React.ReactNode = 'Tooltip'

  const { result, rerender } = renderHook(() =>
    useTooltip(toOverlay({ anchor, open, onToggle, children }))
  )

  expect(result.current).toEqual({
    overlay: {
      anchor: null,
      positioned: null,
      open: false,
      toggle: expect.any(Function),
    },
    position: 'above',
    anchor: null,
    positioned: {
      props: {
        id: expect.stringMatching(/^tooltip-[a-z0-9]{8}$/),
        role: 'tooltip',
        tabIndex: undefined,
        style: { display: 'none' },
        onClickCapture: expect.any(Function),
        onPointerEnter: expect.any(Function),
        onPointerLeave: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
        children: 'Tooltip',
      },
    },
    arrow: {
      props: {
        style: {},
        ref: { current: null },
      },
    },
  })

  anchor = <button />
  open = true
  children = (() => 'New Tooltip') as unknown as React.ReactNode

  rerender()

  expect(result.current).toEqual({
    overlay: {
      anchor: null,
      positioned: null,
      open: true,
      toggle: expect.any(Function),
    },
    position: 'above',
    anchor: expect.objectContaining({
      type: 'button',
      props: {
        'aria-describedby': result.current.positioned.props.id,
        style: {},
        onPointerEnter: expect.any(Function),
        onPointerLeave: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    }),
    positioned: {
      props: {
        id: expect.stringMatching(/^tooltip-[a-z0-9]{8}$/),
        role: 'tooltip',
        tabIndex: undefined,
        style: {},
        onClickCapture: expect.any(Function),
        onPointerEnter: expect.any(Function),
        onPointerLeave: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
        children: expect.any(Function),
      },
    },
    arrow: {
      props: {
        style: {},
        ref: { current: null },
      },
    },
  })
})

test('useTooltip - ref', () => {
  const ref = createRef<Overlay>()

  const { result } = renderHook(() => useTooltip(toOverlay({ ref })))

  expect(ref.current).toBe(result.current.overlay)
  expect(result.current.overlay).toEqual({
    anchor: null,
    positioned: null,
    open: false,
    toggle: expect.any(Function),
  })
})

test('useTooltip - close and cancel closing progress', async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')
  const result = createRef<ReturnType<typeof useTooltip>>()
  const open = true
  const onToggle = vi.fn()

  function Page() {
    const tooltip = useTooltip(toOverlay({ open, onToggle }))
    const { anchor, positioned } = tooltip

    useEffect(() => {
      result.current = tooltip
    })

    return (
      <>
        {anchor}
        <div {...positioned.props} />
      </>
    )
  }

  const { unmount } = render(<Page />)

  const anchor = refValue(result.current?.anchor?.props.ref)
  const positioned = refValue(result.current?.positioned.props.ref)

  assert(anchor)
  assert(positioned)

  expect(result.current).toEqual({
    overlay: {
      anchor,
      positioned,
      open: true,
      toggle: expect.any(Function),
    },
    position: 'above',
    anchor: expect.objectContaining({
      type: 'button',
      props: {
        'aria-describedby': result.current?.positioned.props.id,
        style: {},
        onPointerEnter: expect.any(Function),
        onPointerLeave: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: anchor },
      },
    }),
    positioned: {
      props: {
        id: expect.stringMatching(/^tooltip-[a-z0-9]{8}$/),
        role: 'tooltip',
        tabIndex: undefined,
        style: {},
        onClickCapture: expect.any(Function),
        onPointerEnter: expect.any(Function),
        onPointerLeave: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: positioned },
        children: expect.objectContaining({ type: 'div', props: {} }),
      },
    },
    arrow: {
      props: {
        style: {},
        ref: { current: null },
      },
    },
  })

  vi.clearAllMocks()

  await act(() => fireEvent.focusOut(anchor))

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith(expect.any(Function), 200)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(onToggle).toHaveBeenCalledTimes(0)

  unmount()

  await act(() => vi.runOnlyPendingTimersAsync())

  expect(result.current?.overlay.open).toBe(true)
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(onToggle).toHaveBeenCalledTimes(0)
})

test('useTooltip - delay to close', async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')
  const result = createRef<ReturnType<typeof useTooltip>>()
  let onToggle: Mock | undefined

  function Page() {
    const [open, setOpen] = useState(true)
    const [onToggleValue] = useState<Mock>(() =>
      vi.fn((ev, open) => setOpen(open))
    )

    useEffect(() => {
      onToggle = onToggleValue
    })

    const tooltip = useTooltip(toOverlay({ open, onToggle: onToggleValue }))
    const { anchor, positioned } = tooltip

    useEffect(() => {
      result.current = tooltip
    })

    return (
      <>
        {anchor}
        <div {...positioned.props} />
      </>
    )
  }

  render(<Page />)

  const anchor = refValue(result.current?.anchor?.props.ref)
  const positioned = refValue(result.current?.positioned.props.ref)

  assert(anchor)
  assert(positioned)

  expect(result.current).toEqual({
    overlay: {
      anchor,
      positioned,
      open: true,
      toggle: expect.any(Function),
    },
    position: 'above',
    anchor: expect.objectContaining({
      type: 'button',
      props: {
        'aria-describedby': result.current?.positioned.props.id,
        style: {},
        onPointerEnter: expect.any(Function),
        onPointerLeave: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: anchor },
      },
    }),
    positioned: {
      props: {
        id: expect.stringMatching(/^tooltip-[a-z0-9]{8}$/),
        role: 'tooltip',
        tabIndex: undefined,
        style: {},
        onClickCapture: expect.any(Function),
        onPointerEnter: expect.any(Function),
        onPointerLeave: expect.any(Function),
        onFocus: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: positioned },
        children: expect.objectContaining({ type: 'div', props: {} }),
      },
    },
    arrow: {
      props: {
        style: {},
        ref: { current: null },
      },
    },
  })

  await act(() => fireEvent.focusOut(anchor))

  expect(onToggle).toHaveBeenCalledTimes(0)
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith(expect.any(Function), 200)
  expect(spy2).toHaveBeenCalledTimes(0)

  await act(() => vi.runOnlyPendingTimersAsync())

  expect(result.current?.overlay.open).toBe(false)
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(onToggle).toHaveBeenCalledTimes(1)
  expect(onToggle).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'blur', target: anchor }),
    false
  )
})

test('useTooltip - close to return focus', async () => {
  render(<Page />)

  await act(() => focus(trigger1.current))

  expect(container1.current).toBeVisible()
  expect(lastFocusedElement).toBe(trigger1.current)

  await act(() => focus(link1.current))

  expect(container1.current).toBeVisible()
  expect(lastFocusedElement).toBe(link1.current)

  const spy = trigger1.current?.focus

  await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

  expect(container1.current).not.toBeVisible()
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith({ preventScroll: true })
})

test('useTooltip - prevent closing', async () => {
  let spy: MockInstance | undefined

  render(<Page />)

  {
    await act(() => focus(trigger1.current))

    expect(container1.current).toBeVisible()

    await act(() => {
      const ev = createEvent({ key: 'Escape', defaultPrevented: true })
      spy = vi.spyOn(ev, 'preventDefault')
      document.dispatchEvent(ev)
    })

    expect(container1.current).toBeVisible()
    expect(spy).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => focus(trigger1.current))

    expect(container1.current).toBeVisible()

    await act(() => {
      const ev = createEvent({ key: 'Escape' })
      spy = vi.spyOn(ev, 'preventDefault')
      document.dispatchEvent(ev)
    })

    expect(container1.current).not.toBeVisible()
    expect(spy).toHaveBeenCalledTimes(1)
  }

  expect(onToggle1).toHaveBeenCalledTimes(2)
  expect(onToggle1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'focus', target: trigger1.current }),
    true
  )
  expect(onToggle1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'keydown', target: document }),
    false,
    'escape'
  )
})

test('useTooltip - focus and blur', { timeout: 60_000 }, async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')

  render(<Page />)

  expect(container1.current).toBeInTheDocument()
  expect(container1.current).not.toBeVisible()

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => focus(trigger1.current))

    expect(container1.current).toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(1)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'focus', target: trigger1.current }),
      true
    )
  }

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => focus(trigger3.current))

    expect(container1.current).toBeVisible()

    await act(() => focus(trigger1.current))

    expect(container1.current).toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(0)
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(spy1.mock.results[0]?.value)
  }

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => focus(trigger3.current))

    expect(container1.current).toBeVisible()

    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).not.toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(1)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'blur', target: trigger1.current }),
      false
    )
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(0)
  }

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => focus(trigger1.current))
    await act(() => focus(link1.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(1)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'focus', target: trigger1.current }),
      true
    )
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(spy1.mock.results[0]?.value)
  }
})

test('useTooltip - hover and unhover', { timeout: 60_000 }, async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')

  render(<Page />)

  expect(container1.current).toBeInTheDocument()
  expect(container1.current).not.toBeVisible()

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => hover(trigger1.current))

    expect(container1.current).toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(1)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerenter',
        target: trigger1.current,
      }),
      true
    )
  }

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => hover(trigger3.current))

    expect(container1.current).toBeVisible()

    await act(() => hover(trigger1.current))

    expect(container1.current).toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(0)
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(spy1.mock.results[0]?.value)
  }

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => hover(trigger3.current))

    expect(container1.current).toBeVisible()

    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).not.toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(1)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerleave',
        target: trigger1.current,
      }),
      false
    )
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(0)
  }

  {
    onToggle1.mockClear()
    spy1.mockClear()
    spy2.mockClear()

    await act(() => hover(trigger1.current))
    await act(() => hover(container1.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(1)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerenter',
        target: trigger1.current,
      }),
      true
    )
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(spy1.mock.results[0]?.value)
  }
})

test('useTooltip - focus next anchor', { timeout: 60_000 }, async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')

  render(<Page />)

  expect(container1.current).toBeInTheDocument()
  expect(container1.current).not.toBeVisible()
  expect(container2.current).toBeInTheDocument()
  expect(container2.current).not.toBeVisible()

  {
    await act(() => focus(trigger1.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).toBeVisible()
    expect(container2.current).not.toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(1)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'focus', target: trigger1.current }),
      true
    )
    expect(onToggle2).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => focus(trigger2.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).not.toBeVisible()
    expect(container2.current).toBeVisible()
    expect(onToggle1).toHaveBeenCalledTimes(2)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'blur', target: trigger1.current }),
      false
    )
    expect(onToggle2).toHaveBeenCalledTimes(1)
    expect(onToggle2).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'focus', target: trigger2.current }),
      true
    )
  }

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(0)
})

test('useTooltip - stay open', { timeout: 60_000 }, async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')

  render(<Page />)

  expect(container1.current).toBeInTheDocument()
  expect(container1.current).not.toBeVisible()

  await act(() => focus(trigger1.current))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(container1.current).toBeVisible()

  await act(() => hover(trigger1.current))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(container1.current).toBeVisible()

  await act(() => hover(container1.current))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(container1.current).toBeVisible()

  await act(() => focus(link1.current))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(container1.current).toBeVisible()

  await act(() => hover(trigger1.current))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(container1.current).toBeVisible()

  await act(() => focus(trigger1.current))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(container1.current).toBeVisible()
  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(onToggle1).toHaveBeenCalledTimes(1)
  expect(onToggle1).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'focus', target: trigger1.current }),
    true
  )
})

test('useTooltip - focus and hover', { timeout: 60_000 }, async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')

  render(<Page />)

  expect(container1.current).toBeInTheDocument()
  expect(container1.current).not.toBeVisible()

  {
    await act(() => focus(trigger1.current))
    await act(() => focus(trigger3.current))
    await act(() => hover(trigger1.current))
    await act(() => hover(trigger3.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).not.toBeVisible()
    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(spy1.mock.results[0]?.value)
    expect(onToggle1).toHaveBeenCalledTimes(2)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'focus', target: trigger1.current }),
      true
    )
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerleave',
        target: trigger1.current,
      }),
      false
    )
  }

  vi.clearAllMocks()

  {
    await act(() => hover(trigger1.current))
    await act(() => hover(trigger3.current))
    await act(() => focus(trigger1.current))
    await act(() => focus(trigger3.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).not.toBeVisible()
    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledWith(spy1.mock.results[0]?.value)
    expect(onToggle1).toHaveBeenCalledTimes(2)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerenter',
        target: trigger1.current,
      }),
      true
    )
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'blur', target: trigger1.current }),
      false
    )
  }

  vi.clearAllMocks()

  {
    await act(() => hover(trigger1.current))
    await act(() => focus(trigger1.current))
    await act(() => focus(trigger3.current))
    await act(() => hover(trigger3.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).not.toBeVisible()
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(0)
    expect(onToggle1).toHaveBeenCalledTimes(2)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerenter',
        target: trigger1.current,
      }),
      true
    )
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'pointerleave',
        target: trigger1.current,
      }),
      false
    )
  }

  vi.clearAllMocks()

  {
    await act(() => focus(trigger1.current))
    await act(() => hover(trigger1.current))
    await act(() => hover(trigger3.current))
    await act(() => focus(trigger3.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(container1.current).not.toBeVisible()
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(0)
    expect(onToggle1).toHaveBeenCalledTimes(2)
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'focus', target: trigger1.current }),
      true
    )
    expect(onToggle1).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'blur', target: trigger1.current }),
      false
    )
  }
})

test('useTooltip - focus and escape', { timeout: 60_000 }, async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')

  render(<Page />)

  expect(container1.current).toBeInTheDocument()
  expect(container1.current).not.toBeVisible()

  {
    await act(() => focus(trigger1.current))
    await act(() => focus(trigger3.current))

    await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

    expect(container1.current).not.toBeVisible()
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(0)
    expect(onToggle1).toHaveBeenCalledTimes(2)
    expect(onToggle1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'focus', target: trigger1.current }),
      true
    )
    expect(onToggle1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'keydown', target: document }),
      false,
      'escape'
    )
  }
})

test('useTooltip - hover and escape', { timeout: 60_000 }, async () => {
  const spy1 = vi.spyOn(globalThis, 'setTimeout')
  const spy2 = vi.spyOn(globalThis, 'clearTimeout')

  render(<Page />)

  expect(container1.current).toBeInTheDocument()
  expect(container1.current).not.toBeVisible()

  {
    await act(() => hover(trigger1.current))
    await act(() => hover(trigger3.current))

    await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

    expect(container1.current).not.toBeVisible()
    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(0)
    expect(onToggle1).toHaveBeenCalledTimes(2)
    expect(onToggle1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'pointerenter',
        target: trigger1.current,
      }),
      true
    )
    expect(onToggle1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'keydown', target: document }),
      false,
      'escape'
    )
  }
})

test('useTooltip - positioning - position', { timeout: 60_000 }, async () => {
  positioning1 = { __actual__: true }
  positioning2 = { __actual__: true, position: 'below-start' }

  render(<Page />)

  {
    await act(() => focus(trigger1.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(tooltip1.position).toBe('above')
    expect(tooltip1.anchor?.props.style).toEqual({})
    expect(tooltip1.positioned.props.style).toEqual({
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '80px 116px',
      willChange: 'translate',
    })

    expect(tooltip2.position).toBe('below-start')
    expect(tooltip2.anchor?.props.style).toEqual({})
    expect(tooltip2.positioned.props.style).toEqual({ display: 'none' })
  }

  {
    await act(() => focus(trigger2.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(tooltip1.position).toBe('above')
    expect(tooltip1.anchor?.props.style).toEqual({})
    expect(tooltip1.positioned.props.style).toEqual({ display: 'none' })

    expect(tooltip2.position).toBe('below-start')
    expect(tooltip2.anchor?.props.style).toEqual({})
    expect(tooltip2.positioned.props.style).toEqual({
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '160px 348px',
      willChange: 'translate',
    })
  }
})

test('useTooltip - positioning - anchor', { timeout: 60_000 }, async () => {
  positioning1 = { __actual__: true, anchorRef: trigger1 }
  positioning2 = { __actual__: true, anchorRef: trigger1 }

  render(<Page />)

  {
    await act(() => focus(trigger1.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(tooltip1.position).toBe('above')
    expect(tooltip1.anchor?.props.style).toEqual({})
    expect(tooltip1.positioned.props.style).toEqual({
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '80px 116px',
      willChange: 'translate',
    })

    expect(tooltip2.position).toBe('above')
    expect(tooltip2.anchor?.props.style).toEqual({})
    expect(tooltip2.positioned.props.style).toEqual({ display: 'none' })
  }

  {
    await act(() => focus(trigger2.current))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(tooltip1.position).toBe('above')
    expect(tooltip1.anchor?.props.style).toEqual({})
    expect(tooltip1.positioned.props.style).toEqual({ display: 'none' })

    expect(tooltip2.position).toBe('above')
    expect(tooltip2.anchor?.props.style).toEqual({})
    expect(tooltip2.positioned.props.style).toEqual({
      position: 'fixed',
      top: 0,
      left: 0,
      translate: '80px 116px',
      willChange: 'translate',
    })
  }
})
