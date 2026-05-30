import type { ValidationResult, ValidationIssue } from "../contracts/types.js";

export type { ValidationResult, ValidationIssue };

const LATEX_LABEL_RE = /^[a-zA-Z][a-zA-Z0-9:._-]*$/;
const RELATIVE_PATH_RE = /^(?![\\/]|[a-zA-Z]:)/;

export function validateLabel(label: string): ValidationIssue | null {
  if (!LATEX_LABEL_RE.test(label)) {
    return { code: "INVALID_LABEL", message: `Label "${label}" contains invalid characters. Use only letters, digits, colon, dot, underscore, or hyphen.`, severity: "error", field: "label" };
  }
  return null;
}

export function validateRelativePath(path: string): ValidationIssue | null {
  if (!RELATIVE_PATH_RE.test(path)) {
    return { code: "ABSOLUTE_PATH", message: `Path "${path}" must be relative, not absolute.`, severity: "error", field: "path" };
  }
  return null;
}

export function validateRequiredPackages(packages: string[], declared: readonly string[]): ValidationIssue[] {
  return packages
    .filter(pkg => !declared.includes(pkg))
    .map(pkg => ({
      code: "MISSING_PACKAGE",
      message: `Required LaTeX package "${pkg}" is not declared in the document preamble.`,
      severity: "warning" as const,
    }));
}

export function mergeResults(...results: ValidationResult[]): ValidationResult {
  const issues = results.flatMap(r => r.issues);
  return { valid: issues.every(i => i.severity !== "error"), issues };
}
