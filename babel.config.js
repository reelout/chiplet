/**
 * @type {import('@babel/core').TransformOptions}
 */
export default {
  plugins: [
    ['@babel/plugin-syntax-typescript', { isTSX: true }],
    'babel-plugin-react-compiler',
  ],
}
