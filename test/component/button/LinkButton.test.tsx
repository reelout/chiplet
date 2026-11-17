import { LinkButton } from '#component'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('LinkButton - props', () => {
  const { getByRole } = render(
    <LinkButton href='https://example.com/' disabled={undefined} />
  )

  const button = getByRole('link')

  expect(button).toBeInstanceOf(HTMLAnchorElement)
  expect(button).toHaveAttribute('href', 'https://example.com/')
  expect(button).toHaveAttribute('rel', 'noopener noreferrer')
  expect(button).not.toHaveAttribute('tabIndex')
  expect(button).not.toHaveAttribute('aria-disabled')
})

test('LinkButton - disabled', () => {
  const { getByRole } = render(
    <LinkButton href='https://example.com/' disabled={true} />
  )

  const button = getByRole('link')

  expect(button).toBeInstanceOf(HTMLAnchorElement)
  expect(button).toHaveAttribute('href', 'https://example.com/')
  expect(button).toHaveAttribute('rel', 'noopener noreferrer')
  expect(button).toHaveAttribute('tabIndex', '-1')
  expect(button).toHaveAttribute('aria-disabled', 'true')
})
