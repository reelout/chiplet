import preview from '#.storybook/preview'
import { Heading3 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Heading3',
  component: Heading3,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Heading3',
  args: { children: 'Heading3' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByRole('heading', { level: 3 })).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '20px',
      fontStyle: 'normal',
      fontWeight: '600',
      fontVariant: 'normal',
      lineHeight: '28px',
    })
  },
})
