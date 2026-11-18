import { Body2, SearchInput } from '#component'
import type * as IconModule from '#component/icon/Icon'
import * as module from '#component/icon'
import { Keyboard, Roving, useRegExp } from '#hook'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ItemIconStyle,
  ItemLabelStyle,
  ItemStyle,
  ListStyle,
} from './style.css'

type IconName = Exclude<keyof typeof module, keyof typeof IconModule>

export default function IconSet() {
  const [keyword, setKeyword] = useState('')

  const keywordRE = useRegExp(keyword, 'i')

  const onChange = useCallback(
    (ev: unknown, keyword: string) => setKeyword(keyword),
    []
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <SearchInput placeholder='Search' value={keyword} onChange={onChange} />
      </div>

      <div role='list' className={ListStyle}>
        <Keyboard>
          {Object.keys(import.meta.glob('../set/*.svg'))
            .map((path) => path.slice(7, -4))
            .sort((a, b) => a.localeCompare(b))
            .filter((name): name is IconName => keywordRE.test(name))
            .map((name) => (
              <IconItem key={name} name={name} />
            ))}
        </Keyboard>
      </div>
    </div>
  )
}

function IconItem(props: { name: IconName }) {
  const Icon = module[props.name]

  const timerRef = useRef(0)

  const [copied, setCopied] = useState(false)

  const onClick = useCallback(() => {
    navigator.clipboard.writeText(props.name)

    setCopied(true)

    window.clearTimeout(timerRef.current)

    timerRef.current = window.setTimeout(() => setCopied(false), 1000)
  }, [props.name])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  return (
    <Roving role='listitem' onClick={onClick} className={ItemStyle}>
      <Icon aria-label={props.name} className={ItemIconStyle} />
      <Body2 className={ItemLabelStyle}>{props.name}</Body2>
      {copied && (
        <div
          style={{
            position: 'absolute',
            inset: '0.5rem auto auto 0.5rem',
            display: 'flex',
            placeContent: 'center',
            placeItems: 'center',
            padding: '0.25rem 0.5rem',
            fontSize: '0.75rem',
            lineHeight: '1rem',
            color: 'inherit',
            backgroundColor: '#0002',
            borderRadius: 'inherit',
          }}
        >
          Copied
        </div>
      )}
    </Roving>
  )
}
