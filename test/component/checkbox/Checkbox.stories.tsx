import preview from '#.storybook/preview'
import type { CheckboxSize } from '#component'
import { Checkbox } from '#component'
import { expect, fn } from 'storybook/test'
import { LabelStyle, LayoutStyle } from './style.css'

const meta = preview.meta({
  title: 'component/checkbox/Checkbox',
  component: Checkbox,
  parameters: { layout: 'centered' },
  args: { name: 'name', value: 'value', onChange: fn() },
})

export const Playground = meta.story({
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'] satisfies CheckboxSize[],
    },
  },
  args: {
    size: 'medium',
    defaultChecked: true,
    indeterminate: false,
    disabled: false,
  },
  render: (props) => (
    <Checkbox
      {...props}
      key={String(props.defaultChecked)}
      aria-label='Checkbox'
    />
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const el = canvas.getByRole('checkbox')

    expect(el).toBeInstanceOf(HTMLInputElement)
    expect(el).toHaveAttribute('type', 'checkbox')
    expect(el).toHaveRole('checkbox')
    expect(el).toBeChecked()
    expect(el).toBeEnabled()
    expect(el).toHaveAttribute('aria-label', 'Checkbox')

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

export const Indeterminate = meta.story({
  render: (props) => (
    <div className={LayoutStyle}>
      <label className={LabelStyle}>
        <Checkbox {...props} defaultChecked={true} indeterminate={false} />
        <span>Checked</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox {...props} defaultChecked={false} indeterminate={true} />
        <span>Indeterminate</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox {...props} defaultChecked={false} indeterminate={false} />
        <span>Unchecked</span>
      </label>
    </div>
  ),
})

export const Disabled = meta.story({
  render: (props) => (
    <div className={LayoutStyle}>
      <label className={LabelStyle}>
        <Checkbox defaultChecked={false} disabled={false} {...props} />
        <span>Enabled</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox defaultChecked={false} disabled={true} {...props} />
        <span>Disabled</span>
      </label>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const el1 = canvas.getByRole('checkbox', { name: 'Enabled' })
    const el2 = canvas.getByRole('checkbox', { name: 'Disabled' })

    await step('initial state', () => {
      expect(el1).not.toBeChecked()
      expect(el2).not.toBeChecked()

      expect(el1).toBeEnabled()
      expect(el2).toBeDisabled()
    })

    await step('focus and click on enabled checkbox', () => {
      el1.focus()
      el1.click()
      expect(el1).toHaveFocus()

      el1.blur()
      expect(el1).not.toHaveFocus()
    })

    await step('focus and click on disabled checkbox', () => {
      el2.focus()
      el2.click()
      expect(el2).not.toHaveFocus()
    })

    await step(
      'enabled checkbox should be checked, disabled checkbox should remain unchecked',
      () => {
        expect(el1).toBeChecked()
        expect(el2).not.toBeChecked()

        expect(el1).toBeEnabled()
        expect(el2).toBeDisabled()
      }
    )

    await step('onChange should be called for enabled checkbox only', () => {
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
        <Checkbox defaultChecked={true} size='small' {...props} />
        <span>Small</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox defaultChecked={true} size='medium' {...props} />
        <span>Medium</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox defaultChecked={true} size='large' {...props} />
        <span>Large</span>
      </label>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    expect(
      canvas.getByRole('checkbox', { name: 'Small' }).parentElement
    ).toHaveStyle({
      inlineSize: '16px',
      blockSize: '16px',
    })
    expect(
      canvas.getByRole('checkbox', { name: 'Medium' }).parentElement
    ).toHaveStyle({
      inlineSize: '20px',
      blockSize: '20px',
    })
    expect(
      canvas.getByRole('checkbox', { name: 'Large' }).parentElement
    ).toHaveStyle({
      inlineSize: '24px',
      blockSize: '24px',
    })

    expect(canvas.getByRole('checkbox', { name: 'Small' })).toMatchObject({
      scrollWidth: 16 + 8 * 2,
      scrollHeight: 16 + 8 * 2,
    })
    expect(canvas.getByRole('checkbox', { name: 'Medium' })).toMatchObject({
      scrollWidth: 20 + 8 * 2,
      scrollHeight: 20 + 8 * 2,
    })
    expect(canvas.getByRole('checkbox', { name: 'Large' })).toMatchObject({
      scrollWidth: 24 + 8 * 2,
      scrollHeight: 24 + 8 * 2,
    })
  },
})
