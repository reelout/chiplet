import type { Overlay } from '#hook'
import { useAnchor } from '#hook/popover/useAnchor'
import { preventDefault } from '#util'
import { render } from '@testing-library/react'
import { act, createRef } from 'react'
import { assert, expect, test, vi } from 'vitest'

function toOverlay({ toggle }: { toggle: Overlay['toggle'] }) {
  return { toggle } as Partial<Overlay> as Overlay
}

test('useAnchor - toggle the overlay on an anchor click', async () => {
  const toggle = vi.fn()
  const overlay = toOverlay({ toggle })
  const ref = createRef<HTMLButtonElement>()
  const onClick = vi.fn()

  function Page() {
    return <button {...useAnchor({ onClick, ref }, overlay)} />
  }

  render(<Page />)

  assert(ref.current)

  await act(() => ref.current?.click())

  expect(toggle).toHaveBeenCalledTimes(1)
  expect(toggle).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: ref.current }),
    undefined,
    'anchor'
  )
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onClick).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: ref.current })
  )
})

test('useAnchor - skip the toggle when the anchor click is prevented', async () => {
  const toggle = vi.fn()
  const overlay = toOverlay({ toggle })
  const ref = createRef<HTMLButtonElement>()
  const onClick = vi.fn(preventDefault)

  function Page() {
    return <button {...useAnchor({ onClick, ref }, overlay)} />
  }

  render(<Page />)

  assert(ref.current)

  await act(() => ref.current?.click())

  expect(toggle).toHaveBeenCalledTimes(0)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onClick).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'click', target: ref.current })
  )
})

test('useAnchor - skip the toggle when the anchor is disabled', async () => {
  const toggle = vi.fn()
  const overlay = toOverlay({ toggle })
  const ref = createRef<HTMLDivElement>()
  const onClick = vi.fn()

  function Page() {
    return (
      <div
        {...useAnchor(
          { role: 'button', tabIndex: 0, disabled: true, onClick, ref },
          overlay
        )}
      />
    )
  }

  render(<Page />)

  assert(ref.current)

  await act(() => ref.current?.click())

  expect(toggle).toHaveBeenCalledTimes(0)
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(onClick).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'click',
      target: ref.current,
      defaultPrevented: false,
    })
  )
})
