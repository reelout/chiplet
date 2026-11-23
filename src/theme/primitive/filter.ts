export const filter = {
  blur: {
    none: '0rem',
    1: '0.125rem', // 2px
    2: '0.25rem', // 4px
    3: '0.5rem', // 8px
    4: '0.75rem', // 12px
    5: '1rem', // 16px
    6: '1.5rem', // 24px
    7: '2.5rem', // 40px
  },
  brightness: {
    1: '0.75',
    2: '0.9',
    3: '0.95',
    4: '1',
    5: '1.05',
    6: '1.1',
    7: '1.25',
  },
  saturate: {
    1: '0',
    2: '0.5',
    3: '1',
    4: '1.25',
    5: '1.5',
    6: '2',
  },
} as const
