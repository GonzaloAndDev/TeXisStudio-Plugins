import type { ChemFormula, ChemReaction, ChemElement } from "./types.js";

export function serializeFormula(f: ChemFormula): string {
  let out = f.text;
  if (f.charge) out += `^{${f.charge}}`;
  if (f.state) out += `_{(${f.state})}`;
  return out;
}

function sanitizeCondition(condition: string): string {
  // mhchem renders the text above/below an arrow (->[...]) in text mode, so a
  // superscript like ^{\circ} must be wrapped in inline math, otherwise pdfLaTeX
  // raises "Missing $ inserted".
  return condition
    .replace(/\\textdegree\{\}\s*C/g, "$^{\\circ}$C")
    .replace(/\\textdegree\s*C/g, "$^{\\circ}$C")
    .replace(/°\s*C/g, "$^{\\circ}$C");
}

export function serializeReaction(r: ChemReaction): string {
  const reactants = r.reactants.map(serializeFormula).join(" + ");
  const products  = r.products.map(serializeFormula).join(" + ");

  const above = sanitizeCondition(r.conditionsAbove ?? r.catalyst ?? "");
  const below  = sanitizeCondition(r.conditionsBelow ?? "");

  if (above || below) {
    return `\\ce{${reactants} ->[${above}][${below}] ${products}}`;
  }
  return `\\ce{${reactants} ${r.arrow} ${products}}`;
}

export function serializeElements(elements: ChemElement[]): string[] {
  return elements.map(el => {
    switch (el.type) {
      case "formula":
        return `\\ce{${serializeFormula(el)}}`;
      case "reaction":
        return serializeReaction(el);
      case "structure":
        if (el.chemfigSource) return el.chemfigSource;
        return `% structure: ${el.description ?? "see source.json"}`;
    }
  });
}
