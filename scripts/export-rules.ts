/*
 * This script generates the `src/rules/index.ts` file which exports all available rules.
 *
 * Run it with `pnpm update:rules`.
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import url from 'node:url'
import prettier from 'prettier'

const IGNORED_RULE_FILES = ['unbound-method.ts']

const rulesDir = path.resolve(import.meta.dirname, '../src/rules')
const files = await fs.readdir(rulesDir)
const ruleFiles = files.filter(
  (fileName) => !['index.ts', ...IGNORED_RULE_FILES].includes(fileName),
)

const imports = []
const rules = new Map<string, string>()

for (const fileName of ruleFiles) {
  const baseName = fileName.slice(0, -3)
  const importName = baseName.replace(/-./g, (x) => x[1].toUpperCase())
  imports.push(`import ${importName} from './${baseName}'`)
  rules.set(baseName, importName)
}

const rulesProps = []

for (const [name, rule] of rules) {
  rulesProps.push(`'${name}': ${rule},`)
}

const output = `
    import { Linter } from 'eslint'
    ${imports.join('\n')}

    export const rules = {
        ${rulesProps.join('\n')}
    } as const

    export type RuleList = Partial<Record<keyof typeof rules, Linter.StringSeverity>>
`

const indexPath = path.join(rulesDir, 'index.ts')

const formattedOutput = await prettier.format(output, {
  ...(await prettier.resolveConfig(indexPath)),
  filepath: indexPath,
})

await fs.writeFile(indexPath, formattedOutput)

console.log(
  `File ${terminalLink(path.relative(process.cwd(), indexPath), url.pathToFileURL(indexPath).href)} has been updated.`,
)

function terminalLink(name: string, url: string) {
  return `\x1b]8;;${url}\x1b\\${name}\x1b]8;;\x1b\\`
}
