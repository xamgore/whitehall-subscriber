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
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never'
    }],
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
    'key-spacing': ['error', { align: 'value' }]
  }
}
