import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import reactPlugin from 'eslint-plugin-react';
import unusedImports from 'eslint-plugin-unused-imports';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    files: ['scripts/**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },

  {
    plugins: {
      react: reactPlugin,
      'unused-imports': unusedImports,
    },

    rules: {
      /**
       * 🔥 Remove unused imports automatically
       */
      'unused-imports/no-unused-imports': 'error',

      /**
       * Disable default unused vars (conflicts)
       */
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',

      /**
       * Better unused vars handling
       */
      'unused-imports/no-unused-vars': [
        'warn',
        {
          vars: 'all',
          varsIgnorePattern: '^_',
          args: 'after-used',
          argsIgnorePattern: '^_',
        },
      ],

      /**
       * JSX spacing consistency
       */
      'react/jsx-curly-spacing': ['error', { when: 'never' }],

      'react/jsx-tag-spacing': [
        'error',
        {
          closingSlash: 'never',
          beforeSelfClosing: 'always',
          afterOpening: 'never',
          beforeClosing: 'never',
        },
      ],

      /**
       * Clean JSX habits
       */
      'react/jsx-no-useless-fragment': 'warn',

      /**
       * Catch weird invisible spaces
       */
      'no-irregular-whitespace': 'error',
    },
  },

  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
