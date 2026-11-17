'use client'
import { createContext, type SetStateAction } from 'react'
import type { ChangeCallback } from '../useDefault'

export interface FormContext<T> {
  name?: string | undefined
  value: T
  multiple?: boolean | undefined
  disabled?: boolean | undefined
  onChange: ChangeCallback<React.SyntheticEvent, SetStateAction<T>>
}

export const FormContext = createContext<FormContext<{}> | null>(null)

FormContext.displayName = 'FormContext'
