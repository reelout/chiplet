import { MenuItem } from '#component'
import { ItemStyle } from '#component/select/style/index.css'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('MenuItem - merges the slot root class name with the base style', () => {
  const { getByRole } = render(
    <MenuItem className='root' slot={{ root: { className: 'slot-root' } }}>
      Item
    </MenuItem>
  )

  expect(getByRole('menuitem')).toHaveClass(
    ItemStyle({ danger: undefined }),
    'slot-root',
    'root'
  )
})
