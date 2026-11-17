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

let tableRow: HTMLElement[]
let tableCell: HTMLElement[][]

beforeEach(() => {
  vi.restoreAllMocks()

  function Page() {
    return (
      <>
        <table data-testid='table'>
          <tbody>
            {range(0, 30).map((row) => (
              <tr key={row} data-testid={`table-row-${row}`} data-row={row}>
                {range(0, 20).map((col) => (
                  <td key={col} data-testid={`table-cell-${row}-${col}`}>
                    Table Cell {row}-{col}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
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

  tableRow = getAllByTestId(/^table-row-\d+$/)
  tableCell = tableRow.map((el) =>
    getAllByTestId(new RegExp(`^table-cell-${el.dataset.row}-\\d+$`))
  )
})

test('resolve - grid - cell', { timeout: 60_000 }, () => {
  const type = 'grid'
  const direction = 'both'
  const tree = createTree([...tableRow, ...tableCell.flat()])
  const first = tableCell[0]?.[9]
  const center = tableCell[13]?.[9]
  const last = tableCell[29]?.[9]

  for (const [curr, key, altKey, expected] of [
    [first, 'Home', false, first],
    [center, 'Home', false, first],
    [last, 'Home', false, first],
    [first, 'End', false, last],
    [center, 'End', false, last],
    [last, 'End', false, last],
    [first, 'PageUp', false, tableCell[0]?.[9]],
    [center, 'PageUp', false, tableCell[3]?.[9]],
    [last, 'PageUp', false, tableCell[19]?.[9]],
    [first, 'PageDown', false, tableCell[10]?.[9]],
    [center, 'PageDown', false, tableCell[23]?.[9]],
    [last, 'PageDown', false, tableCell[29]?.[9]],
    [tableCell[13]?.[0], 'ArrowLeft', false, null],
    [tableCell[13]?.[9], 'ArrowLeft', false, tableCell[13]?.[8]],
    [tableCell[13]?.[19], 'ArrowLeft', false, tableCell[13]?.[18]],
    [tableCell[13]?.[0], 'ArrowRight', false, tableCell[13]?.[1]],
    [tableCell[13]?.[9], 'ArrowRight', false, tableCell[13]?.[10]],
    [tableCell[13]?.[19], 'ArrowRight', false, null],
    [first, 'ArrowUp', false, tableCell[29]?.[9]],
    [center, 'ArrowUp', false, tableCell[12]?.[9]],
    [last, 'ArrowUp', false, tableCell[28]?.[9]],
    [first, 'ArrowDown', false, tableCell[1]?.[9]],
    [center, 'ArrowDown', false, tableCell[14]?.[9]],
    [last, 'ArrowDown', false, tableCell[0]?.[9]],
    [tableCell[13]?.[0], 'ArrowLeft', true, null],
    [tableCell[13]?.[9], 'ArrowLeft', true, tableCell[13]?.[8]],
    [tableCell[13]?.[19], 'ArrowLeft', true, tableCell[13]?.[18]],
    [tableCell[13]?.[0], 'ArrowRight', true, tableCell[13]?.[1]],
    [tableCell[13]?.[9], 'ArrowRight', true, tableCell[13]?.[10]],
    [tableCell[13]?.[19], 'ArrowRight', true, null],
    [first, 'ArrowUp', true, tableCell[0]?.[9]],
    [center, 'ArrowUp', true, tableCell[3]?.[9]],
    [last, 'ArrowUp', true, tableCell[19]?.[9]],
    [first, 'ArrowDown', true, tableCell[10]?.[9]],
    [center, 'ArrowDown', true, tableCell[23]?.[9]],
    [last, 'ArrowDown', true, tableCell[29]?.[9]],
    [first, 'A', false, null],
    [center, 'A', false, null],
    [last, 'A', false, null],
    [first, 'T', false, null],
    [center, 'T', false, null],
    [last, 'T', false, null],
    [first, 'Z', false, null],
    [center, 'Z', false, null],
    [last, 'Z', false, null],
  ] as const) {
    const ev = createEvent({ key, altKey })
    const target = parse(direction, curr, ev)

    expect(resolve(type, direction, tree, curr, target)).toEqual(
      expected && expect.objectContaining({ value: expected })
    )
  }
})
