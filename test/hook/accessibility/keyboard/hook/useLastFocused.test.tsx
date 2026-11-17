import { useLastFocused } from '#hook/accessibility/keyboard/hook'
import { Tree } from '#hook/accessibility/keyboard/tree'
import { generateUniqueId } from '#util'
import { renderHook, screen } from '@testing-library/react'
import { beforeEach, expect, test } from 'vitest'

function createTree(items: HTMLElement[]) {
  return Tree(
    new Map(items.map((item) => [item, { key: item.dataset.testid }]))
  )
}

let inputEl: HTMLInputElement
let buttonEl: HTMLButtonElement
let anchorEl: HTMLAnchorElement
let gridEl: HTMLDivElement
let gridRowEl: HTMLDivElement
let gridCellEl: HTMLDivElement

beforeEach(() => {
  document.body.innerHTML = `
    <input type="text" data-testid="input" />
    <button data-testid="button">Button</button>
    <a href="#" data-testid="anchor">Link</a>
    <div data-testid="grid">
      <div data-testid="grid-row">
        <div data-testid="grid-cell" tabIndex="0">Cell</div>
      </div>
    </div>
  `

  inputEl = screen.getByTestId('input')
  buttonEl = screen.getByTestId('button')
  anchorEl = screen.getByTestId('anchor')
  gridEl = screen.getByTestId('grid')
  gridRowEl = screen.getByTestId('grid-row')
  gridCellEl = screen.getByTestId('grid-cell')
})

test('useLastFocused - active element is still in the tree', () => {
  const buttonEl = document.createElement('button')
  let tree = createTree([inputEl, buttonEl, anchorEl])
  let active: Element | null = buttonEl

  const { result, rerender } = renderHook(() =>
    useLastFocused('linear', tree, active)
  )

  expect(result.current).toBe(buttonEl)

  {
    active = null

    rerender()

    expect(result.current).toBe(buttonEl)
  }

  {
    tree = createTree([inputEl, anchorEl])

    rerender()

    expect(result.current).toBe(inputEl)
  }

  {
    tree = createTree([inputEl, buttonEl, anchorEl])

    rerender()

    expect(result.current).toBe(buttonEl)
  }
})

test('useLastFocused - find the element by value', () => {
  let tree = createTree([inputEl, buttonEl, anchorEl])
  const node = tree.map.get(buttonEl)
  if (node) node.context._id = generateUniqueId()

  const { result, rerender } = renderHook(() =>
    useLastFocused('linear', tree, buttonEl)
  )

  expect(result.current).toBe(buttonEl)

  const newButtonEl = document.createElement('button')
  tree = createTree([inputEl, newButtonEl, anchorEl])
  const newNode = tree.map.get(newButtonEl)
  if (node && newNode) newNode.context._id = node.context._id

  rerender()

  expect(result.current).not.toBe(buttonEl)
  expect(result.current).toBe(newButtonEl)
})

test('useLastFocused - find the element by id', () => {
  let tree = createTree([inputEl, buttonEl, anchorEl])
  buttonEl.id = generateUniqueId()

  const { result, rerender } = renderHook(() =>
    useLastFocused('linear', tree, buttonEl)
  )

  expect(result.current).toBe(buttonEl)

  const newButtonEl = document.createElement('button')
  tree = createTree([inputEl, newButtonEl, anchorEl])
  newButtonEl.id = buttonEl.id

  rerender()

  expect(result.current).not.toBe(buttonEl)
  expect(result.current).toBe(newButtonEl)
})

test('useLastFocused - find the element by key', () => {
  let tree = createTree([inputEl, buttonEl, anchorEl])

  const { result, rerender } = renderHook(() =>
    useLastFocused('linear', tree, buttonEl)
  )

  expect(result.current).toBe(buttonEl)

  const newButtonEl = document.createElement('button')
  newButtonEl.dataset.testid = buttonEl.dataset.testid
  tree = createTree([inputEl, newButtonEl, anchorEl])

  rerender()

  expect(result.current).not.toBe(buttonEl)
  expect(result.current).toBe(newButtonEl)
})

test('useLastFocused - ARIA selected', () => {
  const tree = createTree([inputEl, buttonEl, anchorEl])
  buttonEl.ariaSelected = 'true'

  const { result } = renderHook(() => useLastFocused('linear', tree, null))

  expect(result.current).toBe(buttonEl)
})

test('useLastFocused - ARIA checked', () => {
  const tree = createTree([inputEl, buttonEl, anchorEl])
  buttonEl.ariaChecked = 'true'

  const { result } = renderHook(() => useLastFocused('linear', tree, null))

  expect(result.current).toBe(buttonEl)
})

test('useLastFocused - tree is empty', () => {
  const tree = createTree([])

  const { result } = renderHook(() => useLastFocused('linear', tree, null))

  expect(result.current).toBe(null)
})

test('useLastFocused - active element is null', () => {
  const tree = createTree([gridCellEl, gridRowEl, gridEl])

  {
    const { result } = renderHook(() => useLastFocused('linear', tree, null))

    expect(result.current).toBe(gridEl)
  }

  {
    const { result } = renderHook(() => useLastFocused('grid', tree, null))

    expect(result.current).toBe(gridCellEl)
  }
})

test('useLastFocused - remember the last focused element', () => {
  let tree = createTree([inputEl, buttonEl, anchorEl])
  let active: Element | null = buttonEl

  const { result, rerender } = renderHook(() =>
    useLastFocused('linear', tree, active)
  )

  expect(result.current).toBe(buttonEl)

  {
    active = null

    rerender()

    expect(result.current).toBe(buttonEl)
  }

  {
    tree = createTree([])

    rerender()

    expect(result.current).toBe(null)
  }

  {
    tree = createTree([inputEl, anchorEl])

    rerender()

    expect(result.current).toBe(inputEl)
  }

  {
    tree = createTree([inputEl, buttonEl, anchorEl])

    rerender()

    expect(result.current).toBe(buttonEl)
  }
})
