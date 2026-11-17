import type { RenderHookOptions } from '@testing-library/react'
import { createRef } from 'react'
import { renderToString } from 'react-dom/server'

export function renderHookServer<Result, Props>(
  renderCallback: (initialProps: Props | undefined) => Result,
  options: Pick<RenderHookOptions<Props>, 'initialProps'> = {}
) {
  const { initialProps } = options

  const result = createRef<Result>()

  function TestComponent({
    renderCallbackProps,
  }: {
    renderCallbackProps: Props | undefined
  }) {
    const pendingResult = renderCallback(renderCallbackProps)

    result.current = pendingResult

    return null
  }

  renderToString(<TestComponent renderCallbackProps={initialProps} />)

  return { result }
}
