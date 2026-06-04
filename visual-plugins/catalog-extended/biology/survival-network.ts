import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const pgfEng   = new PGFPlotsEngine();
const graphEng = new GraphNodeEngine();

// ── Plugin 58 — Kaplan-Meier Survival Curves ─────────────────────────────────
// Proper step-function KM curves for two arms of an RCT (breast cancer example).
// Uses scatter+mark=none so pgfplots draws connected step-function lines.

export class KaplanMeierPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "kaplan-meier",
      displayName:     pluginText("kaplan-meier", "displayName", "Kaplan-Meier Survival Curves"),
      description:     pluginText("kaplan-meier", "description", "Step-function survival curves for clinical and epidemiological studies."),
      category:        "biology-medicine",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    pluginText("kaplan-meier", "scopeWarning", "Enter pre-computed KM estimates (from R survfit, Stata stcurve, or SPSS) as data points forming a step function. Statistical tests must be done externally."),
      blockKind:       "input",
      defaultCaption:  pluginText("kaplan-meier", "defaultCaption", "Kaplan--Meier overall survival curves for adjuvant vs.\\ standard chemotherapy ($n{=}200$; log-rank $p{=}0.008$)."),
      defaultLabel:    "fig:km-survival",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // KM step function: each event creates two points at the same x (horizontal step then drop)
    // Treatment arm (adjuvant chemotherapy): longer median survival
    const treatment = [
      { x: 0, y: 1.000 }, { x: 4, y: 1.000 }, { x: 4, y: 0.940 },
      { x: 8, y: 0.940 }, { x: 8, y: 0.898 }, { x: 13, y: 0.898 },
      { x: 13, y: 0.855 }, { x: 18, y: 0.855 }, { x: 18, y: 0.812 },
      { x: 24, y: 0.812 }, { x: 24, y: 0.769 }, { x: 30, y: 0.769 },
      { x: 30, y: 0.726 }, { x: 36, y: 0.726 }, { x: 36, y: 0.690 },
      { x: 48, y: 0.690 }, { x: 48, y: 0.650 }, { x: 60, y: 0.650 },
    ];
    // Control arm: steeper decline
    const control = [
      { x: 0, y: 1.000 }, { x: 3, y: 1.000 }, { x: 3, y: 0.920 },
      { x: 6, y: 0.920 }, { x: 6, y: 0.855 }, { x: 10, y: 0.855 },
      { x: 10, y: 0.796 }, { x: 15, y: 0.796 }, { x: 15, y: 0.730 },
      { x: 20, y: 0.730 }, { x: 20, y: 0.672 }, { x: 26, y: 0.672 },
      { x: 26, y: 0.610 }, { x: 33, y: 0.610 }, { x: 33, y: 0.558 },
      { x: 42, y: 0.558 }, { x: 42, y: 0.510 }, { x: 60, y: 0.510 },
    ];
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "trt", label: "Adjuvant chemo ($n{=}100$, med.\\,OS = NR)",
          plotType: "scatter",
          data: treatment,
          color: "blue", mark: "none",
        },
        {
          id: "ctl", label: "Standard ($n{=}100$, med.\\,OS = 34 mo)",
          plotType: "scatter",
          data: control,
          color: "red", mark: "none",
        },
      ],
      xLabel: "Time (months)",
      yLabel: "Overall survival probability",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: [
        "ymin=0, ymax=1.05, xmin=0, xmax=62",
        "xtick={0,12,24,36,48,60}",
        "legend pos=south west",
        "legend style={font=\\small}",
      ].join(",\n      "),
    };
  }
}

// ── Plugin 59 — Network / Social Graphs ──────────────────────────────────────
// Co-authorship / citation network with 10 named nodes and community structure.

export class NetworkGraphPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "network-graph",
      displayName:     pluginText("network-graph", "displayName", "Network / Social Graphs"),
      description:     pluginText("network-graph", "description", "Co-authorship, citation, or social influence networks with community clustering."),
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("network-graph", "scopeWarning", "Suitable for illustrative networks (≤ 15 nodes). For large-scale visualization, use Gephi or NetworkX and import as PDF."),
      blockKind:       "input",
      defaultCaption:  pluginText("network-graph", "defaultCaption", "Co-authorship network — two research clusters connected by a bridge author."),
      defaultLabel:    "fig:network",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // 10 nodes: 2 clusters (ML and Statistics) with a bridge node
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // ML cluster (left)
        { id: "A",  label: "LeCun",    shape: "circle", position: { x: 0,   y: 2 } },
        { id: "B",  label: "Bengio",   shape: "circle", position: { x: -2,  y: 0 } },
        { id: "C",  label: "Hinton",   shape: "circle", position: { x: 0,   y: 0 } },
        { id: "D",  label: "Schmid.",  shape: "circle", position: { x: -1,  y: -2 } },
        // Bridge node
        { id: "E",  label: "Vapnik",   shape: "circle", position: { x: 3,   y: 0 } },
        // Stats cluster (right)
        { id: "F",  label: "Hastie",   shape: "circle", position: { x: 6,   y: 2 } },
        { id: "G",  label: "Tibshir.", shape: "circle", position: { x: 8,   y: 0 } },
        { id: "H",  label: "Friedman", shape: "circle", position: { x: 6,   y: 0 } },
        { id: "I",  label: "Efron",    shape: "circle", position: { x: 5,   y: -2 } },
        { id: "J",  label: "Gelman",   shape: "circle", position: { x: 8,   y: -2 } },
      ],
      edges: [
        // ML cluster
        { id: "e1",  from: "A", to: "B", type: "undirected" },
        { id: "e2",  from: "A", to: "C", type: "undirected" },
        { id: "e3",  from: "B", to: "C", type: "undirected" },
        { id: "e4",  from: "B", to: "D", type: "undirected" },
        { id: "e5",  from: "C", to: "D", type: "undirected" },
        // Bridge
        { id: "e6",  from: "C", to: "E", type: "undirected" },
        { id: "e7",  from: "E", to: "H", type: "undirected" },
        // Stats cluster
        { id: "e8",  from: "F", to: "G", type: "undirected" },
        { id: "e9",  from: "F", to: "H", type: "undirected" },
        { id: "e10", from: "G", to: "H", type: "undirected" },
        { id: "e11", from: "H", to: "I", type: "undirected" },
        { id: "e12", from: "G", to: "J", type: "undirected" },
        { id: "e13", from: "E", to: "I", type: "undirected" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: false,
    };
  }
}
