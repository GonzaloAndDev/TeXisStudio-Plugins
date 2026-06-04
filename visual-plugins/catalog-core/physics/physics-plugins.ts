import { BasePlugin } from "../../common/plugin-base/base-plugin.js";
import type { FigureStore } from "../../common/persistence/figure-store.js";
import { TikzShapeEngine } from "../../engines/tikz-shape-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { TikzShapeDocument } from "../../engines/tikz-shape-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const engine     = new TikzShapeEngine();
const pgfEngine  = new PGFPlotsEngine();

export class VectorsPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "vectors-fields",
      displayName: pluginText("vectors-fields", "displayName", "Vectors & Simple Fields"),
      description: pluginText("vectors-fields", "description", "Draw vectors, vector decomposition, and simple field representations."),
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: pluginText("vectors-fields", "defaultCaption", "Vector addition — parallelogram law: $\\vec{R} = \\vec{A} + \\vec{B}$."),
      defaultLabel: "fig:vectors",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    // Parallelogram law of vector addition — A + B = R
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        { id: "axes",  type: "axis",    coords: [{ x: 0, y: 0 }, { x: 5, y: 3.5 }] },
        // Vector A (horizontal-ish)
        { id: "vA",    type: "vector",  coords: [{ x: 0, y: 0 }, { x: 3, y: 1 }], label: "\\vec{A}", color: "blue" },
        // Vector B (vertical-ish)
        { id: "vB",    type: "vector",  coords: [{ x: 0, y: 0 }, { x: 1, y: 2.5 }], label: "\\vec{B}", color: "red" },
        // Resultant R = A + B
        { id: "vR",    type: "vector",  coords: [{ x: 0, y: 0 }, { x: 4, y: 3.5 }], label: "\\vec{R}", color: "black", lineWidth: "1.5pt" },
        // Parallelogram dashed sides
        { id: "dA",    type: "line",    coords: [{ x: 1, y: 2.5 }, { x: 4, y: 3.5 }], lineStyle: "dashed", color: "blue" },
        { id: "dB",    type: "line",    coords: [{ x: 3, y: 1 }, { x: 4, y: 3.5 }], lineStyle: "dashed", color: "red" },
        // Angle between A and B
        { id: "ang",   type: "angle",   coords: [{ x: 0, y: 0 }, { x: 18.43, y: 68.2 }, { x: 0.8, y: 0 }], label: "\\theta" },
        // Component dashes for A
        { id: "axc",   type: "line",    coords: [{ x: 3, y: 0 }, { x: 3, y: 1 }], lineStyle: "dotted" },
        { id: "ayc",   type: "line",    coords: [{ x: 0, y: 1 }, { x: 3, y: 1 }], lineStyle: "dotted" },
      ],
      viewBox: { width: 7, height: 5.5, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class FreeBodyDiagramPlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "free-body-diagrams",
      displayName: pluginText("free-body-diagrams", "displayName", "Free Body Diagrams"),
      description: pluginText("free-body-diagrams", "description", "Build free body diagrams with forces, mass blocks, and labeled arrows."),
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"], blockKind: "input",
      defaultCaption: pluginText("free-body-diagrams", "defaultCaption", "Free body diagram — block on surface with applied force at angle $\\alpha$."),
      defaultLabel: "fig:fbd",
    }, store);
  }

  protected buildDefaultDocument(): TikzShapeDocument {
    // More realistic FBD: block on surface + applied force at angle + friction + normal + weight
    return {
      engineId: "tikz-shape-engine", version: "1.0.0",
      shapes: [
        // Surface
        { id: "surf",   type: "line",      coords: [{ x: -2.5, y: -0.6 }, { x: 2.5, y: -0.6 }], lineWidth: "1.5pt" },
        // Block
        { id: "block",  type: "rectangle", coords: [{ x: -0.7, y: -0.6 }, { x: 0.7, y: 0.8 }], fill: "cyan!25" },
        { id: "lm",     type: "label",     coords: [{ x: 0, y: 0.1 }], label: "$m$" },
        // Weight (down)
        { id: "W",      type: "vector",    coords: [{ x: 0, y: -0.6 }, { x: 0, y: -2.2 }], label: "W=mg", color: "red" },
        // Normal (up)
        { id: "N",      type: "vector",    coords: [{ x: 0, y: 0.8 }, { x: 0, y: 2.4 }], label: "N", color: "blue" },
        // Applied force at angle 30° above horizontal (F_x + F_y components shown)
        { id: "F",      type: "vector",    coords: [{ x: 0.7, y: 0.1 }, { x: 2.6, y: 1.2 }], label: "\\vec{F}", color: "black", lineWidth: "1.5pt" },
        { id: "Fx",     type: "vector",    coords: [{ x: 0.7, y: 0.1 }, { x: 2.6, y: 0.1 }], label: "F\\cos\\alpha", color: "gray", lineStyle: "dashed" },
        { id: "Fy",     type: "vector",    coords: [{ x: 2.6, y: 0.1 }, { x: 2.6, y: 1.2 }], label: "F\\sin\\alpha", color: "gray", lineStyle: "dashed" },
        // Friction (opposing motion)
        { id: "f",      type: "vector",    coords: [{ x: -0.7, y: 0.1 }, { x: -2.2, y: 0.1 }], label: "f", color: "orange" },
        // Angle alpha
        { id: "ang",    type: "angle",     coords: [{ x: 0.7, y: 0.1 }, { x: 0, y: 30 }, { x: 0.6, y: 0 }], label: "\\alpha" },
      ],
      viewBox: { width: 8, height: 5.5, unit: "cm" }, tikzLibraries: [],
    };
  }
}

export class InclinedPlanePlugin extends BasePlugin<TikzShapeDocument> {
  constructor(store?: FigureStore) {
    super(engine, {
      pluginId: "inclined-plane-pulleys",
      displayName: pluginText("inclined-plane-pulleys", "displayName", "Inclined Planes, Pulleys & Springs"),
      description: pluginText("inclined-plane-pulleys", "description", "Mechanical systems: inclined planes, pulley setups, and spring-mass systems."),
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"],
      scopeWarning: pluginText("inclined-plane-pulleys", "scopeWarning", "Generates accurate schematic diagrams. Highly complex multi-pulley systems may need manual TikZ adjustments."),
      blockKind: "input",
      defaultCaption: pluginText("inclined-plane-pulleys", "defaultCaption", "Free-body diagram on inclined plane (angle $\\theta$)."),
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
      displayName:     pluginText("wave-oscillation", "displayName", "Wave & Oscillation Diagrams"),
      description:     pluginText("wave-oscillation", "description", "Sinusoidal waves, damped oscillations, and wave superposition. Covers SHM, transverse/longitudinal waves, and interference patterns."),
      category:        "physics",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["pgfplots", "tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("wave-oscillation", "defaultCaption", "Sinusoidal wave $y = A\\sin(\\omega t)$ with damped envelope."),
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
      displayName: pluginText("geometric-optics", "displayName", "Geometric Optics"),
      description: pluginText("geometric-optics", "description", "Lenses, mirrors, ray diagrams, and refraction diagrams."),
      category: "physics", engineId: "tikz-shape-engine", qualityLevel: "official-core",
      requiredPackages: ["tikz"],
      scopeWarning: pluginText("geometric-optics", "scopeWarning", "Suitable for standard ray diagrams. Complex optical systems with multiple elements may need manual adjustment."),
      blockKind: "input",
      defaultCaption: pluginText("geometric-optics", "defaultCaption", "Converging thin lens — three principal ray construction."),
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
