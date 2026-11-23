/**
 * @type {import('@babel/core').TransformOptions}
 */
export default {
  plugins: ['babel-plugin-react-compiler'],
  overrides: [
    // Plain TS for '.ts' — 'isTSX' would reject angle-bracket type
    // assertions that are valid in TS.
    {
      test: /\.ts$/,
      plugins: ['@babel/plugin-syntax-typescript'],
    },
    {
      test: /\.tsx$/,
      plugins: [
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
        '@babel/plugin-syntax-jsx',
      ],
    },
  ],
}
