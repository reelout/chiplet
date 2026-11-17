import preview from '#.storybook/preview'
import { Button } from '#component'
import { Tooltip } from '#component'
import { Position, type PositioningOptions } from '#hook'
import { useRef } from 'react'
import {
  expect,
  fireEvent,
  fn,
  waitForElementToBeRemoved,
  within,
} from 'storybook/test'

const meta = preview.meta({
  title: 'component/popover/Tooltip',
  component: Tooltip,
  parameters: { layout: 'centered' },
  args: { onToggle: fn() },
})

export const Playground = meta.story({
  argTypes: {
    positioning: {
      control: 'radio',
      options: Position,
      mapping: Object.fromEntries(
        Position.map((position) => [
          position,
          { position } satisfies PositioningOptions,
        ])
      ),
    },
  },
  args: {
    positioning: undefined,
    defaultOpen: false,
  },
  render: (props) => (
    <Tooltip
      {...props}
      key={String(props.defaultOpen)}
      render={'Focus or hover over the button to see the tooltip.'}
    >
      <Button>Button</Button>
    </Tooltip>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    expect(canvas.queryByRole('tooltip')).toBeNull()
    expect(canvas.queryByRole('tooltip', { hidden: true })).toBeInstanceOf(
      HTMLDivElement
    )

    const anchor = canvas.getByRole('button', { name: 'Button' })
    const tooltip = canvas.getByRole('tooltip', { hidden: true })

    expect(anchor).toBeInstanceOf(HTMLButtonElement)
    expect(anchor).toHaveAttribute(
      'aria-describedby',
      expect.stringMatching(/^tooltip-[a-z0-9]{8}$/)
    )
    expect(anchor.ariaDescribedByElements).toEqual([tooltip])
    expect(tooltip).toBeInstanceOf(HTMLDivElement)
    expect(tooltip).toHaveAttribute(
      'id',
      anchor.getAttribute('aria-describedby')
    )
    expect(tooltip).toHaveAttribute('role', 'tooltip')
    expect(tooltip).not.toBeVisible()

    await step('open tooltip', async () => {
      await fireEvent.focusIn(anchor)
    })

    expect(anchor.ariaDescribedByElements).toEqual([tooltip])
    expect(tooltip).toBeVisible()
    expect(tooltip).toHaveStyle({
      blockSize: '32px',
      paddingBlock: '6px',
      paddingInline: '8px',
    })

    await step('close tooltip', async () => {
      await fireEvent.focusOut(anchor)
    })

    await waitForElementToBeRemoved(() => canvas.queryByRole('tooltip'))

    expect(anchor.ariaDescribedByElements).toEqual([tooltip])
    expect(tooltip).not.toBeVisible()

    expect(args.onToggle).toHaveBeenCalledTimes(2)
    expect(args.onToggle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'focus', target: anchor }),
      true
    )
    expect(args.onToggle).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'blur', target: anchor }),
      false
    )
  },
})

export const Positioning = meta.story({
  render: function Component(props) {
    const anchorRef = useRef<HTMLButtonElement>(null)

    return (
      <>
        <button
          ref={anchorRef}
          aria-label='anchor'
          style={{
            boxSizing: 'border-box',
            inlineSize: '27.5rem',
            blockSize: '12.5rem',
            textAlign: 'center',
            background: `repeating-conic-gradient(#0000 0 25%, #8888 0 50%) 0 0 / 5rem 5rem`,
            border: 'none',
          }}
        />
        {Position.map((position, index) => (
          <Tooltip
            {...props}
            key={position}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              placeContent: 'center',
              placeItems: 'center',
              inlineSize: '7.5rem',
              blockSize: '2.5rem',
              padding: '0.75rem',
              overflow: 'visible',
              border: '0px solid #888',
            }}
            delay={0}
            positioning={{ position, anchorRef }}
            open={true}
            render={() => <div>{position}</div>}
            aria-label={position}
          />
        ))}
      </>
    )
  },
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    for (const position of Position) {
      await step(`verify ${position} positioning`, () => {
        const anchor = canvas.getByRole('button', { name: 'anchor' })
        const tooltip = canvas.getByRole('tooltip', { name: position })

        expect(anchor).toBeInstanceOf(HTMLButtonElement)
        expect(tooltip).toBeInstanceOf(HTMLDivElement)
        expect(anchor.ariaDescribedByElements).toBe(null)
      })
    }
  },
})
