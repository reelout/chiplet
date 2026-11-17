import {
  AbortError,
  NetworkError,
  NotFoundError,
  NotSupportedError,
  TimeoutError,
} from '#util'
import { expect, test } from 'vitest'

test('NotFoundError', () => {
  expect(NotFoundError('NOT FOUND', { cause: '20250617' })).toMatchObject({
    constructor: DOMException,
    code: 8,
    name: 'NotFoundError',
    message: 'NOT FOUND',
    cause: '20250617',
  })
})

test('NotSupportedError', () => {
  expect(NotSupportedError('NOT SUPPORTED', { cause: 202506 })).toMatchObject({
    constructor: DOMException,
    code: 9,
    name: 'NotSupportedError',
    message: 'NOT SUPPORTED',
    cause: 202506,
  })
})

test('NetworkError', () => {
  expect(NetworkError('NETWORK ERROR', { cause: { a: true } })).toMatchObject({
    constructor: DOMException,
    code: 19,
    name: 'NetworkError',
    message: 'NETWORK ERROR',
    cause: { a: true },
  })
})

test('AbortError', () => {
  expect(AbortError()).toMatchObject({
    constructor: DOMException,
    code: 20,
    name: 'AbortError',
    message: 'Aborted',
    cause: undefined,
  })

  expect(
    AbortError('Aborted with cause', { cause: new Error('This is the cause') })
  ).toMatchObject({
    constructor: DOMException,
    code: 20,
    name: 'AbortError',
    message: 'Aborted with cause',
    cause: {
      name: 'Error',
      message: 'This is the cause',
    },
  })
})

test('TimeoutError', () => {
  expect(TimeoutError('TIMOEOUT ERROR', { cause: 20250629 })).toMatchObject({
    constructor: DOMException,
    code: 23,
    name: 'TimeoutError',
    message: 'TIMOEOUT ERROR',
    cause: 20250629,
  })
})
