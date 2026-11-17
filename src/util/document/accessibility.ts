export function isARIATrue(value: unknown) {
  return value === 'true' || value === true
}

export function isARIAFalse(value: unknown) {
  return value === 'false' || value === false
}

export function isARIADisabled(el: Element) {
  return isARIATrue(el.ariaDisabled)
}

export function isARIAExpanded(el: Element) {
  return isARIATrue(el.ariaExpanded)
}

export function isARIACollapsed(el: Element) {
  return isARIAFalse(el.ariaExpanded)
}

export function isARIAMultiSelectable(el: Element) {
  return isARIATrue(el.ariaMultiSelectable)
}

export function isARIASelected(el: Element) {
  return isARIATrue(el.ariaSelected)
}

export function isARIAChecked(el: Element) {
  return isARIATrue(el.ariaChecked)
}

export function isARIAHasPopup(el: Element) {
  return !!el.ariaHasPopup && !isARIAFalse(el.ariaHasPopup)
}
