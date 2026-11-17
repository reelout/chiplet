import type { ActivateCallback } from '#hook'
import { Keyboard, useKeyboard } from '#hook'
import type { NavigateCallback } from '#hook/accessibility/keyboard/hook'
import type { Parse } from '#hook/accessibility/keyboard/resolve'
import { createKeyboardEvent as createEvent } from '#test'
import { preventDefault, VirtualActive } from '#util'
import { render } from '@testing-library/react'
import { act, createRef } from 'react'
import {
  assert,
  beforeAll,
  beforeEach,
  expect,
  test,
  vi,
  type Mock,
} from 'vitest'

let ref: React.RefObject<Keyboard | null>

beforeAll(() => {
  Element.prototype.scrollIntoView ??= vi.fn()
})

beforeEach(() => {
  ref = createRef<Keyboard>()
})

function Page(props: {
  parse?: Parse | undefined
  onClick?: React.MouseEventHandler | undefined
  onActivate?: ActivateCallback | undefined
  onNavigate?: NavigateCallback | undefined
}) {
  return (
    <>
      <div
        data-testid='combobox'
        role='combobox'
        tabIndex={0}
        aria-controls='menu'
        aria-expanded={undefined}
        onKeyDown={(ev) => ref.current?.activate(ev)}
        onKeyUp={(ev) => ref.current?.activate(ev)}
        onClick={props.onClick}
      />

      <Menu data-testid='menu'>
        <Keyboard
          parse={props.parse}
          onNavigate={props.onNavigate}
          onActivate={props.onActivate}
          ref={ref}
        >
          <MenuItem data-testid='item1' onClick={props.onClick}>
            Item1
          </MenuItem>
          <MenuItem data-testid='item2' onClick={props.onClick} disabled={true}>
            Item2
          </MenuItem>
          <MenuItem data-testid='item3' onClick={props.onClick}>
            Item3
          </MenuItem>
          <MenuItem data-testid='item4' onClick={props.onClick}>
            Item4
          </MenuItem>
        </Keyboard>
      </Menu>
    </>
  )
}

function Menu(props: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role='menu' />
}

function MenuItem(
  props: React.ComponentProps<'div'> & {
    disabled?: boolean | undefined
  }
) {
  return <div {...useKeyboard(props)} role='menuitem' />
}

test('Keyboard - props', async () => {
  assert(render(<Keyboard />))
  assert(render(<Keyboard type='linear' direction='inline' />))
  assert(render(<Keyboard type='linear' direction='block' />))
  assert(render(<Keyboard type='linear' direction='both' />))
  assert(render(<Keyboard type='grid' direction='both' />))

  expect(() => render(<Keyboard type='grid' direction='inline' />)).toThrow(
    'Only direction "both" is allowed when type is "grid".'
  )
  expect(() => render(<Keyboard type='grid' direction='block' />)).toThrow(
    'Only direction "both" is allowed when type is "grid".'
  )
})

test('Keyboard - ref', async () => {
  {
    const ref = createRef<Keyboard>()

    render(<Keyboard ref={ref} />)

    expect(ref.current).toEqual({
      type: 'linear',
      direction: 'both',
      active: null,
      isFocusVisible: false,
      navigate: expect.any(Function),
      activate: expect.any(Function),
    })
  }

  {
    const ref = vi.fn()

    render(<Keyboard ref={ref} />)

    expect(ref).toHaveBeenCalledWith({
      type: 'linear',
      direction: 'both',
      active: null,
      isFocusVisible: false,
      navigate: expect.any(Function),
      activate: expect.any(Function),
    })
  }
})

