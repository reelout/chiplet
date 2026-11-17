import preview from '#.storybook/preview'
import { Button, Separator } from '#component'
import { DismissButton, Popover } from '#component'
import { Position, type PositioningOptions } from '#hook'
import { useRef } from 'react'
import { expect, fn, within } from 'storybook/test'

const meta = preview.meta({
  title: 'component/popover/Popover',
  component: Popover<'div'>,
  parameters: { layout: 'centered' },
  args: { onToggle: fn() },
})

export const Playground = meta.story({
  argTypes: {
    positioning: {
      control: 'radio',
      options: Position,
      mapping: Object.fromEntries(
        Position.map((position) => [
          position,
          { position } satisfies PositioningOptions,
        ])
      ),
    },
  },
  args: {
    positioning: undefined,
    defaultOpen: false,
  },
  render: (props) => (
    <Popover
      {...props}
      key={String(props.defaultOpen)}
      style={{ inlineSize: '15rem', padding: '1rem' }}
      anchor={<Button>Open #0 Popover</Button>}
      aria-label='Popover #0'
    >
      <div
        style={{
          display: 'flex',
          gap: undefined,
          placeContent: 'space-between',
          placeItems: 'center',
        }}
      >
        <h1 style={{ marginBlock: '1em' }}>#0 Popover</h1>
        <DismissButton aria-label='Close #0' />
      </div>
      <div>
        Nam ut tellus at mi dapibus placerat. Proin sed tellus finibus nunc
        congue viverra eu eu tortor.
      </div>

      <Separator style={{ marginBlock: '1rem' }} />

      <Popover
        style={{ padding: '1rem' }}
        anchor={<Button>Open #1 Popover</Button>}
        aria-label='Popover #1'
      >
        <DismissButton aria-label='Close #1' />
        <h1 style={{ marginBlock: '1em' }}>#1 Popover</h1>
        <div>
          Proin sodales sem odio, in congue lorem laoreet ut. Sed maximus dictum
          rhoncus. Cras maximus pulvinar nunc, nec aliquet odio ornare tempor.
          Curabitur venenatis iaculis nunc, in aliquam odio. Praesent diam
          purus, tincidunt id vehicula vel, pharetra a tellus. Sed tempus dolor
          id odio consectetur ornare. Aenean facilisis, ipsum eget molestie
          fringilla, urna est porta tellus, sit amet tempus mauris enim et elit.
          Donec viverra interdum tempus. Vestibulum ultrices lectus ut mi
          porttitor varius. Nullam efficitur enim ut tellus tincidunt, vitae
          interdum metus convallis. Mauris fermentum aliquam urna, a scelerisque
          quam porttitor eu. Proin bibendum pharetra tincidunt. Nullam eget
          velit id sapien porttitor placerat. Suspendisse sed arcu mollis,
          sollicitudin sapien non, ornare mauris. Phasellus malesuada risus
          arcu, id lacinia arcu convallis quis. Vestibulum sit amet eros
          elementum, venenatis nibh in, vestibulum felis. Curabitur in tempor
          mauris. Vivamus a consectetur neque, ac commodo tortor. Sed hendrerit
          sollicitudin hendrerit. Integer ut mauris vitae tellus gravida congue.
          Cras lobortis tortor eu pellentesque sollicitudin. Nam ut euismod
          nisl, id ornare massa.
        </div>

        <Separator style={{ marginBlock: '1rem' }} />

        <Popover
          style={{ padding: '1rem' }}
          anchor={<Button>Open #2 Popover</Button>}
          aria-label='Popover #2'
        >
          <DismissButton aria-label='Close #2' />
          <h1 style={{ marginBlock: '1em' }}>#2 Popover</h1>
          <div>
            Phasellus at arcu vestibulum, venenatis dui non, rhoncus erat. Ut
            vitae quam porttitor, rhoncus ante non, pulvinar mauris. Nulla ut
            eleifend massa. Vivamus metus tortor, blandit a odio eget, fermentum
            tempor justo. In volutpat a ante in faucibus. Praesent at dui quis
            sem tincidunt fermentum nec nec urna. Phasellus sit amet
          </div>

          <Separator style={{ marginBlock: '1rem' }} />

          <Popover
            style={{ padding: '1rem' }}
            anchor={<Button>Open #3 Popover</Button>}
            aria-label='Popover #3'
          >
            <DismissButton aria-label='Close #3' />
            <h1 style={{ marginBlock: '1em' }}>#3 Popover</h1>
            <div>
              Quisque congue nulla pretium enim ultrices dictum. Maecenas
              convallis, arcu tincidunt lobortis congue, orci nulla consequat
              sem, a efficitur nunc ante ut odio. Fusce nec magna nibh.
              Curabitur laoreet justo eu mauris pellentesque porttitor. Morbi
              leo elit, dictum ac porta ut, bibendum ac sapien. Fusce hendrerit,
              tortor nec mattis lobortis, dolor metus imperdiet nisi, ut porta
              sapien dolor sit amet sem. Praesent id felis justo. In hac
              habitasse platea dictumst. Morbi sit amet hendrerit mauris, vel
              porttitor risus. Praesent laoreet, nibh non ultrices dictum, diam
              sem eleifend ipsum, nec dignissim justo orci tincidunt enim.
              Maecenas vehicula mi eu molestie lacinia. Nulla efficitur ac quam
              eu commodo. Donec in nunc convallis, blandit eros sed, malesuada
              nulla. Vivamus nibh urna, viverra nec diam nec, pharetra pretium
              neque. Aenean tempus posuere nulla, quis molestie purus gravida
              non. Donec quam lorem, dapibus sed porttitor in, euismod a felis.
              Suspendisse nisl lacus, vulputate vitae magna vitae, ornare
              hendrerit nulla. Proin dapibus lacinia nunc sed elementum. Ut
              malesuada cursus mauris sed semper. Nunc nec bibendum enim. Fusce
              ut consectetur purus. Aliquam congue tortor at augue laoreet, sed
              sollicitudin ex bibendum.
            </div>
          </Popover>
        </Popover>
      </Popover>
    </Popover>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    const anchor0 = canvas.getByRole('button', { name: 'Open #0 Popover' })

    expect(anchor0).toBeInstanceOf(HTMLButtonElement)
    expect(anchor0).not.toHaveAttribute('aria-controls')
    expect(anchor0).toHaveAttribute('aria-expanded', 'false')
    expect(anchor0).toHaveAttribute('aria-haspopup', 'true')

    expect(canvas.queryByRole('dialog', { name: 'Popover #0' })).toBeNull()
    expect(canvas.queryByRole('button', { name: 'Close #0' })).toBeNull()

    await step('open #0 popover', () => {
      anchor0.focus()
      anchor0.click()
    })

    const popover0 = canvas.getByRole('dialog', { name: 'Popover #0' })
    const dismiss0 = canvas.getByRole('button', { name: 'Close #0' })

    expect(popover0).toBeInstanceOf(HTMLDivElement)
    expect(popover0).toHaveAttribute(
      'id',
      anchor0.getAttribute('aria-controls')
    )
    expect(popover0).toHaveAttribute('popover', 'manual')
    expect(popover0).toHaveAttribute('role', 'dialog')
    expect(popover0).toHaveAttribute('aria-modal', 'false')
    expect(popover0).not.toHaveAttribute('tabIndex')
    expect(anchor0).toHaveAttribute(
      'aria-controls',
      expect.stringMatching(/^popover-[a-z0-9]{8}$/)
    )
    expect(anchor0).toHaveAttribute('aria-expanded', 'true')
    expect(anchor0.ariaControlsElements).toEqual([popover0])

    const anchor1 = canvas.getByRole('button', { name: 'Open #1 Popover' })

    expect(anchor1).toBeInstanceOf(HTMLButtonElement)
    expect(anchor1).not.toHaveAttribute('aria-controls')
    expect(anchor1).toHaveAttribute('aria-expanded', 'false')
    expect(anchor1).toHaveAttribute('aria-haspopup', 'true')

    expect(canvas.queryByRole('dialog', { name: 'Popover #1' })).toBeNull()
    expect(canvas.queryByRole('button', { name: 'Close #1' })).toBeNull()

    await step('open #1 popover', () => {
      anchor1.focus()
      anchor1.click()
    })

    const popover1 = canvas.getByRole('dialog', { name: 'Popover #1' })
    const dismiss1 = canvas.getByRole('button', { name: 'Close #1' })

    expect(popover1).toBeInstanceOf(HTMLDivElement)
    expect(popover1).toHaveAttribute(
      'id',
      anchor1.getAttribute('aria-controls')
    )
    expect(popover1).toHaveAttribute('popover', 'manual')
    expect(popover1).toHaveAttribute('role', 'dialog')
    expect(popover1).toHaveAttribute('aria-modal', 'false')
    expect(popover1).not.toHaveAttribute('tabIndex')
    expect(anchor1).toHaveAttribute(
      'aria-controls',
      expect.stringMatching(/^popover-[a-z0-9]{8}$/)
    )
    expect(anchor1).toHaveAttribute('aria-expanded', 'true')
    expect(anchor1.ariaControlsElements).toEqual([popover1])

    await step('close #1 popover', () => {
      dismiss1.focus()
      dismiss1.click()
    })

    expect(popover1).not.toBeInTheDocument()
    expect(dismiss1).not.toBeInTheDocument()
    expect(anchor1).toHaveFocus()
    expect(anchor1).toHaveAttribute('aria-expanded', 'false')
    expect(anchor1.ariaControlsElements).toBe(null)

    await step('toggle #0 popover', () => {
      anchor0.focus()
      anchor0.click()
    })

    expect(popover0).not.toBeInTheDocument()
    expect(dismiss0).not.toBeInTheDocument()
    expect(anchor0).toHaveFocus()
    expect(anchor0).toHaveAttribute('aria-expanded', 'false')
    expect(anchor1.ariaControlsElements).toBe(null)

    expect(args.onToggle).toHaveBeenCalledTimes(2)
    expect(args.onToggle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ type: 'click', target: anchor0 }),
      true,
      'anchor'
    )
    expect(args.onToggle).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ type: 'click', target: anchor0 }),
      false,
      'anchor'
    )
  },
})

