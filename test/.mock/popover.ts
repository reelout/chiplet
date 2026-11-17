/* istanbul ignore file */
import { generateUniqueId } from '#util'
import { afterAll, beforeAll, vi } from 'vitest'

let styleEl: HTMLStyleElement | undefined

beforeAll(() => {
  if (typeof HTMLElement.prototype.showPopover !== 'function') {
    const popoverOpen = generateUniqueId('data-popover-open-')

    HTMLElement.prototype.showPopover = vi.fn(function (this: HTMLElement) {
      this.setAttribute(popoverOpen, 'true')
    })

    HTMLElement.prototype.hidePopover = vi.fn(function (this: HTMLElement) {
      this.removeAttribute(popoverOpen)
    })

    HTMLElement.prototype.togglePopover = vi.fn(function (this: HTMLElement) {
      if (this.matches(':popover-open')) {
        this.hidePopover()
        return false
      } else {
        this.showPopover()
        return true
      }
    })

    const matches = HTMLElement.prototype.matches

    HTMLElement.prototype.matches = function (
      this: HTMLElement,
      selector: string
    ) {
      if (selector !== ':popover-open') {
        return matches.call(this, selector)
      }

      return (
        this.hasAttribute(popoverOpen) &&
        this.getAttribute(popoverOpen) === 'true'
      )
    } as typeof HTMLElement.prototype.matches

    styleEl = document.createElement('style')

    styleEl.innerHTML = `
      [popover]:not([${popoverOpen}="true"]) { display: none !important; }
      [popover][${popoverOpen}="true"] { display: block !important; }
    `

    document.head.appendChild(styleEl)
  }
})

afterAll(() => {
  styleEl?.remove()
})
