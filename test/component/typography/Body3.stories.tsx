import preview from '#.storybook/preview'
import { Body3 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Body3',
  component: Body3,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Body3',
  args: { children: 'Body3' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByText(args.children as string)).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: '400',
      fontVariant: 'normal',
      lineHeight: '16px',
    })
  },
})
