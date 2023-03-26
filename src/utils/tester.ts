import { TSESLint } from '@typescript-eslint/utils'

const ruleTester = new TSESLint.RuleTester({
	parser: require.resolve('@typescript-eslint/parser')
})

export default ruleTester
