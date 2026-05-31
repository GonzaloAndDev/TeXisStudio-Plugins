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
      defaultCaption: "Quadratic formula and quadratic form.",
      defaultLabel: "eq:equation",
    }, store);
  }

  protected buildDefaultDocument(): MathEngineDocument {
    // Quadratic formula — recognizable, appears in almost every quantitative thesis
    return {
      engineId: "math-engine", version: "1.0.0",
      mode: "align",
      numbered: true,
      tree: [
        { type: "symbol", content: "x &= \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}" },
        { type: "symbol", content: "\\Delta &= b^2 - 4ac" },
      ],
    };
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
      defaultCaption: "3D rotation matrix around the $z$-axis by angle $\\theta$.",
      defaultLabel: "eq:matrix",
    }, store);
  }

  protected buildDefaultDocument(): MatrixDocument {
    // 3×3 rotation matrix — appears in robotics, biomechanics, computer vision theses
    return {
      engineId: "math-engine", version: "1.0.0",
      mode: "matrix", numbered: true, tree: [],
      rows: 3, cols: 3, delimiter: "paren",
      cells: [
        ["\\cos\\theta", "-\\sin\\theta", "0"],
        ["\\sin\\theta",  "\\cos\\theta",  "0"],
        ["0",             "0",             "1"],
      ],
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
      defaultCaption: "System of three linear equations (fluid flow balance).",
      defaultLabel: "eq:system",
    }, store);
  }

  protected buildDefaultDocument(): SystemDocument {
    // 3×3 system — typical in structural analysis, network flow, circuit analysis
    return {
      engineId: "math-engine", version: "1.0.0",
      mode: "system", numbered: true, tree: [],
      equations: [
        "2x_1 + 3x_2 - x_3  &= 4",
        "x_1 - x_2 + 2x_3   &= 1",
        "3x_1 + x_2 + x_3   &= 7",
      ],
      variables: ["x_1", "x_2", "x_3"],
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
      defaultCaption: "Heaviside step function and ReLU activation function.",
      defaultLabel: "eq:piecewise",
    }, store);
  }

  protected buildDefaultDocument(): MathEngineDocument {
    // ReLU activation (deep learning) — more relevant than abs value in modern theses
    return {
      engineId: "math-engine", version: "1.0.0",
      mode: "equation", numbered: true,
      tree: [
        { type: "symbol", content: "\\text{ReLU}(x) =" },
        { type: "cases", content: "", options: { cases: [
          { expr: "x",   cond: "\\text{if } x > 0" },
          { expr: "0",   cond: "\\text{otherwise}" },
        ] } },
      ],
    };
  }
}
