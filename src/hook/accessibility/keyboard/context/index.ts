'use client'
import { createContext } from 'react'
import type { Keyboard } from '../Keyboard'
import type { PoolAdd, PoolRemove } from '../hook'

export interface KeyboardContext extends Keyboard {
  lastActive: Element | null
  isActivated: boolean
  add: PoolAdd
  remove: PoolRemove
}

export const KeyboardContext = createContext<KeyboardContext | null>(null)

KeyboardContext.displayName = 'KeyboardContext'
