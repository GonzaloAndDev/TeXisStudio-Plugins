import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";

const engine = new TikzShapeEngine();

export class VectorsPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "vectors-fields",
      displayName: "Vectors & Simple Fields",
      description: "Draw vectors, vector decomposition, and simple field representations.",
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: "Vector decomposition.", defaultLabel: "fig:vectors",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "axes", type: "axis", coords: [{ x: 0, y: 0 }, { x: 4, y: 3 }] },
        { id: "v",  type: "vector", coords: [{ x: 0, y: 0 }, { x: 2, y: 2 }], label: "\\vec{v}" },
        { id: "vx", type: "vector", coords: [{ x: 0, y: 0 }, { x: 2, y: 0 }], label: "v_x", lineStyle: "dashed" },
        { id: "vy", type: "vector", coords: [{ x: 2, y: 0 }, { x: 2, y: 2 }], label: "v_y", lineStyle: "dashed" },
      ],
      viewBox: { width: 6, height: 5, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class FreeBodyDiagramPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "free-body-diagrams",
      displayName: "Free Body Diagrams",
      description: "Build free body diagrams with forces, mass blocks, and labeled arrows.",
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: "Free body diagram.", defaultLabel: "fig:fbd",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "block",  type: "rectangle", coords: [{ x: -0.5, y: -0.5 }, { x: 0.5, y: 0.5 }], fill: "gray!30" },
        { id: "weight", type: "vector", coords: [{ x: 0, y: -0.5 }, { x: 0, y: -2 }], label: "W" },
        { id: "normal", type: "vector", coords: [{ x: 0, y: 0.5 }, { x: 0, y: 2 }], label: "N" },
        { id: "fapp",   type: "vector", coords: [{ x: 0.5, y: 0 }, { x: 2, y: 0 }], label: "F" },
        { id: "frict",  type: "vector", coords: [{ x: -0.5, y: 0 }, { x: -1.5, y: 0 }], label: "f" },
      ],
      viewBox: { width: 6, height: 6, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class InclinedPlanePlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "inclined-plane-pulleys",
      displayName: "Inclined Planes, Pulleys & Springs",
      description: "Mechanical systems: inclined planes, pulley setups, and spring-mass systems.",
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"],
      scopeWarning: "Generates accurate schematic diagrams. Highly complex multi-pulley systems may need manual TikZ adjustments.",
      blockKind: "input",
      defaultCaption: "Inclined plane.", defaultLabel: "fig:inclined-plane",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "plane",  type: "polygon", coords: [{ x: 0, y: 0 }, { x: 4, y: 0 }, { x: 4, y: 2.3 }] },
        { id: "block",  type: "rectangle", coords: [{ x: 2.2, y: 1.0 }, { x: 3.0, y: 1.6 }], fill: "blue!30" },
        { id: "angle",  type: "angle", coords: [{ x: 0, y: 0 }, { x: 0, y: 30 }, { x: 0.8, y: 0 }], label: "\\theta" },
        { id: "weight", type: "vector", coords: [{ x: 2.6, y: 1.3 }, { x: 2.6, y: -0.2 }], label: "W" },
      ],
      viewBox: { width: 6, height: 4, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class GeometricOpticsPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "geometric-optics",
      displayName: "Geometric Optics",
      description: "Lenses, mirrors, ray diagrams, and refraction diagrams.",
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"],
      scopeWarning: "Suitable for standard ray diagrams. Complex optical systems with multiple elements may need manual adjustment.",
      blockKind: "input",
      defaultCaption: "Converging lens ray diagram.", defaultLabel: "fig:optics",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "axis",  type: "line",  coords: [{ x: -3, y: 0 }, { x: 3, y: 0 }], lineStyle: "dashed" },
        { id: "lens",  type: "line",  coords: [{ x: 0, y: -1.5 }, { x: 0, y: 1.5 }], lineWidth: "1.5pt" },
        { id: "ray1",  type: "arrow", coords: [{ x: -3, y: 1 }, { x: 0, y: 1 }] },
        { id: "ray1b", type: "arrow", coords: [{ x: 0, y: 1 }, { x: 2, y: 0 }] },
        { id: "focus", type: "point", coords: [{ x: 2, y: 0 }], label: "$F'$" },
      ],
      viewBox: { width: 8, height: 4, unit: "cm" }, tikzLibraries: [],
    };
  }
}
