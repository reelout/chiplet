import {
  useLightDismiss,
  useOverlay,
  useReturnFocus,
  type Overlay,
} from '#hook'
import { useAnchor } from '#hook/popover/useAnchor'
import { createKeyboardEvent as createEvent } from '#test'
import { fireEvent, render } from '@testing-library/react'
import { act, createRef, type RefObject } from 'react'
import { createPortal } from 'react-dom'
import { beforeEach, expect, test, vi, type Mock } from 'vitest'

function toOverlay({
  anchorRef,
  positionedRef,
  open,
  toggle,
}: {
  anchorRef: RefObject<Element | null>
  positionedRef: RefObject<Element | null>
  open: boolean
  toggle: Overlay['toggle']
}) {
  return {
    get anchor() {
      return anchorRef.current
    },
    get positioned() {
      return positionedRef.current
    },
    open,
    toggle,
  } as Partial<Overlay> as Overlay
}

let anchor1: RefObject<HTMLButtonElement | null>
let anchor2: RefObject<HTMLButtonElement | null>
let anchor3: RefObject<HTMLButtonElement | null>
let anchor4: RefObject<HTMLButtonElement | null>
let positioned1: RefObject<HTMLDivElement | null>
let positioned2: RefObject<HTMLDivElement | null>
let positioned3: RefObject<HTMLDivElement | null>
let positioned4: RefObject<HTMLDivElement | null>
let open: boolean
let hide1: Mock
let hide2: Mock
let hide3: Mock
let overlay1: Overlay | undefined
let overlay2: Overlay | undefined
let overlay3: Overlay | undefined

beforeEach(() => {
  anchor1 = createRef()
  anchor2 = createRef()
  anchor3 = createRef()
  anchor4 = createRef()
  positioned1 = createRef()
  positioned2 = createRef()
  positioned3 = createRef()
  positioned4 = createRef()
  open = true
  hide1 = vi.fn()
  hide2 = vi.fn()
  hide3 = vi.fn()
  overlay1 = undefined
  overlay2 = undefined
  overlay3 = undefined
})

function Portal(props: React.PropsWithChildren) {
  return createPortal(props.children, document.body)
}

function Page() {
  overlay1 ??= toOverlay({
    anchorRef: anchor1,
    positionedRef: positioned1,
    open,
    toggle: hide1,
  })

  overlay2 ??= toOverlay({
    anchorRef: anchor2,
    positionedRef: positioned2,
    open,
    toggle: hide2,
  })

  overlay3 ??= toOverlay({
    anchorRef: anchor3,
    positionedRef: positioned3,
    open,
    toggle: hide3,
  })

  const [anchorProps1, positionedProps1] = useLightDismiss(
    { ref: anchor1 },
    { ref: positioned1 },
    overlay1,
    useReturnFocus(overlay1)
  )

  const [anchorProps2, positionedProps2] = useLightDismiss(
    { ref: anchor2 },
    { ref: positioned2 },
    overlay2,
    useReturnFocus(overlay2)
  )

  const [anchorProps3, positionedProps3] = useLightDismiss(
    { ref: anchor3 },
    { ref: positioned3 },
    overlay3,
    useReturnFocus(overlay3)
  )

  return (
    <>
      <button {...anchorProps1} />

      {overlay1.open && (
        <Portal>
          <div {...positionedProps1}>
            <button {...anchorProps2} />

            {overlay2.open && (
              <Portal>
                <div {...positionedProps2}>
                  <button {...anchorProps3} />
                </div>
              </Portal>
            )}
          </div>
        </Portal>
      )}

      {overlay3.open && (
        <Portal>
          <div {...positionedProps3} />
        </Portal>
      )}
    </>
  )
}

