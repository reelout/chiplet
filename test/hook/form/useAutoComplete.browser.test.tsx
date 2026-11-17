import '#.mock/popover'
import type { AutoCompleteOptions, Overlay, PopoverOptions } from '#hook'
import {
  FormContext,
  useAutoComplete,
  useChange,
  useClose,
  useInteractive,
  useKeyboard,
  useOption,
  usePopover,
} from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { VirtualFocus, preventDefault } from '#util'
import { render, renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { act, createRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { assert, beforeAll, expect, test, vi } from 'vitest'

function change(
  inputProps: Pick<NonNullable<Slot['input']>, 'onChange'> | undefined,
  value: string,
  init?: UIEventInit
) {
  const ev = new UIEvent('change', init)

  const target = document.createElement('input')

  target.value = value

  Object.defineProperty(ev, 'target', {
    configurable: true,
    get: () => target,
  })

  Object.defineProperty(ev, 'currentTarget', {
    configurable: true,
    get: () => target,
  })

  inputProps?.onChange?.(ev as object as React.ChangeEvent<never>)
}

function toArray(highlight: Highlight | null | undefined) {
  if (!highlight) return null

  return Array.from(highlight.values()).map((range) => [
    range.startContainer.textContent,
    range.startOffset,
    range.endContainer.textContent,
    range.endOffset,
  ])
}

const options = Object.freeze<Option[]>([
  { value: '12ab', label: '1A' },
  { value: '32321', label: '234' },
  { value: 'Abc456', label: 'Abc456' },
  { value: '23ab', label: 'AB123' },
])

const result =
  createRef<ReturnType<typeof useAutoComplete<string, false, Option, Slot>>>()

beforeAll(() => {
  globalThis.Highlight ??= Set as unknown as typeof Highlight
  Element.prototype.scrollIntoView ??= vi.fn()
  vi.useFakeTimers({ shouldAdvanceTime: true })
})

interface Option {
  value: string
  label: string
}

interface Slot {
  input?: React.ComponentProps<'input'> | undefined
  popover?: PopoverOptions<'ul'> | undefined
}

function Portal(props: React.PropsWithChildren) {
  return createPortal(props.children, document.body)
}

function Popover(props: PopoverOptions<'ul'>) {
  const popover = usePopover(props)

  return (
    <>
      {popover.anchor}
      {popover.overlay.open && (
        <Portal>
          <ul {...popover.positioned.props} />
        </Portal>
      )}
    </>
  )
}

function Option(
  props: React.ComponentProps<'li'> & {
    name?: never
    value: string
    defaultChecked?: never
    checked?: never
    defaultSelected?: boolean | undefined
    selected?: boolean | undefined
  }
) {
  props = useOption(props)
  props = useChange(props.selected, props)
  props = useClose(props, false)
  props = useInteractive(props)
  props = useKeyboard(props)

  const {
    name,
    value,
    defaultChecked,
    checked,
    defaultSelected,
    selected,
    ...attrs
  } = props

  return (
    <li
      {...attrs}
      role='option'
      aria-selected={selected}
      data-name={name}
      data-value={value}
      data-label={attrs.children}
    />
  )
}

function Page<M extends false = false>(
  props: AutoCompleteOptions<string, M, Option, Slot>
) {
  const select = useAutoComplete({
    options,
    ...props,
  })

  useEffect(() => {
    result.current = select
  })

  return (
    <Popover
      {...select.popover.props}
      anchor={<input {...select.input.props} />}
    >
      <FormContext value={select.context}>
        {select.options?.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </FormContext>
    </Popover>
  )
}

test('useAutoComplete - name', async () => {
  let name: string | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useAutoComplete<string>({ name })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  name = 'name'
  rerender()

  expect(result.current).toEqual({
    type: 'both',
    name: 'name',
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: 'name',
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: 'name',
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - placeholder', async () => {
  let placeholder: string | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useAutoComplete<string>({ placeholder })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  placeholder = 'Type here'
  rerender()

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    placeholder: 'Type here',
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: 'Type here',
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - defaultValue - #1', async () => {
  const { result } = renderHook(() =>
    useAutoComplete<string>({ defaultValue: 'value1' })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 'value1',
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'value1',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 'value2'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 'value2',
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'value2',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - defaultValue - #2', async () => {
  const { result } = renderHook(() =>
    useAutoComplete<string, false>({ defaultValue: undefined, multiple: false })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    multiple: false,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': false,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: false,
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), '1'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: '1',
    options: undefined,
    query: undefined,
    highlight: undefined,
    multiple: false,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '1',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': false,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: false,
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), '12'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: '12',
    options: undefined,
    query: undefined,
    highlight: undefined,
    multiple: false,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '12',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': false,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: false,
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - value', async () => {
  let value = 'value1'

  const { result, rerender } = renderHook(() =>
    useAutoComplete<string>({ value })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 'value1',
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'value1',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 'value2'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 'value1',
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'value1',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  value = 'value3'
  rerender()

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 'value3',
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'value3',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - options - #1', async () => {
  const { result } = renderHook(() => useAutoComplete<string>({ options }))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: '32321', label: '234' },
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
    ],
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, ''))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: '32321', label: '234' },
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
    ],
    query: '',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, 'a'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
    ],
    query: 'a',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'a',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, 'B'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
      { value: '12ab', label: '1A' },
    ],
    query: 'B',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'B',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, '2'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '32321', label: '234' },
      { value: '23ab', label: 'AB123' },
      { value: '12ab', label: '1A' },
    ],
    query: '2',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '2',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, '12'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '23ab', label: 'AB123' },
      { value: '12ab', label: '1A' },
    ],
    query: '12',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '12',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - options - #2', async () => {
  const { result } = renderHook(() =>
    useAutoComplete<string>({ type: 'list', options })
  )

  expect(result.current).toEqual({
    type: 'list',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: '32321', label: '234' },
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
    ],
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, ''))

  expect(result.current).toEqual({
    type: 'list',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: '32321', label: '234' },
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
    ],
    query: '',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, 'a'))

  expect(result.current).toEqual({
    type: 'list',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
    ],
    query: 'a',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'a',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, 'B'))

  expect(result.current).toEqual({
    type: 'list',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: 'Abc456', label: 'Abc456' },
      { value: '23ab', label: 'AB123' },
    ],
    query: 'B',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'B',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, '2'))

  expect(result.current).toEqual({
    type: 'list',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: '32321', label: '234' },
      { value: '23ab', label: 'AB123' },
    ],
    query: '2',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '2',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => change(result.current.input.props, '12'))

  expect(result.current).toEqual({
    type: 'list',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: [
      { value: '12ab', label: '1A' },
      { value: '23ab', label: 'AB123' },
    ],
    query: '12',
    queryRE: expect.any(RegExp),
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'list',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '12',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - multiple', async () => {
  let multiple: false | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useAutoComplete<string, false>({ multiple })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  multiple = false
  rerender()

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    multiple: false,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': false,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: false,
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - disabled', async () => {
  let disabled: boolean | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useAutoComplete<string>({ disabled })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  disabled = false
  rerender()

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    disabled: false,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: false,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      disabled: false,
      onChange: expect.any(Function),
    },
  })

  disabled = true
  rerender()

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    disabled: true,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: true,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      disabled: true,
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - onChange - #1', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() => useAutoComplete<string>({ onChange }))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 'value1'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 'value2'))

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 'value2',
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: 'value2',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    'value1'
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    'value2'
  )
})

