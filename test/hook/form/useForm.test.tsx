import { FormContext, useForm } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { render } from '@testing-library/react'
import { act, use, useLayoutEffect } from 'react'
import { beforeEach, expect, test, vi } from 'vitest'

let context: FormContext<{}> | null

beforeEach(() => {
  context = null
})

interface Props<T extends object> extends React.PropsWithChildren {
  role?: React.AriaRole | undefined
  tabIndex?: number | undefined
  defaultValue?: T | undefined
  value?: T | undefined
  onChange?:
    ((ev: React.SyntheticEvent<HTMLDivElement>, value: T) => void) | undefined
}

function Page<T extends Record<string, unknown>>(props: Props<T>) {
  if (props.children === undefined) {
    props = { ...props, children: <Item /> }
  }

  const { defaultValue, value, onChange, ...attrs } = useForm(props)

  return <div {...attrs} />
}

function Item(props: React.ComponentProps<'div'>) {
  const formContext = use(FormContext)

  useLayoutEffect(() => {
    context = formContext
  })

  return <div {...props} role='menuitem' />
}

test('useForm - props', () => {
  const { getByRole } = render(
    <Page role='group' tabIndex={-1}>
      <Item>Item 1</Item>
    </Page>
  )

  expect(getByRole('group')).toBeInstanceOf(HTMLElement)
  expect(getByRole('group')).toHaveAttribute('tabIndex', '-1')
  expect(getByRole('menuitem')).toHaveTextContent('Item 1')

  expect(context).toEqual({
    value: {},
    onChange: expect.any(Function),
  })
})

test('useForm - defaultValue', async () => {
  render(<Page defaultValue={{ name: '1' }} />)

  expect(context).toEqual({
    value: { name: '1' },
    onChange: expect.any(Function),
  })

  await act(() => context?.onChange(createEvent({}), { name: '2' }))

  expect(context).toEqual({
    value: { name: '2' },
    onChange: expect.any(Function),
  })
})

test('useForm - value', async () => {
  const { rerender } = render(<Page value={{ name: '1' }} />)

  expect(context).toEqual({
    value: { name: '1' },
    onChange: expect.any(Function),
  })

  await act(() => context?.onChange(createEvent({}), { name: '2' }))

  expect(context).toEqual({
    value: { name: '1' },
    onChange: expect.any(Function),
  })

  rerender(<Page value={{ name: '2' }} />)

  expect(context).toEqual({
    value: { name: '2' },
    onChange: expect.any(Function),
  })
})

test('useForm - onChange', async () => {
  const spy = vi.fn()

  render(<Page onChange={spy} />)

  expect(context).toEqual({
    value: {},
    onChange: expect.any(Function),
  })

  await act(() => context?.onChange(createEvent({}), { name: '1' }))

  expect(context?.value).toEqual({ name: '1' })
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(
    expect.objectContaining({ type: 'keydown', defaultPrevented: false }),
    { name: '1' }
  )
})
