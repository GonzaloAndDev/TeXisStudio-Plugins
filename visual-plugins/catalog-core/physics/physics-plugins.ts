import type { VisualDiagramPlugin, VisualFigureResult, ValidationResult } from "../../common/contracts/index.js";
import { buildLatexInputBlock } from "../../common/export/latex-block.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";

const engine = new TikzShapeEngine();

function generateFigureId(): string {
  return `fig_${Math.floor(Math.random() * 9000) + 1000}`;
}

async function buildTikzResult(
  figureId: string, pluginId: string, doc: TikzShapeDocument,
  caption: string, label: string,
): Promise<VisualFigureResult> {
  const exported = await engine.export(doc, "latex");
  const texPath = `texisstudio-assets/figures/${figureId}/output.tex`;
  return {
    figureId, pluginId, engineId: "tikz-shape-engine",
    latexBlock: buildLatexInputBlock({ figureId, inputPath: texPath, caption, label }),
    requiredPackages: exported.requiredPackages,
    sourcePath: `texisstudio-assets/figures/${figureId}/source.json`,
    outputPaths: { tex: texPath }, warnings: [],
  };
}

export class VectorsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "vectors-fields";
  readonly displayName = "Vectors & Simple Fields";
  readonly description = "Draw vectors, vector decomposition, and simple field representations.";
  readonly category = "physics" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = generateFigureId();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "axes", type: "axis", coords: [{ x: 0, y: 0 }, { x: 4, y: 3 }] },
        { id: "v",    type: "vector", coords: [{ x: 0, y: 0 }, { x: 2, y: 2 }], label: "\\vec{v}" },
        { id: "vx",   type: "vector", coords: [{ x: 0, y: 0 }, { x: 2, y: 0 }], label: "v_x", lineStyle: "dashed" },
        { id: "vy",   type: "vector", coords: [{ x: 2, y: 0 }, { x: 2, y: 2 }], label: "v_y", lineStyle: "dashed" },
      ],
      viewBox: { width: 6, height: 5, unit: "cm" },
      tikzLibraries: [],
    };
    return buildTikzResult(id, this.pluginId, doc, "Vector decomposition.", "fig:vectors");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class FreeBodyDiagramPlugin implements VisualDiagramPlugin {
  readonly pluginId = "free-body-diagrams";
  readonly displayName = "Free Body Diagrams";
  readonly description = "Build free body diagrams with forces, mass blocks, and labeled arrows.";
  readonly category = "physics" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;

  async create(): Promise<VisualFigureResult> {
    const id = generateFigureId();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "block",  type: "rectangle", coords: [{ x: -0.5, y: -0.5 }, { x: 0.5, y: 0.5 }], fill: "gray!30" },
        { id: "weight", type: "vector",    coords: [{ x: 0, y: -0.5 }, { x: 0, y: -2 }], label: "W" },
        { id: "normal", type: "vector",    coords: [{ x: 0, y: 0.5 }, { x: 0, y: 2 }], label: "N" },
        { id: "fapp",   type: "vector",    coords: [{ x: 0.5, y: 0 }, { x: 2, y: 0 }], label: "F" },
        { id: "frict",  type: "vector",    coords: [{ x: -0.5, y: 0 }, { x: -1.5, y: 0 }], label: "f" },
      ],
      viewBox: { width: 6, height: 6, unit: "cm" },
      tikzLibraries: [],
    };
    return buildTikzResult(id, this.pluginId, doc, "Free body diagram.", "fig:fbd");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class InclinedPlanePlugin implements VisualDiagramPlugin {
  readonly pluginId = "inclined-plane-pulleys";
  readonly displayName = "Inclined Planes, Pulleys & Springs";
  readonly description = "Mechanical systems: inclined planes, pulley setups, and spring-mass systems.";
  readonly category = "physics" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;
  readonly scopeWarning = "Generates accurate schematic diagrams. Highly complex multi-pulley systems may need manual TikZ adjustments.";

  async create(): Promise<VisualFigureResult> {
    const id = generateFigureId();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "plane",  type: "polygon",   coords: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 2.3 }] },
        { id: "block",  type: "rectangle", coords: [{ x: 2.2, y: 1.0 }, { x: 3.0, y: 1.6 }], fill: "blue!30" },
        { id: "angle",  type: "angle",     coords: [{ x: 0, y: 0 }, { x: 0, y: 30 }, { x: 0.8, y: 0 }], label: "\\theta" },
        { id: "weight", type: "vector",    coords: [{ x: 2.6, y: 1.3 }, { x: 2.6, y: -0.2 }], label: "W" },
      ],
      viewBox: { width: 6, height: 4, unit: "cm" },
      tikzLibraries: [],
    };
    return buildTikzResult(id, this.pluginId, doc, "Inclined plane.", "fig:inclined-plane");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}

export class GeometricOpticsPlugin implements VisualDiagramPlugin {
  readonly pluginId = "geometric-optics";
  readonly displayName = "Geometric Optics";
  readonly description = "Lenses, mirrors, ray diagrams, and refraction diagrams.";
  readonly category = "physics" as const;
  readonly engineId = "tikz-shape-engine";
  readonly qualityLevel = "official-core" as const;
  readonly requiredPackages = ["tikz"] as const;
  readonly scopeWarning = "Suitable for standard ray diagrams. Complex optical systems with multiple elements may need manual adjustment.";

  async create(): Promise<VisualFigureResult> {
    const id = generateFigureId();
    const doc: TikzShapeDocument = {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "axis",   type: "line",  coords: [{ x: -3, y: 0 }, { x: 3, y: 0 }], lineStyle: "dashed" },
        { id: "lens",   type: "line",  coords: [{ x: 0, y: -1.5 }, { x: 0, y: 1.5 }], lineWidth: "1.5pt" },
        { id: "ray1",   type: "arrow", coords: [{ x: -3, y: 1 }, { x: 0, y: 1 }] },
        { id: "ray1b",  type: "arrow", coords: [{ x: 0, y: 1 }, { x: 2, y: 0 }] },
        { id: "focus",  type: "point", coords: [{ x: 2, y: 0 }], label: "$F'$" },
      ],
      viewBox: { width: 8, height: 4, unit: "cm" },
      tikzLibraries: [],
    };
    return buildTikzResult(id, this.pluginId, doc, "Converging lens ray diagram.", "fig:optics");
  }

  async edit(_p: string): Promise<VisualFigureResult> { return this.create(); }
  async validate(_r: VisualFigureResult): Promise<ValidationResult> { return { valid: true, issues: [] }; }
  exportLatexBlock(r: VisualFigureResult): string { return r.latexBlock; }
}
