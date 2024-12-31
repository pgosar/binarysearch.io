import typescriptEslint from '@typescript-eslint/eslint-plugin';
import unusedImports from 'eslint-plugin-unused-imports';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import jest from 'eslint-plugin-jest';
import jestFormatting from 'eslint-plugin-jest-formatting';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

const config = [
  {
    ignores: ['**/node_modules/', '**/build/', '**/dist/', '**/public/', '**/*.md', '.yarn/', '.next/'],
  },
  ...compat.extends('next/core-web-vitals', 'plugin:prettier/recommended'),
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],
    },
  },
  ...compat.extends('next/core-web-vitals', 'plugin:prettier/recommended').map((config) => ({
    ...config,
    files: ['**/*.ts', '**/*.tsx'],
  })),
  {
    files: ['**/*.ts', '**/*.tsx'],

    plugins: {
      '@typescript-eslint': typescriptEslint,
      'unused-imports': unusedImports,
      'simple-import-sort': simpleImportSort,
    },

    languageOptions: {
      ecmaVersion: 5,
      sourceType: 'script',

      parserOptions: {
        project: './tsconfig.json',
      },
    },

    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          endOfLine: 'auto',
        },
      ],

      'no-alert': 'off',
      'react/destructuring-assignment': 'off',
      'react/require-default-props': 'off',
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react-hooks/exhaustive-deps': 'off',
      '@next/next/no-img-element': 'off',
      '@typescript-eslint/comma-dangle': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      'import/prefer-default-export': 'off',
      'simple-import-sort/imports': 'error',
      'simple-import-sort/exports': 'error',
      'unused-imports/no-unused-imports': 'error',

      'unused-imports/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],
    },
  },
  ...compat
    .extends(
      'plugin:jest/recommended',
      'plugin:jest-formatting/recommended',
      'plugin:testing-library/react',
      'plugin:jest-dom/recommended',
    )
    .map((config) => ({
      ...config,
      files: ['**/*.test.ts', '**/*.test.tsx'],
    })),
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],

    plugins: {
      jest,
      'jest-formatting': jestFormatting,
      'testing-library': testingLibrary,
      'jest-dom': jestDom,
    },
  },
];

export default config;
