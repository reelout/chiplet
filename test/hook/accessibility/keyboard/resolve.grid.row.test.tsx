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

test('resolve - grid - row', () => {
  const type = 'grid'
  const direction = 'both'
  const tree = createTree([...tableRow, ...tableCell.flat()])
  const first = tableRow[0]
  const center = tableRow[13]
  const last = tableRow[29]

  for (const [curr, key, altKey, expected] of [
    [first, 'Home', false, first],
    [center, 'Home', false, first],
    [last, 'Home', false, first],
    [first, 'End', false, last],
    [center, 'End', false, last],
    [last, 'End', false, last],
    [first, 'PageUp', false, tableRow[0]],
    [center, 'PageUp', false, tableRow[3]],
    [last, 'PageUp', false, tableRow[19]],
    [first, 'PageDown', false, tableRow[10]],
    [center, 'PageDown', false, tableRow[23]],
    [last, 'PageDown', false, tableRow[29]],
    [first, 'ArrowLeft', false, tableRow[29]],
    [center, 'ArrowLeft', false, tableRow[12]],
    [last, 'ArrowLeft', false, tableRow[28]],
    [first, 'ArrowRight', false, tableRow[1]],
    [center, 'ArrowRight', false, tableRow[14]],
    [last, 'ArrowRight', false, tableRow[0]],
    [first, 'ArrowUp', false, tableRow[29]],
    [center, 'ArrowUp', false, tableRow[12]],
    [last, 'ArrowUp', false, tableRow[28]],
    [first, 'ArrowDown', false, tableRow[1]],
    [center, 'ArrowDown', false, tableRow[14]],
    [last, 'ArrowDown', false, tableRow[0]],
    [first, 'ArrowLeft', true, tableRow[0]],
    [center, 'ArrowLeft', true, tableRow[3]],
    [last, 'ArrowLeft', true, tableRow[19]],
    [first, 'ArrowRight', true, tableRow[10]],
    [center, 'ArrowRight', true, tableRow[23]],
    [last, 'ArrowRight', true, tableRow[29]],
    [first, 'ArrowUp', true, tableRow[0]],
    [center, 'ArrowUp', true, tableRow[3]],
    [last, 'ArrowUp', true, tableRow[19]],
    [first, 'ArrowDown', true, tableRow[10]],
    [center, 'ArrowDown', true, tableRow[23]],
    [last, 'ArrowDown', true, tableRow[29]],
    [first, 'A', false, null],
    [center, 'A', false, null],
    [last, 'A', false, null],
    [first, 'T', false, tableRow[1]],
    [center, 'T', false, tableRow[14]],
    [last, 'T', false, tableRow[0]],
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