function renderPopoverStack() {
  const onToggle1 = vi.fn()
  const onToggle2 = vi.fn()
  const onToggle3 = vi.fn()
  const onToggle4 = vi.fn()

  function Page() {
    const popover1 = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle: onToggle1,
    })

    const popover2 = useOverlay({
      anchorRef: anchor2,
      positionedRef: positioned2,
      onToggle: onToggle2,
    })

    const popover3 = useOverlay({
      anchorRef: anchor3,
      positionedRef: positioned3,
      onToggle: onToggle3,
    })

    const popover4 = useOverlay({
      anchorRef: anchor4,
      positionedRef: positioned4,
      onToggle: onToggle4,
    })

    const [anchorProps1, positionedProps1] = useLightDismiss(
      useAnchor({ ref: anchor1 }, popover1),
      { ref: positioned1 },
      popover1,
      useReturnFocus(popover1)
    )

    const [anchorProps2, positionedProps2] = useLightDismiss(
      useAnchor({ ref: anchor2 }, popover2),
      { ref: positioned2 },
      popover2,
      useReturnFocus(popover2)
    )

    const [anchorProps3, positionedProps3] = useLightDismiss(
      useAnchor({ ref: anchor3 }, popover3),
      { ref: positioned3 },
      popover3,
      useReturnFocus(popover3)
    )

    const [anchorProps4, positionedProps4] = useLightDismiss(
      useAnchor({ ref: anchor4 }, popover4),
      { ref: positioned4 },
      popover4,
      useReturnFocus(popover4)
    )

    return (
      <>
        <button {...anchorProps1} />
        {popover1.open && (
          <Portal>
            <div {...positionedProps1}>
              <button {...anchorProps2} />
              {popover2.open && (
                <div {...positionedProps2}>
                  <button {...anchorProps3} />
                  <button {...anchorProps4} />
                  {popover3.open && <div {...positionedProps3} />}
                  {popover4.open && <div {...positionedProps4} />}
                </div>
              )}
            </div>
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  return { onToggle1, onToggle2, onToggle3, onToggle4 }
}

test('useLightDismiss - dismiss only the open overlay', async () => {
  overlay1 = toOverlay({
    anchorRef: anchor1,
    positionedRef: positioned1,
    open: true,
    toggle: hide1,
  })
  overlay2 = toOverlay({
    anchorRef: anchor2,
    positionedRef: positioned2,
    open: false,
    toggle: hide2,
  })

  render(<Page />)

  await act(() => document.body.click())

  expect(hide1).toHaveBeenCalledTimes(1)
  expect(hide2).toHaveBeenCalledTimes(0)
})

test('useLightDismiss - tolerate a missing anchor', async () => {
  overlay1 = toOverlay({
    anchorRef: createRef(),
    positionedRef: positioned1,
    open: true,
    toggle: hide1,
  })
  overlay2 = toOverlay({
    anchorRef: createRef(),
    positionedRef: positioned2,
    open: true,
    toggle: hide2,
  })
  overlay3 = toOverlay({
    anchorRef: createRef(),
    positionedRef: positioned3,
    open: true,
    toggle: hide3,
  })

  render(<Page />)

  await act(() => document.body.click())

  expect(hide1).toHaveBeenCalledTimes(1)
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledTimes(1)

  await act(() => positioned1.current?.click())

  expect(hide1).toHaveBeenCalledTimes(1)
  expect(hide2).toHaveBeenCalledTimes(2)
  expect(hide3).toHaveBeenCalledTimes(2)

  await act(() => positioned2.current?.click())

  expect(hide1).toHaveBeenCalledTimes(1)
  expect(hide2).toHaveBeenCalledTimes(2)
  expect(hide3).toHaveBeenCalledTimes(3)

  await act(() => positioned3.current?.click())

  expect(hide1).toHaveBeenCalledTimes(2)
  expect(hide2).toHaveBeenCalledTimes(3)
  expect(hide3).toHaveBeenCalledTimes(3)
})

test('useLightDismiss - dismiss on a click outside', async () => {
  render(<Page />)

  await act(() => document.body.click())

  expect(hide1).toHaveBeenCalledTimes(1)
  expect(hide1).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: document.body })
  )
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide2).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: document.body })
  )
  expect(hide3).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: document.body })
  )
})

test('useLightDismiss - keep open on its own anchor click', async () => {
  render(<Page />)

  await act(() => anchor1.current?.click())

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledTimes(1)

  await act(() => anchor2.current?.click())

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledTimes(2)

  await act(() => anchor3.current?.click())

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledTimes(2)
})

test('useLightDismiss - keep open on a click inside its positioned element', async () => {
  render(<Page />)

  await act(() => positioned1.current?.click())

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledTimes(1)

  await act(() => positioned2.current?.click())

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledTimes(2)

  await act(() => positioned3.current?.click())

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledTimes(2)
})

