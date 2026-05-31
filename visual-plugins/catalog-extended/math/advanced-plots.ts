import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine = new PGFPlotsEngine();

// ── Plugin 36 — 3D Scientific Plots ──────────────────────────────────────────
// Bivariate Gaussian — the most recognizable 3D surface in statistics, ML
// and probability courses. Immediately useful to any quantitative thesis.

export class Plots3DPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "plots-3d",
      displayName:     "3D Scientific Plots",
      description:     "3D surfaces, wireframes, and contour plots. PGFPlots native.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "3D plots compile slowly for fine meshes. Keep samples ≤ 25×25 for reasonable compile time.",
      blockKind:       "input",
      defaultCaption:  "Standard bivariate normal density $f(x,y) = \\frac{1}{2\\pi}e^{-\\frac{x^2+y^2}{2}}$.",
      defaultLabel:    "fig:surface-3d",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "gaussian",
        label: "",
        plotType: "surface",
        // Bivariate standard normal: (1/2π) * exp(-(x²+y²)/2)
        expression: "{exp(-0.5*(x^2+y^2))/(2*pi)}",
        domain: [-3, 3],
      }],
      xLabel: "$x$",
      yLabel: "$y$",
      xScale: "linear",
      yScale: "linear",
      showLegend: false,
      grid: false,
      pgfplotsOptions: [
        "view={45}{35}",
        "colormap/viridis",
        "colorbar",
        "colorbar style={ylabel={$f(x,y)$}}",
        "samples=22",
        "xlabel style={sloped like x axis}",
        "ylabel style={sloped like y axis}",
        "zlabel={$f(x,y)$}",
        "shader=interp",
      ].join(",\n      "),
    };
  }
}

// ── Plugin 38 — Phase Diagrams ────────────────────────────────────────────────
// Lotka-Volterra (predator-prey) nullclines with equilibrium point.
// Standard in mathematical biology, ecology, and applied math theses.

export class PhaseDiagramsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "phase-diagrams",
      displayName:     "Phase Diagrams",
      description:     "Phase portraits, nullclines, and stability diagrams for dynamical systems.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Suitable for 2D phase planes and nullcline plots. Full vector-field arrows require manual pgfplots quiver adjustments.",
      blockKind:       "input",
      defaultCaption:  "Lotka--Volterra phase plane: prey $x$ vs predator $y$ nullclines ($\\alpha{=}1,\\beta{=}0.5,\\gamma{=}0.75,\\delta{=}0.25$).",
      defaultLabel:    "fig:phase-diagram",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Lotka-Volterra: dx/dt = αx - βxy, dy/dt = δxy - γy
    // α=1, β=0.5, γ=0.75, δ=0.25
    // x-nullclines: x=0  OR  y = α/β = 2
    // y-nullclines: y=0  OR  x = γ/δ = 3
    // Non-trivial equilibrium: (x*, y*) = (γ/δ, α/β) = (3, 2)
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "xnull_v", label: "Prey nullcline ($\\dot{x}=0$)",
          plotType: "function2d",
          // y = α/β = 2 (horizontal line)
          expression: "2",
          domain: [0, 6],
          color: "blue",
        },
        {
          id: "ynull_v", label: "Predator nullcline ($x=3$)",
          plotType: "scatter",
          // Vertical line at x=3: scatter with mark=none draws a connected line
          data: [{ x: 3, y: 0.02 }, { x: 3, y: 4.4 }],
          color: "red", mark: "none",
        },
        // Trajectory: closed orbit around equilibrium (representative orbit)
        {
          id: "orbit", label: "Representative orbit",
          plotType: "parametric",
          // Approximate ellipse around (3, 2) for illustration
          expression: "({3 + 2*cos(deg(x))}, {2 + 1*sin(deg(x))})",
          domain: [0, 6.28],
          color: "green!50!black",
        },
        // Equilibrium point
        {
          id: "eq", label: "Equilibrium $(3,2)$",
          plotType: "scatter",
          data: [{ x: 3, y: 2 }],
          color: "black", mark: "*",
        },
      ],
      xLabel: "Prey $x$",
      yLabel: "Predator $y$",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: "xmin=0, xmax=7, ymin=0, ymax=4.5, legend pos=north east",
    };
  }
}

// ── Plugin 40 — Heat Maps ─────────────────────────────────────────────────────
// Proper correlation matrix heatmap (4×4) using pgfplots matrix plot*.
// Fundamental in multivariate statistics, factor analysis, and ML theses.

export class HeatMapsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "heat-maps",
      displayName:     "Correlation Heat Maps",
      description:     "Correlation matrices and heat maps using pgfplots matrix plot. Values between -1 and 1, color-mapped.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Suitable for small matrices (≤ 10×10). Compute correlations in R/Python first, then enter the values here.",
      blockKind:       "input",
      defaultCaption:  "Pearson correlation matrix for four psychometric variables.",
      defaultLabel:    "fig:heatmap",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // 4×4 correlation matrix (typical psychometric / survey data)
    // Variables: Anxiety, Depression, Stress, Wellbeing
    // Rows/columns: 0=Anxiety, 1=Depression, 2=Stress, 3=Wellbeing
    const corr = [
      [1.00,  0.72,  0.68, -0.55],   // Anxiety
      [0.72,  1.00,  0.61, -0.62],   // Depression
      [0.68,  0.61,  1.00, -0.48],   // Stress
      [-0.55,-0.62, -0.48,  1.00],   // Wellbeing
    ];

    // Build data array: each cell (col, row) [meta]
    const data: Array<{ x: number; y: number; meta: number }> = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        data.push({ x: col, y: row, meta: corr[row]?.[col] ?? 0 });
      }
    }

    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "corr",
        label: "",
        plotType: "heatmap",
        data,
      }],
      xLabel: "",
      yLabel: "",
      xScale: "linear",
      yScale: "linear",
      showLegend: false,
      grid: false,
      pgfplotsOptions: [
        "xtick={0,1,2,3}",
        "xticklabels={Anxiety, Depression, Stress, Wellbeing}",
        "xticklabel style={rotate=30, anchor=east, font=\\small}",
        "ytick={0,1,2,3}",
        "yticklabels={Anxiety, Depression, Stress, Wellbeing}",
        "yticklabel style={font=\\small}",
        "width=7cm, height=7cm",
      ].join(",\n      "),
    };
  }
}
