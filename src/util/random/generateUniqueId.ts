import { toHex } from './toHex'

export function generateUniqueId<
  P extends string | undefined = '',
  S extends string | undefined = '',
>(prefix: P = '' as P, suffix: S = '' as S) {
  return (prefix +
    toHex(crypto.getRandomValues(new Uint8Array(4))) +
    suffix) as `${NoInfer<P extends string ? P : ''>}${string}${NoInfer<S extends string ? S : ''>}`
}
