import { Switch } from '#component'
import { SwitchStyle } from '#component/checkbox/style/index.css'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test('Switch - merges the slot root class name with the base style', () => {
  const { getByRole } = render(
    <Switch className='root' slot={{ root: { className: 'slot-root' } }} />
  )

  expect(getByRole('switch').parentElement).toHaveClass(
    SwitchStyle({ size: 'medium' }),
    'slot-root',
    'root'
  )
})
