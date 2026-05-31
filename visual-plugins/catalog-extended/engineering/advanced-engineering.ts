import { BasePlugin } from "../../common/plugin-base/index.js";
import { GraphNodeEngine } from "../../engines/graph-node-engine/engine.js";
import { PGFPlotsEngine } from "../../engines/pgfplots-engine/engine.js";
import type { GraphNodeDocument } from "../../engines/graph-node-engine/types.js";
import type { PGFPlotsDocument } from "../../engines/pgfplots-engine/types.js";

const graphEng = new GraphNodeEngine();
const pgfEng   = new PGFPlotsEngine();

// ── Plugin 44 — ER Diagrams ───────────────────────────────────────
// University academic system — 4 entities, realistic attributes, crow's-foot notation.

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
      defaultCaption:  "ER diagram for a university course-enrollment system.",
      defaultLabel:    "fig:er-diagram",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        // Entities (rectangles)
        { id: "student",  label: "STUDENT",    shape: "rectangle", position: { x: 0,  y: 3 } },
        { id: "course",   label: "COURSE",     shape: "rectangle", position: { x: 6,  y: 3 } },
        { id: "prof",     label: "PROFESSOR",  shape: "rectangle", position: { x: 6,  y: 0 } },
        { id: "dept",     label: "DEPARTMENT", shape: "rectangle", position: { x: 0,  y: 0 } },
        // Relationships (diamonds)
        { id: "enroll",   label: "Enrolls",    shape: "diamond",   position: { x: 3,  y: 3 } },
        { id: "teaches",  label: "Teaches",    shape: "diamond",   position: { x: 6,  y: 1.5 } },
        { id: "belongs",  label: "Belongs to", shape: "diamond",   position: { x: 3,  y: 0 } },
        // Attributes (ellipses)
        { id: "sid",   label: "StudentID",  shape: "ellipse",   position: { x: -1.5, y: 4.5 } },
        { id: "sname", label: "Name",       shape: "ellipse",   position: { x: 0,    y: 4.8 } },
        { id: "cid",   label: "CourseID",   shape: "ellipse",   position: { x: 6,    y: 4.8 } },
        { id: "grade", label: "Grade",      shape: "ellipse",   position: { x: 4.5,  y: 4.5 } },
        { id: "pid",   label: "ProfID",     shape: "ellipse",   position: { x: 7.5,  y: 0   } },
      ],
      edges: [
        // Relationships to entities
        { id: "e1", from: "student",  to: "enroll",  type: "undirected", label: "N" },
        { id: "e2", from: "enroll",   to: "course",  type: "undirected", label: "M" },
        { id: "e3", from: "prof",     to: "teaches", type: "undirected", label: "1" },
        { id: "e4", from: "teaches",  to: "course",  type: "undirected", label: "N" },
        { id: "e5", from: "student",  to: "belongs", type: "undirected" },
        { id: "e6", from: "belongs",  to: "dept",    type: "undirected" },
        // Attributes to entities
        { id: "a1", from: "student",  to: "sid",   type: "undirected" },
        { id: "a2", from: "student",  to: "sname", type: "undirected" },
        { id: "a3", from: "course",   to: "cid",   type: "undirected" },
        { id: "a4", from: "enroll",   to: "grade", type: "undirected" },
        { id: "a5", from: "prof",     to: "pid",   type: "undirected" },
      ],
      layout: "manual", tikzLibraries: ["shapes.geometric"], directed: false,
    };
  }
}

// ── Plugin 47 — State Machines ────────────────────────────────────
// Traffic light FSM — universally recognizable example in CS courses.

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
      scopeWarning:    "Suitable for DFA/NFA and reactive system diagrams in theses. For large automata, generate from Graphviz/PlantUML and import as PDF.",
      blockKind:       "input",
      defaultCaption:  "Traffic-light finite state machine (timer-driven).",
      defaultLabel:    "fig:fsm",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "red",    label: "RED\\n(60 s)",    shape: "circle", position: { x: 0,   y: 0 } },
        { id: "green",  label: "GREEN\\n(45 s)",  shape: "circle", position: { x: 4,   y: 0 } },
        { id: "yellow", label: "YELLOW\\n(5 s)",  shape: "circle", position: { x: 2,   y: -3 } },
        // Initial state marker
        { id: "init",   label: "",                shape: "none",   position: { x: -1.5, y: 0 } },
      ],
      edges: [
        { id: "e0", from: "init",   to: "red",    type: "directed" },
        { id: "e1", from: "red",    to: "green",  type: "directed", label: "timer = 60 s" },
        { id: "e2", from: "green",  to: "yellow", type: "directed", label: "timer = 45 s" },
        { id: "e3", from: "yellow", to: "red",    type: "directed", label: "timer = 5 s" },
      ],
      layout: "manual", tikzLibraries: ["automata", "arrows.meta"], directed: true,
    };
  }
}

