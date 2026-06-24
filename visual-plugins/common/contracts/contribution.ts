import type { ValidationIssue, ValidationResult } from "./types.js";
import type { VisualFigureResult } from "./plugin.js";

export const DOCUMENT_CONTRIBUTION_VERSION = "2.0" as const;

export type ContributionTrust = "official" | "community" | "experimental";

export interface ContributionAsset {
  role: "latex" | "pdf" | "svg" | "png" | "source" | "preview";
  path: string;
}

/**
 * Versioned, serializable boundary between a visual plugin and the document
 * assembler. Plugins contribute owned artifacts; they never mutate the
 * preamble, execute commands, or address files outside their asset folder.
 */
export interface DocumentContribution {
  contractVersion: typeof DOCUMENT_CONTRIBUTION_VERSION;
  contributionId: string;
  pluginId: string;
  engineId: string;
  trust: ContributionTrust;
  artifactLatex: string;
  requiredPackages: readonly string[];
  editableSource: string;
  assets: readonly ContributionAsset[];
  warnings: readonly string[];
}

const FORBIDDEN_COMMANDS: ReadonlyArray<[RegExp, string]> = [
  [/\\(?:write18|openout|catcode)\b/i, "UNSAFE_TEX_COMMAND"],
  [/\\documentclass\b/i, "DOCUMENT_BOUNDARY"],
  [/\\(?:begin|end)\s*\{document\}/i, "DOCUMENT_BOUNDARY"],
  [/\\usepackage\b/i, "PREAMBLE_MUTATION"],
];

function isUnsafePath(path: string): boolean {
  const normalized = path.trim().replaceAll("\\", "/");
  return (
    normalized.startsWith("/") ||
    normalized.startsWith("~/") ||
    /^[a-z]:\//i.test(normalized) ||
    normalized.split("/").includes("..")
  );
}

function latexPaths(source: string): string[] {
  const paths: string[] = [];
  const command = /\\(?:input|include|includegraphics)(?:\[[^\]]*\])?\s*\{([^}]+)\}/gi;
  let match: RegExpExecArray | null;
  while ((match = command.exec(source)) !== null) {
    if (match[1]) paths.push(match[1]);
  }
  return paths;
}

export function validateDocumentContribution(
  contribution: DocumentContribution,
): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (contribution.contractVersion !== DOCUMENT_CONTRIBUTION_VERSION) {
    issues.push({
      code: "CONTRACT_VERSION",
      message: `Unsupported contribution contract: ${contribution.contractVersion}`,
      severity: "error",
    });
  }
  if (!contribution.editableSource.trim()) {
    issues.push({
      code: "EDITABLE_SOURCE_REQUIRED",
      message: "A professional contribution must retain editable source.",
      severity: "error",
    });
  }

  for (const [pattern, code] of FORBIDDEN_COMMANDS) {
    if (pattern.test(contribution.artifactLatex)) {
      issues.push({
        code,
        message: "Plugin LaTeX crosses the document assembler boundary.",
        severity: "error",
      });
    }
  }

  const declaredPaths = new Set(contribution.assets.map((asset) => asset.path));
  for (const asset of contribution.assets) {
    if (isUnsafePath(asset.path)) {
      issues.push({
        code: "UNSAFE_ASSET_PATH",
        message: `Asset path must be project-relative: ${asset.path}`,
        severity: "error",
      });
    }
  }
  for (const path of latexPaths(contribution.artifactLatex)) {
    if (isUnsafePath(path)) {
      issues.push({
        code: "UNSAFE_LATEX_PATH",
        message: `LaTeX path must be project-relative: ${path}`,
        severity: "error",
      });
    } else if (!declaredPaths.has(path)) {
      issues.push({
        code: "UNDECLARED_ASSET",
        message: `LaTeX references an undeclared plugin asset: ${path}`,
        severity: "error",
      });
    }
  }

  return {
    valid: !issues.some((issue) => issue.severity === "error"),
    issues,
  };
}

export function toDocumentContribution(
  result: VisualFigureResult,
  trust: ContributionTrust,
): DocumentContribution {
  const assets: ContributionAsset[] = [
    { role: "source", path: result.sourcePath },
  ];
  for (const [role, path] of Object.entries(result.outputPaths)) {
    if (path) assets.push({ role: role as ContributionAsset["role"], path });
  }

  return {
    contractVersion: DOCUMENT_CONTRIBUTION_VERSION,
    contributionId: result.figureId,
    pluginId: result.pluginId,
    engineId: result.engineId,
    trust,
    artifactLatex: result.latexBlock,
    requiredPackages: result.requiredPackages,
    editableSource: result.sourceJson ?? "",
    assets,
    warnings: result.warnings,
  };
}
