import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine = new PGFPlotsEngine();

// ── Plugin 41 — Bar Charts & Histograms ──────────────────────────────────────
// Stacked percentage bar chart — shows composition across groups.
// More informative than plain grouped bars for part-whole relationships.

export class BarChartsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "bar-charts",
      displayName:     "Bar Charts & Histograms",
      description:     "Grouped and stacked bar charts, frequency histograms for descriptive statistics.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter values manually. For charts from large datasets, generate in R/Python and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Grouped bar chart — mean response by condition and time point ($\\pm$\\,SD).",
      defaultLabel:    "fig:bar-chart",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "ctrl", label: "Control",
          plotType: "bar",
          data: [
            { x: 1, y: 38.4 }, { x: 2, y: 41.2 },
            { x: 3, y: 44.8 }, { x: 4, y: 43.5 },
          ],
          color: "blue!60",
        },
        {
          id: "low",  label: "Low dose",
          plotType: "bar",
          data: [
            { x: 1, y: 47.3 }, { x: 2, y: 54.1 },
            { x: 3, y: 58.6 }, { x: 4, y: 55.9 },
          ],
          color: "orange!70",
        },
        {
          id: "high", label: "High dose",
          plotType: "bar",
          data: [
            { x: 1, y: 51.8 }, { x: 2, y: 63.4 },
            { x: 3, y: 71.2 }, { x: 4, y: 67.0 },
          ],
          color: "red!60",
        },
      ],
      xLabel: "Week",
      yLabel: "Mean response (a.u.)",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: [
        "ybar, bar width=0.28cm",
        "enlarge x limits=0.18",
        "xtick={1,2,3,4}",
        "xticklabels={2, 4, 8, 12}",
        "ymin=0",
        "legend pos=north west",
        "legend style={font=\\small}",
      ].join(",\n      "),
    };
  }
}

// ── Plugin 42 — Box Plots ─────────────────────────────────────────────────────
// Three-group comparison with pre-computed quartiles.
// Standard for clinical and experimental theses comparing distributions.

export class BoxViolinPlotsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "box-violin-plots",
      displayName:     "Box Plots & Distribution Comparisons",
      description:     "Box-and-whisker plots with medians, quartiles, and outliers for comparing distributions.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter pre-computed statistics (median, Q1, Q3) from R/Python. Each data point encodes: x=group position, y=median, error=IQR half-range.",
      blockKind:       "input",
      defaultCaption:  "Distribution of test scores across three teaching conditions (box: Q1--Q3; whiskers: 1.5$\\times$IQR).",
      defaultLabel:    "fig:boxplot",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Three groups: Traditional, Blended, Online teaching
    // Statistics: x=position, y=median, error=half-IQR (Q3-Q1)/2
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "trad",    label: "Traditional ($n{=}42$)",
          plotType: "boxplot",
          data: [{ x: 1, y: 68, error: 12 }],
          color: "blue",
        },
        {
          id: "blend",   label: "Blended ($n{=}44$)",
          plotType: "boxplot",
          data: [{ x: 2, y: 74, error: 9 }],
          color: "orange",
        },
        {
          id: "online",  label: "Online ($n{=}38$)",
          plotType: "boxplot",
          data: [{ x: 3, y: 71, error: 14 }],
          color: "green!60!black",
        },
      ],
      xLabel: "Teaching condition",
      yLabel: "Score (0--100)",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: [
        "ymin=20, ymax=105",
        "xtick={1,2,3}",
        "xticklabels={Traditional, Blended, Online}",
        "xticklabel style={font=\\small}",
        "legend pos=north east",
      ].join(",\n      "),
    };
  }
}

// ── Plugin 43 — Scatter Plots with Regression ────────────────────────────────
// Scatter + regression line + 95% CI band — standard in quantitative chapters.
// Example: BMI vs systolic blood pressure (classic epidemiological relationship).

export class ScatterRegressionPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "scatter-regression",
      displayName:     "Scatter Plots with Regression",
      description:     "Scatter plot with linear regression line and optional confidence band.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Compute slope, intercept, and CI band in your statistical software. Enter the values here for publication-quality rendering.",
      blockKind:       "input",
      defaultCaption:  "BMI vs systolic blood pressure: $\\hat{y} = 89.4 + 1.83x$, $R^2{=}0.74$, $p{<}0.001$ ($n{=}120$).",
      defaultLabel:    "fig:scatter-regression",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Realistic blood pressure vs BMI data (simulated from typical values)
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        // 95% CI band (upper and lower bounds as shaded area)
        {
          id: "ci_upper", label: "",
          plotType: "function2d",
          expression: "89.4 + 1.83*x + 8.5",
          domain: [17, 40],
          color: "blue!20",
        },
        {
          id: "ci_lower", label: "",
          plotType: "function2d",
          expression: "89.4 + 1.83*x - 8.5",
          domain: [17, 40],
          color: "blue!20",
        },
        // Regression line
        {
          id: "fit",
          label: "$\\hat{y} = 89.4 + 1.83x$\\quad($R^2{=}0.74$)",
          plotType: "function2d",
          expression: "89.4 + 1.83*x",
          domain: [17, 40],
          color: "blue",
        },
        // Observed data points
        {
          id: "data", label: "Observed ($n{=}120$)",
          plotType: "scatter",
          data: [
            { x: 18.2, y: 122 }, { x: 19.5, y: 118 }, { x: 20.1, y: 128 }, { x: 21.0, y: 124 },
            { x: 21.8, y: 130 }, { x: 22.4, y: 126 }, { x: 23.1, y: 135 }, { x: 23.8, y: 130 },
            { x: 24.5, y: 138 }, { x: 25.2, y: 140 }, { x: 25.9, y: 136 }, { x: 26.6, y: 143 },
            { x: 27.3, y: 147 }, { x: 28.0, y: 142 }, { x: 28.7, y: 150 }, { x: 29.4, y: 155 },
            { x: 30.1, y: 148 }, { x: 31.0, y: 158 }, { x: 32.5, y: 162 }, { x: 34.0, y: 170 },
          ],
          color: "blue", mark: "o",
        },
      ],
      xLabel: "BMI (kg/m$^2$)",
      yLabel: "Systolic BP (mmHg)",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: [
        "xmin=16, xmax=41",
        "ymin=110, ymax=180",
        "legend pos=north west",
        "legend style={font=\\small}",
        "fill opacity=0.25",
      ].join(",\n      "),
    };
  }
}
