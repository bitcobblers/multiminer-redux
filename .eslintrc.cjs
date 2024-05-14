module.exports = {
  plugins: [
    '@typescript-eslint',
    '@stylistic/ts',
  ],
  extends: [
    'airbnb',
    'airbnb-typescript',
    // 'prettier',
  ],
  rules: {
    // A temporary hack related to IDE not resolving correct package.json
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    // Since React 17 and typescript 4.1 you can safely disable the rule
    'react/react-in-jsx-scope': 'off',
    'react/jsx-curly-newline': 'off',
    'react/jsx-no-useless-fragment': 'off',
    'react/jsx-one-expression-per-line': 'off',
    'react/function-component-definition': 'off',
    'jest/no-commented-out-tests': 'off',
    'promise/catch-or-return': 'off',
    'promise/always-return': 'off',
    'function-paren-newline': 'off',
    'implicit-arrow-linebreak': 'off',
    'no-unused-vars': 'off',
    'no-console': 'off',
    'operator-linebreak': 'off',
    'object-curly-newline': 'off',
    '@typescript-eslint/no-unused-vars': ['warn'],
  },
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
    createDefaultProgram: true,
  },
  settings: {
    'import/resolver': {
      // See https://github.com/benmosher/eslint-plugin-import/issues/1396#issuecomment-575727774 for line below
      node: {},
    },
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
  },
  overrides: [
    {
      extends: ['plugin:@typescript-eslint/disable-type-checked'],
      files: ['./**/vite.config.ts'],
    },
  ],
};
