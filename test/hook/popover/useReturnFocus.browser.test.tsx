import '#.mock/blockPointerLeaks'
import type { Overlay } from '#hook'
import { useOverlay, useReturnFocus } from '#hook'
import { render, renderHook } from '@testing-library/react'
import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import { renderToString } from 'react-dom/server'
import { assert, beforeEach, expect, test, vi } from 'vitest'
import { page } from 'vitest/browser'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('useReturnFocus - useEffect', () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <button data-testid='positioned'>Container</button>
    </>
  )

  const anchor = page.getByTestId('anchor').element() as HTMLElement
  const positioned = page.getByTestId('positioned').element() as HTMLElement

  const spy = vi.fn()

  document.addEventListener('focusin', spy)

  const { unmount } = renderHook(() => {
    anchor.focus()

    useEffect(() => {
      positioned.focus()

      return () => {
        spy.mockClear()
        anchor.focus()
      }
    }, [])
  })

  unmount()

  expect(document.activeElement).toBe(anchor)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: anchor })
  )

  document.removeEventListener('focusin', spy)
})

test('useReturnFocus - useLayoutEffect', () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <button data-testid='positioned'>Container</button>
    </>
  )

  const anchor = page.getByTestId('anchor').element() as HTMLElement
  const positioned = page.getByTestId('positioned').element() as HTMLElement

  const spy = vi.fn()

  document.addEventListener('focusin', spy)

  const { unmount } = renderHook(() => {
    anchor.focus()

    useLayoutEffect(() => {
      positioned.focus()

      return () => {
        spy.mockClear()
        anchor.focus()
      }
    }, [])
  })

  unmount()

  expect(document.activeElement).toBe(positioned)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: anchor })
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ target: positioned })
  )

  document.removeEventListener('focusin', spy)
})

test('useReturnFocus - HTMLElement', () => {
  const spy = vi.fn()

  document.addEventListener('focusin', spy)

  let overlay: Overlay | undefined
  let open = false

  function Page() {
    const anchorRef = useRef<HTMLButtonElement>(null)
    const positionedRef = useRef<HTMLDivElement>(null)

    useReturnFocus((overlay = useOverlay({ anchorRef, positionedRef, open })))

    return (
      <>
        <button ref={anchorRef} />
        {open && <div ref={positionedRef} tabIndex={-1} />}
      </>
    )
  }

  const { rerender } = render(<Page />)

  assert(overlay?.anchor instanceof HTMLElement)
  const anchor = overlay.anchor
  anchor.focus()

  {
    open = true
    rerender(<Page />)

    assert(overlay?.positioned instanceof HTMLElement)
    const positioned = overlay.positioned
    positioned.focus()

    spy.mockClear()
    open = false
    rerender(<Page />)
  }

  expect(document.activeElement).toBe(anchor)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: anchor })
  )
})

test('useReturnFocus - SVGElement', () => {
  const spy = vi.fn()

  document.addEventListener('focusin', spy)

  let overlay: Overlay | undefined
  let open = false

  function Page() {
    const anchorRef = useRef<SVGSVGElement>(null)
    const positionedRef = useRef<HTMLDivElement>(null)

    useReturnFocus((overlay = useOverlay({ anchorRef, positionedRef, open })))

    return (
      <>
        <svg tabIndex={-1} ref={anchorRef}>
          <circle cx='50' cy='50' r='40' fill='blue'></circle>
        </svg>
        {open && <div ref={positionedRef} tabIndex={-1} />}
      </>
    )
  }

  const { rerender } = render(<Page />)

  assert(overlay?.anchor instanceof SVGElement)
  const anchor = overlay.anchor
  anchor.focus()

  {
    open = true
    rerender(<Page />)

    assert(overlay?.positioned instanceof HTMLElement)
    const positioned = overlay.positioned
    positioned.focus()

    spy.mockClear()
    open = false
    rerender(<Page />)
  }

  expect(document.activeElement).toBe(anchor)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: anchor })
  )
})

test('useReturnFocus - unmount while open', () => {
  const spy = vi.fn()

  document.addEventListener('focusin', spy)

  let open = false
  let mounted = true

  // The hook must be hosted by a component that is deleted while the
  // overlay stays open. A fiber deleted during the commit runs its
  // 'useLayoutEffect' cleanups inside React's mutation phase, so focus
  // restored there is moved back by React, while its 'useEffect' cleanups
  // run after the commit and survive. A host that survives the commit, or
  // a cleanup triggered by closing the overlay, never reproduces the
  // clobbering, so only this shape catches a 'useLayoutEffect' regression.
  function HookUser({
    positionedRef,
  }: {
    positionedRef: RefObject<HTMLDivElement | null>
  }) {
    useReturnFocus(useOverlay({ anchorRef: useRef(null), positionedRef, open }))

    return null
  }

  // The focus source and the positioned element live in the surviving
  // 'Page' instead of the deleted 'HookUser' subtree: React moves focus
  // back only to a pre-commit active element that is still connected, so
  // the focused 'inside' button must outlive the deletion for a clobbered
  // 'useLayoutEffect' restoration to be observable, and the trigger must
  // stay connected for the cleanup to focus it.
  function Page() {
    const positionedRef = useRef<HTMLDivElement>(null)

    return (
      <>
        <button data-testid='trigger' />
        {open && (
          <div ref={positionedRef} tabIndex={-1}>
            <button data-testid='inside' />
          </div>
        )}
        {mounted && <HookUser positionedRef={positionedRef} />}
      </>
    )
  }

  const { getByTestId, rerender } = render(<Page />)

  const trigger = getByTestId('trigger')

  // Records the trigger as the focus source while the overlay is closed.
  trigger.focus()

  {
    open = true
    rerender(<Page />)

    const inside = getByTestId('inside')

    // Focus inside the positioned element arms the focus restoration.
    inside.focus()

    // Deleting 'HookUser' runs the restore effect's cleanup. Because the
    // effect is passive, the cleanup runs after the commit, so React's
    // mutation-phase focus restoration cannot undo the focus it moves
    // back to the trigger. A 'useLayoutEffect' cleanup would run inside
    // the mutation phase and React would immediately move focus back to
    // 'inside', failing the assertions below.
    spy.mockClear()
    mounted = false
    rerender(<Page />)
  }

  expect(document.activeElement).toBe(trigger)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: trigger })
  )

  document.removeEventListener('focusin', spy)
})
