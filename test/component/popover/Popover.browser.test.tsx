import { Popover } from '#component'
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { expect, test } from 'vitest'

test('Popover - elementType', () => {
  const ref = createRef<Popover<'div' | 'ul'>>()

  const { rerender } = render(<Popover<'div' | 'ul'> open={true} ref={ref} />)

  expect(ref.current?.positioned).toBeInstanceOf(HTMLDivElement)

  rerender(<Popover<'div' | 'ul'> elementType='ul' open={true} ref={ref} />)

  expect(ref.current?.positioned).toBeInstanceOf(HTMLUListElement)
})

test('Popover - ref', () => {
  const ref = createRef<Popover>()

  const { rerender, getByRole } = render(
    <Popover key={0} anchor={<button />} ref={ref} />
  )

  expect(ref.current?.anchor).toBeInstanceOf(HTMLButtonElement)
  expect(ref.current?.positioned).toBeNull()

  rerender(<Popover key={1} anchor={<button />} defaultOpen={true} ref={ref} />)

  expect(ref.current?.anchor).toBeInstanceOf(HTMLButtonElement)
  expect(ref.current?.positioned).toBe(getByRole('dialog'))
})
