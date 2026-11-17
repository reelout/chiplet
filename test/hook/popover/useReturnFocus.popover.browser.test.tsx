import { useOverlay, useReturnFocus } from '#hook'
import { render } from '@testing-library/react'
import {
  act,
  createRef,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type RefObject,
} from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, expect, test, vi } from 'vitest'
import { page, server, userEvent } from 'vitest/browser'

let popover1: RefObject<HTMLDivElement | null>
let popover2: RefObject<HTMLDivElement | null>

beforeEach(() => {
  document.body.innerHTML = ''
  document.body.style.padding = '160px'
  document.body.style.margin = '0'

  popover1 = createRef()
  popover2 = createRef()
})

test('popover - tabIndex', () => {
  const el = document.createElement('div')
  el.popover = 'manual'
  document.body.appendChild(el)
  expect(el).not.toHaveAttribute('tabIndex')
  expect(el.tabIndex).toBe(-1)
})

test('popover - showPopover()', () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <div data-testid='popover' popover='manual'>
        <button data-testid='close'>Close</button>
      </div>
    </>
  )

  const anchor = page.getByTestId('anchor').element() as HTMLButtonElement
  const popover = page.getByTestId('popover').element() as HTMLElement
  const close = page.getByTestId('close').element() as HTMLButtonElement

  anchor.focus()
  expect(document.activeElement).toBe(anchor)

  close.focus()
  expect(document.activeElement).toBe(anchor)

  popover.showPopover()
  expect(popover.matches('[popover]:popover-open')).toBe(true)
  expect(document.activeElement).toBe(anchor)

  close.focus()
  expect(document.activeElement).toBe(close)

  anchor.focus()
  expect(document.activeElement).toBe(anchor)
})

test('popover - showPopover() - source', { retry: 3 }, async () => {
  function Page() {
    return (
      <>
        <button data-testid='trigger1'>Trigger1</button>
        <button data-testid='trigger2'>Trigger2</button>
        <div data-testid='popover' popover='manual' tabIndex={-1}>
          <button data-testid='close'>Close</button>
        </div>
      </>
    )
  }

  const { getByTestId } = render(<Page />)

  const trigger1 = getByTestId('trigger1')
  const popover = getByTestId('popover')
  const close = getByTestId('close')

  trigger1.focus()
  expect(trigger1).toHaveFocus()

  popover.showPopover({ source: trigger1 })
  expect(popover.matches('[popover]:popover-open')).toBe(true)
  expect(trigger1).toHaveFocus()

  await userEvent.keyboard('{Tab}')

  if (server.browser === 'webkit' && document.activeElement !== close) {
    await userEvent.keyboard('{Tab}')
    expect(document.body).toHaveFocus()

    await userEvent.keyboard('{Alt>}{Tab}{/Alt}')
    expect(trigger1).toHaveFocus()

    await userEvent.keyboard('{Alt>}{Tab}{/Alt}')
    expect(close).toHaveFocus()
  }

  expect(document.activeElement).toBe(close)
})

test('popover - hidePopover()', () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <div data-testid='popover' popover='manual' tabIndex={-1}>
        <button data-testid='close'>Close</button>
      </div>
      <button data-testid='trigger2'>Trigger2</button>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const trigger2 = page.getByTestId('trigger2').element() as HTMLButtonElement
  const popover = page.getByTestId('popover').element() as HTMLElement
  const close = page.getByTestId('close').element() as HTMLButtonElement

  {
    trigger2.focus()
    close.focus()
    expect(document.activeElement).toBe(trigger2)

    trigger2.focus()
    expect(document.activeElement).toBe(trigger2)

    popover.showPopover()
    expect(document.activeElement).toBe(trigger2)

    close.focus()
    expect(document.activeElement).toBe(close)

    popover.hidePopover()
    expect(document.activeElement).toBe(close)
  }

  {
    trigger1.focus()
    close.focus()
    expect(document.activeElement).toBe(trigger1)

    trigger1.focus()
    expect(document.activeElement).toBe(trigger1)

    popover.showPopover()
    expect(document.activeElement).toBe(trigger1)

    popover.focus()
    expect(document.activeElement).toBe(popover)

    popover.hidePopover()
    expect(document.activeElement).toBe(popover)
  }

  {
    trigger1.focus()
    expect(document.activeElement).toBe(trigger1)

    popover.showPopover()
    expect(document.activeElement).toBe(trigger1)

    close.focus()
    expect(document.activeElement).toBe(close)

    close.remove()
    expect(document.activeElement).toBe(document.body)

    popover.hidePopover()
    expect(document.activeElement).toBe(document.body)
  }

  {
    trigger2.focus()
    expect(document.activeElement).toBe(trigger2)

    popover.showPopover()
    expect(document.activeElement).toBe(trigger2)

    popover.focus()
    expect(document.activeElement).toBe(popover)

    popover.remove()
    expect(document.activeElement).toBe(document.body)
  }
})

