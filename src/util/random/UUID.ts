export const PERSISTENT_GLOBALLY_UNIQUE_IDENTIFIER =
  '75166547-7e80-4310-a0f5-d2872ced90c4'

export function UUID() {
  return globalThis.crypto.randomUUID()
}
