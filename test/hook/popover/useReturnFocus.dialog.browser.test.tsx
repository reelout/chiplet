import { useOverlay, useReturnFocus } from '#hook'
import { blockTrustedPointerEvents } from '#test'
import { render } from '@testing-library/react'
import { act, useCallback, useLayoutEffect, useRef, useState } from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, expect, test, vi } from 'vitest'
import { page, server, userEvent } from 'vitest/browser'

blockTrustedPointerEvents()

beforeEach(() => {
  document.body.innerHTML = ''
  document.body.style.padding = '160px'
  document.body.style.margin = '0'
})

test('dialog - tabIndex', () => {
  expect(document.createElement('dialog').tabIndex).toBe(
    { chromium: -1, firefox: 0, webkit: -1 }[server.browser]
  )
})

test('dialog - showModal()', () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <dialog data-testid='dialog' tabIndex={-1}>
        <button data-testid='close'>Close</button>
      </dialog>
    </>
  )

  const anchor = page.getByTestId('anchor').element() as HTMLButtonElement
  const dialog = page.getByTestId('dialog').element() as HTMLDialogElement
  const close = page.getByTestId('close').element() as HTMLButtonElement

  anchor.focus()
  expect(document.activeElement).toBe(anchor)

  dialog.showModal()
  expect(dialog).toHaveProperty('open', true)
  expect(document.activeElement).toBe(close)

  anchor.focus()
  expect(document.activeElement).toBe(close) // https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/dialog#accessibility

  dialog.focus()
  expect(document.activeElement).toBe(dialog)

  anchor.focus()
  expect(document.activeElement).toBe(dialog)

  close.focus()
  expect(document.activeElement).toBe(close)
})

test('dialog - close()', () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='trigger1'>Trigger1</button>
      <dialog data-testid='dialog' tabIndex={-1}>
        <button data-testid='close'>Close</button>
      </dialog>
      <button data-testid='trigger2'>Trigger2</button>
    </>
  )

  const trigger1 = page.getByTestId('trigger1').element() as HTMLButtonElement
  const trigger2 = page.getByTestId('trigger2').element() as HTMLButtonElement
  const dialog = page.getByTestId('dialog').element() as HTMLDialogElement
  const close = page.getByTestId('close').element() as HTMLButtonElement

  {
    dialog.showModal()
    expect(document.activeElement).toBe(close)

    dialog.close()
    expect(document.activeElement).toBe(
      server.browser === 'chromium' ? document.body : close
    )

    close.remove()
    expect(document.activeElement).toBe(document.body)
  }

  {
    trigger2.focus()
    expect(document.activeElement).toBe(trigger2)

    dialog.showModal()
    expect(document.activeElement).toBe(dialog)

    dialog.close()
    expect(document.activeElement).toBe(trigger2)
  }

  {
    trigger1.focus()
    expect(document.activeElement).toBe(trigger1)

    dialog.showModal()
    expect(document.activeElement).toBe(dialog)

    dialog.close()
    expect(document.activeElement).toBe(trigger1)
  }

  {
    dialog.showModal()
    expect(document.activeElement).toBe(dialog)

    dialog.remove()
    expect(document.activeElement).toBe(document.body)
  }
})

test('dialog - escape - #1', { timeout: 120_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
      </dialog>
      <dialog data-testid='dialog2' tabIndex={-1}>
        <button data-testid='close2'>Close2</button>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('close', spy1, true)
  dialog2.addEventListener('close', spy2, true)
  dialog1.addEventListener('cancel', spy3, true)
  dialog2.addEventListener('cancel', spy4, true)
  dialog1.addEventListener('close', spy5, false)
  dialog2.addEventListener('close', spy6, false)
  dialog1.addEventListener('cancel', spy7, false)
  dialog2.addEventListener('cancel', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy2).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy3).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy4).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy5).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy6).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy7).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy8).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
  }
})

test('dialog - escape - #2', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
      </dialog>
      <dialog data-testid='dialog2' tabIndex={-1}>
        <button data-testid='close2'>Close2</button>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('close', spy1, true)
  dialog2.addEventListener('close', spy2, true)
  dialog1.addEventListener('cancel', spy3, true)
  dialog2.addEventListener('cancel', spy4, true)
  dialog1.addEventListener('close', spy5, false)
  dialog2.addEventListener('close', spy6, false)
  dialog1.addEventListener('cancel', spy7, false)
  dialog2.addEventListener('cancel', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    spy3.mockImplementation((ev) => ev.preventDefault())

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(0)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(2)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy2).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy4).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy5).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy6).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy8).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
  }
})

