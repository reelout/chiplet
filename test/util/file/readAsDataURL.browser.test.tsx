import { TimeoutError } from '#util'
import { readAsDataURL } from '#util'
import { beforeEach, expect, test, vi } from 'vitest'
import { server } from 'vitest/browser'

beforeEach(() => {
  vi.restoreAllMocks()
})

test('readAsDataURL - #1', async () => {
  const spy = vi.spyOn(FileReader.prototype, 'readAsDataURL')

  const blob = new Blob(['test'], { type: 'text/plain' })

  const promise1 = readAsDataURL(blob)
  const promise2 = readAsDataURL(blob, AbortSignal.abort())
  const promise3 = readAsDataURL({} as Blob)

  await Promise.all([
    expect(promise1).resolves.toBe('data:text/plain;base64,dGVzdA=='),
    expect(promise2).rejects.toThrow('Aborted'),
    expect(promise3).rejects.toThrow(
      {
        'chromium': `Failed to execute 'readAsDataURL' on 'FileReader': parameter 1 is not of type 'Blob'.`,
        'firefox': `FileReader.readAsDataURL: Argument 1 does not implement interface Blob.`,
        'webkit': `Argument 1 ('blob') to FileReader.readAsDataURL must be an instance of Blob`,
      }[server.browser]
    ),
  ])

  expect(spy).toHaveBeenCalledTimes(3)
})

test('readAsDataURL - #2', async () => {
  const controller = new AbortController()
  const signal = controller.signal

  const spy1 = vi
    .spyOn(signal, 'addEventListener')
    .mockImplementation((type, listener, options) => {
      signal.onabort = vi.fn(listener as EventListener)
    })

  const reader = new FileReader()

  const spy2 = vi
    .spyOn(globalThis, 'FileReader')
    .mockImplementation(function () {
      return reader
    })

  vi.spyOn(reader, 'onabort', 'set').mockImplementationOnce((listener) => {
    reader.onabort = vi.fn(listener as EventListener)
  })
  vi.spyOn(reader, 'onerror', 'set').mockImplementationOnce((listener) => {
    reader.onerror = vi.fn(listener as EventListener)
  })
  vi.spyOn(reader, 'onload', 'set').mockImplementationOnce((listener) => {
    reader.onload = vi.fn(listener as EventListener)
  })

  const promise4 = readAsDataURL(new Blob(), signal)

  controller.abort()

  await expect(promise4).rejects.toThrow('Aborted')

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy1).toHaveBeenCalledWith('abort', expect.any(Function), {
    once: true,
  })

  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith()

  expect(signal.onabort).toHaveBeenCalledTimes(1)
  expect(reader.onabort).toHaveBeenCalledTimes(1)
  expect(reader.onerror).toHaveBeenCalledTimes(0)
  expect(reader.onload).toHaveBeenCalledTimes(0)
})

test('readAsDataURL - #3', async () => {
  const reader = new FileReader()

  const spy1 = vi
    .spyOn(globalThis, 'FileReader')
    .mockImplementation(function () {
      return reader
    })

  const spy2 = vi.spyOn(reader, 'readAsDataURL').mockReturnValue()

  const spy3 = vi
    .spyOn(reader, 'error', 'get')
    .mockReturnValue(TimeoutError('20250629'))

  const promise = readAsDataURL({ type: 'foo' } as Blob)

  reader.onerror?.({} as ProgressEvent<FileReader>)

  await expect(promise).rejects.toThrow('20250629')

  expect(spy1).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledTimes(1)
  expect(spy2).toHaveBeenCalledWith({ type: 'foo' })
  expect(spy3).toHaveBeenCalledTimes(1)
})
