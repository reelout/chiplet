import { generateDeterministicId } from '../../../src/util/random/generateDeterministicId'

export const generatedIdentifiers = [
  generateDeterministicId(''),
  generateDeterministicId('prefix-'),
  generateDeterministicId('prefix-'),
] as const
