import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";

const engine = new TikzShapeEngine();

export class VennDiagramPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "venn-set-diagrams",
      displayName: "Venn / Set Diagrams",
      description: "Create Venn diagrams and set-theory diagrams with labeled circles and intersections.",
      category: "mathematics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: "Venn diagram.", defaultLabel: "fig:venn",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "a", type: "circle", coords: [{ x: -0.8, y: 0 }, { x: 1.2, y: 0 }], fill: "blue!20" },
        { id: "b", type: "circle", coords: [{ x: 0.8, y: 0 }, { x: 1.2, y: 0 }], fill: "red!20" },
        { id: "la", type: "label", coords: [{ x: -1.6, y: 0 }], label: "$A$" },
        { id: "lb", type: "label", coords: [{ x: 1.6, y: 0 }], label: "$B$" },
      ],
      viewBox: { width: 6, height: 4, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class PlaneGeometryPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "plane-geometry",
      displayName: "Plane Geometry",
      description: "Geometric shapes: triangles, polygons, circles, angles, perpendiculars, parallels.",
      category: "mathematics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: "Triangle $ABC$.", defaultLabel: "fig:triangle",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "tri", type: "polygon", coords: [{ x: 0, y: 0 }, { x: 3, y: 0 }, { x: 1.5, y: 2.6 }] },
        { id: "la", type: "label", coords: [{ x: 0, y: -0.3 }], label: "$A$" },
        { id: "lb", type: "label", coords: [{ x: 3, y: -0.3 }], label: "$B$" },
        { id: "lc", type: "label", coords: [{ x: 1.5, y: 2.9 }], label: "$C$" },
      ],
      viewBox: { width: 6, height: 5, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class AnalyticGeometryPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "analytic-geometry",
      displayName: "Analytic Geometry",
      description: "Coordinate systems with points, segments, and labeled axes.",
      category: "mathematics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: "Cartesian plane.", defaultLabel: "fig:cartesian",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "axes", type: "axis", coords: [{ x: 0, y: 0 }, { x: 4, y: 3 }] },
        { id: "pt", type: "point", coords: [{ x: 2, y: 1.5 }], label: "$P(2, 1.5)$" },
      ],
      viewBox: { width: 6, height: 5, unit: "cm" }, tikzLibraries: [],
    };
  }
}
