import type { VisualEngine, EngineDocument, EngineInput, ValidationResult, PreviewResult, ExportResult, EditableSource } from "../../common/contracts/index.js";
import type { NotationDocument } from "./types.js";
import { NOTATION_ENGINE_META } from "./index.js";

const ENV_MAP: Record<string, [string, string[]]> = {
  theorem:     ["theorem",     ["amsthm"]],
  lemma:       ["lemma",       ["amsthm"]],
  corollary:   ["corollary",   ["amsthm"]],
  definition:  ["definition",  ["amsthm"]],
  remark:      ["remark",      ["amsthm"]],
  proof:       ["proof",       ["amsthm"]],
  // El cuerpo se genera con \begin{algorithmic}[1] (sintaxis de algpseudocode/
  // algorithmicx), NO con algorithm2e (paquete incompatible que NO define
  // `algorithmic` → el documento no compilaba). El float `algorithm` lo aporta
  // el paquete `algorithm`.
  algorithm:   ["algorithm",   ["algorithm", "algpseudocode"]],
  pseudocode:  ["algorithm",   ["algorithm", "algpseudocode"]],
  code:        ["lstlisting",  ["listings"]],
  glossary:    ["description", []],
  nomenclature:["nomenclature",["nomencl"]],
};

function generateLatex(doc: NotationDocument): string {
  const [envName] = ENV_MAP[doc.type] ?? ["verbatim", []];
  const numbered = doc.numbered ? "" : "*";
  const titleOpt = doc.title ? `[${doc.title}]` : "";
  const label = doc.label ? `\\label{${doc.label}}\n` : "";

  if (doc.type === "code") {
    const lang = doc.language ? `[language=${doc.language}]` : "";
    return `\\begin{lstlisting}${lang}\n${doc.content}\n\\end{lstlisting}`;
  }

  if (doc.type === "algorithm" || doc.type === "pseudocode") {
    // `algorithm*` no es "sin numerar" (es el float a doble columna); usar el
    // sufijo estrella aquí rompía el entorno. El float `algorithm` siempre va
    // sin estrella; la numeración del algoritmo la gobierna \caption.
    return [
      `\\begin{algorithm}`,
      doc.title ? `\\caption{${doc.title}}` : "",
      label,
      `\\begin{algorithmic}[1]`,
      doc.content,
      `\\end{algorithmic}`,
      `\\end{algorithm}`,
    ].filter(Boolean).join("\n");
  }

  return [
    `\\begin{${envName}${numbered}}${titleOpt}`,
    label,
    doc.content,
    `\\end{${envName}${numbered}}`,
  ].filter(Boolean).join("\n");
}

export class NotationEngine implements VisualEngine {
  readonly engineId = NOTATION_ENGINE_META.engineId;
  readonly displayName = NOTATION_ENGINE_META.displayName;
  readonly supportedOutputs = NOTATION_ENGINE_META.supportedOutputs;
  readonly requiredPackages = NOTATION_ENGINE_META.requiredPackages;

  async createDocument(input?: EngineInput): Promise<EngineDocument> {
    if (input?.source?.data) return input.source.data as NotationDocument;
    return { engineId: "notation-engine", version: "1.0.0", type: "definition", content: "", numbered: true } as NotationDocument;
  }

  async validate(document: EngineDocument): Promise<ValidationResult> {
    const doc = document as NotationDocument;
    const issues = [];
    if (doc.engineId !== "notation-engine") {
      issues.push({ code: "WRONG_ENGINE", message: "Document was not created by notation-engine", severity: "error" as const });
    }
    return { valid: issues.filter(i => i.severity === "error").length === 0, issues };
  }

  async renderPreview(document: EngineDocument): Promise<PreviewResult> {
    return { format: "svg", data: generateLatex(document as NotationDocument) };
  }

  async export(document: EngineDocument, _target: "latex" | "pdf" | "svg" | "png"): Promise<ExportResult> {
    const doc = document as NotationDocument;
    const [, pkgs] = ENV_MAP[doc.type] ?? ["verbatim", []];
    return {
      format: "latex",
      content: generateLatex(doc),
      requiredPackages: pkgs,
      warnings: [],
    };
  }

  async getEditableSource(document: EngineDocument): Promise<EditableSource> {
    return { pluginId: "notation-engine", engineId: "notation-engine", version: "1.0.0", data: document };
  }
}
