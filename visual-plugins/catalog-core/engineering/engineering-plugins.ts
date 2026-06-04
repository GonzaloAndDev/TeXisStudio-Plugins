import { BasePlugin } from "../../common/plugin-base/index.js";
import { CircuiTikZEngine } from "../../engines/circuitikz-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { CircuiTikZDocument } from "../../engines/circuitikz-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const circEngine  = new CircuiTikZEngine();
const graphEngine = new GraphNodeEngine();

// ── Plugin 18 — Basic Electrical Circuits ─────────────────────────

export class BasicCircuitsPlugin extends BasePlugin<CircuiTikZDocument> {
  constructor() {
    super(circEngine, {
      pluginId:        "basic-electrical-circuits",
      displayName:     pluginText("basic-electrical-circuits", "displayName", "Basic Electrical Circuits"),
      description:     pluginText("basic-electrical-circuits", "description", "Visual circuit builder: resistors, capacitors, inductors, sources, switches, diodes. CircuiTikZ native."),
      category:        "engineering-cs",
      engineId:        "circuitikz-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["circuitikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("basic-electrical-circuits", "defaultCaption", "RC low-pass filter circuit with voltage divider."),
      defaultLabel:    "fig:circuit-rc",
    });
  }

  protected buildDefaultDocument(): CircuiTikZDocument {
    // RC low-pass filter — canonical circuit in electronics/signals theses
    return {
      engineId: "circuitikz-engine", version: "1.0.0",
      nodes: [
        { id: "A",  x: 0, y: 3 }, { id: "B",  x: 3, y: 3 },
        { id: "C",  x: 6, y: 3 }, { id: "D",  x: 6, y: 0 },
        { id: "E",  x: 3, y: 0 }, { id: "F",  x: 0, y: 0 },
      ],
      components: [
        // Source
        { id: "Vs", type: "voltage-source", from: "F",  to: "A",  direction: "up",    label: "$V_{in}$",  value: "AC" },
        // Series resistor
        { id: "R1", type: "resistor",       from: "A",  to: "B",  direction: "right",  label: "$R_1$",     value: "1\\,k\\Omega" },
        // Shunt capacitor
        { id: "C1", type: "capacitor",      from: "B",  to: "E",  direction: "down",   label: "$C_1$",     value: "100\\,nF" },
        // Output load
        { id: "RL", type: "resistor",       from: "C",  to: "D",  direction: "down",   label: "$R_L$",     value: "10\\,k\\Omega" },
        // Ground
        { id: "G1", type: "ground",         from: "F",  to: "F",  direction: "down" },
        { id: "G2", type: "ground",         from: "D",  to: "D",  direction: "down" },
      ],
      connections: [
        { from: "B", to: "C" },
        { from: "E", to: "D" },
        { from: "F", to: "D" },
      ],
      americanStyle: true,
    };
  }
}

// ── Plugin 19 — Block Diagrams / Control Systems ───────────────────

