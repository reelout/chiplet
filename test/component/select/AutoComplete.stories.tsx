import preview from '#.storybook/preview'
import { AutoComplete } from '#component'
import { fn } from 'storybook/test'

const meta = preview.meta({
  title: 'component/select/AutoComplete',
  component: AutoComplete,
  args: { onChange: fn() },
})

export const Playground = meta.story({
  args: {
    disabled: false,
    defaultOpen: false,
  },
  render: (props) => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        inlineSize: 'min(17.5rem, 100%)',
      }}
    >
      <AutoComplete
        {...props}
        key={`${props.defaultOpen}`}
        lang='en'
        aria-label='Select'
        placeholder='Select'
        options={[
          { value: 'al', label: 'Alabama' },
          { value: 'ak', label: 'Alaska' },
          { value: 'as', label: 'American Samoa' },
          { value: 'az', label: 'Arizona' },
          { value: 'ar', label: 'Arkansas' },
          { value: 'ca', label: 'California' },
          { value: 'co', label: 'Colorado' },
          { value: 'ct', label: 'Connecticut' },
          { value: 'de', label: 'Delaware' },
          { value: 'dc', label: 'District of Columbia' },
          { value: 'fl', label: 'Florida' },
          { value: 'ga', label: 'Georgia' },
          { value: 'gm', label: 'Guam' },
          { value: 'hi', label: 'Hawaii' },
          { value: 'id', label: 'Idaho' },
          { value: 'il', label: 'Illinois' },
          { value: 'in', label: 'Indiana' },
          { value: 'ia', label: 'Iowa' },
          { value: 'ks', label: 'Kansas' },
          { value: 'ky', label: 'Kentucky' },
          { value: 'la', label: 'Louisiana' },
          { value: 'me', label: 'Maine' },
          { value: 'md', label: 'Maryland' },
          { value: 'ma', label: 'Massachusetts' },
          { value: 'mi', label: 'Michigan' },
          { value: 'mn', label: 'Minnesota' },
          { value: 'ms', label: 'Mississippi' },
          { value: 'mo', label: 'Missouri' },
          { value: 'mt', label: 'Montana' },
          { value: 'ne', label: 'Nebraska' },
          { value: 'nv', label: 'Nevada' },
          { value: 'nh', label: 'New Hampshire' },
          { value: 'nj', label: 'New Jersey' },
          { value: 'nm', label: 'New Mexico' },
          { value: 'ny', label: 'New York' },
          { value: 'nc', label: 'North Carolina' },
          { value: 'nd', label: 'North Dakota' },
          { value: 'mp', label: 'Northern Marianas Islands' },
          { value: 'oh', label: 'Ohio' },
          { value: 'ok', label: 'Oklahoma' },
          { value: 'or', label: 'Oregon' },
          { value: 'pa', label: 'Pennsylvania' },
          { value: 'pr', label: 'Puerto Rico' },
          { value: 'ri', label: 'Rhode Island' },
          { value: 'sc', label: 'South Carolina' },
          { value: 'sd', label: 'South Dakota' },
          { value: 'tn', label: 'Tennessee' },
          { value: 'tx', label: 'Texas' },
          { value: 'ut', label: 'Utah' },
          { value: 've', label: 'Vermont' },
          { value: 'va', label: 'Virginia' },
          { value: 'vi', label: 'Virgin Islands' },
          { value: 'wa', label: 'Washington' },
          { value: 'wv', label: 'West Virginia' },
          { value: 'wi', label: 'Wisconsin' },
          { value: 'wy', label: 'Wyoming' },
        ]}
      />
    </div>
  ),
})
