import { createContext } from 'react'
import type { Overlay } from '../useOverlay'

export const OverlayContext = createContext<Overlay | null>(null)

OverlayContext.displayName = 'OverlayContext'
