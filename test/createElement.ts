/* istanbul ignore file */

export function createElement<T extends keyof HTMLElementTagNameMap>(
  tagName: T,
  attrs: Partial<HTMLElementTagNameMap[T]> = {}
) {
  const el = document.createElement(tagName)

  Object.entries(attrs).forEach(([key, value]) => {
    if (key === 'textContent' || key === 'innerHTML') {
      el[key] = value as string
    } else {
      el.setAttribute(key, String(value))
    }
  })

  return el
}
