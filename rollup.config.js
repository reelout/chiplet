import { babel } from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import svgr from '@svgr/rollup'
import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin'
import { globSync } from 'node:fs'
import { defineConfig } from 'rollup'
import esbuild from 'rollup-plugin-esbuild'
import nodeExternals from 'rollup-plugin-node-externals'
import preserveDirectives from 'rollup-preserve-directives'

export default defineConfig({
  input: globSync('./src/**/*.{ts,tsx}', { exclude: ['**/*.d.ts'] }),
  output: {
    dir: './dist',
    sourcemap: true,
    preserveModules: true,
  },
  plugins: [
    nodeResolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      configFile: true,
      extensions: ['.ts', '.tsx'],
    }),
    esbuild(),
    vanillaExtractPlugin({ identifiers: 'short' }),
    svgr({ dimensions: false, exportType: 'named' }),
    nodeExternals(),
    preserveDirectives(),
  ],
})
