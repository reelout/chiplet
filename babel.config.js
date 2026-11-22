/**
 * @type {import('@babel/core').TransformOptions}
 */
export default {
  plugins: ['babel-plugin-react-compiler'],
  overrides: [
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
