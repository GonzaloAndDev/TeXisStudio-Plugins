/**
 * STRESS TEST — 34 official-core plugins × create + validate + compile real
 *
 * Para cada plugin:
 *  1. plugin.create()          → VisualFigureResult (con sourceJson)
 *  2. plugin.validate(result)  → sin errores (warnings OK)
 *  3. Extraer LaTeX raw del sourceJson vía el engine correspondiente
 *  4. Compilar con latexmk en documento standalone real
 *
 * Propósito: visibilidad de uso real, no perfección formal.
 * Si latexmk no está en PATH, el paso de compilación se omite (skip, no fail).
 * Timeout extendido: 120 s por plugin (MiKTeX descarga paquetes en primer uso).
 */
import { describe, it, expect } from "vitest";
import { PLUGIN_REGISTRY } from "../../../visual-plugins/plugin-registry.js";
import { compileLatexFragment, detectToolchain } from "../../../visual-plugins/common/latex/compiler.js";
import { validateLatexStructure } from "../../../visual-plugins/common/latex/structural-validator.js";
import { MathEngine }         from "../../../visual-plugins/engines/math-engine/engine.js";
import { TikzShapeEngine }    from "../../../visual-plugins/engines/tikz-shape-engine/engine.js";
import { PGFPlotsEngine }     from "../../../visual-plugins/engines/pgfplots-engine/engine.js";
import { GraphNodeEngine }    from "../../../visual-plugins/engines/graph-node-engine/engine.js";
import { CircuiTikZEngine }   from "../../../visual-plugins/engines/circuitikz-engine/engine.js";
import { ChemistryEngine }    from "../../../visual-plugins/engines/chemistry-engine/engine.js";
import { TreeForestEngine }   from "../../../visual-plugins/engines/tree-forest-engine/engine.js";
import { TimelineGanttEngine }from "../../../visual-plugins/engines/timeline-gantt-engine/engine.js";
import type { VisualEngine, EngineDocument, EditableSource } from "../../../visual-plugins/common/contracts/index.js";

// ── Engine factory ─────────────────────────────────────────────────────────

const ENGINE_MAP: Record<string, VisualEngine> = {
  "math-engine":          new MathEngine(),
  "tikz-shape-engine":    new TikzShapeEngine(),
  "pgfplots-engine":      new PGFPlotsEngine(),
  "graph-node-engine":    new GraphNodeEngine(),
  "circuitikz-engine":    new CircuiTikZEngine(),
  "chemistry-engine":     new ChemistryEngine(),
  "tree-forest-engine":   new TreeForestEngine(),
  "timeline-gantt-engine":new TimelineGanttEngine(),
};

async function getEngineLatex(sourceJson: string, engineId: string): Promise<{ body: string; packages: string[] }> {
  const source = JSON.parse(sourceJson) as EditableSource;
  const doc = (source.data ?? source) as EngineDocument;
  const engine = ENGINE_MAP[engineId];
  if (!engine) throw new Error(`Engine no registrado: ${engineId}`);
  const exported = await engine.export(doc, "latex");
  const body = typeof exported.content === "string" ? exported.content : new TextDecoder().decode(exported.content);
  return { body, packages: exported.requiredPackages };
}

// ── Solo plugins official-core ──────────────────────────────────────────────

const coreEntries = PLUGIN_REGISTRY.filter(e => e.qualityLevel === "official-core");

// ── Suite ──────────────────────────────────────────────────────────────────

