export function isSymbol(symbol: unknown): symbol is symbol {
  return typeof symbol === 'symbol'
}
