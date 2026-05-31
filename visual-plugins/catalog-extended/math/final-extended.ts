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
    // Hapsburg dynasty excerpt — 4 generations, known to anthropologists and historians.
    // Also works as a generic royal lineage for humanities theses.
    return {
      engineId: "tree-forest-engine", version: "1.0.0",
      style: "genealogy", growth: "south",
      root: {
        id: "maxI", label: "Maximilian I (1459--1519)", children: [
          {
            id: "philI", label: "Philip I (1478--1506)", children: [
              {
                id: "charlesV", label: "Charles V (1500--1558)", children: [
                  { id: "philII",  label: "Philip II (1527--1598)",  children: [] },
                  { id: "maria_a", label: "Maria (1528--1603)",      children: [] },
                ],
              },
              {
                id: "ferd_I", label: "Ferdinand I (1503--1564)", children: [
                  { id: "maxII",  label: "Maximilian II (1527--1576)", children: [] },
                  { id: "anna_f", label: "Anna (1528--1590)",          children: [] },
                ],
              },
            ],
          },
          {
            id: "margarita", label: "Margaret (1480--1530)", children: [],
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
    // p-n junction in equilibrium: band bending near the depletion region.
    // x<0 = p-type, x>0 = n-type; depletion region ≈ [-1, 1]
    // Ec bends smoothly; Ef is flat (no current flow in equilibrium).
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        // Conduction band Ec — flat in bulk, bends in depletion
        {
          id: "ec", label: "$E_c$ (conduction band)",
          plotType: "scatter",
          data: [
            { x:-3, y: 1.12 }, { x:-1, y: 1.12 },
            { x:-0.5, y: 0.95 }, { x: 0, y: 0.68 },
            { x: 0.5, y: 0.41 }, { x: 1, y: 0.24 },
            { x: 3, y: 0.24 },
          ],
          color: "blue", mark: "none",
        },
        // Valence band Ev — offset by band gap (Si: 1.12 eV)
        {
          id: "ev", label: "$E_v$ (valence band)",
          plotType: "scatter",
          data: [
            { x:-3, y: 0.00 }, { x:-1, y: 0.00 },
            { x:-0.5, y:-0.17 }, { x: 0, y:-0.44 },
            { x: 0.5, y:-0.71 }, { x: 1, y:-0.88 },
            { x: 3, y:-0.88 },
          ],
          color: "blue", mark: "none",
        },
        // Fermi level Ef — flat in equilibrium
        {
          id: "ef", label: "$E_F$ (Fermi level)",
          plotType: "scatter",
          data: [{ x:-3, y: 0.19 }, { x: 3, y: 0.19 }],
          color: "red", mark: "none",
        },
        // Vacuum level (optional reference)
        {
          id: "eint", label: "$E_i$ (intrinsic level)",
          plotType: "scatter",
          data: [
            { x:-3, y: 0.56 }, { x:-1, y: 0.56 },
            { x: 0, y: 0.12 }, { x: 1, y:-0.32 },
            { x: 3, y:-0.32 },
          ],
          color: "gray", mark: "none",
        },
      ],
      xLabel: "Position ($x$)",
      yLabel: "Energy (eV)",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: false,
      pgfplotsOptions: [
        "ymin=-1.1, ymax=1.4",
        "xmin=-3, xmax=3",
        "xtick={-3,-1,0,1,3}",
        "xticklabels={$-W$, $-x_p$, 0, $x_n$, $W$}",
        "legend pos=outer north east",
        "legend style={font=\\small}",
        // Depletion region shade
        "extra x ticks={-1, 1}",
        "extra x tick style={grid=major, grid style={gray!40, dashed}}",
      ].join(",\n      "),
    };
  }
}
