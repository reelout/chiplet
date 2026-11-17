import {
  isArrowDownKey,
  isArrowLeftKey,
  isArrowRightKey,
  isArrowUpKey,
  isEndKey,
  isHomeKey,
  isPageDownKey,
  isPageUpKey,
} from '#util'
import type { Pool } from './hook/usePool'
import { Tree } from './tree'
import type { NavigationDirection, NavigationType } from './Keyboard'

const PAGE_SIZE = 10

export type Resolve = typeof resolve

export function resolve(
  type: NavigationType,
  direction: NavigationDirection,
  tree: Tree,
  current: Element | null | undefined,
  target: Target | null | undefined
): Tree.Node | null | undefined {
  if (!target) {
    return null
  }

  switch (type) {
    case 'linear':
      return resolveLinear(tree, current, target) ?? null

    case 'grid':
      return resolveGrid(tree, current, target) ?? null
  }
}

function resolveLinear(
  tree: Tree,
  current: Element | null | undefined,
  target: Target
): Tree.Node | null | undefined {
  if (!tree.root) {
    return null
  }

  const array = Array.from(tree.map.values())
  const index = current ? array.findIndex((node) => node.value === current) : -1
  let _target = normalize(target)

  if (index === -1) {
    switch (_target.key) {
      case 'ArrowLeft':
      case 'ArrowUp':
        _target = { key: 'End' }
        break
      case 'ArrowRight':
      case 'ArrowDown':
        _target = { key: 'Home' }
        break
      default:
        return null
    }
  }

  if (_target.key === 'Home') {
    return array[0]
  }

  if (_target.key === 'End') {
    return array[array.length - 1]
  }

  if (
    _target.key === 'PageUp' ||
    (_target.key === 'ArrowUp' && _target.altKey) ||
    (_target.key === 'ArrowLeft' && _target.altKey)
  ) {
    return array[Math.max(0, index - PAGE_SIZE)]
  }

  if (
    _target.key === 'PageDown' ||
    (_target.key === 'ArrowDown' && _target.altKey) ||
    (_target.key === 'ArrowRight' && _target.altKey)
  ) {
    return array[Math.min(array.length - 1, index + PAGE_SIZE)]
  }

  switch (_target.key) {
    case 'ArrowLeft':
    case 'ArrowUp':
      return array[(index - 1 + array.length) % array.length]

    case 'ArrowRight':
    case 'ArrowDown':
      return array[(index + 1) % array.length]

    case 'Find': {
      const start = (index + 1) % array.length
      const char = _target.detail.toUpperCase()

      return [...array.slice(start), ...array.slice(0, start)].find((node) => {
        const index = node.value.getAttribute('data-index')

        if (index) return char === index.toUpperCase()

        const value = node.value.getAttribute('value')

        if (value) return char === value.charAt(0).toUpperCase()

        return char === node.value.textContent.charAt(0).toUpperCase()
      })
    }
  }
}

function resolveGrid(
  tree: Tree,
  current: Element | null | undefined,
  target: Target
): Tree.Node | null | undefined {
  if (!tree.root) {
    return null
  }

  if (!current) {
    return null
  }

  const node = tree.map.get(current)

  if (!node) {
    return null
  }

  if (!node.parent) {
    return resolveLinear(Tree(createPool(node)), current, target)
  }

  let _target = normalize(target)

  switch (_target.altKey && _target.key) {
    case 'ArrowUp':
      _target = { key: 'PageUp' }
      break
    case 'ArrowDown':
      _target = { key: 'PageDown' }
      break
  }

  if (_target.key === 'Find') {
    return null
  }

  if (_target.key === 'ArrowLeft') {
    return node.previousSibling
  }

  if (_target.key === 'ArrowRight') {
    return node.nextSibling
  }

  const grid = createGrid(node.parent)
  const firstRow = grid[0]
  const lastRow = grid[grid.length - 1]
  const previousRow = node.parent.previousSibling ?? lastRow
  const nextRow = node.parent.nextSibling ?? firstRow
  const rowIndex = grid.indexOf(node.parent)
  const columnIndex = findColumnIndex(node)

  switch (_target.key) {
    case 'Home':
      return at(firstRow, columnIndex)

    case 'End':
      return at(lastRow, columnIndex)

    case 'ArrowUp':
      return at(previousRow, columnIndex)

    case 'ArrowDown':
      return at(nextRow, columnIndex)

    case 'PageUp': {
      const row = grid[Math.max(0, rowIndex - PAGE_SIZE)]
      const cell = at(row, columnIndex)

      return cell
    }

    case 'PageDown': {
      const row = grid[Math.min(grid.length - 1, rowIndex + PAGE_SIZE)]
      const cell = at(row, columnIndex)

      return cell
    }
  }
}

