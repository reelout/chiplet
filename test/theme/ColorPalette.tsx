import { Switch } from '#component'
import { Roving } from '#hook'
import { rgbaToRgb, palette as _palette, token } from '#theme'
import Color from 'colorjs.io'
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'

type ColorName = keyof typeof token.palette

const palette = token.palette

const LightBack = 'neutral1' satisfies ColorName
const LightFore = 'neutral16' satisfies ColorName

const DarkBack = 'neutral16' satisfies ColorName
const DarkFore = 'neutral2' satisfies ColorName

const Disabled = {
  light: {
    color: 'neutral7',
    background: 'background5',
    border: 'border4',
  },
  dark: {
    color: 'neutral13',
    background: 'background1',
    border: 'border1',
  },
} as const

const Accent = {
  red: {
    light: {
      normal: 'accentRed4',
      hover: 'accentRed3',
      active: 'accentRed5',
      foreground: 'accentRed4',
    },
    dark: {
      normal: 'accentRed5',
      hover: 'accentRed4',
      active: 'accentRed6',
      foreground: 'accentRed3',
    },
  },
  orange: {
    light: {
      normal: 'accentOrange4',
      hover: 'accentOrange3',
      active: 'accentOrange5',
      foreground: 'accentOrange7',
    },
    dark: {
      normal: 'accentOrange5',
      hover: 'accentOrange4',
      active: 'accentOrange6',
      foreground: 'accentOrange5',
    },
  },
  yellow: {
    light: {
      normal: 'accentYellow2',
      hover: 'accentYellow1',
      active: 'accentYellow3',
      foreground: 'accentYellow7',
    },
    dark: {
      normal: 'accentYellow3',
      hover: 'accentYellow2',
      active: 'accentYellow4',
      foreground: 'accentYellow3',
    },
  },
  green: {
    light: {
      normal: 'accentGreen3',
      hover: 'accentGreen2',
      active: 'accentGreen4',
      foreground: 'accentGreen7',
    },
    dark: {
      normal: 'accentGreen4',
      hover: 'accentGreen3',
      active: 'accentGreen5',
      foreground: 'accentGreen4',
    },
  },
  blue: {
    light: {
      normal: 'accentBlue4',
      hover: 'accentBlue3',
      active: 'accentBlue5',
      foreground: 'accentBlue4',
    },
    dark: {
      normal: 'accentBlue5',
      hover: 'accentBlue4',
      active: 'accentBlue6',
      foreground: 'accentBlue3',
    },
  },
} as const

const CategoryStyle: React.CSSProperties = {
  fontWeight: 'bold',
  textAlign: 'center',
  writingMode: 'vertical-rl',
}

const CellStyle: React.CSSProperties = {
  backgroundPosition: '0 0',
  backgroundSize: '1.5rem 1.5rem',
}

const LightCellStyle: React.CSSProperties = {
  ...CellStyle,
  color: palette[LightFore],
  backgroundColor: palette[LightBack],
}

const DarkCellStyle: React.CSSProperties = {
  ...CellStyle,
  color: palette[DarkFore],
  backgroundColor: palette[DarkBack],
}

const Context = createContext({
  showContrastRatio: true,
})

