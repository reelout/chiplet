import type { KeyboardOptions, PositioningOptions } from '#hook'
import { useSelect } from '#hook'
import { createKeyboardEvent as createEvent } from '#test'
import { preventDefault } from '#util'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { expect, test, vi } from 'vitest'

interface Option {
  value: number
  label: string
}

test('useSelect - name', async () => {
  {
    const { result } = renderHook(() => useSelect({ name: undefined }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), 1))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: 1,
          disabled: undefined,
          ref: expect.any(Function),
          children: '1',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useSelect({ name: 'name' }))

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: undefined }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: 2,
          disabled: undefined,
          ref: expect.any(Function),
          children: '2',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 2 }),
        onChange: expect.any(Function),
      },
    })
  }
})

test('useSelect - placeholder', async () => {
  {
    const { result } = renderHook(() => useSelect({ placeholder: undefined }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), 1))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: 1,
          disabled: undefined,
          ref: expect.any(Function),
          children: '1',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useSelect({ placeholder: 'Select' }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      placeholder: 'Select',
      value: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: 'Select',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      placeholder: 'Select',
      value: 2,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: 2,
          disabled: undefined,
          ref: expect.any(Function),
          children: '2',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }
})

test('useSelect - disabled', async () => {
  {
    const { result } = renderHook(() => useSelect({ disabled: undefined }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      disabled: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: undefined,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useSelect({ disabled: false }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      disabled: false,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: false,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: false,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useSelect({ disabled: true }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      disabled: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: true,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        disabled: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useSelect - options', async () => {
  const options: Option[] = [
    { value: 1, label: 'Item 1' },
    { value: 2, label: 'Item 2' },
    { value: 3, label: 'Item 3' },
  ]

  const { result } = renderHook(() => useSelect({ options }))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 1))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    options,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: 'Item 1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})

test('useSelect - defaultValue', async () => {
  const onChange = vi.fn()

  const { result } = renderHook(() => useSelect({ defaultValue: 1, onChange }))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 2))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 2,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '2',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    2
  )
})

test('useSelect - value', async () => {
  const onChange = vi.fn()
  const defaultValue = 0
  let value: number | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useSelect({ defaultValue, value, onChange })
  )

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 0,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '0',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  value = 1
  expect(() => rerender()).toThrow(
    'An uncontrolled component is being changed to a controlled component.'
  )
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 2))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  value = 3
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 3,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '3',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    2
  )
})

test('useSelect - onChange', async () => {
  const onChange = vi.fn()

  {
    const { result } = renderHook(() => useSelect({ onChange }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), 1))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: 1,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: 1,
          disabled: undefined,
          ref: expect.any(Function),
          children: '1',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() => useSelect({ name: 'name', onChange }))

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: undefined }),
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), 2))

    expect(result.current).toEqual({
      name: 'name',
      value: 2,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: 2,
          disabled: undefined,
          ref: expect.any(Function),
          children: '2',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': undefined,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: 2 }),
        onChange: expect.any(Function),
      },
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    1
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    2
  )
})

test('useSelect - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() => useSelect({ defaultValue: 1, onChange }))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 2))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 1,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), 3))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: 3,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '3',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        children: expect.any(Object),
      }),
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
    2
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    3
  )
})

test('useSelect - multiple - name', async () => {
  {
    const { result } = renderHook(() =>
      useSelect({ name: undefined, multiple: true })
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), [1]))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: [1],
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: [1],
          disabled: undefined,
          ref: expect.any(Function),
          children: '1',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() =>
      useSelect({ name: 'name', multiple: true })
    )

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: undefined }),
        multiple: true,
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), [1, 2]))

    expect(result.current).toEqual({
      name: 'name',
      value: [1, 2],
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: [1, 2],
          disabled: undefined,
          ref: expect.any(Function),
          children: '1, 2',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: [1, 2] }),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useSelect - multiple - placeholder', async () => {
  {
    const { result } = renderHook(() =>
      useSelect({ placeholder: undefined, multiple: true })
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), [1]))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: [1],
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: [1],
          disabled: undefined,
          ref: expect.any(Function),
          children: '1',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() =>
      useSelect({ placeholder: 'Select', multiple: true })
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      placeholder: 'Select',
      value: undefined,
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: 'Select',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), [1, 2]))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      placeholder: 'Select',
      value: [1, 2],
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: [1, 2],
          disabled: undefined,
          ref: expect.any(Function),
          children: '1, 2',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useSelect - multiple - disabled', async () => {
  {
    const { result } = renderHook(() =>
      useSelect({ multiple: true, disabled: undefined })
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      disabled: undefined,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        disabled: undefined,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() =>
      useSelect({ multiple: true, disabled: false })
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      disabled: false,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: false,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        disabled: false,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() =>
      useSelect({ multiple: true, disabled: true })
    )

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      disabled: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: true,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        disabled: true,
        onChange: expect.any(Function),
      },
    })
  }
})

test('useSelect - multiple - options', async () => {
  const options: Option[] = [
    { value: 1, label: 'Item 1' },
    { value: 2, label: 'Item 2' },
    { value: 3, label: 'Item 3' },
  ]

  const { result } = renderHook(() => useSelect({ options, multiple: true }))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    options,
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), [1]))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1],
    options,
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: 'Item 1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })
})

