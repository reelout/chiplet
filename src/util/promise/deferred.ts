type Executor<T> = ConstructorParameters<typeof Promise<T>>[0]

type Resolve<T> = Parameters<Executor<T>>[0]

type ResolvedValue<T> = Parameters<Resolve<T>>[0]

export class Deferred<T> {
  static resolve<T>(value: ResolvedValue<T>) {
    const deferred = new Deferred<T>()
    deferred.resolve(value)
    return deferred
  }

  static reject<T = never>(reason?: unknown) {
    const deferred = new Deferred<T>()
    deferred.reject(reason)
    return deferred
  }

  resolve!: (value: ResolvedValue<T>) => void

  reject!: (reason?: unknown) => void

  readonly promise = new Promise<T>((resolve, reject) => {
    this.resolve = resolve
    this.reject = reject
  })
}
