import '#.mock/popover'
import {
  Keyboard,
  useClose,
  useController,
  useKeyboard,
  useOverlay,
  usePopover,
  type NavigationDirection,
  type Overlay,
  type PopoverOptions,
  type PositioningOptions,
} from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { VirtualFocus, preventDefault } from '#util'
import { render } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import {
  act,
  createRef,
  useCallback,
  useEffect,
  useState,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { beforeAll, beforeEach, expect, test, vi, type Mock } from 'vitest'

let anchorRef: RefObject<HTMLButtonElement | null>
let positionedRef: RefObject<HTMLDivElement | null>
let overlayRef: RefObject<Overlay<HTMLDivElement> | null>
let keyboardRef: RefObject<Keyboard | null>
let onKeyDown: Mock
let onToggle: Mock

beforeAll(() => {
  HTMLElement.prototype.scrollIntoView ??= vi.fn()
})

beforeEach(() => {
  anchorRef = createRef()
  positionedRef = createRef()
  overlayRef = createRef()
  keyboardRef = createRef()
  onKeyDown = vi.fn()
  onToggle = vi.fn()

  document.body.style.margin = '0'
  document.body.style.padding = '160px'
})

function Portal(props: React.PropsWithChildren) {
  return createPortal(props.children, document.body)
}

function Popover(props: PopoverOptions<'div'>) {
  const popover = usePopover(props)

  return (
    <>
      {popover.anchor}
      {popover.overlay.open && (
        <Portal>
          <div {...popover.positioned.props} />
        </Portal>
      )}
    </>
  )
}

function Page(props: {
  disabled?: boolean
  positioning?: PositioningOptions
  direction?: NavigationDirection
  isRTL?: boolean
  isEmpty?: boolean
}) {
  const overlay = useOverlay({
    anchorRef,
    positionedRef,
    onToggle,
  })

  useEffect(() => {
    overlayRef.current = overlay
  })

  const [_, setKeyboardRef] = useState<Keyboard | null>(null)

  const saveKeyboardRef = useCallback((ref: Keyboard | null) => {
    setKeyboardRef((keyboardRef.current = ref))
  }, [])

  return (
    <div dir={props.isRTL ? 'rtl' : undefined}>
      <MenuButton
        {...useController(
          {
            dir: props.isRTL ? 'rtl' : undefined,
            disabled: props.disabled,
            'aria-expanded': overlay.open,
            'aria-haspopup': true,
            onClick: overlay.toggle,
            onKeyDown,
            ref: anchorRef,
          },
          props.positioning?.position ?? 'below',
          overlay,
          keyboardRef.current
        )}
      />
      {overlay.open && (
        <Portal>
          <Keyboard
            direction={props.direction ?? 'block'}
            ref={saveKeyboardRef}
          >
            <Menu ref={positionedRef}>
              {props.isEmpty ? null : (
                <>
                  <MenuItem data-testid='item1'>Item 1</MenuItem>
                  <MenuItem>Alpha</MenuItem>
                  <MenuItem data-testid='item2'>Item 2</MenuItem>
                  <MenuItem>Beta</MenuItem>
                  <MenuItem data-testid='item3'>Item 3</MenuItem>
                </>
              )}
            </Menu>
          </Keyboard>
        </Portal>
      )}
    </div>
  )
}

function MenuButton(props: React.ComponentProps<'button'>) {
  return <button {...props} />
}

function Menu(props: React.ComponentProps<'div'>) {
  return <div {...props} role='menu' />
}

function MenuItem(props: React.ComponentProps<'div'>) {
  return <div {...useClose(useKeyboard(props))} role='menuitem' />
}

test('useController - open and move focus', { timeout: 60_000 }, async () => {
  for (const [key, position, direction, open, itemId, opposite] of [
    ['ArrowUp', 'above-start', 'block', true, 'item3', false],
    ['ArrowUp', 'above-end', 'block', true, 'item3', false],
    ['ArrowUp', 'below-start', 'block', true, 'item3', false],
    ['ArrowUp', 'below-end', 'block', true, 'item3', false],
    ['ArrowUp', 'above-start', 'inline', true, 'item3', false],
    ['ArrowUp', 'above-end', 'inline', true, 'item3', false],
    ['ArrowUp', 'below-start', 'inline', true, 'item3', false],
    ['ArrowUp', 'below-end', 'inline', true, 'item3', false],

    ['ArrowDown', 'above-start', 'block', true, 'item1', false],
    ['ArrowDown', 'above-end', 'block', true, 'item1', false],
    ['ArrowDown', 'below-start', 'block', true, 'item1', false],
    ['ArrowDown', 'below-end', 'block', true, 'item1', false],
    ['ArrowDown', 'above-start', 'inline', true, 'item1', false],
    ['ArrowDown', 'above-end', 'inline', true, 'item1', false],
    ['ArrowDown', 'below-start', 'inline', true, 'item1', false],
    ['ArrowDown', 'below-end', 'inline', true, 'item1', false],

    ['ArrowLeft', 'before-start', 'block', true, 'item1', true],
    ['ArrowLeft', 'before-end', 'block', true, 'item3', true],
    ['ArrowLeft', 'after-start', 'block', false, 'item1', false],
    ['ArrowLeft', 'after-end', 'block', false, 'item3', false],
    ['ArrowLeft', 'before-start', 'inline', true, 'item1', true],
    ['ArrowLeft', 'before-end', 'inline', true, 'item3', true],
    ['ArrowLeft', 'after-start', 'inline', false, 'item1', false],
    ['ArrowLeft', 'after-end', 'inline', false, 'item3', false],

    ['ArrowRight', 'before-start', 'block', false, 'item1', false],
    ['ArrowRight', 'before-end', 'block', false, 'item3', false],
    ['ArrowRight', 'after-start', 'block', true, 'item1', true],
    ['ArrowRight', 'after-end', 'block', true, 'item3', true],
    ['ArrowRight', 'before-start', 'inline', false, 'item1', false],
    ['ArrowRight', 'before-end', 'inline', false, 'item3', false],
    ['ArrowRight', 'after-start', 'inline', true, 'item1', true],
    ['ArrowRight', 'after-end', 'inline', true, 'item3', true],

    ['Unidentified', 'before-start', 'block', false, 'item1', true],
    ['Unidentified', 'before-end', 'block', false, 'item1', true],
    ['Unidentified', 'after-start', 'block', false, 'item3', true],
    ['Unidentified', 'after-end', 'block', false, 'item3', true],
    ['Unidentified', 'before-start', 'inline', false, 'item1', true],
    ['Unidentified', 'before-end', 'inline', false, 'item1', true],
    ['Unidentified', 'after-start', 'inline', false, 'item3', true],
    ['Unidentified', 'after-end', 'inline', false, 'item3', true],
  ] as const) {
    {
      onKeyDown.mockClear()

      const { unmount, getByTestId } = render(
        <Page positioning={{ position }} direction={direction} />
      )

      expect(overlayRef.current?.open).toBe(false)

      await act(() => createEvent({ target: anchorRef.current, key }))

      expect(overlayRef.current?.open).toBe(open)

      if (open) {
        expect(document.activeElement).toBe(getByTestId(itemId))
      } else {
        expect(document.activeElement).toBe(document.body)
      }

      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key, defaultPrevented: open })
      )

      unmount()
    }

    {
      onKeyDown.mockClear()

      const { unmount, getByTestId } = render(
        <Page positioning={{ position }} direction={direction} isRTL={true} />
      )

      expect(overlayRef.current?.open).toBe(false)

      await act(() => createEvent({ target: anchorRef.current, key }))

      expect(overlayRef.current?.open).toBe(!opposite)

      if (!opposite) {
        expect(document.activeElement).toBe(getByTestId(itemId))
      } else {
        expect(document.activeElement).toBe(document.body)
      }

      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key, defaultPrevented: !opposite })
      )

      unmount()
    }

    {
      onKeyDown.mockClear()

      const { unmount, getByTestId } = render(
        <Page positioning={{ position }} direction={direction} />
      )

      expect(overlayRef.current?.open).toBe(false)

      await act(() => anchorRef.current?.click())

      expect(overlayRef.current?.open).toBe(true)

      await act(() => createEvent({ target: anchorRef.current, key }))

      expect(overlayRef.current?.open).toBe(true)

      if (open) {
        expect(document.activeElement).toBe(getByTestId(itemId))
      } else {
        expect(document.activeElement).not.toBe(getByTestId(itemId))
      }

      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key, defaultPrevented: open })
      )

      unmount()
    }

    {
      onKeyDown.mockClear()

      const { unmount, queryByTestId } = render(
        <Page positioning={{ position }} direction={direction} isEmpty={true} />
      )

      expect(overlayRef.current?.open).toBe(false)

      await act(() => anchorRef.current?.click())

      expect(overlayRef.current?.open).toBe(true)

      await act(() => createEvent({ target: anchorRef.current, key }))

      expect(overlayRef.current?.open).toBe(true)

      expect(queryByTestId(itemId)).toBeNull()
      expect(document.activeElement).toBe(document.body)

      expect(onKeyDown).toHaveBeenCalledTimes(1)
      expect(onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key, defaultPrevented: false })
      )

      unmount()
    }
  }
})

