import { Header } from '#component'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Header - props', () => {
  const { getByRole } = render(
    <Header renderNav={() => <a href={location.href}>Nav Link</a>}>
      <div>Header</div>
    </Header>
  )

  expect(getByRole('banner')).toHaveTextContent('Header')
  expect(getByRole('navigation')).toHaveTextContent('Nav Link')
  expect(getByRole('link')).toHaveAttribute('href', location.href)
  expect(getByRole('link')).toHaveTextContent('Nav Link')
})
