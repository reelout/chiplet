export interface PromiseReducer<T, U = void> {
  (previous: U): PromiseLike<T>
}

export function promiseReduce<A, B>(
  promise1: PromiseReducer<A, void>,
  promise2: PromiseReducer<B, A>
): Promise<B>

export function promiseReduce<A, B, C>(
  promise1: PromiseReducer<A, void>,
  promise2: PromiseReducer<B, A>,
  promise3: PromiseReducer<C, B>
): Promise<C>

export function promiseReduce<A, B, C, D>(
  promise1: PromiseReducer<A, void>,
  promise2: PromiseReducer<B, A>,
  promise3: PromiseReducer<C, B>,
  promise4: PromiseReducer<D, C>
): Promise<D>

export function promiseReduce<A, B, C, D, E>(
  promise1: PromiseReducer<A, void>,
  promise2: PromiseReducer<B, A>,
  promise3: PromiseReducer<C, B>,
  promise4: PromiseReducer<D, C>,
  promise5: PromiseReducer<E, D>
): Promise<E>

export function promiseReduce<A, B, C, D, E, F>(
  promise1: PromiseReducer<A, void>,
  promise2: PromiseReducer<B, A>,
  promise3: PromiseReducer<C, B>,
  promise4: PromiseReducer<D, C>,
  promise5: PromiseReducer<E, D>,
  promise6: PromiseReducer<F, E>
): Promise<F>

export function promiseReduce<T>(
  promise: PromiseReducer<T, void>,
  ...reducers: PromiseReducer<T, T>[]
): Promise<T>

export async function promiseReduce<T>(
  promise: PromiseReducer<T, void>,
  ...reducers: PromiseReducer<T, T>[]
): Promise<T> {
  let result = await promise()

  for (const reducer of reducers) {
    result = await reducer(result)
  }

  return result
}
