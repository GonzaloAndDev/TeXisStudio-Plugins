import { TikzShapeEngine } from "../visual-plugins/engines/tikz-shape-engine/engine.js";
import { ChemistryEngine }  from "../visual-plugins/engines/chemistry-engine/engine.js";
import { GeometricOpticsPlugin, InclinedPlanePlugin } from "../visual-plugins/catalog-core/physics/physics-plugins.js";
import { ChemicalStructuresPlugin } from "../visual-plugins/catalog-core/chemistry/index.js";
import type { EditableSource } from "../visual-plugins/common/contracts/index.js";

async function body(plugin: { create(): Promise<{ sourceJson?: string; engineId: string }> }, eng: { export(d: object, f: string): Promise<{ content: unknown }> }) {
  const r = await plugin.create();
  const src = JSON.parse(r.sourceJson!) as EditableSource;
  const doc = (src.data ?? src) as object;
  const out = await eng.export(doc, "latex");
  return typeof out.content === "string" ? out.content : new TextDecoder().decode(out.content as Uint8Array);
}

const tikz = new TikzShapeEngine();
const chem = new ChemistryEngine();

console.log("=== GEOMETRIC OPTICS (TikZ) ===");
console.log(await body(new GeometricOpticsPlugin(), tikz));

console.log("\n=== INCLINED PLANE (TikZ) ===");
console.log(await body(new InclinedPlanePlugin(), tikz));

console.log("\n=== CHEMICAL STRUCTURES (Chemistry) ===");
console.log(await body(new ChemicalStructuresPlugin(), chem));