test('useAutoComplete - onChange - #2', async () => {
  const ref = createRef<Overlay<HTMLUListElement>>()

  const { getByRole } = render(<Page ref={ref} />)

  const input = getByRole('combobox') as HTMLInputElement

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).not.toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')

  await act(() => input.focus())
  await act(() => input.click())

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: '234' })).not.toHaveAttribute(VirtualFocus)

  await userEvent.keyboard('{ArrowDown}{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('234')
  expect(input).toHaveValue('234')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: '234' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{Enter}')

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('234')

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('AB123')
  expect(input).toHaveValue('AB123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('Ab')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('123')
  expect(input).toHaveValue('Ab123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('12ab')
  expect(input).toHaveValue('12ab')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: '1A' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{Enter}')

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('1A')

  await userEvent.keyboard('{ArrowUp}{ArrowUp}')
  await userEvent.keyboard('abc')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('456')
  expect(input).toHaveValue('abc456')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(1)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.click(document.body)

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).not.toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('1A')
})

test('useAutoComplete - onChange - #3', async () => {
  const ref = createRef<Overlay<HTMLUListElement>>()

  const { getByRole } = render(<Page multiple={false} ref={ref} />)

  const input = getByRole('combobox') as HTMLInputElement

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).not.toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')

  await act(() => input.focus())
  await act(() => input.click())

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: '234' })).not.toHaveAttribute(VirtualFocus)

  await userEvent.keyboard('{ArrowDown}{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('234')
  expect(input).toHaveValue('234')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: '234' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{Enter}')

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('234')

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('AB123')
  expect(input).toHaveValue('AB123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('Ab')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('123')
  expect(input).toHaveValue('Ab123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('12ab')
  expect(input).toHaveValue('12ab')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: '1A' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{Enter}')

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('1A')

  await userEvent.keyboard('{ArrowUp}{ArrowUp}')
  await userEvent.keyboard('abc')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('456')
  expect(input).toHaveValue('abc456')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(1)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.click(document.body)

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).not.toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('1A')
})