export class BlockDiagramPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEngine, {
      pluginId:        "block-diagrams-control",
      displayName:     pluginText("block-diagrams-control", "displayName", "Block Diagrams / Control Systems"),
      description:     pluginText("block-diagrams-control", "description", "Control system block diagrams with transfer functions, summing junctions, and feedback loops."),
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("block-diagrams-control", "defaultCaption", "PID closed-loop control system block diagram."),
      defaultLabel:    "fig:pid-control",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // PID controller — standard in control engineering theses
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "ref",  label: "$r(t)$",         shape: "none",      position: { x: -1.5, y: 0 } },
        { id: "sum",  label: "$\\Sigma$",       shape: "circle",    position: { x: 0,    y: 0 } },
        { id: "pid",  label: "PID Controller",  shape: "rectangle", position: { x: 2.2,  y: 0 } },
        { id: "plant",label: "Plant $G(s)$",    shape: "rectangle", position: { x: 4.8,  y: 0 } },
        { id: "out",  label: "$y(t)$",          shape: "none",      position: { x: 6.5,  y: 0 } },
        { id: "sens", label: "Sensor $H(s)$",   shape: "rectangle", position: { x: 4.8,  y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "ref",   to: "sum",   type: "directed" },
        { id: "e2", from: "sum",   to: "pid",   type: "directed", label: "$e(t)$" },
        { id: "e3", from: "pid",   to: "plant", type: "directed", label: "$u(t)$" },
        { id: "e4", from: "plant", to: "out",   type: "directed" },
        { id: "e5", from: "out",   to: "sens",  type: "directed" },
        { id: "e6", from: "sens",  to: "sum",   type: "directed" },
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
      displayName:     pluginText("flowcharts", "displayName", "Flowcharts"),
      description:     pluginText("flowcharts", "description", "Academic and process flowcharts with decision diamonds, process boxes, and connector arrows."),
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      blockKind:       "input",
      defaultCaption:  pluginText("flowcharts", "defaultCaption", "Research methodology flowchart."),
      defaultLabel:    "fig:methodology",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    // Research methodology — the most universally used flowchart in any thesis
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "start",   label: "Start",                    shape: "rounded-rectangle", position: { x: 0, y: 6 } },
        { id: "rq",      label: "Define Research Question",  shape: "rectangle",         position: { x: 0, y: 4.5 } },
        { id: "litrev",  label: "Literature Review",         shape: "rectangle",         position: { x: 0, y: 3 } },
        { id: "gap",     label: "Research gap\\nidentified?",shape: "diamond",           position: { x: 0, y: 1.5 } },
        { id: "refine",  label: "Refine Research Question",  shape: "rectangle",         position: { x: 3, y: 1.5 } },
        { id: "method",  label: "Design Methodology",        shape: "rectangle",         position: { x: 0, y: 0 } },
        { id: "collect", label: "Data Collection",           shape: "rectangle",         position: { x: 0, y: -1.5 } },
        { id: "analyse", label: "Analysis",                  shape: "rectangle",         position: { x: 0, y: -3 } },
        { id: "end",     label: "Conclusions",               shape: "rounded-rectangle", position: { x: 0, y: -4.5 } },
      ],
      edges: [
        { id: "e1", from: "start",   to: "rq",      type: "directed" },
        { id: "e2", from: "rq",      to: "litrev",  type: "directed" },
        { id: "e3", from: "litrev",  to: "gap",     type: "directed" },
        { id: "e4", from: "gap",     to: "method",  type: "directed", label: "Yes" },
        { id: "e5", from: "gap",     to: "refine",  type: "directed", label: "No" },
        { id: "e6", from: "refine",  to: "litrev",  type: "directed" },
        { id: "e7", from: "method",  to: "collect", type: "directed" },
        { id: "e8", from: "collect", to: "analyse", type: "directed" },
        { id: "e9", from: "analyse", to: "end",     type: "directed" },
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
      displayName:     pluginText("software-architecture", "displayName", "Software / System Architecture"),
      description:     pluginText("software-architecture", "description", "Component, layer, and system architecture diagrams."),
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-core",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("software-architecture", "scopeWarning", "Suitable for standard architecture overviews. For complex UML or deployment diagrams, use Draw.io and import as PDF."),
      blockKind:       "input",
      defaultCaption:  pluginText("software-architecture", "defaultCaption", "Three-tier web application architecture."),
      defaultLabel:    "fig:architecture",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // Tier labels
        { id: "client",  label: "Client Tier\\n(Browser / App)",  shape: "rectangle", position: { x: 0,  y: 4 } },
        { id: "server",  label: "Application Tier\\n(REST API)",   shape: "rectangle", position: { x: 0,  y: 2 } },
        { id: "db",      label: "Data Tier\\n(Database / Cache)",  shape: "rectangle", position: { x: 0,  y: 0 } },
        // Side components
        { id: "auth",    label: "Auth Service",  shape: "ellipse", position: { x: 3, y: 2 } },
        { id: "queue",   label: "Message Queue", shape: "ellipse", position: { x: 3, y: 0 } },
      ],
      edges: [
        { id: "e1", from: "client", to: "server",  type: "directed",   label: "HTTPS" },
        { id: "e2", from: "server", to: "db",      type: "directed",   label: "SQL/NoSQL" },
        { id: "e3", from: "server", to: "auth",    type: "bidirected", label: "OAuth 2.0" },
        { id: "e4", from: "server", to: "queue",   type: "directed",   label: "async" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
