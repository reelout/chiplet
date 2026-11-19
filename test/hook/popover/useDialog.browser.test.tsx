import { useDialog, usePopover } from '#hook'
import { OverlayContext } from '#hook/popover/context'
import { render, renderHook } from '@testing-library/react'
import {
  act,
  createRef,
  useEffect,
  useImperativeHandle,
  type RefObject,
} from 'react'
import { createPortal } from 'react-dom'
import { beforeAll, beforeEach, expect, test, vi, type Mock } from 'vitest'
import { page, userEvent } from 'vitest/browser'

let dialog1: ReturnType<typeof useDialog>
let dialog2: ReturnType<typeof useDialog>
let dialog3: ReturnType<typeof useDialog>
let dialog4: ReturnType<typeof useDialog>
let container1: RefObject<HTMLDialogElement | null>
let container2: RefObject<HTMLDialogElement | null>
let container3: RefObject<HTMLDialogElement | null>
let container4: RefObject<HTMLDialogElement | null>
let trigger1: RefObject<HTMLButtonElement | null>
let trigger2: RefObject<HTMLButtonElement | null>
let trigger3: RefObject<HTMLButtonElement | null>
let trigger4: RefObject<HTMLButtonElement | null>
let close1: RefObject<HTMLButtonElement | null>
let close2: RefObject<HTMLButtonElement | null>
let close3: RefObject<HTMLButtonElement | null>
let close4: RefObject<HTMLButtonElement | null>
let onToggle1: Mock
let onToggle2: Mock
let onToggle3: Mock
let onToggle4: Mock

beforeAll(async () => {
  await page.viewport(1000, 1000)
})

beforeEach(() => {
  vi.restoreAllMocks()

  document.body.innerHTML = `
    <style>
      button {
        inline-size: 80px;
        block-size: 80px;
      }

      div[popover] {
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        place-content: center;
        gap: 20px;
        inline-size: 200px;
        block-size: 200px;
        margin: 0;
        padding: 0;
        border: none;
        box-shadow: 0 1px 3px 5px #0001;
      }
    </style>
  `

  document.body.style.inlineSize = '100vi'
  document.body.style.blockSize = '100vb'
  document.body.style.padding = '160px'
  document.body.style.margin = '0'
  document.body.style.background = '#8888'

  container1 = createRef()
  container2 = createRef()
  container3 = createRef()
  container4 = createRef()
  trigger1 = createRef()
  trigger2 = createRef()
  trigger3 = createRef()
  trigger4 = createRef()
  close1 = createRef()
  close2 = createRef()
  close3 = createRef()
  close4 = createRef()
  onToggle1 = vi.fn()
  onToggle2 = vi.fn()
  onToggle3 = vi.fn()
  onToggle4 = vi.fn()
})

function Portal(props: React.PropsWithChildren) {
  return createPortal(props.children, document.body)
}

