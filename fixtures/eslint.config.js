// import tseslint from 'typescript-eslint'
// import js from '@eslint/js'
// import vitest from 'eslint-plugin-vitest'
//
// export default tseslint.config(
//   js.configs.recommended,
//   {
//     files: ['**/*.js'],
//     languageOptions: {
//       sourceType: 'module',
//       ecmaVersion: 2024,
//       parserOptions: {
//         ecmaFeatures: {
//           impliedStrict: true
//         }
//       }
//     },
//
//     // (first parameter of a rule) 0: off, 1: warning, 2: error
//     rules: {
//       // my rules…
//     }
//   },
//   {
//     files: ['**/*.test.js'],
//     plugins: { vitest },
//     rules: {
//       ...vitest.configs.recommended.rules
//     },
//     languageOptions: {
//       globals: {
//         ...vitest.environments.env.globals
//       }
//     }
//   }
// )
