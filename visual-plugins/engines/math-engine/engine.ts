import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../../visual-plugins/common/contracts/index.js";
import type { MathEngineDocument, MatrixDocument, SystemDocument } from "./types.js";
import { serializeNode, wrapInEnvironment } from "./serializer.js";
import { MATH_ENGINE_META } from "./index.js";

export class MathEngine implements VisualEngine {
  readonly engineId = MATH_ENGINE_META.engineId;
  readonly displayName = MATH_ENGINE_META.displayName;
  readonly supportedOutputs = MATH_ENGINE_META.supportedOutputs;
  readonly requiredPackages = MATH_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) {
      return input.source.data as MathEngineDocument;
    }
    const doc: MathEngineDocument = {
      engineId: "math-engine",
      version: "1.0.0",
      mode: "equation",
      numbered: true,
      tree: [],
    };
    return doc;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as MathEngineDocument;
    const issues = [];

    if (doc.engineId !== "math-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by math-engine", severity: "error" as const });
    }
    if (!doc.mode) {
      issues.push({ code: "MISSING_MODE", message: "Math mode is required", severity: "error" as const });
    }
    if (!doc.tree || !Array.isArray(doc.tree)) {
      issues.push({ code: "MISSING_TREE", message: "Math expression tree is required", severity: "error" as const });
    }

    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    const latex = this.generateLatex(document as MathEngineDocument);
    return {
      format: "svg",
      data: latex,
    };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    const doc = document as MathEngineDocument;
    const content = this.generateLatex(doc);

    const packages = ["amsmath", "amssymb"];
    if (doc.mode === "cases") packages.push("cases");

    return {
      format: "latex",
      content,
      requiredPackages: packages,
      warnings: [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return {
      pluginId: "math-engine",
      engineId: "math-engine",
      version: "1.0.0",
      data: document,
    };
  }

  generateLatex(doc: MathEngineDocument): string {
    if (doc.mode === "matrix") {
      return this.generateMatrixLatex(doc as MatrixDocument);
    }
    if (doc.mode === "system") {
      return this.generateSystemLatex(doc as SystemDocument);
    }

    const separator = doc.mode === "align" || doc.mode === "gather"
      ? " \\\\\n  "
      : " ";
    const body = doc.tree.map(serializeNode).join(separator);
    return wrapInEnvironment(body, doc.mode, doc.numbered, doc.label);
  }

  private generateMatrixLatex(doc: MatrixDocument): string {
    const cells = doc.cells ?? Array.from({ length: doc.rows ?? 2 }, () => Array(doc.cols ?? 2).fill("0"));
    const rows = cells.map(row => row.join(" & ")).join(" \\\\\n    ");
    const [open, close] = ({
      paren:   ["\\begin{pmatrix}", "\\end{pmatrix}"],
      bracket: ["\\begin{bmatrix}", "\\end{bmatrix}"],
      brace:   ["\\begin{Bmatrix}", "\\end{Bmatrix}"],
      vert:    ["\\begin{vmatrix}", "\\end{vmatrix}"],
      none:    ["\\begin{matrix}",  "\\end{matrix}"],
    } as Record<string, [string, string]>)[doc.delimiter ?? "paren"] ?? ["\\begin{pmatrix}", "\\end{pmatrix}"];
    const body = `${open}\n    ${rows}\n${close}`;
    return wrapInEnvironment(body, "display", false);
  }

  private generateSystemLatex(doc: SystemDocument): string {
    const body = doc.equations.join(" \\\\\n  ");
    return wrapInEnvironment(body, "align", doc.numbered, doc.label);
  }
}
