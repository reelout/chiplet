import preview from '#.storybook/preview'
import { Heading1 } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'typography/Heading1',
  component: Heading1,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  name: 'Heading1',
  args: { children: 'Heading1' },
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByRole('heading', { level: 1 })).toHaveStyle({
      fontFamily: /sans-serif/,
      fontSize: '32px',
      fontStyle: 'normal',
      fontWeight: '600',
      fontVariant: 'normal',
      lineHeight: '40px',
    })
  },
})
