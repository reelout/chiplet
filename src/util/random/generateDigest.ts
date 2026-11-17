import { toHex } from './toHex'

export async function generateDigest(message: string) {
  const encoder = new TextEncoder()

  const buffer = encoder.encode(message)

  const hash = await crypto.subtle.digest('SHA-256', buffer)

  return toHex(new Uint8Array(hash))
}
