/**
 * @type {import('@babel/core').TransformOptions}
 */
export default {
  overrides: [
    {
      test: /\.tsx$/,
      plugins: [
        '@babel/plugin-syntax-jsx',
        ['@babel/plugin-syntax-typescript', { isTSX: true }],
      ],
    },
    {
      test: /\.ts$/,
      plugins: [['@babel/plugin-syntax-typescript', { isTSX: false }]],
    },
  ],
  plugins: ['babel-plugin-react-compiler'],
}