export function ColorPalette() {
  const [showContrastRatio, setShowContrastRatio] = useState(true)

  return (
    <Context value={{ showContrastRatio }}>
      <div>
        <label
          style={{
            display: 'flex',
            gap: '0.5rem',
            placeItems: 'center',
            cursor: 'pointer',
          }}
        >
          <Switch
            checked={showContrastRatio}
            onChange={() => setShowContrastRatio((checked) => !checked)}
          />
          <span>Contrast ratio</span>
        </label>

        <table>
          <thead>
            <tr>
              <th></th>
              <th>Color</th>
              <th style={LightCellStyle}>
                Light
                <br />
                <i>normal/hover/active</i>
              </th>
              <th style={DarkCellStyle}>
                Dark
                <br />
                <i>normal/hover/active</i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td></td>
              <td>primary</td>
              <LightCell>
                <ColorGradient
                  colors={['primary5', 'primary4', 'primary6']}
                  style={{ color: palette[DarkFore] }}
                />
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={['primary2', 'primary1', 'primary3']}
                  style={{ color: palette[LightFore] }}
                />
              </DarkCell>
            </tr>
            <tr>
              <td></td>
              <td>secondary</td>
              <LightCell>
                <ColorGradient
                  colors={['secondary1', 'secondary2', 'secondary3']}
                />
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={['secondary6', 'secondary5', 'secondary4']}
                />
              </DarkCell>
            </tr>
            <tr>
              <td rowSpan={5} style={CategoryStyle}>
                Accent
              </td>
              <td>red</td>
              <LightCell>
                <ColorGradient
                  colors={[
                    Accent.red.light.normal,
                    Accent.red.light.hover,
                    Accent.red.light.active,
                  ]}
                  contrast={LightBack}
                  style={{ color: palette[LightBack] }}
                >
                  <ColorItem
                    color={LightBack}
                    contrast={Accent.red.light.foreground}
                  />
                </ColorGradient>
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[
                    Accent.red.dark.normal,
                    Accent.red.dark.hover,
                    Accent.red.dark.active,
                  ]}
                  contrast={LightBack}
                  style={{ color: palette[LightBack] }}
                >
                  <ColorItem
                    color={DarkBack}
                    contrast={Accent.red.dark.foreground}
                  />
                </ColorGradient>
              </DarkCell>
            </tr>
            <tr>
              <td>orange</td>
              <LightCell>
                <ColorGradient
                  colors={[
                    Accent.orange.light.normal,
                    Accent.orange.light.hover,
                    Accent.orange.light.active,
                  ]}
                  contrast={DarkBack}
                  style={{ color: palette[DarkBack] }}
                >
                  <ColorItem
                    color={LightBack}
                    contrast={Accent.orange.light.foreground}
                  />
                </ColorGradient>
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[
                    Accent.orange.dark.normal,
                    Accent.orange.dark.hover,
                    Accent.orange.dark.active,
                  ]}
                  contrast={DarkBack}
                  style={{ color: palette[DarkBack] }}
                >
                  <ColorItem
                    color={DarkBack}
                    contrast={Accent.orange.dark.foreground}
                  />
                </ColorGradient>
              </DarkCell>
            </tr>
            <tr>
              <td>yellow</td>
              <LightCell>
                <ColorGradient
                  colors={[
                    Accent.yellow.light.normal,
                    Accent.yellow.light.hover,
                    Accent.yellow.light.active,
                  ]}
                  contrast={DarkBack}
                  style={{ color: palette[DarkBack] }}
                >
                  <ColorItem
                    color={LightBack}
                    contrast={Accent.yellow.light.foreground}
                  />
                </ColorGradient>
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[
                    Accent.yellow.dark.normal,
                    Accent.yellow.dark.hover,
                    Accent.yellow.dark.active,
                  ]}
                  contrast={DarkBack}
                  style={{ color: palette[DarkBack] }}
                >
                  <ColorItem
                    color={DarkBack}
                    contrast={Accent.yellow.dark.foreground}
                  />
                </ColorGradient>
              </DarkCell>
            </tr>
            <tr>
              <td>green</td>
              <LightCell>
                <ColorGradient
                  colors={[
                    Accent.green.light.normal,
                    Accent.green.light.hover,
                    Accent.green.light.active,
                  ]}
                  contrast={DarkBack}
                  style={{ color: palette[DarkBack] }}
                >
                  <ColorItem
                    color={LightBack}
                    contrast={Accent.green.light.foreground}
                  />
                </ColorGradient>
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[
                    Accent.green.dark.normal,
                    Accent.green.dark.hover,
                    Accent.green.dark.active,
                  ]}
                  contrast={DarkBack}
                  style={{ color: palette[DarkBack] }}
                >
                  <ColorItem
                    color={DarkBack}
                    contrast={Accent.green.dark.foreground}
                  />
                </ColorGradient>
              </DarkCell>
            </tr>
            <tr>
              <td>blue</td>
              <LightCell>
                <ColorGradient
                  colors={[
                    Accent.blue.light.normal,
                    Accent.blue.light.hover,
                    Accent.blue.light.active,
                  ]}
                  contrast={LightBack}
                  style={{ color: palette[LightBack] }}
                >
                  <ColorItem
                    color={LightBack}
                    contrast={Accent.blue.light.foreground}
                  />
                </ColorGradient>
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[
                    Accent.blue.dark.normal,
                    Accent.blue.dark.hover,
                    Accent.blue.dark.active,
                  ]}
                  contrast={LightBack}
                  style={{ color: palette[LightBack] }}
                >
                  <ColorItem
                    color={DarkBack}
                    contrast={Accent.blue.dark.foreground}
                  />
                </ColorGradient>
              </DarkCell>
            </tr>
            <tr>
              <td rowSpan={4} style={CategoryStyle}>
                Semantic
              </td>
              <td>error</td>
              <LightCell>
                <ColorGradient colors={['semanticError1']} />
              </LightCell>
              <DarkCell>
                <ColorGradient colors={['semanticError2']} />
              </DarkCell>
            </tr>
            <tr>
              <td>warning</td>
              <LightCell>
                <ColorGradient colors={['semanticWarning1']} />
              </LightCell>
              <DarkCell>
                <ColorGradient colors={['semanticWarning2']} />
              </DarkCell>
            </tr>
            <tr>
              <td>success</td>
              <LightCell>
                <ColorGradient colors={['semanticSuccess1']} />
              </LightCell>
              <DarkCell>
                <ColorGradient colors={['semanticSuccess2']} />
              </DarkCell>
            </tr>
            <tr>
              <td>info</td>
              <LightCell>
                <ColorGradient colors={['semanticInfo1']} />
              </LightCell>
              <DarkCell>
                <ColorGradient colors={['semanticInfo2']} />
              </DarkCell>
            </tr>
            <tr>
              <td rowSpan={7} style={CategoryStyle}>
                Neutral
              </td>
              <td>neutral</td>
              <LightCell
                colSpan={2}
                style={{
                  background: `linear-gradient(90deg, ${palette[LightBack]} 0%, ${palette[LightBack]} 50%, ${palette[DarkBack]} 50%, ${palette[DarkBack]} 100%)`,
                  backgroundRepeat: 'repeat-y',
                }}
              >
                <ColorGradient
                  colors={[
                    'neutral1',
                    'neutral2',
                    'neutral3',
                    'neutral4',
                    'neutral5',
                    'neutral6',
                    'neutral7',
                    'neutral8',
                    'neutral9',
                    'neutral10',
                    'neutral11',
                    'neutral12',
                    'neutral13',
                    'neutral14',
                    'neutral15',
                    'neutral16',
                    'neutral17',
                  ]}
                  contrast={null}
                />
              </LightCell>
            </tr>
            <tr>
              <td>foreground</td>
              <LightCell>
                <ColorGradient
                  colors={[
                    LightFore,
                    'neutral13',
                    'neutral11',
                    Disabled.light.color,
                  ]}
                  style={{ color: palette[DarkFore] }}
                />
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[
                    DarkFore,
                    'neutral7',
                    'neutral10',
                    Disabled.dark.color,
                  ]}
                  style={{ color: palette[LightFore] }}
                />
              </DarkCell>
            </tr>
            <tr>
              <td>background</td>
              <LightCell>
                <ColorGradient
                  colors={[
                    'background5',
                    'background6',
                    'background7',
                    'background8',
                  ]}
                />
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[
                    'background1',
                    'background2',
                    'background3',
                    'background4',
                  ]}
                />
              </DarkCell>
            </tr>
            <tr>
              <td>border</td>
              <LightCell>
                <ColorGradient colors={['border4', 'border5', 'border6']} />
              </LightCell>
              <DarkCell>
                <ColorGradient colors={['border1', 'border2', 'border3']} />
              </DarkCell>
            </tr>
            <tr>
              <td>shadow</td>
              <LightCell>
                <ColorGradient colors={['shadow4', 'shadow5', 'shadow6']} />
              </LightCell>
              <DarkCell>
                <ColorGradient colors={['shadow1', 'shadow2', 'shadow3']} />
              </DarkCell>
            </tr>
            <tr>
              <td>overlay</td>
              <LightCell>
                <ColorGradient colors={['overlay2']} />
              </LightCell>
              <DarkCell>
                <ColorGradient colors={['overlay1']} />
              </DarkCell>
            </tr>
            <tr>
              <td>
                <a
                  href='https://www.w3.org/WAI/WCAG21/Understanding/non-text-contrast'
                  target='_blank'
                  rel='noreferrer'
                >
                  disabled
                </a>
              </td>
              <LightCell>
                <ColorGradient
                  colors={[Disabled.light.background, Disabled.light.color]}
                >
                  <ColorItem
                    color={Disabled.light.background}
                    contrast={Disabled.light.color}
                    border={Disabled.light.border}
                  />
                </ColorGradient>
              </LightCell>
              <DarkCell>
                <ColorGradient
                  colors={[Disabled.dark.background, Disabled.dark.color]}
                >
                  <ColorItem
                    color={Disabled.dark.background}
                    contrast={Disabled.dark.color}
                    border={Disabled.dark.border}
                  />
                </ColorGradient>
              </DarkCell>
            </tr>
          </tbody>
        </table>
      </div>
    </Context>
  )
}

