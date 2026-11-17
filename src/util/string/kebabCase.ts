import type { KebabCase } from 'type-fest'
import { split } from './split'

export function kebabCase<T extends string>(str: T) {
  return split(str).join('-').toLowerCase() as KebabCase<T>
}
