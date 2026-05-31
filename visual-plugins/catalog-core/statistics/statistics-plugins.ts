import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine = new PGFPlotsEngine();

function fid(): string { return `fig_${Math.floor(Math.random() * 9000) + 1000}`; }
function fidFromPath(p: string): string { return p.match(/fig_\d+/)?.[0] ?? fid(); }

async function buildPGFResult(
  figureId: string, pluginId: string, doc: PGFPlotsDocument,
  caption: string, label: string,
): Promise<VisualFigureResult> {
  const exp = await engine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${figureId}/output.tex`;
  return {
    figureId, pluginId, engineId: "pgfplots-engine",
    latexBlock: buildLatexInputBlock({ figureId, inputPath: texPath, caption, label }),
    requiredPackages: exp.requiredPackages,
    sourcePath: `texisstudio-assets/figures/${figureId}/source.json`,
    outputPaths: { tex: texPath }, warnings: [],
  };
}

export class FunctionPlots2DPlugin implements VisualDiagramPlugin {
  readonly pluginId = "function-plots-2d";
  readonly displayName = "2D Function Plots";
  readonly description = "Plot mathematical functions with labeled axes, grid, and legend. PGFPlots native.";
  readonly category = "mathematics" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "s1", label: "$f(x) = x^2$", plotType: "function2d", expression: "x^2", domain: [-2, 2], color: "blue" }],
      xLabel: "$x$", yLabel: "$f(x)$", xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
    return buildPGFResult(id, this.pluginId, doc, "Plot of $f(x) = x^2$.", "fig:plot-2d");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class ParametricPolarPlugin implements VisualDiagramPlugin {
  readonly pluginId = "parametric-polar-plots";
  readonly displayName = "Parametric & Polar Plots";
  readonly description = "Parametric curves and polar function plots.";
  readonly category = "mathematics" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{ id: "s1", label: "Circle", plotType: "parametric", expression: "({cos(deg(x))},{sin(deg(x))})", domain: [0, 6.28] }],
      xLabel: "$x$", yLabel: "$y$", xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
    };
    return buildPGFResult(id, this.pluginId, doc, "Parametric circle.", "fig:parametric");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class BasicStatisticsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "basic-statistics";
  readonly displayName = "Basic Statistics Charts";
  readonly description = "Bar charts, histograms, and scatter plots from tabular data.";
  readonly category = "mathematics" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "s1", label: "Frequency", plotType: "bar",
        data: [{ x: 1, y: 5 }, { x: 2, y: 8 }, { x: 3, y: 12 }, { x: 4, y: 7 }, { x: 5, y: 3 }],
        color: "blue!60",
      }],
      xLabel: "Category", yLabel: "Frequency",
      xScale: "linear", yScale: "linear",
      showLegend: false, grid: "major",
    };
    return buildPGFResult(id, this.pluginId, doc, "Frequency distribution.", "fig:stats-bar");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class StatisticalDistributionsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "statistical-distributions";
  readonly displayName = "Statistical Distributions";
  readonly description = "Normal, t, chi-squared, and other distributions with shaded regions.";
  readonly category = "mathematics" as const;
  readonly engineId = "pgfplots-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["pgfplots", "tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = fid();
    const doc: PGFPlotsDocument = {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "normal", label: "$\\mathcal{N}(0,1)$", plotType: "function2d",
        expression: "exp(-x^2/2)/sqrt(2*pi)", domain: [-4, 4], color: "blue",
      }],
      xLabel: "$z$", yLabel: "$f(z)$", xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
    };
    return buildPGFResult(id, this.pluginId, doc, "Standard normal distribution.", "fig:normal-dist");
  }

  async edit(p: string): Promise<VisualFigureResult> { return this.create().then(r => ({ ...r, figureId: fidFromPath(p) })); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}
