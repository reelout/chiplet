'use client'
import { useCallback, useLayoutEffect, useState } from 'react'
import { refValue, useRegExp, type RefValue } from '../react'

export function useHighlight(
  pattern: string | undefined,
  ref: RefValue<Node> | undefined
) {
  const RE = useRegExp(pattern, 'gi')

  const [highlight, setHighlight] = useState<Highlight | undefined>()

  const apply = useCallback(
    (el: Node) => {
      if (!RE || RE.test('')) return

      const highlight = new Highlight()

      const traverse = (node: Node) => {
        if (node.nodeType === Node.TEXT_NODE && node.nodeValue) {
          let match: RegExpExecArray | null

          while ((match = RE.exec(node.nodeValue)) !== null) {
            const range = new Range()

            range.setStart(node, match.index)
            range.setEnd(node, match.index + match[0].length)

            highlight.add(range)
          }
        } else {
          node.childNodes.forEach(traverse)
        }
      }

      el.normalize()

      traverse(el)

      if (highlight.size > 0) {
        setHighlight(highlight)
      }
    },
    [RE]
  )

  useLayoutEffect(() => {
    /* istanbul ignore next */
    if (typeof Highlight !== 'function') return

    const el = refValue(ref)

    if (!el) return

    const delay = 160

    let timer = window.setTimeout(() => apply(el), delay)

    const observer = new MutationObserver(() => {
      clearTimeout(timer)
      timer = window.setTimeout(() => apply(el), delay)
    })

    observer.observe(el, {
      subtree: true,
      childList: true,
      characterData: true,
    })

    return () => {
      setHighlight(undefined)
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [apply, ref])

  return highlight
}