const CellContext = createContext({
  background: LightBack as ColorName,
})

function LightCell(props: React.ComponentProps<'td'>) {
  return (
    <CellContext value={{ background: LightBack }}>
      <td
        {...props}
        style={{
          ...LightCellStyle,
          ...props.style,
        }}
      />
    </CellContext>
  )
}

function DarkCell(props: React.ComponentProps<'td'>) {
  return (
    <CellContext value={{ background: DarkBack }}>
      <td
        {...props}
        style={{
          ...DarkCellStyle,
          ...props.style,
        }}
      />
    </CellContext>
  )
}

function ColorGradient(props: {
  colors: readonly ColorName[]
  contrast?: ColorName | null
  style?: React.CSSProperties
  children?: React.ReactNode
}) {
  return (
    <div
      role='list'
      style={{
        display: 'flex',
        gap: '1rem',
        placeContent: 'space-between',
        placeItems: 'center',
      }}
    >
      <div
        style={{
          display: 'flex',
          placeContent: 'start',
          placeItems: 'center',
        }}
      >
        {props.colors.map((color, index, array) => (
          <ColorItem
            key={index}
            color={color}
            contrast={props.contrast}
            style={{
              ...props.style,
              borderRadius:
                array.length === 1
                  ? '0.25rem'
                  : index === 0
                    ? '0.25rem 0 0 0.25rem'
                    : index === array.length - 1
                      ? '0 0.25rem 0.25rem 0'
                      : '0',
            }}
          />
        ))}
      </div>

      {props.children && (
        <div
          style={{
            display: 'flex',
            placeContent: 'start',
            placeItems: 'center',
          }}
        >
          {props.children}
        </div>
      )}
    </div>
  )
}

