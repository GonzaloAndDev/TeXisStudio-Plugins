import { BasePlugin } from "../../common/plugin-base/index.js";
import { CircuiTikZEngine } from "../../engines/circuitikz-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { CircuiTikZDocument } from "../../engines/circuitikz-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";

// ── Shared engine instances ────────────────────────────────────────
const circEngine  = new CircuiTikZEngine();
const graphEngine = new GraphNodeEngine();

// ── Plugin 18 — Basic Electrical Circuits ─────────────────────────

export class BasicCircuitsPlugin extends BasePlugin<CircuiTikZDocument> {
  constructor() {
    super(circEngine, {
      pluginId:        "basic-electrical-circuits",
      displayName:     "Basic Electrical Circuits",
      description:     "Visual circuit builder: resistors, capacitors, inductors, sources, switches, diodes. CircuiTikZ native.",
      category:        "engineering-cs",
      engineId:        "circuitikz-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["circuitikz"],
      blockKind:       "input",
      defaultCaption:  "Basic resistive circuit.",
      defaultLabel:    "fig:circuit-basic",
    });
  }

  protected buildDefaultDocument(): CircuiTikZDocument {
    return {
      engineId: "circuitikz-engine", version: "1.0.0",
      nodes: [
        { id: "A", x: 0, y: 2 }, { id: "B", x: 3, y: 2 },
        { id: "C", x: 3, y: 0 }, { id: "D", x: 0, y: 0 },
      ],
      components: [
        { id: "R1", type: "resistor",       from: "A", to: "B", direction: "right", label: "$R_1$", value: "10\\,\\Omega" },
        { id: "V1", type: "voltage-source", from: "D", to: "A", direction: "up",    label: "$V_s$", value: "12\\,V" },
        { id: "W1", type: "ground",         from: "D", to: "D", direction: "down" },
      ],
      connections: [{ from: "B", to: "C" }, { from: "C", to: "D" }],
      americanStyle: true,
    };
  }
}

// ── Plugin 19 — Block Diagrams / Control Systems ───────────────────

export class BlockDiagramPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "block-diagrams-control",
      displayName:     "Block Diagrams / Control Systems",
      description:     "Control system block diagrams with transfer functions, summing junctions, and feedback loops.",
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  "Closed-loop control system.",
      defaultLabel:    "fig:block-control",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "R",   label: "$R(s)$",    shape: "none",      position: { x: 0, y: 0 } },
        { id: "sum", label: "$\\Sigma$",  shape: "circle",    position: { x: 2, y: 0 } },
        { id: "G",   label: "$G(s)$",    shape: "rectangle", position: { x: 4, y: 0 } },
        { id: "Y",   label: "$Y(s)$",    shape: "none",      position: { x: 6, y: 0 } },
        { id: "H",   label: "$H(s)$",    shape: "rectangle", position: { x: 4, y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "R",   to: "sum", type: "directed" },
        { id: "e2", from: "sum", to: "G",   type: "directed" },
        { id: "e3", from: "G",   to: "Y",   type: "directed" },
        { id: "e4", from: "Y",   to: "H",   type: "directed" },
        { id: "e5", from: "H",   to: "sum", type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── Plugin 21 — Flowcharts ────────────────────────────────────────

export class FlowchartPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "flowcharts",
      displayName:     "Flowcharts",
      description:     "Academic and process flowcharts with decision diamonds, process boxes, and connector arrows.",
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  "Process flowchart.",
      defaultLabel:    "fig:flowchart",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "start", label: "Start",      shape: "rounded-rectangle", position: { x: 0, y: 4 } },
        { id: "proc1", label: "Process 1",  shape: "rectangle",         position: { x: 0, y: 2.5 } },
        { id: "dec1",  label: "Condition?", shape: "diamond",           position: { x: 0, y: 1 } },
        { id: "proc2", label: "Process 2",  shape: "rectangle",         position: { x: 2, y: 1 } },
        { id: "end",   label: "End",        shape: "rounded-rectangle", position: { x: 0, y: -0.5 } },
      ],
      edges: [
        { id: "e1", from: "start", to: "proc1", type: "directed" },
        { id: "e2", from: "proc1", to: "dec1",  type: "directed" },
        { id: "e3", from: "dec1",  to: "proc2", type: "directed", label: "Yes" },
        { id: "e4", from: "dec1",  to: "end",   type: "directed", label: "No" },
        { id: "e5", from: "proc2", to: "end",   type: "directed" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta", "shapes.geometric"], directed: true,
    };
  }
}

// ── Plugin 22 — Software / System Architecture ────────────────────

export class SoftwareArchitecturePlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "software-architecture",
      displayName:     "Software / System Architecture",
      description:     "Component, layer, and system architecture diagrams.",
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for standard architecture overviews. For complex UML or deployment diagrams, use Draw.io and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "System architecture.",
      defaultLabel:    "fig:architecture",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "ui",  label: "UI Layer",  shape: "rectangle", position: { x: 0, y: 3 } },
        { id: "api", label: "API Layer", shape: "rectangle", position: { x: 0, y: 1.5 } },
        { id: "db",  label: "Database",  shape: "rectangle", position: { x: 0, y: 0 } },
      ],
      edges: [
        { id: "e1", from: "ui",  to: "api", type: "directed" },
        { id: "e2", from: "api", to: "db",  type: "directed" },
      ],
      layout: "manual", tikzLibraries: [], directed: true,
    };
  }
}
