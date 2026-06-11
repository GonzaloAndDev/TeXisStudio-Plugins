export { PLUGIN_REGISTRY, getRegistryEntry, getPluginsByUserLevel } from "./plugin-registry.js";
export type { PluginRegistryEntry } from "./plugin-registry.js";
export type {
  VisualDiagramPlugin,
  VisualFigureResult,
  ValidationResult,
  ValidationIssue,
  PluginCategory,
  QualityLevel,
  UserLevel,
  EditorType,
  VisualEditorEngineId,
  EditorCapabilities,
  TechnicalField,
  PluginEditingMetadata,
} from "./common/contracts/index.js";
export {
  registerEditorMetadata,
  getEditorMetadata,
  getAllEditorMetadata,
} from "./common/contracts/index.js";
export { buildLatexInputBlock } from "./common/export/latex-block.js";
export { setPluginLocale } from "./i18n/index.js";
