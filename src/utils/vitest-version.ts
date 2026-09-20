import { findPackageJSON } from 'node:module'
import fs from 'node:fs'

export const LEGACY_BENCHMARK_VERSION = 4
export const BENCHMARK_API_REWRITE_VERSION = 5
export const determineVitestMajorVersion = (filepath: string) => {
  const vitestPackageJsonPath = findPackageJSON('vitest', filepath)
  const vitestPackage = JSON.parse(
    fs.readFileSync(vitestPackageJsonPath!, 'utf-8'),
  )

  return Number.parseInt((vitestPackage.version as string).split('.')[0], 10)
}
