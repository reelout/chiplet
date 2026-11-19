import { Header } from '#component'
import { HeaderStyle, NavStyle } from '#component/header/style/index.css'
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

test('Header - merges slot class names with the base styles', () => {
  const { getByRole } = render(
    <Header
      renderNav={() => null}
      className='root'
      slot={{
        root: { className: 'slot-root' },
        nav: { className: 'slot-nav' },
      }}
    />
  )

  expect(getByRole('banner')).toHaveClass(HeaderStyle, 'slot-root', 'root')
  expect(getByRole('navigation')).toHaveClass(NavStyle, 'slot-nav')
})
