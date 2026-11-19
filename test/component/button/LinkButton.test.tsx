import { LinkButton } from '#component'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('LinkButton - renders an enabled link with the default rel', () => {
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

test('LinkButton - omits the href when disabled', () => {
  const { container } = render(
    <LinkButton href='https://example.com/' disabled={true} />
  )

  // Without 'href' the anchor has no implicit 'link' role, so it cannot be
  // queried by role.
  const button = container.querySelector('a')

  expect(button).toBeInstanceOf(HTMLAnchorElement)
  expect(button).not.toHaveAttribute('href')
  expect(button).toHaveAttribute('rel', 'noopener noreferrer')
  expect(button).toHaveAttribute('tabIndex', '-1')
  expect(button).toHaveAttribute('aria-disabled', 'true')
})
