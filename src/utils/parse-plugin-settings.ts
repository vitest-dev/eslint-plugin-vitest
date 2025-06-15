import type { SharedConfigurationSettings } from '@typescript-eslint/utils/ts-eslint'

interface PluginSettings {
  typecheck: boolean
}

const DEFAULTS: PluginSettings = {
  typecheck: false,
}

export function parsePluginSettings(
  settings: SharedConfigurationSettings,
): PluginSettings {
  const pluginSettings =
    typeof settings.vitest !== 'object' || settings.vitest === null
      ? {}
      : settings.vitest

  return {
    ...DEFAULTS,
    ...pluginSettings,
  }
}