test('useController - abort when losing focus', async () => {
  render(<Page positioning={{ position: 'below' }} />)

  expect(overlayRef.current?.open).toBe(false)

  await act(() => {
    anchorRef.current?.focus()
    createEvent({ target: anchorRef.current, key: 'ArrowDown' })
    anchorRef.current?.blur()
  })

  expect(overlayRef.current?.open).toBe(true)
  expect(document.activeElement).toBe(document.body)
})

test('useController - prevent default on keydown event to abort opening popover', async () => {
  onKeyDown.mockImplementation((ev: Event) => ev.preventDefault())

  render(<Page positioning={{ position: 'below' }} />)

  expect(overlayRef.current?.open).toBe(false)

  await act(() => createEvent({ target: anchorRef.current, key: 'ArrowDown' }))

  expect(overlayRef.current?.open).toBe(false)
})

test('useController - prevent default on toggle event to abort opening popover', async () => {
  onToggle.mockImplementation((ev: Event) => ev.preventDefault())

  render(<Page positioning={{ position: 'below' }} />)

  expect(overlayRef.current?.open).toBe(false)

  await act(() => createEvent({ target: anchorRef.current, key: 'ArrowDown' }))

  expect(overlayRef.current?.open).toBe(false)
})

test('useController - prevent opening popover when button is disabled', async () => {
  render(<Page disabled={true} positioning={{ position: 'below' }} />)

  expect(overlayRef.current?.open).toBe(false)
  expect(anchorRef.current?.disabled).toBe(true)

  await act(() => createEvent({ target: anchorRef.current, key: 'ArrowDown' }))

  expect(overlayRef.current?.open).toBe(false)
  expect(anchorRef.current?.disabled).toBe(true)
})

