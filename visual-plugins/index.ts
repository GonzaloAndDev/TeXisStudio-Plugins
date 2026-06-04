export { PLUGIN_REGISTRY } from "./plugin-registry.js";
export type { PluginRegistryEntry } from "./plugin-registry.js";
export type {
  VisualDiagramPlugin,
  VisualFigureResult,
  ValidationResult,
  ValidationIssue,
  PluginCategory,
  QualityLevel,
} from "./common/contracts/index.js";
export { buildLatexInputBlock } from "./common/export/latex-block.js";
export { setPluginLocale } from "./i18n/index.js";
