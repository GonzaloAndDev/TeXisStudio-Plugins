import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const tikzEng = new TikzShapeEngine();
const pgfEng  = new PGFPlotsEngine();

export class VennDiagramPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(tikzEng, {
      pluginId: "venn-set-diagrams",
      displayName: "Venn / Set Diagrams",
      description: "Create Venn diagrams and set-theory diagrams with labeled circles and intersections.",
      category: "mathematics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: "Three-set Venn diagram showing mixed-methods research design.",
      defaultLabel: "fig:venn",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    // Three-set Venn — qualitative ∩ quantitative ∩ theory = mixed methods
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        // Three overlapping circles
        { id: "cA", type: "circle", coords: [{ x: 0,    y: 0.8  }, { x: 1.5, y: 0 }], fill: "blue!20",  options: "fill opacity=0.5, draw=blue!60" },
        { id: "cB", type: "circle", coords: [{ x: -1.2, y: -0.8 }, { x: 1.5, y: 0 }], fill: "red!20",   options: "fill opacity=0.5, draw=red!60" },
        { id: "cC", type: "circle", coords: [{ x:  1.2, y: -0.8 }, { x: 1.5, y: 0 }], fill: "green!20", options: "fill opacity=0.5, draw=green!60" },
        // Set labels
        { id: "lA", type: "label", coords: [{ x:  0,    y: 2.6 }], label: "Qualitative" },
        { id: "lB", type: "label", coords: [{ x: -2.5,  y:-1.8 }], label: "Quantitative" },
        { id: "lC", type: "label", coords: [{ x:  2.5,  y:-1.8 }], label: "Theory" },
        // Intersection labels
        { id: "lAB", type: "label", coords: [{ x: -0.9, y: 0.2 }], label: "\\small Triangulation" },
        { id: "lAC", type: "label", coords: [{ x:  0.9, y: 0.2 }], label: "\\small Grounded\\,Theory" },
        { id: "lBC", type: "label", coords: [{ x:  0,  y:-1.4 }], label: "\\small Modelling" },
        { id: "lABC",type: "label", coords: [{ x:  0,  y:-0.2 }], label: "\\small\\textbf{Mixed}" },
      ],
      viewBox: { width: 9, height: 7, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class PlaneGeometryPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(tikzEng, {
      pluginId: "plane-geometry",
      displayName: "Plane Geometry",
      description: "Geometric shapes: triangles, polygons, circles, angles, perpendiculars, parallels.",
      category: "mathematics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: "Right triangle with altitude from hypotenuse — geometric mean relations.",
      defaultLabel: "fig:triangle",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    // Right triangle ABC with altitude CH, showing a²=cx, b²=cy and c²=a²+b²
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        // Main right triangle
        { id: "tri",   type: "polygon",   coords: [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 1.8, y: 2.4 }] },
        // Right angle mark at C
        { id: "ra",    type: "polygon",   coords: [{ x: 1.8, y: 0.3 }, { x: 2.1, y: 0.3 }, { x: 2.1, y: 0 }] },
        // Altitude from C to hypotenuse AB
        { id: "alt",   type: "line",      coords: [{ x: 1.8, y: 2.4 }, { x: 1.8, y: 0 }], lineStyle: "dashed" },
        // Angles
        { id: "angA",  type: "angle",     coords: [{ x: 0, y: 0 }, { x: 0, y: 53 }, { x: 0.5, y: 0 }], label: "\\alpha" },
        { id: "angB",  type: "angle",     coords: [{ x: 5, y: 0 }, { x: 143, y: 180 }, { x: 0.5, y: 0 }], label: "\\beta" },
        // Labels
        { id: "lA",    type: "label",     coords: [{ x: -0.3, y: -0.3 }], label: "$A$" },
        { id: "lB",    type: "label",     coords: [{ x:  5.3, y: -0.3 }], label: "$B$" },
        { id: "lC",    type: "label",     coords: [{ x:  1.8, y:  2.7 }], label: "$C$" },
        { id: "lH",    type: "label",     coords: [{ x:  1.8, y: -0.3 }], label: "$H$" },
        // Side labels
        { id: "la",    type: "label",     coords: [{ x:  3.5, y:  1.4 }], label: "$a$" },
        { id: "lb",    type: "label",     coords: [{ x:  0.6, y:  1.4 }], label: "$b$" },
        { id: "lc",    type: "label",     coords: [{ x:  2.5, y: -0.3 }], label: "$c$" },
        { id: "lx",    type: "label",     coords: [{ x:  0.9, y: -0.3 }], label: "$x$" },
        { id: "ly",    type: "label",     coords: [{ x:  3.4, y: -0.3 }], label: "$y$" },
      ],
      viewBox: { width: 8, height: 5, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class AnalyticGeometryPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor(store?: FigureStore) {
    super(pgfEng, {
      pluginId: "analytic-geometry",
      displayName: "Analytic Geometry",
      description: "Coordinate systems with curves, lines, tangents, and labeled points.",
      category: "mathematics", engineId: "pgfplots-engine", qualityLevel: "official-core",
      requiredPackages: ["pgfplots", "tikz"], blockKind: "input",
      defaultCaption: "Parabola $f(x)=x^2-2x-3$ with roots, vertex, and tangent at $x=2$.",
      defaultLabel: "fig:analytic",
    }, store);
  }

  // Switching to PGFPlots engine for richer analytic geometry output
  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "parabola", label: "$f(x)=x^2-2x-3$",
          plotType: "function2d",
          expression: "x^2-2*x-3",
          domain: [-1.5, 3.5], color: "blue",
        },
        {
          id: "tangent", label: "Tangent at $x=2$",
          plotType: "function2d",
          // Tangent: f'(x)=2x-2, at x=2: f'(2)=2, f(2)=-3, so y=2(x-2)-3=2x-7
          expression: "2*x-7",
          domain: [0.5, 3.5], color: "red",
        },
        {
          id: "roots", label: "Roots $x=-1,\\,3$",
          plotType: "scatter",
          data: [{ x: -1, y: 0 }, { x: 3, y: 0 }, { x: 1, y: -4 }],
          color: "black", mark: "*",
        },
      ],
      xLabel: "$x$", yLabel: "$f(x)$",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "ymin=-5, ymax=4, xmin=-2, xmax=4, axis lines=center",
    };
  }
}
