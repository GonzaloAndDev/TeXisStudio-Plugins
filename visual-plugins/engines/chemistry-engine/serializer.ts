import type { ChemFormula, ChemReaction, ChemElement, ChemStructure, ChemStructureTemplate } from "./types.js";

/** Biblioteca de estructuras chemfig verificadas (cada una compila — ver
 *  el compile-test que las recorre todas). El cuerpo va dentro de \chemfig{…}.
 *  Son las estructuras orgánicas y anillos más usados en tesis; para algo
 *  fuera de catálogo, el usuario puede pasar chemfigSource crudo. */
export const CHEMFIG_TEMPLATES: Record<ChemStructureTemplate, string> = {
  benzene:       "*6(=-=-=-)",
  cyclohexane:   "*6(------)",
  cyclopentane:  "*5(-----)",
  naphthalene:   "*6(-=-(*6(-=-=-))=-=)",
  phenol:        "*6(=-=(-OH)-=-)",
  toluene:       "*6(=-=(-CH_3)-=-)",
  aniline:       "*6(=-=(-NH_2)-=-)",
  "benzoic-acid":"*6(=-=(-C(=[2]O)-OH)-=-)",
  methane:       "CH_4",
  ethanol:       "CH_3-CH_2-OH",
  "acetic-acid": "CH_3-C(=[2]O)-OH",
  "glucose-chain":"H-[2]C(-[6]OH)(-[7]H)-C(-[6]OH)(-[7]H)-C(-[6]OH)(-[7]H)-C(-[6]OH)(-[7]H)-C(-[6]OH)(-[7]H)-CHO",
};

/** Serializa una estructura: chemfigSource crudo (prioridad) → plantilla
 *  integrada → comentario de fallback si no hay nada utilizable. */
export function serializeStructure(s: ChemStructure): string {
  if (s.chemfigSource && s.chemfigSource.trim()) return s.chemfigSource;
  if (s.template && CHEMFIG_TEMPLATES[s.template]) {
    return `\\chemfig{${CHEMFIG_TEMPLATES[s.template]}}`;
  }
  return `% structure: ${s.description ?? "define a template or chemfigSource"}`;
}

/** Strip characters that have special meaning inside \ce{}: % starts a comment
 *  and & is a bond-table alignment tab in mhchem v4. Neither belongs in a
 *  free-text formula name entered by the user. */
function sanitizeCeText(text: string): string {
  return text.replace(/%/g, "").replace(/&/g, "");
}

export function serializeFormula(f: ChemFormula): string {
  let out = sanitizeCeText(f.text);
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

  // mhchem acepta condiciones sobre/bajo CUALQUIER flecha: `<arrow>[above][below]`.
  // Antes se forzaba `->` cuando había condiciones, lo que convertía un
  // equilibrio (`<=>`) en una reacción unidireccional — químicamente erróneo
  // (p. ej. el proceso Haber). Respetamos siempre el tipo de flecha del doc.
  const arrow = r.arrow || "->";
  if (above || below) {
    return `\\ce{${reactants} ${arrow}[${above}][${below}] ${products}}`;
  }
  return `\\ce{${reactants} ${arrow} ${products}}`;
}

export function serializeElements(elements: ChemElement[]): string[] {
  return elements.map(el => {
    switch (el.type) {
      case "formula":
        return `\\ce{${serializeFormula(el)}}`;
      case "reaction":
        return serializeReaction(el);
      case "structure":
        return serializeStructure(el);
    }
  });
}
