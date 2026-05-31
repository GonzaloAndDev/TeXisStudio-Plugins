import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine = new PGFPlotsEngine();

// ── Plugin 36 — 3D Scientific Plots ──────────────────────────────

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
      defaultCaption:  "Surface plot of $z = \\sin(x)\\cos(y)$.",
      defaultLabel:    "fig:surface-3d",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "s1", label: "$z = \\sin(x)\\cos(y)$",
        plotType: "surface",
        expression: "{sin(deg(x))*cos(deg(y))}",
        domain: [-3.14, 3.14],
      }],
      xLabel: "$x$", yLabel: "$y$",
      xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
      pgfplotsOptions: "view={60}{30}, colormap/cool",
    };
  }
}

// ── Plugin 38 — Phase Diagrams ────────────────────────────────────

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
      scopeWarning:    "Suitable for 2D phase planes and simple nullcline plots. Complex vector field flows may need manual pgfplots adjustments.",
      blockKind:       "input",
      defaultCaption:  "Phase diagram.",
      defaultLabel:    "fig:phase-diagram",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        { id: "s1", label: "Nullcline $\\dot{x}=0$", plotType: "function2d", expression: "x",  domain: [-2, 2], color: "blue" },
        { id: "s2", label: "Nullcline $\\dot{y}=0$", plotType: "function2d", expression: "-x", domain: [-2, 2], color: "red" },
      ],
      xLabel: "$x$", yLabel: "$y$",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
  }
}

// ── Plugin 40 — Heat Maps ─────────────────────────────────────────

export class HeatMapsPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(engine, {
      pluginId:        "heat-maps",
      displayName:     "Simple Heat Maps",
      description:     "Correlation matrices and simple heat maps from tabular data.",
      category:        "mathematics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Suitable for small matrices (≤ 10×10). Large matrices produce slow LaTeX compilation.",
      blockKind:       "input",
      defaultCaption:  "Correlation heat map.",
      defaultLabel:    "fig:heatmap",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "s1", label: "Correlation",
        plotType: "scatter",
        data: [
          { x: 0, y: 0 }, { x: 1, y: 0 }, { x: 2, y: 0 },
          { x: 0, y: 1 }, { x: 1, y: 1 }, { x: 2, y: 1 },
        ],
        color: "blue",
      }],
      xLabel: "Variable", yLabel: "Variable",
      xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
      pgfplotsOptions: "colormap/hot, point meta=y",
    };
  }
}
