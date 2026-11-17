import type { Overlay } from '#hook'
import { useOverlay, useReturnFocus } from '#hook'
import { render, renderHook } from '@testing-library/react'
import { useEffect, useLayoutEffect, useRef } from 'react'
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
