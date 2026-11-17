import { Lease, Lock, ReadWriteLock } from '#util'
import { expect, test, vi } from 'vitest'

test('Lease', () => {
  using spy = vi.fn()

  let lease: Lease

  {
    using _ = (lease = new Lease(spy))
  }

  expect(spy).toHaveBeenCalledTimes(1)

  lease[Symbol.dispose]()
  lease[Symbol.dispose]()
  lease[Symbol.dispose]()

  expect(spy).toHaveBeenCalledTimes(1)
})

test('Lock - #1', () => {
  expect(() => new Lock(-1)).toThrow(
    'Permit limit must be greater than 0, got -1'
  )
  expect(() => new Lock(0)).toThrow(
    'Permit limit must be greater than 0, got 0'
  )

  expect(new Lock().permitCount).toBe(1)
  expect(new Lock(2).permitCount).toBe(2)

  expect(new Lock().queueCount).toBe(0)
  expect(new Lock(2).queueCount).toBe(0)

  expect(() => new Lock().acquire(-1)).toThrow(
    'Permit count must be between 0 and 1, got -1'
  )
  expect(() => new Lock(2).acquire(3)).toThrow(
    'Permit count must be between 0 and 2, got 3'
  )
})

test('Lock - #2', async () => {
  let lock: Lock
  let lease: Lease
  let promise1: Promise<Lease>
  let promise2: Promise<Lease>
  let promise3: Promise<Lease>
  let promise4: Promise<Lease>

  {
    lock = new Lock(2)
    expect(lock.permitCount).toBe(2)
    expect(lock.queueCount).toBe(0)
  }

  {
    lease = await lock.acquire(2)
    expect(lock.permitCount).toBe(0)
    expect(lock.queueCount).toBe(0)
  }

  {
    promise1 = lock.acquire(0)
    promise2 = lock.acquire(1)
    promise3 = lock.acquire(2)
    promise4 = lock.acquire()
    expect(lock.permitCount).toBe(0)
    expect(lock.queueCount).toBe(4)
  }

  {
    await promise1
    expect(lock.permitCount).toBe(0)
    expect(lock.queueCount).toBe(4)
  }

  {
    lease[Symbol.dispose]()
    lease = await promise2
    expect(lock.permitCount).toBe(0)
    expect(lock.queueCount).toBe(2)
  }

  {
    lease[Symbol.dispose]()
    lease = await promise4
    expect(lock.permitCount).toBe(1)
    expect(lock.queueCount).toBe(2)
  }

  {
    lease[Symbol.dispose]()
    lease = await promise3
    expect(lock.permitCount).toBe(0)
    expect(lock.queueCount).toBe(0)
  }

  {
    lease[Symbol.dispose]()
    expect(lock.permitCount).toBe(2)
    expect(lock.queueCount).toBe(0)
  }
})

test('ReadWriteLock', async () => {
  let lock: ReadWriteLock
  let lease: Lease
  let promise1: Promise<Lease>
  let promise2: Promise<Lease>
  let promise3: Promise<Lease>
  let promise4: Promise<Lease>
  let promise5: Promise<Lease>
  let promise6: Promise<Lease>

  {
    lock = new ReadWriteLock()
    expect(lock.permitType).toBe('write')
    expect(lock.queueCount).toEqual({ read: 0, write: 0 })
  }

  {
    lease = await lock.acquire()
    expect(lock.permitType).toBe('read')
    expect(lock.queueCount).toEqual({ read: 0, write: 0 })
  }

  {
    promise1 = lock.acquire('read')
    promise2 = lock.acquire('write')
    promise3 = lock.acquire('read')
    promise4 = lock.acquire('read')
    promise5 = lock.acquire('write')
    promise6 = lock.acquire('read')
    expect(lock.permitType).toBe('none')
    expect(lock.queueCount).toEqual({ read: 3, write: 2 })
  }

  {
    lease[Symbol.dispose]()
    lease = await promise1
    expect(lock.permitType).toBe('none')
    expect(lock.queueCount).toEqual({ read: 3, write: 2 })
  }

  {
    lease[Symbol.dispose]()
    lease = await promise2
    expect(lock.permitType).toBe('none')
    expect(lock.queueCount).toEqual({ read: 3, write: 1 })
  }

  {
    lease[Symbol.dispose]()
    lease = await promise3
    expect(lock.permitType).toBe('none')
    expect(lock.queueCount).toEqual({ read: 1, write: 1 })
  }

  {
    lease[Symbol.dispose]()
    lease = await promise4
    expect(lock.permitType).toBe('none')
    expect(lock.queueCount).toEqual({ read: 1, write: 1 })
  }

  {
    lease[Symbol.dispose]()
    lease = await promise5
    expect(lock.permitType).toBe('none')
    expect(lock.queueCount).toEqual({ read: 1, write: 0 })
  }

  {
    lease[Symbol.dispose]()
    lease = await promise6
    expect(lock.permitType).toBe('read')
    expect(lock.queueCount).toEqual({ read: 0, write: 0 })
  }

  {
    lease[Symbol.dispose]()
    expect(lock.permitType).toBe('write')
    expect(lock.queueCount).toEqual({ read: 0, write: 0 })
  }
})
