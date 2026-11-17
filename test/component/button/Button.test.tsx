import { Button } from '#component'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Button - props', () => {
  const { getByRole } = render(<Button disabled={undefined} />)

  const button = getByRole('button')

  expect(button).toBeInstanceOf(HTMLButtonElement)
  expect(button).not.toHaveAttribute('tabIndex')
  expect(button).not.toHaveAttribute('aria-disabled')
})

test('Button - disabled', () => {
  const { getByRole } = render(<Button disabled={true} />)

  const button = getByRole('button')

  expect(button).toBeInstanceOf(HTMLButtonElement)
  expect(button).toHaveAttribute('tabIndex', '-1')
  expect(button).toHaveAttribute('aria-disabled', 'true')
})
