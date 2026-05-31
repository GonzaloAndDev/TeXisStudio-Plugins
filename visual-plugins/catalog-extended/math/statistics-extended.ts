import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine = new PGFPlotsEngine();

// ── Plugin 41 — Bar Charts & Grouped Bar Charts ───────────────────
// One of the most common figure types in any thesis.

export class BarChartsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "bar-charts",
      displayName:     "Bar Charts & Histograms",
      description:     "Grouped and stacked bar charts, frequency histograms. Essential for descriptive statistics in any thesis.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter values manually in the plugin configuration. For charts from large datasets, generate the figure in R/Python and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Grouped bar chart.",
      defaultLabel:    "fig:bar-chart",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "s1", label: "Group A",
          plotType: "bar",
          data: [{ x: 1, y: 42 }, { x: 2, y: 58 }, { x: 3, y: 37 }, { x: 4, y: 51 }],
          color: "blue",
        },
        {
          id: "s2", label: "Group B",
          plotType: "bar",
          data: [{ x: 1, y: 35 }, { x: 2, y: 64 }, { x: 3, y: 49 }, { x: 4, y: 43 }],
          color: "red",
        },
      ],
      xLabel: "Category", yLabel: "Frequency",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "ybar, bar width=0.35cm, enlarge x limits=0.15",
    };
  }
}

// ── Plugin 42 — Box Plots & Violin Plots ─────────────────────────
// Critical for presenting distribution comparisons in biomedical, social, and CS theses.

export class BoxViolinPlotsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "box-violin-plots",
      displayName:     "Box Plots & Distribution Comparisons",
      description:     "Box plots with whiskers, outliers, and median marks for comparing distributions across groups.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Box plots show precomputed statistics (Q1, median, Q3, whiskers). Compute these in R/Python/Excel and enter manually. For raw-data violin plots, import from R.",
      blockKind:       "input",
      defaultCaption:  "Box plot comparison across groups.",
      defaultLabel:    "fig:boxplot",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "g1", label: "Group A",
          plotType: "boxplot",
          // data encodes: x=position, y=median, error=IQR (Q1–Q3 half-range)
          data: [{ x: 1, y: 52, error: 12 }, { x: 2, y: 61, error: 8 }, { x: 3, y: 44, error: 15 }],
          color: "blue",
        },
      ],
      xLabel: "Group", yLabel: "Score",
      xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
      pgfplotsOptions: "boxplot/draw direction=y",
    };
  }
}

// ── Plugin 43 — Scatter Plots with Regression ─────────────────────
// Essential for empirical chapters: shows raw data + trend line + R² annotation.

export class ScatterRegressionPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "scatter-regression",
      displayName:     "Scatter Plots with Regression",
      description:     "Scatter plots with optional linear regression trend line and R² annotation. Perfect for correlation and regression chapters.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Regression line is specified as a function expression. Compute slope/intercept in your statistical software first.",
      blockKind:       "input",
      defaultCaption:  "Scatter plot with linear regression ($R^2 = 0.87$).",
      defaultLabel:    "fig:scatter-regression",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "data", label: "Observations",
          plotType: "scatter",
          data: [
            { x: 1,  y: 2.1  }, { x: 2,  y: 3.8  }, { x: 3,  y: 5.0  },
            { x: 4,  y: 7.2  }, { x: 5,  y: 8.9  }, { x: 6,  y: 10.5 },
            { x: 7,  y: 12.1 }, { x: 8,  y: 14.3 }, { x: 9,  y: 15.8 },
            { x: 10, y: 18.2 },
          ],
          color: "blue", mark: "*",
        },
        {
          id: "fit", label: "Linear fit: $\\hat{y} = 1.84x + 0.31$",
          plotType: "function2d",
          expression: "1.84*x + 0.31",
          domain: [0, 11],
          color: "red",
        },
      ],
      xLabel: "Independent variable", yLabel: "Dependent variable",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
  }
}