// ── Plugin 49 — Markov Chains ─────────────────────────────────────
// (Category: mathematics — already improved; kept here for export)

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
      defaultCaption:  "Weather Markov chain (Sunny / Cloudy / Rainy).",
      defaultLabel:    "fig:markov",
    });
  }

  protected buildDefaultDocument(): GraphNodeDocument {
    return {
      engineId: "graph-node-engine", version: "1.0.0",
      nodes: [
        { id: "S", label: "Sunny",  shape: "circle", position: { x: 0,  y: 2 } },
        { id: "C", label: "Cloudy", shape: "circle", position: { x: -2, y: -1 } },
        { id: "R", label: "Rainy",  shape: "circle", position: { x: 2,  y: -1 } },
      ],
      edges: [
        { id: "ss", from: "S", to: "S", type: "directed", label: "0.70" },
        { id: "sc", from: "S", to: "C", type: "directed", label: "0.20" },
        { id: "sr", from: "S", to: "R", type: "directed", label: "0.10" },
        { id: "cs", from: "C", to: "S", type: "directed", label: "0.40" },
        { id: "cc", from: "C", to: "C", type: "directed", label: "0.40" },
        { id: "cr", from: "C", to: "R", type: "directed", label: "0.20" },
        { id: "rs", from: "R", to: "S", type: "directed", label: "0.20" },
        { id: "rc", from: "R", to: "C", type: "directed", label: "0.30" },
        { id: "rr", from: "R", to: "R", type: "directed", label: "0.50" },
      ],
      layout: "manual", tikzLibraries: ["arrows.meta"], directed: true,
    };
  }
}

// ── Plugin 55 — Bode / Nyquist Diagrams ──────────────────────────
// Second-order system G(s) = ωₙ²/(s²+2ζωₙs+ωₙ²) — canonical control example.
// Shows both magnitude AND phase on the same figure as dual series.

export class BodeNyquistPlugin extends BasePlugin<PGFPlotsDocument> {
  constructor() {
    super(pgfEng, {
      pluginId:        "bode-nyquist",
      displayName:     "Bode / Nyquist Diagrams",
      description:     "Frequency response: Bode magnitude + phase, or Nyquist plot. Second-order transfer functions.",
      category:        "engineering-cs",
      engineId:        "pgfplots-engine",
      qualityLevel:    "official-extended",
      requiredPackages: ["pgfplots", "tikz"],
      scopeWarning:    "Enter your system transfer function as a pgfplots expression. Compute poles/zeros in MATLAB/Python first.",
      blockKind:       "input",
      defaultCaption:  "Bode plot of $G(j\\omega) = \\frac{\\omega_n^2}{(j\\omega)^2 + 2\\zeta\\omega_n(j\\omega) + \\omega_n^2}$ ($\\omega_n{=}10$, $\\zeta{=}0.3$).",
      defaultLabel:    "fig:bode",
    });
  }

  protected buildDefaultDocument(): PGFPlotsDocument {
    // 2nd order: |G| = ωₙ²/√((ωₙ²−ω²)² + (2ζωₙω)²), in dB = 20·log₁₀(|G|)
    // ωₙ=10, ζ=0.3 → magnitude peak at resonance ~9.5 rad/s
    return {
      engineId: "pgfplots-engine", version: "1.0.0",
      series: [
        {
          id: "mag",   label: "Magnitude (dB)",
          plotType: "function2d",
          // |G(jω)| in dB: 20·log₁₀(100/sqrt((100-x²)²+(6x)²))
          expression: "20*log10(100/sqrt((100-x^2)^2+(6*x)^2))",
          domain: [0.1, 100],
          color: "blue",
        },
        {
          id: "phase", label: "Phase (deg)",
          plotType: "function2d",
          // pgfplots atan2(y,x) returns DEGREES directly — no * 180/pi needed
          expression: "-atan2(6*x, 100 - x^2)",
          domain: [0.1, 100],
          color: "red",
        },
      ],
      xLabel: "$\\omega$ (rad/s)",
      yLabel: "Magnitude (dB) / Phase ($^\\circ$)",
      xScale: "log",
      yScale: "linear",
      showLegend: true,
      grid: "both",
      pgfplotsOptions: [
        "ymin=-50, ymax=15",
        "legend pos=south west",
        "legend style={font=\\small}",
      ].join(", "),
    };
  }
}
