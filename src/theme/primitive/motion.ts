export const motion = {
  duration: {
    none: '0ms',
    1: '80ms', // 草稿 fast
    2: '160ms', // 草稿 default
    3: '240ms', // 草稿 slow
    4: '320ms', // 草稿 slowest
    5: '480ms', // 推算（6 × 80ms）
    6: '640ms', // 推算（8 × 80ms）
  },
  easing: {
    linear: 'linear',
    easeOut: 'ease-out', // 草稿默认缓动
    easeIn: 'ease-in',
    easeInOut: 'ease-in-out',
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
  },
  behavior: {
    normal: 'normal',
    allowDiscrete: 'allow-discrete', // 草稿离散属性过渡支持
  },
} as const