test('useController - allow to open popover even when missing aria-haspopup attribute on button', async () => {
  render(<Page positioning={{ position: 'below' }} />)

  expect(overlayRef.current?.open).toBe(false)
  expect(anchorRef.current).toHaveAttribute('aria-haspopup', 'true')

  anchorRef.current?.removeAttribute('aria-haspopup')

  await act(() => createEvent({ target: anchorRef.current, key: 'ArrowDown' }))

  expect(overlayRef.current?.open).toBe(true)
  expect(anchorRef.current).not.toHaveAttribute('aria-haspopup')
})

test('useController - first open popover and then press ArrowDown key to move focus', async () => {
  render(<Page positioning={{ position: 'below' }} />)

  expect(overlayRef.current?.open).toBe(false)
  expect(anchorRef.current).toHaveAttribute('aria-expanded', 'false')

  await act(() => anchorRef.current?.click())

  expect(overlayRef.current?.open).toBe(true)
  expect(anchorRef.current).toHaveAttribute('aria-expanded', 'true')

  await act(() => createEvent({ target: anchorRef.current, key: 'ArrowDown' }))

  expect(overlayRef.current?.open).toBe(true)
  expect(document.activeElement).toMatchObject({ textContent: 'Item 1' })
})

test('useController - type first letter to move focus', async () => {
  render(<Page positioning={{ position: 'below' }} />)

  expect(overlayRef.current?.open).toBe(false)
  expect(anchorRef.current).toHaveAttribute('aria-expanded', 'false')

  await act(() => anchorRef.current?.click())

  expect(overlayRef.current?.open).toBe(true)
  expect(anchorRef.current).toHaveAttribute('aria-expanded', 'true')

  await act(() => createEvent({ target: anchorRef.current, key: 'ArrowDown' }))

  expect(overlayRef.current?.open).toBe(true)
  expect(document.activeElement).toMatchObject({ textContent: 'Item 1' })

  for (const [key, expected] of [
    ['B', 'Beta'],
    ['Z', 'Beta'],
    ['I', 'Item 3'],
    ['A', 'Alpha'],
    ['I', 'Item 2'],
    ['I', 'Item 3'],
    ['I', 'Item 1'],
    ['I', 'Item 2'],
  ] as const) {
    await act(() => createEvent({ target: document.activeElement, key }))
    expect(document.activeElement).toMatchObject({ textContent: expected })
  }
})

