import preview from '#.storybook/preview'
import { Button } from '#component'
import { expect, fn, waitFor } from 'storybook/test'
import * as style from './style.css'

const meta = preview.meta({
  title: 'component/button/Button',
  component: Button,
  parameters: { layout: 'fullscreen' },
  args: { onClick: fn(), onKeyDown: fn(), onKeyUp: fn() },
})

export const Playground = meta.story({
  args: {
    block: false,
    disabled: false,
  },
  render: (props) => (
    <div className={style.Flex}>
      <Button {...props} color='primary'>
        Button
      </Button>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    await step('Click the button', async () => {
      await userEvent.click(canvas.getByRole('button'))
    })

    await step('Press the button with the keyboard', async () => {
      await userEvent.keyboard('{enter}')
      await userEvent.keyboard(' ')
    })

    await waitFor(async () => {
      await expect(args.onClick).toHaveBeenCalledTimes(3)
      await expect(args.onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: 'Enter' })
      )
      await expect(args.onKeyDown).toHaveBeenCalledWith(
        expect.objectContaining({ key: ' ' })
      )
    })
  },
})

export const Color = meta.story({
  render: (props) => (
    <div className={style.Base}>
      <Button {...props} color='default'>
        Default
      </Button>
      <Button {...props} color='primary'>
        Primary
      </Button>
      <Button {...props} color='success'>
        Success
      </Button>
      <Button {...props} color='warning'>
        Warning
      </Button>
      <Button {...props} color='danger'>
        Danger
      </Button>
    </div>
  ),
})

export const Variant = meta.story({
  render: (props) => (
    <div className={style.Grid}>
      <Button {...props} color='default' variant='primary'>
        Primary
      </Button>
      <Button {...props} color='default' variant='secondary'>
        Secondary
      </Button>
      <Button {...props} color='default' variant='tertiary'>
        Tertiary
      </Button>

      <Button {...props} color='primary' variant='primary'>
        Primary
      </Button>
      <Button {...props} color='primary' variant='secondary'>
        Secondary
      </Button>
      <Button {...props} color='primary' variant='tertiary'>
        Tertiary
      </Button>

      <Button {...props} color='success' variant='primary'>
        Primary
      </Button>
      <Button {...props} color='success' variant='secondary'>
        Secondary
      </Button>
      <Button {...props} color='success' variant='tertiary'>
        Tertiary
      </Button>

      <Button {...props} color='warning' variant='primary'>
        Primary
      </Button>
      <Button {...props} color='warning' variant='secondary'>
        Secondary
      </Button>
      <Button {...props} color='warning' variant='tertiary'>
        Tertiary
      </Button>

      <Button {...props} color='danger' variant='primary'>
        Primary
      </Button>
      <Button {...props} color='danger' variant='secondary'>
        Secondary
      </Button>
      <Button {...props} color='danger' variant='tertiary'>
        Tertiary
      </Button>
    </div>
  ),
})

export const Size = meta.story({
  render: (props) => (
    <div className={style.Grid}>
      <Button {...props} color='primary' variant='primary' size='small'>
        Small
      </Button>
      <Button {...props} color='primary' variant='secondary' size='small'>
        Small
      </Button>
      <Button {...props} color='primary' variant='tertiary' size='small'>
        Small
      </Button>

      <Button {...props} color='primary' variant='primary' size='medium'>
        Medium
      </Button>
      <Button {...props} color='primary' variant='secondary' size='medium'>
        Medium
      </Button>
      <Button {...props} color='primary' variant='tertiary' size='medium'>
        Medium
      </Button>

      <Button {...props} color='primary' variant='primary' size='large'>
        Large
      </Button>
      <Button {...props} color='primary' variant='secondary' size='large'>
        Large
      </Button>
      <Button {...props} color='primary' variant='tertiary' size='large'>
        Large
      </Button>
    </div>
  ),
})

export const Shape = meta.story({
  render: (props) => (
    <div className={style.Grid}>
      <Button {...props} color='primary' variant='primary' shape='rounded'>
        Rounded
      </Button>
      <Button {...props} color='primary' variant='secondary' shape='rounded'>
        Rounded
      </Button>
      <Button {...props} color='primary' variant='tertiary' shape='rounded'>
        Rounded
      </Button>

      <Button {...props} color='primary' variant='primary' shape='circular'>
        Circular
      </Button>
      <Button {...props} color='primary' variant='secondary' shape='circular'>
        Circular
      </Button>
      <Button {...props} color='primary' variant='tertiary' shape='circular'>
        Circular
      </Button>
    </div>
  ),
})

export const Block = meta.story({
  render: (props) => (
    <div className={style.Flex}>
      <Button {...props} color='primary' block={false}>
        Auto
      </Button>
      <Button {...props} color='primary' block={true}>
        Block
      </Button>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    expect(canvas.getByRole('button', { name: 'Auto' })).toHaveStyle({
      minInlineSize: '40px',
      blockSize: '32px',
    })
    expect(canvas.getByRole('button', { name: 'Block' })).toHaveStyle({
      minInlineSize: '40px',
      blockSize: '32px',
    })
  },
})

export const Disabled = meta.story({
  render: (props) => (
    <div className={style.Grid}>
      <Button {...props} color='default' variant='primary' disabled={true}>
        Primary
      </Button>
      <Button {...props} color='default' variant='secondary' disabled={true}>
        Secondary
      </Button>
      <Button {...props} color='default' variant='tertiary' disabled={true}>
        Tertiary
      </Button>

      <Button {...props} color='primary' variant='primary' disabled={true}>
        Primary
      </Button>
      <Button {...props} color='primary' variant='secondary' disabled={true}>
        Secondary
      </Button>
      <Button {...props} color='primary' variant='tertiary' disabled={true}>
        Tertiary
      </Button>

      <Button {...props} color='success' variant='primary' disabled={true}>
        Primary
      </Button>
      <Button {...props} color='success' variant='secondary' disabled={true}>
        Secondary
      </Button>
      <Button {...props} color='success' variant='tertiary' disabled={true}>
        Tertiary
      </Button>

      <Button {...props} color='warning' variant='primary' disabled={true}>
        Primary
      </Button>
      <Button {...props} color='warning' variant='secondary' disabled={true}>
        Secondary
      </Button>
      <Button {...props} color='warning' variant='tertiary' disabled={true}>
        Tertiary
      </Button>

      <Button {...props} color='danger' variant='primary' disabled={true}>
        Primary
      </Button>
      <Button {...props} color='danger' variant='secondary' disabled={true}>
        Secondary
      </Button>
      <Button {...props} color='danger' variant='tertiary' disabled={true}>
        Tertiary
      </Button>
    </div>
  ),
})