function Page() {
  const dialog1Value = useDialog({
    anchor: <button ref={trigger1}>Trigger1</button>,
    onToggle: onToggle1,
  })
  const dialog2Value = useDialog({
    anchor: <button ref={trigger2}>Trigger2</button>,
    onToggle: onToggle2,
  })
  const dialog3Value = useDialog({
    anchor: <button ref={trigger3}>Trigger3</button>,
    onToggle: onToggle3,
  })
  const dialog4Value = useDialog({
    anchor: <button ref={trigger4}>Trigger4</button>,
    onToggle: onToggle4,
  })

  const overlay1Value = dialog1Value.overlay
  const overlay2Value = dialog2Value.overlay
  const overlay3Value = dialog3Value.overlay
  const overlay4Value = dialog4Value.overlay

  useEffect(() => {
    dialog1 = dialog1Value
    dialog2 = dialog2Value
    dialog3 = dialog3Value
    dialog4 = dialog4Value
  })

  useImperativeHandle(
    container1,
    () => overlay1Value.positioned as HTMLDialogElement
  )
  useImperativeHandle(
    container2,
    () => overlay2Value.positioned as HTMLDialogElement
  )
  useImperativeHandle(
    container3,
    () => overlay3Value.positioned as HTMLDialogElement
  )
  useImperativeHandle(
    container4,
    () => overlay4Value.positioned as HTMLDialogElement
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        {dialog1Value.anchor}

        {overlay1Value.open && (
          <Portal>
            <dialog {...dialog1Value.positioned.props} data-testid='container1'>
              <button ref={close1} onClick={overlay1Value.toggle}>
                Close1
              </button>

              {dialog2Value.anchor}

              {overlay2Value.open && (
                <Portal>
                  <dialog
                    {...dialog2Value.positioned.props}
                    data-testid='container2'
                  >
                    <button ref={close2} onClick={overlay2Value.toggle}>
                      Close2
                    </button>
                  </dialog>
                </Portal>
              )}
            </dialog>
          </Portal>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {dialog3Value.anchor}

        {overlay3Value.open && (
          <Portal>
            <dialog {...dialog3Value.positioned.props} data-testid='container3'>
              <button ref={close3} onClick={overlay3Value.toggle}>
                Close3
              </button>

              {dialog4Value.anchor}
            </dialog>
          </Portal>
        )}

        {overlay4Value.open && (
          <Portal>
            <dialog {...dialog4Value.positioned.props} data-testid='container4'>
              <button ref={close4} onClick={overlay4Value.toggle}>
                Close4
              </button>
            </dialog>
          </Portal>
        )}
      </div>
    </div>
  )
}

test('useDialog - props', async () => {
  const ref = vi.fn()

  const { result } = renderHook(() => useDialog({ ref }))

  expect(result.current).toEqual({
    overlay: {
      anchor: null,
      positioned: null,
      open: false,
      toggle: expect.any(Function),
    },
    anchor: null,
    positioned: {
      props: {
        id: expect.stringMatching(/^dialog-[a-z0-9]{8}$/),
        role: 'dialog',
        'aria-modal': true,
        tabIndex: -1,
        style: undefined,
        ref: { current: null },
        onClickCapture: expect.any(Function),
        children: expect.objectContaining({
          type: OverlayContext,
          props: { value: result.current.overlay },
        }),
      },
    },
  })
  expect(ref).toHaveBeenCalledTimes(1)
  expect(ref).toHaveBeenCalledWith(result.current.overlay)
})

test('useDialog - nested', { timeout: 120_000 }, async () => {
  render(<Page />)

  {
    expect(trigger1.current).toBeInstanceOf(HTMLButtonElement)
    expect(dialog1).toEqual({
      overlay: {
        anchor: trigger1.current,
        positioned: null,
        open: false,
        toggle: expect.any(Function),
      },
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': undefined,
          'aria-expanded': false,
          'aria-haspopup': true,
          style: undefined,
          ref: { current: trigger1.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          children: 'Trigger1',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^dialog-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': true,
          tabIndex: -1,
          style: undefined,
          ref: { current: null },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: { value: dialog1.overlay },
          }),
        },
      },
    })
  }

  {
    await act(() => {
      trigger1.current?.focus()
      trigger1.current?.click()
    })

    expect(container1.current).toBeInstanceOf(HTMLElement)
    expect(container1.current?.open).toBe(true)
    expect(dialog1).toEqual({
      overlay: {
        anchor: trigger1.current,
        positioned: container1.current,
        open: true,
        toggle: expect.any(Function),
      },
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': dialog1.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: undefined,
          ref: { current: trigger1.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          children: 'Trigger1',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^dialog-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': true,
          tabIndex: -1,
          style: undefined,
          ref: { current: container1.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: { value: dialog1.overlay },
          }),
        },
      },
    })
  }

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(container2.current).toBeInstanceOf(HTMLElement)
    expect(container1.current?.open).toBe(true)
    expect(container2.current?.open).toBe(true)
    expect(dialog2).toEqual({
      overlay: {
        anchor: trigger2.current,
        positioned: container2.current,
        open: true,
        toggle: expect.any(Function),
      },
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': dialog2.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: undefined,
          ref: { current: trigger2.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          children: 'Trigger2',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^dialog-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': true,
          tabIndex: -1,
          style: undefined,
          ref: { current: container2.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: { value: dialog2.overlay },
          }),
        },
      },
    })
  }

  const spy1 = (container1.current!.ontoggle = vi.fn())
  const spy2 = (container2.current!.ontoggle = vi.fn())
  const spy3 = vi.fn()
  container1.current?.addEventListener('beforetoggle', spy3, true)
  const spy4 = vi.fn()
  container2.current?.addEventListener('beforetoggle', spy4, true)

  {
    await act(() => userEvent.keyboard('{Escape}'))

    expect(container1.current?.open).toBe(true)
    expect(container2.current?.open).toBe(undefined)

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(0)
    expect(spy4).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => userEvent.keyboard('{Escape}'))

    expect(container1.current?.open).toBe(undefined)
    expect(container2.current?.open).toBe(undefined)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
  }

  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'toggle',
      cancelable: false,
      newState: 'closed',
      target: expect.toBeOneOf([
        expect.objectContaining({
          dataset: expect.objectContaining({ testid: 'container1' }),
        }),
        null,
      ]),
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'toggle',
      cancelable: false,
      newState: 'closed',
      target: expect.toBeOneOf([
        expect.objectContaining({
          dataset: expect.objectContaining({ testid: 'container2' }),
        }),
        null,
      ]),
    })
  )
  expect(spy3).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'beforetoggle',
      cancelable: false,
      newState: 'closed',
      target: expect.objectContaining({
        dataset: expect.objectContaining({ testid: 'container1' }),
      }),
    })
  )
  expect(spy4).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'beforetoggle',
      cancelable: false,
      newState: 'closed',
      target: expect.objectContaining({
        dataset: expect.objectContaining({ testid: 'container2' }),
      }),
    })
  )
})

