export type Positive<N extends number> =
  `${N}` extends `-${infer P extends number}` ? P : N

export type Negative<N extends number> = N extends 0
  ? 0
  : `${N}` extends `-${string}`
    ? N
    : `-${N}` extends `${infer N extends number}`
      ? N
      : never

export type IsPositive<N extends number> = `${N}` extends `-${string}`
  ? false
  : true

export type IsNegative<N extends number> = `${N}` extends `-${string}`
  ? true
  : false

type Tuple<
  Length extends number,
  Array extends readonly number[] = [],
> = Array['length'] extends Length
  ? Array
  : Tuple<Length, [...Array, Array['length']]>

type IsGreaterThan<A extends number, B extends number> =
  IsPositive<A> extends true
    ? IsPositive<B> extends true
      ? Tuple<A> extends [...Tuple<B>, ...(readonly unknown[])]
        ? true
        : false
      : true
    : IsPositive<B> extends true
      ? false
      : IsGreaterThan<Positive<B>, Positive<A>>

type AddPositive<A extends number, B extends number> = [
  ...Tuple<A>,
  ...Tuple<B>,
]['length'] extends infer C extends number
  ? C
  : never

type SubtractPositive<A extends number, B extends number> =
  Tuple<A> extends [...Tuple<B>, ...infer R]
    ? R['length'] extends infer C extends number
      ? C
      : never
    : never

export type Add<A extends number, B extends number> =
  IsPositive<A> extends true
    ? IsPositive<B> extends true
      ? AddPositive<A, B>
      : IsGreaterThan<A, Positive<B>> extends true
        ? SubtractPositive<A, Positive<B>>
        : Negative<SubtractPositive<Positive<B>, A>>
    : IsPositive<B> extends true
      ? Add<B, A>
      : Negative<AddPositive<Positive<A>, Positive<B>>>

export type Subtract<A extends number, B extends number> =
  IsPositive<A> extends true
    ? IsPositive<B> extends true
      ? IsGreaterThan<A, B> extends true
        ? SubtractPositive<A, B>
        : Negative<SubtractPositive<B, A>>
      : AddPositive<A, Positive<B>>
    : IsPositive<B> extends true
      ? Negative<AddPositive<Positive<A>, B>>
      : Subtract<Positive<B>, Positive<A>>

export type Increment<N extends number> = Add<N, 1>

export type Decrement<N extends number> = Subtract<N, 1>

export type Range<
  End extends number,
  Start extends number = 0,
> = Start extends End
  ? []
  : IsGreaterThan<End, Start> extends true
    ? [Start, ...Range<End, Increment<Start>>]
    : []
