import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { MathEngine } from "../../engines/math-engine/engine.js";
import type { MathEngineDocument, MatrixDocument, SystemDocument } from "../../engines/math-engine/types.js";

const engine = new MathEngine();

export class VisualEquationsPlugin extends BasePlugin<MathEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "visual-equations",
      displayName: "Visual Equations",
      description: "Build mathematical equations, expressions, and formulas with a visual editor. Outputs LaTeX native.",
      category: "mathematics",
      engineId: "math-engine",
      qualityLevel: "official-core",
      requiredPackages: ["amsmath", "amssymb"],
      blockKind: "raw",
      defaultCaption: "Equation.",
      defaultLabel: "eq:equation",
    }, store);
  }

  protected buildDefaultDocument(): MathEngineDocument {
    return { engineId: "math-engine", version: "1.0.0", mode: "equation", numbered: true, tree: [{ type: "symbol", content: "E = mc^2" }] };
  }
}

export class MatricesPlugin extends BasePlugin<MatrixDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "matrices-determinants",
      displayName: "Matrices & Determinants",
      description: "Create matrices and determinants of any size with visual cell editing.",
      category: "mathematics",
      engineId: "math-engine",
      qualityLevel: "official-core",
      requiredPackages: ["amsmath"],
      blockKind: "raw",
      defaultCaption: "Matrix.",
      defaultLabel: "eq:matrix",
    }, store);
  }

  protected buildDefaultDocument(): MatrixDocument {
    return {
      engineId: "math-engine", version: "1.0.0", mode: "matrix", numbered: false, tree: [],
      rows: 2, cols: 2, delimiter: "paren", cells: [["a", "b"], ["c", "d"]],
    };
  }
}

export class SystemOfEquationsPlugin extends BasePlugin<SystemDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "systems-of-equations",
      displayName: "Systems of Equations",
      description: "Build systems of linear or nonlinear equations with aligned formatting.",
      category: "mathematics",
      engineId: "math-engine",
      qualityLevel: "official-core",
      requiredPackages: ["amsmath"],
      blockKind: "raw",
      defaultCaption: "System of equations.",
      defaultLabel: "eq:system",
    }, store);
  }

  protected buildDefaultDocument(): SystemDocument {
    return {
      engineId: "math-engine", version: "1.0.0", mode: "system", numbered: false, tree: [],
      equations: ["2x + 3y &= 7", "x - y &= 1"], variables: ["x", "y"],
    };
  }
}

export class PiecewiseFunctionsPlugin extends BasePlugin<MathEngineDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "piecewise-functions",
      displayName: "Piecewise Functions",
      description: "Define functions by cases or parts with a visual row editor.",
      category: "mathematics",
      engineId: "math-engine",
      qualityLevel: "official-core",
      requiredPackages: ["amsmath"],
      blockKind: "raw",
      defaultCaption: "Piecewise function.",
      defaultLabel: "eq:piecewise",
    }, store);
  }

  protected buildDefaultDocument(): MathEngineDocument {
    return {
      engineId: "math-engine", version: "1.0.0", mode: "equation", numbered: false,
      tree: [
        { type: "symbol", content: "|x| =" },
        { type: "cases", content: "", options: { cases: [
          { expr: "x", cond: "\\text{if } x \\geq 0" },
          { expr: "-x", cond: "\\text{if } x < 0" },
        ] } },
      ],
    };
  }
}
