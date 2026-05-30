import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";

const engine = new TikzShapeEngine();

function generateFigureId(): string {
  return `fig_${Math.floor(Math.random() * 9000) + 1000}`;
}
function figureIdFromPath(p: string): string {
  return p.match(/fig_\d+/)?.[0] ?? generateFigureId();
}

async function buildTikzResult(
  figureId: string, pluginId: string, doc: TikzShapeDocument,
  caption = "Diagram", label = "fig:diagram",
): Promise<VisualFigureResult> {
  const exported = await engine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${figureId}/output.tex`;
  const latexBlock = buildLatexInputBlock({ figureId, inputPath: texPath, caption, label });
  return {
    figureId, pluginId, engineId: "tikz-shape-engine",
    latexBlock, requiredPackages: exported.requiredPackages,
    sourcePath: `texisstudio-assets/figures/${figureId}/source.json`,
    outputPaths: { tex: texPath }, warnings: [],
  };
}

export class VennDiagramPlugin implements VisualDiagramPlugin {
  readonly pluginId = "venn-set-diagrams";
  readonly displayName = "Venn / Set Diagrams";
  readonly description = "Create Venn diagrams and set-theory diagrams with labeled circles and intersections.";
  readonly category = "mathematics" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "a", type: "circle", coords: [{ x: -0.8, y: 0 }, { x: 1.2, y: 0 }], label: "$A$", fill: "blue!20" },
        { id: "b", type: "circle", coords: [{ x: 0.8, y: 0 }, { x: 1.2, y: 0 }], label: "$B$", fill: "red!20" },
        { id: "la", type: "label", coords: [{ x: -1.6, y: 0 }], label: "$A$" },
        { id: "lb", type: "label", coords: [{ x: 1.6, y: 0 }], label: "$B$" },
      ],
      viewBox: { width: 6, height: 4, unit: "cm" },
      tikzLibraries: [],
    };
    return buildTikzResult(figureId, this.pluginId, doc, "Venn diagram.", "fig:venn");
  }

  async edit(p: string): Promise<VisualFigureResult> {
    return this.create().then(r => ({ ...r, figureId: figureIdFromPath(p) }));
  }

  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class PlaneGeometryPlugin implements VisualDiagramPlugin {
  readonly pluginId = "plane-geometry";
  readonly displayName = "Plane Geometry";
  readonly description = "Geometric shapes: triangles, polygons, circles, angles, perpendiculars, parallels.";
  readonly category = "mathematics" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "tri", type: "polygon", coords: [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 1.5, y: 2.6 }] },
        { id: "la", type: "label", coords: [{ x: 0, y: -0.3 }], label: "$A$" },
        { id: "lb", type: "label", coords: [{ x: 3, y: -0.3 }], label: "$B$" },
        { id: "lc", type: "label", coords: [{ x: 1.5, y: 2.9 }], label: "$C$" },
      ],
      viewBox: { width: 6, height: 5, unit: "cm" },
      tikzLibraries: [],
    };
    return buildTikzResult(figureId, this.pluginId, doc, "Triangle $ABC$.", "fig:triangle");
  }

  async edit(p: string): Promise<VisualFigureResult> {
    return this.create().then(r => ({ ...r, figureId: figureIdFromPath(p) }));
  }

  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class AnalyticGeometryPlugin implements VisualDiagramPlugin {
  readonly pluginId = "analytic-geometry";
  readonly displayName = "Analytic Geometry";
  readonly description = "Coordinate systems with points, segments, and labeled axes.";
  readonly category = "mathematics" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz", "pgfplots"] as const;

  async create(): Promise<VisualFigureResult> {
    const figureId = generateFigureId();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "axes", type: "axis", coords: [{ x: 0, y: 0 }, { x: 4, y: 3 }] },
        { id: "pt", type: "point", coords: [{ x: 2, y: 1.5 }], label: "$P(2, 1.5)$" },
      ],
      viewBox: { width: 6, height: 5, unit: "cm" },
      tikzLibraries: [],
    };
    return buildTikzResult(figureId, this.pluginId, doc, "Cartesian plane.", "fig:cartesian");
  }

  async edit(p: string): Promise<VisualFigureResult> {
    return this.create().then(r => ({ ...r, figureId: figureIdFromPath(p) }));
  }

  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}
