import type { ChangeCallback } from '#hook'
import { isEnterKey } from '#util'
import clsx from 'clsx'
import { useCallback } from 'react'
import { Search24Regular } from '../icon'
import { Input, type InputProps } from './Input'
import { InputBeforeStyle, SearchInputBeforeStyle } from './style/index.css'

export interface SearchInputProps extends InputProps {
  onSearch?:
    ChangeCallback<React.KeyboardEvent<HTMLInputElement>, string> | undefined
}

export function SearchInput(props: SearchInputProps) {
  const { onSearch, onKeyDown, ...attrs } = props

  attrs.role ||= 'searchbox'

  if (attrs.before === undefined) {
    attrs.before = (
      <Search24Regular
        className={clsx(InputBeforeStyle, SearchInputBeforeStyle)}
      />
    )
  }

  const handleKeyDown = useCallback<NonNullable<typeof onKeyDown>>(
    (ev) => {
      onKeyDown?.(ev)

      // Ignore the 'Enter' key that confirms an in-progress IME composition.
      if (
        !ev.defaultPrevented &&
        isEnterKey(ev) &&
        !ev.nativeEvent.isComposing
      ) {
        onSearch?.(ev, ev.currentTarget.value)
      }
    },
    [onKeyDown, onSearch]
  )

  return <Input {...attrs} onKeyDown={handleKeyDown} />
}
