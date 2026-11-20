import { useSystemColorScheme } from '#theme'
import { renderHookServer } from '#test'
import { renderHook } from '@testing-library/react'
import { act } from 'react'
import { afterEach, expect, test, vi } from 'vitest'

function mockMatchMedia(initialMatches: boolean) {
  const listeners = new Set<() => void>()

  const media = {
    matches: initialMatches,
    addEventListener: vi.fn((_type: string, listener: () => void) => {
      listeners.add(listener)
    }),
    removeEventListener: vi.fn((_type: string, listener: () => void) => {
      listeners.delete(listener)
    }),
  }

  const matchMedia = vi.fn((_query: string) => media)

  vi.stubGlobal('matchMedia', matchMedia)

  return {
    matchMedia,
    media,
    emit: () => listeners.forEach((listener) => listener()),
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

test('useSystemColorScheme - returns light when the system prefers light', () => {
  const { matchMedia, media } = mockMatchMedia(false)

  const { result } = renderHook(() => useSystemColorScheme())

  expect(result.current).toBe('light')
  expect(matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)')
  expect(media.addEventListener).toHaveBeenCalledWith(
    'change',
    expect.any(Function)
  )
})

test('useSystemColorScheme - returns dark when the system prefers dark', () => {
  mockMatchMedia(true)

  const { result } = renderHook(() => useSystemColorScheme())

  expect(result.current).toBe('dark')
})

test('useSystemColorScheme - updates when the system scheme changes', () => {
  const { media, emit } = mockMatchMedia(false)

  const { result } = renderHook(() => useSystemColorScheme())

  expect(result.current).toBe('light')

  media.matches = true

  act(() => emit())

  expect(result.current).toBe('dark')
})

test('useSystemColorScheme - unsubscribes from the media query on unmount', () => {
  const { media } = mockMatchMedia(false)

  const { unmount } = renderHook(() => useSystemColorScheme())

  expect(media.removeEventListener).toHaveBeenCalledTimes(0)

  unmount()

  expect(media.removeEventListener).toHaveBeenCalledTimes(1)
  expect(media.removeEventListener).toHaveBeenCalledWith(
    'change',
    media.addEventListener.mock.calls[0]?.[1]
  )
})

test('useSystemColorScheme - assumes light when rendered on the server', () => {
  mockMatchMedia(true)

  const { result } = renderHookServer(() => useSystemColorScheme())

  expect(result.current).toBe('light')
})
