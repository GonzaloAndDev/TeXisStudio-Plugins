import type { FigureManifest } from "./schema.js";
import type { ValidationResult, ValidationIssue } from "../contracts/types.js";

const REQUIRED_FIELDS: (keyof FigureManifest)[] = [
  "id",
  "pluginId",
  "pluginVersion",
  "engineId",
  "title",
  "preferredOutput",
  "sourceFile",
  "requiredPackages",
  "createdAt",
  "updatedAt",
  "qualityLevel",
  "editable",
];

const VALID_OUTPUT_FORMATS = ["latex", "pdf", "svg", "png"] as const;
const VALID_QUALITY_LEVELS = ["official-core", "official-extended", "experimental"] as const;
const FIGURE_ID_RE = /^fig_\d{4,}$/;

export function validateManifest(manifest: unknown): ValidationResult {
  const issues: ValidationIssue[] = [];

  if (typeof manifest !== "object" || manifest === null) {
    return { valid: false, issues: [{ code: "INVALID_TYPE", message: "Manifest must be a JSON object", severity: "error" }] };
  }

  const m = manifest as Record<string, unknown>;

  for (const field of REQUIRED_FIELDS) {
    if (m[field] === undefined || m[field] === null) {
      issues.push({ code: "MISSING_FIELD", message: `Required field "${field}" is missing`, severity: "error", field });
    }
  }

  if (typeof m["id"] === "string" && !FIGURE_ID_RE.test(m["id"])) {
    issues.push({ code: "INVALID_ID", message: `Figure ID must match pattern fig_NNNN (e.g. fig_0001)`, severity: "error", field: "id" });
  }

  if (typeof m["preferredOutput"] === "string" && !VALID_OUTPUT_FORMATS.includes(m["preferredOutput"] as never)) {
    issues.push({ code: "INVALID_OUTPUT", message: `preferredOutput must be one of: ${VALID_OUTPUT_FORMATS.join(", ")}`, severity: "error", field: "preferredOutput" });
  }

  if (typeof m["qualityLevel"] === "string" && !VALID_QUALITY_LEVELS.includes(m["qualityLevel"] as never)) {
    issues.push({ code: "INVALID_QUALITY", message: `qualityLevel must be one of: ${VALID_QUALITY_LEVELS.join(", ")}`, severity: "error", field: "qualityLevel" });
  }

  if (!Array.isArray(m["requiredPackages"])) {
    issues.push({ code: "INVALID_PACKAGES", message: "requiredPackages must be an array", severity: "error", field: "requiredPackages" });
  }

  if (m["editable"] !== true) {
    issues.push({ code: "NOT_EDITABLE", message: "Official plugins must set editable to true", severity: "warning", field: "editable" });
  }

  if (!m["latexFile"] && !m["pdfFile"] && !m["svgFile"]) {
    issues.push({ code: "NO_VECTOR_OUTPUT", message: "At least one vector output (latex, pdf, or svg) must be declared", severity: "error" });
  }

  return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
}
