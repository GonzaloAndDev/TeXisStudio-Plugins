import { pluginText } from "../i18n/index.js";
/**
 * Experimental plugins with real BasePlugin implementations.
 * Specialized academic niches. All generate compilable LaTeX.
 */
import { BasePlugin } from "../common/plugin-base/index.js";
import { GraphNodeEngine } from "../engines/graph-node-engine/engine.js";
import { TreeForestEngine } from "../engines/tree-forest-engine/engine.js";
import type { GraphNodeDocument } from "../engines/graph-node-engine/types.js";
import type { TreeForestDocument } from "../engines/tree-forest-engine/types.js";

const graphEng = new GraphNodeEngine();
const treeEng  = new TreeForestEngine();

// ── BayesianNetworksPlugin ────────────────────────────────────────────────────
// COVID-19 symptom diagnosis — clinically relevant and immediately recognisable.

export class BayesianNetworksPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "bayesian-networks",
      displayName:     pluginText("bayesian-networks", "displayName", "Bayesian Networks"),
      description:     pluginText("bayesian-networks", "description", "Directed acyclic graphs for Bayesian networks: latent cause nodes (ellipses) with observed evidence nodes (rectangles)."),
      category:        "mathematics",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("bayesian-networks", "scopeWarning", "Suitable for illustrative Bayesian networks in theses. For inference, parameter learning, or dense graphs, use pgmpy, BayesFusion, GeNIe, or BUGS and import the final PDF/SVG."),
      blockKind:       "input",
      defaultCaption:  pluginText("bayesian-networks", "defaultCaption", "Bayesian network for differential diagnosis of respiratory illness."),
      defaultLabel:    "fig:bayes-net",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // Latent disease nodes
        { id: "covid",    label: "COVID-19",       shape: "ellipse",   position: { x: 0,   y: 4 } },
        { id: "flu",      label: "Influenza",      shape: "ellipse",   position: { x: 4,   y: 4 } },
        { id: "cold",     label: "Common cold",    shape: "ellipse",   position: { x: 8,   y: 4 } },
        // Observed symptom nodes
        { id: "fever",    label: "Fever",          shape: "rectangle", position: { x: -1,  y: 1.5 } },
        { id: "cough",    label: "Dry cough",      shape: "rectangle", position: { x: 2,   y: 1.5 } },
        { id: "anosmia",  label: "Anosmia",        shape: "rectangle", position: { x: 5,   y: 1.5 } },
        { id: "sore",     label: "Sore throat",    shape: "rectangle", position: { x: 8,   y: 1.5 } },
        { id: "dyspnoea", label: "Dyspnoea",       shape: "rectangle", position: { x: 0,   y: -0.5 } },
        // Exposure node
        { id: "contact",  label: "Known contact",  shape: "rectangle", position: { x: -2,  y: 4 } },
      ],
      edges: [
        { id: "e1", from: "covid",   to: "fever",    type: "directed", label: "0.88" },
        { id: "e2", from: "covid",   to: "cough",    type: "directed", label: "0.71" },
        { id: "e3", from: "covid",   to: "anosmia",  type: "directed", label: "0.65" },
        { id: "e4", from: "covid",   to: "dyspnoea", type: "directed", label: "0.40" },
        { id: "e5", from: "flu",     to: "fever",    type: "directed", label: "0.92" },
        { id: "e6", from: "flu",     to: "cough",    type: "directed", label: "0.80" },
        { id: "e7", from: "cold",    to: "cough",    type: "directed", label: "0.60" },
        { id: "e8", from: "cold",    to: "sore",     type: "directed", label: "0.75" },
        { id: "e9", from: "contact", to: "covid",    type: "directed", label: "prior" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── SEMPathPlugin ─────────────────────────────────────────────────────────────
// Technology Acceptance Model (TAM) — canonical SEM in IS and management theses.

export class SEMPathPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "sem-path-diagrams",
      displayName:     pluginText("sem-path-diagrams", "displayName", "SEM / Path Diagrams"),
      description:     pluginText("sem-path-diagrams", "description", "Structural equation model path diagrams with latent variables and measurement models."),
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("sem-path-diagrams", "scopeWarning", "Suitable for thesis-level SEM diagrams. For estimation, fit statistics, and standardized reports, use lavaan/R, Mplus, or AMOS and import the final diagram/table as PDF."),
      blockKind:       "input",
      defaultCaption:  pluginText("sem-path-diagrams", "defaultCaption", "Technology Acceptance Model (TAM): perceived usefulness and ease of use predicting behavioural intention."),
      defaultLabel:    "fig:tam-sem",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // Latent constructs (ellipses)
        { id: "peou", label: "Perceived\\nEase of Use",    shape: "ellipse", position: { x: 0, y: 3 } },
        { id: "pu",   label: "Perceived\\nUsefulness",     shape: "ellipse", position: { x: 0, y: 0 } },
        { id: "bi",   label: "Behavioural\\nIntention",    shape: "ellipse", position: { x: 4, y: 1.5 } },
        { id: "au",   label: "Actual Use",                 shape: "ellipse", position: { x: 8, y: 1.5 } },
        // Indicators (rectangles)
        { id: "peou1", label: "EOU1", shape: "rectangle", position: { x: -2, y: 4 } },
        { id: "peou2", label: "EOU2", shape: "rectangle", position: { x: -2, y: 3 } },
        { id: "peou3", label: "EOU3", shape: "rectangle", position: { x: -2, y: 2 } },
        { id: "pu1",   label: "PU1",  shape: "rectangle", position: { x: -2, y: 1 } },
        { id: "pu2",   label: "PU2",  shape: "rectangle", position: { x: -2, y: 0 } },
        { id: "pu3",   label: "PU3",  shape: "rectangle", position: { x: -2, y:-1 } },
        { id: "bi1",   label: "BI1",  shape: "rectangle", position: { x:  4, y: 3.5 } },
        { id: "bi2",   label: "BI2",  shape: "rectangle", position: { x:  5.5, y:3.5 } },
      ],
      edges: [
        // Structural paths
        { id: "s1", from: "peou", to: "pu",  type: "directed", label: "$\\beta_1$" },
        { id: "s2", from: "peou", to: "bi",  type: "directed", label: "$\\beta_2$" },
        { id: "s3", from: "pu",   to: "bi",  type: "directed", label: "$\\beta_3$" },
        { id: "s4", from: "bi",   to: "au",  type: "directed", label: "$\\beta_4$" },
        // Measurement links
        { id: "m1", from: "peou", to: "peou1", type: "directed" },
        { id: "m2", from: "peou", to: "peou2", type: "directed" },
        { id: "m3", from: "peou", to: "peou3", type: "directed" },
        { id: "m4", from: "pu",   to: "pu1",   type: "directed" },
        { id: "m5", from: "pu",   to: "pu2",   type: "directed" },
        { id: "m6", from: "pu",   to: "pu3",   type: "directed" },
        { id: "m7", from: "bi",   to: "bi1",   type: "directed" },
        { id: "m8", from: "bi",   to: "bi2",   type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── EconomicCausalPlugin ──────────────────────────────────────────────────────
// Wage-price spiral — a canonical causal loop in macroeconomics.

export class EconomicCausalPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "economic-causal",
      displayName:     pluginText("economic-causal", "displayName", "Economic Causal Diagrams"),
      description:     pluginText("economic-causal", "description", "Causal loop diagrams (CLD) with reinforcing and balancing feedback loops."),
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("economic-causal", "scopeWarning", "Suitable for simple causal loop models. For full system dynamics with stocks, flows, delays, or simulation, use Vensim, Stella, or AnyLogic and import the final PDF/SVG."),
      blockKind:       "input",
      defaultCaption:  pluginText("economic-causal", "defaultCaption", "Wage--price spiral: reinforcing ($R$) and balancing ($B$) feedback loops."),
      defaultLabel:    "fig:cld",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "wages",      label: "Nominal\\nwages",      shape: "ellipse", position: { x: 0,   y: 2 } },
        { id: "costs",      label: "Production\\ncosts",   shape: "ellipse", position: { x: 3,   y: 3.5 } },
        { id: "prices",     label: "Consumer\\nprices",    shape: "ellipse", position: { x: 6,   y: 2 } },
        { id: "real_wages", label: "Real wages",           shape: "ellipse", position: { x: 3,   y: 0 } },
        { id: "demand",     label: "Aggregate\\ndemand",   shape: "ellipse", position: { x: 0,   y: -1.5 } },
        { id: "employ",     label: "Employment",           shape: "ellipse", position: { x: 6,   y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "wages",      to: "costs",      type: "directed", label: "+" },
        { id: "e2", from: "costs",      to: "prices",     type: "directed", label: "+" },
        { id: "e3", from: "prices",     to: "real_wages", type: "directed", label: "$-$" },  // R loop
        { id: "e4", from: "real_wages", to: "wages",      type: "directed", label: "+" },    // B loop
        { id: "e5", from: "real_wages", to: "demand",     type: "directed", label: "+" },
        { id: "e6", from: "demand",     to: "employ",     type: "directed", label: "+" },
        { id: "e7", from: "employ",     to: "wages",      type: "directed", label: "+" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── LegalProceduralPlugin ─────────────────────────────────────────────────────
// EU administrative law procedure — specific to legal studies theses.

export class LegalProceduralPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "legal-procedural",
      displayName:     pluginText("legal-procedural", "displayName", "Legal / Procedural Diagrams"),
      description:     pluginText("legal-procedural", "description", "Flowcharts for legal and administrative procedures: judicial, regulatory, and compliance workflows."),
      category:        "humanities-social",
      engineId:        "graph-node-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("legal-procedural", "scopeWarning", "Suitable for standard legal/administrative process flows in theses. Complex multi-party or multi-jurisdiction procedures are better maintained in BPMN/draw.io and imported as PDF."),
      blockKind:       "input",
      defaultCaption:  pluginText("legal-procedural", "defaultCaption", "Criminal procedure: from complaint to verdict."),
      defaultLabel:    "fig:legal",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "complaint",  label: "Complaint filed",      shape: "rounded-rectangle", position: { x: 0, y: 6 } },
        { id: "admission",  label: "Admissible?",          shape: "diamond",           position: { x: 0, y: 4.5 } },
        { id: "dismissed",  label: "Case dismissed",       shape: "rounded-rectangle", position: { x: 3, y: 4.5 } },
        { id: "prelim",     label: "Preliminary hearing",  shape: "rectangle",         position: { x: 0, y: 3 } },
        { id: "evidence",   label: "Sufficient evidence?", shape: "diamond",           position: { x: 0, y: 1.5 } },
        { id: "archived",   label: "Archived",             shape: "rounded-rectangle", position: { x: 3, y: 1.5 } },
        { id: "indictment", label: "Indictment issued",    shape: "rectangle",         position: { x: 0, y: 0 } },
        { id: "trial",      label: "Trial (oral hearing)", shape: "rectangle",         position: { x: 0, y: -1.5 } },
        { id: "verdict",    label: "Verdict",              shape: "diamond",           position: { x: 0, y: -3 } },
        { id: "acquitted",  label: "Acquittal",            shape: "rounded-rectangle", position: { x: -3, y: -3 } },
        { id: "convicted",  label: "Conviction\\n+ sentence", shape: "rounded-rectangle", position: { x: 3, y: -3 } },
        { id: "appeal",     label: "Appeal possible",      shape: "ellipse",           position: { x: 0, y: -4.5 } },
      ],
      edges: [
        { id: "e1", from: "complaint",  to: "admission",  type: "directed" },
        { id: "e2", from: "admission",  to: "dismissed",  type: "directed", label: "No" },
        { id: "e3", from: "admission",  to: "prelim",     type: "directed", label: "Yes" },
        { id: "e4", from: "prelim",     to: "evidence",   type: "directed" },
        { id: "e5", from: "evidence",   to: "archived",   type: "directed", label: "No" },
        { id: "e6", from: "evidence",   to: "indictment", type: "directed", label: "Yes" },
        { id: "e7", from: "indictment", to: "trial",      type: "directed" },
        { id: "e8", from: "trial",      to: "verdict",    type: "directed" },
        { id: "e9", from: "verdict",    to: "acquitted",  type: "directed", label: "Not guilty" },
        { id: "e10",from: "verdict",    to: "convicted",  type: "directed", label: "Guilty" },
        { id: "e11",from: "convicted",  to: "appeal",     type: "directed" },
        { id: "e12",from: "acquitted",  to: "appeal",     type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta", "shapes.geometric"], directed: true,
    };
  }
}

// ── PedagogicalDiagramsPlugin ─────────────────────────────────────────────────
// Revised Bloom's (Anderson & Krathwohl 2001) — specific and actionable.

export class PedagogicalDiagramsPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEng, {
      pluginId:        "pedagogical-diagrams",
      displayName:     pluginText("pedagogical-diagrams", "displayName", "Pedagogical Diagrams"),
      description:     pluginText("pedagogical-diagrams", "description", "Bloom's taxonomy, learning outcome hierarchies, and curriculum maps for education theses."),
      category:        "humanities-social",
      engineId:        "tree-forest-engine",
      qualityLevel:    "experimental",
      requiredPackages: ["forest", "tikz"],
      scopeWarning:    pluginText("pedagogical-diagrams", "scopeWarning", "Covers common pedagogical diagram patterns. For complex instructional-design models, keep the authoritative diagram in draw.io/Figma and import the final PDF/SVG."),
      blockKind:       "input",
      defaultCaption:  pluginText("pedagogical-diagrams", "defaultCaption", "Revised Bloom's taxonomy — six cognitive levels with representative verbs (Anderson \\& Krathwohl, 2001)."),
      defaultLabel:    "fig:blooms",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "taxonomic", growth: "south",
      root: {
        id: "root", label: "\\textbf{Cognitive Domain}", children: [
          { id: "remember", label: "1. Remember",  children: [
            { id: "r1", label: "define", children: [] },
            { id: "r2", label: "list / recall", children: [] },
          ]},
          { id: "understand", label: "2. Understand", children: [
            { id: "u1", label: "explain", children: [] },
            { id: "u2", label: "classify", children: [] },
          ]},
          { id: "apply", label: "3. Apply", children: [
            { id: "a1", label: "execute", children: [] },
            { id: "a2", label: "implement", children: [] },
          ]},
          { id: "analyse", label: "4. Analyse", children: [
            { id: "an1", label: "differentiate", children: [] },
            { id: "an2", label: "organise", children: [] },
          ]},
          { id: "evaluate", label: "5. Evaluate", children: [
            { id: "ev1", label: "judge / critique", children: [] },
          ]},
          { id: "create", label: "6. Create", children: [
            { id: "c1", label: "design / produce", children: [] },
          ]},
        ],
      },
    };
  }
}
