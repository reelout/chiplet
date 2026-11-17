import { isWebKit } from '@floating-ui/utils/dom'

export const browser = () =>
  /Firefox/.test(navigator.userAgent)
    ? 'firefox'
    : isWebKit()
      ? 'webkit'
      : 'chromium'