test('useDialog - discrete', { timeout: 120_000 }, async () => {
  render(<Page />)

  {
    expect(trigger3.current).toBeInstanceOf(HTMLButtonElement)
    expect(dialog3).toEqual({
      overlay: {
        anchor: trigger3.current,
        positioned: null,
        open: false,
        toggle: expect.any(Function),
      },
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': undefined,
          'aria-expanded': false,
          'aria-haspopup': true,
          style: undefined,
          ref: { current: trigger3.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          children: 'Trigger3',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^dialog-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': true,
          tabIndex: -1,
          style: undefined,
          ref: { current: null },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: { value: dialog3.overlay },
          }),
        },
      },
    })
  }

  {
    await act(() => {
      trigger3.current?.focus()
      trigger3.current?.click()
    })

    expect(container3.current).toBeInstanceOf(HTMLElement)
    expect(container3.current?.open).toBe(true)
    expect(dialog3).toEqual({
      overlay: {
        anchor: trigger3.current,
        positioned: container3.current,
        open: true,
        toggle: expect.any(Function),
      },
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': dialog3.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: undefined,
          ref: { current: trigger3.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          children: 'Trigger3',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^dialog-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': true,
          tabIndex: -1,
          style: undefined,
          ref: { current: container3.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: { value: dialog3.overlay },
          }),
        },
      },
    })
  }

  {
    await act(() => {
      trigger4.current?.focus()
      trigger4.current?.click()
    })

    expect(container4.current).toBeInstanceOf(HTMLElement)
    expect(container3.current?.open).toBe(true)
    expect(container4.current?.open).toBe(true)
    expect(dialog4).toEqual({
      overlay: {
        anchor: trigger4.current,
        positioned: container4.current,
        open: true,
        toggle: expect.any(Function),
      },
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': dialog4.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: undefined,
          ref: { current: trigger4.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          children: 'Trigger4',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^dialog-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': true,
          tabIndex: -1,
          style: undefined,
          ref: { current: container4.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: { value: dialog4.overlay },
          }),
        },
      },
    })
  }

  const spy1 = (container3.current!.ontoggle = vi.fn())
  const spy2 = (container4.current!.ontoggle = vi.fn())
  const spy3 = vi.fn()
  container3.current?.addEventListener('beforetoggle', spy3, true)
  const spy4 = vi.fn()
  container4.current?.addEventListener('beforetoggle', spy4, true)

  {
    await act(() => userEvent.keyboard('{Escape}'))

    expect(container3.current?.open).toBe(true)
    expect(container4.current?.open).toBe(undefined)

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(0)
    expect(spy4).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => userEvent.keyboard('{Escape}'))

    expect(container3.current?.open).toBe(undefined)
    expect(container4.current?.open).toBe(undefined)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
  }

  expect(spy1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'toggle',
      cancelable: false,
      newState: 'closed',
      target: expect.toBeOneOf([
        expect.objectContaining({
          dataset: expect.objectContaining({ testid: 'container3' }),
        }),
        null,
      ]),
    })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'toggle',
      cancelable: false,
      newState: 'closed',
      target: expect.toBeOneOf([
        expect.objectContaining({
          dataset: expect.objectContaining({ testid: 'container4' }),
        }),
        null,
      ]),
    })
  )
  expect(spy3).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'beforetoggle',
      cancelable: false,
      newState: 'closed',
      target: expect.objectContaining({
        dataset: expect.objectContaining({ testid: 'container3' }),
      }),
    })
  )
  expect(spy4).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'beforetoggle',
      cancelable: false,
      newState: 'closed',
      target: expect.objectContaining({
        dataset: expect.objectContaining({ testid: 'container4' }),
      }),
    })
  )
})

