import {
  FormContext,
  useSelect,
  type OptionValue,
  type SelectOptions,
} from '#hook'
import clsx from 'clsx'
import type { JSX } from 'react'
import { Popover, type PopoverProps } from '../popover/Popover'
import { Button, type ButtonProps } from '../button/Button'
import { ChevronDown24Regular } from '../icon'
import { ButtonAfterStyle } from '../button/style/index.css'
import { ListStyle } from '../select/style/index.css'
import { Option } from './Option'

export interface SelectProps<T extends OptionValue, M extends boolean>
  extends
    Omit<ButtonProps, keyof SelectOptions<T, M>>,
    Omit<SelectOptions<T, M>, 'ref'>,
    React.RefAttributes<Select> {
  options?: readonly Option<T>[] | undefined
  icon?: JSX.Element | null | undefined
  slot?: {
    button?: ButtonProps | undefined
    popover?: PopoverProps<'ul'> | undefined
    icon?: React.ComponentProps<'svg'> | undefined
  }
}

export interface Select extends Popover<'ul'> {}

export function Select<T extends OptionValue, M extends boolean = false>(
  props: SelectProps<T, M>
) {
  const select = useSelect(props)

  return (
    <Popover
      {...select.popover.props}
      elementType='ul'
      className={clsx(ListStyle, select.popover.props.className)}
      anchor={
        <Button
          {...select.button.props}
          variant={select.button.props.variant ?? 'secondary'}
        >
          {select.button.props.children}
          {props.icon !== undefined ? (
            props.icon
          ) : (
            <ChevronDown24Regular
              {...props.slot?.icon}
              className={clsx(ButtonAfterStyle, props.slot?.icon?.className)}
            />
          )}
        </Button>
      }
    >
      <FormContext value={select.context}>
        {select.options?.map(({ label, ...option }, index) => (
          <Option {...option} key={option.key ?? index}>
            {option.children ?? label}
          </Option>
        ))}
      </FormContext>
    </Popover>
  )
}