test('useAutoComplete - onSearch', async () => {
  const ref = createRef<Overlay<HTMLUListElement>>()

  const { getByRole } = render(<Page ref={ref} />)

  const input = getByRole('combobox') as HTMLInputElement

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).not.toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')

  await act(() => input.focus())
  await act(() => input.click())

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('AB123')
  expect(input).toHaveValue('AB123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('A')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('B123')
  expect(input).toHaveValue('AB123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('b')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('123')
  expect(input).toHaveValue('Ab123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{Backspace}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('Ab')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('c')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('Abc')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(1)
  expect(getByRole('option', { name: 'Abc456' })).not.toHaveAttribute(
    VirtualFocus
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('456')
  expect(input).toHaveValue('Abc456')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(1)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )
})

test('useAutoComplete - onNavigate - #1', async () => {
  const onNavigate = vi.fn().mockImplementationOnce(preventDefault)
  const ref = createRef<Overlay<HTMLUListElement>>()

  const { getByRole } = render(<Page keyboard={{ onNavigate }} ref={ref} />)

  const input = getByRole('combobox') as HTMLInputElement

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).not.toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')

  await act(() => input.focus())
  await act(() => input.click())

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).not.toHaveAttribute(
    VirtualFocus
  )

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).not.toHaveAttribute(
    VirtualFocus
  )

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('AB123')
  expect(input).toHaveValue('AB123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('Abc456')
  expect(input).toHaveValue('Abc456')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('a')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('bc456')
  expect(input).toHaveValue('abc456')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('B')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('c456')
  expect(input).toHaveValue('aBc456')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('123')
  expect(input).toHaveValue('aB123')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('12ab')
  expect(input).toHaveValue('12ab')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: '1A' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).toHaveSelection('c456')
  expect(input).toHaveValue('aBc456')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  expect(onNavigate).toHaveBeenCalledTimes(6)
  expect(onNavigate).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      key: 'ArrowUp',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    }),
    null
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'ArrowUp',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    }),
    null
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      key: 'ArrowUp',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'Abc456' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    })
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({
      key: 'ArrowDown',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'Abc456' }),
    })
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({
      key: 'ArrowDown',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: '1A' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    })
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({
      key: 'ArrowDown',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'Abc456' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: '1A' }),
    })
  )
})

test('useAutoComplete - onNavigate - #2', async () => {
  const onNavigate = vi.fn().mockImplementationOnce(preventDefault)
  const ref = createRef<Overlay<HTMLUListElement>>()

  const { getByRole } = render(
    <Page type='list' keyboard={{ onNavigate }} ref={ref} />
  )

  const input = getByRole('combobox') as HTMLInputElement

  expect(ref.current?.open).toBe(false)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(null)
  expect(input).not.toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')

  await act(() => input.focus())
  await act(() => input.click())

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).not.toHaveAttribute(
    VirtualFocus
  )

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).not.toHaveAttribute(
    VirtualFocus
  )

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowUp}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(4)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('a')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('a')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('B')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('aB')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('aB')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'AB123' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('aB')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: '1A' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  await userEvent.keyboard('{ArrowDown}')

  expect(ref.current?.open).toBe(true)
  expect(ref.current?.anchor).toBe(input)
  expect(ref.current?.positioned).toBe(getByRole('listbox'))
  expect(input).toHaveFocus()
  expect(input).not.toHaveSelection()
  expect(input).toHaveValue('aB')
  expect(getByRole('listbox').querySelectorAll('li')).toHaveLength(3)
  expect(getByRole('option', { name: 'Abc456' })).toHaveAttribute(
    VirtualFocus,
    'true'
  )

  expect(onNavigate).toHaveBeenCalledTimes(6)
  expect(onNavigate).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({
      key: 'ArrowUp',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    }),
    null
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({
      key: 'ArrowUp',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    }),
    null
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({
      key: 'ArrowUp',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'Abc456' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    })
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    4,
    expect.objectContaining({
      key: 'ArrowDown',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'Abc456' }),
    })
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    5,
    expect.objectContaining({
      key: 'ArrowDown',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: '1A' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'AB123' }),
    })
  )
  expect(onNavigate).toHaveBeenNthCalledWith(
    6,
    expect.objectContaining({
      key: 'ArrowDown',
      defaultPrevented: true,
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: 'Abc456' }),
    }),
    expect.objectContaining({
      value: expect.objectContaining({ textContent: '1A' }),
    })
  )
})

