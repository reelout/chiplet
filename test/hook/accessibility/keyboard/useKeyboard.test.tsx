import { Keyboard, useKeyboard } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { VirtualActive, VirtualFocus, preventDefault } from '#util'
import { render } from '@testing-library/react'
import { act, createRef, useEffect } from 'react'
import { beforeAll, expect, test, vi } from 'vitest'

beforeAll(() => {
  Element.prototype.scrollIntoView ??= vi.fn()
})

test('useKeyboard - props', async () => {
  const item1 = createRef()
  const item2 = createRef()
  const ref1 = vi.fn()
  const ref2 = vi.fn()
  const props1 = Object.freeze({ ref: ref1 })
  const props2 = Object.freeze({ ref: ref2 })

  function Page() {
    const keyboard1 = useKeyboard(props1)
    const keyboard2 = useKeyboard(props2)

    useEffect(() => {
      item1.current = keyboard1
      item2.current = keyboard2
    })

    return (
      <>
        {}
        <div {...keyboard1} />
        {}
        <div {...keyboard2} />
      </>
    )
  }

  {
    render(<Page />)

    expect(item1.current).toBe(props1)
    expect(item2.current).toBe(props2)
    expect(ref1).toHaveBeenCalledTimes(1)
    expect(ref1).toHaveBeenLastCalledWith(expect.any(HTMLElement))
    expect(ref2).toHaveBeenCalledTimes(1)
    expect(ref2).toHaveBeenLastCalledWith(expect.any(HTMLElement))
  }

  vi.clearAllMocks()

  {
    render(
      <Keyboard>
        <Page />
      </Keyboard>
    )

    expect(item1.current).toEqual({
      id: expect.stringMatching(/^\0[a-z0-9]{8}$/),
      tabIndex: 0,
      [VirtualFocus]: undefined,
      [VirtualActive]: undefined,
      onKeyDown: expect.any(Function),
      ref: expect.any(Function),
    })
    expect(item2.current).toEqual({
      id: expect.stringMatching(/^\0[a-z0-9]{8}$/),
      tabIndex: -1,
      [VirtualFocus]: undefined,
      [VirtualActive]: undefined,
      onKeyDown: expect.any(Function),
      ref: expect.any(Function),
    })
    expect(ref1).toHaveBeenCalledTimes(1)
    expect(ref1).toHaveBeenLastCalledWith(expect.any(HTMLElement))
    expect(ref2).toHaveBeenCalledTimes(1)
    expect(ref2).toHaveBeenLastCalledWith(expect.any(HTMLElement))
  }
})

test('useKeyboard - state', async () => {
  function Menu(props: React.HTMLAttributes<HTMLDivElement>) {
    return <div {...props} role='menu' />
  }

  function MenuItem(props: {
    disabled?: boolean | undefined
    ref?: React.Ref<HTMLDivElement> | undefined
  }) {
    return <div {...useKeyboard(props)} role='menuitem' />
  }

  const ref = createRef<Keyboard>()
  const item1 = createRef<HTMLDivElement>()
  const item2 = createRef<HTMLDivElement>()

  const { getByTestId } = render(
    <>
      <div
        data-testid='combobox'
        role='combobox'
        tabIndex={0}
        aria-controls='menu'
        aria-expanded={undefined}
        onKeyDown={(ev) => {
          ref.current?.navigate(ev)
          ref.current?.activate(ev)
        }}
        onKeyUp={(ev) => {
          ref.current?.activate(ev)
        }}
      />

      <Menu data-testid='menu'>
        <Keyboard ref={ref}>
          <MenuItem data-testid='item1' ref={item1} />
          <MenuItem data-testid='item2' ref={item2} disabled={true} />
        </Keyboard>
      </Menu>
    </>
  )

  const combobox = getByTestId('combobox')

  await act(() => {
    combobox.focus()
  })

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '0')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).not.toHaveAttribute(VirtualFocus)
  expect(item2.current).not.toHaveAttribute(VirtualFocus)
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '0')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item2.current).not.toHaveAttribute(VirtualFocus)
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    createEvent({ target: combobox, type: 'keydown', key: 'Enter' })
  )

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '0')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item2.current).not.toHaveAttribute(VirtualFocus)
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    createEvent({ target: combobox, type: 'keyup', key: 'Enter' })
  )

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '0')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item2.current).not.toHaveAttribute(VirtualFocus)
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() => createEvent({ target: combobox, type: 'keydown', key: ' ' }))

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '0')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item2.current).not.toHaveAttribute(VirtualFocus)
  expect(item1.current).toHaveAttribute(VirtualActive, 'true')
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() => createEvent({ target: combobox, type: 'keyup', key: ' ' }))

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '0')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item2.current).not.toHaveAttribute(VirtualFocus)
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    ref.current?.navigate(createEvent({ target: combobox, key: 'ArrowDown' }))
  )

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '-1')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).not.toHaveAttribute(VirtualFocus)
  expect(item2.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    createEvent({ target: combobox, type: 'keydown', key: 'Enter' })
  )

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '-1')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).not.toHaveAttribute(VirtualFocus)
  expect(item2.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    createEvent({ target: combobox, type: 'keyup', key: 'Enter' })
  )

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '-1')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).not.toHaveAttribute(VirtualFocus)
  expect(item2.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() => createEvent({ target: combobox, type: 'keydown', key: ' ' }))

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '-1')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).not.toHaveAttribute(VirtualFocus)
  expect(item2.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)

  await act(() => createEvent({ target: combobox, type: 'keyup', key: ' ' }))

  expect(combobox).toHaveFocus()
  expect(item1.current).toHaveAttribute('tabIndex', '-1')
  expect(item2.current).toHaveAttribute('tabIndex', '-1')
  expect(item1.current).not.toHaveAttribute(VirtualFocus)
  expect(item2.current).toHaveAttribute(VirtualFocus, 'true')
  expect(item1.current).not.toHaveAttribute(VirtualActive)
  expect(item2.current).not.toHaveAttribute(VirtualActive)
})

