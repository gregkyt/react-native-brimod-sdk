module.exports = {
  root: true,
  extends: ['plugin:react/recommended', 'prettier'],
  plugins: ['react', 'react-native', 'spellcheck'],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  ignorePatterns: ['node_modules/', 'vendor/', 'android/', 'ios/'],
};
