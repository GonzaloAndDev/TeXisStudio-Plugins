import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";

const pgfEng   = new PGFPlotsEngine();
const graphEng = new GraphNodeEngine();

// ── Plugin 60 — Supply & Demand Curves ────────────────────────────
// Standard in economics, public policy, business thesis chapters.

export class SupplyDemandPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "supply-demand",
      displayName:     "Supply & Demand Curves",
      description:     "Microeconomics supply and demand diagrams with equilibrium point, shifts, and consumer/producer surplus areas.",
      category:        "humanities-social",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Suitable for illustrative supply/demand analysis in theses. Specify linear functions; non-linear curves may need manual pgfplots adjustment.",
      blockKind:       "input",
      defaultCaption:  "Supply and demand equilibrium.",
      defaultLabel:    "fig:supply-demand",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "demand", label: "Demand: $P = 10 - Q$",
          plotType: "function2d",
          expression: "10 - x",
          domain: [0, 9],
          color: "blue",
        },
        {
          id: "supply", label: "Supply: $P = 2 + Q$",
          plotType: "function2d",
          expression: "2 + x",
          domain: [0, 9],
          color: "red",
        },
      ],
      xLabel: "Quantity ($Q$)", yLabel: "Price ($P$)",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: "xmin=0, ymin=0, xmax=10, ymax=12",
    };
  }
}

// ── Plugin 61 — UML Class Diagrams ────────────────────────────────
// Required in software engineering theses for system design chapters.

export class UMLClassDiagramPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "uml-class-diagrams",
      displayName:     "UML Class Diagrams",
      description:     "Simplified UML class diagrams with classes, attributes, methods, inheritance, and associations.",
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    "Generates simplified UML class boxes. For full UML compliance (multiplicity, visibility, stereotypes), use PlantUML or draw.io and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "UML class diagram.",
      defaultLabel:    "fig:uml-class",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "animal",  label: "Animal\\n+ name: String\\n+ eat(): void",       shape: "rectangle", position: { x: 0,  y: 3   } },
        { id: "dog",     label: "Dog\\n+ breed: String\\n+ bark(): void",         shape: "rectangle", position: { x: -2, y: 0   } },
        { id: "cat",     label: "Cat\\n+ indoor: bool\\n+ purr(): void",          shape: "rectangle", position: { x: 2,  y: 0   } },
        { id: "shelter", label: "Shelter\\n+ capacity: int\\n+ adopt(): Animal",  shape: "rectangle", position: { x: 0,  y: -2.5 } },
      ],
      edges: [
        { id: "e1", from: "dog",     to: "animal",  type: "directed", label: "extends",     style: "open triangle" },
        { id: "e2", from: "cat",     to: "animal",  type: "directed", label: "extends",     style: "open triangle" },
        { id: "e3", from: "shelter", to: "animal",  type: "directed", label: "0..*",        style: "diamond" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
