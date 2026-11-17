/* istanbul ignore file */
import { generateIdentifier } from '@vanilla-extract/css'

export function generateDeterministicId<P extends string>(prefix: P) {
  return (prefix +
    generateIdentifier({
      debugId: '',
      debugFileName: false,
    })) as `${P}${string}`
}