test('useController - cross navigation (menubar)', async () => {
  function Page() {
    return (
      <Keyboard direction='both'>
        <MenuItem data-testid='item1'>Item 1</MenuItem>
        <Popover
          role='menu'
          anchor={<MenuItem data-testid='item2'>Item 2</MenuItem>}
          keyboard='block'
          ref={overlayRef}
        >
          <MenuItem data-testid='itemA'>Item A</MenuItem>
          <MenuItem data-testid='itemB'>Item B</MenuItem>
          <MenuItem data-testid='itemC'>Item C</MenuItem>
        </Popover>
        <MenuItem data-testid='item3'>Item 3</MenuItem>
      </Keyboard>
    )
  }

  const { getByTestId } = render(<Page />)

  await act(() => getByTestId('item3').focus())

  expect(overlayRef.current?.open).toBe(false)
  expect(getByTestId('item3')).toHaveFocus()

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowRight' })
  )

  expect(overlayRef.current?.open).toBe(false)
  expect(getByTestId('item1')).toHaveFocus()

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(overlayRef.current?.open).toBe(false)
  expect(getByTestId('item2')).toHaveFocus()

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(overlayRef.current?.open).toBe(true)
  expect(getByTestId('itemA')).toHaveFocus()

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(overlayRef.current?.open).toBe(true)
  expect(getByTestId('itemB')).toHaveFocus()

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowRight' })
  )

  expect(overlayRef.current?.open).toBe(true)
  expect(getByTestId('itemB')).toHaveFocus()
})

test('useController - menu - generate id for menu item when id is not provided', async () => {
  function Page() {
    return (
      <Popover
        role='menu'
        anchor={<MenuButton data-testid='button' ref={anchorRef} />}
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' />
        <MenuItem id='' data-testid='item2' />
      </Popover>
    )
  }

  const { getByTestId } = render(<Page />)

  await act(() => getByTestId('button').focus())
  await act(() => getByTestId('button').click())

  expect(getByTestId('item1')).toHaveAttribute('id', 'item1')
  expect(getByTestId('item2')).toHaveAttribute(
    'id',
    expect.stringMatching(/^\0[a-z0-9]{8}$/)
  )

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('item1')).toHaveFocus()
  expect(getByTestId('item1')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item1')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('item2')).toHaveFocus()
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute(
    'aria-activedescendant',
    expect.stringMatching(/^\0[a-z0-9]{8}$/)
  )

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('item1')).toHaveFocus()
  expect(getByTestId('item1')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item1')
})

test('useController - menu - regain focus', async () => {
  function Page() {
    return (
      <Popover
        role='menu'
        anchor={<MenuButton data-testid='button' ref={anchorRef} />}
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' />
        <MenuItem id='item2' data-testid='item2' />
        <MenuItem id='item3' data-testid='item3' />
      </Popover>
    )
  }

  const { getByTestId } = render(<Page />)

  await act(() => getByTestId('button').focus())
  await act(() => getByTestId('button').click())
  await act(() => getByTestId('item2').focus())

  expect(getByTestId('item2')).toHaveFocus()
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')

  await act(() => getByTestId('button').focus())

  expect(getByTestId('button')).toHaveFocus()
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('item1')).toHaveFocus()
  expect(getByTestId('item1')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item1')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('item2')).toHaveFocus()
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')
})