export const Positioning = meta.story({
  render: function Component(props) {
    const anchorRef = useRef<HTMLButtonElement>(null)

    return (
      <>
        <button
          ref={anchorRef}
          aria-label='anchor'
          style={{
            boxSizing: 'border-box',
            inlineSize: '27.5rem',
            blockSize: '12.5rem',
            textAlign: 'center',
            background: `repeating-conic-gradient(#0000 0 25%, #8888 0 50%) 0 0 / 5rem 5rem`,
            border: 'none',
          }}
        />
        {Position.map((position, index) => (
          <Popover
            {...props}
            key={position}
            style={{
              boxSizing: 'border-box',
              display: 'flex',
              placeContent: 'center',
              placeItems: 'center',
              inlineSize: '7.5rem',
              blockSize: '2.5rem',
              padding: '0.75rem',
              overflow: 'visible',
              border: '1px solid #888',
            }}
            anchor={null}
            positioning={{ position, anchorRef }}
            open={true}
            aria-label={position}
          >
            <div>{position}</div>
          </Popover>
        ))}
      </>
    )
  },
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    for (const position of Position) {
      await step(`verify ${position} positioning`, () => {
        const anchor = canvas.getByRole('button', { name: 'anchor' })
        const popover = canvas.getByRole('dialog', { name: position })

        expect(anchor).toBeInstanceOf(HTMLButtonElement)
        expect(popover).toBeInstanceOf(HTMLDivElement)
        expect(anchor).not.toHaveAttribute('aria-expanded')
        expect(anchor.ariaControlsElements).toBe(null)
      })
    }
  },
})
