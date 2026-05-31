import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine = new PGFPlotsEngine();
function fid(): string { return `fig_${Math.floor(Math.random() * 9000) + 1000}`; }

async function pgfR(id: string, pid: string, doc: PGFPlotsDocument, caption: string, label: string): Promise<VisualFigureResult> {
  const exp = await engine.export(doc, "latex");
  const tex = `texisstudio-assets/figures/${id}/output.tex`;
  return { figureId: id, pluginId: pid, engineId: "pgfplots-engine", latexBlock: buildLatexInputBlock({ figureId: id, inputPath: tex, caption, label }), requiredPackages: exp.requiredPackages, sourcePath: `texisstudio-assets/figures/${id}/source.json`, outputPaths: { tex }, warnings: [] };
}

// Plugin 36 — 3D scientific plots
export class Plots3DPlugin implements VisualDiagramPlugin {
  readonly pluginId = "plots-3d";
  readonly displayName = "3D Scientific Plots";
  readonly description = "3D surfaces, wireframes, and contour plots. PGFPlots native.";
  readonly category = "mathematics" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;
  readonly scopeWarning = "3D plots compile slowly for fine meshes. Keep samples ≤ 25×25 for reasonable compile time.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "s1", label: "$z = \\sin(x)\\cos(y)$", plotType: "surface", expression: "{sin(deg(x))*cos(deg(y))}", domain: [-3.14, 3.14] }],
      xLabel: "$x$", yLabel: "$y$", xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
      pgfplotsOptions: "view={60}{30}, colormap/cool",
    };
    return pgfR(id, this.pluginId, doc, "Surface plot of $z = \\sin(x)\\cos(y)$.", "fig:surface-3d");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 38 — Phase diagrams
export class PhaseDiagramsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "phase-diagrams";
  readonly displayName = "Phase Diagrams";
  readonly description = "Phase portraits, nullclines, and stability diagrams for dynamical systems.";
  readonly category = "mathematics" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        { id: "s1", label: "Nullcline $\\dot{x}=0$", plotType: "function2d", expression: "x", domain: [-2, 2], color: "blue" },
        { id: "s2", label: "Nullcline $\\dot{y}=0$", plotType: "function2d", expression: "-x", domain: [-2, 2], color: "red" },
      ],
      xLabel: "$x$", yLabel: "$y$", xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
    return pgfR(id, this.pluginId, doc, "Phase diagram.", "fig:phase-diagram");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

// Plugin 40 — Heat maps
export class HeatMapsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "heat-maps";
  readonly displayName = "Simple Heat Maps";
  readonly description = "Correlation matrices and simple heat maps from tabular data.";
  readonly category = "mathematics" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-extended" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;
  readonly scopeWarning = "Suitable for small matrices (≤ 10×10). Large matrices produce slow LaTeX compilation.";

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "s1", label: "Correlation", plotType: "scatter",
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
    return pgfR(id, this.pluginId, doc, "Correlation heat map.", "fig:heatmap");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export { };