test('popover - popoverTarget', async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1' popoverTarget='popover1'>
        Trigger1
      </button>
      <div data-testid='popover1' id='popover1' popover='manual' tabIndex={-1}>
        <button data-testid='close1' popoverTarget='popover1'>
          Close1
        </button>
        <button data-testid='trigger2' popoverTarget='popover2'>
          Trigger2
        </button>
      </div>
      <div data-testid='popover2' id='popover2' popover='manual' tabIndex={-1}>
        <button data-testid='close2' popoverTarget='popover2'>
          Close2
        </button>
      </div>
      <button data-testid='trigger3'>Trigger3</button>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const trigger2 = page.getByTestId('trigger2').element() as HTMLButtonElement
  const trigger3 = page.getByTestId('trigger3').element() as HTMLButtonElement
  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement

  trigger3.focus()
  expect(document.activeElement).toBe(trigger3)

  {
    trigger1.focus()
    trigger1.click()
    expect(document.activeElement).toBe(trigger1)

    trigger2.focus()
    trigger2.click()
    expect(document.activeElement).toBe(trigger2)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    {
      close2.focus()
      expect(document.activeElement).toBe(close2)

      close2.click()
      expect(document.activeElement).toBe(close2)

      expect(popover1.matches(':popover-open')).toBe(true)
      expect(popover2.matches(':popover-open')).toBe(false)
    }

    {
      close1.focus()
      expect(document.activeElement).toBe(close1)

      close1.click()
      expect(document.activeElement).toBe(close1)

      expect(popover1.matches(':popover-open')).toBe(false)
      expect(popover2.matches(':popover-open')).toBe(false)
    }
  }

  trigger3.focus()
  expect(document.activeElement).toBe(trigger3)

  {
    popover1.showPopover()
    expect(document.activeElement).toBe(trigger3)

    popover2.showPopover()
    expect(document.activeElement).toBe(trigger3)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    close2.focus()
    expect(document.activeElement).toBe(close2)

    close2.click()
    expect(document.activeElement).toBe(close2)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(false)
  }
}, 60_000)

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#auto_state_and_light_dismiss
 */
test('popover - auto (light dismiss) - click outside', async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <div data-testid='popover' popover='auto'>
        <button data-testid='close'>Close</button>
      </div>
    </>
  )

  const anchor = page.getByTestId('anchor').element() as HTMLButtonElement
  const popover = page.getByTestId('popover').element() as HTMLDivElement

  const spy = vi.fn()
  document.addEventListener('click', spy)

  popover.showPopover()
  expect(popover.matches('[popover]:popover-open')).toBe(true)
  expect(document.activeElement).toBe(document.body)

  await userEvent.click(document.body, { position: { x: 0, y: 0 } })

  expect(popover.matches('[popover]:popover-open')).toBe(false)
  expect(document.activeElement).toBe(document.body)

  popover.showPopover()
  expect(popover.matches('[popover]:popover-open')).toBe(true)
  expect(document.activeElement).toBe(document.body)

  await userEvent.click(anchor)

  expect(popover.matches('[popover]:popover-open')).toBe(false)
  expect(document.activeElement).toEqual(
    {
      chromium: anchor,
      firefox: anchor,
      webkit: expect.toBeOneOf([document.body, anchor]),
    }[server.browser]
  )

  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: document.body })
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ target: anchor })
  )
}, 60_000)

/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Popover_API/Using#auto_state_and_light_dismiss
 */
