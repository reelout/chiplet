import svgr from '@svgr/rollup'
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react({ compiler: true }),
    vanillaExtractPlugin(),
    svgr({ dimensions: false }),
  ],
  optimizeDeps: {
    include: ['@vanilla-extract/recipes/createRuntimeFn', 'clsx', 'colorjs.io'],
  },
})
