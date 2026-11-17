import { createElement, useMemo, type PropsWithChildren } from 'react'
import { useDefault, type ChangeCallback } from './useDefault'
import { FormContext } from './context'

interface Props<T extends object> extends PropsWithChildren {
  defaultValue?: T | undefined
  value?: T | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, T> | undefined
}

export function useForm<P extends Props<{}>>(props: P) {
  const [value, onChange] = useDefault({
    defaultValue: props.defaultValue ?? {},
    value: props.value,
    onChange: props.onChange,
  })

  const context = useMemo<FormContext<typeof value>>(
    () => ({ value, onChange }),
    [onChange, value]
  )

  let { children } = props
  children = createElement(FormContext, { value: context }, children)

  props = {
    ...props,
    children,
  }

  return props
}
