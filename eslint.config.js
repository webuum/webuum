import { defineConfig } from 'eslint/config'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default defineConfig([
  {
    // examples are self-contained projects with their own eslint setup
    ignores: ['**/dist/**', '**/.astro/**', 'examples/**', 'coverage/**'],
  },
  {
    plugins: { js },
    extends: [
      'js/recommended',
      stylistic.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
  },
])
