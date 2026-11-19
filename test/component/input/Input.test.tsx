import { Input } from '#component'
import { InputStyle } from '#component/input/style/index.css'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Input - merges the slot root class name with the base style', () => {
  const { getByRole } = render(
    <Input className='root' slot={{ root: { className: 'slot-root' } }} />
  )

  expect(getByRole('textbox').parentElement).toHaveClass(
    InputStyle({ variant: 'primary', size: 'medium' }),
    'slot-root',
    'root'
  )
})
