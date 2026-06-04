import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const engine = new PGFPlotsEngine();

// ── Plugin 8 — 2D Function Plots ──────────────────────────────────

export class FunctionPlots2DPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "function-plots-2d",
      displayName:     pluginText("function-plots-2d", "displayName", "2D Function Plots"),
      description:     pluginText("function-plots-2d", "description", "Plot mathematical functions with labeled axes, grid, and legend. PGFPlots native."),
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("function-plots-2d", "defaultCaption", "Trigonometric functions $\\sin x$ and $\\cos x$."),
      defaultLabel:    "fig:plot-2d",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Two curves that complement each other — classic in engineering and physics theses
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "sinx", label: "$\\sin x$",
          plotType: "function2d",
          expression: "sin(deg(x))",
          domain: [-6.28, 6.28],
          color: "blue",
        },
        {
          id: "cosx", label: "$\\cos x$",
          plotType: "function2d",
          expression: "cos(deg(x))",
          domain: [-6.28, 6.28],
          color: "red",
        },
      ],
      xLabel: "$x$ (rad)",
      yLabel: "$f(x)$",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: "ymin=-1.3, ymax=1.3, xtick={-6.28,-3.14,0,3.14,6.28}, xticklabels={$-2\\pi$,$-\\pi$,$0$,$\\pi$,$2\\pi$}, minor tick num=3",
    };
  }
}

// ── Plugin 9 — Parametric & Polar Plots ──────────────────────────

export class ParametricPolarPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "parametric-polar-plots",
      displayName:     pluginText("parametric-polar-plots", "displayName", "Parametric & Polar Plots"),
      description:     pluginText("parametric-polar-plots", "description", "Parametric curves and polar function plots."),
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("parametric-polar-plots", "defaultCaption", "Lissajous curve $(\\cos 2t,\\, \\sin 3t)$."),
      defaultLabel:    "fig:parametric",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Lissajous figure — far more interesting than a plain circle
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "lissajous", label: "Lissajous $a{=}2,\\,b{=}3$",
        plotType: "parametric",
        expression: "({cos(deg(2*x))},{sin(deg(3*x))})",
        domain: [0, 6.28],
        color: "blue",
      }],
      xLabel: "$x$", yLabel: "$y$",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "axis equal, xmin=-1.2, xmax=1.2, ymin=-1.2, ymax=1.2",
    };
  }
}

// ── Plugin 10 — Basic Statistics Charts ──────────────────────────

export class BasicStatisticsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "basic-statistics",
      displayName:     pluginText("basic-statistics", "displayName", "Basic Statistics Charts"),
      description:     pluginText("basic-statistics", "description", "Bar charts, histograms, and scatter plots from tabular data."),
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("basic-statistics", "defaultCaption", "Comparative bar chart — measurement results by experimental group."),
      defaultLabel:    "fig:stats-bar",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Two-group comparison bar chart — extremely common in experimental theses
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "control", label: "Control",
          plotType: "bar",
          data: [
            { x: 1, y: 38.4 }, { x: 2, y: 42.1 },
            { x: 3, y: 35.7 }, { x: 4, y: 44.9 },
          ],
          color: "blue!60",
        },
        {
          id: "treatment", label: "Treatment",
          plotType: "bar",
          data: [
            { x: 1, y: 51.3 }, { x: 2, y: 58.7 },
            { x: 3, y: 62.4 }, { x: 4, y: 55.8 },
          ],
          color: "red!60",
        },
      ],
      xLabel: "Time point (weeks)",
      yLabel: "Response (µg/mL)",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "ybar, bar width=0.35cm, enlarge x limits=0.15, xtick={1,2,3,4}, xticklabels={2,4,8,12}, ymin=0",
    };
  }
}

// ── Plugin 11 — Statistical Distributions ────────────────────────

export class StatisticalDistributionsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "statistical-distributions",
      displayName:     pluginText("statistical-distributions", "displayName", "Statistical Distributions"),
      description:     pluginText("statistical-distributions", "description", "Normal, t, chi-squared, and other distributions with shaded regions."),
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("statistical-distributions", "defaultCaption", "Standard normal distribution with 95\\% confidence interval shaded."),
      defaultLabel:    "fig:normal-dist",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Normal with shaded CI region — the most commonly needed figure in statistics chapters
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          // Shaded CI region (filled plot, domain restricted)
          id: "ci",
          label: "95\\% CI",
          plotType: "function2d",
          expression: "exp(-x^2/2)/sqrt(2*pi)",
          domain: [-1.96, 1.96],
          color: "blue!25",
        },
        {
          // Full curve on top
          id: "normal",
          label: "$\\mathcal{N}(0,1)$",
          plotType: "function2d",
          expression: "exp(-x^2/2)/sqrt(2*pi)",
          domain: [-4, 4],
          color: "blue",
        },
      ],
      xLabel: "$z$",
      yLabel: "$\\varphi(z)$",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: [
        "ymin=0, ymax=0.45",
        "xtick={-1.96,0,1.96}",
        "xticklabels={$-1.96$,$0$,$1.96$}",
        "fill opacity=0.4",
        "area style",
      ].join(",\n    "),
    };
  }
}
