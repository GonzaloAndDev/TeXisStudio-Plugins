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
      description:     "Time series with trend, confidence band, and annotated events. Ideal for longitudinal data in economics, ecology, and clinical research.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter data points manually. For large or complex time series (ARIMA, seasonal), generate in R/Python and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Monthly CO$_2$ concentration (ppm) with long-term trend and $\\pm$2\\,SD band.",
      defaultLabel:    "fig:time-series",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // CO₂ concentration — canonical time series, universally recognizable in environmental/climate theses
    // Mauna Loa approximation: ~2 ppm/year rise + seasonal ±3 ppm oscillation
    const data = [
      { x:1,  y:415.2 }, { x:2,  y:416.1 }, { x:3,  y:417.8 }, { x:4,  y:419.2 },
      { x:5,  y:420.8 }, { x:6,  y:419.4 }, { x:7,  y:417.6 }, { x:8,  y:415.9 },
      { x:9,  y:414.8 }, { x:10, y:414.2 }, { x:11, y:415.7 }, { x:12, y:416.4 },
      { x:13, y:417.4 }, { x:14, y:418.3 }, { x:15, y:419.9 }, { x:16, y:421.3 },
      { x:17, y:422.9 }, { x:18, y:421.7 }, { x:19, y:419.8 }, { x:20, y:418.1 },
      { x:21, y:417.0 }, { x:22, y:416.4 }, { x:23, y:417.9 }, { x:24, y:418.8 },
    ];
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        // Upper CI band
        {
          id: "band_hi", label: "",
          plotType: "function2d",
          expression: "414.9 + 0.165*x + 3.5",
          domain: [0.5, 24.5],
          color: "blue!15",
        },
        // Lower CI band
        {
          id: "band_lo", label: "",
          plotType: "function2d",
          expression: "414.9 + 0.165*x - 3.5",
          domain: [0.5, 24.5],
          color: "blue!15",
        },
        // Trend line
        {
          id: "trend", label: "Trend ($+2.0$\\,ppm/yr)",
          plotType: "function2d",
          expression: "414.9 + 0.165*x",
          domain: [0.5, 24.5],
          color: "red",
        },
        // Observations
        {
          id: "obs", label: "Monthly CO$_2$ (ppm)",
          plotType: "scatter",
          data,
          color: "blue!80", mark: "o",
        },
      ],
      xLabel: "Month (Year 1--2)",
      yLabel: "CO$_2$ (ppm)",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: [
        "xtick={1,4,7,10,13,16,19,22}",
        "xticklabels={Jan, Apr, Jul, Oct, Jan, Apr, Jul, Oct}",
        "xticklabel style={font=\\small}",
        "ymin=412, ymax=426",
        "legend pos=north west",
        "legend style={font=\\small}",
        "fill opacity=0.35",
      ].join(",\n      "),
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

// ParallelCoordinates migrated to PGFPlots for proper axis rendering.
// Each axis = one criterion (0–10 scale); each line = one alternative.
export class ParallelCoordinatesPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "parallel-coordinates",
      displayName:     "Parallel Coordinates / Criteria Matrix",
      description:     "Parallel coordinate plots for multi-criteria comparison of alternatives across normalised dimensions (0--10 scale).",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Normalise all criteria to a common scale (e.g. 0--10) before entering values. For many alternatives (>6), use Python/R and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Parallel coordinate plot comparing five software solutions on four criteria.",
      defaultLabel:    "fig:parallel-coords",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // 5 software solutions × 4 criteria (normalised 0-10):
    // Cost (lower=better, inverted), Performance, Reliability, Ease-of-use
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        { id: "A", label: "Solution A", plotType: "scatter",
          data: [{ x:1, y:8.5 }, { x:2, y:7.2 }, { x:3, y:9.0 }, { x:4, y:6.8 }],
          color: "blue", mark: "*" },
        { id: "B", label: "Solution B", plotType: "scatter",
          data: [{ x:1, y:6.0 }, { x:2, y:9.5 }, { x:3, y:7.8 }, { x:4, y:8.4 }],
          color: "red", mark: "square*" },
        { id: "C", label: "Solution C", plotType: "scatter",
          data: [{ x:1, y:9.2 }, { x:2, y:5.8 }, { x:3, y:8.5 }, { x:4, y:7.2 }],
          color: "green!60!black", mark: "triangle*" },
        { id: "D", label: "Solution D", plotType: "scatter",
          data: [{ x:1, y:5.5 }, { x:2, y:8.0 }, { x:3, y:6.5 }, { x:4, y:9.5 }],
          color: "orange!80", mark: "diamond*" },
        { id: "E", label: "Solution E", plotType: "scatter",
          data: [{ x:1, y:7.8 }, { x:2, y:6.5 }, { x:3, y:7.0 }, { x:4, y:8.0 }],
          color: "purple!70", mark: "pentagon*" },
      ],
      xLabel: "Criterion",
      yLabel: "Score (0--10)",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: [
        "xtick={1,2,3,4}",
        "xticklabels={Cost (inv.), Performance, Reliability, Ease-of-use}",
        "xticklabel style={rotate=20, anchor=east, font=\\small}",
        "ymin=0, ymax=10.5",
        "legend pos=outer north east",
        "legend style={font=\\small}",
        "xmin=0.5, xmax=4.5",
        // Draw connecting lines between data points for each series
        "every axis plot post/.append style={line width=0.8pt}",
      ].join(",\n      "),
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
