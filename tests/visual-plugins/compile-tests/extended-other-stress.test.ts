/**
 * Stress test — extended plugins (non-mathematics categories).
 * ERDiagram, StateMachine, BodeNyquist, UMLClass, NetworkGraph,
 * SupplyDemand, CausalDAG, Genealogy, EnergyBand,
 * OrganicChemistry, ReactionMechanisms, KaplanMeier.
 */
import { describe, it, expect } from "vitest";
import { PLUGIN_REGISTRY } from "../../../visual-plugins/plugin-registry.js";
import { compileLatexFragment, detectToolchain } from "../../../visual-plugins/common/latex/compiler.js";
import { validateLatexStructure } from "../../../visual-plugins/common/latex/structural-validator.js";
import { PGFPlotsEngine }     from "../../../visual-plugins/engines/pgfplots-engine/engine.js";
import { GraphNodeEngine }    from "../../../visual-plugins/engines/graph-node-engine/engine.js";
import { ChemistryEngine }    from "../../../visual-plugins/engines/chemistry-engine/engine.js";
import { TreeForestEngine }   from "../../../visual-plugins/engines/tree-forest-engine/engine.js";
import type { VisualEngine, EngineDocument, EditableSource } from "../../../visual-plugins/common/contracts/index.js";

const ENGINE_MAP: Record<string, VisualEngine> = {
  "pgfplots-engine":      new PGFPlotsEngine(),
  "graph-node-engine":    new GraphNodeEngine(),
  "chemistry-engine":     new ChemistryEngine(),
  "tree-forest-engine":   new TreeForestEngine(),
};

async function getEngineBody(sourceJson: string, engineId: string): Promise<{ body: string; packages: string[] }> {
  const source = JSON.parse(sourceJson) as EditableSource;
  const doc = (source.data ?? source) as EngineDocument;
  const engine = ENGINE_MAP[engineId];
  if (!engine) return { body: `% No engine for ${engineId}`, packages: [] };
  const exported = await engine.export(doc, "latex");
  const body = typeof exported.content === "string" ? exported.content : new TextDecoder().decode(exported.content);
  return { body, packages: exported.requiredPackages };
}

// Non-mathematics extended plugins
const OTHER_CATS = ["engineering-cs", "humanities-social", "chemistry", "biology-medicine", "physics", "arts-visual"];
const otherExtended = PLUGIN_REGISTRY.filter(
  e => e.qualityLevel === "official-extended" && OTHER_CATS.includes(e.category)
);

describe(`Extended non-math plugins stress test (${otherExtended.length} plugins)`, () => {
  const toolchain = detectToolchain();

  for (const entry of otherExtended) {
    const plugin = new entry.plugin();

    it(`[create+validate] ${plugin.displayName}`, { timeout: 15_000 }, async () => {
      const result = await plugin.create();
      expect(result.latexBlock.trim().length).toBeGreaterThan(10);
      // texContent: cuerpo desnudo (no float, no auto-\input). Ver regresión en core-plugins-stress.
      expect(result.texContent.trim().length, "texContent no vacío").toBeGreaterThan(10);
      expect(result.texContent, "texContent debe ser el cuerpo, no un float figure").not.toContain("\\begin{figure}");
      expect(result.texContent, "texContent no debe \\input-se a sí mismo").not.toContain("\\input{");
      expect(result.figureId).toMatch(/^fig_/);
      expect(result.sourceJson).toBeTruthy();
      const validation = await plugin.validate(result);
      const errors = validation.issues.filter(i => i.severity === "error");
      expect(errors.length, errors.map(e => e.message).join("; ")).toBe(0);
      expect(result.requiredPackages.length).toBeGreaterThan(0);
      const structural = validateLatexStructure(result.latexBlock);
      const structErrors = structural.issues.filter(i => i.severity === "error");
      expect(structErrors.length, structErrors.map(e => e.message).join("; ")).toBe(0);
    });

    it(`[compile] ${plugin.displayName}`, { timeout: 120_000 }, async () => {
      if (!toolchain) { console.warn(`  ⚠ SKIP ${plugin.displayName}`); return; }
      const result = await plugin.create();
      let body: string;
      let enginePackages: string[];
      try {
        const ex = await getEngineBody(result.sourceJson!, result.engineId);
        body = ex.body; enginePackages = ex.packages;
      } catch {
        body = result.latexBlock; enginePackages = [];
      }
      const allPkgs = [...new Set([...result.requiredPackages, ...enginePackages])];
      const compiled = compileLatexFragment(body, { packages: allPkgs, timeoutMs: 110_000 });
      if (!compiled.toolchainAvailable) return;
      if (!compiled.ok) console.error(`\n❌ ${plugin.displayName}\n   ${compiled.errors.slice(0,4).join(" | ")}`);
      else console.log(`  ✓ [compile OK] ${plugin.displayName} — ${compiled.pdfBytes?.toLocaleString()} bytes`);
      expect(compiled.ok, `${plugin.displayName}: ${compiled.errors.slice(0,3).join(" | ")}`).toBe(true);
    });
  }
});
