import fs from 'node:fs'
import url from 'node:url'
import path from 'node:path'

async function generate() {
	const __dirname = url.fileURLToPath(new URL('.', import.meta.url))
	const rules = fs.readdirSync(path.resolve(__dirname, '../src/rules'))

	const allRules = []
	const recommendedRules = []

	rules.forEach(async (rule) => {
		const ruleName = rule.replace(/\.ts$/, '')
		const content = await import(path.resolve(__dirname, `../src/rules/${ruleName}.ts`))

		if (content.default.meta.docs.recommended) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			recommendedRules.push({
				name: ruleName,
				rule: content.default
			})
		} else {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			allRules.push({
				name: ruleName,
				rule: content.default
			})
		}
	})

	console.log(recommendedRules)
}

generate()
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
