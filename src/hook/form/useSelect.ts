import type {
  KeyboardOptions,
  NavigationDirection,
} from '../accessibility/keyboard/Keyboard'
import type {
  Overlay,
  OverlayAnchorProps,
  ToggleCallback,
} from '../popover/useOverlay'
import type { PopoverOptions } from '../popover/usePopover'
import type { PositioningOptions } from '../popover/usePositioning'
import { useRefCallback } from '../react/useRefCallback'
import type { ChangeCallback } from './useDefault'
import { normalizeValue } from './useChecked'
import { useGroup } from './useGroup'

type Option<T> = { value: T; label: string }

type Value<T, M extends boolean> = M extends true ? readonly T[] : T

type Slot = {
  button?: SelectButtonOptions | undefined
  popover?: PopoverOptions<React.HTMLElementType> | undefined
}

interface SelectButtonOptions
  extends OverlayAnchorProps, React.PropsWithChildren {
  name?: string | undefined
  value?: unknown
  disabled?: boolean | undefined
}

export interface SelectOptions<
  T,
  M extends boolean,
  O extends Option<T> = Option<T>,
  S extends Slot = Slot,
>
  extends React.PropsWithChildren {
  name?: string | undefined
  placeholder?: string | undefined
  defaultValue?: Value<T, M> | undefined
  value?: Value<T, M> | undefined
  options?: readonly O[] | undefined
  multiple?: M | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, Value<T, M>> | undefined
  positioning?: PositioningOptions | undefined
  keyboard?: KeyboardOptions | NavigationDirection | undefined
  defaultOpen?: boolean | undefined
  open?: boolean | undefined
  onToggle?: ToggleCallback | undefined
  ref?: React.Ref<Overlay> | undefined
  slot?: S | undefined
}

export function useSelect<
  T,
  M extends boolean,
  O extends Option<T> = Option<T>,
  S extends Slot = Slot,
>(selectOptions: SelectOptions<T, M, O, S>) {
  const group = useGroup(selectOptions)

  const {
    name,
    placeholder,
    defaultValue,
    value,
    options,
    multiple,
    disabled,
    onChange,
    positioning,
    keyboard,
    defaultOpen,
    open,
    onToggle,
    ref,
    slot,
    children,
    ...props
  } = group.props

  let buttonProps: NonNullable<S['button']> = { ...slot?.button, ...props }
  let popoverProps: NonNullable<S['popover']> = { ...slot?.popover }

  const [buttonEl, setButtonEl] = useRefCallback(buttonProps.ref)
  const normalized = normalizeValue<T>(multiple, value)
  const empty = normalized.length === 0

  buttonProps = {
    ...buttonProps,
    role: 'combobox',
    'aria-autocomplete': 'none',
    // https://github.com/A11yance/aria-query/blob/main/scripts/roles.json#:~:text=combobox
    // 'aria-placeholder': placeholder,
    name,
    value,
    disabled,
    ref: setButtonEl,
  }

  popoverProps = {
    ...popoverProps,
    role: 'listbox',
    'aria-multiselectable': multiple,
    positioning,
    keyboard,
    defaultOpen,
    open,
    onToggle,
    ref,
    children,
  }

  buttonProps.children = (() => {
    if (empty) return placeholder

    const lang =
      buttonProps.lang ||
      buttonEl?.closest('[lang]')?.getAttribute('lang') ||
      undefined

    return new Intl.ListFormat(lang, { style: 'narrow' }).format(
      normalized.map((value) => {
        const label = options?.find((option) => option.value === value)?.label

        if (typeof label === 'string') return label

        return String(value)
      })
    )
  })()

  return {
    name,
    placeholder,
    defaultValue,
    value,
    options,
    multiple,
    disabled,
    onChange,
    button: { props: buttonProps },
    popover: { props: popoverProps },
    context: group.context,
  }
}
