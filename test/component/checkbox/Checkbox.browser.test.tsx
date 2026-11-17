import { Checkbox } from '#component'
import { render } from '@testing-library/react'
import { act } from 'react'
import { expect, test } from 'vitest'

test('Checkbox - indeterminate', { timeout: 30_000 }, async () => {
  function Page() {
    return (
      <>
        <Checkbox
          data-testid='name1'
          value='value1'
          defaultChecked={false}
          indeterminate={false}
        />
        <Checkbox
          data-testid='name2'
          value='value2'
          defaultChecked={true}
          indeterminate={false}
        />
        <Checkbox
          data-testid='name3'
          value='value3'
          defaultChecked={false}
          indeterminate={true}
        />
        <Checkbox
          data-testid='name4'
          value='value4'
          defaultChecked={true}
          indeterminate={true}
        />
      </>
    )
  }

  const { getByTestId } = render(<Page />)

  {
    const el = getByTestId('name1')

    expect(el).not.toBeChecked()
    expect(el).not.toBePartiallyChecked()

    await act(() => el.click())

    expect(el).toBeChecked()
    expect(el).not.toBePartiallyChecked()

    await act(() => el.click())

    expect(el).not.toBeChecked()
    expect(el).not.toBePartiallyChecked()
  }

  {
    const el = getByTestId('name2')

    expect(el).toBeChecked()
    expect(el).not.toBePartiallyChecked()

    await act(() => el.click())

    expect(el).not.toBeChecked()
    expect(el).not.toBePartiallyChecked()

    await act(() => el.click())

    expect(el).toBeChecked()
    expect(el).not.toBePartiallyChecked()
  }

  {
    const el = getByTestId('name3')

    expect(el).not.toBeChecked()
    expect(el).toBePartiallyChecked()

    await act(() => el.click())

    expect(el).toBeChecked()
    expect(el).not.toBePartiallyChecked()

    await act(() => el.click())

    expect(el).not.toBeChecked()
    expect(el).not.toBePartiallyChecked()
  }

  {
    const el = getByTestId('name4')

    expect(el).toBeChecked()
    expect(el).not.toBePartiallyChecked()

    await act(() => el.click())

    expect(el).not.toBeChecked()
    expect(el).not.toBePartiallyChecked()

    await act(() => el.click())

    expect(el).toBeChecked()
    expect(el).not.toBePartiallyChecked()
  }
})