test('useSelect - multiple - lang', async () => {
  let lang: string | undefined = undefined
  const value = [1, 2, 3, 4]

  const { result, rerender } = renderHook(() =>
    useSelect({ value, multiple: true, slot: { button: { lang } } })
  )

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1, 2, 3, 4],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        lang: undefined,
        role: 'combobox',
        children: '1, 2, 3, 4',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  lang = 'en'
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1, 2, 3, 4],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        lang: 'en',
        role: 'combobox',
        children: '1, 2, 3, 4',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  lang = 'zh'
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1, 2, 3, 4],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        lang: 'zh',
        role: 'combobox',
        children: '1、2、3、4',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })
})

test('useSelect - multiple - defaultValue', async () => {
  const onChange = vi.fn()

  const { result } = renderHook(() =>
    useSelect({ defaultValue: [1], multiple: true, onChange })
  )

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), [2]))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [2],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '2',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    [2]
  )
})

test('useSelect - multiple - value', async () => {
  const onChange = vi.fn()
  const defaultValue: number[] = []
  let value: number[] | undefined = undefined

  const { result, rerender } = renderHook(() =>
    useSelect({ defaultValue, value, multiple: true, onChange })
  )

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  value = []
  expect(() => rerender()).toThrow(
    'An uncontrolled component is being changed to a controlled component.'
  )
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), [2]))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  value = [1, 2, 3]
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1, 2, 3],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1, 2, 3',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(1)
  expect(onChange).toHaveBeenCalledWith(
    expect.objectContaining({ defaultPrevented: false }),
    [2]
  )
})

test('useSelect - multiple - onChange', async () => {
  const onChange = vi.fn()

  {
    const { result } = renderHook(() => useSelect({ multiple: true, onChange }))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: undefined,
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), [1]))

    expect(result.current).toEqual({
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: [1],
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
          value: [1],
          disabled: undefined,
          ref: expect.any(Function),
          children: '1',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
        value: expect.objectContaining({}),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }

  {
    const { result } = renderHook(() =>
      useSelect({ name: 'name', multiple: true, onChange })
    )

    expect(result.current).toEqual({
      name: 'name',
      value: undefined,
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: undefined,
          disabled: undefined,
          ref: expect.any(Function),
          children: undefined,
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: undefined }),
        multiple: true,
        onChange: expect.any(Function),
      },
    })

    await act(() => result.current.onChange?.(createEvent({}), [1, 2]))

    expect(result.current).toEqual({
      name: 'name',
      value: [1, 2],
      multiple: true,
      onChange: expect.any(Function),
      button: {
        props: {
          role: 'combobox',
          'aria-autocomplete': 'none',
          'aria-placeholder': undefined,
          name: 'name',
          value: [1, 2],
          disabled: undefined,
          ref: expect.any(Function),
          children: '1, 2',
        },
      },
      popover: {
        props: expect.objectContaining({
          role: 'listbox',
          'aria-multiselectable': true,
          children: expect.any(Object),
        }),
      },
      context: {
        name: 'name',
        value: expect.objectContaining({ name: [1, 2] }),
        multiple: true,
        onChange: expect.any(Function),
      },
    })
  }

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: false }),
    [1]
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    [1, 2]
  )
})

test('useSelect - multiple - preventDefault', async () => {
  const onChange = vi.fn().mockImplementationOnce(preventDefault)

  const { result } = renderHook(() =>
    useSelect({ defaultValue: [1], multiple: true, onChange })
  )

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), [1, 2]))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  await act(() => result.current.onChange?.(createEvent({}), [1, 3]))

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: [1, 3],
    multiple: true,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: '1, 3',
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': true,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      multiple: true,
      onChange: expect.any(Function),
    },
  })

  expect(onChange).toHaveBeenCalledTimes(2)
  expect(onChange).toHaveBeenNthCalledWith(
    1,
    expect.objectContaining({ defaultPrevented: true }),
    [1, 2]
  )
  expect(onChange).toHaveBeenNthCalledWith(
    2,
    expect.objectContaining({ defaultPrevented: false }),
    [1, 3]
  )
})

test('useSelect - popover', async () => {
  const positioning = Object.freeze<PositioningOptions>({ position: 'below' })
  const keyboard = Object.freeze<KeyboardOptions>({ direction: 'both' })
  let defaultOpen: boolean | undefined = undefined
  let open: boolean | undefined = undefined
  const onToggle = vi.fn()

  const { result, rerender } = renderHook(() =>
    useSelect({ positioning, keyboard, defaultOpen, open, onToggle })
  )

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { position: 'below' },
        keyboard: { direction: 'both' },
        defaultOpen: undefined,
        open: undefined,
        onToggle,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  defaultOpen = true
  open = undefined
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { position: 'below' },
        keyboard: { direction: 'both' },
        defaultOpen: true,
        open: undefined,
        onToggle,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })

  defaultOpen = undefined
  open = false
  rerender()

  expect(result.current).toEqual({
    name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
    value: undefined,
    onChange: expect.any(Function),
    button: {
      props: expect.objectContaining({
        role: 'combobox',
        children: undefined,
      }),
    },
    popover: {
      props: expect.objectContaining({
        role: 'listbox',
        'aria-multiselectable': undefined,
        positioning: { position: 'below' },
        keyboard: { direction: 'both' },
        defaultOpen: undefined,
        open: false,
        onToggle,
        children: expect.any(Object),
      }),
    },
    context: {
      name: expect.stringMatching(/^group-[a-z0-9]{8}$/),
      value: expect.objectContaining({}),
      onChange: expect.any(Function),
    },
  })
})
