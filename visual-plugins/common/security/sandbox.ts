export interface PluginPermissions {
  canWriteToProjectFolder: boolean;
  canReadProjectFiles: boolean;
  canExecuteLatex: boolean;
  allowedExternalTools: readonly string[];
  canFetchNetwork: boolean;
}

export const OFFICIAL_PLUGIN_PERMISSIONS: PluginPermissions = {
  canWriteToProjectFolder: true,
  canReadProjectFiles: true,
  canExecuteLatex: true,
  allowedExternalTools: ["pdflatex", "lualatex", "xelatex", "inkscape", "rsvg-convert"],
  canFetchNetwork: false,
};

export const EXPERIMENTAL_PLUGIN_PERMISSIONS: PluginPermissions = {
  canWriteToProjectFolder: true,
  canReadProjectFiles: false,
  canExecuteLatex: true,
  allowedExternalTools: [],
  canFetchNetwork: false,
};

export function assertPermission(
  permissions: PluginPermissions,
  action: keyof Omit<PluginPermissions, "allowedExternalTools">,
  pluginId: string,
): void {
  if (!permissions[action]) {
    throw new Error(`Plugin "${pluginId}" does not have permission: ${action}`);
  }
}

export function assertToolAllowed(
  permissions: PluginPermissions,
  tool: string,
  pluginId: string,
): void {
  if (!permissions.allowedExternalTools.includes(tool)) {
    throw new Error(`Plugin "${pluginId}" is not allowed to use external tool: ${tool}`);
  }
}
