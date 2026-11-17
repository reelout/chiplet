import preview from '#.storybook/preview'
import { Heading4 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Heading4',
  component: Heading4,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Heading4',
  args: { children: 'Heading4' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByRole('heading', { level: 4 })).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '16px',
      fontStyle: 'normal',
      fontWeight: '600',
      fontVariant: 'normal',
      lineHeight: '24px',
    })
  },
})
