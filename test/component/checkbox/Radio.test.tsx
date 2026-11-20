import { Radio } from '#component'
import { CheckboxStyle } from '#component/checkbox/style/index.css'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Radio - merges the slot root class name with the base style', () => {
  const { getByRole } = render(
    <Radio
      value='a'
      className='root'
      slot={{ root: { className: 'slot-root' } }}
    />
  )

  expect(getByRole('radio').parentElement).toHaveClass(
    CheckboxStyle({ size: 'medium' }),
    'slot-root',
    'root'
  )
})
