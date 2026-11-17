import preview from '#.storybook/preview'
import { LinkButton } from '#component'
import { Base } from './style.css'

const meta = preview.meta({
  title: 'component/button/LinkButton',
  component: LinkButton,
  parameters: { layout: 'fullscreen' },
  args: {},
})

export const Playground = meta.story({
  args: {
    href: 'https://example.com/',
  },
  render: (props) => (
    <div className={Base}>
      <LinkButton {...props} target='_blank'>
        Open in new tab
      </LinkButton>
    </div>
  ),
})
