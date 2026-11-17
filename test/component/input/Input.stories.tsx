import preview from '#.storybook/preview'
import type { InputSize, InputVariant } from '#component'
import { Input } from '#component'
import { fn } from 'storybook/test'
import { LayoutStyle } from './style.css'

const meta = preview.meta({
  title: 'component/input/Input',
  component: Input,
  parameters: { layout: 'fullscreen' },
  args: { onChange: fn() },
})

export const Playground = meta.story({
  argTypes: {
    variant: {
      control: { type: 'radio' },
      options: ['primary', 'secondary'] satisfies InputVariant[],
    },
    size: {
      control: { type: 'radio' },
      options: ['small', 'medium', 'large'] satisfies InputSize[],
    },
  },
  args: {
    variant: 'primary',
    size: 'medium',
    name: 'name',
    placeholder: 'Placeholder',
    defaultValue: '',
    readOnly: false,
    disabled: false,
  },
  render: (props) => (
    <div key={String(props.defaultValue)} className={LayoutStyle}>
      <Input {...props} autoComplete='off' />
    </div>
  ),
})

export const Variant = meta.story({
  render: (props) => (
    <div key={String(props.defaultValue)} className={LayoutStyle}>
      <Input
        {...props}
        variant='primary'
        name='primary'
        placeholder='Primary'
        autoComplete='off'
      />
      <Input
        {...props}
        variant='secondary'
        name='secondary'
        placeholder='Secondary'
        autoComplete='off'
      />
    </div>
  ),
})

export const Size = meta.story({
  render: (props) => (
    <div key={String(props.defaultValue)} className={LayoutStyle}>
      <Input
        {...props}
        size='small'
        name='small'
        placeholder='Small'
        autoComplete='off'
      />
      <Input
        {...props}
        size='medium'
        name='medium'
        placeholder='Medium'
        autoComplete='off'
      />
      <Input
        {...props}
        size='large'
        name='large'
        placeholder='Large'
        autoComplete='off'
      />
    </div>
  ),
})

export const Disabled = meta.story({
  args: {
    disabled: true,
  },
  render: (props) => (
    <div key={String(props.defaultValue)} className={LayoutStyle}>
      <Input
        {...props}
        variant='primary'
        name='primary'
        placeholder='Primary'
        autoComplete='off'
      />
      <Input
        {...props}
        variant='secondary'
        name='secondary'
        placeholder='Secondary'
        autoComplete='off'
      />
    </div>
  ),
})
