import { generateDeterministicId } from '../random/generateDeterministicId'

export const VirtualFocus = generateDeterministicId('data-focus-visible-')
export const VirtualFocusSelector = `[${VirtualFocus}="true"]` as const
export const VirtualActive = generateDeterministicId('data-active-')
export const VirtualActiveSelector = `[${VirtualActive}="true"]` as const
export const VirtualDisabled = 'aria-disabled'
export const VirtualDisabledSelector = '[aria-disabled="true"]'
