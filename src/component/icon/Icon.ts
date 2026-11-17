import { createElement, type ComponentProps, type ReactSVGElement } from 'react'

export interface IconProps extends ComponentProps<'svg'> {}

export const Icon = fromSVG(function SVG(props) {
  return createElement('svg', props)
})

export function fromSVG(render: (props: IconProps) => ReactSVGElement) {
  return function Icon(props: IconProps) {
    return render({
      xmlns: 'http://www.w3.org/2000/svg',
      role: 'img', // https://www.unimelb.edu.au/accessibility/techniques/accessible-svgs
      'aria-hidden': !props['aria-label'], // https://css-tricks.com/accessible-svg-icons/#aa-the-icon-is-decorative
      width: '1em',
      preserveAspectRatio: 'xMidYMid meet',
      fill: 'currentColor',
      ...props,
    })
  }
}
