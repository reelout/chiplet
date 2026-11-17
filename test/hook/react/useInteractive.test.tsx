import { useInteractive } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { VirtualActive, preventDefault } from '#util'
import { fireEvent, render, renderHook } from '@testing-library/react'
import { act, createRef } from 'react'
import { assert, expect, test, vi } from 'vitest'

test('useInteractive - props', () => {
  let disabled: boolean | undefined = undefined
  const onClick = vi.fn()
  const onClickCapture = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()

  const { result, rerender } = renderHook(() =>
    useInteractive({ disabled, onClick, onClickCapture, onKeyDown, onKeyUp })
  )

  expect(result.current).toEqual({
    role: 'button',
    tabIndex: 0,
    disabled: undefined,
    'aria-disabled': undefined,
    [VirtualActive]: undefined,
    onClick,
    onClickCapture,
    onKeyDown: expect.any(Function),
    onKeyUp: expect.any(Function),
  })

  disabled = true
  rerender()

  expect(result.current).toEqual({
    role: 'button',
    tabIndex: -1,
    disabled: true,
    'aria-disabled': true,
    [VirtualActive]: undefined,
    onClick: undefined,
    onClickCapture: undefined,
    onKeyDown: expect.any(Function),
    onKeyUp: expect.any(Function),
  })
})

test('useInteractive - disabled', async () => {
  let disabled = false
  const target = document.createElement('button')
  const onClick = vi.spyOn(target, 'click')
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()

  const { result, rerender } = renderHook(() =>
    useInteractive({ disabled, onKeyDown, onKeyUp })
  )

  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: 'Enter', detail: 11 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: 'Enter', detail: 12 })
    )
  )
  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: ' ', detail: 13 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: ' ', detail: 14 })
    )
  )

  disabled = true
  rerender()

  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: 'Enter', detail: 21 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: 'Enter', detail: 22 })
    )
  )
  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: ' ', detail: 23 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: ' ', detail: 24 })
    )
  )

  expect(onClick).toHaveBeenCalledTimes(2)
  expect(onKeyDown).toHaveBeenCalledTimes(4)
  expect(onKeyDown).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true, detail: 11 })
  )
  expect(onKeyDown).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: true, detail: 13 })
  )
  expect(onKeyDown).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false, detail: 21 })
  )
  expect(onKeyDown).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false, detail: 23 })
  )
  expect(onKeyUp).toHaveBeenCalledTimes(4)
  expect(onKeyUp).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false, detail: 12 })
  )
  expect(onKeyUp).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: true, detail: 14 })
  )
  expect(onKeyUp).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false, detail: 22 })
  )
  expect(onKeyUp).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: false, detail: 24 })
  )
})

test('useInteractive - preventDefault', async () => {
  const target = document.createElement('button')
  const onClick = vi.spyOn(target, 'click')
  const onKeyDown = vi
    .fn()
    .mockImplementationOnce(preventDefault)
    .mockImplementationOnce(preventDefault)
  const onKeyUp = vi
    .fn()
    .mockImplementationOnce(preventDefault)
    .mockImplementationOnce(preventDefault)

  const { result } = renderHook(() => useInteractive({ onKeyDown, onKeyUp }))

  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: 'Enter', detail: 11 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: 'Enter', detail: 12 })
    )
  )
  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: ' ', detail: 13 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: ' ', detail: 14 })
    )
  )

  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: 'Enter', detail: 21 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: 'Enter', detail: 22 })
    )
  )
  await act(() =>
    result.current.onKeyDown(
      createEvent({ target, type: 'keydown', key: ' ', detail: 23 })
    )
  )
  await act(() =>
    result.current.onKeyUp(
      createEvent({ target, type: 'keyup', key: ' ', detail: 24 })
    )
  )

  expect(onClick).toHaveBeenCalledTimes(2)
  expect(onKeyDown).toHaveBeenCalledTimes(4)
  expect(onKeyDown).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true, detail: 11 })
  )
  expect(onKeyDown).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: true, detail: 13 })
  )
  expect(onKeyDown).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: true, detail: 21 })
  )
  expect(onKeyDown).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: true, detail: 23 })
  )
  expect(onKeyUp).toHaveBeenCalledTimes(4)
  expect(onKeyUp).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true, detail: 12 })
  )
  expect(onKeyUp).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: true, detail: 14 })
  )
  expect(onKeyUp).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ defaultPrevented: false, detail: 22 })
  )
  expect(onKeyUp).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({ defaultPrevented: true, detail: 24 })
  )
})

test('useInteractive - role', () => {
  let disabled: boolean | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useInteractive({ role: 'menuitem', disabled })
  )

  expect(result.current).toMatchObject({
    role: 'menuitem',
    tabIndex: 0,
    disabled: undefined,
  })

  disabled = true
  rerender()

  expect(result.current).toMatchObject({
    role: 'menuitem',
    tabIndex: -1,
    disabled: true,
  })
})