test('popover - auto (light dismiss) - escape', async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <div data-testid='popover' popover='auto'>
        <button data-testid='close'>Close</button>
      </div>
    </>
  )

  const popover = page.getByTestId('popover').element() as HTMLDivElement

  const spy = vi
    .fn()
    .mockReturnValueOnce(undefined)
    .mockImplementationOnce((ev) => ev.preventDefault())
  document.addEventListener('keydown', spy)

  popover.showPopover()
  expect(popover.matches('[popover]:popover-open')).toBe(true)
  expect(document.activeElement).toBe(document.body)

  await userEvent.keyboard('{Escape}')

  expect(popover.matches('[popover]:popover-open')).toBe(false)
  expect(document.activeElement).toBe(document.body)

  popover.showPopover()
  expect(popover.matches('[popover]:popover-open')).toBe(true)
  expect(document.activeElement).toBe(document.body)

  await userEvent.keyboard('{Escape}')

  expect(popover.matches('[popover]:popover-open')).toBe(true)
  expect(document.activeElement).toBe(document.body)

  document.removeEventListener('keydown', spy)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      target: document.body,
      key: 'Escape',
      defaultPrevented: false,
    })
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      target: document.body,
      key: 'Escape',
      defaultPrevented: true,
    })
  )
}, 60_000)

test('popover - manual - escape - #1', { timeout: 120_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <div data-testid='popover1' popover='manual' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <button data-testid='trigger2' popoverTarget='popover2'>
          Trigger2
        </button>
      </div>
      <div data-testid='popover2' id='popover2' popover='manual' tabIndex={-1}>
        <button data-testid='close2'>Close2</button>
      </div>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const trigger2 = page.getByTestId('trigger2').element() as HTMLButtonElement
  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  popover1.addEventListener('toggle', spy1, true)
  popover2.addEventListener('toggle', spy2, true)
  popover1.addEventListener('beforetoggle', spy3, true)
  popover2.addEventListener('beforetoggle', spy4, true)
  popover1.addEventListener('toggle', spy5, false)
  popover2.addEventListener('toggle', spy6, false)
  popover1.addEventListener('beforetoggle', spy7, false)
  popover2.addEventListener('beforetoggle', spy8, false)

  trigger1.focus()
  expect(document.activeElement).toBe(trigger1)

  {
    popover1.showPopover()
    expect(document.activeElement).toBe(trigger1)

    trigger2.focus()
    trigger2.click()
    expect(document.activeElement).toBe(trigger2)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
  }
})

test('popover - manual - escape - #2', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <div data-testid='popover1' popover='manual' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <button data-testid='trigger2' popoverTarget='popover2'>
          Trigger2
        </button>
      </div>
      <div data-testid='popover2' id='popover2' popover='manual' tabIndex={-1}>
        <button data-testid='close2'>Close2</button>
      </div>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const trigger2 = page.getByTestId('trigger2').element() as HTMLButtonElement
  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  popover1.addEventListener('toggle', spy1, true)
  popover2.addEventListener('toggle', spy2, true)
  popover1.addEventListener('beforetoggle', spy3, true)
  popover2.addEventListener('beforetoggle', spy4, true)
  popover1.addEventListener('toggle', spy5, false)
  popover2.addEventListener('toggle', spy6, false)
  popover1.addEventListener('beforetoggle', spy7, false)
  popover2.addEventListener('beforetoggle', spy8, false)

  trigger1.focus()
  expect(document.activeElement).toBe(trigger1)

  {
    popover1.showPopover()
    expect(document.activeElement).toBe(trigger1)

    trigger2.focus()
    trigger2.click()
    expect(document.activeElement).toBe(trigger2)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    spy3.mockImplementation((ev) => {
      if (ev.newState === 'closed') {
        ev.preventDefault()
      }
    })
    spy7.mockImplementation((ev) => {
      if (ev.newState === 'closed') {
        ev.preventDefault()
      }
    })

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
  }
})

test('popover - manual - escape - #3', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <div data-testid='popover1' popover='manual' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <button data-testid='trigger2'>Trigger2</button>
        <div data-testid='popover2' popover='manual' tabIndex={-1}>
          <button data-testid='close2'>Close2</button>
        </div>
      </div>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  popover1.addEventListener('toggle', spy1, true)
  popover2.addEventListener('toggle', spy2, true)
  popover1.addEventListener('beforetoggle', spy3, true)
  popover2.addEventListener('beforetoggle', spy4, true)
  popover1.addEventListener('toggle', spy5, false)
  popover2.addEventListener('toggle', spy6, false)
  popover1.addEventListener('beforetoggle', spy7, false)
  popover2.addEventListener('beforetoggle', spy8, false)

  trigger1.focus()
  expect(document.activeElement).toBe(trigger1)

  {
    popover1.showPopover()
    expect(document.activeElement).toBe(trigger1)

    popover2.showPopover()
    expect(document.activeElement).toBe(trigger1)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
  }
})

