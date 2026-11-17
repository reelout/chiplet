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
  const { onSearch, ...attrs } = props

  attrs.role ||= 'searchbox'

  if (attrs.before === undefined) {
    attrs.before = (
      <Search24Regular
        className={clsx(InputBeforeStyle, SearchInputBeforeStyle)}
      />
    )
  }

  const { onKeyDown } = attrs

  attrs.onKeyDown = useCallback<NonNullable<typeof onKeyDown>>(
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    (ev) => {
      onKeyDown?.(ev)

      if (!ev.defaultPrevented && isEnterKey(ev)) {
        onSearch?.(ev, ev.currentTarget.value)
      }
    },
    // eslint-disable-next-line react-hooks/preserve-manual-memoization
    [onKeyDown, onSearch]
  )

  return <Input {...attrs} />
}
