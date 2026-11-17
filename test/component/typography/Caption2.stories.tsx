import preview from '#.storybook/preview'
import { Caption2 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Caption2',
  component: Caption2,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Caption2',
  args: { children: 'Caption2' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByText(args.children as string)).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: '600',
      fontVariant: 'normal',
      lineHeight: '16px',
    })
  },
})
