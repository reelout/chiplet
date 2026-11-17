import preview from '#.storybook/preview'
import { Caption1 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Caption1',
  component: Caption1,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Caption1',
  args: { children: 'Caption1' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByText(args.children as string)).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: '600',
      fontVariant: 'normal',
      lineHeight: '20px',
    })
  },
})
