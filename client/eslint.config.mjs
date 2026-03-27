import globals from 'globals';
import eslintJs from '@eslint/js';
import jsdoc from 'eslint-plugin-jsdoc';
import eslintTs from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import reactPlugin from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import unusedImportsPlugin from 'eslint-plugin-unused-imports';
// ----------------------------------------------------------------------

/**
 * common
 * 0 " 'off'
 * 1 " 'warn'
 * 2 " 'error'
 * from 'react', 'eslint-plugin-react-hooks'...
 */
const commonRules = () => ({
  ...reactHooksPlugin.configs.recommended.rules,
  'func-names': 'warn',
  'no-bitwise': 'error',
  'no-unused-vars': 'off',
  'object-shorthand': 'warn',
  'no-useless-rename': 'warn',
  'default-case-last': 'error',
  'consistent-return': 'error',
  'no-constant-condition': 'warn',
  'default-case': ['error', { commentPattern: '^no default$' }],
  'lines-around-directive': ['error', { before: 'always', after: 'always' }],
  'arrow-body-style': ['error', 'as-needed', { requireReturnForObjectLiteral: false }],
  // react
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
  'react-hooks/immutability': 'warn',
  'react-hooks/refs': 'warn',
  'react-hooks/set-state-in-effect': 'warn',
  'react/jsx-key': 'warn',
  'react/prop-types': 'off',
  'react/display-name': 'off',
  'react/no-children-prop': 'off',
  'react/jsx-boolean-value': 'error',
  'react/self-closing-comp': 'error',
  'react/react-in-jsx-scope': 'off',
  'react/jsx-no-useless-fragment': ['warn', { allowExpressions: true }],
  'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
  // jsdoc
  'jsdoc/require-description': 'error',
  'jsdoc/check-values': 'warn',
  // typescript
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-explicit-any': 'warn',
  '@typescript-eslint/no-empty-object-type': 'off',
  '@typescript-eslint/consistent-type-imports': 'warn',
  '@typescript-eslint/no-unused-vars': ['warn', { args: 'none' }],
});

/**
 * from 'eslint-plugin-import'.
 */
const importRules = () => ({
  ...importPlugin.configs.recommended.rules,
  'import/no-unresolved': ['off', { caseSensitive: true }],
  'import/named': 'off',
  'import/export': 'off',
  'import/default': 'off',
  'import/namespace': 'off',
  'import/no-absolute-path': 'off',
  'import/no-named-as-default': 'off',
  'import/newline-after-import': 'error',
  'import/no-named-as-default-member': 'off',
  'import/no-cycle': [
    'off', // disabled if slow
    { maxDepth: '∞', ignoreExternal: false, allowUnsafeDynamicCyclicDependency: false },
  ],
});

/**
 * unused imports
 * from 'eslint-plugin-unused-imports'.
 */
const unusedImportsRules = () => ({
  'unused-imports/no-unused-imports': 'warn',
  'unused-imports/no-unused-vars': [
    'off',
    { vars: 'all', varsIgnorePattern: '^_', args: 'after-used', argsIgnorePattern: '^_' },
  ],
});

/**
 * sort or imports/exports
 * from 'eslint-plugin-perfectionist'.
 */
const sortImportsRules = () => ({
  'perfectionist/sort-named-imports': ['warn', { type: 'line-length', order: 'asc' }],
  'perfectionist/sort-named-exports': ['warn', { type: 'line-length', order: 'asc' }],
  'perfectionist/sort-imports': [
    2,
    {
      order: 'asc',
      ignoreCase: true,
      type: 'line-length',
      environment: 'node',
      maxLineLength: undefined,
      newlinesBetween: 1,
      internalPattern: ['^src/.+'],
      groups: [
        'style',
        'side-effect',
        'type',
        ['builtin', 'external'],
        'mui',
        'routes',
        'hooks',
        'utils',
        'components',
        'sections',
        'internal',
        ['parent', 'sibling', 'index'],
        'unknown',
      ],
      customGroups: [
        { groupName: 'mui', elementNamePattern: ['^@mui/.+'] },
        { groupName: 'hooks', elementNamePattern: ['^src/hooks/.+'] },
        { groupName: 'utils', elementNamePattern: ['^src/utils/.+'] },
        { groupName: 'routes', elementNamePattern: ['^src/routes/.+'] },
        { groupName: 'sections', elementNamePattern: ['^src/sections/.+'] },
        { groupName: 'components', elementNamePattern: ['^src/components/.+'] },
      ],
    },
  ],
});

/**
 * Custom ESLint configuration.
 */
export const customConfig = {
  plugins: {
    'react-hooks': reactHooksPlugin,
    'unused-imports': unusedImportsPlugin,
    eslintTs,
    perfectionist: perfectionistPlugin,
    import: importPlugin,
    jsdoc,
    reactPlugin,
  },

  rules: {
    ...commonRules(),
    ...importRules(),
    ...unusedImportsRules(),
    ...sortImportsRules(),
  },
};

// ----------------------------------------------------------------------

export default defineConfig([
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { ignores: ['*', '!src/', '!eslint.config.*'] },
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    linterOptions: {
      reportUnusedInlineConfigs: 'off',
    },
    settings: {
      react: { version: '19' },
      //react: { version: 'detect' },
      //'import/extensions': ['.js', '.jsx'],
      settings: {
        'import/resolver': {
          node: {
            extensions: [{ '.js': 'never', '.jsx': 'never' }],
          },
        },
      },
    },
  },
  eslintJs.configs.recommended,
  eslintTs.configs.recommended,
  reactPlugin.configs.flat.recommended,
  customConfig,
]);
