import preview from '#.storybook/preview'
import { Group, Separator } from '#component'
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItemCheckbox,
  MenuItemRadio,
} from '#component'
import { clearAllMocks, expect, fn, within } from 'storybook/test'

const meta = preview.meta({
  title: 'component/menu/Menu',
  component: Menu,
  args: { onToggle: fn(), onChange: fn() },
})

export const Playground = meta.story({
  args: {
    defaultOpen: false,
  },
  render: (props) => (
    <Menu
      {...props}
      key={String(props.defaultOpen)}
      anchor={<MenuButton>Menu</MenuButton>}
    >
      <Group aria-label='Font Style'>
        <MenuItemCheckbox name='style' value='bold'>
          Bold
        </MenuItemCheckbox>
        <MenuItemCheckbox name='style' value='italic'>
          Italic
        </MenuItemCheckbox>
        <MenuItemCheckbox name='style' value='underline'>
          Underline
        </MenuItemCheckbox>
        <MenuItemCheckbox name='style' value='strikethrough'>
          Strikethrough
        </MenuItemCheckbox>
      </Group>
      <Separator />
      <Group label='Font Size'>
        <MenuItemRadio name='size' value='small'>
          Small
        </MenuItemRadio>
        <MenuItemRadio name='size' value='medium'>
          Medium
        </MenuItemRadio>
        <MenuItemRadio name='size' value='large'>
          Large
        </MenuItemRadio>
      </Group>
      <Separator />
      <MenuItem>Edit</MenuItem>
      <MenuItem danger={true}>Delete</MenuItem>
    </Menu>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    const button = canvas.getByRole('button', { name: 'Menu' })

    {
      await step('open menu', async () => {
        await userEvent.click(button)
      })

      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(button.ariaControlsElements).toEqual([canvas.getByRole('menu')])
      expect(button).toHaveFocus()

      await step('move focus', async () => {
        await userEvent.keyboard('{ArrowDown}{ArrowDown}')
      })

      const bold = canvas.getByRole('menuitemcheckbox', { name: 'Bold' })
      const italic = canvas.getByRole('menuitemcheckbox', { name: 'Italic' })

      expect(bold).toHaveAttribute('aria-checked', 'false')
      expect(italic).toHaveAttribute('aria-checked', 'false')
      expect(italic).toHaveFocus()

      await step('select menu item checkbox', async () => {
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard('{ArrowUp}')
        await userEvent.keyboard('{Enter}')
      })

      expect(bold).toHaveFocus()
      expect(bold).toHaveAttribute('aria-checked', 'true')
      expect(italic).toHaveAttribute('aria-checked', 'true')

      await step('move focus to Edit menu item', async () => {
        await userEvent.keyboard('E')
      })

      expect(canvas.getByRole('menuitem', { name: 'Edit' })).toHaveFocus()

      await step('select menu item and close menu', async () => {
        await userEvent.keyboard('{Enter}')
      })

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button.ariaControlsElements).toBe(null)
      expect(button).toHaveFocus()
    }

    {
      await step('press ArrowUp key to open menu and move focus', async () => {
        await userEvent.keyboard('{ArrowUp}')
      })

      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(button.ariaControlsElements).toEqual([canvas.getByRole('menu')])
      expect(canvas.getByRole('menuitem', { name: 'Delete' })).toHaveFocus()

      await step('close menu', async () => {
        await userEvent.keyboard('{Escape}')
      })

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button.ariaControlsElements).toBe(null)
      expect(button).toHaveFocus()
    }

    {
      await step('press ArrowDown key to open menu', async () => {
        await userEvent.keyboard('{ArrowDown}')
        await userEvent.keyboard('M')
      })

      let medium = canvas.getByRole('menuitemradio', { name: 'Medium' })

      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(button.ariaControlsElements).toEqual([canvas.getByRole('menu')])
      expect(medium).toHaveFocus()
      expect(medium).toHaveAttribute('aria-checked', 'false')

      await step('select menu item radio and close menu', async () => {
        await userEvent.keyboard('{Enter}')
      })

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button.ariaControlsElements).toBe(null)
      expect(button).toHaveFocus()

      await step('open menu again', async () => {
        await userEvent.click(button)
      })

      medium = canvas.getByRole('menuitemradio', { name: 'Medium' })

      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(button.ariaControlsElements).toEqual([canvas.getByRole('menu')])
      expect(button).toHaveFocus()
      expect(medium).toHaveAttribute('aria-checked', 'true')

      await step('close menu', async () => {
        await userEvent.keyboard('{Escape}')
      })

      expect(button).toHaveAttribute('aria-expanded', 'false')
      expect(button.ariaControlsElements).toBe(null)
      expect(button).toHaveFocus()
    }

    expect(args.onToggle).toHaveBeenCalledTimes(8)
    expect(args.onToggle).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        type: 'click',
        target: button,
      }),
      true,
      'anchor'
    )
    expect(args.onToggle).toHaveBeenNthCalledWith(
      2,
      expect.objectContaining({
        type: 'click',
        target: expect.objectContaining({ textContent: 'Edit' }),
      }),
      false,
      'close'
    )
    expect(args.onToggle).toHaveBeenNthCalledWith(
      3,
      expect.objectContaining({
        type: 'keydown',
        key: 'ArrowUp',
        target: button,
      }),
      true
    )
    expect(args.onToggle).toHaveBeenNthCalledWith(
      4,
      expect.objectContaining({
        type: 'keydown',
        key: 'Escape',
        target: expect.objectContaining({ textContent: 'Delete' }),
      }),
      false,
      'escape'
    )
  },
})

