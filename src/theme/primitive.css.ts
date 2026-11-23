import { createTheme } from '@vanilla-extract/css'
import { border } from './primitive/border'
import { filter } from './primitive/filter'
import { motion } from './primitive/motion'
import { opacity } from './primitive/opacity'
import { palette } from './primitive/palette'
import { radius } from './primitive/radius'
import { shadow } from './primitive/shadow'
import { sizing } from './primitive/sizing'
import { spacing } from './primitive/spacing'
import { typography } from './primitive/typography'

export const [primitiveClass, primitive] = createTheme({
  palette,
  opacity,
  typography,
  spacing,
  sizing,
  radius,
  border,
  shadow,
  filter,
  motion,
})