test('dialog - escape - #3', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
      </dialog>
      <dialog data-testid='dialog2' tabIndex={-1}>
        <button data-testid='close2'>Close2</button>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('close', spy1, true)
  dialog2.addEventListener('close', spy2, true)
  dialog1.addEventListener('cancel', spy3, true)
  dialog2.addEventListener('cancel', spy4, true)
  dialog1.addEventListener('close', spy5, false)
  dialog2.addEventListener('close', spy6, false)
  dialog1.addEventListener('cancel', spy7, false)
  dialog2.addEventListener('cancel', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    spy7.mockImplementation((ev) => ev.preventDefault())

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(0)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(2)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy2).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy4).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy5).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy6).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy8).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
  }
})

test('dialog - escape - #4', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <dialog data-testid='dialog2' tabIndex={-1}>
          <button data-testid='close2'>Close2</button>
        </dialog>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('close', spy1, true)
  dialog2.addEventListener('close', spy2, true)
  dialog1.addEventListener('cancel', spy3, true)
  dialog2.addEventListener('cancel', spy4, true)
  dialog1.addEventListener('close', spy5, false)
  dialog2.addEventListener('close', spy6, false)
  dialog1.addEventListener('cancel', spy7, false)
  dialog2.addEventListener('cancel', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

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
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy2).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy4).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy5).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy6).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy7).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy8).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
  }
})

test('dialog - escape - #5', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <dialog data-testid='dialog2' tabIndex={-1}>
          <button data-testid='close2'>Close2</button>
        </dialog>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('close', spy1, true)
  dialog2.addEventListener('close', spy2, true)
  dialog1.addEventListener('cancel', spy3, true)
  dialog2.addEventListener('cancel', spy4, true)
  dialog1.addEventListener('close', spy5, false)
  dialog2.addEventListener('close', spy6, false)
  dialog1.addEventListener('cancel', spy7, false)
  dialog2.addEventListener('cancel', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    spy3.mockImplementation((ev) => ev.preventDefault())

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    expect(spy1).toHaveBeenCalledTimes(0)
    expect(spy2).toHaveBeenCalledTimes(0)
    expect(spy3).toHaveBeenCalledTimes(1)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(0)
    expect(spy6).toHaveBeenCalledTimes(0)
    expect(spy7).toHaveBeenCalledTimes(0)
    expect(spy8).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(3)
    expect(spy4).toHaveBeenCalledTimes(2)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(2)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy2).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy5).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy6).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy7).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
  }
})

test('dialog - escape - #6', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <dialog data-testid='dialog2' tabIndex={-1}>
          <button data-testid='close2'>Close2</button>
        </dialog>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('close', spy1, true)
  dialog2.addEventListener('close', spy2, true)
  dialog1.addEventListener('cancel', spy3, true)
  dialog2.addEventListener('cancel', spy4, true)
  dialog1.addEventListener('close', spy5, false)
  dialog2.addEventListener('close', spy6, false)
  dialog1.addEventListener('cancel', spy7, false)
  dialog2.addEventListener('cancel', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    spy7.mockImplementation((ev) => ev.preventDefault())

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(1)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(2)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(0)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(1)
    expect(spy8).toHaveBeenCalledTimes(1)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

    expect(spy1).toHaveBeenCalledTimes(2)
    expect(spy2).toHaveBeenCalledTimes(1)
    expect(spy3).toHaveBeenCalledTimes(3)
    expect(spy4).toHaveBeenCalledTimes(1)
    expect(spy5).toHaveBeenCalledTimes(1)
    expect(spy6).toHaveBeenCalledTimes(1)
    expect(spy7).toHaveBeenCalledTimes(2)
    expect(spy8).toHaveBeenCalledTimes(1)

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy2).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy4).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
    expect(spy5).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy6).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: false, target: dialog2 })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ cancelable: true, target: dialog1 })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ cancelable: false, target: dialog1 })
    )
    expect(spy8).toHaveBeenCalledWith(
      expect.objectContaining({ cancelable: true, target: dialog2 })
    )
  }
})

