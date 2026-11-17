import { parse, resolve } from '#hook/accessibility/keyboard/resolve'
import { Tree } from '#hook/accessibility/keyboard/tree'
import { createKeyboardEvent as createEvent } from '#test'
import { render } from '@testing-library/react'
import { escapeRegExp, range } from 'lodash-es'
import { beforeEach, expect, test, vi } from 'vitest'

function createTree(items: HTMLElement[]) {
  return Tree(
    new Map(items.map((item) => [item, { key: item.dataset.testid }]))
  )
}

let treeLv1: HTMLElement[]
let treeLv2: HTMLElement[][]
let treeLv3: HTMLElement[][][]

beforeEach(() => {
  vi.restoreAllMocks()

  function Page() {
    return (
      <>
        <div>
          <ul data-testid='tree' role='tree'>
            {range(0, 6).map((lv1) => (
              <li
                key={lv1}
                data-testid={`tree-item-${lv1}`}
                role='treeitem'
                aria-expanded={true}
                aria-selected={false}
              >
                <div>{`Tree Item ${lv1}`}</div>
                <ul role='group'>
                  {range(0, 6).map((lv2) => (
                    <li
                      key={`tree-item-${lv1}-${lv2}`}
                      data-testid={`tree-item-${lv1}-${lv2}`}
                      role='treeitem'
                      aria-expanded={true}
                      aria-selected={false}
                    >
                      <div>{`Tree Item ${lv1}-${lv2}`}</div>
                      <ul role='group'>
                        {range(0, 6).map((lv3) => (
                          <li
                            key={`tree-item-${lv1}-${lv2}-${lv3}`}
                            data-testid={`tree-item-${lv1}-${lv2}-${lv3}`}
                            role='treeitem'
                            aria-expanded={undefined}
                            aria-selected={false}
                          >
                            <div>{`Tree Item ${lv1}-${lv2}-${lv3}`}</div>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
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

  treeLv1 = getAllByTestId(/^tree-item-\d+$/)
  treeLv2 = treeLv1.map((el) =>
    getAllByTestId(new RegExp(`^${escapeRegExp(el.dataset.testid)}-\\d$`))
  )
  treeLv3 = treeLv2.map((arr) =>
    arr.map((el) =>
      getAllByTestId(new RegExp(`^${escapeRegExp(el.dataset.testid)}-\\d$`))
    )
  )
})

test('resolve - linear - block', () => {
  const type = 'linear'
  const direction = 'block'
  const tree = createTree([...treeLv1, ...treeLv2.flat(), ...treeLv3.flat(2)])
  const first = treeLv1[0]
  const center = treeLv2[3]?.[3]
  const last = treeLv3[5]?.[5]?.[5]

  for (const [curr, key, expected] of [
    [first, 'Home', first],
    [center, 'Home', first],
    [last, 'Home', first],
    [first, 'End', last],
    [center, 'End', last],
    [last, 'End', last],
    [first, 'PageUp', treeLv1[0]],
    [center, 'PageUp', treeLv3[3]?.[1]?.[3]],
    [last, 'PageUp', treeLv3[5]?.[4]?.[2]],
    [first, 'PageDown', treeLv3[0]?.[1]?.[1]],
    [center, 'PageDown', treeLv3[3]?.[4]?.[2]],
    [last, 'PageDown', treeLv3[5]?.[5]?.[5]],
    [first, 'ArrowLeft', null],
    [center, 'ArrowLeft', null],
    [last, 'ArrowLeft', null],
    [first, 'ArrowRight', null],
    [center, 'ArrowRight', null],
    [last, 'ArrowRight', null],
    [first, 'ArrowUp', treeLv3[5]?.[5]?.[5]],
    [center, 'ArrowUp', treeLv3[3]?.[2]?.[5]],
    [last, 'ArrowUp', treeLv3[5]?.[5]?.[4]],
    [first, 'ArrowDown', treeLv2[0]?.[0]],
    [center, 'ArrowDown', treeLv3[3]?.[3]?.[0]],
    [last, 'ArrowDown', treeLv1[0]],
    [first, 'A', null],
    [center, 'A', null],
    [last, 'A', null],
    [first, 'T', treeLv2[0]?.[0]],
    [center, 'T', treeLv3[3]?.[3]?.[0]],
    [last, 'T', treeLv1[0]],
    [first, 'Z', null],
    [center, 'Z', null],
    [last, 'Z', null],
  ] as const) {
    const ev = createEvent({ key })
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && expect.objectContaining({ value: expected })
    )
  }
})

test('resolve - linear - block - current is null', () => {
  const type = 'linear'
  const direction = 'block'
  const tree = createTree([...treeLv1, ...treeLv2.flat(), ...treeLv3.flat(2)])
  const first = treeLv1[0]
  const last = treeLv3[5]?.[5]?.[5]

  for (const [key, altKey, expected] of [
    ['Enter', false, null],
    ['Home', false, null],
    ['End', false, null],
    ['PageUp', false, null],
    ['PageDown', false, null],
    ['ArrowLeft', false, null],
    ['ArrowRight', false, null],
    ['ArrowUp', false, last],
    ['ArrowDown', false, first],
    ['ArrowLeft', true, null],
    ['ArrowRight', true, null],
    ['ArrowUp', true, last],
    ['ArrowDown', true, first],
  ] as const) {
    const curr = null
    const ev = createEvent({ key, altKey })
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && expect.objectContaining({ value: expected })
    )
  }
})
