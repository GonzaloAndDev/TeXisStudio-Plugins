import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";

const pgfEng   = new PGFPlotsEngine();
const graphEng = new GraphNodeEngine();

// ── Plugin 58 — Kaplan-Meier Survival Curves ──────────────────────
// One of the most common figures in clinical / epidemiological theses.

export class KaplanMeierPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "kaplan-meier",
      displayName:     "Kaplan-Meier Survival Curves",
      description:     "Step-function survival curves for clinical and epidemiological studies. Supports multiple groups with censoring marks.",
      category:        "biology-medicine",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter pre-computed survival probabilities (from R/Stata/SPSS) as data points. This plugin renders the step function; statistical analysis must be done externally.",
      blockKind:       "input",
      defaultCaption:  "Kaplan-Meier survival curves.",
      defaultLabel:    "fig:km-survival",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "treatment", label: "Treatment group ($n=50$)",
          plotType: "function2d",
          // Step function approximation — in real use, enter actual KM estimates
          data: [
            { x: 0, y: 1.00 }, { x: 3, y: 1.00 }, { x: 3, y: 0.92 },
            { x: 7, y: 0.92 }, { x: 7, y: 0.86 }, { x: 12, y: 0.86 },
            { x: 12, y: 0.80 }, { x: 18, y: 0.80 }, { x: 18, y: 0.74 },
            { x: 24, y: 0.74 }, { x: 24, y: 0.68 },
          ],
          color: "blue",
        },
        {
          id: "control", label: "Control group ($n=50$)",
          plotType: "function2d",
          data: [
            { x: 0, y: 1.00 }, { x: 2, y: 1.00 }, { x: 2, y: 0.88 },
            { x: 5, y: 0.88 }, { x: 5, y: 0.76 }, { x: 9, y: 0.76 },
            { x: 9, y: 0.62 }, { x: 14, y: 0.62 }, { x: 14, y: 0.54 },
            { x: 24, y: 0.54 },
          ],
          color: "red",
        },
      ],
      xLabel: "Time (months)", yLabel: "Survival probability",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "ymin=0, ymax=1.05, xmin=0",
    };
  }
}

// ── Plugin 59 — Social / Citation Network Graphs ───────────────────
// Essential for network analysis chapters in CS, social science, bibliometrics.

export class NetworkGraphPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "network-graph",
      displayName:     "Network / Social Graphs",
      description:     "Directed and undirected graphs for network analysis: social networks, citation networks, co-authorship, dependency graphs.",
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for illustrative networks (≤ 15 nodes). For large-scale network visualization, use Gephi or NetworkX and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Social network graph.",
      defaultLabel:    "fig:network",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "A", label: "Actor A", shape: "circle", position: { x: 0,   y: 0   }, group: "cluster1" },
        { id: "B", label: "Actor B", shape: "circle", position: { x: 2,   y: 1   }, group: "cluster1" },
        { id: "C", label: "Actor C", shape: "circle", position: { x: 2,   y: -1  }, group: "cluster1" },
        { id: "D", label: "Actor D", shape: "circle", position: { x: 4,   y: 0   }, group: "cluster2" },
        { id: "E", label: "Actor E", shape: "circle", position: { x: 6,   y: 1   }, group: "cluster2" },
        { id: "F", label: "Actor F", shape: "circle", position: { x: 6,   y: -1  }, group: "cluster2" },
      ],
      edges: [
        { id: "e1", from: "A", to: "B", type: "undirected", weight: 3 },
        { id: "e2", from: "A", to: "C", type: "undirected", weight: 2 },
        { id: "e3", from: "B", to: "C", type: "undirected", weight: 1 },
        { id: "e4", from: "B", to: "D", type: "undirected", weight: 2 },
        { id: "e5", from: "D", to: "E", type: "undirected", weight: 3 },
        { id: "e6", from: "D", to: "F", type: "undirected", weight: 2 },
        { id: "e7", from: "E", to: "F", type: "undirected", weight: 1 },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: false,
    };
  }
}
