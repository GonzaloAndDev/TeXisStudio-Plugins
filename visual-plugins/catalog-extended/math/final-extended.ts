import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { TreeForestEngine } from "../../engines/tree-forest-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { TreeForestDocument } from "../../engines/tree-forest-engine/types.js";

const pgfEng   = new PGFPlotsEngine();
const graphEng = new GraphNodeEngine();
const treeEng  = new TreeForestEngine();

// ── Plugin 67 — Time Series Plots ─────────────────────────────────
// Ubiquitous in economics, finance, environmental science, and clinical research.

export class TimeSeriesPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "time-series",
      displayName:     "Time Series Plots",
      description:     "Line plots of time series data with optional trend, moving average, or confidence band overlay. Ideal for longitudinal data chapters.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter data points manually. For large time series or automatic smoothing, generate the figure in R/Python and import the PDF.",
      blockKind:       "input",
      defaultCaption:  "Time series with trend.",
      defaultLabel:    "fig:time-series",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "raw", label: "Observed values",
          plotType: "scatter",
          data: [
            { x: 1, y: 12.3 }, { x: 2, y: 14.1 }, { x: 3, y: 11.8 }, { x: 4, y: 15.6 },
            { x: 5, y: 16.9 }, { x: 6, y: 14.4 }, { x: 7, y: 18.2 }, { x: 8, y: 19.5 },
            { x: 9, y: 17.1 }, { x: 10, y: 21.3 }, { x: 11, y: 20.8 }, { x: 12, y: 23.4 },
          ],
          color: "blue", mark: "o",
        },
        {
          id: "trend", label: "Linear trend",
          plotType: "function2d",
          expression: "10.2 + 1.07*x",
          domain: [0.5, 12.5],
          color: "red",
        },
      ],
      xLabel: "Time period", yLabel: "Value",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
  }
}

// ── Plugin 68 — Genealogy / Family Trees ──────────────────────────
// Common in anthropology, history, and clinical genetics (pedigrees) theses.

export class GenealogyPlugin extends BasePlugin<TreeForestDocument> {
  constructor() {
    super(treeEng, {
      pluginId:        "genealogy",
      displayName:     "Genealogy / Family Trees",
      description:     "Family trees, dynasties, and clinical pedigrees with generations and relationship markers.",
      category:        "humanities-social",
      engineId:        "tree-forest-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["forest", "tikz"],
      scopeWarning:    "Suitable for simplified family trees. For clinical genetic pedigrees with standard symbols (ACMG/AMP), use dedicated pedigree software.",
      blockKind:       "input",
      defaultCaption:  "Family tree.",
      defaultLabel:    "fig:genealogy",
    });
  }

  protected buildDefaultDocument(): TreeForestDocument {
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "genealogy", growth: "south",
      root: {
        id: "g0", label: "\\textbf{Generation I}", children: [
          {
            id: "p1", label: "John (1920--1995)", children: [
              { id: "c1", label: "Mary (1948)", children: [
                { id: "gc1", label: "Alice (1975)", children: [] },
                { id: "gc2", label: "Bob (1978)", children: [] },
              ]},
              { id: "c2", label: "Peter (1951)", children: [
                { id: "gc3", label: "Carol (1980)", children: [] },
              ]},
            ],
          },
        ],
      },
    };
  }
}

// ── Plugin 69 — Parallel Coordinates ─────────────────────────────
// Multivariate visualization for comparing alternatives — used in decision analysis,
// multi-criteria evaluation, and operations research chapters.

export class ParallelCoordinatesPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "parallel-coordinates",
      displayName:     "Parallel Coordinates / Criteria Matrix",
      description:     "Parallel coordinate plots and multi-criteria decision matrices for comparing alternatives across dimensions.",
      category:        "mathematics",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    "This plugin generates a simplified parallel coordinates diagram. For polished interactive plots, use Python/R and export as PDF.",
      blockKind:       "input",
      defaultCaption:  "Multi-criteria comparison.",
      defaultLabel:    "fig:parallel-coords",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // Represent as a horizontal node chain with connecting edges
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "ax1", label: "Cost",          shape: "none", position: { x: 0, y: 0 } },
        { id: "ax2", label: "Performance",   shape: "none", position: { x: 3, y: 0 } },
        { id: "ax3", label: "Reliability",   shape: "none", position: { x: 6, y: 0 } },
        { id: "ax4", label: "Ease of use",   shape: "none", position: { x: 9, y: 0 } },
        // Alternative A values (as offset nodes)
        { id: "a1", label: "A",  shape: "circle", position: { x: 0,  y:  1.5 } },
        { id: "a2", label: "A",  shape: "circle", position: { x: 3,  y:  0.8 } },
        { id: "a3", label: "A",  shape: "circle", position: { x: 6,  y:  1.2 } },
        { id: "a4", label: "A",  shape: "circle", position: { x: 9,  y:  0.5 } },
        // Alternative B values
        { id: "b1", label: "B",  shape: "circle", position: { x: 0,  y: -0.5 } },
        { id: "b2", label: "B",  shape: "circle", position: { x: 3,  y:  1.5 } },
        { id: "b3", label: "B",  shape: "circle", position: { x: 6,  y:  0.3 } },
        { id: "b4", label: "B",  shape: "circle", position: { x: 9,  y:  1.4 } },
      ],
      edges: [
        { id: "a12", from: "a1", to: "a2", type: "undirected" },
        { id: "a23", from: "a2", to: "a3", type: "undirected" },
        { id: "a34", from: "a3", to: "a4", type: "undirected" },
        { id: "b12", from: "b1", to: "b2", type: "undirected" },
        { id: "b23", from: "b2", to: "b3", type: "undirected" },
        { id: "b34", from: "b3", to: "b4", type: "undirected" },
      ],
      layout: "manual", tikzLibraries: [], directed: false,
    };
  }
}

// ── Plugin 70 — Energy / Band Diagrams ────────────────────────────
// Standard in solid-state physics, semiconductor, and materials science theses.

export class EnergyBandPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "energy-band-diagrams",
      displayName:     "Energy / Band Diagrams",
      description:     "Energy level diagrams, band gaps, and semiconductor band diagrams for physics and materials science.",
      category:        "physics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Energy values are illustrative. Replace with your material's actual band gap and Fermi level values from literature or calculation.",
      blockKind:       "input",
      defaultCaption:  "Semiconductor band diagram.",
      defaultLabel:    "fig:band-diagram",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "ec",  label: "Conduction band ($E_c$)",
          plotType: "function2d", expression: "1.1", domain: [0, 4], color: "blue",
        },
        {
          id: "ev",  label: "Valence band ($E_v$)",
          plotType: "function2d", expression: "0.0", domain: [0, 4], color: "blue",
        },
        {
          id: "ef",  label: "Fermi level ($E_f$)",
          plotType: "function2d", expression: "0.55", domain: [0, 4], color: "red",
        },
      ],
      xLabel: "Position", yLabel: "Energy (eV)",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: false,
      pgfplotsOptions: "ymin=-0.3, ymax=1.5, xtick=\\empty",
    };
  }
}
