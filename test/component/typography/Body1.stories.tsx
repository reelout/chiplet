import preview from '#.storybook/preview'
import { Body1 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Body1',
  component: Body1,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Body1',
  args: { children: 'Body1' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByText(args.children as string)).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '400',
      fontVariant: 'normal',
      lineHeight: '24px',
    })
  },
})
