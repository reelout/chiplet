import preview from '#.storybook/preview'
import { Dismiss24Regular, Tooltip } from '#component'
import { IconButton } from '#component'
import { expect } from 'storybook/test'
import { Base, Grid } from './style.css'

const meta = preview.meta({
  title: 'component/button/IconButton',
  component: IconButton,
  parameters: { layout: 'fullscreen' },
  args: {},
})

export const Playground = meta.story({
  args: {
    disabled: false,
  },
  render: (props) => (
    <div className={Base}>
      <IconButton {...props}>
        <Dismiss24Regular aria-label='Close' />
      </IconButton>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByRole('button')).toHaveStyle({
      inlineSize: '32px',
      blockSize: '32px',
    })
  },
})

export const Variant = meta.story({
  render: (props) => (
    <div className={Grid}>
      <Tooltip render='color=default variant=primary'>
        <IconButton {...props} color='default' variant='primary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=default variant=secondary'>
        <IconButton {...props} color='default' variant='secondary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=default variant=tertiary'>
        <IconButton {...props} color='default' variant='tertiary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>

      <Tooltip render='color=primary variant=primary'>
        <IconButton {...props} color='primary' variant='primary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=primary variant=secondary'>
        <IconButton {...props} color='primary' variant='secondary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=primary variant=tertiary'>
        <IconButton {...props} color='primary' variant='tertiary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>

      <Tooltip render='color=success variant=primary'>
        <IconButton {...props} color='success' variant='primary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=success variant=secondary'>
        <IconButton {...props} color='success' variant='secondary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=success variant=tertiary'>
        <IconButton {...props} color='success' variant='tertiary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>

      <Tooltip render='color=warning variant=primary'>
        <IconButton {...props} color='warning' variant='primary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=warning variant=secondary'>
        <IconButton {...props} color='warning' variant='secondary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=warning variant=tertiary'>
        <IconButton {...props} color='warning' variant='tertiary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>

      <Tooltip render='color=danger variant=primary'>
        <IconButton {...props} color='danger' variant='primary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=danger variant=secondary'>
        <IconButton {...props} color='danger' variant='secondary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
      <Tooltip render='color=danger variant=tertiary'>
        <IconButton {...props} color='danger' variant='tertiary'>
          <Dismiss24Regular aria-label='Close' />
        </IconButton>
      </Tooltip>
    </div>
  ),
})
