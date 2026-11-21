import { LightDarkColorScheme } from '#theme'
import { render } from '@testing-library/react'
import { expect, test } from 'vitest'

test("LightDarkColorScheme - opts into the scheme without 'GlobalContainerStyle'", () => {
  const { getByTestId } = render(
    <>
      <div data-testid='plain' />
      <div data-testid='container' className={LightDarkColorScheme} />
    </>
  )

  expect(getComputedStyle(getByTestId('plain')).colorScheme).toBe('normal')
  expect(getComputedStyle(getByTestId('container')).colorScheme).toBe(
    'light dark'
  )
})
