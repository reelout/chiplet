import { useUniqueId } from '#hook'
import clsx from 'clsx'
import {
  GroupHeaderStyle,
  GroupLabelStyle,
  GroupNestedListStyle,
  GroupStyle,
} from '../select/style/index.css'

export interface GroupProps
  extends
    React.AriaAttributes,
    React.RefAttributes<HTMLLIElement>,
    React.PropsWithChildren {
  id?: string | undefined
  className?: string | undefined
  style?: React.CSSProperties | undefined
  label?: string | undefined
  slot?: {
    root?: React.ComponentProps<'li'> | undefined
    header?: React.ComponentProps<'div'> | undefined
    label?: React.ComponentProps<'div'> | undefined
    nested?: React.ComponentProps<'ul'> | undefined
  }
}

export function Group(props: GroupProps) {
  const { label, slot, ...attrs } = props

  const labelProps: React.ComponentProps<'div'> = { ...slot?.label }
  const _labelId = useUniqueId('label-')
  labelProps.id ||= _labelId

  return (
    <li
      {...slot?.root}
      {...attrs}
      className={clsx(GroupStyle, slot?.root?.className, attrs.className)}
      role='group'
      aria-labelledby={label != null ? labelProps.id : undefined}
    >
      {label != null && (
        <div
          {...slot?.header}
          className={clsx(GroupHeaderStyle, slot?.header?.className)}
          role='none'
        >
          <div
            {...labelProps}
            className={clsx(GroupLabelStyle, labelProps.className)}
            role='none'
          >
            {label}
          </div>
        </div>
      )}

      <ul
        {...slot?.nested}
        className={clsx(GroupNestedListStyle, slot?.nested?.className)}
        role='none'
      >
        {attrs.children}
      </ul>
    </li>
  )
}
