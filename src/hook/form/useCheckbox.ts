import type { ChangeCallback } from './useDefault'
import { useChecked } from './useChecked'

interface Props {
  name?: string | undefined
  value: string | number
  defaultChecked?: boolean | undefined
  checked?: boolean | undefined
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange?: ChangeCallback<React.SyntheticEvent, boolean> | undefined
}

export function useCheckbox<P extends Props>(props: P) {
  props = useChecked<P>({
    ...props,
    defaultChecked: props.defaultChecked ?? false,
    multiple: true,
  })

  props = {
    ...props,
    multiple: undefined,
  }

  return props
}
