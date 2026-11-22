import '#.mock/blockPointerLeaks'
import {
  Keyboard,
  useKeyboard,
  usePopover,
  type PositioningOptions,
} from '#hook'
import { OverlayContext } from '#hook/popover/context'
import { createKeyboardEvent as createEvent } from '#test'
import { fireEvent, render, renderHook } from '@testing-library/react'
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

let popover1: ReturnType<typeof usePopover<'div'>>
let popover2: ReturnType<typeof usePopover<'div'>>
let popover3: ReturnType<typeof usePopover<'div'>>
let popover4: ReturnType<typeof usePopover<'div'>>
let container1: RefObject<HTMLDivElement | null>
let container2: RefObject<HTMLDivElement | null>
let container3: RefObject<HTMLDivElement | null>
let container4: RefObject<HTMLDivElement | null>
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
  const popover1Value = usePopover({
    anchor: <button ref={trigger1}>Trigger1</button>,
    onToggle: onToggle1,
  })
  const popover2Value = usePopover({
    anchor: <button ref={trigger2}>Trigger2</button>,
    onToggle: onToggle2,
  })
  const popover3Value = usePopover({
    anchor: <button ref={trigger3}>Trigger3</button>,
    onToggle: onToggle3,
  })
  const popover4Value = usePopover({
    anchor: <button ref={trigger4}>Trigger4</button>,
    positioning: { position: 'below' },
    onToggle: onToggle4,
  })

  const overlay1Value = popover1Value.overlay
  const overlay2Value = popover2Value.overlay
  const overlay3Value = popover3Value.overlay
  const overlay4Value = popover4Value.overlay

  useEffect(() => {
    popover1 = popover1Value
    popover2 = popover2Value
    popover3 = popover3Value
    popover4 = popover4Value
  })

  useImperativeHandle(
    container1,
    () => overlay1Value.positioned as HTMLDivElement
  )
  useImperativeHandle(
    container2,
    () => overlay2Value.positioned as HTMLDivElement
  )
  useImperativeHandle(
    container3,
    () => overlay3Value.positioned as HTMLDivElement
  )
  useImperativeHandle(
    container4,
    () => overlay4Value.positioned as HTMLDivElement
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div style={{ display: 'flex', gap: 20 }}>
        {popover1Value.anchor}

        {overlay1Value.open && (
          <Portal>
            <Keyboard {...popover1Value.keyboard.props}>
              <div {...popover1Value.positioned.props} data-testid='container1'>
                <button ref={close1} onClick={overlay1Value.toggle}>
                  Close1
                </button>

                {popover2Value.anchor}

                {overlay2Value.open && (
                  <Portal>
                    <Keyboard {...popover2Value.keyboard.props}>
                      <div
                        {...popover2Value.positioned.props}
                        data-testid='container2'
                      >
                        <button ref={close2} onClick={overlay2Value.toggle}>
                          Close2
                        </button>
                      </div>
                    </Keyboard>
                  </Portal>
                )}
              </div>
            </Keyboard>
          </Portal>
        )}
      </div>

      <div style={{ display: 'flex', gap: 20 }}>
        {popover3Value.anchor}

        {overlay3Value.open && (
          <Portal>
            <Keyboard {...popover3Value.keyboard.props}>
              <div {...popover3Value.positioned.props} data-testid='container3'>
                <button ref={close3} onClick={overlay3Value.toggle}>
                  Close3
                </button>

                {popover4Value.anchor}
              </div>
            </Keyboard>
          </Portal>
        )}

        {overlay4Value.open && (
          <Portal>
            <Keyboard {...popover4Value.keyboard.props}>
              <div {...popover4Value.positioned.props} data-testid='container4'>
                <button ref={close4} onClick={overlay4Value.toggle}>
                  Close4
                </button>
              </div>
            </Keyboard>
          </Portal>
        )}
      </div>
    </div>
  )
}

