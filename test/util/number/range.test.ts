import type {
  Add,
  Decrement,
  Increment,
  IsNegative,
  IsPositive,
  Negative,
  Positive,
  Range,
  Subtract,
} from '#util/number'
import { expectTypeOf, test } from 'vitest'

test('Range - TS', () => {
  expectTypeOf<Positive<0>>().toEqualTypeOf<0>()
  expectTypeOf<Positive<1>>().toEqualTypeOf<1>()
  expectTypeOf<Positive<5>>().toEqualTypeOf<5>()
  expectTypeOf<Positive<-0>>().toEqualTypeOf<0>()
  expectTypeOf<Positive<-1>>().toEqualTypeOf<1>()
  expectTypeOf<Positive<-5>>().toEqualTypeOf<5>()

  expectTypeOf<Negative<0>>().toEqualTypeOf<0>()
  expectTypeOf<Negative<1>>().toEqualTypeOf<-1>()
  expectTypeOf<Negative<5>>().toEqualTypeOf<-5>()
  expectTypeOf<Negative<-0>>().toEqualTypeOf<0>()
  expectTypeOf<Negative<-1>>().toEqualTypeOf<-1>()
  expectTypeOf<Negative<-5>>().toEqualTypeOf<-5>()

  expectTypeOf<IsPositive<0>>().toEqualTypeOf<true>()
  expectTypeOf<IsPositive<1>>().toEqualTypeOf<true>()
  expectTypeOf<IsPositive<5>>().toEqualTypeOf<true>()
  expectTypeOf<IsPositive<-0>>().toEqualTypeOf<true>()
  expectTypeOf<IsPositive<-1>>().toEqualTypeOf<false>()
  expectTypeOf<IsPositive<-5>>().toEqualTypeOf<false>()

  expectTypeOf<IsNegative<0>>().toEqualTypeOf<false>()
  expectTypeOf<IsNegative<1>>().toEqualTypeOf<false>()
  expectTypeOf<IsNegative<5>>().toEqualTypeOf<false>()
  expectTypeOf<IsNegative<-0>>().toEqualTypeOf<false>()
  expectTypeOf<IsNegative<-1>>().toEqualTypeOf<true>()
  expectTypeOf<IsNegative<-5>>().toEqualTypeOf<true>()

  expectTypeOf<Increment<0>>().toEqualTypeOf<1>()
  expectTypeOf<Increment<1>>().toEqualTypeOf<2>()
  expectTypeOf<Increment<5>>().toEqualTypeOf<6>()
  expectTypeOf<Increment<-0>>().toEqualTypeOf<1>()
  expectTypeOf<Increment<-1>>().toEqualTypeOf<0>()
  expectTypeOf<Increment<-5>>().toEqualTypeOf<-4>()

  expectTypeOf<Decrement<0>>().toEqualTypeOf<-1>()
  expectTypeOf<Decrement<1>>().toEqualTypeOf<0>()
  expectTypeOf<Decrement<5>>().toEqualTypeOf<4>()
  expectTypeOf<Decrement<-0>>().toEqualTypeOf<-1>()
  expectTypeOf<Decrement<-1>>().toEqualTypeOf<-2>()
  expectTypeOf<Decrement<-5>>().toEqualTypeOf<-6>()

  expectTypeOf<Add<2, 3>>().toEqualTypeOf<5>()
  expectTypeOf<Add<-2, -3>>().toEqualTypeOf<-5>()
  expectTypeOf<Add<2, -3>>().toEqualTypeOf<-1>()
  expectTypeOf<Add<-2, 3>>().toEqualTypeOf<1>()
  expectTypeOf<Add<5, 3>>().toEqualTypeOf<8>()
  expectTypeOf<Add<-5, -3>>().toEqualTypeOf<-8>()
  expectTypeOf<Add<5, -3>>().toEqualTypeOf<2>()
  expectTypeOf<Add<-5, 3>>().toEqualTypeOf<-2>()

  expectTypeOf<Subtract<2, 3>>().toEqualTypeOf<-1>()
  expectTypeOf<Subtract<-2, -3>>().toEqualTypeOf<1>()
  expectTypeOf<Subtract<2, -3>>().toEqualTypeOf<5>()
  expectTypeOf<Subtract<-2, 3>>().toEqualTypeOf<-5>()
  expectTypeOf<Subtract<5, 3>>().toEqualTypeOf<2>()
  expectTypeOf<Subtract<-5, -3>>().toEqualTypeOf<-2>()
  expectTypeOf<Subtract<5, -3>>().toEqualTypeOf<8>()
  expectTypeOf<Subtract<-5, 3>>().toEqualTypeOf<-8>()

  expectTypeOf<Range<0>>().toEqualTypeOf<[]>()
  expectTypeOf<Range<1>>().toEqualTypeOf<[0]>()
  expectTypeOf<Range<2>>().toEqualTypeOf<[0, 1]>()
  expectTypeOf<Range<5>>().toEqualTypeOf<[0, 1, 2, 3, 4]>()
  expectTypeOf<Range<0, 1>>().toEqualTypeOf<[]>()
  expectTypeOf<Range<1, 1>>().toEqualTypeOf<[]>()
  expectTypeOf<Range<2, 1>>().toEqualTypeOf<[1]>()
  expectTypeOf<Range<5, 1>>().toEqualTypeOf<[1, 2, 3, 4]>()
  expectTypeOf<Range<0, -1>>().toEqualTypeOf<[-1]>()
  expectTypeOf<Range<1, -1>>().toEqualTypeOf<[-1, 0]>()
  expectTypeOf<Range<2, -1>>().toEqualTypeOf<[-1, 0, 1]>()
  expectTypeOf<Range<5, -1>>().toEqualTypeOf<[-1, 0, 1, 2, 3, 4]>()
})
