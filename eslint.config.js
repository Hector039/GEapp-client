// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  {
    ...expoConfig,
    extends: [...(expoConfig.extends || []), 'prettier'],
    plugins: [...(expoConfig.plugins || []), 'prettier'],
    rules: {
      ...(expoConfig.rules || {}),
      'prettier/prettier': 'error',
    },
  },
  {
    ignores: ['dist/*'],
  },
]);
