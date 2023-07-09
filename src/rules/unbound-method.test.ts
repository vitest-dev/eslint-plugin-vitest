import { ESLintUtils } from '@typescript-eslint/utils'
import unboundMethod from './unbound-method'

const ruleTester = new ESLintUtils.RuleTester({
	parser: '@typescript-eslint/parser',
	parserOptions: {
		sourceType: 'module',
		project: './tsconfig.json'
	}
})

ruleTester.run('unbound-method', unboundMethod, {
	valid: [],
	invalid: []
})
