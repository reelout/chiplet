/**
 * @type {import('@babel/core').TransformOptions}
 */
export default {
  plugins: [
    'babel-plugin-react-compiler',
    '@babel/plugin-syntax-jsx',
    ['@babel/plugin-syntax-typescript', { isTSX: true }],
  ],
}
