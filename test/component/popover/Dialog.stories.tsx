import preview from '#.storybook/preview'
import {
  Button,
  Dialog,
  DismissButton,
  Heading1,
  type DialogSize,
} from '#component'
import { browser } from '#test'
import { expect, fn, within } from 'storybook/test'

const meta = preview.meta({
  title: 'component/popover/Dialog',
  component: Dialog,
  args: { onToggle: fn() },
})

export const Playground = meta.story({
  argTypes: {
    size: {
      control: 'radio',
      options: [
        'auto',
        'small',
        'medium',
        'large',
        'stretch',
      ] satisfies DialogSize[],
    },
  },
  args: {
    size: 'auto',
    defaultOpen: false,
  },
  render: (props) => {
    return (
      <Dialog
        {...props}
        key={String(props.defaultOpen)}
        anchor={<Button>Open Dialog</Button>}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          maxInlineSize: 'min(80%, 40rem)',
          padding: '1.25rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 'inherit',
            placeContent: 'space-between',
            placeItems: 'center',
          }}
        >
          <Heading1>Dialog</Heading1>
          <DismissButton aria-label='Close' />
        </div>

        <div>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam id arcu
          tellus. Nunc nisl odio, dapibus vel arcu quis, efficitur vehicula
          ipsum. Nullam nunc turpis, euismod ac nulla sit amet, feugiat posuere
          dolor. Donec venenatis luctus massa, aliquam ultrices ex accumsan
          quis. Fusce semper ac erat non iaculis. Vivamus fermentum sapien
          magna, ac ornare elit bibendum vitae. Curabitur et ipsum iaculis,
          luctus elit eget, feugiat dolor. Nunc sit amet ligula tempus, cursus
          magna sit amet, elementum elit. Pellentesque eu orci vel eros molestie
          fermentum eu ut ligula.
        </div>
      </Dialog>
    )
  },
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    const anchor = canvas.getByRole('button', { name: 'Open Dialog' })

    expect(anchor).toBeInstanceOf(HTMLButtonElement)
    expect(anchor).not.toHaveAttribute('aria-controls')
    expect(anchor).toHaveAttribute('aria-expanded', 'false')
    expect(anchor).toHaveAttribute('aria-haspopup', 'true')

    expect(canvas.queryByRole('dialog')).toBeNull()
    expect(canvas.queryByRole('button', { name: 'Close' })).toBeNull()

    await step('open', async () => {
      anchor.focus()
      anchor.click()
    })

    const dialog = canvas.getByRole('dialog')
    const dismiss = canvas.getByRole('button', { name: 'Close' })

    expect(dialog).toBeInstanceOf(HTMLDialogElement)
    expect(dialog).toHaveAttribute('id', anchor.getAttribute('aria-controls'))
    expect(dialog).toHaveAttribute('tabIndex', '-1')
    expect(dismiss).toBeInstanceOf(HTMLButtonElement)
    expect(dismiss).toHaveAttribute('aria-label', 'Close')
    expect(anchor).toHaveAttribute(
      'aria-controls',
      expect.stringMatching(/^dialog-[a-z0-9]{8}$/)
    )
    expect(anchor).toHaveAttribute('aria-expanded', 'true')
    expect(anchor.ariaControlsElements).toEqual([dialog])
    expect(args.onToggle).toHaveBeenCalledTimes(1)
    expect(args.onToggle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'click', target: anchor }),
      true,
      'anchor'
    )

    await step('close', () => {
      dismiss.focus()
      dismiss.click()
    })

    expect(dialog).not.toBeInTheDocument()
    expect(dismiss).not.toBeInTheDocument()
    expect(anchor).toHaveFocus()
    expect(anchor).toHaveAttribute('aria-expanded', 'false')
    expect(anchor.ariaControlsElements).toBe(null)
    expect(args.onToggle).toHaveBeenCalledTimes(2)
    expect(args.onToggle).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'click', target: dismiss }),
      false,
      'close'
    )
  },
})