test('useController - menu - active element is removed from the DOM', async () => {
  let hidden = false

  function Page() {
    return (
      <Popover
        role='menu'
        anchor={<MenuButton data-testid='button' ref={anchorRef} />}
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' />
        {hidden ? null : <MenuItem id='item2' data-testid='item2' />}
        <MenuItem id='item3' data-testid='item3' />
      </Popover>
    )
  }

  const { rerender, getByTestId, queryByTestId } = render(<Page />)

  await act(() => getByTestId('button').focus())
  await act(() => getByTestId('button').click())
  await act(() => getByTestId('item2').focus())

  expect(getByTestId('item2')).toHaveFocus()
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')

  hidden = true
  rerender(<Page />)

  expect(document.body).toHaveFocus()
  expect(queryByTestId('item2')).toBeNull()
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await act(() => getByTestId('button').focus())
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('item1')).toHaveFocus()
  expect(getByTestId('item1')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item1')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('item3')).toHaveFocus()
  expect(getByTestId('item3')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item3')
})

test('useController - combobox - active element is out of focus', async () => {
  const anchorRef = createRef<HTMLInputElement>()

  function Page() {
    return (
      <Popover
        role='listbox'
        anchor={
          <input
            data-testid='combobox'
            role='combobox'
            aria-controls={undefined}
            aria-expanded={undefined}
            ref={anchorRef}
          />
        }
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' role='option' />
        <MenuItem id='item2' data-testid='item2' role='option' />
        <MenuItem id='item3' data-testid='item3' role='option' />
      </Popover>
    )
  }

  const { getByTestId } = render(<Page />)

  await act(() => getByTestId('combobox').focus())
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('item2')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')

  await act(() => getByTestId('combobox').blur())

  expect(document.body).toHaveFocus()
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await act(() => getByTestId('combobox').focus())
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('item1')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item1')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('item2')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')
})

test('useController - combobox - active element is removed from the DOM', async () => {
  const anchorRef = createRef<HTMLInputElement>()
  let hidden = false

  function Page() {
    return (
      <Popover
        role='listbox'
        anchor={
          <input
            data-testid='combobox'
            role='combobox'
            aria-controls={undefined}
            aria-expanded={undefined}
            ref={anchorRef}
          />
        }
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' role='option' />
        {hidden ? null : (
          <MenuItem id='item2' data-testid='item2' role='option' />
        )}
        <MenuItem id='item3' data-testid='item3' role='option' />
      </Popover>
    )
  }

  const { rerender, getByTestId, queryByTestId } = render(<Page />)

  await act(() => getByTestId('combobox').focus())
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('item2')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')

  hidden = true
  rerender(<Page />)

  expect(getByTestId('combobox')).toHaveFocus()
  expect(queryByTestId('item2')).toBeNull()
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('item1')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item1')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('item3')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item3')
})

test('useController - combobox - press Enter key to trigger click event on the active element', async () => {
  const anchorRef = createRef<HTMLInputElement>()
  const spy1 = vi.fn()
  const spy2 = vi.fn()

  function Page() {
    return (
      <Popover
        role='listbox'
        anchor={
          <input
            data-testid='combobox'
            role='combobox'
            aria-controls={undefined}
            aria-expanded={undefined}
            onClick={spy2}
            onKeyDown={spy2}
            ref={anchorRef}
          />
        }
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' role='option' onClick={spy1} />
        <MenuItem id='item2' data-testid='item2' role='option' onClick={spy1} />
        <MenuItem id='item3' data-testid='item3' role='option' onClick={spy1} />
      </Popover>
    )
  }

  const { getByTestId } = render(<Page />)

  await act(() => getByTestId('combobox').focus())
  await act(() => getByTestId('combobox').click())

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(getByTestId('item1')).not.toHaveAttribute(VirtualFocus)
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(getByTestId('item3')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(getByTestId('item2')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')

  await userEvent.keyboard('{Enter}')

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'false')
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')
  expect(anchorRef.current).toHaveProperty('value', '')
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'click',
      target: expect.objectContaining({
        dataset: expect.objectContaining({ testid: 'item2' }),
      }),
    })
  )
  expect(spy2).toHaveBeenCalledTimes(4)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'click',
      defaultPrevented: false,
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      type: 'keydown',
      key: 'ArrowDown',
      defaultPrevented: true,
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      type: 'keydown',
      key: 'ArrowDown',
      defaultPrevented: true,
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({
      type: 'keydown',
      key: 'Enter',
      defaultPrevented: true,
    })
  )
})

