import { Option } from '#component'
import { ItemStyle } from '#component/select/style/index.css'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Option - merges the slot root class name with the base style', () => {
  const { getByRole } = render(
    <Option
      value='a'
      className='root'
      slot={{ root: { className: 'slot-root' } }}
    >
      Option A
    </Option>
  )

  expect(getByRole('option')).toHaveClass(ItemStyle(), 'slot-root', 'root')
})
