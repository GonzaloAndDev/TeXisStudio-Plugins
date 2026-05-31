import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const engine     = new TikzShapeEngine();
const pgfEngine  = new PGFPlotsEngine();

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
      defaultCaption: "Free-body diagram on inclined plane (angle $\\theta$).",
      defaultLabel: "fig:inclined-plane",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        // Inclined surface
        { id: "plane",   type: "polygon",   coords: [{ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 5, y: 2.5 }], fill: "gray!20" },
        // Ground hatching lines (decorative)
        { id: "g1", type: "line", coords: [{ x: 0, y: 0 }, { x: 5, y: 0 }], lineWidth: "1.5pt" },
        // Block on slope
        { id: "block",   type: "rectangle", coords: [{ x: 2.5, y: 1.05 }, { x: 3.4, y: 1.8 }], fill: "blue!35" },
        // Angle arc and label
        { id: "angle",   type: "angle",     coords: [{ x: 0, y: 0 }, { x: 0, y: 26.57 }, { x: 0.9, y: 0 }], label: "\\theta" },
        // Weight vector W (straight down)
        { id: "weight",  type: "vector",    coords: [{ x: 2.95, y: 1.43 }, { x: 2.95, y: 0.2 }], label: "W", color: "red" },
        // Normal force N (perpendicular to surface)
        { id: "normal",  type: "vector",    coords: [{ x: 2.95, y: 1.43 }, { x: 2.48, y: 2.35 }], label: "N", color: "blue" },
        // Friction force f (along surface, opposing motion)
        { id: "friction",type: "vector",    coords: [{ x: 2.5, y: 1.05 }, { x: 1.7,  y: 0.65 }], label: "f", color: "green!60!black" },
        // Component W_x (along incline)
        { id: "wx", type: "vector", coords: [{ x: 2.95, y: 1.43 }, { x: 3.75, y: 1.83 }], label: "W_x", lineStyle: "dashed", color: "red" },
        // Component W_y (perpendicular to incline)
        { id: "wy", type: "vector", coords: [{ x: 2.95, y: 1.43 }, { x: 2.48, y: 0.5 }], label: "W_y", lineStyle: "dashed", color: "red" },
      ],
      viewBox: { width: 7, height: 4.5, unit: "cm" },
      tikzLibraries: [],
    };
  }
}

// ── Plugin 17 — Wave & Oscillation Diagrams ──────────────────────
// Ondas sinusoidales, oscilación amortiguada y superposición de ondas.
// Fundamental en física general, óptica ondulatoria, acústica y electromagnetismo.

export class WaveOscillationPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor(store?: FigureStore) {
    super(pgfEngine, {
      pluginId:        "wave-oscillation",
      displayName:     "Wave & Oscillation Diagrams",
      description:     "Sinusoidal waves, damped oscillations, and wave superposition. Covers SHM, transverse/longitudinal waves, and interference patterns.",
      category:        "physics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  "Sinusoidal wave $y = A\\sin(\\omega t)$ with damped envelope.",
      defaultLabel:    "fig:wave",
    }, store);
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "wave",
          label: "$y = e^{-0.3t}\\sin(2\\pi t)$",
          plotType: "function2d",
          expression: "exp(-0.3*x)*sin(2*pi*x)",
          domain: [0, 5],
          color: "blue",
        },
        {
          id: "envelope_pos",
          label: "Envelope $e^{-0.3t}$",
          plotType: "function2d",
          expression: "exp(-0.3*x)",
          domain: [0, 5],
          color: "red",
        },
        {
          id: "envelope_neg",
          label: "",
          plotType: "function2d",
          expression: "-exp(-0.3*x)",
          domain: [0, 5],
          color: "red",
        },
      ],
      xLabel: "Time $t$ (s)",
      yLabel: "Displacement $y$ (m)",
      xScale: "linear",
      yScale: "linear",
      showLegend: true,
      grid: "major",
      pgfplotsOptions: "ymin=-1.2, ymax=1.2",
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
      defaultCaption: "Converging thin lens — three principal ray construction.",
      defaultLabel: "fig:optics",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    // Standard thin lens diagram:
    //   f = 2 (focal length)
    //   Object at x = -3 (height = 1.2)
    //   Image at x = +6 (height = -2.4) by 1/v - 1/u = 1/f, u=-3, f=2 → v=6
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        // Principal axis
        { id: "axis",   type: "line",    coords: [{ x: -4, y: 0 }, { x: 7, y: 0 }], lineStyle: "dashed" },
        // Lens (biconvex representation as vertical line with arrows)
        { id: "lens",   type: "line",    coords: [{ x: 0, y: -2 }, { x: 0, y: 2 }], lineWidth: "1.5pt" },
        { id: "ltop",   type: "arrow",   coords: [{ x: 0, y: 1.8 }, { x: 0, y: 2 }] },
        { id: "lbot",   type: "arrow",   coords: [{ x: 0, y: -1.8 }, { x: 0, y: -2 }] },
        // Object (upright arrow)
        { id: "obj",    type: "vector",  coords: [{ x: -3, y: 0 }, { x: -3, y: 1.2 }], color: "black" },
        { id: "olbl",   type: "label",   coords: [{ x: -3.3, y: 0.6 }], label: "$O$", options: "right" },
        // Image (inverted arrow)
        { id: "img",    type: "vector",  coords: [{ x: 6, y: 0 }, { x: 6, y: -2.4 }], color: "gray" },
        { id: "ilbl",   type: "label",   coords: [{ x: 6.2, y: -1.2 }], label: "$I$", options: "left" },
        // Focal points
        { id: "f1",     type: "point",   coords: [{ x: -2, y: 0 }], label: "$F$" },
        { id: "f2",     type: "point",   coords: [{ x: 2,  y: 0 }], label: "$F'$" },
        // Ray 1: parallel to axis → through F' after lens
        { id: "r1a",  type: "arrow", coords: [{ x: -3, y: 1.2 }, { x: 0,  y: 1.2 }], color: "blue" },
        { id: "r1b",  type: "arrow", coords: [{ x: 0,  y: 1.2 }, { x: 6, y: -2.4 }], color: "blue" },
        // Ray 2: through optical centre, undeviated
        { id: "r2",   type: "arrow", coords: [{ x: -3, y: 1.2 }, { x: 6, y: -2.4 }], color: "red" },
        // Ray 3: through F → parallel after lens
        { id: "r3a",  type: "arrow", coords: [{ x: -3, y: 1.2 }, { x: 0, y: 0.4 }], color: "green!60!black" },
        { id: "r3b",  type: "arrow", coords: [{ x: 0,  y: 0.4 }, { x: 6, y: 0.4 }], color: "green!60!black", lineStyle: "dashed" },
        { id: "r3c",  type: "arrow", coords: [{ x: 6,  y: 0.4 }, { x: 6, y: -2.4 }], color: "green!60!black" },
      ],
      viewBox: { width: 13, height: 5.5, unit: "cm" },
      tikzLibraries: [],
    };
  }
}
