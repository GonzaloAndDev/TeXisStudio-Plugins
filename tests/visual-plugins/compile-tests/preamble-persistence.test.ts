import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { detectPackages, computePreambleAdditions, applyPreambleAdditions } from "../../../visual-plugins/common/preamble/preamble-manager.js";
import { FigureStore } from "../../../visual-plugins/common/persistence/figure-store.js";
import type { FigureManifest } from "../../../visual-plugins/common/manifest/schema.js";
import type { EditableSource } from "../../../visual-plugins/common/contracts/types.js";

// ── Preamble manager ─────────────────────────────────────────────────────────

describe("detectPackages", () => {
  it("finds a single package", () => {
    const found = detectPackages("\\usepackage{tikz}");
    expect(found.has("tikz")).toBe(true);
  });

  it("finds package with options", () => {
    const found = detectPackages("\\usepackage[version=4]{mhchem}");
    expect(found.has("mhchem")).toBe(true);
  });

  it("finds multiple packages", () => {
    const doc = "\\usepackage{tikz}\n\\usepackage[compat=1.18]{pgfplots}";
    const found = detectPackages(doc);
    expect(found.has("tikz")).toBe(true);
    expect(found.has("pgfplots")).toBe(true);
  });

  it("returns empty set for empty preamble", () => {
    expect(detectPackages("\\begin{document}Hello\\end{document}").size).toBe(0);
  });
});

describe("computePreambleAdditions", () => {
  it("computes missing packages", () => {
    const { missing, lines } = computePreambleAdditions(["tikz", "pgfplots"], "\\usepackage{tikz}");
    expect(missing).toEqual(["pgfplots"]);
    expect(lines.some(l => l.includes("pgfplots"))).toBe(true);
  });

  it("returns nothing when all packages present", () => {
    const { missing } = computePreambleAdditions(["tikz"], "\\usepackage{tikz}");
    expect(missing).toHaveLength(0);
  });

  it("adds pgfplotsset when pgfplots is missing", () => {
    const { lines } = computePreambleAdditions(["pgfplots"], "");
    expect(lines.some(l => l.includes("pgfplotsset"))).toBe(true);
  });

  it("adds mhchem with version option", () => {
    const { lines } = computePreambleAdditions(["mhchem"], "");
    expect(lines.some(l => l.includes("[version=4]"))).toBe(true);
  });

  it("produces human-readable message for one missing package (plan §5.11)", () => {
    const { userMessage } = computePreambleAdditions(["circuitikz"], "");
    expect(userMessage).toContain("circuitikz");
    expect(userMessage).not.toContain("\\usepackage");
  });
});

describe("applyPreambleAdditions", () => {
  it("inserts before \\begin{document}", () => {
    const doc = "\\documentclass{article}\n\\begin{document}\n\\end{document}";
    const result = applyPreambleAdditions(doc, ["tikz"]);
    const tikzIdx = result.indexOf("\\usepackage{tikz}");
    const beginIdx = result.indexOf("\\begin{document}");
    expect(tikzIdx).toBeGreaterThan(-1);
    expect(tikzIdx).toBeLessThan(beginIdx);
  });

  it("is idempotent — does not duplicate", () => {
    const doc = "\\usepackage{tikz}\n\\begin{document}\\end{document}";
    const result = applyPreambleAdditions(doc, ["tikz"]);
    const count = (result.match(/\\usepackage\{tikz\}/g) ?? []).length;
    expect(count).toBe(1);
  });
});

// ── Figure Store ─────────────────────────────────────────────────────────────

describe("FigureStore", () => {
  let tmpDir: string;
  let store: FigureStore;

  beforeEach(() => {
    tmpDir = mkdtempSync(join(tmpdir(), "texisstudio-store-test-"));
    store = new FigureStore(tmpDir);
  });

  afterEach(() => {
    rmSync(tmpDir, { recursive: true, force: true });
  });

  const manifest: FigureManifest = {
    id: "fig_0001",
    pluginId: "visual-equations",
    pluginVersion: "1.0.0",
    engineId: "math-engine",
    title: "Test equation",
    preferredOutput: "latex",
    sourceFile: "source.json",
    latexFile: "output.tex",
    pdfFile: null, svgFile: null, previewFile: null,
    requiredPackages: ["amsmath"],
    createdAt: "2026-05-30T00:00:00Z",
    updatedAt: "2026-05-30T00:00:00Z",
    qualityLevel: "official-core",
    editable: true,
    warnings: [],
  };

  const source: EditableSource = {
    pluginId: "visual-equations",
    engineId: "math-engine",
    version: "1.0.0",
    data: { mode: "equation", tree: [{ type: "symbol", content: "E = mc^2" }] },
  };

  it("writes and reads a figure correctly", () => {
    store.write({ manifest, source, tex: "\\begin{equation}\n  E = mc^2\n\\end{equation}" });
    const loaded = store.load("fig_0001");
    expect(loaded).not.toBeNull();
    expect(loaded!.manifest.id).toBe("fig_0001");
    expect(loaded!.manifest.pluginId).toBe("visual-equations");
    expect(loaded!.source.engineId).toBe("math-engine");
    expect(loaded!.tex).toContain("E = mc^2");
  });

  it("exists() returns true after write, false before", () => {
    expect(store.exists("fig_0001")).toBe(false);
    store.write({ manifest, source });
    expect(store.exists("fig_0001")).toBe(true);
  });

  it("load returns null for unknown figure", () => {
    expect(store.load("fig_9999")).toBeNull();
  });

  it("refuses to write an invalid manifest", () => {
    expect(() => store.write({
      manifest: { ...manifest, id: "bad-id" },
      source,
    })).toThrow();
  });

  it("write is idempotent — second write updates the files", () => {
    store.write({ manifest, source, tex: "v1" });
    store.write({ manifest: { ...manifest, updatedAt: "2026-06-01T00:00:00Z" }, source, tex: "v2" });
    const loaded = store.load("fig_0001");
    expect(loaded!.tex).toBe("v2");
    expect(loaded!.manifest.updatedAt).toBe("2026-06-01T00:00:00Z");
  });
});