test('useAutoComplete - positioning', async () => {
  const { result } = renderHook(() =>
    useAutoComplete<string>({ positioning: { position: 'below' } })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { position: 'below', align: true },
        keyboard: { onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - keyboard - #1', async () => {
  const { result } = renderHook(() =>
    useAutoComplete<string>({ keyboard: 'block' })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { direction: 'block', onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - keyboard - #2', async () => {
  const { result } = renderHook(() =>
    useAutoComplete<string>({ keyboard: { direction: 'block' } })
  )

  expect(result.current).toEqual({
    type: 'both',
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options: undefined,
    query: undefined,
    highlight: undefined,
    onChange: expect.any(Function),
    input: {
      props: {
        role: 'combobox',
        'aria-autocomplete': 'both',
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        placeholder: undefined,
        value: '',
        disabled: undefined,
        onChange: expect.any(Function),
        onBlur: expect.any(Function),
        ref: { current: null },
      },
    },
    popover: {
      props: {
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { align: true },
        keyboard: { direction: 'block', onNavigate: expect.any(Function) },
        defaultOpen: undefined,
        open: undefined,
        onToggle: undefined,
        ref: { current: null },
        children: expect.any(Object),
      },
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useAutoComplete - highlight', async () => {
  const { getByRole } = render(<Page defaultOpen={true} options={[]} />)

  const el = getByRole('listbox')

  assert(result.current)

  await act(() => change(result.current?.input.props, 'ab'))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(result.current.highlight).toBe(undefined)
  expect(toArray(result.current.highlight)).toBe(null)

  await act(() => (el.innerHTML = '<div>abc1a<b>b2a</b><i>b3a</i>b4</div>'))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(result.current.highlight).toBeInstanceOf(Highlight)
  expect(toArray(result.current.highlight)).toEqual([['abc1a', 0, 'abc1a', 2]])

  await act(() => change(result.current?.input.props, ''))
  await act(() => vi.runOnlyPendingTimersAsync())

  expect(result.current.highlight).toBe(undefined)
  expect(toArray(result.current.highlight)).toBe(null)
})

test('useAutoComplete - auto open popover on input change', async () => {
  const ref = createRef<Overlay<HTMLUListElement>>()
  const onToggle = vi.fn()

  render(<Page ref={ref} onToggle={onToggle} />)

  expect(ref.current?.open).toBe(false)

  await act(() => change(result.current?.input.props, '', { detail: 1 }))

  expect(ref.current?.open).toBe(true)

  await act(() => change(result.current?.input.props, 'x', { detail: 2 }))

  expect(ref.current?.open).toBe(true)

  await act(() => change(result.current?.input.props, '', { detail: 3 }))

  expect(ref.current?.open).toBe(true)

  await act(() => ref.current?.toggle(new Event('toggle')))

  expect(ref.current?.open).toBe(false)

  await act(() => change(result.current?.input.props, '', { detail: 5 }))

  expect(ref.current?.open).toBe(true)

  expect(onToggle).toHaveBeenCalledTimes(3)
  expect(onToggle).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ type: 'change', detail: 1 }),
    true
  )
  expect(onToggle).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ type: 'toggle' }),
    false
  )
  expect(onToggle).toHaveBeenNthCalledWith(
    3,
    expect.objectContaining({ type: 'change', detail: 5 }),
    true
  )
})