export const Disabled = meta.story({
  args: {
    defaultOpen: false,
  },
  render: (props) => (
    <Menu
      {...props}
      key={String(props.defaultOpen)}
      anchor={<MenuButton>Menu</MenuButton>}
    >
      <Group label='Checkbox'>
        <MenuItemCheckbox name='checkbox' value='item1'>
          Item 1
        </MenuItemCheckbox>
        <MenuItemCheckbox name='checkbox' value='item2' disabled={true}>
          Item 2
        </MenuItemCheckbox>
      </Group>
      <Separator />
      <Group label='Radio'>
        <MenuItemRadio name='radio' value='item3'>
          Item 3
        </MenuItemRadio>
        <MenuItemRadio name='radio' value='item4' disabled={true}>
          Item 4
        </MenuItemRadio>
      </Group>
      <Separator />
      <Group label='Action'>
        <MenuItem>Refresh</MenuItem>
        <MenuItem danger={true} disabled={true}>
          Clear
        </MenuItem>
      </Group>
    </Menu>
  ),
  play: async ({ args, canvas, userEvent, step }) => {
    canvas = within(document.body)

    const button = canvas.getByRole('button', { name: 'Menu' })

    {
      await step('open menu', async () => {
        await userEvent.click(button)
      })

      const item1 = canvas.getByRole('menuitemcheckbox', { name: 'Item 1' })
      const item2 = canvas.getByRole('menuitemcheckbox', { name: 'Item 2' })
      const item3 = canvas.getByRole('menuitemradio', { name: 'Item 3' })
      const item4 = canvas.getByRole('menuitemradio', { name: 'Item 4' })
      const refresh = canvas.getByRole('menuitem', { name: 'Refresh' })
      const clear = canvas.getByRole('menuitem', { name: 'Clear' })

      expect(item1).not.toHaveAttribute('aria-disabled')
      expect(item2).toHaveAttribute('aria-disabled', 'true')
      expect(item3).not.toHaveAttribute('aria-disabled')
      expect(item4).toHaveAttribute('aria-disabled', 'true')
      expect(refresh).not.toHaveAttribute('aria-disabled')
      expect(clear).toHaveAttribute('aria-disabled', 'true')

      await step('move focus', async () => {
        await userEvent.keyboard('{ArrowDown}{ArrowDown}')
        await userEvent.keyboard('{Enter}')
      })

      expect(item2).toHaveFocus()

      await step('move focus', async () => {
        await userEvent.keyboard('{ArrowDown}{ArrowDown}')
        await userEvent.keyboard('{Enter}')
      })

      expect(item4).toHaveFocus()

      await step('move focus', async () => {
        await userEvent.keyboard('{ArrowDown}{ArrowDown}')
        await userEvent.keyboard('{Enter}')
      })

      expect(clear).toHaveFocus()

      await step('close menu', async () => {
        await userEvent.keyboard('{Escape}')
      })

      expect(args.onToggle).toHaveBeenCalledTimes(2)
      expect(args.onToggle).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'click',
          target: button,
        }),
        true,
        'anchor'
      )
      expect(args.onToggle).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'keydown',
          key: 'Escape',
          target: clear,
        }),
        false,
        'escape'
      )
    }

    clearAllMocks()

    {
      await step('select menu item checkbox', async () => {
        await userEvent.click(button)
        await userEvent.keyboard('{ArrowDown}{ArrowDown}')
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard('{ArrowUp}')
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard('{Escape}')
      })

      expect(args.onToggle).toHaveBeenCalledTimes(2)
      expect(args.onToggle).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'click',
          target: button,
        }),
        true,
        'anchor'
      )
      expect(args.onToggle).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'keydown',
          key: 'Escape',
          target: expect.objectContaining({ textContent: 'Item 1' }),
        }),
        false,
        'escape'
      )
    }

    clearAllMocks()

    {
      await step('select menu item radio', async () => {
        await userEvent.click(button)
        await userEvent.keyboard('{ArrowUp}{ArrowUp}{ArrowUp}')
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard('{ArrowUp}')
        await userEvent.keyboard('{Enter}')
      })

      expect(args.onToggle).toHaveBeenCalledTimes(2)
      expect(args.onToggle).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'click',
          target: button,
        }),
        true,
        'anchor'
      )
      expect(args.onToggle).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'click',
          target: expect.objectContaining({ textContent: 'Item 3' }),
        }),
        false,
        'close'
      )
    }

    clearAllMocks()

    {
      await step('select menu item', async () => {
        await userEvent.click(button)
        await userEvent.keyboard('{ArrowUp}')
        await userEvent.keyboard('{Enter}')
        await userEvent.keyboard('{ArrowUp}')
        await userEvent.keyboard('{Enter}')
      })

      expect(args.onToggle).toHaveBeenCalledTimes(2)
      expect(args.onToggle).toHaveBeenNthCalledWith(
        1,
        expect.objectContaining({
          type: 'click',
          target: button,
        }),
        true,
        'anchor'
      )
      expect(args.onToggle).toHaveBeenNthCalledWith(
        2,
        expect.objectContaining({
          type: 'click',
          target: expect.objectContaining({ textContent: 'Refresh' }),
        }),
        false,
        'close'
      )
    }
  },
})
