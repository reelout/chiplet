import { sort } from '#hook/accessibility/keyboard/sort'
import { TreeNode } from '#util'
import { beforeEach, expect, test } from 'vitest'
import { page } from 'vitest/browser'

let comboboxEl: HTMLButtonElement
let listboxEl: HTMLUListElement
let item1: HTMLLIElement
let item2: HTMLLIElement
let item3: HTMLLIElement

beforeEach(() => {
  document.body.innerHTML = `
    <div>
      <button data-testid="combobox" aria-controls="listbox" aria-expanded="true">
        Combobox
      </button>
    </div>
    <div data-testid="portal">
      <ul id="listbox" data-testid="listbox">
        <li data-testid="item-1" id="item-1">Item 1</li>
        <li data-testid="item-2" id="item-2">Item 2</li>
        <li data-testid="item-3" id="item-3">Item 3</li>
      </ul>
    </div>
  `

  comboboxEl = page.getByTestId('combobox').element() as HTMLButtonElement
  listboxEl = page.getByTestId('listbox').element() as HTMLUListElement
  item1 = page.getByTestId('item-1').element() as HTMLLIElement
  item2 = page.getByTestId('item-2').element() as HTMLLIElement
  item3 = page.getByTestId('item-3').element() as HTMLLIElement

  for (const el of [comboboxEl, listboxEl, item1, item2, item3]) {
    Object.defineProperty(el, 'toJSON', {
      configurable: true,
      writable: true,
      value: () => el.dataset.testid,
    })
  }
})

test('sort - empty', () => {
  expect(sort([])).toEqual([])
})

test('sort - single', () => {
  expect(sort([TreeNode(comboboxEl)])).toEqual([
    expect.objectContaining({ value: comboboxEl }),
  ])
})

test('sort - tree', () => {
  expect(sort([item3, item1].map(TreeNode))).toEqual([
    expect.objectContaining({ value: item1 }),
    expect.objectContaining({ value: item3 }),
  ])

  expect(sort([item3, item1, listboxEl, comboboxEl].map(TreeNode))).toEqual([
    expect.objectContaining({ value: comboboxEl }),
    expect.objectContaining({ value: listboxEl }),
    expect.objectContaining({ value: item1 }),
    expect.objectContaining({ value: item3 }),
  ])

  expect(
    sort([item3, item1, listboxEl, comboboxEl, item2].map(TreeNode))
  ).toEqual([
    expect.objectContaining({ value: comboboxEl }),
    expect.objectContaining({ value: listboxEl }),
    expect.objectContaining({ value: item1 }),
    expect.objectContaining({ value: item2 }),
    expect.objectContaining({ value: item3 }),
  ])
})