describe(`Core plugins stress test (${coreEntries.length} plugins)`, () => {
  const toolchain = detectToolchain();

  for (const entry of coreEntries) {
    const plugin = new entry.plugin();

    // ── Paso 1+2: create() + validate() ─────────────────────────────────────
    it(`[create+validate] ${plugin.displayName}`, { timeout: 15_000 }, async () => {
      const result = await plugin.create();

      // latexBlock tiene contenido
      expect(result.latexBlock.trim().length, "latexBlock no debe estar vacío").toBeGreaterThan(10);

      // texContent (cuerpo desnudo que va a output.tex) debe estar presente y
      // NO ser un float `figure`: si lo fuera, el wrapper `\input`-aría un
      // float dentro de otro float (recursión) y el snippet preview en
      // standalone fallaría con "missing \item". Regresión histórica.
      expect(result.texContent.trim().length, "texContent no debe estar vacío").toBeGreaterThan(10);
      expect(result.texContent, "texContent debe ser el cuerpo, no un float figure").not.toContain("\\begin{figure}");
      expect(result.texContent, "texContent no debe \\input-se a sí mismo").not.toContain("\\input{");

      // figureId generado
      expect(result.figureId, "figureId debe tener el prefijo fig_").toMatch(/^fig_/);

      // sourceJson es JSON válido y tiene engineId
      expect(result.sourceJson, "sourceJson debe estar presente en plugins BasePlugin").toBeTruthy();
      const source = JSON.parse(result.sourceJson!);
      expect(source.engineId ?? source.pluginId, "sourceJson debe tener engineId o pluginId").toBeTruthy();

      // validate() — sin errores fatales
      const validation = await plugin.validate(result);
      const errors = validation.issues.filter(i => i.severity === "error");
      expect(
        errors.length,
        `validate() reportó errores fatales: ${errors.map(e => e.message).join("; ")}`,
      ).toBe(0);

      // requiredPackages declarados
      expect(result.requiredPackages.length, "el plugin debe declarar al menos un paquete LaTeX").toBeGreaterThan(0);

      // Validación estructural del latexBlock
      const structural = validateLatexStructure(result.latexBlock);
      const structErrors = structural.issues.filter(i => i.severity === "error");
      expect(
        structErrors.length,
        `latexBlock tiene errores estructurales: ${structErrors.map(e => e.message).join("; ")}`,
      ).toBe(0);
    });

    // ── Paso 3+4: LaTeX raw → compilar con latexmk ──────────────────────────
    it(`[compile] ${plugin.displayName}`, { timeout: 120_000 }, async () => {
      if (!toolchain) {
        console.warn(`  ⚠ SKIP [compile] ${plugin.displayName}: no hay latexmk/pdflatex en PATH`);
        return; // skip sin fallar
      }

      const result = await plugin.create();

      // Extraer LaTeX del engine vía sourceJson
      let body: string;
      let enginePackages: string[];
      try {
        const extracted = await getEngineLatex(result.sourceJson!, result.engineId);
        body = extracted.body;
        enginePackages = extracted.packages;
      } catch (e) {
        // Si el engine no está mapeado (e.g. external-vector), compilar el latexBlock entero
        body = result.latexBlock;
        enginePackages = [];
      }

      const allPackages = [
        ...new Set([
          ...result.requiredPackages,
          ...enginePackages,
        ]),
      ];

      const compiled = compileLatexFragment(body, {
        packages: allPackages,
        timeoutMs: 110_000,
      });

      if (!compiled.toolchainAvailable) {
        console.warn(`  ⚠ SKIP [compile] ${plugin.displayName}: toolchain desapareció`);
        return;
      }

      if (!compiled.ok) {
        // Reportar detalles del fallo para diagnóstico
        const errorLines = compiled.errors.slice(0, 8).join("\n");
        console.error(
          `\n❌ [compile FAIL] ${plugin.displayName} (${plugin.pluginId})\n` +
          `   Engine: ${result.engineId} | Packages: ${allPackages.join(", ")}\n` +
          `   Errors:\n${errorLines.split("\n").map(l => "     " + l).join("\n")}`,
        );
      } else {
        console.log(
          `  ✓ [compile OK] ${plugin.displayName} — PDF ${compiled.pdfBytes?.toLocaleString()} bytes`,
        );
      }

      // El test falla solo si hay error fatal (no advertencias)
      expect(
        compiled.ok,
        `La compilación LaTeX falló para ${plugin.displayName}.\n` +
        `Packages: ${allPackages.join(", ")}\n` +
        `Errors: ${compiled.errors.slice(0, 5).join(" | ")}`,
      ).toBe(true);
    });
  }
});