function createPool(node: Tree.Node): Pool {
  return new Map(createGrid(node).map((node) => [node.value, node.context]))
}

function createGrid(node: Tree.Node): readonly Tree.Node[] {
  while (node.previousSibling) node = node.previousSibling

  const grid = [node]

  while (node.nextSibling) grid.push((node = node.nextSibling))

  return grid
}

function findColumnIndex(node: Tree.Node): number {
  let index = 0

  while (node.previousSibling) {
    index += 1
    node = node.previousSibling
  }

  return index
}

function at(row: Tree.Node | null | undefined, index: number) {
  let node = row?.firstChild

  while (node && index > 0) {
    node = node.nextSibling
    index -= 1
  }

  return node
}

type Key =
  | 'Home'
  | 'End'
  | 'PageUp'
  | 'PageDown'
  | 'ArrowLeft'
  | 'ArrowRight'
  | 'ArrowUp'
  | 'ArrowDown'

type Modifier = {
  altKey?: boolean
}

type Target = Pretty<
  | { [K in Key]: K }[Key]
  | { [K in Key]: { key: K } & Modifier }[Key]
  | ({ key: 'Find'; detail: string } & Modifier)
>

type Pretty<T> = {
  [K in keyof T]: T[K]
} & {}

function normalize(target: Target): Exclude<Target, string> {
  if (typeof target === 'string') {
    return { key: target }
  }

  return target
}

export type Parse = typeof parse

export function parse(
  direction: NavigationDirection,
  current: Element | null | undefined,
  ev: KeyboardEvent | React.KeyboardEvent
): Target | null | undefined {
  const el = current
  const isRTL = el != null && getComputedStyle(el).direction === 'rtl'

  if (isHomeKey(ev)) {
    return 'Home'
  }

  if (isEndKey(ev)) {
    return 'End'
  }

  if (isPageUpKey(ev)) {
    return 'PageUp'
  }

  if (isPageDownKey(ev)) {
    return 'PageDown'
  }

  if (direction === 'both' && isArrowUpKey(ev)) {
    return ev.altKey ? { key: 'ArrowUp', altKey: ev.altKey } : 'ArrowUp'
  }

  if (direction === 'both' && isArrowDownKey(ev)) {
    return ev.altKey ? { key: 'ArrowDown', altKey: ev.altKey } : 'ArrowDown'
  }

  if (
    (direction === 'inline' && isArrowLeftKey(ev)) ||
    (direction === 'block' && isArrowUpKey(ev)) ||
    (direction === 'both' && isArrowLeftKey(ev))
  ) {
    const key: Key = isRTL ? 'ArrowRight' : 'ArrowLeft'

    return ev.altKey ? { key, altKey: ev.altKey } : key
  }

  if (
    (direction === 'inline' && isArrowRightKey(ev)) ||
    (direction === 'block' && isArrowDownKey(ev)) ||
    (direction === 'both' && isArrowRightKey(ev))
  ) {
    const key: Key = isRTL ? 'ArrowLeft' : 'ArrowRight'

    return ev.altKey ? { key, altKey: ev.altKey } : key
  }

  if (/^[a-zA-Z0-9]$/.test(ev.key) && isQuickNavigationAllowed(ev)) {
    return { key: 'Find', detail: ev.key }
  }

  return null
}

export function preferVirtualFocus(ev: Partial<Event>) {
  const el = ev.target as Element | null
  const role = el?.role as React.AriaRole | undefined

  if (el == null || el !== el.ownerDocument.activeElement) return false

  return role === 'combobox'
}

export function validateFocusVisible(ev: Partial<Event>) {
  const el = ev.target as Element | null

  if (el == null || el !== el.ownerDocument.activeElement) return false

  return el.matches(':focus-visible')
}

export function isQuickNavigationAllowed(ev: Partial<Event>) {
  const el = ev.target as Element | null

  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el.disabled || el.readOnly
  }

  if (el instanceof HTMLElement) {
    return !el.isContentEditable
  }

  return true
}
