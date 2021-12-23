module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
  ],
  rules: {
    'linebreak-style': 0,
    'import/extensions': 0,
    'import/prefer-default-export': 0,
    'react/function-component-definition': 0,
    'react/prop-types': 0,
    'react/jsx-props-no-spreading': 0,
  },
};
