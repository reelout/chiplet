import { useLightDismiss, useReturnFocus, type Overlay } from '#hook'
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
  toggle: () => void
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
let positioned1: RefObject<HTMLDivElement | null>
let positioned2: RefObject<HTMLDivElement | null>
let positioned3: RefObject<HTMLDivElement | null>
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
  positioned1 = createRef()
  positioned2 = createRef()
  positioned3 = createRef()
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

test('useLightDismiss - open or not', async () => {
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

test('useLightDismiss - missing anchor', async () => {
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

test('useLightDismiss - click outside', async () => {
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

test('useLightDismiss - click inside anchor', async () => {
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

test('useLightDismiss - click inside positioned', async () => {
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

test('useLightDismiss - escape', async () => {
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

test('useLightDismiss - do not close when default prevented', async () => {
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

test('useLightDismiss - discrete', async () => {
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
