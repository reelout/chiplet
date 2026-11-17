import preview from '#.storybook/preview'
import { Spinner } from '#component'
import { expect } from 'storybook/test'
import { ItemStyle, LayoutStyle } from './style.css'

const meta = preview.meta({
  title: 'component/progress/Spinner',
  component: Spinner,
  parameters: { layout: 'centered' },
  args: {},
})

export const Playground = meta.story({
  args: {
    'aria-label': 'Loading',
  },
  play: async ({ args, canvas, userEvent, step }) => {
    const el = canvas.getByRole('progressbar')

    expect(el).toBeInstanceOf(HTMLDivElement)
    expect(el).toHaveAttribute('role', 'progressbar')
    expect(el).toHaveAttribute('aria-label', 'Loading')
  },
})

export const Size = meta.story({
  render: (props) => (
    <div className={LayoutStyle}>
      <div className={ItemStyle}>
        <Spinner size='small' aria-label='Small' {...props} />
        <span>Small</span>
      </div>
      <div className={ItemStyle}>
        <Spinner size='medium' aria-label='Medium' {...props} />
        <span>Medium</span>
      </div>
      <div className={ItemStyle}>
        <Spinner size='large' aria-label='Large' {...props} />
        <span>Large</span>
      </div>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByRole('progressbar', { name: 'Small' })).toHaveStyle({
      inlineSize: '16px',
      blockSize: '16px',
    })
    expect(canvas.getByRole('progressbar', { name: 'Medium' })).toHaveStyle({
      inlineSize: '20px',
      blockSize: '20px',
    })
    expect(canvas.getByRole('progressbar', { name: 'Large' })).toHaveStyle({
      inlineSize: '24px',
      blockSize: '24px',
    })
  },
})
