import type { CircuiTikZDocument, CircuitComponent, CircuitNode } from "./types.js";

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
  const labelParts: string[] = [];
  if (c.label) labelParts.push(`l=${c.label}`);
  if (c.value) labelParts.push(`v=${c.value}`);
  const opts = labelParts.length > 0 ? `[${labelParts.join(", ")}]` : "";
  return `  \\draw (${c.from}) to[${tikzComp}${opts}] (${c.to});`;
}

function nodeStr(n: CircuitNode): string {
  const label = n.label ? ` node[above] {${n.label}}` : "";
  return `  \\node[coordinate] (${n.id}) at (${n.x}, ${n.y})${label} {};`;
}

export function serializeCircuit(doc: CircuiTikZDocument): string {
  const style = doc.americanStyle ? "[american]" : "[european]";
  const nodes = doc.nodes.map(nodeStr);
  const comps = doc.components.map(componentStr);

  return [
    `\\begin{circuitikz}${style}`,
    ...nodes,
    ...comps,
    `\\end{circuitikz}`,
  ].join("\n");
}
