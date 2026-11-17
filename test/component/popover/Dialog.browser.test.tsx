import { Dialog } from '#component'
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { expect, test } from 'vitest'

test('Dialog - props', () => {
  const { rerender, queryByRole } = render(<Dialog key={0} />)

  expect(queryByRole('dialog')).toBeNull()

  rerender(
    <Dialog key={1} defaultOpen={true} style={{ inlineSize: '2.5rem' }} />
  )

  expect(queryByRole('dialog')).toHaveStyle({ inlineSize: '2.5rem' })
})

test('Dialog - ref', () => {
  const ref = createRef<Dialog>()

  const { rerender, getByRole } = render(
    <Dialog anchor={<button />} open={false} ref={ref} />
  )

  expect(ref.current?.anchor).toBeInstanceOf(HTMLButtonElement)
  expect(ref.current?.positioned).toBeNull()

  rerender(<Dialog anchor={<button />} open={true} ref={ref} />)

  expect(ref.current?.anchor).toBeInstanceOf(HTMLButtonElement)
  expect(ref.current?.positioned).toBe(getByRole('dialog'))
})
