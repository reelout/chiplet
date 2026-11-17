import { parse, resolve } from '#hook/accessibility/keyboard/resolve'
import { Tree } from '#hook/accessibility/keyboard/tree'
import { createKeyboardEvent as createEvent } from '#test'
import { render } from '@testing-library/react'
import { range } from 'lodash-es'
import { beforeEach, expect, test, vi } from 'vitest'

function createTree(items: HTMLElement[]) {
  return Tree(
    new Map(items.map((item) => [item, { key: item.dataset.testid }]))
  )
}

let options: HTMLElement[]

beforeEach(() => {
  vi.restoreAllMocks()

  function Page() {
    return (
      <>
        <div>
          <button
            data-testid='combobox'
            role='combobox'
            aria-controls='listbox'
            aria-expanded='true'
            aria-haspopup={true}
          >
            Combobox
          </button>
          <ul role='listbox' id='listbox' data-testid='listbox'>
            {range(0, 30).map((idx) => (
              <li
                key={idx}
                role='option'
                value={
                  idx < 15
                    ? String.fromCharCode(65 + 23 + Math.floor(idx % 3)) + idx
                    : undefined
                }
                aria-selected={false}
                data-testid={`option-${idx}`}
                data-index={
                  idx >= 10 && idx < 20
                    ? String.fromCharCode(65 + Math.floor((idx - 10) / 3))
                    : undefined
                }
                id={`option-${idx}`}
              >
                Option {idx}
              </li>
            ))}
          </ul>
        </div>
      </>
    )
  }

  const { getAllByTestId } = render(<Page />)

  for (const el of getAllByTestId(/.+/)) {
    Object.defineProperty(el, 'toJSON', {
      configurable: true,
      writable: true,
      value: () => el.dataset.testid,
    })
  }

  options = getAllByTestId(/^option-\d+$/)
})

test('resolve - empty tree', () => {
  const tree = createTree([])
  const curr = null
  const ev = createEvent({ key: 'ArrowDown' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', null],
    ['linear', 'block', null],
    ['linear', 'both', null],
    ['grid', 'inline', null],
    ['grid', 'block', null],
    ['grid', 'both', null],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }
})

test('resolve - current is null or undefined', () => {
  const tree = createTree(options)
  const curr = options[-1]
  const ev = createEvent({ key: 'ArrowDown' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', null],
    ['linear', 'block', options[0]],
    ['linear', 'both', options[0]],
    ['grid', 'inline', null],
    ['grid', 'block', null],
    ['grid', 'both', null],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }
})

test('resolve - current is not in the tree', () => {
  const tree = createTree(options)
  const curr = document.body
  const ev = createEvent({ key: 'ArrowDown' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', null],
    ['linear', 'block', options[0]],
    ['linear', 'both', options[0]],
    ['grid', 'inline', null],
    ['grid', 'block', null],
    ['grid', 'both', null],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }
})

test('resolve - target is not recognized', () => {
  const tree = createTree(options)
  const curr = options[0]
  const ev = createEvent({ key: 'Unidentified' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', null],
    ['linear', 'block', null],
    ['linear', 'both', null],
    ['grid', 'inline', null],
    ['grid', 'block', null],
    ['grid', 'both', null],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }
})

test('resolve - event target is not active', () => {
  const tree = createTree(options)
  const first = options[0]
  const second = options[1]
  const third = options[2]
  const missing = document.createElement('button')
  const none = null

  for (const [curr, target, expected] of [
    [null, null, [none, first, first, none, none, none]],
    [null, missing, [none, first, first, none, none, none]],
    [null, second, [none, first, first, none, none, none]],
    [document.body, null, [none, first, first, none, none, none]],
    [document.body, missing, [none, first, first, none, none, none]],
    [document.body, second, [none, first, first, none, none, none]],
    [first, null, [none, second, second, none, second, second]],
    [first, missing, [none, second, second, none, second, second]],
    [first, third, [none, second, second, none, second, second]],
  ] as const) {
    const ev = createEvent({ target, key: 'ArrowDown' })

    for (const [type, direction, value] of [
      ['linear', 'inline', expected[0]],
      ['linear', 'block', expected[1]],
      ['linear', 'both', expected[2]],
      ['grid', 'inline', expected[3]],
      ['grid', 'block', expected[4]],
      ['grid', 'both', expected[5]],
    ] as const) {
      const target = parse(direction, curr, ev)

      expect(resolve(type, direction, tree, curr, target)).toEqual(
        value && tree.map.get(value)
      )
    }
  }
})

test('resolve - quick navigation', () => {
  const tree = createTree(options)
  const curr = options[0]
  let ev = createEvent({ key: 'A' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', options[10]],
    ['linear', 'block', options[10]],
    ['linear', 'both', options[10]],
    ['grid', 'inline', options[10]],
    ['grid', 'block', options[10]],
    ['grid', 'both', options[10]],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }

  ev = createEvent({ key: 'C' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', options[16]],
    ['linear', 'block', options[16]],
    ['linear', 'both', options[16]],
    ['grid', 'inline', options[16]],
    ['grid', 'block', options[16]],
    ['grid', 'both', options[16]],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }

  ev = createEvent({ key: 'X' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', options[3]],
    ['linear', 'block', options[3]],
    ['linear', 'both', options[3]],
    ['grid', 'inline', options[3]],
    ['grid', 'block', options[3]],
    ['grid', 'both', options[3]],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }

  ev = createEvent({ key: 'Z' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', options[2]],
    ['linear', 'block', options[2]],
    ['linear', 'both', options[2]],
    ['grid', 'inline', options[2]],
    ['grid', 'block', options[2]],
    ['grid', 'both', options[2]],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }

  ev = createEvent({ key: 'O' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', options[20]],
    ['linear', 'block', options[20]],
    ['linear', 'both', options[20]],
    ['grid', 'inline', options[20]],
    ['grid', 'block', options[20]],
    ['grid', 'both', options[20]],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }

  ev = createEvent({ key: 'P' })

  for (const [type, direction, expected] of [
    ['linear', 'inline', null],
    ['linear', 'block', null],
    ['linear', 'both', null],
    ['grid', 'inline', null],
    ['grid', 'block', null],
    ['grid', 'both', null],
  ] as const) {
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && tree.map.get(expected)
    )
  }
})
