/**
 * Stress test — 10 plugins experimentales (5 reales + 5 import-bridges).
 */
import { describe, it, expect } from "vitest";
import { PLUGIN_REGISTRY } from "../../../visual-plugins/plugin-registry.js";
import { compileLatexFragment, detectToolchain } from "../../../visual-plugins/common/latex/compiler.js";
import { validateLatexStructure } from "../../../visual-plugins/common/latex/structural-validator.js";
import { GraphNodeEngine } from "../../../visual-plugins/engines/graph-node-engine/engine.js";
import { TreeForestEngine } from "../../../visual-plugins/engines/tree-forest-engine/engine.js";
import type { VisualEngine, EngineDocument, EditableSource } from "../../../visual-plugins/common/contracts/index.js";

const ENGINE_MAP: Record<string, VisualEngine> = {
  "graph-node-engine": new GraphNodeEngine(),
  "tree-forest-engine": new TreeForestEngine(),
};

async function getBody(sj: string, eid: string): Promise<{ b: string; pkgs: string[] }> {
  const src = JSON.parse(sj) as EditableSource;
  const doc = (src.data ?? src) as EngineDocument;
  const eng = ENGINE_MAP[eid];
  if (!eng) return { b: "", pkgs: [] };
  const ex = await eng.export(doc, "latex");
  const b = typeof ex.content === "string" ? ex.content : new TextDecoder().decode(ex.content);
  return { b, pkgs: ex.requiredPackages };
}

const expEntries = PLUGIN_REGISTRY.filter(e => e.qualityLevel === "experimental");

describe(`Experimental plugins stress test (${expEntries.length} plugins)`, () => {
  const tc = detectToolchain();

  for (const entry of expEntries) {
    const plugin = new entry.plugin();

    it(`[create+validate] ${plugin.displayName}`, { timeout: 10_000 }, async () => {
      const r = await plugin.create();
      expect(r.latexBlock.trim().length, "latexBlock no vacío").toBeGreaterThan(10);
      expect(r.figureId).toMatch(/^fig_/);
      const val = await plugin.validate(r);
      const errs = val.issues.filter(i => i.severity === "error");
      expect(errs.length, errs.map(e => e.message).join("; ")).toBe(0);
      const struct = validateLatexStructure(r.latexBlock);
      const serrs = struct.issues.filter(i => i.severity === "error");
      expect(serrs.length, serrs.map(e => e.message).join("; ")).toBe(0);
    });

    it(`[compile] ${plugin.displayName}`, { timeout: 120_000 }, async () => {
      if (!tc) { console.warn(`⚠ SKIP ${plugin.displayName}`); return; }
      const r = await plugin.create();
      let body: string;
      let ePkgs: string[];
      if (r.sourceJson && ENGINE_MAP[r.engineId]) {
        const ex = await getBody(r.sourceJson, r.engineId);
        body = ex.b; ePkgs = ex.pkgs;
      } else {
        body = r.latexBlock; ePkgs = [];
      }
      const pkgs = [...new Set([...r.requiredPackages, ...ePkgs])];
      const compiled = compileLatexFragment(body, { packages: pkgs, timeoutMs: 110_000 });
      if (!compiled.toolchainAvailable) return;
      if (!compiled.ok) console.error(`❌ ${plugin.displayName}\n   ${compiled.errors.slice(0,4).join(" | ")}`);
      else console.log(`  ✓ ${plugin.displayName} — ${compiled.pdfBytes?.toLocaleString()} bytes`);
      expect(compiled.ok, `${plugin.displayName}: ${compiled.errors.slice(0,3).join(" | ")}`).toBe(true);
    });
  }
});