test('dialog - toggle event - #1', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
      </dialog>
      <dialog data-testid='dialog2' tabIndex={-1}>
        <button data-testid='close2'>Close2</button>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('toggle', spy1, true)
  dialog2.addEventListener('toggle', spy2, true)
  dialog1.addEventListener('beforetoggle', spy3, true)
  dialog2.addEventListener('beforetoggle', spy4, true)
  dialog1.addEventListener('toggle', spy5, false)
  dialog2.addEventListener('toggle', spy6, false)
  dialog1.addEventListener('beforetoggle', spy7, false)
  dialog2.addEventListener('beforetoggle', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

    await vi.waitFor(() => {
      expect(spy1).toHaveBeenCalledTimes(2)
      expect(spy2).toHaveBeenCalledTimes(2)
      expect(spy3).toHaveBeenCalledTimes(2)
      expect(spy4).toHaveBeenCalledTimes(2)
      expect(spy5).toHaveBeenCalledTimes(2)
      expect(spy6).toHaveBeenCalledTimes(2)
      expect(spy7).toHaveBeenCalledTimes(2)
      expect(spy8).toHaveBeenCalledTimes(2)
    })

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'toggle',
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: true,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'beforetoggle',
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
  }
})

test('dialog - toggle event - #2', { timeout: 60_000 }, async () => {
  document.body.innerHTML = renderToString(
    <>
      <dialog data-testid='dialog1' tabIndex={-1}>
        <button data-testid='close1'>Close1</button>
        <dialog data-testid='dialog2' tabIndex={-1}>
          <button data-testid='close2'>Close2</button>
        </dialog>
      </dialog>
    </>
  )

  const dialog1 = page.getByTestId('dialog1').element() as HTMLDialogElement
  const dialog2 = page.getByTestId('dialog2').element() as HTMLDialogElement
  const close1 = page.getByTestId('close1').element() as HTMLButtonElement
  const close2 = page.getByTestId('close2').element() as HTMLButtonElement
  const spy1 = vi.fn((ev) => ev.preventDefault())
  const spy2 = vi.fn((ev) => ev.preventDefault())
  const spy3 = vi.fn()
  const spy4 = vi.fn()
  const spy5 = vi.fn((ev) => ev.preventDefault())
  const spy6 = vi.fn((ev) => ev.preventDefault())
  const spy7 = vi.fn()
  const spy8 = vi.fn()
  dialog1.addEventListener('toggle', spy1, true)
  dialog2.addEventListener('toggle', spy2, true)
  dialog1.addEventListener('beforetoggle', spy3, true)
  dialog2.addEventListener('beforetoggle', spy4, true)
  dialog1.addEventListener('toggle', spy5, false)
  dialog2.addEventListener('toggle', spy6, false)
  dialog1.addEventListener('beforetoggle', spy7, false)
  dialog2.addEventListener('beforetoggle', spy8, false)

  {
    dialog1.showModal()
    expect(document.activeElement).toBe(close1)

    dialog2.showModal()
    expect(document.activeElement).toBe(close2)

    expect(dialog1).toHaveProperty('open', true)
    expect(dialog2).toHaveProperty('open', true)

    await userEvent.keyboard('{Escape}')

    expect(dialog1).toHaveProperty('open', false)
    expect(dialog2).toHaveProperty('open', false)

    await vi.waitFor(() => {
      expect(spy1).toHaveBeenCalledTimes(4)
      expect(spy2).toHaveBeenCalledTimes(2)
      expect(spy3).toHaveBeenCalledTimes(4)
      expect(spy4).toHaveBeenCalledTimes(2)
      expect(spy5).toHaveBeenCalledTimes(2)
      expect(spy6).toHaveBeenCalledTimes(2)
      expect(spy7).toHaveBeenCalledTimes(2)
      expect(spy8).toHaveBeenCalledTimes(2)
    })

    expect(spy1).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy1).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy2).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy3).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy4).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy5).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: false,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy6).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: dialog1,
      })
    )
    expect(spy7).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog1,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        cancelable: true,
        newState: 'open',
        target: dialog2,
      })
    )
    expect(spy8).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        cancelable: false,
        newState: 'closed',
        target: dialog2,
      })
    )
  }
})

test('dialog - light dismiss - click outside (stay open)', async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <dialog data-testid='dialog'>
        <button data-testid='close'>Close</button>
      </dialog>
    </>
  )

  const dialog = page.getByTestId('dialog').element() as HTMLDialogElement
  const close = page.getByTestId('close').element() as HTMLButtonElement

  const spy = vi.fn()
  document.addEventListener('click', spy)

  dialog.showModal()
  expect(dialog.open).toBe(true)
  expect(document.activeElement).toBe(close)

  await userEvent.click(document.body, { position: { x: 0, y: 0 } })

  expect(dialog.open).toBe(true)
  expect(document.activeElement).toBe(dialog)

  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: dialog })
  )
}, 30_000)

