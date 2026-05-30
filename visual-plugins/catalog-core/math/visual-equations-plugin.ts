import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildInlineEquationBlock, buildDisplayMathBlock } from "../../common/export/latex-block.js";
import { MathEngine } from "../../engines/math-engine/engine.js";
import type { MathEngineDocument } from "../../engines/math-engine/types.js";

const engine = new MathEngine();

export class VisualEquationsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "visual-equations";
  readonly displayName = "Visual Equations";
  readonly description = "Build mathematical equations, expressions, and formulas with a visual editor. Outputs LaTeX native.";
  readonly category = "mathematics" as const;
  readonly engineId = "math-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["amsmath", "amssymb"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: MathEngineDocument = {
      engineId: "math-engine",
      version: "1.0.0",
      mode: "equation",
      numbered: true,
      tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "equation");
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: MathEngineDocument = {
      engineId: "math-engine",
      version: "1.0.0",
      mode: "equation",
      numbered: true,
      tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "equation");
  }

  async validate(result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string {
    return result.latexBlock;
  }
}

export class MatricesPlugin implements VisualDiagramPlugin {
  readonly pluginId = "matrices-determinants";
  readonly displayName = "Matrices & Determinants";
  readonly description = "Create matrices and determinants of any size with visual cell editing.";
  readonly category = "mathematics" as const;
  readonly engineId = "math-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["amsmath"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: MathEngineDocument = {
      engineId: "math-engine",
      version: "1.0.0",
      mode: "matrix",
      numbered: false,
      tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "matrix");
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "matrix", numbered: false, tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "matrix");
  }

  async validate(_result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string {
    return result.latexBlock;
  }
}

export class SystemOfEquationsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "systems-of-equations";
  readonly displayName = "Systems of Equations";
  readonly description = "Build systems of linear or nonlinear equations with aligned formatting.";
  readonly category = "mathematics" as const;
  readonly engineId = "math-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["amsmath"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "system", numbered: false, tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "system");
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "system", numbered: false, tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "system");
  }

  async validate(_result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string {
    return result.latexBlock;
  }
}

export class PiecewiseFunctionsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "piecewise-functions";
  readonly displayName = "Piecewise Functions";
  readonly description = "Define functions by cases or parts with a visual row editor.";
  readonly category = "mathematics" as const;
  readonly engineId = "math-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["amsmath"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "cases", numbered: false, tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "cases");
  }

  async edit(existingFigurePath: string): Promise<VisualFigureResult> {
    const figureId = figureIdFromPath(existingFigurePath);
    const doc: MathEngineDocument = {
      engineId: "math-engine", version: "1.0.0",
      mode: "cases", numbered: false, tree: [],
    };
    const exported = await engine.export(doc, "latex");
    return buildResult(figureId, this.pluginId, exported.content, exported.requiredPackages, doc, "cases");
  }

  async validate(_result: VisualFigureResult): Promise<ValidationResult> {
    return { valid: true, issues: [] };
  }

  exportLatexBlock(result: VisualFigureResult): string {
    return result.latexBlock;
  }
}

function generateFigureId(): string {
  const n = Math.floor(Math.random() * 9000) + 1000;
  return `fig_${n}`;
}

function figureIdFromPath(path: string): string {
  const match = path.match(/fig_\d+/);
  return match ? match[0] : generateFigureId();
}

function buildResult(
  figureId: string,
  pluginId: string,
  latexContent: string,
  requiredPackages: readonly string[],
  doc: MathEngineDocument,
  variant: string,
): VisualFigureResult {
  const texPath = `texisstudio-assets/figures/${figureId}/output.tex`;
  const block = variant === "equation" || variant === "align"
    ? buildInlineEquationBlock(figureId, latexContent)
    : buildDisplayMathBlock(figureId, latexContent);

  return {
    figureId,
    pluginId,
    engineId: "math-engine",
    latexBlock: block,
    requiredPackages,
    sourcePath: `texisstudio-assets/figures/${figureId}/source.json`,
    outputPaths: { tex: texPath },
    warnings: [],
  };
}