test('popover - manual - escape - #4', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <div data-testid='popover1' popover='manual' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <button data-testid='trigger2'>Trigger2</button>
        <div data-testid='popover2' popover='manual' tabIndex={-1}>
          <button data-testid='close2'>Close2</button>
        </div>
      </div>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  popover1.addEventListener('toggle', spy1, true)
  popover2.addEventListener('toggle', spy2, true)
  popover1.addEventListener('beforetoggle', spy3, true)
  popover2.addEventListener('beforetoggle', spy4, true)
  popover1.addEventListener('toggle', spy5, false)
  popover2.addEventListener('toggle', spy6, false)
  popover1.addEventListener('beforetoggle', spy7, false)
  popover2.addEventListener('beforetoggle', spy8, false)

  trigger1.focus()
  expect(document.activeElement).toBe(trigger1)

  {
    popover1.showPopover()
    expect(document.activeElement).toBe(trigger1)

    popover2.showPopover()
    expect(document.activeElement).toBe(trigger1)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    spy3.mockImplementation((ev) => {
      if (ev.newState === 'closed') {
        ev.preventDefault()
      }
    })
    spy7.mockImplementation((ev) => {
      if (ev.newState === 'closed') {
        ev.preventDefault()
      }
    })

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
  }
})

test('popover - auto - toggle event - #1', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <div data-testid='popover1' popover='auto'>
        Popover1
      </div>
      <div data-testid='popover2' popover='auto'>
        Popover2
      </div>
    </>
  )

  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const spy1 = vi.fn()
  const spy2 = vi.fn()
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn()
  const spy6 = vi.fn()
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  popover1.addEventListener('toggle', spy1, true)
  popover2.addEventListener('toggle', spy2, true)
  popover1.addEventListener('beforetoggle', spy3, true)
  popover2.addEventListener('beforetoggle', spy4, true)
  popover1.addEventListener('toggle', spy5, false)
  popover2.addEventListener('toggle', spy6, false)
  popover1.addEventListener('beforetoggle', spy7, false)
  popover2.addEventListener('beforetoggle', spy8, false)

  {
    await new Promise((resolve) => setTimeout(resolve, 16.6667))

    popover1.showPopover()

    await new Promise((resolve) => setTimeout(resolve, 16.6667))

    popover2.showPopover()

    await new Promise((resolve) => setTimeout(resolve, 16.6667))

    expect(popover1.matches(':popover-open')).toBe(false)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(2)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(2)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'closed',
        target: popover1,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: false,
        newState: 'closed',
        target: popover1,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'closed',
        target: popover1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: false,
        newState: 'closed',
        target: popover1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
  }
})

test('popover - manual - toggle event - #2', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <div data-testid='popover1' popover='manual' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <button data-testid='trigger2' popoverTarget='popover2'>
          Trigger2
        </button>
      </div>
      <div data-testid='popover2' id='popover2' popover='manual' tabIndex={-1}>
        <button data-testid='close2'>Close2</button>
      </div>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const trigger2 = page.getByTestId('trigger2').element() as HTMLButtonElement
  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  popover1.addEventListener('toggle', spy1, true)
  popover2.addEventListener('toggle', spy2, true)
  popover1.addEventListener('beforetoggle', spy3, true)
  popover2.addEventListener('beforetoggle', spy4, true)
  popover1.addEventListener('toggle', spy5, false)
  popover2.addEventListener('toggle', spy6, false)
  popover1.addEventListener('beforetoggle', spy7, false)
  popover2.addEventListener('beforetoggle', spy8, false)

  trigger1.focus()
  expect(document.activeElement).toBe(trigger1)

  {
    popover1.showPopover()
    expect(document.activeElement).toBe(trigger1)

    trigger2.focus()
    trigger2.click()
    expect(document.activeElement).toBe(trigger2)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
  }
})

test('popover - manual - toggle event - #3', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <div data-testid='popover1' popover='manual' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <div data-testid='popover2' popover='manual' tabIndex={-1}>
          <button data-testid='close2'>Close2</button>
        </div>
      </div>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const popover1 = page.getByTestId('popover1').element() as HTMLElement
  const popover2 = page.getByTestId('popover2').element() as HTMLElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  popover1.addEventListener('toggle', spy1, true)
  popover2.addEventListener('toggle', spy2, true)
  popover1.addEventListener('beforetoggle', spy3, true)
  popover2.addEventListener('beforetoggle', spy4, true)
  popover1.addEventListener('toggle', spy5, false)
  popover2.addEventListener('toggle', spy6, false)
  popover1.addEventListener('beforetoggle', spy7, false)
  popover2.addEventListener('beforetoggle', spy8, false)

  trigger1.focus()
  expect(document.activeElement).toBe(trigger1)

  {
    popover1.showPopover()
    expect(document.activeElement).toBe(trigger1)

    popover2.showPopover()
    expect(document.activeElement).toBe(trigger1)

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')

    expect(popover1.matches(':popover-open')).toBe(true)
    expect(popover2.matches(':popover-open')).toBe(true)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: popover2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: popover1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: popover2,
      })
    )
  }
})

