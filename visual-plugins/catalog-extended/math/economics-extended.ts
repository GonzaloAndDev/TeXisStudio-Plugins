import { BasePlugin } from "../../common/plugin-base/index.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import { pluginText } from "../../i18n/index.js";

const pgfEng   = new PGFPlotsEngine();
const graphEng = new GraphNodeEngine();

// ── Plugin 60 — Supply & Demand Curves ───────────────────────────────────────
// Full microeconomic diagram: D/S curves + equilibrium + consumer/producer surplus
// + demand shift showing price and quantity effects.

export class SupplyDemandPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "supply-demand",
      displayName:     pluginText("supply-demand", "displayName", "Supply & Demand Curves"),
      description:     pluginText("supply-demand", "description", "Supply and demand with equilibrium, consumer/producer surplus, and optional curve shifts."),
      category:        "humanities-social",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    pluginText("supply-demand", "scopeWarning", "Suitable for illustrative partial-equilibrium analysis in theses. Non-linear elasticity curves may need manual pgfplots adjustment."),
      blockKind:       "input",
      defaultCaption:  pluginText("supply-demand", "defaultCaption", "Supply and demand: original equilibrium $E_0$ and demand shift $D \\to D'$ after income increase."),
      defaultLabel:    "fig:supply-demand",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // Original: D: P = 14 - 2Q, S: P = 2 + Q → E₀ at Q=4, P=6
    // Shifted demand: D': P = 20 - 2Q → E₁ at Q=6, P=8
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        // Consumer surplus (area under D above P=6)
        {
          id: "cs", label: "Consumer surplus",
          plotType: "function2d",
          expression: "14 - 2*x",
          domain: [0, 4],
          color: "blue!20",
        },
        // Producer surplus (area above S below P=6)
        {
          id: "ps", label: "Producer surplus",
          plotType: "function2d",
          expression: "2 + x",
          domain: [0, 4],
          color: "red!15",
        },
        // Original demand D
        {
          id: "D0",  label: "Demand $D$: $P=14-2Q$",
          plotType: "function2d",
          expression: "14 - 2*x",
          domain: [0, 7],
          color: "blue",
        },
        // Shifted demand D'
        {
          id: "D1",  label: "Demand $D'$: $P=20-2Q$",
          plotType: "function2d",
          expression: "20 - 2*x",
          domain: [0, 9],
          color: "blue",
        },
        // Supply S
        {
          id: "S0",  label: "Supply $S$: $P=2+Q$",
          plotType: "function2d",
          expression: "2 + x",
          domain: [0, 9],
          color: "red",
        },
        // Equilibrium points
        {
          id: "eq",  label: "Equilibria $E_0$, $E_1$",
          plotType: "scatter",
          data: [{ x: 4, y: 6 }, { x: 6, y: 8 }],
          color: "black", mark: "*",
        },
      ],
      xLabel: "Quantity $Q$",
      yLabel: "Price $P$",
      xScale: "linear", yScale: "linear",
      showLegend: true, grid: "major",
      pgfplotsOptions: [
        "xmin=0, ymin=0, xmax=10, ymax=14",
        "legend pos=north east",
        "legend style={font=\\small}",
        "fill opacity=0.3",
      ].join(",\n      "),
    };
  }
}

// ── Plugin 61 — UML Class Diagrams ───────────────────────────────────────────
// Repository + Observer design pattern — used in software architecture chapters.

export class UMLClassDiagramPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "uml-class-diagrams",
      displayName:     pluginText("uml-class-diagrams", "displayName", "UML Class Diagrams"),
      description:     pluginText("uml-class-diagrams", "description", "UML class diagrams with inheritance, interfaces, composition, and association."),
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    pluginText("uml-class-diagrams", "scopeWarning", "Generates simplified class boxes. For full UML compliance, use PlantUML or draw.io and import as PDF."),
      blockKind:       "input",
      defaultCaption:  pluginText("uml-class-diagrams", "defaultCaption", "Repository pattern with Observer: \\\\ $<<$interface$>>$ classes, inheritance and composition."),
      defaultLabel:    "fig:uml-class",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // Interface
        { id: "iRepo",   label: "<<interface>>\\nIRepository",  shape: "rectangle", position: { x: 0,   y: 5 } },
        // Concrete classes
        { id: "sqlRepo", label: "SQLRepository\\n--\\n+save(e)\\n+find(id)",  shape: "rectangle", position: { x: -3, y: 2.5 } },
        { id: "memRepo", label: "InMemoryRepo\\n--\\n+save(e)\\n+find(id)",  shape: "rectangle", position: { x: 3,  y: 2.5 } },
        // Domain class
        { id: "entity",  label: "Entity\\n--\\n+id: UUID\\n+updatedAt",       shape: "rectangle", position: { x: 0,   y: 0 } },
        // Observer
        { id: "iObsvr",  label: "<<interface>>\\nIObserver",    shape: "rectangle", position: { x: 6,   y: 5 } },
        { id: "logger",  label: "AuditLogger\\n--\\n+onEvent()", shape: "rectangle", position: { x: 6,   y: 2.5 } },
      ],
      edges: [
        { id: "e1", from: "sqlRepo", to: "iRepo",   type: "directed", label: "implements" },
        { id: "e2", from: "memRepo", to: "iRepo",   type: "directed", label: "implements" },
        { id: "e3", from: "sqlRepo", to: "entity",  type: "directed", label: "manages 0..*" },
        { id: "e4", from: "iRepo",   to: "iObsvr",  type: "directed", label: "notifies" },
        { id: "e5", from: "logger",  to: "iObsvr",  type: "directed", label: "implements" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}
