// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  extends: 'airbnb-base',
  // add your custom rules here
  'rules': {
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'no-console': 0,
    'no-new': 0,
    'func-names': 0,
    'no-await-in-loop': 0,
    'no-restricted-syntax': 0,
    'yoda': 0,
    'curly': 0,
    'no-unused-vars': 1,
    'prefer-const': 0,
    'semi': ['error', 'never'],
    'no-plusplus': 0,
    'key-spacing': ['error', { align: 'value' }],
    'import/first': 0,
    'no-multi-str': 0,
    'no-unused-expressions': 0,
    'no-param-reassign': 0,
    'consistent-return': 0,
    'no-continue': 0,
    'object-curly-newline': 0,
    'function-paren-newline': 0,
  }
}