test('useController - combobox - press Space key to trigger click event on the active element', async () => {
  const anchorRef = createRef<HTMLInputElement>()
  const spy1 = vi.fn()
  const spy2 = vi.fn()
  const spy3 = vi.fn().mockImplementationOnce(preventDefault)

  function Page() {
    return (
      <Popover
        role='listbox'
        anchor={
          <input
            data-testid='combobox'
            role='combobox'
            aria-controls={undefined}
            aria-expanded={undefined}
            onClick={spy2}
            onKeyDown={spy2}
            onKeyUp={spy3}
            ref={anchorRef}
          />
        }
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' role='option' onClick={spy1} />
        <MenuItem id='item2' data-testid='item2' role='option' onClick={spy1} />
        <MenuItem id='item3' data-testid='item3' role='option' onClick={spy1} />
      </Popover>
    )
  }

  const { getByTestId } = render(<Page />)

  await act(() => getByTestId('combobox').focus())
  await act(() => getByTestId('combobox').click())

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(getByTestId('item1')).not.toHaveAttribute(VirtualFocus)
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(getByTestId('item3')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(getByTestId('item2')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')

  await userEvent.keyboard(' ')

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')
  expect(anchorRef.current).toHaveProperty('value', '')

  await userEvent.keyboard(' ')

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'false')
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')
  expect(anchorRef.current).toHaveProperty('value', '')
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'click',
      target: expect.objectContaining({
        dataset: expect.objectContaining({ testid: 'item2' }),
      }),
    })
  )
  expect(spy2).toHaveBeenCalledTimes(5)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'click',
      defaultPrevented: false,
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      type: 'keydown',
      key: 'ArrowDown',
      defaultPrevented: true,
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      type: 'keydown',
      key: 'ArrowDown',
      defaultPrevented: true,
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({
      type: 'keydown',
      key: ' ',
      defaultPrevented: true,
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({
      type: 'keydown',
      key: ' ',
      defaultPrevented: true,
    })
  )
  expect(spy3).toHaveBeenCalledTimes(2)
  expect(spy3).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'keyup',
      key: ' ',
      defaultPrevented: true,
    })
  )
  expect(spy3).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      type: 'keyup',
      key: ' ',
      defaultPrevented: true,
    })
  )
})

test('useController - combobox - close popover without triggering click event on the active element since it is removed from the DOM', async () => {
  const anchorRef = createRef<HTMLButtonElement>()
  const spy = vi.fn()
  let hidden = false

  function Page() {
    return (
      <Popover
        role='listbox'
        anchor={
          <button
            data-testid='combobox'
            role='combobox'
            aria-controls={undefined}
            aria-expanded={undefined}
            ref={anchorRef}
          />
        }
        ref={overlayRef}
      >
        <MenuItem id='item1' data-testid='item1' role='option' onClick={spy} />
        {hidden ? null : (
          <MenuItem
            id='item2'
            data-testid='item2'
            role='option'
            onClick={spy}
          />
        )}
        <MenuItem id='item3' data-testid='item3' role='option' onClick={spy} />
      </Popover>
    )
  }

  const { rerender, getByTestId, queryByTestId } = render(<Page />)

  await act(() => getByTestId('combobox').focus())
  await act(() => getByTestId('combobox').click())

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(getByTestId('item1')).not.toHaveAttribute(VirtualFocus)
  expect(getByTestId('item2')).not.toHaveAttribute(VirtualFocus)
  expect(getByTestId('item3')).not.toHaveAttribute(VirtualFocus)
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )
  await act(() =>
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  )

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(getByTestId('item2')).toHaveAttribute(VirtualFocus, 'true')
  expect(anchorRef.current).toHaveAttribute('aria-activedescendant', 'item2')

  hidden = true
  rerender(<Page />)

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'true')
  expect(queryByTestId('item2')).toBeNull()
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')

  await userEvent.keyboard('{Enter}')

  expect(getByTestId('combobox')).toHaveFocus()
  expect(getByTestId('combobox')).toHaveAttribute('aria-expanded', 'false')
  expect(anchorRef.current).not.toHaveAttribute('aria-activedescendant')
  expect(spy).toHaveBeenCalledTimes(0)
})
