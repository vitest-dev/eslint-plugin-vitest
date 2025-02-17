import { defineBuildConfig } from 'unbuild'
import packageJson from './package.json' with { type: 'json' }

export default defineBuildConfig({
  entries: ['./src/index.ts'],
  rootDir: import.meta.dirname,
  name: packageJson.name,
  declaration: 'node16',
  externals: ['@typescript-eslint/utils'],
  clean: true,
  rollup: {
    emitCJS: true,
    esbuild: {
      minify: true
    }
  }
})
