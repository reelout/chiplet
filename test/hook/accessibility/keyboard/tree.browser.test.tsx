import { Tree } from '#hook/accessibility/keyboard/tree'
import { beforeEach, expect, test } from 'vitest'
import { page } from 'vitest/browser'

function createTree(items: HTMLElement[]) {
  return Tree(
    new Map(items.map((item) => [item, { key: item.dataset.testid }]))
  )
}

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

test('Tree - empty', () => {
  const tree = createTree([])

  expect(tree.root).toBeNull()
  expect(tree.map.size).toBe(0)
})

test('Tree - single', () => {
  const tree = createTree([comboboxEl, comboboxEl])

  expect(tree.root).toEqual({
    context: { key: 'combobox' },
    value: comboboxEl,
    parent: null,
    previousSibling: null,
    nextSibling: null,
    firstChild: null,
    lastChild: null,
  })

  expect(tree.map.size).toBe(1)
  expect(tree.map.get(comboboxEl)).toBe(tree.root)
})

test('Tree - tree', () => {
  let tree = createTree([item3, item1])

  expect(JSON.parse(JSON.stringify(Array.from(tree.map)))).toEqual([
    ['item-1', expect.objectContaining({ value: 'item-1' })],
    ['item-3', expect.objectContaining({ value: 'item-3' })],
  ])

  expect(JSON.parse(JSON.stringify(tree.root))).toEqual({
    value: 'item-1',
    nextSibling: {
      value: 'item-3',
      nextSibling: null,
      firstChild: null,
    },
    firstChild: null,
  })

  expect(tree.map.get(item1)).toMatchObject({
    context: { key: 'item-1' },
    value: item1,
  })
  expect(tree.map.get(item3)).toMatchObject({
    context: { key: 'item-3' },
    value: item3,
  })

  {
    tree = createTree([
      ...tree.map.keys(),
      listboxEl,
      comboboxEl,
    ] as HTMLElement[])

    expect(JSON.parse(JSON.stringify(Array.from(tree.map)))).toEqual([
      ['combobox', expect.objectContaining({ value: 'combobox' })],
      ['listbox', expect.objectContaining({ value: 'listbox' })],
      ['item-1', expect.objectContaining({ value: 'item-1' })],
      ['item-3', expect.objectContaining({ value: 'item-3' })],
    ])

    expect(JSON.parse(JSON.stringify(tree.root))).toEqual({
      value: 'combobox',
      nextSibling: null,
      firstChild: {
        value: 'listbox',
        nextSibling: null,
        firstChild: {
          value: 'item-1',
          nextSibling: {
            value: 'item-3',
            nextSibling: null,
            firstChild: null,
          },
          firstChild: null,
        },
      },
    })
  }

  {
    tree = createTree([...tree.map.keys(), item2] as HTMLElement[])

    expect(JSON.parse(JSON.stringify(Array.from(tree.map)))).toEqual([
      ['combobox', expect.objectContaining({ value: 'combobox' })],
      ['listbox', expect.objectContaining({ value: 'listbox' })],
      ['item-1', expect.objectContaining({ value: 'item-1' })],
      ['item-2', expect.objectContaining({ value: 'item-2' })],
      ['item-3', expect.objectContaining({ value: 'item-3' })],
    ])

    expect(JSON.parse(JSON.stringify(tree.root))).toEqual({
      value: 'combobox',
      nextSibling: null,
      firstChild: {
        value: 'listbox',
        nextSibling: null,
        firstChild: {
          value: 'item-1',
          nextSibling: {
            value: 'item-2',
            nextSibling: {
              value: 'item-3',
              nextSibling: null,
              firstChild: null,
            },
            firstChild: null,
          },
          firstChild: null,
        },
      },
    })
  }
})
