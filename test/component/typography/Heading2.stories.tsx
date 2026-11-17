import preview from '#.storybook/preview'
import { Heading2 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Heading2',
  component: Heading2,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Heading2',
  args: { children: 'Heading2' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByRole('heading', { level: 2 })).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '24px',
      fontStyle: 'normal',
      fontWeight: '600',
      fontVariant: 'normal',
      lineHeight: '32px',
    })
  },
})