test('useDialog - click inside nested', { timeout: 60_000 }, async () => {
  render(<Page />)

  await act(() => {
    trigger1.current?.focus()
    trigger1.current?.click()
  })

  await act(() => {
    trigger2.current?.focus()
    trigger2.current?.click()
  })

  expect(container1.current?.open).toBe(true)
  expect(container2.current?.open).toBe(true)

  await act(() => {
    container2.current?.click()
  })

  expect(container1.current?.open).toBe(true)
  expect(container2.current?.open).toBe(true)

  await act(() => {
    close2.current?.focus()
    close2.current?.click()
  })

  expect(container1.current?.open).toBe(true)
  expect(container2.current?.open).toBe(undefined)

  await act(() => {
    trigger2.current?.focus()
    trigger2.current?.click()
  })

  expect(container1.current?.open).toBe(true)
  expect(container2.current?.open).toBe(true)

  await act(async () => {
    const position = container1.current?.getBoundingClientRect()
    if (!position) return
    await userEvent.click(document.body, { position })
  })

  expect(container1.current?.open).toBe(true)
  expect(container2.current?.open).toBe(undefined)

  await act(async () => {
    const position = { x: 0, y: 0 }
    await userEvent.click(document.body, { position })
  })

  expect(container1.current?.open).toBe(undefined)
  expect(container2.current?.open).toBe(undefined)
})

test('useDialog - click inside discrete', { timeout: 60_000 }, async () => {
  render(<Page />)

  await act(() => {
    trigger3.current?.focus()
    trigger3.current?.click()
  })

  await act(() => {
    trigger4.current?.focus()
    trigger4.current?.click()
  })

  expect(container3.current?.open).toBe(true)
  expect(container4.current?.open).toBe(true)

  await act(() => {
    container4.current?.click()
  })

  expect(container3.current?.open).toBe(true)
  expect(container4.current?.open).toBe(true)

  await act(() => {
    close4.current?.focus()
    close4.current?.click()
  })

  expect(container3.current?.open).toBe(true)
  expect(container4.current?.open).toBe(undefined)

  await act(() => {
    trigger4.current?.focus()
    trigger4.current?.click()
  })

  expect(container3.current?.open).toBe(true)
  expect(container4.current?.open).toBe(true)

  await act(async () => {
    const position = container3.current?.getBoundingClientRect()
    if (!position) return
    await userEvent.click(document.body, { position })
  })

  expect(container3.current?.open).toBe(true)
  expect(container4.current?.open).toBe(undefined)

  await act(async () => {
    const position = { x: 0, y: 0 }
    await userEvent.click(document.body, { position })
  })

  expect(container3.current?.open).toBe(undefined)
  expect(container4.current?.open).toBe(undefined)
})

test('useDialog - nested popover', async () => {
  let dialog: ReturnType<typeof useDialog> | undefined
  let popover: ReturnType<typeof usePopover<'div'>> | undefined

  function Page() {
    const dialogValue = useDialog({
      anchor: <button ref={trigger1}>Trigger1</button>,
    })
    const popoverValue = usePopover({
      anchor: <button ref={trigger2}>Trigger2</button>,
    })

    useEffect(() => {
      dialog = dialogValue
      popover = popoverValue
    })

    return (
      <>
        {dialogValue.anchor}

        {dialogValue.overlay.open && (
          <dialog {...dialogValue.positioned.props}>
            <button onClick={dialogValue.overlay.toggle} ref={close1}>
              Close Dialog
            </button>

            {popoverValue.anchor}

            {popoverValue.overlay.open && (
              <Portal>
                <div {...popoverValue.positioned.props}>
                  <button onClick={popoverValue.overlay.toggle} ref={close2}>
                    Close Popover
                  </button>
                </div>
              </Portal>
            )}
          </dialog>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    trigger1.current?.focus()
    trigger1.current?.click()
  })

  expect(dialog?.overlay.open).toBe(true)
  expect(popover?.overlay.open).toBe(false)

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(dialog?.overlay.open).toBe(true)
    expect(popover?.overlay.open).toBe(true)

    await act(() => {
      close2.current?.focus()
      close2.current?.click()
    })

    expect(dialog?.overlay.open).toBe(true)
    expect(popover?.overlay.open).toBe(false)
  }

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(dialog?.overlay.open).toBe(true)
    expect(popover?.overlay.open).toBe(true)

    await act(() => {
      dialog?.overlay.positioned?.click()
    })

    expect(dialog?.overlay.open).toBe(true)
    expect(popover?.overlay.open).toBe(false)
  }

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(dialog?.overlay.open).toBe(true)
    expect(popover?.overlay.open).toBe(true)

    await act(() => userEvent.keyboard('{Escape}'))

    expect(dialog?.overlay.open).toBe(true)
    expect(popover?.overlay.open).toBe(false)
  }

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(dialog?.overlay.open).toBe(true)
    expect(popover?.overlay.open).toBe(true)

    await act(() => {
      close1.current?.focus()
      close1.current?.click()
    })

    expect(dialog?.overlay.open).toBe(false)
    expect(popover?.overlay.open).toBe(false)
  }
})