export const Size = meta.story({
  render: (props) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
        placeItems: 'start',
      }}
    >
      <Dialog
        {...props}
        size='auto'
        anchor={<Button>Auto (default)</Button>}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          placeItems: 'center',
          padding: '1.25rem',
        }}
      >
        <Heading1 style={{ textAlign: 'center' }}>Auto size dialog</Heading1>
        <DismissButton aria-label='Close' />
      </Dialog>

      <Dialog
        {...props}
        size='small'
        anchor={<Button>Small</Button>}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          placeItems: 'center',
          padding: '1.25rem',
        }}
      >
        <Heading1 style={{ textAlign: 'center' }}>Small size dialog</Heading1>
        <DismissButton aria-label='Close' />
      </Dialog>

      <Dialog
        {...props}
        size='medium'
        anchor={<Button>Medium</Button>}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          placeItems: 'center',
          padding: '1.25rem',
        }}
      >
        <Heading1 style={{ textAlign: 'center' }}>Medium size dialog</Heading1>
        <DismissButton aria-label='Close' />
      </Dialog>

      <Dialog
        {...props}
        size='large'
        anchor={<Button>Large</Button>}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          placeItems: 'center',
          padding: '1.25rem',
        }}
      >
        <Heading1 style={{ textAlign: 'center' }}>Large size dialog</Heading1>
        <DismissButton aria-label='Close' />
      </Dialog>

      <Dialog
        {...props}
        size='stretch'
        anchor={<Button>Stretch</Button>}
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          placeItems: 'center',
          padding: '1.25rem',
        }}
      >
        <Heading1 style={{ textAlign: 'center' }}>Stretch size dialog</Heading1>
        <DismissButton aria-label='Close' />
      </Dialog>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    const anchor1 = canvas.getByRole('button', { name: 'Auto (default)' })
    const anchor2 = canvas.getByRole('button', { name: 'Small' })
    const anchor3 = canvas.getByRole('button', { name: 'Medium' })
    const anchor4 = canvas.getByRole('button', { name: 'Large' })
    const anchor5 = canvas.getByRole('button', { name: 'Stretch' })

    expect(canvas.queryByRole('dialog')).toBeNull()

    {
      await step('open auto dialog', () => {
        anchor1.focus()
        anchor1.click()
      })

      const dialog = canvas.getByRole('dialog')

      expect(
        dialog.computedStyleMap?.().get('inline-size')?.toString()
      ).toBeOneOf(['fit-content', undefined])

      expect(dialog).toHaveStyle({
        inset: '0',
        maxInlineSize: 'calc(100% - 96px)',
        maxBlockSize: 'calc(100% - 96px)',
      })

      await step('close', () => {
        const dismiss = canvas.getByRole('button', { name: 'Close' })
        dismiss.focus()
        dismiss.click()
      })
    }

    {
      await step('open small dialog', () => {
        anchor2.focus()
        anchor2.click()
      })

      const dialog = canvas.getByRole('dialog')

      expect(
        dialog.computedStyleMap?.().get('inline-size')?.toString()
      ).toBeOneOf(['240px', undefined])

      expect(dialog).toHaveStyle({
        inset: '0',
        maxInlineSize: 'calc(100% - 96px)',
        maxBlockSize: 'calc(100% - 96px)',
      })

      await step('close', () => {
        const dismiss = canvas.getByRole('button', { name: 'Close' })
        dismiss.focus()
        dismiss.click()
      })
    }

    {
      await step('open medium dialog', () => {
        anchor3.focus()
        anchor3.click()
      })

      const dialog = canvas.getByRole('dialog')

      expect(
        dialog.computedStyleMap?.().get('inline-size')?.toString()
      ).toBeOneOf(['480px', undefined])

      expect(dialog).toHaveStyle({
        inset: '0',
        maxInlineSize: 'calc(100% - 96px)',
        maxBlockSize: 'calc(100% - 96px)',
      })

      await step('close', () => {
        const dismiss = canvas.getByRole('button', { name: 'Close' })
        dismiss.focus()
        dismiss.click()
      })
    }

    {
      await step('open large dialog', () => {
        anchor4.focus()
        anchor4.click()
      })

      const dialog = canvas.getByRole('dialog')

      expect(
        dialog.computedStyleMap?.().get('inline-size')?.toString()
      ).toBeOneOf(['720px', undefined])

      expect(dialog).toHaveStyle({
        inset: '0',
        maxInlineSize: 'calc(100% - 96px)',
        maxBlockSize: 'calc(100% - 96px)',
      })

      await step('close', () => {
        const dismiss = canvas.getByRole('button', { name: 'Close' })
        dismiss.focus()
        dismiss.click()
      })
    }

    {
      await step('open stretch dialog', () => {
        anchor5.focus()
        anchor5.click()
      })

      const dialog = canvas.getByRole('dialog')

      expect(CSS.supports('inline-size', '-webkit-fill-available')).toBe(true)
      expect(dialog).toHaveStyle({
        inlineSize: `${window.innerWidth - 48 * 2}px`,
      })
      expect(dialog.computedStyleMap?.().get('inline-size')?.toString()).toBe(
        {
          chromium: 'stretch',
          firefox: undefined,
          webkit: 'stretch',
        }[browser()]
      )

      expect(dialog).toHaveStyle({
        inset: '0',
        maxInlineSize: 'calc(100% - 96px)',
        maxBlockSize: 'calc(100% - 96px)',
      })

      await step('close', () => {
        const dismiss = canvas.getByRole('button', { name: 'Close' })
        dismiss.focus()
        dismiss.click()
      })
    }
  },
})