test('useInteractive - tabIndex', () => {
  let tabIndex = -1
  let disabled: boolean | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useInteractive({ tabIndex, disabled })
  )

  expect(result.current).toMatchObject({
    role: 'button',
    tabIndex: -1,
    disabled: undefined,
  })

  tabIndex = 0
  disabled = true
  rerender()

  expect(result.current).toMatchObject({
    role: 'button',
    tabIndex: 0,
    disabled: true,
  })
})

test('useInteractive - click', async () => {
  const disabled: boolean | undefined = undefined
  const onClick = vi.fn()
  const onClickCapture = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()
  const ref = createRef<HTMLDivElement>()

  function Page() {
    return (
      <div
        {...useInteractive({
          disabled,
          onClick,
          onClickCapture,
          onKeyDown,
          onKeyUp,
          ref,
        })}
      />
    )
  }

  render(<Page />)

  assert(ref.current instanceof HTMLDivElement)

  const spy = vi.spyOn(ref.current, 'click')

  {
    await act(() => {
      ref.current?.focus()
      expect(ref.current).toHaveFocus()
    })
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
    })

    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClickCapture).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: ref.current,
        defaultPrevented: false,
      })
    )
    expect(onClickCapture).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'click',
        target: ref.current,
        defaultPrevented: false,
      })
    )
  }
})

test('useInteractive - active', async () => {
  function Page(props: React.ComponentProps<'div'>) {
    return <div {...useInteractive(props)} />
  }

  const { getByRole, rerender } = render(null)

  {
    rerender(<Page key={1} />)

    const button = getByRole('button')

    expect(button).toBeInstanceOf(HTMLDivElement)
    expect(button).not.toHaveAttribute(VirtualActive)

    await fireEvent.keyDown(button, { key: ' ' })

    expect(button).toHaveAttribute(VirtualActive, 'true')

    await fireEvent.keyUp(button, { key: ' ' })

    expect(button).not.toHaveAttribute(VirtualActive)
  }

  {
    rerender(<Page key={2} {...{ [VirtualActive]: false }} />)

    const button = getByRole('button')

    expect(button).toBeInstanceOf(HTMLDivElement)
    expect(button).toHaveAttribute(VirtualActive, 'false')

    await fireEvent.keyDown(button, { key: ' ' })

    expect(button).toHaveAttribute(VirtualActive, 'true')

    await fireEvent.keyUp(button, { key: ' ' })

    expect(button).toHaveAttribute(VirtualActive, 'false')
  }

  {
    rerender(<Page key={3} {...{ [VirtualActive]: true }} />)

    const button = getByRole('button')

    expect(button).toBeInstanceOf(HTMLDivElement)
    expect(button).toHaveAttribute(VirtualActive, 'true')

    await fireEvent.keyDown(button, { key: ' ' })

    expect(button).toHaveAttribute(VirtualActive, 'true')

    await fireEvent.keyUp(button, { key: ' ' })

    expect(button).toHaveAttribute(VirtualActive, 'true')
  }
})

test('useInteractive - press Enter key', async () => {
  let disabled: boolean | undefined = undefined
  const onClick = vi.fn()
  const onClickCapture = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()
  const ref = createRef<HTMLDivElement>()

  function Page() {
    return (
      <div
        {...useInteractive({
          disabled,
          onClick,
          onClickCapture,
          onKeyDown,
          onKeyUp,
          ref,
        })}
      />
    )
  }

  const { rerender } = render(<Page />)

  assert(ref.current instanceof HTMLDivElement)

  const spy = vi.spyOn(ref.current, 'click')

  {
    await act(() => {
      ref.current?.focus()
      expect(ref.current).toHaveFocus()
    })
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).not.toHaveAttribute(VirtualActive)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClickCapture).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        target: ref.current,
        key: 'Enter',
        defaultPrevented: true,
      })
    )
    expect(onKeyUp).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).not.toHaveAttribute(VirtualActive)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClickCapture).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keyup',
        target: ref.current,
        key: 'Enter',
        defaultPrevented: false,
      })
    )
  }

  disabled = true
  vi.clearAllMocks()
  rerender(<Page />)

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).not.toHaveAttribute(VirtualActive)
    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onClickCapture).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        target: ref.current,
        key: 'Enter',
        defaultPrevented: false,
      })
    )
    expect(onKeyUp).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).not.toHaveAttribute(VirtualActive)
    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onClickCapture).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keyup',
        target: ref.current,
        key: 'Enter',
        defaultPrevented: false,
      })
    )
  }
})