test('Keyboard - press Enter/Space key to activate', async () => {
  const spy1 = vi.fn()
  const spy2 = vi.fn()

  const { getByTestId } = render(<Page onClick={spy1} onActivate={spy2} />)

  const combobox = getByTestId('combobox')

  await act(() => {
    combobox.focus()
  })

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: null,
    isFocusVisible: false,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  await act(() =>
    createEvent({ target: combobox, type: 'keydown', key: 'Enter' })
  )
  await act(() =>
    createEvent({ target: combobox, type: 'keyup', key: 'Enter' })
  )
  await act(() => createEvent({ target: combobox, type: 'keydown', key: ' ' }))
  await act(() => createEvent({ target: combobox, type: 'keyup', key: ' ' }))

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item1') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  await act(() =>
    createEvent({ target: combobox, type: 'keydown', key: 'Enter' })
  )
  await act(() =>
    createEvent({ target: combobox, type: 'keyup', key: 'Enter' })
  )
  await act(() => createEvent({ target: combobox, type: 'keydown', key: ' ' }))
  await act(() => createEvent({ target: combobox, type: 'keyup', key: ' ' }))

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item2') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  await act(() =>
    createEvent({ target: combobox, type: 'keydown', key: 'Enter' })
  )
  await act(() =>
    createEvent({ target: combobox, type: 'keyup', key: 'Enter' })
  )
  await act(() => createEvent({ target: combobox, type: 'keydown', key: ' ' }))
  await act(() => createEvent({ target: combobox, type: 'keyup', key: ' ' }))

  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'click',
      target: getByTestId('item1'),
      isTrusted: false,
    })
  )
  expect(spy1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      type: 'click',
      target: getByTestId('item1'),
      isTrusted: false,
    })
  )
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'keydown',
      target: getByTestId('combobox'),
      key: 'Enter',
      defaultPrevented: true,
    }),
    getByTestId('item1')
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      type: 'keyup',
      target: getByTestId('combobox'),
      key: ' ',
      defaultPrevented: true,
    }),
    getByTestId('item1')
  )
})

test('Keyboard - abort activation when losing focus', async () => {
  const spy1 = vi.fn()
  const spy2 = vi.fn()

  const { getByTestId } = render(<Page onClick={spy1} onNavigate={spy2} />)

  const combobox = getByTestId('combobox')

  await act(() => {
    combobox.focus()
  })

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item1') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  spy2.mockImplementationOnce(preventDefault)

  await act(() => createEvent({ target: combobox, type: 'keydown', key: ' ' }))

  expect(getByTestId('item1')).toHaveAttribute(VirtualActive, 'true')
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualActive)

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(getByTestId('item1')).toHaveAttribute(VirtualActive, 'true')
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualActive)

  await act(() => createEvent({ target: combobox, type: 'keyup', key: ' ' }))

  expect(getByTestId('item1')).not.toHaveAttribute(VirtualActive)
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualActive)
  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item1') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  await act(() => createEvent({ target: combobox, type: 'keydown', key: ' ' }))

  expect(getByTestId('item1')).toHaveAttribute(VirtualActive, 'true')
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualActive)

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(getByTestId('item1')).not.toHaveAttribute(VirtualActive)
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualActive)

  await act(() => createEvent({ target: combobox, type: 'keyup', key: ' ' }))

  expect(getByTestId('item1')).not.toHaveAttribute(VirtualActive)
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualActive)
  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item2') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'click',
      target: getByTestId('item1'),
      isTrusted: false,
    })
  )
  expect(spy2).toHaveBeenCalledTimes(3)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    expect.objectContaining({ value: getByTestId('item1') }),
    null
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: true }),
    expect.objectContaining({ value: getByTestId('item2') }),
    expect.objectContaining({ value: getByTestId('item1') })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: true }),
    expect.objectContaining({ value: getByTestId('item2') }),
    expect.objectContaining({ value: getByTestId('item1') })
  )
})

test('Keyboard - parse', async () => {
  let parse: Mock<Parse> | undefined = undefined

  const { getByTestId, rerender } = render(<Page parse={parse} />)

  const combobox = getByTestId('combobox')

  await act(() => {
    combobox.focus()
  })

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item1') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  parse = vi.fn(() => undefined)
  rerender(<Page parse={parse} />)

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item2') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  parse.mockReturnValue(null)

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item2') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  parse.mockReturnValue('End')

  await act(() =>
    ref.current?.navigate(
      createEvent({ target: combobox, key: 'Unidentified' })
    )
  )

  expect(ref.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item4') }),
    isFocusVisible: true,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })
})
