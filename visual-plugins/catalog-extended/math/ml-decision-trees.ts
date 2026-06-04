import { BasePlugin } from "../../common/plugin-base/index.js";
import { TreeForestEngine } from "../../engines/tree-forest-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { TreeForestDocument } from "../../engines/tree-forest-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const treeEng  = new TreeForestEngine();
const pgfEng   = new PGFPlotsEngine();
const graphEng = new GraphNodeEngine();

// ── Plugin 62 — Decision Trees (ML / Statistics) ─────────────────
// Core figure for machine learning, clinical decision support, and statistics chapters.

export class DecisionTreePlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEng, {
      pluginId:        "decision-tree",
      displayName:     pluginText("decision-tree", "displayName", "Decision Trees"),
      description:     pluginText("decision-tree", "description", "Decision tree diagrams with conditions, branches, and leaf outcomes. Covers classification trees, CART, and clinical decision rules."),
      category:        "mathematics",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["forest", "tikz"],
      scopeWarning:    pluginText("decision-tree", "scopeWarning", "Enter tree structure manually. For automatic tree generation from data, use scikit-learn/rpart and export the tree, then reproduce here for publication."),
      blockKind:       "input",
      defaultCaption:  pluginText("decision-tree", "defaultCaption", "Decision tree."),
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
      displayName:     pluginText("roc-curve", "displayName", "ROC Curves"),
      description:     pluginText("roc-curve", "description", "Receiver operating characteristic curves for classifier evaluation. Supports multiple classifiers with AUC annotation."),
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    pluginText("roc-curve", "scopeWarning", "Enter pre-computed TPR/FPR values from your statistical software (sklearn, R pROC). This plugin renders the curve; model training must be done externally."),
      blockKind:       "input",
      defaultCaption:  pluginText("roc-curve", "defaultCaption", "ROC curves (AUC shown in legend)."),
      defaultLabel:    "fig:roc",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Three classifiers comparison: Random Forest, Logistic Regression, SVM
    // Pre-computed from a typical clinical prediction problem
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        // Random Forest — best performer
        {
          id: "rf", label: "Random Forest (AUC = 0.94)",
          plotType: "scatter",
          data: [
            { x:0.00, y:0.00 }, { x:0.02, y:0.48 }, { x:0.05, y:0.69 },
            { x:0.08, y:0.78 }, { x:0.12, y:0.85 }, { x:0.18, y:0.90 },
            { x:0.25, y:0.93 }, { x:0.40, y:0.96 }, { x:0.60, y:0.98 },
            { x:0.80, y:0.99 }, { x:1.00, y:1.00 },
          ],
          color: "blue!80", mark: "*",
        },
        // Logistic Regression
        {
          id: "lr", label: "Logistic Regression (AUC = 0.85)",
          plotType: "scatter",
          data: [
            { x:0.00, y:0.00 }, { x:0.05, y:0.35 }, { x:0.10, y:0.55 },
            { x:0.15, y:0.65 }, { x:0.22, y:0.74 }, { x:0.30, y:0.81 },
            { x:0.45, y:0.88 }, { x:0.60, y:0.92 }, { x:0.80, y:0.96 },
            { x:1.00, y:1.00 },
          ],
          color: "orange!80", mark: "square*",
        },
        // SVM
        {
          id: "svm", label: "SVM (AUC = 0.82)",
          plotType: "scatter",
          data: [
            { x:0.00, y:0.00 }, { x:0.07, y:0.30 }, { x:0.13, y:0.48 },
            { x:0.20, y:0.62 }, { x:0.30, y:0.72 }, { x:0.42, y:0.82 },
            { x:0.60, y:0.90 }, { x:0.80, y:0.95 }, { x:1.00, y:1.00 },
          ],
          color: "red!70", mark: "triangle*",
        },
        // Random baseline
        {
          id: "rand", label: "Random (AUC = 0.50)",
          plotType: "function2d",
          expression: "x",
          domain: [0, 1],
          color: "gray", mark: "none",
        },
      ],
      xLabel: "1 -- Specificity (FPR)",
      yLabel: "Sensitivity (TPR)",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: [
        "xmin=0, ymin=0, xmax=1, ymax=1",
        "legend pos=south east",
        "legend style={font=\\small}",
        "width=7cm, height=7cm",
      ].join(", "),
    };
  }
}

// ── Plugin 64 — Population Pyramid ───────────────────────────────
// Required in demography, public health, and social science theses.

export class PopulationPyramidPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "population-pyramid",
      displayName:     pluginText("population-pyramid", "displayName", "Population Pyramid"),
      description:     pluginText("population-pyramid", "description", "Age-sex population pyramid for demographic analysis. Shows male/female population distributions by age group."),
      category:        "humanities-social",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    pluginText("population-pyramid", "scopeWarning", "Enter census data manually. For large datasets, generate the pyramid in R/Python and import as PDF, or use this plugin for illustrative sub-populations."),
      blockKind:       "input",
      defaultCaption:  pluginText("population-pyramid", "defaultCaption", "Population pyramid."),
      defaultLabel:    "fig:population-pyramid",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Mexico 2020 age structure (INEGI approximation) — useful for Latin American studies
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "male", label: "Male",
          plotType: "bar",
          data: [
            { x:1, y:-9.8 }, { x:2, y:-9.1 }, { x:3, y:-8.6 }, { x:4, y:-8.3 },
            { x:5, y:-7.9 }, { x:6, y:-7.4 }, { x:7, y:-6.2 }, { x:8, y:-4.5 },
            { x:9, y:-3.0 }, { x:10,y:-1.8 },
          ],
          color: "blue!65",
        },
        {
          id: "female", label: "Female",
          plotType: "bar",
          data: [
            { x:1, y:9.5 }, { x:2, y:8.8 }, { x:3, y:8.4 }, { x:4, y:8.1 },
            { x:5, y:7.8 }, { x:6, y:7.6 }, { x:7, y:6.5 }, { x:8, y:5.0 },
            { x:9, y:3.5 }, { x:10,y:2.2 },
          ],
          color: "red!55",
        },
      ],
      xLabel: "Population (\\%)",
      yLabel: "Age group",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: [
        "xbar, bar width=0.38cm",
        "xmin=-12, xmax=12",
        "ytick={1,2,3,4,5,6,7,8,9,10}",
        "yticklabels={0--9, 10--19, 20--29, 30--39, 40--49, 50--59, 60--69, 70--79, 80--89, 90+}",
        "yticklabel style={font=\\small}",
        "legend pos=north east",
        "legend style={font=\\small}",
      ].join(",\n      "),
    };
  }
}

