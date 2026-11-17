import { Tooltip } from '#component'
import { render } from '@testing-library/react'
import { createRef } from 'react'
import { expect, test } from 'vitest'

test('Tooltip - props', () => {
  const { rerender, queryByRole } = render(null)

  {
    rerender(<Tooltip render={'Abc12'} open={false} />)

    expect(queryByRole('button')).toBeNull()
    expect(queryByRole('tooltip')).toBeNull()
    expect(queryByRole('tooltip', { hidden: true })).toBeInstanceOf(HTMLElement)
    expect(queryByRole('tooltip', { hidden: true })).toHaveTextContent('Abc12')
  }

  {
    rerender(<Tooltip render={() => 'Abc12'} open={true} />)

    expect(queryByRole('button')).toBeNull()
    expect(queryByRole('tooltip')).toBeInstanceOf(HTMLElement)
    expect(queryByRole('tooltip')).toHaveTextContent('Abc12')
  }

  {
    rerender(
      <Tooltip render={() => 'Abc12'} open={false}>
        <button>anchor</button>
      </Tooltip>
    )

    expect(queryByRole('button')).toBeInstanceOf(HTMLButtonElement)
    expect(queryByRole('tooltip')).toBeNull()
    expect(queryByRole('tooltip', { hidden: true })).toBeInstanceOf(HTMLElement)
    expect(queryByRole('tooltip', { hidden: true })).toHaveTextContent('Abc12')
  }

  {
    rerender(
      <Tooltip render={'Abc12'} open={true}>
        <button>anchor</button>
      </Tooltip>
    )

    expect(queryByRole('button')).toBeInstanceOf(HTMLButtonElement)
    expect(queryByRole('tooltip')).toBeInstanceOf(HTMLElement)
    expect(queryByRole('tooltip')).toHaveTextContent('Abc12')
  }
})

test('Tooltip - ref', () => {
  const ref = createRef<Tooltip>()

  const { rerender, getByRole } = render(
    <Tooltip render={null} open={true} ref={ref} />
  )

  expect(ref.current?.anchor).toBeNull()
  expect(ref.current?.positioned).toBe(getByRole('tooltip'))

  rerender(
    <Tooltip render={null} open={true} ref={ref}>
      <button />
    </Tooltip>
  )

  expect(ref.current?.anchor).toBeInstanceOf(HTMLButtonElement)
  expect(ref.current?.positioned).toBe(getByRole('tooltip'))
})
