import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine = new PGFPlotsEngine();

// ── Plugin 8 — 2D Function Plots ──────────────────────────────────

export class FunctionPlots2DPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "function-plots-2d",
      displayName:     "2D Function Plots",
      description:     "Plot mathematical functions with labeled axes, grid, and legend. PGFPlots native.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  "Plot of $f(x) = x^2$.",
      defaultLabel:    "fig:plot-2d",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "s1", label: "$f(x) = x^2$",
        plotType: "function2d", expression: "x^2", domain: [-2, 2], color: "blue",
      }],
      xLabel: "$x$", yLabel: "$f(x)$",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
  }
}

// ── Plugin 9 — Parametric & Polar Plots ──────────────────────────

export class ParametricPolarPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "parametric-polar-plots",
      displayName:     "Parametric & Polar Plots",
      description:     "Parametric curves and polar function plots.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  "Parametric circle.",
      defaultLabel:    "fig:parametric",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "s1", label: "Circle",
        plotType: "parametric",
        expression: "({cos(deg(x))},{sin(deg(x))})",
        domain: [0, 6.28],
      }],
      xLabel: "$x$", yLabel: "$y$",
      xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
    };
  }
}

// ── Plugin 10 — Basic Statistics Charts ──────────────────────────

export class BasicStatisticsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "basic-statistics",
      displayName:     "Basic Statistics Charts",
      description:     "Bar charts, histograms, and scatter plots from tabular data.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  "Frequency distribution.",
      defaultLabel:    "fig:stats-bar",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "s1", label: "Frequency", plotType: "bar",
        data: [
          { x: 1, y: 5 }, { x: 2, y: 8 },
          { x: 3, y: 12 }, { x: 4, y: 7 }, { x: 5, y: 3 },
        ],
        color: "blue!60",
      }],
      xLabel: "Category", yLabel: "Frequency",
      xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
    };
  }
}

// ── Plugin 11 — Statistical Distributions ────────────────────────

export class StatisticalDistributionsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "statistical-distributions",
      displayName:     "Statistical Distributions",
      description:     "Normal, t, chi-squared, and other distributions with shaded regions.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  "Standard normal distribution.",
      defaultLabel:    "fig:normal-dist",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "normal", label: "$\\mathcal{N}(0,1)$",
        plotType: "function2d",
        expression: "exp(-x^2/2)/sqrt(2*pi)",
        domain: [-4, 4], color: "blue",
      }],
      xLabel: "$z$", yLabel: "$f(z)$",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
  }
}