test('usePopover - props', async () => {
  const ref = vi.fn()
  const children = <></>

  const { result } = renderHook(() => usePopover({ ref, children }))

  expect(result.current).toEqual({
    overlay: {
      anchor: null,
      positioned: null,
      open: false,
      toggle: expect.any(Function),
    },
    position: 'below-start',
    anchor: null,
    positioned: {
      props: {
        id: expect.stringMatching(/^popover-[a-z0-9]{8}$/),
        role: 'dialog',
        'aria-modal': false,
        popover: 'manual',
        tabIndex: undefined,
        style: { display: 'none' },
        ref: { current: null },
        onClickCapture: expect.any(Function),
        children: expect.objectContaining({
          type: OverlayContext,
          props: {
            value: result.current.overlay,
            children: expect.objectContaining({
              type: Keyboard,
              props: result.current.keyboard.props,
            }),
          },
        }),
      },
    },
    keyboard: {
      props: {
        direction: 'block',
        ref: expect.any(Function),
        children,
      },
    },
  })
  expect(ref).toHaveBeenCalledTimes(1)
  expect(ref).toHaveBeenCalledWith(result.current.overlay)
})

test('usePopover - nested', { timeout: 120_000 }, async () => {
  render(<Page />)

  {
    expect(trigger1.current).toBeInstanceOf(HTMLButtonElement)
    expect(popover1).toEqual({
      overlay: {
        anchor: trigger1.current,
        positioned: null,
        open: false,
        toggle: expect.any(Function),
      },
      position: 'below-start',
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': undefined,
          'aria-expanded': false,
          'aria-haspopup': true,
          style: {},
          ref: { current: trigger1.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          onKeyUp: expect.any(Function),
          children: 'Trigger1',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^popover-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': false,
          popover: 'manual',
          tabIndex: undefined,
          style: { display: 'none' },
          ref: { current: null },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: {
              value: popover1.overlay,
              children: expect.objectContaining({
                type: Keyboard,
                props: popover1.keyboard.props,
              }),
            },
          }),
        },
      },
      keyboard: {
        props: {
          direction: 'block',
          ref: expect.any(Function),
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
    expect(container1.current?.matches(':popover-open')).toBe(true)
    expect(popover1).toEqual({
      overlay: {
        anchor: trigger1.current,
        positioned: container1.current,
        open: true,
        toggle: expect.any(Function),
      },
      position: 'below-start',
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': popover1.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: {},
          ref: { current: trigger1.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          onKeyUp: expect.any(Function),
          children: 'Trigger1',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^popover-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': false,
          popover: 'manual',
          tabIndex: undefined,
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            translate: '160px 248px',
            willChange: 'translate',
          },
          ref: { current: container1.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: {
              value: popover1.overlay,
              children: expect.objectContaining({
                type: Keyboard,
                props: popover1.keyboard.props,
              }),
            },
          }),
        },
      },
      keyboard: {
        props: {
          direction: 'block',
          ref: expect.any(Function),
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
    expect(container1.current?.matches(':popover-open')).toBe(true)
    expect(container2.current?.matches(':popover-open')).toBe(true)
    expect(popover2).toEqual({
      overlay: {
        anchor: trigger2.current,
        positioned: container2.current,
        open: true,
        toggle: expect.any(Function),
      },
      position: 'below-start',
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': popover2.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: {},
          ref: { current: trigger2.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          onKeyUp: expect.any(Function),
          children: 'Trigger2',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^popover-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': false,
          popover: 'manual',
          tabIndex: undefined,
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            translate: '220px 446px',
            willChange: 'translate',
          },
          ref: { current: container2.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: {
              value: popover2.overlay,
              children: expect.objectContaining({
                type: Keyboard,
                props: popover2.keyboard.props,
              }),
            },
          }),
        },
      },
      keyboard: {
        props: {
          direction: 'block',
          ref: expect.any(Function),
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
    await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

    expect(container1.current?.matches(':popover-open')).toBe(true)
    expect(container2.current?.matches(':popover-open')).toBe(undefined)

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(0)
    expect(spy4).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

    expect(container1.current?.matches(':popover-open')).toBe(undefined)
    expect(container2.current?.matches(':popover-open')).toBe(undefined)

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

test('usePopover - discrete', { timeout: 120_000 }, async () => {
  render(<Page />)

  {
    expect(trigger3.current).toBeInstanceOf(HTMLButtonElement)
    expect(popover3).toEqual({
      overlay: {
        anchor: trigger3.current,
        positioned: null,
        open: false,
        toggle: expect.any(Function),
      },
      position: 'below-start',
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': undefined,
          'aria-expanded': false,
          'aria-haspopup': true,
          style: {},
          ref: { current: trigger3.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          onKeyUp: expect.any(Function),
          children: 'Trigger3',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^popover-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': false,
          popover: 'manual',
          tabIndex: undefined,
          style: { display: 'none' },
          ref: { current: null },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: {
              value: popover3.overlay,
              children: expect.objectContaining({
                type: Keyboard,
                props: popover3.keyboard.props,
              }),
            },
          }),
        },
      },
      keyboard: {
        props: {
          direction: 'block',
          ref: expect.any(Function),
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
    expect(container3.current?.matches(':popover-open')).toBe(true)
    expect(popover3).toEqual({
      overlay: {
        anchor: trigger3.current,
        positioned: container3.current,
        open: true,
        toggle: expect.any(Function),
      },
      position: 'below-start',
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': popover3.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: {},
          ref: { current: trigger3.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          onKeyUp: expect.any(Function),
          children: 'Trigger3',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^popover-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': false,
          popover: 'manual',
          tabIndex: undefined,
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            translate: '160px 348px',
            willChange: 'translate',
          },
          ref: { current: container3.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: {
              value: popover3.overlay,
              children: expect.objectContaining({
                type: Keyboard,
                props: popover3.keyboard.props,
              }),
            },
          }),
        },
      },
      keyboard: {
        props: {
          direction: 'block',
          ref: expect.any(Function),
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
    expect(container3.current?.matches(':popover-open')).toBe(true)
    expect(container4.current?.matches(':popover-open')).toBe(true)
    expect(popover4).toEqual({
      overlay: {
        anchor: trigger4.current,
        positioned: container4.current,
        open: true,
        toggle: expect.any(Function),
      },
      position: 'below',
      anchor: expect.objectContaining({
        type: 'button',
        props: {
          'aria-controls': popover4.positioned.props.id,
          'aria-expanded': true,
          'aria-haspopup': true,
          style: {},
          ref: { current: trigger4.current },
          onClick: expect.any(Function),
          onKeyDown: expect.any(Function),
          onKeyUp: expect.any(Function),
          children: 'Trigger4',
        },
      }),
      positioned: {
        props: {
          id: expect.stringMatching(/^popover-[a-z0-9]{8}$/),
          role: 'dialog',
          'aria-modal': false,
          popover: 'manual',
          tabIndex: undefined,
          style: {
            position: 'fixed',
            top: 0,
            left: 0,
            translate: '160px 546px',
            willChange: 'translate',
          },
          ref: { current: container4.current },
          onClickCapture: expect.any(Function),
          children: expect.objectContaining({
            type: OverlayContext,
            props: {
              value: popover4.overlay,
              children: expect.objectContaining({
                type: Keyboard,
                props: popover4.keyboard.props,
              }),
            },
          }),
        },
      },
      keyboard: {
        props: {
          direction: 'block',
          ref: expect.any(Function),
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
    await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

    expect(container3.current?.matches(':popover-open')).toBe(true)
    expect(container4.current?.matches(':popover-open')).toBe(undefined)

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(0)
    expect(spy4).toHaveBeenCalledTimes(1)
  }

  {
    await act(() => fireEvent.keyDown(document, { key: 'Escape' }))

    expect(container3.current?.matches(':popover-open')).toBe(undefined)
    expect(container4.current?.matches(':popover-open')).toBe(undefined)

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

test('usePopover - click inside nested', async () => {
  render(<Page />)

  await act(() => {
    trigger1.current?.focus()
    trigger1.current?.click()
  })

  await act(() => {
    trigger2.current?.focus()
    trigger2.current?.click()
  })

  expect(container1.current?.matches(':popover-open')).toBe(true)
  expect(container2.current?.matches(':popover-open')).toBe(true)

  await act(() => {
    container2.current?.click()
  })

  expect(container1.current?.matches(':popover-open')).toBe(true)
  expect(container2.current?.matches(':popover-open')).toBe(true)

  await act(() => {
    close2.current?.focus()
    close2.current?.click()
  })

  expect(container1.current?.matches(':popover-open')).toBe(true)
  expect(container2.current?.matches(':popover-open')).toBe(undefined)

  await act(() => {
    trigger2.current?.focus()
    trigger2.current?.click()
  })

  expect(container1.current?.matches(':popover-open')).toBe(true)
  expect(container2.current?.matches(':popover-open')).toBe(true)

  await act(() => {
    container1.current?.click()
  })

  expect(container1.current?.matches(':popover-open')).toBe(true)
  expect(container2.current?.matches(':popover-open')).toBe(undefined)

  await act(() => {
    trigger2.current?.focus()
    trigger2.current?.click()
  })

  expect(container1.current?.matches(':popover-open')).toBe(true)
  expect(container2.current?.matches(':popover-open')).toBe(true)

  await act(() => {
    document.body.click()
  })

  expect(container1.current?.matches(':popover-open')).toBe(undefined)
  expect(container2.current?.matches(':popover-open')).toBe(undefined)
})

test('usePopover - click inside discrete', async () => {
  render(<Page />)

  await act(() => {
    trigger3.current?.focus()
    trigger3.current?.click()
  })

  await act(() => {
    trigger4.current?.focus()
    trigger4.current?.click()
  })

  expect(container3.current?.matches(':popover-open')).toBe(true)
  expect(container4.current?.matches(':popover-open')).toBe(true)

  await act(() => {
    container4.current?.click()
  })

  expect(container3.current?.matches(':popover-open')).toBe(true)
  expect(container4.current?.matches(':popover-open')).toBe(true)

  await act(() => {
    close4.current?.focus()
    close4.current?.click()
  })

  expect(container3.current?.matches(':popover-open')).toBe(true)
  expect(container4.current?.matches(':popover-open')).toBe(undefined)

  await act(() => {
    trigger4.current?.focus()
    trigger4.current?.click()
  })

  expect(container3.current?.matches(':popover-open')).toBe(true)
  expect(container4.current?.matches(':popover-open')).toBe(true)

  await act(() => {
    container3.current?.click()
  })

  expect(container3.current?.matches(':popover-open')).toBe(true)
  expect(container4.current?.matches(':popover-open')).toBe(undefined)

  await act(() => {
    trigger4.current?.focus()
    trigger4.current?.click()
  })

  expect(container3.current?.matches(':popover-open')).toBe(true)
  expect(container4.current?.matches(':popover-open')).toBe(true)

  await act(async () => {
    const position = { x: 0, y: 0 }
    await userEvent.click(document.body, { position })
  })

  expect(container3.current?.matches(':popover-open')).toBe(undefined)
  expect(container4.current?.matches(':popover-open')).toBe(undefined)
})

test('usePopover - anchor props', async () => {
  function Page() {
    const popoverValue = usePopover({
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
      popover1 = popoverValue
    })

    return (
      <>
        {popoverValue.anchor}
        {popoverValue.overlay.open && (
          <div {...popoverValue.positioned.props}>
            <ul role='listbox' id='listbox'>
              <li>Item 1</li>
              <li>Item 2</li>
              <li>Item 3</li>
            </ul>
          </div>
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
  expect(popover1.overlay.anchor).toBe(trigger1.current)
  expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
})

test('usePopover - open with anchor', async () => {
  const spy = vi.spyOn(HTMLDivElement.prototype, 'showPopover')

  function Page() {
    const popoverValue = usePopover({ anchor: <button ref={trigger1} /> })

    useEffect(() => {
      popover1 = popoverValue
    })

    return (
      <>
        {popoverValue.anchor}
        {popoverValue.overlay.open && (
          <div {...popoverValue.positioned.props} />
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    trigger1.current?.focus()
    trigger1.current?.click()
  })

  expect(popover1.overlay.anchor).toBe(trigger1.current)
  expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith({ source: trigger1.current })
})

test('usePopover - open programmatically via a trigger', async () => {
  const spy = vi.spyOn(HTMLDivElement.prototype, 'showPopover')

  function Page() {
    const popoverValue = usePopover({})

    useEffect(() => {
      popover1 = popoverValue
    })

    return (
      <>
        <button ref={trigger1} onClick={popoverValue.overlay.toggle} />
        {popoverValue.overlay.open && (
          <div {...popoverValue.positioned.props} />
        )}
      </>
    )
  }

  render(<Page />)

  await act(() => {
    trigger1.current?.focus()
    trigger1.current?.click()
  })

  expect(popover1.overlay.anchor).toBeNull()
  expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith({ source: trigger1.current })
})

test('usePopover - open programmatically without an anchor or trigger', async () => {
  const spy = vi.spyOn(HTMLDivElement.prototype, 'showPopover')

  function Page() {
    const popoverValue = usePopover({ open: true })

    useEffect(() => {
      popover1 = popoverValue
    })

    return (
      <>
        <button ref={trigger1} />
        {popoverValue.overlay.open && (
          <div {...popoverValue.positioned.props} />
        )}
      </>
    )
  }

  render(<Page />)

  expect(popover1.overlay.anchor).toBeNull()
  expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith(undefined)
})

test('usePopover - positioning', async () => {
  const positioning: PositioningOptions = {}

  function Page() {
    const popoverValue = usePopover({
      anchor: <button ref={trigger1}>Trigger1</button>,
      positioning,
    })

    useEffect(() => {
      popover1 = popoverValue
    })

    return (
      <>
        {popoverValue.anchor}
        {popoverValue.overlay.open && (
          <div {...popoverValue.positioned.props} />
        )}
        <button ref={trigger2}>Trigger2</button>
      </>
    )
  }

  const { rerender } = render(<Page key={1} />)

  {
    await act(() => {
      trigger1.current?.click()
    })

    expect(trigger1.current?.getBoundingClientRect().left).toBe(160)
    expect(trigger2.current?.getBoundingClientRect().left).toBe(240)
    expect(popover1.overlay.anchor).toBe(trigger1.current)
    expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
    expect(popover1.position).toBe('below-start')
    expect(popover1.positioned.props.style?.translate).toBe('160px 248px')
  }

  positioning.anchorRef = trigger2
  rerender(<Page key={2} />)

  {
    await act(() => {
      trigger1.current?.click()
    })

    expect(trigger1.current?.getBoundingClientRect().left).toBe(160)
    expect(trigger2.current?.getBoundingClientRect().left).toBe(240)
    expect(popover1.overlay.anchor).toBe(trigger1.current)
    expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
    expect(popover1.position).toBe('below-start')
    expect(popover1.positioned.props.style?.translate).toBe('240px 248px')
  }
})

test('usePopover - keyboard navigation', async () => {
  const keyboardRef = createRef<Keyboard>()

  function Item(props: React.ComponentProps<'div'>) {
    return <div {...useKeyboard(props)} />
  }

  function Page() {
    const popoverValue = usePopover({
      anchor: <button ref={trigger1} />,
      keyboard: { ref: keyboardRef },
      onToggle: onToggle1,
      children: (
        <>
          <Item data-testid='item1'>Item 1</Item>
          <Item data-testid='item2'>Item 2</Item>
          <Item data-testid='item3'>Item 3</Item>
        </>
      ),
    })

    useEffect(() => {
      popover1 = popoverValue
    })

    return (
      <>
        {popoverValue.anchor}
        {popoverValue.overlay.open && (
          <Portal>
            <div {...popoverValue.positioned.props} />
          </Portal>
        )}
      </>
    )
  }

  const { getByTestId } = render(<Page />)

  await act(() => {
    trigger1.current?.focus()
  })

  await act(() => {
    createEvent({ target: document.activeElement, key: 'ArrowDown' })
  })

  expect(popover1.overlay.open).toBe(true)
  expect(popover1.overlay.anchor).toBe(trigger1.current)
  expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
  expect(getByTestId('item1')).toHaveFocus()
  expect(keyboardRef.current).toEqual({
    type: 'linear',
    direction: 'both',
    active: expect.objectContaining({ value: getByTestId('item1') }),
    isFocusVisible: false,
    navigate: expect.any(Function),
    activate: expect.any(Function),
  })

  await act(() => {
    createEvent({ target: document.activeElement, key: 'ArrowUp' })
  })

  expect(popover1.overlay.open).toBe(true)
  expect(popover1.overlay.anchor).toBe(trigger1.current)
  expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
  expect(getByTestId('item3')).toHaveFocus()

  await act(() => {
    keyboardRef.current?.navigate(createEvent({ key: 'ArrowUp' }))
  })

  expect(popover1.overlay.open).toBe(true)
  expect(popover1.overlay.anchor).toBe(trigger1.current)
  expect(popover1.overlay.positioned).toBeInstanceOf(HTMLDivElement)
  expect(getByTestId('item2')).toHaveFocus()

  await act(() => {
    createEvent({ target: document.activeElement, key: 'Escape' })
  })

  expect(popover1.overlay.open).toBe(false)
  expect(popover1.overlay.anchor).toBe(trigger1.current)
  expect(popover1.overlay.positioned).toBeNull()
  expect(trigger1.current).toHaveFocus()

  expect(onToggle1).toHaveBeenCalledTimes(2)
  expect(onToggle1).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      type: 'keydown',
      key: 'ArrowDown',
      target: trigger1.current,
      defaultPrevented: true,
    }),
    true
  )
  expect(onToggle1).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      type: 'keydown',
      key: 'Escape',
      target: expect.objectContaining({ textContent: 'Item 2' }),
      defaultPrevented: true,
    }),
    false,
    'escape'
  )
})