test('dialog - light dismiss - escape', async () => {
  document.body.innerHTML = renderToString(
    <>
      <button data-testid='anchor'>Trigger</button>
      <dialog data-testid='dialog'>
        <button data-testid='close'>Close</button>
      </dialog>
    </>
  )

  const dialog = page.getByTestId('dialog').element() as HTMLDialogElement
  const close = page.getByTestId('close').element() as HTMLButtonElement

  const spy = vi
    .fn()
    .mockReturnValueOnce(undefined)
    .mockImplementationOnce((ev) => ev.preventDefault())
  document.addEventListener('keydown', spy)

  dialog.showModal()
  expect(dialog.open).toBe(true)
  expect(document.activeElement).toBe(close)

  await userEvent.click(document.body, { position: { x: 0, y: 0 } })
  await userEvent.keyboard('{Escape}')
  await vi.waitFor(() => expect(document.body).toHaveFocus())

  expect(dialog.open).toBe(false)
  expect(document.activeElement).toBe(document.body)

  dialog.showModal()
  expect(dialog.open).toBe(true)
  expect(document.activeElement).toBe(close)

  await userEvent.click(document.body, { position: { x: 0, y: 0 } })
  await userEvent.keyboard('{Escape}')

  expect(dialog.open).toBe(true)
  expect(document.activeElement).toBe(dialog)

  document.removeEventListener('keydown', spy)
  expect(spy).toHaveBeenCalledTimes(2)
  expect(spy).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      target: dialog,
      key: 'Escape',
      defaultPrevented: false,
    })
  )
  expect(spy).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      target: dialog,
      key: 'Escape',
      defaultPrevented: true,
    })
  )
}, 60_000)

function Page({ type = 'render' }: { type?: 'render' | 'effect' }) {
  const ref = useRef<HTMLDialogElement>(null)

  const [open, setOpen] = useState(false)

  const handleClick = useCallback(() => setOpen((open) => !open), [])

  const handleClose = useCallback(() => setOpen(false), [])

  useLayoutEffect(() => {
    if (!open) return

    const { current } = ref
    current?.showModal()

    return () => {
      if (type === 'effect') {
        current?.close()
      }
    }
  })

  if (!open && type === 'render') {
    // Reading the ref during render is deliberate: this branch closes the
    // dialog imperatively while it is still mounted, exercising the case
    // where 'useReturnFocus' cleans up after a render-phase close.
    // eslint-disable-next-line react-hooks/refs
    ref.current?.close()
  }

  useReturnFocus(
    useOverlay({ anchorRef: useRef(null), positionedRef: ref, open })
  )

  return (
    <>
      <button data-testid='trigger1' onClick={handleClick}>
        Trigger1
      </button>
      <button data-testid='trigger2' onClick={handleClick}>
        Trigger2
      </button>
      {open && (
        <dialog data-testid='dialog' tabIndex={-1} ref={ref}>
          <button data-testid='close' onClick={handleClose}>
            Close
          </button>
        </dialog>
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

    const spy = vi.spyOn(trigger2, 'focus')

    rerender(<Page />)

    const close = getByTestId('close')

    expect(document.activeElement).toBe(close)

    await act(() => {
      close.click()
    })

    expect(document.activeElement).toBe(trigger2)

    expect(spy).toHaveBeenCalledTimes(0)
  }

  rerender(<Page />)

  {
    await act(() => {
      trigger1.focus()
      trigger1.click()
    })

    const spy = vi.spyOn(trigger1, 'focus')

    rerender(<Page />)

    const close = getByTestId('close')

    expect(document.activeElement).toBe(close)

    await act(() => {
      close.click()
    })

    expect(document.activeElement).toBe(trigger1)

    expect(spy).toHaveBeenCalledTimes(0)
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

    const spy = vi.spyOn(trigger2, 'focus')

    rerender(<Page type='effect' />)

    const close = getByTestId('close')

    expect(document.activeElement).toBe(close)

    await act(() => {
      close.click()
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

    const spy = vi.spyOn(trigger1, 'focus')

    rerender(<Page type='effect' />)

    const close = getByTestId('close')

    expect(document.activeElement).toBe(close)

    await act(() => {
      close.click()
    })

    expect(document.activeElement).toBe(trigger1)
    expect(spy).toHaveBeenCalledTimes(1)
    expect(spy).toHaveBeenLastCalledWith({ preventScroll: true })
  }
})