test('useInteractive - press Space key', async () => {
  let disabled: boolean | undefined = undefined
  const onClick = vi.fn()
  const onClickCapture = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()
  const ref = createRef<HTMLDivElement>()

  function Page() {
    return (
      <div
        {...useInteractive({
          disabled,
          onClick,
          onClickCapture,
          onKeyDown,
          onKeyUp,
          ref,
        })}
      />
    )
  }

  const { rerender } = render(<Page />)

  assert(ref.current instanceof HTMLDivElement)

  const spy = vi.spyOn(ref.current, 'click')

  {
    await act(() => {
      ref.current?.focus()
      expect(ref.current).toHaveFocus()
    })
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).toHaveAttribute(VirtualActive, 'true')
    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onClickCapture).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        target: ref.current,
        key: ' ',
        defaultPrevented: true,
      })
    )
    expect(onKeyUp).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).not.toHaveAttribute(VirtualActive)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClickCapture).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keyup',
        target: ref.current,
        key: ' ',
        defaultPrevented: true,
      })
    )
  }

  vi.clearAllMocks()

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).toHaveAttribute(VirtualActive, 'true')
    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onClickCapture).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        target: ref.current,
        key: ' ',
        defaultPrevented: true,
      })
    )
    expect(onKeyUp).toHaveBeenCalledTimes(0)
  }

  disabled = true
  rerender(<Page />)

  {
    expect(ref.current).not.toHaveAttribute(VirtualActive)

    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).not.toHaveAttribute(VirtualActive)
  }

  disabled = false
  rerender(<Page />)

  {
    expect(ref.current).not.toHaveAttribute(VirtualActive)
    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onClickCapture).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keyup',
        target: ref.current,
        key: ' ',
        defaultPrevented: false,
      })
    )
  }
})

test('useInteractive - press Enter key with defaultPrevented', async () => {
  const onClick = vi.fn()
  const onClickCapture = vi.fn()
  const onKeyDown = vi.fn(preventDefault)
  const onKeyUp = vi.fn(preventDefault)
  const ref = createRef<HTMLDivElement>()

  function Page() {
    return (
      <div
        {...useInteractive({
          onClick,
          onClickCapture,
          onKeyDown,
          onKeyUp,
          ref,
        })}
      />
    )
  }

  render(<Page />)

  assert(ref.current instanceof HTMLDivElement)

  const spy = vi.spyOn(ref.current, 'click')

  {
    await act(() => {
      ref.current?.focus()
      expect(ref.current).toHaveFocus()
    })
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onClickCapture).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        target: ref.current,
        key: 'Enter',
        defaultPrevented: true,
      })
    )
    expect(onKeyUp).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keyup',
        target: ref.current,
        key: 'Enter',
        defaultPrevented: true,
      })
    )
  }
})

test('useInteractive - press Space key with defaultPrevented', async () => {
  const onClick = vi.fn()
  const onClickCapture = vi.fn()
  const onKeyDown = vi.fn(preventDefault)
  const onKeyUp = vi.fn(preventDefault)
  const ref = createRef<HTMLDivElement>()

  function Page() {
    return (
      <div
        {...useInteractive({
          onClick,
          onClickCapture,
          onKeyDown,
          onKeyUp,
          ref,
        })}
      />
    )
  }

  render(<Page />)

  assert(ref.current instanceof HTMLDivElement)

  const spy = vi.spyOn(ref.current, 'click')

  {
    await act(() => {
      ref.current?.focus()
      expect(ref.current).toHaveFocus()
    })
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(spy).toHaveBeenCalledTimes(0)
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onClickCapture).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keydown',
        target: ref.current,
        key: ' ',
        defaultPrevented: true,
      })
    )
    expect(onKeyUp).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'keyup',
        target: ref.current,
        key: ' ',
        defaultPrevented: true,
      })
    )
  }
})

test('useInteractive - press Space key and then press Enter key', async () => {
  const onClick = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()
  const ref = createRef<HTMLDivElement>()

  function Page() {
    return (
      <div
        {...useInteractive({
          onClick,
          onKeyDown,
          onKeyUp,
          ref,
        })}
      />
    )
  }

  render(<Page />)

  assert(ref.current instanceof HTMLDivElement)

  {
    await act(() => {
      ref.current?.focus()

      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).toHaveFocus()
    expect(ref.current).toHaveAttribute(VirtualActive, 'true')
    expect(onClick).toHaveBeenCalledTimes(0)
    expect(onKeyDown).toHaveBeenCalledTimes(1)
    expect(onKeyUp).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).toHaveFocus()
    expect(ref.current).toHaveAttribute(VirtualActive, 'true')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledTimes(2)
    expect(onKeyUp).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Enter',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).toHaveFocus()
    expect(ref.current).toHaveAttribute(VirtualActive, 'true')
    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onKeyDown).toHaveBeenCalledTimes(2)
    expect(onKeyUp).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => {
      ref.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref.current).toHaveFocus()
    expect(ref.current).not.toHaveAttribute(VirtualActive)
    expect(onClick).toHaveBeenCalledTimes(2)
    expect(onKeyDown).toHaveBeenCalledTimes(2)
    expect(onKeyUp).toHaveBeenCalledTimes(2)
  }
})

