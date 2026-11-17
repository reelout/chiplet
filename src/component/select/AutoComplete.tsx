'use client'
import { FormContext, useAutoComplete, type AutoCompleteOptions } from '#hook'
import { HighlightName } from '#theme'
import clsx from 'clsx'
import { useLayoutEffect, type JSX } from 'react'
import { ChevronDown24Regular } from '../icon'
import { Input, type InputProps } from '../input/Input'
import { Popover, type PopoverProps } from '../popover/Popover'
import { InputAfterStyle } from '../input/style/index.css'
import { Option } from './Option'
import { ListStyle } from './style/index.css'

export interface AutoCompleteProps<T extends string>
  extends
    Omit<InputProps, keyof AutoCompleteOptions<T>>,
    Omit<AutoCompleteOptions<T>, 'ref'>,
    React.RefAttributes<AutoComplete> {
  options?: readonly Option<T>[] | undefined
  icon?: JSX.Element | null | undefined
  slot?: {
    input?: InputProps | undefined
    popover?: PopoverProps<'ul'> | undefined
    icon?: React.ComponentProps<'svg'> | undefined
  }
}

export interface AutoComplete extends Popover<'ul'> {}

export function AutoComplete<T extends string>(props: AutoCompleteProps<T>) {
  const select = useAutoComplete(props)

  useLayoutEffect(() => {
    if (!select.highlight) return

    CSS.highlights.set(HighlightName, select.highlight)

    return () => {
      CSS.highlights.delete(HighlightName)
    }
  }, [select.highlight])

  return (
    <Popover
      {...select.popover.props}
      elementType='ul'
      className={clsx(ListStyle, select.popover.props.className)}
      anchor={
        <Input
          {...select.input.props}
          after={
            props.icon !== undefined ? (
              props.icon
            ) : (
              <ChevronDown24Regular
                {...props.slot?.icon}
                className={clsx(InputAfterStyle, props.slot?.icon?.className)}
              />
            )
          }
        />
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
