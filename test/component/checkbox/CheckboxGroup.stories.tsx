import preview from '#.storybook/preview'
import { Checkbox, CheckboxGroup, type CheckboxSize } from '#component'
import { expect, fn } from 'storybook/test'
import { LabelStyle, LayoutStyle } from './style.css'

const meta = preview.meta({
  title: 'component/checkbox/CheckboxGroup',
  component: CheckboxGroup,
  parameters: { layout: 'centered' },
  args: { onChange: fn() },
})

export const Playground = meta.story({
  argTypes: {
    defaultValue: {
      control: 'check',
      options: ['small', 'medium', 'large'] satisfies CheckboxSize[],
    },
  },
  args: {
    name: '',
    defaultValue: ['small'],
    disabled: false,
  },
  render: (props) => (
    <CheckboxGroup
      {...props}
      key={String(props.defaultValue)}
      className={LayoutStyle}
    >
      <label className={LabelStyle}>
        <Checkbox value='small' size='small' />
        <span>Small</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox value='medium' size='medium' />
        <span>Medium</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox value='large' size='large' />
        <span>Large</span>
      </label>
    </CheckboxGroup>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const group = canvas.getByRole('group') as HTMLFieldSetElement
    const el1 = canvas.getByRole('checkbox', { name: 'Small' })
    const el2 = canvas.getByRole('checkbox', { name: 'Medium' })
    const el3 = canvas.getByRole('checkbox', { name: 'Large' })

    await step('generate unique name for the group', () => {
      expect(group.name).toEqual(expect.stringMatching(/^group-[a-z0-9]{8}$/))
      expect(el1).toHaveAttribute(
        'name',
        expect.stringMatching(/^group-[a-z0-9]{8}$/)
      )
      expect(el2).toHaveAttribute(
        'name',
        expect.stringMatching(/^group-[a-z0-9]{8}$/)
      )
      expect(el3).toHaveAttribute(
        'name',
        expect.stringMatching(/^group-[a-z0-9]{8}$/)
      )
    })

    await step('check initial state', () => {
      expect(el1).toBeChecked()
      expect(el2).not.toBeChecked()
      expect(el3).not.toBeChecked()
    })

    await step('click on the second checkbox (Medium)', () => {
      el2.focus()
      el2.click()

      expect(el2).toHaveFocus()
      expect(el1).toBeChecked()
      expect(el2).toBeChecked()
      expect(el3).not.toBeChecked()
    })

    await step('click on the third checkbox (Large)', () => {
      el3.focus()
      el3.click()

      expect(el3).toHaveFocus()
      expect(el1).toBeChecked()
      expect(el2).toBeChecked()
      expect(el3).toBeChecked()
    })

    await step('click on the first checkbox (Small)', () => {
      el1.focus()
      el1.click()

      expect(el1).toHaveFocus()
      expect(el1).not.toBeChecked()
      expect(el2).toBeChecked()
      expect(el3).toBeChecked()
    })

    await step('blur after clicking', () => {
      el1.click()
      el1.blur()

      expect(el1).not.toHaveFocus()
      expect(el1).toBeChecked()
      expect(el2).toBeChecked()
      expect(el3).toBeChecked()
    })

    expect(args.onChange).toHaveBeenCalledTimes(4)
    expect(args.onChange).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({ target: el2 }),
      ['small', 'medium']
    )
    expect(args.onChange).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({ target: el3 }),
      ['small', 'medium', 'large']
    )
    expect(args.onChange).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({ target: el1 }),
      ['medium', 'large']
    )
    expect(args.onChange).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({ target: el1 }),
      ['medium', 'large', 'small']
    )
  },
})

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
  render: (props) => (
    <CheckboxGroup defaultValue={['small']} {...props} className={LayoutStyle}>
      <label className={LabelStyle}>
        <Checkbox value='small' size='small' />
        <span>Small</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox value='medium' size='medium' />
        <span>Medium</span>
      </label>
      <label className={LabelStyle}>
        <Checkbox value='large' size='large' />
        <span>Large</span>
      </label>
    </CheckboxGroup>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    const el1 = canvas.getByRole('checkbox', { name: 'Small' })
    const el2 = canvas.getByRole('checkbox', { name: 'Medium' })
    const el3 = canvas.getByRole('checkbox', { name: 'Large' })

    await step('check initial state', () => {
      expect(el1).toBeChecked()
      expect(el2).not.toBeChecked()
      expect(el3).not.toBeChecked()
      expect(el1).toBeDisabled()
      expect(el2).toBeDisabled()
      expect(el3).toBeDisabled()
    })

    await step('click on the first checkbox (Small)', () => {
      el1.focus()
      el1.click()

      expect(el1).not.toHaveFocus()
      expect(el1).toBeChecked()
      expect(el2).not.toBeChecked()
      expect(el3).not.toBeChecked()
    })

    await step('click on the second checkbox (Medium)', () => {
      el2.focus()
      el2.click()

      expect(el2).not.toHaveFocus()
      expect(el1).toBeChecked()
      expect(el2).not.toBeChecked()
      expect(el3).not.toBeChecked()
    })

    expect(args.onChange).not.toHaveBeenCalled()
  },
})