test('useLightDismiss - close the topmost overlay on escape', async () => {
  render(<Page />)

  await act(() => fireEvent.keyDown(document, { key: 'Enter' }))
  await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(0)
  expect(hide3).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keydown',
      key: 'Escape',
      defaultPrevented: true,
    }),
    false,
    'escape'
  )
})

test('useLightDismiss - do not dismiss an already-prevented escape', async () => {
  render(<Page />)

  await act(() =>
    createEvent({
      target: document,
      key: 'Escape',
      defaultPrevented: false,
    })
  )

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(0)
  expect(hide3).toHaveBeenCalledTimes(1)
  expect(hide3).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keydown',
      key: 'Escape',
      defaultPrevented: true,
    }),
    false,
    'escape'
  )

  await act(() =>
    createEvent({
      target: document,
      key: 'Escape',
      defaultPrevented: true,
    })
  )

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(0)
  expect(hide3).toHaveBeenCalledTimes(1)
})

test('useLightDismiss - do not dismiss when the focused element and the click target differ', async () => {
  overlay3 = toOverlay({
    anchorRef: createRef(),
    positionedRef: positioned3,
    open: false,
    toggle: hide3,
  })

  render(<Page />)

  await act(() => anchor3.current?.focus())

  await act(() => {
    if (overlay3) overlay3.open = true
  })

  await act(() => positioned3.current?.click())

  expect(hide1).toHaveBeenCalledTimes(0)
  expect(hide2).toHaveBeenCalledTimes(0)
  expect(hide3).toHaveBeenCalledTimes(0)
})

test('useLightDismiss - preserve the anchor keydown handler', async () => {
  const onToggle = vi.fn()
  const onKeyDown = vi.fn()

  function Page() {
    const overlay = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle,
    })

    const [anchorProps, positionedProps] = useLightDismiss(
      useAnchor({ ref: anchor1, onKeyDown }, overlay),
      { ref: positioned1 },
      overlay,
      useReturnFocus(overlay)
    )

    return (
      <>
        <button {...anchorProps} />
        {overlay.open && (
          <Portal>
            <div {...positionedProps} />
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    anchor1.current?.focus()
    anchor1.current?.click()
    createEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(onKeyDown).toHaveBeenCalledTimes(1)
  expect(onKeyDown).toHaveBeenCalledWith(
    expect.objectContaining({ key: 'Escape' })
  )
  expect(positioned1.current).toBe(null)
  expect(onToggle).toHaveBeenCalledTimes(2)
})

test('useLightDismiss - abort a pending open on escape via the anchor', async () => {
  const onToggle = vi.fn()

  function Page() {
    const overlay = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle,
    })

    const [anchorProps, positionedProps] = useLightDismiss(
      useAnchor({ ref: anchor1 }, overlay),
      { ref: positioned1 },
      overlay,
      useReturnFocus(overlay)
    )

    return (
      <>
        <button {...anchorProps} />
        {overlay.open && (
          <Portal>
            <div {...positionedProps} />
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    anchor1.current?.focus()
    anchor1.current?.click()
    // `act` defers the React commit until the callback exits, so the open
    // state is still uncommitted when the escape keydown is dispatched
    createEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(positioned1.current).toBe(null)
  expect(onToggle).toHaveBeenCalledTimes(2)
  expect(onToggle).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    true,
    'anchor'
  )
  expect(onToggle).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'Escape',
      defaultPrevented: true,
    }),
    false,
    'escape'
  )
})

