import { useMoveFocus } from '#hook/accessibility/keyboard/hook'
import { Tree } from '#hook/accessibility/keyboard/tree'
import { createKeyboardEvent as createEvent } from '#test'
import { renderHook, screen } from '@testing-library/react'
import { act } from 'react'
import { beforeAll, beforeEach, expect, test, vi } from 'vitest'

function createTree(items: (HTMLElement | SVGElement)[]) {
  return Tree(
    new Map(items.map((item) => [item, { key: item.dataset.testid }]))
  )
}

let comboboxEl: HTMLInputElement
let inputEl: HTMLInputElement
let buttonEl: HTMLButtonElement
let anchorEl: HTMLAnchorElement
let svgEl: SVGSVGElement

beforeAll(() => {
  Element.prototype.scrollIntoView ??= vi.fn()
})

beforeEach(() => {
  document.body.innerHTML = `
    <input role="combobox" data-testid="combobox" />
    <input type="text" data-testid="input" />
    <button data-testid="button">Button</button>
    <a href="#" data-testid="anchor">Link</a>
    <svg tabIndex="0" data-testid="svg"></svg>
  `

  comboboxEl = screen.getByTestId('combobox')
  inputEl = screen.getByTestId('input')
  buttonEl = screen.getByTestId('button')
  anchorEl = screen.getByTestId('anchor')
  svgEl = screen.getByTestId('svg') as Element as SVGSVGElement
})

test('useMoveFocus - automatically set active', async () => {
  const tree = createTree([buttonEl, anchorEl, svgEl])

  const { result } = renderHook(() => useMoveFocus(tree))

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() =>
    inputEl.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false })
    )
  )

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() =>
    buttonEl.dispatchEvent(
      new FocusEvent('focusin', { bubbles: true, cancelable: false })
    )
  )

  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
})

test('useMoveFocus - manually set active', async () => {
  const tree = createTree([buttonEl, anchorEl, svgEl])
  let ev: KeyboardEvent | undefined

  const { result } = renderHook(() => useMoveFocus(tree))

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => result.current[2]((ev = createEvent({})), anchorEl))

  expect(ev?.defaultPrevented).toBe(true)
  expect(result.current).toEqual([
    expect.objectContaining({ value: anchorEl }),
    false,
    expect.any(Function),
  ])

  await act(() => result.current[2]((ev = createEvent({})), buttonEl))

  expect(ev?.defaultPrevented).toBe(true)
  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
})

test('useMoveFocus - move focus to SVG element', async () => {
  const tree = createTree([inputEl, buttonEl, svgEl])
  const spy = vi.spyOn(svgEl, 'focus')
  let ev: KeyboardEvent | undefined

  const { result } = renderHook(() => useMoveFocus(tree))

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => result.current[2]((ev = createEvent({})), svgEl))

  expect(ev?.defaultPrevented).toBe(true)
  expect(result.current).toEqual([
    expect.objectContaining({ value: svgEl }),
    false,
    expect.any(Function),
  ])
  expect(spy).toHaveBeenCalledTimes(1)
})

test('useMoveFocus - move focus to HTML element', async () => {
  const tree = createTree([inputEl, buttonEl, anchorEl])
  const spy = vi.spyOn(buttonEl, 'focus')
  let ev: KeyboardEvent | undefined

  const { result } = renderHook(() => useMoveFocus(tree))

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => result.current[2]((ev = createEvent({})), buttonEl))

  expect(ev?.defaultPrevented).toBe(true)
  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
  expect(spy).toHaveBeenCalledTimes(1)
})

test('useMoveFocus - set active without moving focus', async () => {
  const spy = vi.fn()
  const el = { dataset: {}, focus: spy } as Partial<Element> as HTMLElement
  const tree = createTree([el])
  let ev: KeyboardEvent | undefined

  const { result } = renderHook(() => useMoveFocus(tree))

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => result.current[2]((ev = createEvent({})), el))

  expect(ev?.defaultPrevented).toBe(true)
  expect(result.current).toEqual([null, false, expect.any(Function)])
  expect(spy).toHaveBeenCalledTimes(1)
})

test('useMoveFocus - set active and use virtual focus (without moving the actual focus)', async () => {
  const tree = createTree([inputEl, buttonEl, anchorEl])
  const spy = vi.spyOn(inputEl, 'focus')
  let ev: KeyboardEvent | undefined

  const { result } = renderHook(() => useMoveFocus(tree))

  await act(() => comboboxEl.focus())

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() =>
    result.current[2](
      (ev = createEvent({ target: document.activeElement })),
      inputEl
    )
  )

  expect(ev?.defaultPrevented).toBe(true)
  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    true,
    expect.any(Function),
  ])
  expect(spy).toHaveBeenCalledTimes(0)
})

test('useMoveFocus - check whether tree node is focused or not', async () => {
  let tree = createTree([])

  const { result, rerender } = renderHook(() => useMoveFocus(tree))

  expect(result.current[0]).toBe(null)

  {
    tree = createTree([inputEl, buttonEl])

    rerender()

    await act(() => buttonEl.focus())

    expect(result.current[0]).toEqual(
      expect.objectContaining({ value: buttonEl })
    )

    await act(() => anchorEl.focus())

    expect(result.current[0]).toBe(null)
  }

  {
    await act(() => buttonEl.focus())

    expect(result.current[0]).toEqual(
      expect.objectContaining({ value: buttonEl })
    )

    tree = createTree([inputEl])

    rerender()

    expect(result.current[0]).toBe(null)
  }
})
