const lightShadow1 = 'oklch(0.6032725 0 0 / 0.09)'
const darkShadow1 = 'oklch(0.536545 0 0 / 0.09)'
const lightShadow2 = 'oklch(0.6032725 0 0 / 0.29)'
const darkShadow2 = 'oklch(0.536545 0 0 / 0.29)'
const lightShadow3 = 'oklch(0.6032725 0 0 / 0.49)'
const darkShadow3 = 'oklch(0.536545 0 0 / 0.49)'

/**
 * 结合草稿的阴影几何参数与 shadow1–shadow6 色彩规则：
 * 1: 贴合微投影（草稿 shadow.small）
 * 2: 轻度悬浮（推算过渡阶）
 * 3: 卡片悬浮（草稿 shadow.medium）
 * 4: 弹窗/抽屉（草稿 shadow.large）
 * 5: 高层级浮层（推算）
 */
export const shadow = {
  none: 'none',
  1: `0 0.125rem 0.25rem light-dark(${lightShadow1}, ${darkShadow1})`,
  2: `0 0.25rem 0.5rem 0.0625rem light-dark(${lightShadow1}, ${darkShadow1})`,
  3: `0 0 1rem 0.125rem light-dark(${lightShadow2}, ${darkShadow2})`,
  4: `0 0 2rem light-dark(${lightShadow2}, ${darkShadow2})`,
  5: `0 0.5rem 3rem 0.25rem light-dark(${lightShadow3}, ${darkShadow3})`,
} as const
