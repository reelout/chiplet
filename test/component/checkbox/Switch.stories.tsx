import preview from '#.storybook/preview'
import { Switch, type SwitchSize } from '#component'
import { expect, fn } from 'storybook/test'
import { LabelStyle, LayoutStyle } from './style.css'

const meta = preview.meta({
  title: 'component/switch/Switch',
  component: Switch,
  parameters: { layout: 'centered' },
  args: { onChange: fn() },
})

export const Playground = meta.story({
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'] satisfies SwitchSize[],
    },
  },
  args: {
    size: 'medium',
    defaultChecked: true,
    disabled: false,
  },
  render: (props) => (
    <Switch {...props} key={String(props.defaultChecked)} aria-label='Switch' />
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const el = canvas.getByRole('switch')

    expect(el).toBeInstanceOf(HTMLInputElement)
    expect(el).toHaveAttribute('type', 'checkbox')
    expect(el).toHaveRole('switch')
    expect(el).toBeChecked()
    expect(el).toBeEnabled()
    expect(el).toHaveAttribute('aria-label', 'Switch')

    await step('focus and click', () => {
      el.focus()
      el.click()

      expect(el).toHaveFocus()
      expect(el).not.toBeChecked()
    })

    await step('blur after click', () => {
      el.click()
      el.blur()

      expect(el).not.toHaveFocus()
      expect(el).toBeChecked()
    })

    expect(args.onChange).toHaveBeenCalledTimes(2)
    expect(args.onChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ target: el }),
      false
    )
    expect(args.onChange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ target: el }),
      true
    )
  },
})

export const Disabled = meta.story({
  render: (props) => (
    <div className={LayoutStyle}>
      <label className={LabelStyle}>
        <Switch defaultChecked={false} disabled={false} {...props} />
        <span>Enabled</span>
      </label>
      <label className={LabelStyle}>
        <Switch defaultChecked={false} disabled={true} {...props} />
        <span>Disabled</span>
      </label>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const el1 = canvas.getByRole('switch', { name: 'Enabled' })
    const el2 = canvas.getByRole('switch', { name: 'Disabled' })

    await step('initial state', () => {
      expect(el1).not.toBeChecked()
      expect(el2).not.toBeChecked()

      expect(el1).toBeEnabled()
      expect(el2).toBeDisabled()
    })

    await step('focus and click on enabled switch', () => {
      el1.focus()
      el1.click()
      expect(el1).toHaveFocus()

      el1.blur()
      expect(el1).not.toHaveFocus()
    })

    await step('focus and click on disabled switch', () => {
      el2.focus()
      el2.click()
      expect(el2).not.toHaveFocus()
    })

    await step(
      'enabled switch should be checked, disabled switch should remain unchecked',
      () => {
        expect(el1).toBeChecked()
        expect(el2).not.toBeChecked()

        expect(el1).toBeEnabled()
        expect(el2).toBeDisabled()
      }
    )

    await step('onChange should be called for enabled switch only', () => {
      expect(args.onChange).toHaveBeenCalledTimes(1)
      expect(args.onChange).toHaveBeenCalledWith(
        expect.objectContaining({ target: el1 }),
        true
      )
    })
  },
})

export const Size = meta.story({
  render: (props) => (
    <div className={LayoutStyle}>
      <label className={LabelStyle}>
        <Switch defaultChecked={true} size='small' {...props} />
        <span>Small</span>
      </label>
      <label className={LabelStyle}>
        <Switch defaultChecked={true} size='medium' {...props} />
        <span>Medium</span>
      </label>
      <label className={LabelStyle}>
        <Switch defaultChecked={true} size='large' {...props} />
        <span>Large</span>
      </label>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    expect(
      canvas.getByRole('switch', { name: 'Small' }).parentElement
    ).toHaveStyle({
      inlineSize: '28px',
      blockSize: '16px',
    })
    expect(
      canvas.getByRole('switch', { name: 'Medium' }).parentElement
    ).toHaveStyle({
      inlineSize: '32px',
      blockSize: '20px',
    })
    expect(
      canvas.getByRole('switch', { name: 'Large' }).parentElement
    ).toHaveStyle({
      inlineSize: '40px',
      blockSize: '24px',
    })

    expect(canvas.getByRole('switch', { name: 'Small' })).toMatchObject({
      scrollWidth: 28 + 8 * 2,
      scrollHeight: 16 + 8 * 2,
    })
    expect(canvas.getByRole('switch', { name: 'Medium' })).toMatchObject({
      scrollWidth: 32 + 8 * 2,
      scrollHeight: 20 + 8 * 2,
    })
    expect(canvas.getByRole('switch', { name: 'Large' })).toMatchObject({
      scrollWidth: 40 + 8 * 2,
      scrollHeight: 24 + 8 * 2,
    })
  },
})
