import { Checkbox } from '#component'
import { CheckboxStyle } from '#component/checkbox/style/index.css'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Checkbox - merges the slot root class name with the base style', () => {
  const { getByRole } = render(
    <Checkbox
      value='a'
      className='root'
      slot={{ root: { className: 'slot-root' } }}
    />
  )

  expect(getByRole('checkbox').parentElement).toHaveClass(
    CheckboxStyle({ size: 'medium' }),
    'slot-root',
    'root'
  )
})