test('useLightDismiss - do not abort a pending open on escape from elsewhere', async () => {
  const onToggle = vi.fn()
  const input = createRef<HTMLInputElement>()

  function Page() {
    const overlay = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle,
    })

    const [anchorProps, positionedProps] = useLightDismiss(
      useAnchor({ ref: anchor1 }, overlay),
      { ref: positioned1 },
      overlay,
      useReturnFocus(overlay)
    )

    return (
      <>
        <button {...anchorProps} />
        <input ref={input} />
        {overlay.open && (
          <Portal>
            <div {...positionedProps} />
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  let escape: KeyboardEvent | undefined

  await act(() => {
    anchor1.current?.click()
    escape = createEvent({ target: input.current, key: 'Escape' })
  })

  expect(escape?.defaultPrevented).toBe(false)
  expect(positioned1.current).not.toBe(null)
  expect(onToggle).toHaveBeenCalledTimes(1)
  expect(onToggle).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    true,
    'anchor'
  )
})

test('useLightDismiss - abort a pending open without closing anything already open', async () => {
  const onToggle1 = vi.fn()
  const onToggle2 = vi.fn()
  const onToggle3 = vi.fn()

  function Page() {
    const popover1 = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle: onToggle1,
    })

    const popover2 = useOverlay({
      anchorRef: anchor2,
      positionedRef: positioned2,
      onToggle: onToggle2,
    })

    const popover3 = useOverlay({
      anchorRef: anchor3,
      positionedRef: positioned3,
      onToggle: onToggle3,
    })

    const [anchorProps1, positionedProps1] = useLightDismiss(
      useAnchor({ ref: anchor1 }, popover1),
      { ref: positioned1 },
      popover1,
      useReturnFocus(popover1)
    )

    const [anchorProps2, positionedProps2] = useLightDismiss(
      useAnchor({ ref: anchor2 }, popover2),
      { ref: positioned2 },
      popover2,
      useReturnFocus(popover2)
    )

    const [anchorProps3, positionedProps3] = useLightDismiss(
      useAnchor({ ref: anchor3 }, popover3),
      { ref: positioned3 },
      popover3,
      useReturnFocus(popover3)
    )

    return (
      <>
        <button {...anchorProps1} />
        {popover1.open && (
          <Portal>
            <div {...positionedProps1}>
              <button {...anchorProps2} />
              {popover2.open && (
                <div {...positionedProps2}>
                  <button {...anchorProps3} />
                  {popover3.open && <div {...positionedProps3} />}
                </div>
              )}
            </div>
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    anchor1.current?.focus()
    anchor1.current?.click()
  })

  expect(positioned1.current).not.toBe(null)

  await act(() => {
    anchor2.current?.focus()
    anchor2.current?.click()
  })

  expect(positioned2.current).not.toBe(null)

  await act(() => {
    anchor3.current?.focus()
    anchor3.current?.click()
    createEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(positioned1.current).not.toBe(null)
  expect(positioned2.current).not.toBe(null)
  expect(positioned3.current).toBe(null)
  expect(onToggle1).toHaveBeenCalledTimes(1)
  expect(onToggle2).toHaveBeenCalledTimes(1)
  expect(onToggle3).toHaveBeenCalledTimes(2)
  expect(onToggle3).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'Escape',
      defaultPrevented: true,
    }),
    false,
    'escape'
  )
})

test('useLightDismiss - abort a pending open after its anchor click light-dismissed the topmost overlay', async () => {
  const { onToggle1, onToggle2, onToggle3, onToggle4 } = renderPopoverStack()

  await act(() => {
    anchor1.current?.focus()
    anchor1.current?.click()
  })

  expect(positioned1.current).not.toBe(null)

  await act(() => {
    anchor2.current?.focus()
    anchor2.current?.click()
  })

  expect(positioned2.current).not.toBe(null)

  await act(() => {
    anchor3.current?.focus()
    anchor3.current?.click()
  })

  expect(positioned3.current).not.toBe(null)

  await act(() => {
    anchor4.current?.focus()
    anchor4.current?.click()
    createEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(positioned1.current).not.toBe(null)
  expect(positioned2.current).not.toBe(null)
  expect(positioned3.current).toBe(null)
  expect(positioned4.current).toBe(null)
  expect(onToggle1).toHaveBeenCalledTimes(1)
  expect(onToggle2).toHaveBeenCalledTimes(1)
  expect(onToggle3).toHaveBeenCalledTimes(2)
  expect(onToggle3).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'click' }),
    false
  )
  expect(onToggle4).toHaveBeenCalledTimes(2)
  expect(onToggle4).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'Escape',
      defaultPrevented: true,
    }),
    false,
    'escape'
  )
})

test('useLightDismiss - abort a pending close on escape via the anchor', async () => {
  const onToggle = vi.fn()

  function Page() {
    const overlay = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle,
    })

    const [anchorProps, positionedProps] = useLightDismiss(
      useAnchor({ ref: anchor1 }, overlay),
      { ref: positioned1 },
      overlay,
      useReturnFocus(overlay)
    )

    return (
      <>
        <button {...anchorProps} />
        {overlay.open && (
          <Portal>
            <div {...positionedProps} />
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    anchor1.current?.focus()
    anchor1.current?.click()
  })

  expect(positioned1.current).not.toBe(null)

  await act(() => {
    anchor1.current?.click()
    // `act` defers the React commit until the callback exits, so the close
    // is still pending when the escape keydown is dispatched
    createEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(positioned1.current).not.toBe(null)
  expect(onToggle).toHaveBeenCalledTimes(3)
  expect(onToggle).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'click' }),
    true,
    'anchor'
  )
  expect(onToggle).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'click' }),
    false,
    'anchor'
  )
  expect(onToggle).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      key: 'Escape',
      defaultPrevented: true,
    }),
    true,
    'escape'
  )
})

