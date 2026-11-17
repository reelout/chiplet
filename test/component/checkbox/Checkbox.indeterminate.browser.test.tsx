import { Checkbox } from '#component'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'
import { server } from 'vitest/browser'

test('HTMLInputElement', async () => {
  const { getByRole } = render(<input type='checkbox' />)

  const el = getByRole('checkbox') as HTMLInputElement

  expect(el).toBeInstanceOf(HTMLInputElement)

  {
    el.indeterminate = false
    el.checked = false
    expect(el.matches(':indeterminate')).toBe(false)
    expect(el.matches(':checked')).toBe(false)
  }

  {
    el.indeterminate = true
    el.checked = false
    expect(el.matches(':indeterminate')).toBe(true)
    expect(el.matches(':checked')).toBe(false)
  }

  {
    el.indeterminate = false
    el.checked = true
    expect(el.matches(':indeterminate')).toBe(false)
    expect(el.matches(':checked')).toBe(true)
  }

  {
    el.indeterminate = true
    el.checked = true
    expect(el.indeterminate).toBe(true)
    expect(el.checked).toBe(true)
    expect(el.matches(':indeterminate')).toBe(true)
    expect(el.matches(':checked')).toBe(
      { chromium: false, firefox: true, webkit: true }[server.browser]
    )
  }

  {
    el.checked = true
    el.indeterminate = true
    expect(el.indeterminate).toBe(true)
    expect(el.checked).toBe(true)
    expect(el.matches(':indeterminate')).toBe(true)
    expect(el.matches(':checked')).toBe(
      { chromium: false, firefox: true, webkit: true }[server.browser]
    )
  }
})

test('Checkbox', async () => {
  let checked = false
  let indeterminate = false

  function Page() {
    return (
      <Checkbox
        value='value1'
        checked={checked}
        indeterminate={indeterminate}
      />
    )
  }

  const { rerender, getByRole } = render(<Page />)

  const el = getByRole('checkbox')

  expect(el).toBeInstanceOf(HTMLInputElement)

  {
    indeterminate = false
    checked = false
    rerender(<Page />)
    expect(el.matches(':indeterminate')).toBe(false)
    expect(el.matches(':checked')).toBe(false)
  }

  {
    indeterminate = true
    checked = false
    rerender(<Page />)
    expect(el.matches(':indeterminate')).toBe(true)
    expect(el.matches(':checked')).toBe(false)
  }

  {
    indeterminate = false
    checked = true
    rerender(<Page />)
    expect(el.matches(':indeterminate')).toBe(false)
    expect(el.matches(':checked')).toBe(true)
  }

  {
    indeterminate = true
    checked = true
    rerender(<Page />)
    expect(el).toHaveProperty('indeterminate', false)
    expect(el).toHaveProperty('checked', true)
    expect(el.matches(':indeterminate')).toBe(false)
    expect(el.matches(':checked')).toBe(true)
  }
})
