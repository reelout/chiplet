import preview from '#.storybook/preview'
import { Body2 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Body2',
  component: Body2,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Body2',
  args: { children: 'Body2' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByText(args.children as string)).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '14px',
      fontStyle: 'normal',
      fontWeight: '400',
      fontVariant: 'normal',
      lineHeight: '20px',
    })
  },
})
