import { DismissButton } from '#component'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('DismissButton - props', () => {
  const { queryByRole, rerender } = render(null)

  rerender(<DismissButton />)

  expect(queryByRole('button')).toBeInstanceOf(HTMLButtonElement)
  expect(queryByRole('img', { hidden: true })).toBeInstanceOf(SVGElement)

  rerender(<DismissButton>{null}</DismissButton>)

  expect(queryByRole('button')).toBeInstanceOf(HTMLButtonElement)
  expect(queryByRole('img', { hidden: true })).toBe(null)
})
