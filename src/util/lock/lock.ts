import { Deferred } from '../promise'

export class Lease implements Disposable {
  private release: (() => void) | undefined

  constructor(release: (() => void) | undefined) {
    this.release = release
  }

  [Symbol.dispose](): void {
    this.release?.()
    this.release = undefined
  }
}

export class Lock {
  private _queue: [number, Deferred<Lease>][] = []

  private _queueCount = 0

  private _permitCount: number

  private readonly _permitLimit: number

  constructor(permitLimit = 1) {
    if (permitLimit <= 0) {
      throw RangeError(
        `Permit limit must be greater than 0, got ${permitLimit}`
      )
    }

    this._permitCount = permitLimit

    this._permitLimit = permitLimit
  }

  get permitCount() {
    return this._permitCount
  }

  get queueCount() {
    return this._queueCount
  }

  acquire(permitCount: number = 1) {
    if (permitCount < 0 || permitCount > this._permitLimit) {
      throw RangeError(
        `Permit count must be between 0 and ${this._permitLimit}, got ${permitCount}`
      )
    }

    if (permitCount > this._permitCount) {
      const deferred = new Deferred<Lease>()

      this._queue.push([permitCount, deferred])

      this._queueCount += permitCount

      return deferred.promise
    }

    this._permitCount -= permitCount

    return Promise.resolve(new Lease(() => this.release(permitCount)))
  }

  private release(permitCount: number) {
    this._permitCount += permitCount

    const queue = this._queue

    this._queue = []

    this._queueCount = 0

    for (const [count, deferred] of queue) {
      deferred.resolve(this.acquire(count))
    }
  }
}

export type LockType = keyof typeof LockType

const LockType = {
  read: 1,
  write: 2,
} as const

const PermitType = {
  none: 0,
  read: 1,
  write: 3,
  0: 'none',
  1: 'read',
  3: 'write',
} as const

type PermitType = Extract<keyof typeof PermitType, number>

export class ReadWriteLock {
  private _queue: [LockType, Deferred<Lease>][] = []

  private _queueCount: Record<LockType, number> = {
    read: 0,
    write: 0,
  }

  private _permitType: PermitType = PermitType.write

  private _readCount = 0

  get permitType() {
    return PermitType[this._permitType]
  }

  get queueCount() {
    return { ...this._queueCount }
  }

  acquire(type: LockType = 'read') {
    if (!(this._permitType & LockType[type])) {
      const deferred = new Deferred<Lease>()

      this._queue.push([type, deferred])

      this._queueCount[type] += 1

      if (type === 'write') {
        this._permitType = PermitType.none
      }

      return deferred.promise
    }

    switch (type) {
      case 'read':
        this._permitType = PermitType.read
        this._readCount += 1
        break

      case 'write':
        this._permitType = PermitType.none
        break
    }

    return Promise.resolve(new Lease(() => this.release(type)))
  }

  private release(type: LockType) {
    switch (type) {
      case 'read':
        this._readCount -= 1
        if (this._readCount === 0) this._permitType = PermitType.write
        break

      case 'write':
        this._permitType = PermitType.write
        break
    }

    const queue = this._queue

    this._queue = []

    this._queueCount = { read: 0, write: 0 }

    for (const [type, deferred] of queue) {
      deferred.resolve(this.acquire(type))
    }
  }
}
