import preview from '#.storybook/preview'
import { Radio, type RadioSize } from '#component'
import { expect, fn } from 'storybook/test'
import { LabelStyle, LayoutStyle } from './style.css'

const meta = preview.meta({
  title: 'component/radio/Radio',
  component: Radio,
  parameters: { layout: 'centered' },
  args: { name: 'name', value: 'value', onChange: fn() },
})

export const Playground = meta.story({
  argTypes: {
    size: {
      control: 'radio',
      options: ['small', 'medium', 'large'] satisfies RadioSize[],
    },
  },
  args: {
    size: 'medium',
    name: 'name',
    value: 'value',
    defaultChecked: true,
    disabled: false,
  },
  render: (props) => (
    <div key={String(props.defaultChecked)} className={LayoutStyle}>
      <Radio
        {...props}
        value={`${props.value}-on`}
        defaultChecked={props.defaultChecked}
        aria-label='On'
      />
      <Radio
        {...props}
        value={`${props.value}-off`}
        defaultChecked={!props.defaultChecked}
        aria-label='Off'
      />
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const el1 = canvas.getByRole('radio', { name: 'On' })
    const el2 = canvas.getByRole('radio', { name: 'Off' })

    expect(el1).toBeInstanceOf(HTMLInputElement)
    expect(el1).toHaveAttribute('type', 'radio')
    expect(el1).toHaveRole('radio')
    expect(el1).toBeChecked()
    expect(el1).toBeEnabled()
    expect(el1).toHaveAttribute('aria-label', 'On')

    await step('focus and click', () => {
      el2.focus()
      el2.click()

      expect(el2).toHaveFocus()
      expect(el2).toBeChecked()
      expect(el1).not.toBeChecked()
    })

    await step('focus and click', () => {
      el1.focus()
      el1.click()

      expect(el1).toHaveFocus()
      expect(el1).toBeChecked()
      expect(el2).not.toBeChecked()
    })

    await step('blur after click', () => {
      el1.click()
      el1.blur()

      expect(el1).not.toHaveFocus()
      expect(el1).toBeChecked()
      expect(el2).not.toBeChecked()
    })

    expect(args.onChange).toHaveBeenCalledTimes(2)
    expect(args.onChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ target: el2 }),
      true
    )
    expect(args.onChange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ target: el1 }),
      true
    )
  },
})

export const Disabled = meta.story({
  render: (props) => (
    <div className={LayoutStyle}>
      <label className={LabelStyle}>
        <Radio
          {...props}
          name='disabled'
          value='false'
          defaultChecked={false}
          disabled={false}
        />
        <span>Enabled</span>
      </label>
      <label className={LabelStyle}>
        <Radio
          {...props}
          name='disabled'
          value='true'
          defaultChecked={true}
          disabled={true}
        />
        <span>Disabled</span>
      </label>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const el1 = canvas.getByRole('radio', { name: 'Enabled' })
    const el2 = canvas.getByRole('radio', { name: 'Disabled' })

    await step('initial state', () => {
      expect(el1).not.toBeChecked()
      expect(el2).toBeChecked()

      expect(el1).toBeEnabled()
      expect(el2).toBeDisabled()
    })

    await step('focus and click on enabled radio', () => {
      el1.focus()
      el1.click()
      expect(el1).toHaveFocus()

      el1.blur()
      expect(el1).not.toHaveFocus()
    })

    await step('focus and click on disabled radio', () => {
      el2.focus()
      el2.click()
      expect(el2).not.toHaveFocus()
    })

    await step(
      'enabled radio should remain checked, disabled radio should be unchecked',
      () => {
        expect(el1).toBeChecked()
        expect(el2).not.toBeChecked()

        expect(el1).toBeEnabled()
        expect(el2).toBeDisabled()
      }
    )

    await step('onChange should be called for enabled radio only', () => {
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
        <Radio
          {...props}
          name='size'
          value='small'
          defaultChecked={false}
          disabled={false}
          size='small'
        />
        <span>Small</span>
      </label>
      <label className={LabelStyle}>
        <Radio
          {...props}
          name='size'
          value='medium'
          defaultChecked={true}
          disabled={false}
          size='medium'
        />
        <span>Medium</span>
      </label>
      <label className={LabelStyle}>
        <Radio
          {...props}
          name='size'
          value='large'
          defaultChecked={false}
          disabled={false}
          size='large'
        />
        <span>Large</span>
      </label>
    </div>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    expect(
      canvas.getByRole('radio', { name: 'Small' }).parentElement
    ).toHaveStyle({
      inlineSize: '16px',
      blockSize: '16px',
    })
    expect(
      canvas.getByRole('radio', { name: 'Medium' }).parentElement
    ).toHaveStyle({
      inlineSize: '20px',
      blockSize: '20px',
    })
    expect(
      canvas.getByRole('radio', { name: 'Large' }).parentElement
    ).toHaveStyle({
      inlineSize: '24px',
      blockSize: '24px',
    })

    expect(canvas.getByRole('radio', { name: 'Small' })).toMatchObject({
      scrollWidth: 16 + 8 * 2,
      scrollHeight: 16 + 8 * 2,
    })
    expect(canvas.getByRole('radio', { name: 'Medium' })).toMatchObject({
      scrollWidth: 20 + 8 * 2,
      scrollHeight: 20 + 8 * 2,
    })
    expect(canvas.getByRole('radio', { name: 'Large' })).toMatchObject({
      scrollWidth: 24 + 8 * 2,
      scrollHeight: 24 + 8 * 2,
    })
  },
})