test('useDialog - nested dialog', { timeout: 60_000 }, async () => {
  let popover: ReturnType<typeof usePopover<'div'>> | undefined
  let dialog: ReturnType<typeof useDialog> | undefined

  function Page() {
    const popoverValue = usePopover({
      anchor: <button ref={trigger1}>Trigger1</button>,
    })
    const dialogValue = useDialog({
      anchor: <button ref={trigger2}>Trigger2</button>,
    })

    useEffect(() => {
      popover = popoverValue
      dialog = dialogValue
    })

    return (
      <>
        {popoverValue.anchor}

        {popoverValue.overlay.open && (
          <div {...popoverValue.positioned.props}>
            <button onClick={popoverValue.overlay.toggle} ref={close1}>
              Close Popover
            </button>

            {dialogValue.anchor}

            {dialogValue.overlay.open && (
              <Portal>
                <dialog {...dialogValue.positioned.props}>
                  <button onClick={dialogValue.overlay.toggle} ref={close2}>
                    Close Dialog
                  </button>
                </dialog>
              </Portal>
            )}
          </div>
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    trigger1.current?.focus()
    trigger1.current?.click()
  })

  expect(popover?.overlay.open).toBe(true)
  expect(dialog?.overlay.open).toBe(false)

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(popover?.overlay.open).toBe(true)
    expect(dialog?.overlay.open).toBe(true)

    await act(() => {
      close2.current?.focus()
      close2.current?.click()
    })

    expect(popover?.overlay.open).toBe(true)
    expect(dialog?.overlay.open).toBe(false)
  }

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(popover?.overlay.open).toBe(true)
    expect(dialog?.overlay.open).toBe(true)

    await act(() => {
      const position = popover?.overlay.positioned?.getBoundingClientRect()
      if (!position) return
      return userEvent.click(document.body, { position })
    })

    expect(popover?.overlay.open).toBe(true)
    expect(dialog?.overlay.open).toBe(false)
  }

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(popover?.overlay.open).toBe(true)
    expect(dialog?.overlay.open).toBe(true)

    await act(() => userEvent.keyboard('{Escape}'))

    expect(popover?.overlay.open).toBe(true)
    expect(dialog?.overlay.open).toBe(false)
  }

  {
    await act(() => {
      trigger2.current?.focus()
      trigger2.current?.click()
    })

    expect(popover?.overlay.open).toBe(true)
    expect(dialog?.overlay.open).toBe(true)

    await act(() => {
      close1.current?.focus()
      close1.current?.click()
    })

    expect(popover?.overlay.open).toBe(false)
    expect(dialog?.overlay.open).toBe(false)
  }
})

test('useDialog - anchor props', async () => {
  function Page() {
    const dialogValue = useDialog({
      anchor: (
        <button
          role='combobox'
          aria-controls='listbox'
          aria-expanded={undefined}
          ref={trigger1}
        />
      ),
    })

    useEffect(() => {
      dialog1 = dialogValue
    })

    return (
      <>
        {dialogValue.anchor}
        {dialogValue.overlay.open && (
          <dialog {...dialogValue.positioned.props}>
            <ul role='listbox' id='listbox'>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </dialog>
        )}
      </>
    )
  }

  render(<Page />)

  expect(trigger1.current).not.toHaveAttribute('aria-controls')
  expect(trigger1.current).toHaveAttribute('aria-expanded', 'false')

  await act(() => {
    trigger1.current?.focus()
    trigger1.current?.click()
  })

  expect(trigger1.current).toHaveAttribute('aria-controls', 'listbox')
  expect(trigger1.current).toHaveAttribute('aria-expanded', 'true')
  expect(dialog1.overlay.anchor).toBe(trigger1.current)
  expect(dialog1.overlay.positioned).toBeInstanceOf(HTMLDialogElement)
})
