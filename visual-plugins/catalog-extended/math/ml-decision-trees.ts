import { BasePlugin } from "../../common/plugin-base/index.js";
import { TreeForestEngine } from "../../engines/tree-forest-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { TreeForestDocument } from "../../engines/tree-forest-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";

const treeEng  = new TreeForestEngine();
const pgfEng   = new PGFPlotsEngine();
const graphEng = new GraphNodeEngine();

// ── Plugin 62 — Decision Trees (ML / Statistics) ─────────────────
// Core figure for machine learning, clinical decision support, and statistics chapters.

export class DecisionTreePlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEng, {
      pluginId:        "decision-tree",
      displayName:     "Decision Trees",
      description:     "Decision tree diagrams with conditions, branches, and leaf outcomes. Covers classification trees, CART, and clinical decision rules.",
      category:        "mathematics",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["forest", "tikz"],
      scopeWarning:    "Enter tree structure manually. For automatic tree generation from data, use scikit-learn/rpart and export the tree, then reproduce here for publication.",
      blockKind:       "input",
      defaultCaption:  "Decision tree.",
      defaultLabel:    "fig:decision-tree",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "decision", growth: "south",
      root: {
        id: "root", label: "Age $\\geq 30$?", children: [
          {
            id: "age_yes", label: "Income $\\geq 50k$?", edgeLabel: "Yes", children: [
              { id: "class_a1", label: "\\textbf{High risk}", edgeLabel: "Yes", children: [] },
              { id: "class_b1", label: "\\textbf{Medium risk}", edgeLabel: "No", children: [] },
            ],
          },
          {
            id: "age_no", label: "Education $\\geq$ bachelor?", edgeLabel: "No", children: [
              { id: "class_a2", label: "\\textbf{Low risk}", edgeLabel: "Yes", children: [] },
              { id: "class_b2", label: "\\textbf{Medium risk}", edgeLabel: "No", children: [] },
            ],
          },
        ],
      },
    };
  }
}

// ── Plugin 63 — ROC Curves ────────────────────────────────────────
// Standard in machine learning and diagnostic accuracy theses.

export class ROCCurvePlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "roc-curve",
      displayName:     "ROC Curves",
      description:     "Receiver operating characteristic curves for classifier evaluation. Supports multiple classifiers with AUC annotation.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter pre-computed TPR/FPR values from your statistical software (sklearn, R pROC). This plugin renders the curve; model training must be done externally.",
      blockKind:       "input",
      defaultCaption:  "ROC curves (AUC shown in legend).",
      defaultLabel:    "fig:roc",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "model_a", label: "Model A (AUC = 0.89)",
          plotType: "scatter",
          data: [
            { x: 0.00, y: 0.00 }, { x: 0.05, y: 0.40 }, { x: 0.10, y: 0.62 },
            { x: 0.20, y: 0.78 }, { x: 0.30, y: 0.87 }, { x: 0.50, y: 0.93 },
            { x: 0.80, y: 0.97 }, { x: 1.00, y: 1.00 },
          ],
          color: "blue", mark: "*",
        },
        {
          id: "baseline", label: "Random classifier",
          plotType: "function2d",
          expression: "x",
          domain: [0, 1],
          color: "gray",
        },
      ],
      xLabel: "False positive rate (1 - Specificity)",
      yLabel: "True positive rate (Sensitivity)",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "xmin=0, ymin=0, xmax=1, ymax=1",
    };
  }
}

// ── Plugin 64 — Population Pyramid ───────────────────────────────
// Required in demography, public health, and social science theses.

