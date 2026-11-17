export function toHex(bytes: Uint8Array) {
  return bytes.reduce(
    (acc, byte) => acc + byte.toString(16).padStart(2, '0'),
    ''
  )
}
