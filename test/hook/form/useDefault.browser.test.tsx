import { render } from '@testing-library/react'
import { act, createRef, useLayoutEffect } from 'react'
import { expect, test, vi } from 'vitest'

test('useDefault - change event', async () => {
  const spy = vi.fn()
  const ref = createRef<HTMLInputElement>()

  function Page() {
    useLayoutEffect(() => {
      const el = ref.current

      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/change_event
      el?.addEventListener('change', spy)

      return () => el?.removeEventListener('change', spy)
    }, [])

    return <input type='checkbox' ref={ref} />
  }

  render(<Page />)

  await act(() => ref.current?.click())

  expect(ref.current).toBeChecked()
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'change',
      target: ref.current,
      cancelable: false,
      defaultPrevented: false,
      constructor: Event,
    })
  )
})