// ── Plugin 65 — Error Bars / Confidence Intervals ─────────────────
// Essential for experimental results chapters in any quantitative thesis.

export class ErrorBarsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "error-bars",
      displayName:     pluginText("error-bars", "displayName", "Error Bars & Confidence Intervals"),
      description:     pluginText("error-bars", "description", "Line or bar plots with error bars for means ± SD/SE/CI. Essential for presenting experimental or survey results."),
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    pluginText("error-bars", "scopeWarning", "Enter means and error values (SD, SE, or 95% CI half-width) computed from your data. Raw data processing must be done externally."),
      blockKind:       "input",
      defaultCaption:  pluginText("error-bars", "defaultCaption", "Mean values with 95\\% confidence intervals."),
      defaultLabel:    "fig:error-bars",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Drug efficacy over time: control vs treatment (mean ± 95% CI)
    // Typical in pharmacology, physiology, and clinical research theses
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "placebo", label: "Placebo ($n{=}45$)",
          plotType: "errorbar",
          data: [
            { x:0, y:52.1, error:4.2 }, { x:4, y:53.8, error:3.9 },
            { x:8, y:51.4, error:4.7 }, { x:12,y:54.2, error:4.1 },
            { x:24,y:53.1, error:4.8 },
          ],
          color: "gray!70", mark: "o",
        },
        {
          id: "low_dose", label: "Low dose 10\\,mg ($n{=}47$)",
          plotType: "errorbar",
          data: [
            { x:0, y:51.6, error:4.0 }, { x:4, y:61.3, error:3.5 },
            { x:8, y:67.8, error:3.2 }, { x:12,y:71.4, error:2.9 },
            { x:24,y:69.2, error:3.4 },
          ],
          color: "blue!70", mark: "*",
        },
        {
          id: "high_dose", label: "High dose 20\\,mg ($n{=}46$)",
          plotType: "errorbar",
          data: [
            { x:0, y:52.4, error:3.8 }, { x:4, y:68.1, error:3.1 },
            { x:8, y:76.5, error:2.8 }, { x:12,y:80.3, error:2.5 },
            { x:24,y:77.8, error:2.9 },
          ],
          color: "red!70", mark: "square*",
        },
      ],
      xLabel: "Time (weeks)",
      yLabel: "Efficacy score (0--100)",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: [
        "xtick={0,4,8,12,24}",
        "ymin=40, ymax=90",
        "legend pos=north west",
        "legend style={font=\\small}",
      ].join(",\n      "),
    };
  }
}

// ── Plugin 66 — Causal / DAG Diagrams ────────────────────────────
// Standard in epidemiology, econometrics, and social sciences for showing causal assumptions.

export class CausalDAGPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "causal-dag",
      displayName:     pluginText("causal-dag", "displayName", "Causal DAG / Path Diagrams"),
      description:     pluginText("causal-dag", "description", "Directed acyclic graphs (DAGs) for causal inference frameworks, structural equation models, and mediation analysis."),
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("causal-dag", "scopeWarning", "Suitable for causal diagrams up to ~10 variables. For complex SEM or large DAGs, use dagitty.net or lavaan and import the diagram."),
      blockKind:       "input",
      defaultCaption:  pluginText("causal-dag", "defaultCaption", "Causal directed acyclic graph (DAG)."),
      defaultLabel:    "fig:dag",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // Education + Income → Health outcome, with mediation through healthcare access.
    // Bidirectional confounding by SES and age. Realistic epidemiological DAG.
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "edu",  label: "Education",        shape: "ellipse",   position: { x: 0,   y: 0 } },
        { id: "inc",  label: "Income",           shape: "ellipse",   position: { x: 0,   y: -2 } },
        { id: "hca",  label: "Healthcare\\naccess", shape: "rectangle", position: { x: 3, y: -1 } },
        { id: "hlth", label: "Health outcome",   shape: "ellipse",   position: { x: 6,   y: -1 } },
        { id: "ses",  label: "SES",              shape: "rectangle", position: { x: -2,  y: -1 } },
        { id: "age",  label: "Age",              shape: "rectangle", position: { x: 3,   y: 1.5 } },
      ],
      edges: [
        // Causal paths
        { id: "e1", from: "edu",  to: "inc",  type: "directed" },
        { id: "e2", from: "edu",  to: "hca",  type: "directed" },
        { id: "e3", from: "inc",  to: "hca",  type: "directed" },
        { id: "e4", from: "hca",  to: "hlth", type: "directed", label: "mediation" },
        { id: "e5", from: "edu",  to: "hlth", type: "directed", label: "direct" },
        // Confounders
        { id: "e6", from: "ses",  to: "edu",  type: "directed" },
        { id: "e7", from: "ses",  to: "inc",  type: "directed" },
        { id: "e8", from: "age",  to: "hlth", type: "directed" },
        { id: "e9", from: "age",  to: "hca",  type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
