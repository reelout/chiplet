'use client'
import { useCheckbox, useRefObject, type ChangeCallback } from '#hook'
import clsx from 'clsx'
import { useLayoutEffect } from 'react'
import {
  CheckboxChecked,
  CheckboxIndeterminate,
  CheckboxUnchecked,
} from './icon'
import {
  CheckboxCheckedIconStyle,
  CheckboxIndeterminateIconStyle,
  CheckboxStyle,
  CheckboxUncheckedIconStyle,
} from './style/index.css'

export type CheckboxSize = 'small' | 'medium' | 'large'

export interface CheckboxProps extends Omit<
  React.ComponentProps<'input'>,
  'size' | 'onChange' | 'slot'
> {
  size?: CheckboxSize | undefined
  value: string
  indeterminate?: boolean | undefined
  onChange?:
    ChangeCallback<React.ChangeEvent<HTMLInputElement>, boolean> | undefined
  slot?: {
    root?: React.ComponentProps<'div'> | undefined
    input?: React.ComponentProps<'input'> | undefined
  }
}

export function Checkbox(props: CheckboxProps) {
  const {
    className,
    style,
    size = 'medium',
    indeterminate,
    onChange,
    slot,
    ...attrs
  } = useCheckbox(props)

  const ref = useRefObject(attrs.ref)

  useLayoutEffect(() => {
    /* istanbul ignore else */
    if (ref.current) {
      // When a checkbox has both `indeterminate` and `checked` set to true,
      // only the `indeterminate` state will be activated in Chromium browser.
      // Writing the 'indeterminate' IDL attribute mutates the value returned
      // by the 'current' getter, which the compiler cannot prove mutable.
      // eslint-disable-next-line react-compiler/react-compiler
      ref.current.indeterminate = !ref.current.checked && !!indeterminate
    }
  })

  return (
    <div
      {...slot?.root}
      className={clsx(
        CheckboxStyle({ size }),
        slot?.root?.className,
        className
      )}
      style={style}
    >
      <input
        {...slot?.input}
        {...attrs}
        type='checkbox'
        onChange={(ev) => onChange?.(ev, ev.currentTarget.checked)}
        ref={ref}
      />
      <CheckboxUnchecked className={CheckboxUncheckedIconStyle} />
      <CheckboxIndeterminate className={CheckboxIndeterminateIconStyle} />
      <CheckboxChecked className={CheckboxCheckedIconStyle} />
    </div>
  )
}
