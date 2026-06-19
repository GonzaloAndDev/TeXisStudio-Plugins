import type { CircuiTikZDocument, CircuitComponent, CircuitNode, CircuitConnection } from "./types.js";

const COMPONENT_MAP: Record<string, string> = {
  resistor:        "R",
  capacitor:       "C",
  inductor:        "L",
  "voltage-source":"V",
  "current-source":"I",
  battery:         "battery1",
  ground:          "ground",
  diode:           "D",
  zener:           "zD",
  npn:             "npn",
  pnp:             "pnp",
  nmos:            "nmos",
  pmos:            "pmos",
  "op-amp":        "op amp",
  transformer:     "transformer",
  switch:          "closing switch",
  lamp:            "lamp",
  antenna:         "antenna",
  ammeter:         "ammeter",
  voltmeter:       "voltmeter",
  ohmmeter:        "ohmmeter",
};

function componentStr(c: CircuitComponent): string {
  const tikzComp = COMPONENT_MAP[c.type] ?? c.type;

  // Special single-node components that attach to a single node, not a wire.
  if (c.type === "ground") {
    return `  \\draw (${c.from}) node[ground] {};`;
  }
  if (c.type === "antenna") {
    return `  \\draw (${c.from}) node[antenna] {};`;
  }

  // CircuiTikZ syntax: \draw (from) to[component, l=label, v=value] (to);
  // Ensure math-mode wrapping: if the string already has $…$, keep it;
  // if it contains LaTeX commands (\cmd) or subscripts/superscripts, wrap it;
  // otherwise pass plain text as-is (circuitikz renders l= in math mode in
  // modern versions, but explicit wrapping ensures compatibility).
  const ensureMath = (s: string): string => {
    if (/^\$.*\$$/.test(s)) return s;      // already wrapped
    if (/[\\_{^]/.test(s)) return `$${s}$`; // needs math mode
    return s;                               // plain text/number
  };
  const optParts: string[] = [tikzComp];
  if (c.label) optParts.push(`l={${ensureMath(c.label)}}`);
  if (c.value) optParts.push(`v={${ensureMath(c.value)}}`);
  return `  \\draw (${c.from}) to[${optParts.join(", ")}] (${c.to});`;
}

function sanitizeLabel(text: string): string {
  return text
    .replace(/(?<!\\)&/g, "\\&")
    .replace(/(?<!\\)%/g, "\\%")
    .replace(/(?<!\\)#/g, "\\#")
    .replace(/(?<!\\)_/g, "\\_");
}

function nodeStr(n: CircuitNode): string {
  const label = n.label ? ` node[above] {${sanitizeLabel(n.label)}}` : "";
  return `  \\node[coordinate] (${n.id}) at (${n.x}, ${n.y})${label} {};`;
}

/** Plain wire between two nodes. Antes los `connections` eran editables en la
 *  UI pero NUNCA se serializaban → los cables desaparecían del PDF. */
function connectionStr(c: CircuitConnection): string {
  return `  \\draw (${c.from}) to[short] (${c.to});`;
}

export function serializeCircuit(doc: CircuiTikZDocument): string {
  const style = doc.americanStyle ? "[american]" : "[european]";
  const nodes = doc.nodes.map(nodeStr);
  const comps = doc.components.map(componentStr);
  const wires = (doc.connections ?? []).map(connectionStr);

  return [
    `\\begin{circuitikz}${style}`,
    ...nodes,
    ...comps,
    ...wires,
    `\\end{circuitikz}`,
  ].join("\n");
}
