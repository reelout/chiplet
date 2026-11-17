import { Tooltip } from '#component'
import { renderTooltip } from '#component/popover/renderTooltip'
import { expect, test } from 'vitest'

test('renderTooltip', () => {
  const button = <div role='button' tabIndex={0} />

  {
    expect(renderTooltip(null, null)).toBe(null)
    expect(renderTooltip(null, {})).toBe(null)
    expect(renderTooltip(button, null)).toBe(button)
  }

  {
    expect(renderTooltip(button, 'Tooltip')).toMatchObject({
      type: Tooltip,
      props: {
        render: 'Tooltip',
        children: button,
      },
    })
    expect(renderTooltip(button, <i>Tooltip</i>)).toMatchObject({
      type: Tooltip,
      props: {
        render: { type: 'i', props: { children: 'Tooltip' } },
        children: button,
      },
    })
  }

  {
    expect(renderTooltip(button, () => 'Tooltip')).toMatchObject({
      type: Tooltip,
      props: {
        render: expect.any(Function),
        children: button,
      },
    })
    expect(renderTooltip(button, () => <i>Tooltip</i>)).toMatchObject({
      type: Tooltip,
      props: {
        render: expect.any(Function),
        children: button,
      },
    })
  }

  {
    expect(
      renderTooltip(button, { className: 'tooltip', render: 'Tooltip' })
    ).toMatchObject({
      type: Tooltip,
      props: {
        className: 'tooltip',
        render: 'Tooltip',
        children: button,
      },
    })
    expect(
      renderTooltip(button, { className: 'tooltip', render: <i>Tooltip</i> })
    ).toMatchObject({
      type: Tooltip,
      props: {
        className: 'tooltip',
        render: { type: 'i', props: { children: 'Tooltip' } },
        children: button,
      },
    })
  }
})
