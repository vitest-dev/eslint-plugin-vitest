// @ts-check

import eslint from '@eslint/js'
import eslintPlugin from 'eslint-plugin-eslint-plugin'
import nodePlugin from 'eslint-plugin-n'
import stylistic from '@stylistic/eslint-plugin'
import tseslint from 'typescript-eslint'
import babelParser from '@babel/eslint-parser'

export default [
  {
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        requireConfigFile: false,
        sourceType: 'module',
        babelOptions: {
          babelrc: false,
          configFile: false,
          presets: ['@babel/preset-env'],
        },
      },
    },
  },
  ...tseslint.config(eslint.configs.recommended,
    ...tseslint.configs.recommended),
  eslintPlugin.configs['flat/recommended'],
  nodePlugin.configs['flat/recommended-script'],
  stylistic.configs.customize({
    quotes: 'single',
    semi: false,
    commaDangle: 'always-multiline',
  }),
]
