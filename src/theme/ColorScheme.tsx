export type ColorScheme =
  'auto' | 'light' | 'dark' | 'light dark' | 'dark light'

interface ColorSchemeProps extends React.ComponentProps<'meta'> {
  mode?: ColorScheme | undefined
}

/**
 * https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/meta/name/color-scheme
 */
export function ColorScheme(props: ColorSchemeProps) {
  const { mode = 'auto', ...attrs } = props

  const content = mode === 'auto' ? 'light dark' : mode

  return (
    <>
      <meta {...attrs} name='color-scheme' content={content} />
      <style>{`:root { color-scheme: ${content}; }`}</style>
    </>
  )
}