function Page({ type = 'render' }: { type?: 'render' | 'effect' }) {
  const [, setPopover1] = useState<HTMLDivElement | null>(null)
  const [, setPopover2] = useState<HTMLDivElement | null>(null)

  const [open1, setOpen1] = useState(false)
  const [open2, setOpen2] = useState(false)

  const handleToggle1 = useCallback(() => setOpen1((open) => !open), [])
  const handleToggle2 = useCallback(() => setOpen2((open) => !open), [])

  const handleClose1 = useCallback(() => setOpen1(false), [])
  const handleClose2 = useCallback(() => setOpen2(false), [])

  const savePopover1 = useCallback((el: HTMLDivElement | null) => {
    setPopover1((popover1.current = el))
  }, [])
  const savePopover2 = useCallback((el: HTMLDivElement | null) => {
    setPopover2((popover2.current = el))
  }, [])

  useLayoutEffect(() => {
    if (!open1) return

    const { current } = popover1

    const onToggle = (ev: Event) => {
      const { newState } = ev as ToggleEvent

      if (newState === 'closed') {
        setOpen1(false)
      }
    }

    current?.addEventListener('toggle', onToggle)

    return () => {
      current?.removeEventListener('toggle', onToggle)
    }
  }, [open1])

  useLayoutEffect(() => {
    if (!open2) return

    const { current } = popover2

    const onToggle = (ev: Event) => {
      const { newState } = ev as ToggleEvent

      if (newState === 'closed') {
        setOpen2(false)
      }
    }

    current?.addEventListener('toggle', onToggle)

    return () => {
      current?.removeEventListener('toggle', onToggle)
    }
  }, [open2])

  useLayoutEffect(() => {
    if (!open1) return

    const { current } = popover1
    current?.showPopover()

    return () => {
      if (type === 'effect') {
        current?.hidePopover()
      }
    }
  })

  useLayoutEffect(() => {
    if (!open2) return

    const { current } = popover2
    current?.showPopover()

    return () => {
      if (type === 'effect') {
        current?.hidePopover()
      }
    }
  })

  if (!open1 && type === 'render') {
    popover1.current?.hidePopover()
  }

  if (!open2 && type === 'render') {
    popover2.current?.hidePopover()
  }

  useReturnFocus(
    useOverlay({
      anchorRef: useRef(null),
      positionedRef: popover1,
      open: open1,
    })
  )

  useReturnFocus(
    useOverlay({
      anchorRef: useRef(null),
      positionedRef: popover2,
      open: open2,
    })
  )

  return (
    <>
      <button data-testid='trigger1' onClick={handleToggle1}>
        Trigger1
      </button>
      <button data-testid='trigger2' onClick={handleToggle1}>
        Trigger2
      </button>
      <button data-testid='trigger3' onClick={handleToggle2}>
        Trigger3
      </button>
      {open1 && (
        <div
          data-testid='popover1'
          popover='manual'
          tabIndex={-1}
          ref={savePopover1}
        >
          <button data-testid='close1' onClick={handleClose1}>
            Close1
          </button>
          <button data-testid='close2' onClick={handleClose1}>
            Close2
          </button>
        </div>
      )}
      {open2 && (
        <div
          data-testid='popover2'
          popover='manual'
          tabIndex={-1}
          ref={savePopover2}
        >
          <button data-testid='close3' onClick={handleClose2}>
            Close3
          </button>
          <button data-testid='close4' onClick={handleClose2}>
            Close4
          </button>
        </div>
      )}
    </>
  )
}

