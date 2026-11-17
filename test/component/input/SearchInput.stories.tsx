import preview from '#.storybook/preview'
import type { InputSize, InputVariant } from '#component'
import { SearchInput } from '#component'
import { fn } from 'storybook/test'
import { LayoutStyle } from './style.css'

const meta = preview.meta({
  title: 'component/input/SearchInput',
  component: SearchInput,
  parameters: { layout: 'fullscreen' },
  args: { onChange: fn(), onSearch: fn() },
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
    placeholder: 'Search',
    defaultValue: '',
    value: undefined,
    readOnly: false,
    disabled: false,
  },
  render: (props) => (
    <div key={String(props.defaultValue)} className={LayoutStyle}>
      <SearchInput {...props} autoComplete='off' />
    </div>
  ),
})

export const Size = meta.story({
  render: (props) => (
    <div key={String(props.defaultValue)} className={LayoutStyle}>
      <SearchInput
        {...props}
        size='small'
        name='small'
        placeholder='Small'
        autoComplete='off'
      />
      <SearchInput
        {...props}
        size='medium'
        name='medium'
        placeholder='Medium'
        autoComplete='off'
      />
      <SearchInput
        {...props}
        size='large'
        name='large'
        placeholder='Large'
        autoComplete='off'
      />
    </div>
  ),
})