test('useLightDismiss - escape on a committed anchor closes the topmost overlay', async () => {
  const onToggle1 = vi.fn()
  const onToggle2 = vi.fn()

  function Page() {
    const popover1 = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle: onToggle1,
    })

    const popover2 = useOverlay({
      anchorRef: anchor2,
      positionedRef: positioned2,
      onToggle: onToggle2,
    })

    const [anchorProps1, positionedProps1] = useLightDismiss(
      useAnchor({ ref: anchor1 }, popover1),
      { ref: positioned1 },
      popover1,
      useReturnFocus(popover1)
    )

    const [anchorProps2, positionedProps2] = useLightDismiss(
      useAnchor({ ref: anchor2 }, popover2),
      { ref: positioned2 },
      popover2,
      useReturnFocus(popover2)
    )

    return (
      <>
        <button {...anchorProps1} />
        {popover1.open && (
          <Portal>
            <div {...positionedProps1}>
              <button {...anchorProps2} />
              {popover2.open && <div {...positionedProps2} />}
            </div>
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    anchor1.current?.focus()
    anchor1.current?.click()
  })

  expect(positioned1.current).not.toBe(null)

  await act(() => {
    anchor2.current?.focus()
    anchor2.current?.click()
  })

  expect(positioned2.current).not.toBe(null)

  await act(() => {
    createEvent({ target: anchor1.current, key: 'Escape' })
  })

  expect(positioned2.current).toBe(null)
  expect(positioned1.current).not.toBe(null)
  expect(onToggle1).toHaveBeenCalledTimes(1)
  expect(onToggle2).toHaveBeenCalledTimes(2)
  expect(onToggle2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'Escape',
      defaultPrevented: true,
    }),
    false,
    'escape'
  )
})

test('useLightDismiss - escape on an idle anchor closes the topmost overlay', async () => {
  const { onToggle1, onToggle2, onToggle3, onToggle4 } = renderPopoverStack()

  await act(() => {
    anchor1.current?.focus()
    anchor1.current?.click()
  })

  expect(positioned1.current).not.toBe(null)

  await act(() => {
    anchor2.current?.focus()
    anchor2.current?.click()
  })

  expect(positioned2.current).not.toBe(null)

  await act(() => {
    anchor3.current?.focus()
    anchor3.current?.click()
  })

  expect(positioned3.current).not.toBe(null)

  await act(() => {
    anchor4.current?.focus()
    createEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(positioned1.current).not.toBe(null)
  expect(positioned2.current).not.toBe(null)
  expect(positioned3.current).toBe(null)
  expect(positioned4.current).toBe(null)
  expect(onToggle1).toHaveBeenCalledTimes(1)
  expect(onToggle2).toHaveBeenCalledTimes(1)
  expect(onToggle3).toHaveBeenCalledTimes(2)
  expect(onToggle3).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'Escape',
      defaultPrevented: true,
    }),
    false,
    'escape'
  )
  expect(onToggle4).toHaveBeenCalledTimes(0)
})

test('useLightDismiss - escape on an idle anchor is a no-op when no overlay is open', async () => {
  const onToggle1 = vi.fn()

  function Page() {
    const popover1 = useOverlay({
      anchorRef: anchor1,
      positionedRef: positioned1,
      onToggle: onToggle1,
    })

    const [anchorProps1, positionedProps1] = useLightDismiss(
      useAnchor({ ref: anchor1 }, popover1),
      { ref: positioned1 },
      popover1,
      useReturnFocus(popover1)
    )

    return (
      <>
        <button {...anchorProps1} />
        {popover1.open && (
          <Portal>
            <div {...positionedProps1} />
          </Portal>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    anchor1.current?.focus()
    createEvent({ target: anchor1.current, key: 'Escape' })
  })

  expect(positioned1.current).toBe(null)

  expect(onToggle1).toHaveBeenCalledTimes(0)
})
