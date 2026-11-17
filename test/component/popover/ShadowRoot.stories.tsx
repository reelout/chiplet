import preview from '#.storybook/preview'
import { ShadowRoot } from '#component'
import { expect } from 'storybook/test'

const meta = preview.meta({
  title: 'component/popover/ShadowRoot',
  component: ShadowRoot,
  parameters: { layout: 'centered' },
})

export const Playground = meta.story({
  render: () => (
    <div style={{ display: 'grid', gap: '1rem', justifyItems: 'center' }}>
      <style>{'[data-testid="leak"] { color: rgb(255, 0, 0) }'}</style>
      <p>Outside the shadow root</p>
      <ShadowRoot
        data-testid='host'
        style={{
          border: '1px dashed currentColor',
          display: 'grid',
          gap: '0.5rem',
          padding: '1rem',
        }}
      >
        <style>{'[data-testid="scoped"] { color: rgb(0, 128, 0) }'}</style>
        <p>Inside the shadow root</p>
        <p data-testid='leak'>document rule target</p>
        <p data-testid='scoped'>shadow style target</p>
      </ShadowRoot>
    </div>
  ),
  play: async ({ canvas, step }) => {
    const host = canvas.getByTestId('host')
    const shadow = host.shadowRoot

    await step('attaches an open shadow root', () => {
      expect(shadow).toBeInstanceOf(window.ShadowRoot)
      expect(shadow?.mode).toBe('open')
      expect(host).toBeEmptyDOMElement()
    })

    await step('isolates document styles from shadow content', () => {
      const leak = shadow?.querySelector('[data-testid="leak"]')
      const scoped = shadow?.querySelector('[data-testid="scoped"]')

      if (
        !(scoped instanceof HTMLParagraphElement) ||
        !(leak instanceof HTMLParagraphElement)
      ) {
        throw new Error('shadow style probes are missing')
      }

      expect(getComputedStyle(scoped).color).toBe('rgb(0, 128, 0)')
      expect(getComputedStyle(leak).color).not.toBe('rgb(255, 0, 0)')
    })
  },
})

export const DelegatesFocus = meta.story({
  args: { delegatesFocus: true },
  render: (props) => (
    <ShadowRoot
      {...props}
      data-testid='host'
      tabIndex={-1}
      style={{
        border: '1px dashed currentColor',
        display: 'grid',
        gap: '0.5rem',
        padding: '1rem',
      }}
    >
      <p>Focusing the host moves focus to the first focusable element.</p>
      <button data-testid='button'>focusable</button>
    </ShadowRoot>
  ),
  play: async ({ canvas, step }) => {
    const host = canvas.getByTestId('host')
    const shadow = host.shadowRoot

    await step('delegates focus to the first focusable element', () => {
      host.focus()

      if (
        !(shadow instanceof window.ShadowRoot) ||
        !(shadow.activeElement instanceof HTMLButtonElement)
      ) {
        throw new Error(
          'delegatesFocus did not move focus into the shadow tree'
        )
      }

      expect(shadow.delegatesFocus).toBe(true)
      expect(shadow.activeElement).toBe(
        shadow.querySelector('[data-testid="button"]')
      )
    })
  },
})