test('useKeyboard - navigate', async () => {
  const ref1 = createRef<HTMLDivElement>()
  const ref2 = createRef<HTMLDivElement>()

  function Page() {
    return (
      <>
        <div {...useKeyboard({ ref: ref1 })} />
        <div {...useKeyboard({ ref: ref2 })} />
      </>
    )
  }

  render(
    <Keyboard>
      <Page />
    </Keyboard>
  )

  expect(document.body).toHaveFocus()
  expect(ref1.current).toHaveAttribute('tabIndex', '0')
  expect(ref2.current).toHaveAttribute('tabIndex', '-1')
  expect(ref1.current).not.toHaveAttribute(VirtualFocus)
  expect(ref2.current).not.toHaveAttribute(VirtualFocus)
  expect(ref1.current).not.toHaveAttribute(VirtualActive)
  expect(ref2.current).not.toHaveAttribute(VirtualActive)

  await act(() => ref1.current?.focus())

  expect(ref1.current).toHaveFocus()
  expect(ref1.current).toHaveAttribute('tabIndex', '0')
  expect(ref2.current).toHaveAttribute('tabIndex', '-1')
  expect(ref1.current).not.toHaveAttribute(VirtualFocus)
  expect(ref2.current).not.toHaveAttribute(VirtualFocus)
  expect(ref1.current).not.toHaveAttribute(VirtualActive)
  expect(ref2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(ref2.current).toHaveFocus()
  expect(ref1.current).toHaveAttribute('tabIndex', '-1')
  expect(ref2.current).toHaveAttribute('tabIndex', '0')
  expect(ref1.current).not.toHaveAttribute(VirtualFocus)
  expect(ref2.current).not.toHaveAttribute(VirtualFocus)
  expect(ref1.current).not.toHaveAttribute(VirtualActive)
  expect(ref2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(ref1.current).toHaveFocus()
  expect(ref1.current).toHaveAttribute('tabIndex', '0')
  expect(ref2.current).toHaveAttribute('tabIndex', '-1')
  expect(ref1.current).not.toHaveAttribute(VirtualFocus)
  expect(ref2.current).not.toHaveAttribute(VirtualFocus)
  expect(ref1.current).not.toHaveAttribute(VirtualActive)
  expect(ref2.current).not.toHaveAttribute(VirtualActive)
})

test('useKeyboard - do not navigate when default behavior is prevented', async () => {
  const ref1 = createRef<HTMLDivElement>()
  const ref2 = createRef<HTMLDivElement>()
  const spy = vi.fn().mockImplementationOnce(preventDefault)

  function Page() {
    return (
      <>
        <div {...useKeyboard({ onKeyDown: spy, ref: ref1 })} />
        <div {...useKeyboard({ onKeyDown: spy, ref: ref2 })} />
      </>
    )
  }

  render(
    <Keyboard>
      <Page />
    </Keyboard>
  )

  await act(() => ref1.current?.focus())

  expect(ref1.current).toHaveFocus()
  expect(ref1.current).toHaveAttribute('tabIndex', '0')
  expect(ref2.current).toHaveAttribute('tabIndex', '-1')
  expect(ref1.current).not.toHaveAttribute(VirtualFocus)
  expect(ref2.current).not.toHaveAttribute(VirtualFocus)
  expect(ref1.current).not.toHaveAttribute(VirtualActive)
  expect(ref2.current).not.toHaveAttribute(VirtualActive)

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(ref2.current).toHaveFocus()
  expect(ref1.current).toHaveAttribute('tabIndex', '-1')
  expect(ref2.current).toHaveAttribute('tabIndex', '0')
  expect(ref1.current).not.toHaveAttribute(VirtualFocus)
  expect(ref2.current).not.toHaveAttribute(VirtualFocus)
  expect(ref1.current).not.toHaveAttribute(VirtualActive)
  expect(ref2.current).not.toHaveAttribute(VirtualActive)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      key: 'ArrowDown',
      target: ref1.current,
      defaultPrevented: true,
    })
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'ArrowDown',
      target: ref1.current,
      defaultPrevented: true,
    })
  )
})
