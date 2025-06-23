import prettier from 'prettier'

/** @type {import('eslint-doc-generator').GenerateOptions} */
const config = {
  configEmoji: [
    ['recommended', '✅'],
    ['legacy-recommended', '☑️'],
    ['legacy-all', '🌍'],
  ],
  postprocess: async (content, path) =>
    prettier.format(content, {
      ...(await prettier.resolveConfig(path)),
      parser: 'markdown',
    }),
  ruleDocTitleFormat: 'name',
}

export default config
