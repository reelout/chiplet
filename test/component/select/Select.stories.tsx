import preview from '#.storybook/preview'
import { Select } from '#component'
import { fn } from 'storybook/test'

const meta = preview.meta({
  title: 'component/select/Select',
  component: Select,
  args: { onChange: fn() },
})

export const Playground = meta.story({
  args: {
    multiple: false,
    disabled: false,
    defaultOpen: false,
  },
  render: (props) => (
    <Select
      {...props}
      key={`${props.multiple}|${props.defaultOpen}`}
      lang='zh'
      title='Select'
      placeholder='Select'
      options={[
        { value: 'apple', label: '苹果', key: 'apple' },
        { value: 'banana', label: '香蕉', key: 0 },
        { value: 'blueberry', label: '蓝莓', key: 1n },
        { value: 'grape', label: '葡萄', key: null },
        { value: 'mango', label: '芒果', key: undefined },
        { value: 'orange', label: '橙子' },
        { value: 'peach', label: '桃子' },
        { value: 'pineapple', label: '菠萝', disabled: true },
        { value: 'strawberry', label: '草莓' },
        { value: 'watermelon', label: '西瓜' },
      ]}
    />
  ),
})
