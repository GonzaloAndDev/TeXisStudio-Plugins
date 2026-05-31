/**
 * Experimental plugins upgraded to real BasePlugin implementations.
 * These use the same engines as official-extended but target more
 * specialized academic niches. Quality is "official-extended" level,
 * label kept as "experimental" until the community validates defaults.
 */
import { BasePlugin } from "../common/plugin-base/index.js";
import { GraphNodeEngine } from "../engines/graph-node-engine/engine.js";
import { TreeForestEngine } from "../engines/tree-forest-engine/engine.js";
import type { GraphNodeDocument } from "../engines/graph-node-engine/types.js";
import type { TreeForestDocument } from "../engines/tree-forest-engine/types.js";

const graphEng = new GraphNodeEngine();
const treeEng  = new TreeForestEngine();

// ── BayesianNetworksPlugin ────────────────────────────────────────
// Bayesian networks are DAGs: observed nodes (rectangles) and latent
// variables (ellipses) with conditional probability arrows.

export class BayesianNetworksPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "bayesian-networks",
      displayName:     "Bayesian Networks",
      description:     "Directed acyclic graphs for Bayesian network visualization with observed (rectangular) and latent (elliptical) nodes.",
      category:        "mathematics",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for illustrative Bayesian networks. For inference or parameter learning, use dedicated tools (pgmpy, BayesFusion) and import results.",
      blockKind:       "input",
      defaultCaption:  "Bayesian network.",
      defaultLabel:    "fig:bayes-net",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // Observed variables (rectangles)
        { id: "fever",   label: "Fever",    shape: "rectangle", position: { x: 0,   y: 0 } },
        { id: "cough",   label: "Cough",    shape: "rectangle", position: { x: 3,   y: 0 } },
        { id: "fatigue", label: "Fatigue",  shape: "rectangle", position: { x: 6,   y: 0 } },
        // Latent / hidden cause (ellipse)
        { id: "flu",     label: "Flu",      shape: "ellipse",   position: { x: 1.5, y: 2 } },
        { id: "cold",    label: "Cold",     shape: "ellipse",   position: { x: 4.5, y: 2 } },
      ],
      edges: [
        { id: "e1", from: "flu",  to: "fever",   type: "directed" },
        { id: "e2", from: "flu",  to: "cough",   type: "directed" },
        { id: "e3", from: "flu",  to: "fatigue", type: "directed" },
        { id: "e4", from: "cold", to: "cough",   type: "directed" },
        { id: "e5", from: "cold", to: "fever",   type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── SEMPathPlugin ─────────────────────────────────────────────────
// Structural equation model path diagram.
// Latent variables = ellipses; observed/manifest = rectangles.
// Path coefficients shown as edge labels.

export class SEMPathPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "sem-path-diagrams",
      displayName:     "SEM / Path Diagrams",
      description:     "Structural equation model and path analysis diagrams. Latent variables (ovals) connected to observed indicators (rectangles).",
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for thesis-level SEM diagrams. For full SEM with fit statistics and model estimation, use lavaan/R or AMOS and export figures.",
      blockKind:       "input",
      defaultCaption:  "Structural equation model.",
      defaultLabel:    "fig:sem",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // Latent variables (ellipses)
        { id: "eta1", label: "$\\eta_1$\\nMotivation",   shape: "ellipse",   position: { x: 0,   y: 1.5 } },
        { id: "eta2", label: "$\\eta_2$\\nPerformance",  shape: "ellipse",   position: { x: 4,   y: 1.5 } },
        // Observed indicators (rectangles)
        { id: "y1", label: "$y_1$", shape: "rectangle", position: { x: -1.5, y: 3.5 } },
        { id: "y2", label: "$y_2$", shape: "rectangle", position: { x:  0,   y: 3.5 } },
        { id: "y3", label: "$y_3$", shape: "rectangle", position: { x:  1.5, y: 3.5 } },
        { id: "y4", label: "$y_4$", shape: "rectangle", position: { x:  2.5, y: 3.5 } },
        { id: "y5", label: "$y_5$", shape: "rectangle", position: { x:  4,   y: 3.5 } },
        { id: "y6", label: "$y_6$", shape: "rectangle", position: { x:  5.5, y: 3.5 } },
      ],
      edges: [
        // Structural path
        { id: "s1", from: "eta1", to: "eta2", type: "directed", label: "$\\beta$" },
        // Measurement model eta1
        { id: "m1", from: "eta1", to: "y1", type: "directed", label: "$\\lambda_1$" },
        { id: "m2", from: "eta1", to: "y2", type: "directed", label: "$\\lambda_2$" },
        { id: "m3", from: "eta1", to: "y3", type: "directed", label: "$\\lambda_3$" },
        // Measurement model eta2
        { id: "m4", from: "eta2", to: "y4", type: "directed", label: "$\\lambda_4$" },
        { id: "m5", from: "eta2", to: "y5", type: "directed", label: "$\\lambda_5$" },
        { id: "m6", from: "eta2", to: "y6", type: "directed", label: "$\\lambda_6$" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── EconomicCausalPlugin ──────────────────────────────────────────
// Causal loop diagram (CLD) for system dynamics.
// Variables are nodes; causal links are directed with +/- polarity labels.
// Feedback loops made explicit via cyclic paths.

export class EconomicCausalPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "economic-causal",
      displayName:     "Economic Causal Diagrams",
      description:     "Causal loop diagrams (CLD) with reinforcing and balancing feedback loops. Essential in system dynamics and macroeconomic analysis.",
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for simple causal loop models. For complex system dynamics simulation (stocks, flows, delays), use Vensim or Stella and import.",
      blockKind:       "input",
      defaultCaption:  "Causal loop diagram.",
      defaultLabel:    "fig:cld",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "inflation",    label: "Inflation",    shape: "ellipse", position: { x: 0,   y: 0 } },
        { id: "wages",        label: "Wages",        shape: "ellipse", position: { x: 3,   y: 1.5 } },
        { id: "productivity", label: "Productivity", shape: "ellipse", position: { x: 6,   y: 0 } },
        { id: "costs",        label: "Production\\ncosts", shape: "ellipse", position: { x: 3,   y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "inflation",    to: "wages",        type: "directed", label: "+" },
        { id: "e2", from: "wages",        to: "productivity", type: "directed", label: "+" },
        { id: "e3", from: "productivity", to: "costs",        type: "directed", label: "−" },
        { id: "e4", from: "costs",        to: "inflation",    type: "directed", label: "+" },
        { id: "e5", from: "wages",        to: "costs",        type: "directed", label: "+" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── LegalProceduralPlugin ─────────────────────────────────────────
// Legal procedure flowchart with decision diamonds (conditions)
// and rectangular process boxes (actions/stages).

export class LegalProceduralPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "legal-procedural",
      displayName:     "Legal / Procedural Diagrams",
      description:     "Flowcharts for legal processes, judicial procedures, administrative workflows, and regulatory compliance flows.",
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for standard legal process flows in theses. Complex multi-jurisdiction or cross-institutional diagrams may need manual adjustment.",
      blockKind:       "input",
      defaultCaption:  "Legal procedure flowchart.",
      defaultLabel:    "fig:legal-procedure",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "report",     label: "Filing\\nof complaint",  shape: "rounded-rectangle", position: { x: 0, y: 5 } },
        { id: "admissible", label: "Admissible?",            shape: "diamond",           position: { x: 0, y: 3.5 } },
        { id: "reject",     label: "Dismissed",              shape: "rounded-rectangle", position: { x: 2.5, y: 3.5 } },
        { id: "invest",     label: "Investigation",          shape: "rectangle",         position: { x: 0, y: 2 } },
        { id: "charges",    label: "Charges filed?",         shape: "diamond",           position: { x: 0, y: 0.5 } },
        { id: "archive",    label: "Case archived",          shape: "rounded-rectangle", position: { x: 2.5, y: 0.5 } },
        { id: "trial",      label: "Trial",                  shape: "rectangle",         position: { x: 0, y: -1 } },
        { id: "verdict",    label: "Verdict",                shape: "rounded-rectangle", position: { x: 0, y: -2.5 } },
      ],
      edges: [
        { id: "e1", from: "report",     to: "admissible", type: "directed" },
        { id: "e2", from: "admissible", to: "reject",     type: "directed", label: "No" },
        { id: "e3", from: "admissible", to: "invest",     type: "directed", label: "Yes" },
        { id: "e4", from: "invest",     to: "charges",    type: "directed" },
        { id: "e5", from: "charges",    to: "archive",    type: "directed", label: "No" },
        { id: "e6", from: "charges",    to: "trial",      type: "directed", label: "Yes" },
        { id: "e7", from: "trial",      to: "verdict",    type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta", "shapes.geometric"], directed: true,
    };
  }
}

// ── PedagogicalDiagramsPlugin ─────────────────────────────────────
// Bloom's taxonomy tree and curriculum/competency maps.

export class PedagogicalDiagramsPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEng, {
      pluginId:        "pedagogical-diagrams",
      displayName:     "Pedagogical Diagrams",
      description:     "Educational diagrams: Bloom's taxonomy trees, learning outcome hierarchies, curriculum maps, and instructional design flows.",
      category:        "humanities-social",
      engineId:        "tree-forest-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["forest", "tikz"],
      scopeWarning:    "Covers common pedagogical diagram patterns. Complex instructional design models (ADDIE, Dick-Carey) may need manual TikZ adjustment.",
      blockKind:       "input",
      defaultCaption:  "Bloom's taxonomy for this course.",
      defaultLabel:    "fig:bloom",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "taxonomic", growth: "south",
      root: {
        id: "bloom", label: "\\textbf{Learning Outcomes}", children: [
          {
            id: "remember", label: "Remember", children: [
              { id: "r1", label: "Identify key concepts", children: [] },
              { id: "r2", label: "Recall definitions",    children: [] },
            ],
          },
          {
            id: "apply", label: "Apply", children: [
              { id: "a1", label: "Solve problems",  children: [] },
              { id: "a2", label: "Use techniques",  children: [] },
            ],
          },
          {
            id: "analyze", label: "Analyze", children: [
              { id: "an1", label: "Compare models",  children: [] },
              { id: "an2", label: "Critique methods", children: [] },
            ],
          },
          {
            id: "create", label: "Create", children: [
              { id: "c1", label: "Design solutions",  children: [] },
              { id: "c2", label: "Produce reports",   children: [] },
            ],
          },
        ],
      },
    };
  }
}