test('useReturnFocus - #1', async () => {
  const { getByTestId, rerender } = render(<Page />)

  const trigger1 = getByTestId('trigger1')
  const trigger2 = getByTestId('trigger2')

  {
    await act(() => {
      trigger2.focus()
      trigger2.click()
    })

    expect(document.activeElement).toBe(trigger2)

    const spy = vi.spyOn(trigger2, 'focus')

    await act(() => {
      const close1 = getByTestId('close1')
      close1.focus()
      expect(document.activeElement).toBe(close1)
      close1.click()
    })

    expect(document.activeElement).toBe(trigger2)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith({ preventScroll: true })
  }

  rerender(<Page />)

  {
    await act(() => {
      trigger1.focus()
      trigger1.click()
    })

    expect(document.activeElement).toBe(trigger1)

    const spy = vi.spyOn(trigger1, 'focus')

    await act(() => {
      const close1 = getByTestId('close1')
      close1.focus()
      expect(document.activeElement).toBe(close1)
      close1.click()
    })

    expect(document.activeElement).toBe(trigger1)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith({ preventScroll: true })
  }
})

test('useReturnFocus - #2', async () => {
  const { getByTestId, rerender } = render(<Page type='effect' />)

  const trigger1 = getByTestId('trigger1')
  const trigger2 = getByTestId('trigger2')

  {
    await act(() => {
      trigger2.focus()
      trigger2.click()
    })

    expect(document.activeElement).toBe(trigger2)

    const spy = vi.spyOn(trigger2, 'focus')

    await act(() => {
      const close1 = getByTestId('close1')
      close1.focus()
      expect(document.activeElement).toBe(close1)
      close1.click()
    })

    expect(document.activeElement).toBe(trigger2)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith({ preventScroll: true })
  }

  rerender(<Page type='effect' />)

  {
    await act(() => {
      trigger1.focus()
      trigger1.click()
    })

    expect(document.activeElement).toBe(trigger1)

    const spy = vi.spyOn(trigger1, 'focus')

    await act(() => {
      const close1 = getByTestId('close1')
      close1.focus()
      expect(document.activeElement).toBe(close1)
      close1.click()
    })

    expect(document.activeElement).toBe(trigger1)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith({ preventScroll: true })
  }
})

test('useReturnFocus - #3', async () => {
  const { getByTestId, queryByTestId, rerender } = render(<Page />)

  const trigger1 = getByTestId('trigger1')
  const trigger2 = getByTestId('trigger2')
  const trigger3 = getByTestId('trigger3')
  const spy2 = vi.spyOn(trigger2, 'focus')
  const spy3 = vi.spyOn(trigger3, 'focus')

  {
    await act(() => {
      trigger2.focus()
      trigger2.click()
      spy2.mockClear()
    })

    rerender(<Page />)

    expect(document.activeElement).toBe(trigger2)
    expect(queryByTestId('popover1')).toBeInTheDocument()
    expect(queryByTestId('popover2')).toBeNull()
  }

  {
    trigger1.focus()
    expect(document.activeElement).toBe(trigger1)
  }

  {
    await act(() => {
      trigger3.focus()
      trigger3.click()
      spy3.mockClear()
    })

    rerender(<Page />)

    expect(document.activeElement).toBe(trigger3)
    expect(queryByTestId('popover1')).toBeInTheDocument()
    expect(queryByTestId('popover2')).toBeInTheDocument()
  }

  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)
})

test('useReturnFocus - #4', async () => {
  const { getByTestId, queryByTestId, rerender } = render(<Page />)

  const trigger1 = getByTestId('trigger1')
  const trigger2 = getByTestId('trigger2')
  const trigger3 = getByTestId('trigger3')
  const spy2 = vi.spyOn(trigger2, 'focus')
  const spy3 = vi.spyOn(trigger3, 'focus')

  {
    await act(() => {
      trigger2.focus()
      trigger2.click()
      spy2.mockClear()
    })

    rerender(<Page />)

    expect(document.activeElement).toBe(trigger2)
    expect(queryByTestId('popover1')).toBeInTheDocument()
    expect(queryByTestId('popover2')).toBeNull()
  }

  {
    const close1 = getByTestId('close1')
    const close2 = getByTestId('close2')

    close1.focus()
    expect(document.activeElement).toBe(close1)
    trigger1.focus()
    expect(document.activeElement).toBe(trigger1)
    close2.focus()
    expect(document.activeElement).toBe(close2)
  }

  {
    await act(() => {
      trigger3.focus()
      trigger3.click()
      spy3.mockClear()
    })

    rerender(<Page />)

    expect(document.activeElement).toBe(trigger3)
    expect(queryByTestId('popover1')).toBeInTheDocument()
    expect(queryByTestId('popover2')).toBeInTheDocument()
  }

  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)
})
