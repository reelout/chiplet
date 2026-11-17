import { Icon } from '#component'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Icon', () => {
  const { rerender, getByTestId } = render(<Icon data-testid='svg' />)

  expect(getByTestId('svg')).toHaveAttribute('role', 'img')
  expect(getByTestId('svg')).toHaveAttribute('aria-hidden', 'true')
  expect(getByTestId('svg')).not.toHaveAttribute('aria-label')
  expect(getByTestId('svg')).toHaveAttribute('width', '1em')
  expect(getByTestId('svg')).toHaveAttribute(
    'preserveAspectRatio',
    'xMidYMid meet'
  )
  expect(getByTestId('svg')).toHaveAttribute('fill', 'currentColor')
  expect(getByTestId('svg')).toHaveAttribute(
    'xmlns',
    'http://www.w3.org/2000/svg'
  )

  rerender(<Icon data-testid='svg' aria-label='Close' />)

  expect(getByTestId('svg')).toHaveAttribute('role', 'img')
  expect(getByTestId('svg')).toHaveAttribute('aria-hidden', 'false')
  expect(getByTestId('svg')).toHaveAttribute('aria-label', 'Close')
  expect(getByTestId('svg')).toHaveAttribute('width', '1em')
  expect(getByTestId('svg')).toHaveAttribute(
    'preserveAspectRatio',
    'xMidYMid meet'
  )
  expect(getByTestId('svg')).toHaveAttribute('fill', 'currentColor')
  expect(getByTestId('svg')).toHaveAttribute(
    'xmlns',
    'http://www.w3.org/2000/svg'
  )
})
