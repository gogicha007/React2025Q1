import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import react from 'eslint-plugin-react';
import tseslint from 'typescript-eslint';
import eslintPluginPrettier from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
  { ignores: ['.next', 'dist', 'node_modules'] },
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strict,
      eslintPluginPrettier,
    ],
    files: ['**/*.{ts,tsx}'],
    ignores: ['**/mock*.ts'],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      
      // Remove Next.js specific rules
      
      // Remove Vite-specific rules
      'react-refresh/only-export-components': 'off',
      'react-compiler/react-compiler': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  }
);