import { useHighlight } from '#hook'
import { createElement } from '#test'
import { renderHook } from '@testing-library/react'
import { act, type RefObject } from 'react'
import { beforeAll, expect, test, vi } from 'vitest'

function toArray(highlight: Highlight | null | undefined) {
  if (!highlight) return null

  return Array.from(highlight.values()).map((range) => [
    range.startContainer.textContent,
    range.startOffset,
    range.endContainer.textContent,
    range.endOffset,
  ])
}

beforeAll(() => {
  globalThis.Highlight ??= Set as unknown as typeof Highlight
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

test('useHighlight - highlights only with a non-empty pattern and a matching element', async () => {
  const el = createElement('div', { textContent: 'ABc12' })
  let pattern: string | undefined
  let ref: RefObject<Node> | Node | undefined

  const { result, rerender } = renderHook(() => useHighlight(pattern, ref))

  {
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBe(undefined)
    expect(toArray(result.current)).toBe(null)
  }

  {
    pattern = ''
    ref = undefined
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBe(undefined)
    expect(toArray(result.current)).toBe(null)
  }

  {
    pattern = ''
    ref = { current: el.cloneNode(true) }
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBe(undefined)
    expect(toArray(result.current)).toBe(null)
  }

  {
    pattern = 'bc'
    ref = { current: el.cloneNode(true) }
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBeInstanceOf(Highlight)
    expect(toArray(result.current)).toEqual([['ABc12', 1, 'ABc12', 3]])
  }

  {
    pattern = 'bc'
    ref = undefined
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBe(undefined)
    expect(toArray(result.current)).toBe(null)
  }

  {
    pattern = 'bc'
    ref = el.cloneNode(true)
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBeInstanceOf(Highlight)
    expect(toArray(result.current)).toEqual([['ABc12', 1, 'ABc12', 3]])
  }

  {
    pattern = 'bc'
    ref = document.createElement('div')
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBe(undefined)
    expect(toArray(result.current)).toBe(null)
  }

  {
    pattern = ''
    ref = el.cloneNode(true)
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBe(undefined)
    expect(toArray(result.current)).toBe(null)
  }
})

test('useHighlight - updates the ranges as the matched content mutates', async () => {
  let pattern = 'ab'
  const el = document.createElement('div')
  const ref = { current: el }

  const { result, rerender } = renderHook(() => useHighlight(pattern, ref))

  {
    expect(toArray(result.current)).toBe(null)

    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toBe(null)

    await act(() => (el.innerHTML = ''))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toBe(null)
  }

  {
    await act(() => (el.innerHTML = 'abc'))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toEqual([['abc', 0, 'abc', 2]])
  }

  {
    await act(() => (el.innerHTML = 'abcabc'))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toEqual([
      ['abcabc', 0, 'abcabc', 2],
      ['abcabc', 3, 'abcabc', 5],
    ])
  }

  {
    await act(() => (el.innerHTML = '<div>abc1</div><div>abc2</div>'))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toEqual([
      ['abc1', 0, 'abc1', 2],
      ['abc2', 0, 'abc2', 2],
    ])
  }

  {
    await act(() => (el.innerHTML = '<span>abc3</span><span>abc4</span>'))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toEqual([
      ['abc3', 0, 'abc3', 2],
      ['abc4', 0, 'abc4', 2],
    ])
  }

  {
    await act(() => (el.innerHTML = '<div>abc1a<b>b2a</b><i>b3a</i>b4</div>'))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toEqual([['abc1a', 0, 'abc1a', 2]])
  }

  {
    pattern = ''
    rerender()
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(toArray(result.current)).toBe(null)
  }
})

test('useHighlight - removes the highlight when mutations remove all matches', async () => {
  const pattern = 'ab'
  const el = document.createElement('div')
  const ref = { current: el }

  const { result } = renderHook(() => useHighlight(pattern, ref))

  {
    await act(() => (el.innerHTML = 'abc'))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBeInstanceOf(Highlight)
    expect(toArray(result.current)).toEqual([['abc', 0, 'abc', 2]])
  }

  {
    await act(() => (el.innerHTML = 'xyz'))
    await act(() => vi.runOnlyPendingTimersAsync())

    expect(result.current).toBe(undefined)
    expect(toArray(result.current)).toBe(null)
  }
})
