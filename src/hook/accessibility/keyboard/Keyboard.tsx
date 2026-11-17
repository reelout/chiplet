'use client'
import { useImperativeHandle, useMemo } from 'react'
import invariant from 'tiny-invariant'
import { useActivate, type ActivateCallback } from '../../react/useActivate'
import { KeyboardContext } from './context'
import {
  useLastFocused,
  useMoveFocus,
  useNavigate,
  usePool,
  type Navigate,
  type NavigateCallback,
} from './hook'
import { parse, type Parse } from './resolve'
import { Tree } from './tree'

type Activate = (ev: KeyboardEvent | React.KeyboardEvent) => void

export type NavigationType = 'linear' | 'grid'

export type NavigationDirection = 'inline' | 'block' | 'both'

export interface KeyboardOptions {
  type?: NavigationType | undefined
  direction?: NavigationDirection | undefined
  parse?: Parse | undefined
  onNavigate?: NavigateCallback | undefined
  onActivate?: ActivateCallback | undefined
  ref?: React.Ref<Keyboard> | undefined
}

export interface KeyboardProps
  extends KeyboardOptions, React.PropsWithChildren {}

export interface Keyboard {
  type: NavigationType
  direction: NavigationDirection
  active: Tree.Node | null
  isFocusVisible: boolean
  navigate: Navigate
  activate: Activate
}

export function Keyboard(props: KeyboardProps) {
  const {
    type = 'linear',
    direction = 'both',
    onNavigate,
    onActivate,
    ref,
  } = props

  if (type === 'grid') {
    invariant(
      direction === 'both',
      'Only direction "both" is allowed when type is "grid".'
    )
  }

  const [pool, add, remove] = usePool()

  const tree = useMemo(() => Tree(pool), [pool])

  const [isActivated, activate, reset] = useActivate(onActivate)

  const [active, isFocusVisible, moveFocus] = useMoveFocus(tree)

  const navigate = useNavigate(
    type,
    direction,
    tree,
    active,
    moveFocus,
    (...args) => {
      const target = props.parse?.(...args)

      if (target !== undefined) {
        return target
      }

      return parse(...args)
    },
    (ev, ...args) => {
      onNavigate?.(ev, ...args)

      if (!ev.defaultPrevented) {
        reset()
      }
    }
  )

  const activeEl = active?.value ?? null

  const lastActiveEl = useLastFocused(type, tree, activeEl)

  const keyboard = useMemo<Keyboard>(
    () => ({
      type,
      direction,
      active,
      isFocusVisible,
      navigate,
      activate: (ev) => {
        if (activeEl && !active?.context.disabled) {
          activate(ev, activeEl)
        }
      },
    }),
    [activate, active, activeEl, direction, isFocusVisible, navigate, type]
  )

  const context = useMemo<KeyboardContext>(
    () => ({
      ...keyboard,
      lastActive: lastActiveEl,
      isActivated,
      add,
      remove,
    }),
    [add, isActivated, keyboard, lastActiveEl, remove]
  )

  useImperativeHandle(ref, () => keyboard, [keyboard])

  return <KeyboardContext value={context}>{props.children}</KeyboardContext>
}