test('useInteractive - blur while active', async () => {
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()
  const onFocus = vi.fn()
  const onBlur = vi.fn()
  const ref1 = createRef<HTMLDivElement>()
  const ref2 = createRef<HTMLButtonElement>()

  function Page() {
    return (
      <>
        <div
          {...useInteractive({
            onKeyDown,
            onKeyUp,
            onFocus,
            onBlur,
            ref: ref1,
          })}
        />
        <button ref={ref2} />
      </>
    )
  }

  render(<Page />)

  assert(ref1.current instanceof HTMLDivElement)
  assert(ref2.current instanceof HTMLButtonElement)

  {
    await act(() => {
      ref1.current?.focus()

      ref1.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          repeat: true,
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref1.current).toHaveFocus()
    expect(ref1.current).toHaveAttribute(VirtualActive, 'true')
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref1.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref1.current).toHaveFocus()
    expect(ref1.current).toHaveAttribute(VirtualActive, 'true')
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref2.current?.focus()

      ref2.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref2.current).toHaveFocus()
    expect(ref1.current).not.toHaveAttribute(VirtualActive)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => {
      ref2.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref2.current).toHaveFocus()
    expect(ref1.current).not.toHaveAttribute(VirtualActive)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  }

  expect(onKeyDown).toHaveBeenCalledTimes(2)
  expect(onKeyDown).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keydown',
      target: ref1.current,
      key: ' ',
      defaultPrevented: true,
    })
  )
  expect(onKeyDown).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keydown',
      target: ref1.current,
      key: 'Tab',
      defaultPrevented: false,
    })
  )
  expect(onKeyUp).toHaveBeenCalledTimes(0)
})

test('useInteractive - focus again after blurring', async () => {
  const onClick = vi.fn()
  const onKeyDown = vi.fn()
  const onKeyUp = vi.fn()
  const onFocus = vi.fn()
  const onBlur = vi.fn()
  const ref1 = createRef<HTMLDivElement>()
  const ref2 = createRef<HTMLButtonElement>()

  function Page() {
    return (
      <>
        <div
          {...useInteractive({
            onClick,
            onKeyDown,
            onKeyUp,
            onFocus,
            onBlur,
            ref: ref1,
          })}
        />
        <button ref={ref2} />
      </>
    )
  }

  render(<Page />)

  assert(ref1.current instanceof HTMLDivElement)
  assert(ref2.current instanceof HTMLButtonElement)

  {
    await act(() => {
      ref1.current?.focus()

      ref1.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: ' ',
          repeat: true,
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref1.current).toHaveFocus()
    expect(ref1.current).toHaveAttribute(VirtualActive, 'true')
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(0)
  }

  {
    await act(() => {
      ref1.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        })
      )

      ref2.current?.focus()

      ref2.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Tab',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref2.current).toHaveFocus()
    expect(ref1.current).not.toHaveAttribute(VirtualActive)
    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => {
      ref2.current?.dispatchEvent(
        new KeyboardEvent('keydown', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        })
      )

      ref1.current?.focus()

      ref1.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: 'Tab',
          shiftKey: true,
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref1.current).toHaveFocus()
    expect(ref1.current).not.toHaveAttribute(VirtualActive)
    expect(onFocus).toHaveBeenCalledTimes(2)
    expect(onBlur).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => {
      ref1.current?.dispatchEvent(
        new KeyboardEvent('keyup', {
          key: ' ',
          bubbles: true,
          cancelable: true,
        })
      )
    })

    expect(ref1.current).toHaveFocus()
    expect(ref1.current).not.toHaveAttribute(VirtualActive)
    expect(onFocus).toHaveBeenCalledTimes(2)
    expect(onBlur).toHaveBeenCalledTimes(1)
  }

  expect(onClick).toHaveBeenCalledTimes(0)
  expect(onKeyDown).toHaveBeenCalledTimes(2)
  expect(onKeyDown).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keydown',
      target: ref1.current,
      key: ' ',
      defaultPrevented: true,
    })
  )
  expect(onKeyDown).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keydown',
      target: ref1.current,
      key: 'Tab',
      defaultPrevented: false,
    })
  )
  expect(onKeyUp).toHaveBeenCalledTimes(2)
  expect(onKeyUp).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keyup',
      target: ref1.current,
      key: 'Tab',
      shiftKey: true,
      defaultPrevented: false,
    })
  )
  expect(onKeyUp).toHaveBeenCalledWith(
    expect.objectContaining({
      type: 'keyup',
      target: ref1.current,
      key: ' ',
      defaultPrevented: false,
    })
  )
})