export class PopulationPyramidPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "population-pyramid",
      displayName:     "Population Pyramid",
      description:     "Age-sex population pyramid for demographic analysis. Shows male/female population distributions by age group.",
      category:        "humanities-social",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter census data manually. For large datasets, generate the pyramid in R/Python and import as PDF, or use this plugin for illustrative sub-populations.",
      blockKind:       "input",
      defaultCaption:  "Population pyramid.",
      defaultLabel:    "fig:population-pyramid",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "male", label: "Male",
          plotType: "bar",
          // Negative values = left side (male)
          data: [
            { x: 1, y: -8.2 }, { x: 2, y: -9.1 }, { x: 3, y: -10.4 },
            { x: 4, y: -9.8 }, { x: 5, y: -8.5 }, { x: 6, y: -7.1 },
          ],
          color: "blue",
        },
        {
          id: "female", label: "Female",
          plotType: "bar",
          data: [
            { x: 1, y: 7.8 }, { x: 2, y: 8.9 }, { x: 3, y: 9.8 },
            { x: 4, y: 9.5 }, { x: 5, y: 8.9 }, { x: 6, y: 7.6 },
          ],
          color: "red",
        },
      ],
      xLabel: "Age group", yLabel: "Population (\\%)",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "xbar, bar width=0.5cm, xmin=-12, xmax=12, ytick={1,2,3,4,5,6}, yticklabels={0--14, 15--29, 30--44, 45--59, 60--74, 75+}",
    };
  }
}

// ── Plugin 65 — Error Bars / Confidence Intervals ─────────────────
// Essential for experimental results chapters in any quantitative thesis.

export class ErrorBarsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "error-bars",
      displayName:     "Error Bars & Confidence Intervals",
      description:     "Line or bar plots with error bars for means ± SD/SE/CI. Essential for presenting experimental or survey results.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter means and error values (SD, SE, or 95% CI half-width) computed from your data. Raw data processing must be done externally.",
      blockKind:       "input",
      defaultCaption:  "Mean values with 95\\% confidence intervals.",
      defaultLabel:    "fig:error-bars",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "group_a", label: "Condition A",
          plotType: "errorbar",
          data: [
            { x: 1, y: 24.5, error: 3.2 },
            { x: 2, y: 31.2, error: 2.8 },
            { x: 3, y: 28.7, error: 4.1 },
            { x: 4, y: 35.9, error: 3.5 },
          ],
          color: "blue", mark: "*",
        },
        {
          id: "group_b", label: "Condition B",
          plotType: "errorbar",
          data: [
            { x: 1, y: 19.1, error: 2.9 },
            { x: 2, y: 26.8, error: 3.3 },
            { x: 3, y: 33.4, error: 3.8 },
            { x: 4, y: 29.2, error: 2.6 },
          ],
          color: "red", mark: "square*",
        },
      ],
      xLabel: "Time point", yLabel: "Measured value",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
  }
}

// ── Plugin 66 — Causal / DAG Diagrams ────────────────────────────
// Standard in epidemiology, econometrics, and social sciences for showing causal assumptions.

export class CausalDAGPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "causal-dag",
      displayName:     "Causal DAG / Path Diagrams",
      description:     "Directed acyclic graphs (DAGs) for causal inference frameworks, structural equation models, and mediation analysis.",
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for causal diagrams up to ~10 variables. For complex SEM or large DAGs, use dagitty.net or lavaan and import the diagram.",
      blockKind:       "input",
      defaultCaption:  "Causal directed acyclic graph (DAG).",
      defaultLabel:    "fig:dag",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "X",  label: "Exposure ($X$)",     shape: "ellipse",   position: { x: 0, y: 0 } },
        { id: "Y",  label: "Outcome ($Y$)",       shape: "ellipse",   position: { x: 4, y: 0 } },
        { id: "M",  label: "Mediator ($M$)",      shape: "ellipse",   position: { x: 2, y: 0 } },
        { id: "C1", label: "Confounder ($C_1$)",  shape: "rectangle", position: { x: 0, y: 2 } },
        { id: "C2", label: "Confounder ($C_2$)",  shape: "rectangle", position: { x: 4, y: 2 } },
      ],
      edges: [
        { id: "e1", from: "X",  to: "M",  type: "directed" },
        { id: "e2", from: "M",  to: "Y",  type: "directed" },
        { id: "e3", from: "X",  to: "Y",  type: "directed", label: "direct" },
        { id: "e4", from: "C1", to: "X",  type: "directed" },
        { id: "e5", from: "C1", to: "Y",  type: "directed" },
        { id: "e6", from: "C2", to: "Y",  type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