function ColorItem(props: {
  color: ColorName
  contrast: ColorName | null | undefined
  border?: ColorName | undefined
  style?: React.CSSProperties
}) {
  const { showContrastRatio } = use(Context)

  const { background: canvas } = use(CellContext)

  const { contrast = canvas } = props

  const timerRef = useRef(0)

  const [copied, setCopied] = useState(false)

  const onClick = useCallback(() => {
    navigator.clipboard.writeText(props.color)

    setCopied(true)

    window.clearTimeout(timerRef.current)

    timerRef.current = window.setTimeout(() => setCopied(false), 1000)
  }, [props.color])

  useEffect(() => () => window.clearTimeout(timerRef.current), [])

  return (
    <Roving
      title={
        contrast
          ? `${getColorDescription(contrast)} on ${getColorDescription(props.color)}`
          : getColorDescription(props.color)
      }
      aria-label={props.color}
      role='listitem'
      onClick={onClick}
      style={{
        position: 'relative',
        boxSizing: 'border-box',
        inlineSize: 'fit-content',
        minInlineSize: '3rem',
        blockSize: '3rem',
        margin: 'auto',
        fontSize: '0.875rem',
        lineHeight: '3rem',
        color: contrast ? palette[contrast] : 'inherit',
        textAlign: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        background: palette[props.color],
        border: props.border ? `1px solid ${palette[props.border]}` : 'none',
        borderRadius: '0.25rem',
        ...props.style,
      }}
    >
      {showContrastRatio &&
        contrast &&
        contrastRatio(contrast, props.color, canvas).toFixed(2)}
      {copied && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            placeContent: 'center',
            placeItems: 'center',
            fontSize: '1.25rem',
            color: 'white',
            backgroundColor: '#0002',
            borderRadius: 'inherit',
          }}
        >
          ✓
        </div>
      )}
    </Roving>
  )
}

function contrastRatio(
  foreground: ColorName,
  background: ColorName,
  canvas: ColorName
) {
  let color1 = new Color(resolveColorValue(foreground))
  let color2 = new Color(resolveColorValue(background))
  const color3 = new Color(resolveColorValue(canvas))

  if (color2.alpha < 1) {
    color2 = new Color(rgbaToRgb(toHex(color2), toHex(color3)))
  }

  if (color1.alpha < 1) {
    color1 = new Color(rgbaToRgb(toHex(color1), toHex(color2)))
  }

  return color1.contrastWCAG21(color2)
}

function resolveColorValue(name: ColorName) {
  return _palette[name]
}

function getColorDescription(name: ColorName) {
  const color = new Color(resolveColorValue(name))

  return `${name} ${((color.oklch.l ?? 0) * 100).toFixed(2)}% (${toHex(color)})`
}

function toHex(color: Color) {
  return color.toString({ format: 'hex', collapse: false }).toUpperCase()
}
