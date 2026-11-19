import { MenuItem } from '#component'
import { Group, Separator } from '#component'
import { GroupStyle } from '#component/select/style/index.css'
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { expect, test } from 'vitest'

test('Group - props', () => {
  const ref = createRef<HTMLLIElement>()

  function Page() {
    return (
      <Group ref={ref}>
        <MenuItem data-testid='item1'>Item 1</MenuItem>
        <Separator />
        <MenuItem data-testid='item2'>Item 2</MenuItem>
      </Group>
    )
  }

  const { getByRole, getByTestId } = render(<Page />)

  expect(ref.current).toBeInstanceOf(HTMLLIElement)
  expect(ref.current).toBe(getByRole('group'))
  expect(ref.current).not.toHaveAttribute('aria-labelledby')
  expect(getByTestId('item1')).toHaveRole('menuitem')
  expect(getByTestId('item1')).toHaveTextContent('Item 1')
  expect(getByTestId('item1').parentElement).toBeInstanceOf(HTMLUListElement)
  expect(getByRole('separator')).toBeInstanceOf(HTMLLIElement)
})

test('Group - label', () => {
  const ref = createRef<HTMLLIElement>()

  const { getByText, getByRole } = render(<Group ref={ref} label={'label'} />)

  expect(ref.current).toBeInstanceOf(HTMLLIElement)
  expect(ref.current).toBe(getByRole('group'))
  expect(ref.current).toHaveAttribute(
    'aria-labelledby',
    expect.stringMatching(/^label-[a-z0-9]{8}$/)
  )
  expect(getByText('label')).toHaveAttribute(
    'id',
    ref.current?.getAttribute('aria-labelledby')
  )
})

test('Group - merges the slot root class name with the base style', () => {
  const { getByRole } = render(
    <Group
      label='label'
      className='root'
      slot={{ root: { className: 'slot-root' } }}
    />
  )

  expect(getByRole('group')).toHaveClass(GroupStyle, 'slot-root', 'root')
})
