import { BasePlugin } from "../../common/plugin-base/index.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const graphEng = new GraphNodeEngine();
const pgfEng   = new PGFPlotsEngine();

// ── Plugin 44 — ER Diagrams ───────────────────────────────────────

export class ERDiagramPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "er-diagrams",
      displayName:     "ER Diagrams",
      description:     "Entity-relationship diagrams for database design. TikZ native.",
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for standard ER diagrams in theses. Complex schemas with many entities benefit from Draw.io exported as PDF.",
      blockKind:       "input",
      defaultCaption:  "Entity-relationship diagram.",
      defaultLabel:    "fig:er-diagram",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "student", label: "Student",   shape: "rectangle", position: { x: 0, y: 0 } },
        { id: "course",  label: "Course",    shape: "rectangle", position: { x: 4, y: 0 } },
        { id: "enroll",  label: "Enrolls",   shape: "diamond",   position: { x: 2, y: 0 } },
        { id: "sid",     label: "StudentID", shape: "ellipse",   position: { x: -1, y: -1.5 } },
        { id: "cid",     label: "CourseID",  shape: "ellipse",   position: { x: 5,  y: -1.5 } },
      ],
      edges: [
        { id: "e1", from: "student", to: "enroll",  type: "undirected" },
        { id: "e2", from: "enroll",  to: "course",  type: "undirected" },
        { id: "e3", from: "student", to: "sid",     type: "undirected" },
        { id: "e4", from: "course",  to: "cid",     type: "undirected" },
      ],
      layout: "manual", tikzLibraries: ["shapes.geometric"], directed: false,
    };
  }
}

// ── Plugin 47 — State Machines ────────────────────────────────────

export class StateMachinePlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "state-machines",
      displayName:     "State Machines",
      description:     "Finite state machines and automata with states, transitions, and labels.",
      category:        "engineering-cs",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for DFA/NFA diagrams in theses. Self-loops and complex curved transitions may need manual TikZ adjustment.",
      blockKind:       "input",
      defaultCaption:  "Finite state machine.",
      defaultLabel:    "fig:fsm",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "q0", label: "$q_0$", shape: "circle", position: { x: 0, y: 0 }, style: "initial" },
        { id: "q1", label: "$q_1$", shape: "circle", position: { x: 3, y: 0 } },
        { id: "q2", label: "$q_2$", shape: "circle", position: { x: 6, y: 0 }, style: "double" },
      ],
      edges: [
        { id: "e1", from: "q0", to: "q1", type: "directed", label: "a" },
        { id: "e2", from: "q1", to: "q2", type: "directed", label: "b" },
        { id: "e3", from: "q1", to: "q0", type: "directed", label: "a" },
        { id: "e4", from: "q2", to: "q0", type: "directed", label: "b" },
      ],
      layout: "manual", tikzLibraries: ["automata", "arrows.meta"], directed: true,
    };
  }
}

// ── Plugin 49 — Markov Chains ─────────────────────────────────────

export class MarkovChainsPlugin extends BasePlugin<GraphNodeDocument> {
  constructor() {
    super(graphEng, {
      pluginId:        "markov-chains",
      displayName:     "Markov Chains",
      description:     "Markov chain diagrams with states and transition probabilities.",
      category:        "mathematics",
      engineId:        "graph-node-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["tikz"],
      scopeWarning:    "Suitable for illustrative Markov chains in theses. For inference or simulation, use R/Python and import results as figures.",
      blockKind:       "input",
      defaultCaption:  "Markov chain.",
      defaultLabel:    "fig:markov",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "s1", label: "$S_1$", shape: "circle", position: { x: 0,   y: 0 } },
        { id: "s2", label: "$S_2$", shape: "circle", position: { x: 3,   y: 0 } },
        { id: "s3", label: "$S_3$", shape: "circle", position: { x: 1.5, y: -2 } },
      ],
      edges: [
        { id: "e1", from: "s1", to: "s2", type: "directed", label: "0.6" },
        { id: "e2", from: "s2", to: "s3", type: "directed", label: "0.4" },
        { id: "e3", from: "s3", to: "s1", type: "directed", label: "0.7" },
        { id: "e4", from: "s1", to: "s1", type: "directed", label: "0.4" },
        { id: "e5", from: "s2", to: "s2", type: "directed", label: "0.6" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── Plugin 55 — Bode / Nyquist Diagrams ──────────────────────────

export class BodeNyquistPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "bode-nyquist",
      displayName:     "Bode / Nyquist Diagrams",
      description:     "Frequency response diagrams: Bode magnitude/phase and Nyquist plots.",
      category:        "engineering-cs",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Suitable for standard Bode and Nyquist diagrams in theses. Requires manual entry of the transfer function expression.",
      blockKind:       "input",
      defaultCaption:  "Bode magnitude plot.",
      defaultLabel:    "fig:bode",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [{
        id: "mag", label: "Magnitude (dB)",
        plotType: "function2d",
        expression: "-20*log10(sqrt(1+x^2))",
        domain: [0.01, 100],
        color: "blue",
      }],
      xLabel: "$\\omega$ (rad/s)", yLabel: "Magnitude (dB)",
      xScale: "log", yScale: "linear",
      showLegend: true, grid: "both",
    };
  }
}
