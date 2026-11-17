import { useMoveFocus } from '#hook/accessibility/keyboard/hook/useMoveFocus'
import { useNavigate } from '#hook/accessibility/keyboard/hook/useNavigate'
import { parse, resolve } from '#hook/accessibility/keyboard/resolve'
import { Tree } from '#hook/accessibility/keyboard/tree'
import { createKeyboardEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { renderHook, screen } from '@testing-library/react'
import { act } from 'react'
import { beforeEach, expect, test, vi, type Mock } from 'vitest'

vi.mock(
  import('#hook/accessibility/keyboard/resolve'),
  async (importOriginal) => ({
    ...(await importOriginal()),
    resolve: vi.fn((await importOriginal()).resolve),
    parse: vi.fn((await importOriginal()).parse),
  })
)

vi.mock(
  import('#hook/accessibility/keyboard/hook/useMoveFocus'),
  async (importOriginal) => ({
    ...(await importOriginal()),
    useMoveFocus: vi.fn((await importOriginal()).useMoveFocus),
  })
)

function createTree(items: (HTMLElement | SVGElement)[]) {
  return Tree(
    new Map(items.map((item) => [item, { key: item.dataset.testid }]))
  )
}

let inputEl: HTMLInputElement
let buttonEl: HTMLButtonElement
let anchorEl: HTMLAnchorElement
let svgEl: SVGSVGElement

beforeEach(() => {
  vi.clearAllMocks()

  document.body.innerHTML = `
    <input type="text" data-testid="input" />
    <button data-testid="button">Button</button>
    <a href="#" data-testid="anchor">Link</a>
    <svg tabIndex="0" data-testid="svg"></svg>
  `

  inputEl = screen.getByTestId('input')
  buttonEl = screen.getByTestId('button')
  anchorEl = screen.getByTestId('anchor')
  svgEl = screen.getByTestId('svg') as Element as SVGSVGElement
})

test('useNavigate - props', async () => {
  let spy1 = vi.fn()
  let spy2 = vi.fn()
  const spy3 = resolve as Mock<typeof resolve>
  const tree = createTree([inputEl, buttonEl, anchorEl])

  const { result, rerender } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2,
      spy1
    )

    return [active, isFocusVisible, navigate] as const
  })

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => result.current[2](createEvent({ key: 'ArrowDown' })))

  expect(result.current).toEqual([null, false, expect.any(Function)])
  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(1)

  spy1 = vi.fn()
  spy2 = vi.fn().mockReturnValueOnce('ArrowLeft')

  rerender()

  await act(() => result.current[2](createEvent({ key: 'ArrowDown' })))

  expect(result.current).toEqual([
    expect.objectContaining({ value: anchorEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledTimes(2)
})

test('useNavigate - HTMLElement', async () => {
  const spy = vi.spyOn(buttonEl, 'focus')
  const tree = createTree([buttonEl, svgEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      parse
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => result.current[2](createEvent({ key: 'ArrowDown' })))

  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith()
})

test('useNavigate - SVGElement', async () => {
  const spy = vi.spyOn(svgEl, 'focus')
  const tree = createTree([buttonEl, svgEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      parse
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => result.current[2](createEvent({ key: 'ArrowUp' })))

  expect(result.current).toEqual([
    expect.objectContaining({ value: svgEl }),
    false,
    expect.any(Function),
  ])
  expect(spy).toHaveBeenCalledTimes(1)
  expect(spy).toHaveBeenCalledWith()
})

test('useNavigate - cannot move focus', async () => {
  const spy = vi.fn()
  const el = { dataset: {}, focus: spy } as Partial<Element> as HTMLElement
  const tree = createTree([el])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      parse
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => result.current[2](createEvent({ key: 'ArrowDown' })))
  await act(() => result.current[2](createEvent({ key: 'ArrowUp' })))

  expect(result.current).toEqual([null, false, expect.any(Function)])
  expect(spy).toHaveBeenCalledTimes(0)
})

test('useNavigate - navigate to the next element', async () => {
  const spy1 = vi.spyOn(buttonEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  const onNavigate = vi.fn()
  const tree = createTree([inputEl, buttonEl, anchorEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2,
      onNavigate
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => inputEl.focus())

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])

  await act(() => {
    result.current[2](
      createEvent({ target: document.activeElement, key: 'ArrowDown' })
    )
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    'block',
    inputEl,
    expect.objectContaining({ target: inputEl, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(
    'linear',
    'block',
    tree,
    inputEl,
    'ArrowRight'
  )
  expect(onNavigate).toHaveBeenCalledTimes(1)
  expect(onNavigate).toHaveBeenCalledWith(
    expect.objectContaining({ target: inputEl, defaultPrevented: true }),
    expect.objectContaining({ value: buttonEl }),
    expect.objectContaining({ value: inputEl })
  )
})

test('useNavigate - navigate to the same element repeatedly', async () => {
  const spy1 = vi.spyOn(anchorEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  const onNavigate = vi.fn()
  const tree = createTree([inputEl, buttonEl, anchorEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2,
      onNavigate
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => inputEl.focus())

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])

  await act(() => {
    result.current[2](
      createEvent({ target: document.activeElement, key: 'End' })
    )
  })
  await act(() => {
    result.current[2](
      createEvent({ target: document.activeElement, key: 'End' })
    )
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: anchorEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(2)
  expect(spy1).toHaveBeenNthCalledWith(1)
  expect(spy1).toHaveBeenNthCalledWith(2)
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    'block',
    inputEl,
    expect.objectContaining({ target: inputEl, defaultPrevented: true })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    'block',
    anchorEl,
    expect.objectContaining({ target: anchorEl, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(2)
  expect(spy3).toHaveBeenNthCalledWith(
    1,
    'linear',
    'block',
    tree,
    inputEl,
    'End'
  )
  expect(spy3).toHaveBeenNthCalledWith(
    2,
    'linear',
    'block',
    tree,
    anchorEl,
    'End'
  )
  expect(onNavigate).toHaveBeenCalledTimes(1)
  expect(onNavigate).toHaveBeenCalledWith(
    expect.objectContaining({ target: inputEl, defaultPrevented: true }),
    expect.objectContaining({ value: anchorEl }),
    expect.objectContaining({ value: inputEl })
  )
})

test('useNavigate - stop navigation when default behavior was prevented - #1', async () => {
  const spy1 = vi.spyOn(buttonEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  const onNavigate = vi.fn().mockImplementationOnce(preventDefault)
  const tree = createTree([inputEl, buttonEl, anchorEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2,
      onNavigate
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => inputEl.focus())

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])

  await act(() => {
    result.current[2](
      createEvent({ target: document.activeElement, key: 'ArrowDown' })
    )
  })
  await act(() => {
    result.current[2](
      createEvent({ target: document.activeElement, key: 'ArrowDown' })
    )
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    'block',
    inputEl,
    expect.objectContaining({ target: inputEl, defaultPrevented: true })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    'block',
    inputEl,
    expect.objectContaining({ target: inputEl, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(2)
  expect(spy3).toHaveBeenNthCalledWith(
    1,
    'linear',
    'block',
    tree,
    inputEl,
    'ArrowRight'
  )
  expect(spy3).toHaveBeenNthCalledWith(
    2,
    'linear',
    'block',
    tree,
    inputEl,
    'ArrowRight'
  )
  expect(onNavigate).toHaveBeenCalledTimes(2)
  expect(onNavigate).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ target: inputEl, defaultPrevented: true }),
    expect.objectContaining({ value: buttonEl }),
    expect.objectContaining({ value: inputEl })
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ target: inputEl, defaultPrevented: true }),
    expect.objectContaining({ value: buttonEl }),
    expect.objectContaining({ value: inputEl })
  )
})

test('useNavigate - stop navigation when default behavior was prevented - #2', async () => {
  const spy1 = vi.spyOn(buttonEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  const tree = createTree([inputEl, buttonEl, anchorEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => inputEl.focus())

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])

  await act(() => {
    result.current[2](
      createEvent({
        target: document.activeElement,
        key: 'ArrowDown',
        defaultPrevented: true,
      })
    )
  })
  await act(() => {
    result.current[2](
      createEvent({
        target: document.activeElement,
        key: 'ArrowDown',
        defaultPrevented: false,
      })
    )
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(2)
  expect(spy2).toHaveBeenNthCalledWith(
    1,
    'block',
    inputEl,
    expect.objectContaining({ target: inputEl, defaultPrevented: true })
  )
  expect(spy2).toHaveBeenNthCalledWith(
    2,
    'block',
    inputEl,
    expect.objectContaining({ target: inputEl, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(2)
  expect(spy3).toHaveBeenNthCalledWith(
    1,
    'linear',
    'block',
    tree,
    inputEl,
    'ArrowRight'
  )
  expect(spy3).toHaveBeenNthCalledWith(
    2,
    'linear',
    'block',
    tree,
    inputEl,
    'ArrowRight'
  )
})

test('useNavigate - cannot resolve the next focusable element', async () => {
  const spy1 = vi.spyOn(buttonEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  const tree = createTree([inputEl, buttonEl, anchorEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => inputEl.focus())

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])

  await act(() => {
    result.current[2](
      createEvent({ target: document.activeElement, key: 'Unidentified' })
    )
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    'block',
    inputEl,
    expect.objectContaining({ target: inputEl, defaultPrevented: false })
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith('linear', 'block', tree, inputEl, null)
})

test('useNavigate - navigate manually', async () => {
  const spy1 = vi.spyOn(inputEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  let tree = createTree([inputEl, buttonEl, anchorEl])

  const { result, rerender } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2
    )

    return [active, isFocusVisible, navigate] as const
  })

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => buttonEl.focus())
  await act(() => buttonEl.blur())

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => {
    result.current[2](createEvent({ target: document.body, key: 'ArrowDown' }))
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    'block',
    undefined,
    expect.objectContaining({ target: document.body, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(
    'linear',
    'block',
    tree,
    undefined,
    'ArrowRight'
  )

  await act(() => {
    result.current[2](createEvent({ target: document.body, key: 'ArrowDown' }))
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])

  vi.clearAllMocks()

  tree = createTree([inputEl, document.createElement('button'), anchorEl])

  rerender()

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => {
    result.current[2](createEvent({ target: document.body, key: 'ArrowDown' }))
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    'block',
    undefined,
    expect.objectContaining({ target: document.body, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(
    'linear',
    'block',
    tree,
    undefined,
    'ArrowRight'
  )
})

test('useNavigate - wait until the tree is ready before navigating manually', async () => {
  const spy1 = vi.spyOn(inputEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  let tree = createTree([])

  const { result, rerender } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2
    )

    return [active, isFocusVisible, navigate] as const
  })

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => {
    result.current[2](createEvent({ target: document.body, key: 'ArrowDown' }))
  })

  expect(result.current).toEqual([null, false, expect.any(Function)])

  tree = createTree([inputEl, buttonEl, anchorEl])

  rerender()

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    'block',
    undefined,
    expect.objectContaining({ target: document.body, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveBeenCalledWith(
    'linear',
    'block',
    tree,
    undefined,
    'ArrowRight'
  )
})

test('useNavigate - abort when losing focus', async () => {
  const spy1 = vi.spyOn(buttonEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  let tree = createTree([])

  const { result, rerender } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => inputEl.focus())

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => {
    result.current[2](createEvent({ target: inputEl, key: 'ArrowDown' }))
  })

  expect(result.current).toEqual([null, false, expect.any(Function)])

  await act(() => anchorEl.focus())

  tree = createTree([inputEl, buttonEl])

  rerender()

  expect(result.current).toEqual([null, false, expect.any(Function)])
  expect(spy1).toHaveBeenCalledTimes(0)
  expect(spy2).toHaveBeenCalledTimes(0)
  expect(spy3).toHaveBeenCalledTimes(0)
})

test('useNavigate - navigate even when the event target is not active', async () => {
  const spy1 = vi.spyOn(buttonEl, 'focus')
  const spy2 = parse as Mock<typeof parse>
  const spy3 = resolve as Mock<typeof resolve>
  const tree = createTree([inputEl, buttonEl, anchorEl])

  const { result } = renderHook(() => {
    const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)
    const navigate = useNavigate(
      'linear',
      'block',
      tree,
      active,
      moveFocus,
      spy2
    )

    return [active, isFocusVisible, navigate] as const
  })

  await act(() => inputEl.focus())

  expect(result.current).toEqual([
    expect.objectContaining({ value: inputEl }),
    false,
    expect.any(Function),
  ])

  await act(() => {
    result.current[2](createEvent({ target: anchorEl, key: 'ArrowDown' }))
  })

  expect(result.current).toEqual([
    expect.objectContaining({ value: buttonEl }),
    false,
    expect.any(Function),
  ])
  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith()
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith(
    'block',
    inputEl,
    expect.objectContaining({ target: anchorEl, defaultPrevented: true })
  )
  expect(spy3).toHaveBeenCalledTimes(1)
  expect(spy3).toHaveReturnedWith(expect.objectContaining({ value: buttonEl }))
})
